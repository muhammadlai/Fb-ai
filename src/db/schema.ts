import { pgTable, text, timestamp, integer, boolean, json, real } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  role: text("role").default("user").notNull(), // 'user' | 'admin'
  facebookId: text("facebook_id"),
  subscriptionTier: text("subscription_tier").default("free").notNull(), // 'free' | 'pro' | 'premium'
  subscriptionStatus: text("subscription_status").default("active").notNull(), // 'active' | 'canceled' | 'past_due'
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  aiCreditsUsed: integer("ai_credits_used").default(0).notNull(),
  aiCreditsLimit: integer("ai_credits_limit").default(50).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workspaces = pgTable("workspaces", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  ownerId: text("owner_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  plan: text("plan").default("free").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workspaceMembers = pgTable("workspace_members", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  role: text("role").default("editor").notNull(), // 'owner' | 'admin' | 'editor' | 'viewer'
  invitedEmail: text("invited_email"),
  status: text("status").default("active").notNull(), // 'active' | 'pending'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const connectedAccounts = pgTable("connected_accounts", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  platform: text("platform").notNull(), // 'facebook_page' | 'facebook_group' | 'instagram' | 'linkedin' | 'twitter'
  platformId: text("platform_id").notNull(),
  name: text("name").notNull(),
  username: text("username"),
  avatarUrl: text("avatar_url"),
  category: text("category"),
  followersCount: integer("followers_count").default(0),
  encryptedAccessToken: text("encrypted_access_token").notNull(),
  tokenExpiresAt: timestamp("token_expires_at"),
  status: text("status").default("connected").notNull(), // 'connected' | 'expired' | 'error'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const queueSchedules = pgTable("queue_schedules", {
  id: text("id").primaryKey(),
  connectedAccountId: text("connected_account_id").references(() => connectedAccounts.id, { onDelete: "cascade" }).notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sun, 1 = Mon, ..., 6 = Sat
  timeSlot: text("time_slot").notNull(), // e.g., "09:00", "14:30"
  isEnabled: boolean("is_enabled").default(true).notNull(),
});

export const posts = pgTable("posts", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  authorId: text("author_id").references(() => users.id, { onDelete: "set null" }),
  connectedAccountId: text("connected_account_id").references(() => connectedAccounts.id, { onDelete: "cascade" }).notNull(),
  content: text("content").notNull(),
  mediaUrls: json("media_urls").$type<string[]>().default([]),
  mediaType: text("media_type").default("none").notNull(), // 'none' | 'image' | 'video' | 'carousel'
  status: text("status").default("draft").notNull(), // 'draft' | 'scheduled' | 'queued' | 'publishing' | 'published' | 'failed' | 'pending_approval'
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  externalPostId: text("external_post_id"),
  hashtags: json("hashtags").$type<string[]>().default([]),
  aiGenerated: boolean("ai_generated").default(false),
  aiTone: text("ai_tone"),
  reviewNotes: text("review_notes"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const postAnalytics = pgTable("post_analytics", {
  id: text("id").primaryKey(),
  postId: text("post_id").references(() => posts.id, { onDelete: "cascade" }).notNull(),
  impressions: integer("impressions").default(0).notNull(),
  reach: integer("reach").default(0).notNull(),
  likes: integer("likes").default(0).notNull(),
  comments: integer("comments").default(0).notNull(),
  shares: integer("shares").default(0).notNull(),
  clicks: integer("clicks").default(0).notNull(),
  engagementRate: real("engagement_rate").default(0.0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").default("system").notNull(), // 'post_published' | 'post_failed' | 'approval_required' | 'team_invite' | 'system'
  isRead: boolean("is_read").default(false).notNull(),
  link: text("link"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const metaAppSettings = pgTable("meta_app_settings", {
  id: text("id").primaryKey(),
  appId: text("app_id"),
  encryptedAppSecret: text("encrypted_app_secret"),
  webhookVerifyToken: text("webhook_verify_token"),
  environment: text("environment").default("sandbox").notNull(), // 'sandbox' | 'live'
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const systemLogs = pgTable("system_logs", {
  id: text("id").primaryKey(),
  level: text("level").default("info").notNull(), // 'info' | 'warn' | 'error'
  category: text("category").notNull(), // 'meta_api' | 'auth' | 'stripe' | 'post_scheduler' | 'ai'
  message: text("message").notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
