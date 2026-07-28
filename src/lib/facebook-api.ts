import { decryptToken } from "./encryption";

export interface FacebookProfile {
  id: string;
  name?: string;
  email?: string;
  picture?: {
    data?: {
      url?: string;
    };
  };
}

export interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  category?: string;
  tasks?: string[];
  picture?: {
    data?: {
      url?: string;
    };
  };
  fan_count?: number;
  username?: string;
}

export interface PostPublishResult {
  id: string;
  success: boolean;
  error?: string;
}

function facebookErrorMessage(data: unknown, fallback: string) {
  if (
    data &&
    typeof data === "object" &&
    "error" in data &&
    data.error &&
    typeof data.error === "object" &&
    "message" in data.error &&
    typeof data.error.message === "string"
  ) {
    return data.error.message;
  }
  return fallback;
}

async function readGraphJson<T>(res: Response, fallback: string): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok || (data && typeof data === "object" && "error" in data)) {
    throw new Error(facebookErrorMessage(data, fallback));
  }
  return data as T;
}

export class FacebookGraphAPI {
  private apiVersion = "v19.0";
  private baseUrl = "https://graph.facebook.com/v19.0";

  constructor(private appId?: string, private appSecret?: string) {}

  private requireAppCredentials() {
    if (!this.appId || !this.appSecret) {
      throw new Error("Facebook OAuth is not configured. Set AUTH_FACEBOOK_ID and AUTH_FACEBOOK_SECRET in production.");
    }
  }

  /** Generates the official Facebook OAuth URL for Page permissions. */
  getOAuthUrl(redirectUri: string, state?: string): string {
    if (!this.appId) {
      throw new Error("Facebook App ID is missing. Set AUTH_FACEBOOK_ID in production.");
    }

    const scopes = [
      "public_profile",
      "email",
      "pages_show_list",
      "pages_read_engagement",
      "pages_manage_posts",
    ].join(",");

    const params = new URLSearchParams({
      client_id: this.appId,
      redirect_uri: redirectUri,
      scope: scopes,
      response_type: "code",
      auth_type: "rerequest",
      state: state || crypto.randomUUID(),
    });

    return `https://www.facebook.com/${this.apiVersion}/dialog/oauth?${params.toString()}`;
  }

  /** Exchanges a short-lived Facebook user token for a long-lived user token. */
  async exchangeShortLivedTokenForLongLived(accessToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    this.requireAppCredentials();

    const url = `${this.baseUrl}/oauth/access_token?${new URLSearchParams({
      grant_type: "fb_exchange_token",
      client_id: this.appId!,
      client_secret: this.appSecret!,
      fb_exchange_token: accessToken,
    })}`;

    const data = await readGraphJson<{ access_token?: string; expires_in?: number }>(
      await fetch(url),
      "Failed to exchange Facebook access token"
    );

    return {
      accessToken: data.access_token || accessToken,
      expiresIn: data.expires_in || 60 * 24 * 60 * 60,
    };
  }

  /** Exchanges an OAuth code for a long-lived user access token. */
  async exchangeCodeForToken(code: string, redirectUri: string): Promise<{ accessToken: string; expiresIn: number }> {
    this.requireAppCredentials();

    const tokenUrl = `${this.baseUrl}/oauth/access_token?${new URLSearchParams({
      client_id: this.appId!,
      client_secret: this.appSecret!,
      redirect_uri: redirectUri,
      code,
    })}`;

    const shortData = await readGraphJson<{ access_token?: string; expires_in?: number }>(
      await fetch(tokenUrl),
      "Failed to exchange Facebook OAuth code"
    );

    if (!shortData.access_token) {
      throw new Error("Facebook did not return an access token.");
    }

    return this.exchangeShortLivedTokenForLongLived(shortData.access_token);
  }

  /** Fetches the authenticated Facebook user's profile from Graph API. */
  async getUserProfile(userAccessToken: string): Promise<FacebookProfile> {
    const url = `${this.baseUrl}/me?${new URLSearchParams({
      fields: "id,name,email,picture.type(large){url}",
      access_token: userAccessToken,
    })}`;

    return readGraphJson<FacebookProfile>(await fetch(url), "Failed to fetch Facebook profile");
  }

  /** Retrieves Facebook Pages managed by the authenticated user. */
  async getUserPages(userAccessToken: string): Promise<FacebookPage[]> {
    const url = `${this.baseUrl}/me/accounts?${new URLSearchParams({
      fields: "id,name,access_token,category,fan_count,username,picture{url},tasks",
      access_token: userAccessToken,
    })}`;

    const data = await readGraphJson<{ data?: FacebookPage[] }>(
      await fetch(url),
      "Failed to fetch Facebook Pages. Confirm pages_show_list and pages_read_engagement permissions are approved."
    );

    return data.data || [];
  }

  /** Publishes a post to a Facebook Page via Graph API. */
  async publishToPage(
    encryptedPageToken: string,
    pageId: string,
    postData: {
      content: string;
      mediaUrls?: string[];
      mediaType?: string;
      scheduledAt?: Date | null;
    }
  ): Promise<PostPublishResult> {
    const pageAccessToken = decryptToken(encryptedPageToken);

    try {
      let endpoint = `${this.baseUrl}/${pageId}/feed`;
      const body: Record<string, string> = {
        message: postData.content,
        access_token: pageAccessToken,
      };

      if (postData.scheduledAt) {
        const timestampInSeconds = Math.floor(postData.scheduledAt.getTime() / 1000);
        body.published = "false";
        body.scheduled_publish_time = String(timestampInSeconds);
      }

      if (postData.mediaType === "image" && postData.mediaUrls?.[0]) {
        endpoint = `${this.baseUrl}/${pageId}/photos`;
        body.url = postData.mediaUrls[0];
        body.caption = postData.content;
        delete body.message;
      } else if (postData.mediaType === "video" && postData.mediaUrls?.[0]) {
        endpoint = `${this.baseUrl}/${pageId}/videos`;
        body.file_url = postData.mediaUrls[0];
        body.description = postData.content;
        delete body.message;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(body).toString(),
      });

      const result = await readGraphJson<{ id?: string; post_id?: string }>(res, "Facebook API publication failed");

      return {
        id: result.id || result.post_id || "",
        success: true,
      };
    } catch (err) {
      return {
        id: "",
        success: false,
        error: err instanceof Error ? err.message : "Failed to communicate with Meta Graph API",
      };
    }
  }

  /** Fetches Insights metrics for a published post. */
  async getPostInsights(encryptedPageToken: string, postId: string) {
    const pageAccessToken = decryptToken(encryptedPageToken);

    const url = `${this.baseUrl}/${postId}/insights?${new URLSearchParams({
      metric: "post_impressions_unique,post_engaged_users,post_clicks,post_reactions_by_type_total",
      access_token: pageAccessToken,
    })}`;

    const data = await readGraphJson<{
      data?: Array<{ values?: Array<{ value?: number | Record<string, number> }> }>;
    }>(await fetch(url), "Failed to fetch Facebook post insights");

    const reactions = data.data?.[3]?.values?.[0]?.value;

    return {
      impressions: Number(data.data?.[0]?.values?.[0]?.value || 0),
      reach: Number(data.data?.[1]?.values?.[0]?.value || 0),
      likes: typeof reactions === "object" ? reactions.like || 0 : 0,
      comments: 0,
      shares: 0,
      clicks: Number(data.data?.[2]?.values?.[0]?.value || 0),
      engagementRate: 0,
    };
  }
}
