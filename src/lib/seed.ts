import { db } from "@/db";
import { users, workspaces, workspaceMembers, connectedAccounts, posts, postAnalytics, queueSchedules, notifications, metaAppSettings } from "@/db/schema";
import { encryptToken } from "./encryption";
import { hashPassword } from "./auth";
import { eq } from "drizzle-orm";

export async function seedDatabaseIfEmpty() {
  try {
    const existingUsers = await db.select().from(users);
    if (existingUsers.length > 0) {
      return; // Database already has data
    }

    console.log("🌱 Seeding initial demo data...");

    // 1. Create Main Admin / Demo User
    const demoUserId = "usr_demo_admin_2026";
    const passHash = hashPassword("password123");

    await db.insert(users).values({
      id: demoUserId,
      email: "demo@socialai.com",
      passwordHash: passHash,
      name: "Alex Rivera",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
      role: "admin",
      subscriptionTier: "pro",
      subscriptionStatus: "active",
      aiCreditsUsed: 12,
      aiCreditsLimit: 500,
    });

    // 2. Create Default Workspace
    const workspaceId = "ws_primary_001";
    await db.insert(workspaces).values({
      id: workspaceId,
      name: "Acme Brand Global",
      ownerId: demoUserId,
      plan: "pro",
    });

    await db.insert(workspaceMembers).values({
      id: "wm_001",
      workspaceId,
      userId: demoUserId,
      role: "owner",
      status: "active",
    });

    // Team members
    const teamUser2 = "usr_team_sarah";
    await db.insert(users).values({
      id: teamUser2,
      email: "sarah.marketing@acme.com",
      name: "Sarah Chen",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
      role: "user",
      subscriptionTier: "pro",
    });

    await db.insert(workspaceMembers).values({
      id: "wm_002",
      workspaceId,
      userId: teamUser2,
      role: "editor",
      status: "active",
    });

    // 3. Create Connected Accounts
    const account1Id = "acc_fb_page_1";
    const account2Id = "acc_ig_biz_2";
    const account3Id = "acc_linkedin_3";

    await db.insert(connectedAccounts).values([
      {
        id: account1Id,
        workspaceId,
        platform: "facebook_page",
        platformId: "fb_page_101",
        name: "Acme Tech Official Page",
        username: "acmetech.official",
        category: "Technology & Software",
        avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop&q=80",
        followersCount: 24500,
        encryptedAccessToken: encryptToken("EAAG_MOCK_PAGE_TOKEN_ACME"),
        status: "connected",
      },
      {
        id: account2Id,
        workspaceId,
        platform: "instagram",
        platformId: "ig_page_202",
        name: "Acme Design Lab",
        username: "@acme.designlab",
        category: "Creative Agency",
        avatarUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop&q=80",
        followersCount: 18900,
        encryptedAccessToken: encryptToken("EAAG_MOCK_IG_TOKEN_ACME"),
        status: "connected",
      },
      {
        id: account3Id,
        workspaceId,
        platform: "linkedin",
        platformId: "li_page_303",
        name: "Acme Corp LinkedIn",
        username: "company/acmecorp",
        category: "Enterprise Software",
        avatarUrl: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&h=150&fit=crop&q=80",
        followersCount: 42100,
        encryptedAccessToken: encryptToken("EAAG_MOCK_LI_TOKEN_ACME"),
        status: "connected",
      },
    ]);

    // 4. Create Queue Schedules
    const defaultTimeSlots = ["09:00", "13:30", "17:00"];
    let queueIdx = 1;

    for (let day = 0; day <= 6; day++) {
      for (const slot of defaultTimeSlots) {
        await db.insert(queueSchedules).values({
          id: `qs_${queueIdx++}`,
          connectedAccountId: account1Id,
          dayOfWeek: day,
          timeSlot: slot,
          isEnabled: day !== 0 && day !== 6, // Enable weekdays by default
        });
      }
    }

    // 5. Create Posts (Published, Scheduled, Queued, Drafts, Pending Approval)
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 3600 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 3600 * 1000);
    const in3Days = new Date(now.getTime() + 3 * 24 * 3600 * 1000);
    const in5Days = new Date(now.getTime() + 5 * 24 * 3600 * 1000);

    const post1Id = "post_pub_101";
    await db.insert(posts).values({
      id: post1Id,
      workspaceId,
      authorId: demoUserId,
      connectedAccountId: account1Id,
      content: "🚀 We are thrilled to announce our AI-Powered Social Dashboard launch! Manage Facebook Pages, Instagram, and LinkedIn seamlessly with predictive analytics. #SaaS #AIMarketing #Productivity",
      mediaUrls: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&fit=crop&q=80"],
      mediaType: "image",
      status: "published",
      publishedAt: yesterday,
      hashtags: ["#SaaS", "#AIMarketing", "#Productivity"],
      aiGenerated: true,
      aiTone: "engaging",
    });

    await db.insert(postAnalytics).values({
      id: "pa_101",
      postId: post1Id,
      impressions: 4820,
      reach: 3950,
      likes: 312,
      comments: 48,
      shares: 23,
      clicks: 184,
      engagementRate: 7.2,
    });

    const post2Id = "post_sch_102";
    await db.insert(posts).values({
      id: post2Id,
      workspaceId,
      authorId: demoUserId,
      connectedAccountId: account1Id,
      content: "💡 5 Social Media Growth Strategies for 2026: 1. Video-first content. 2. AI caption optimization. 3. Active community replies. What is your #1 strategy this quarter?",
      mediaUrls: ["https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&fit=crop&q=80"],
      mediaType: "image",
      status: "scheduled",
      scheduledAt: tomorrow,
      hashtags: ["#GrowthStrategy", "#SocialMediaTips"],
      aiGenerated: true,
      aiTone: "educational",
    });

    await db.insert(posts).values({
      id: "post_que_103",
      workspaceId,
      authorId: teamUser2,
      connectedAccountId: account2Id,
      content: "Behind the scenes at Acme Design Studio! 🎨 Crafting intuitive UI patterns for next-gen social platforms. Tap link in bio to learn more! #DesignInspiration #UIUX",
      mediaUrls: ["https://images.unsplash.com/photo-1542744094-3a3121695503?w=800&fit=crop&q=80"],
      mediaType: "image",
      status: "queued",
      scheduledAt: in3Days,
      hashtags: ["#DesignInspiration", "#UIUX"],
      aiGenerated: false,
    });

    await db.insert(posts).values({
      id: "post_app_104",
      workspaceId,
      authorId: teamUser2,
      connectedAccountId: account3Id,
      content: "Quarterly Enterprise Update: Revenue up 42% YoY with over 5,000 active agency partners on our network. Thank you to our amazing community! 🏆",
      mediaUrls: [],
      mediaType: "none",
      status: "pending_approval",
      scheduledAt: in5Days,
      hashtags: ["#Enterprise", "#CompanyNews"],
      reviewNotes: "Please review the financial figures before publishing.",
    });

    await db.insert(posts).values({
      id: "post_dft_105",
      workspaceId,
      authorId: demoUserId,
      connectedAccountId: account1Id,
      content: "Drafting our upcoming feature roadmap highlight... [Add image teaser]",
      mediaUrls: [],
      mediaType: "none",
      status: "draft",
    });

    // 6. Create System & Meta Settings
    await db.insert(metaAppSettings).values({
      id: "meta_cfg_default",
      appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "782910384759201",
      encryptedAppSecret: encryptToken(process.env.FACEBOOK_APP_SECRET || "meta_secret_demo_key"),
      webhookVerifyToken: "socialai_verify_token_2026",
      environment: "sandbox",
    });

    // 7. Notifications
    await db.insert(notifications).values([
      {
        id: "notif_001",
        userId: demoUserId,
        title: "Post Published Successfully",
        message: "Your post '🚀 We are thrilled to announce...' was published to Acme Tech Official Page.",
        type: "post_published",
        isRead: false,
        link: "/dashboard/posts",
      },
      {
        id: "notif_002",
        userId: demoUserId,
        title: "Approval Required",
        message: "Sarah Chen submitted a new post for Acme Corp LinkedIn requiring your approval.",
        type: "approval_required",
        isRead: false,
        link: "/dashboard/queue",
      },
    ]);

    console.log("✅ Seed completed successfully.");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}
