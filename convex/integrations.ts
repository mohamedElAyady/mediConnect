import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

// Get user's integrations
export const getUserIntegrations = query({
  args: {
    userId: v.id("users"),
  }, 
  handler: async (ctx, args) => {
    const integrations = await ctx.db
      .query("integrations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return integrations;
  },
});

// Get specific integration by type
export const getIntegrationByType = query({
  args: {
    userId: v.id("users"),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const integration = await ctx.db
      .query("integrations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("type"), args.type))
      .first();

    return integration;
  },
});

// Create or update integration
export const upsertIntegration = mutation({
  args: {
    userId: v.id("users"),
    type: v.string(),
    isConnected: v.boolean(),
    credentials: v.object({
      clientId: v.optional(v.string()),
      clientSecret: v.optional(v.string()),
      email: v.optional(v.string()),
      appPassword: v.optional(v.string()),
      accessToken: v.optional(v.string()),
      refreshToken: v.optional(v.string()),
      tokenType: v.optional(v.string()),
      expiryDate: v.optional(v.number()),
      scope: v.optional(v.string()),
      providerId: v.optional(v.string()),
    }),
    settings: v.optional(v.object({
      syncAppointments: v.optional(v.boolean()),
      sendReminders: v.optional(v.boolean()),
      reminderTime: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const { userId, type, ...rest } = args;

    // Check if integration already exists
    const existingIntegration = await ctx.db
      .query("integrations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("type"), type))
      .first();

    if (existingIntegration) {
      // Update existing integration
      await ctx.db.patch(existingIntegration._id, {
        ...rest,
        lastSynced: new Date().toISOString(),
      });
      return existingIntegration._id;
    } else {
      // Create new integration
      const integrationId = await ctx.db.insert("integrations", {
        userId,
        type,
        ...rest,
        lastSynced: new Date().toISOString(),
      });
      return integrationId;
    }
  },
});

// Delete integration
export const deleteIntegration = mutation({
  args: {
    userId: v.id("users"),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const integration = await ctx.db
      .query("integrations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("type"), args.type))
      .first();

    if (!integration) {
      throw new Error("Integration not found");
    }

    await ctx.db.delete(integration._id);
    return integration._id;
  },
});

// Update integration settings
export const updateIntegrationSettings = mutation({
  args: {
    userId: v.id("users"),
    type: v.string(),
    settings: v.object({
      syncAppointments: v.optional(v.boolean()),
      sendReminders: v.optional(v.boolean()),
      reminderTime: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const integration = await ctx.db
      .query("integrations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("type"), args.type))
      .first();

    if (!integration) {
      throw new Error("Integration not found");
    }

    await ctx.db.patch(integration._id, {
      settings: args.settings,
    });

    return integration._id;
  },
});

export const storeGoogleIntegration = mutation({
  args: {
    userId: v.id("users"),
    accessToken: v.string(),
    refreshToken: v.string(),
    tokenType: v.string(),
    expiryDate: v.number(),
    scope: v.string(),
    email: v.string(),
    googleId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, accessToken, refreshToken, tokenType, expiryDate, scope, email, googleId } = args;

    // Check if integration already exists
    const existingIntegration = await ctx.db
      .query("integrations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("type"), "google"))
      .first();

    if (existingIntegration) {
      // Update existing integration
      await ctx.db.patch(existingIntegration._id, {
        type: "google",
        isConnected: true,
        credentials: {
          email,
          accessToken,
          refreshToken,
          tokenType,
          expiryDate,
          scope,
          providerId: googleId
        },
      });
      return existingIntegration._id;
    }

    // Store new integration data
    const integrationId = await ctx.db.insert("integrations", {
      userId,
      type: "google",
      isConnected: true,
      credentials: {
        email,
        accessToken,
        refreshToken,
        tokenType,
        expiryDate,
        scope,
        providerId: googleId
      } 
    });

    return integrationId;
  },
});

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface GoogleErrorResponse {
  error: string;
  error_description: string;
}

export const refreshGoogleToken = action({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<{ accessToken: string; expiryDate: number }> => {
    const integration = await ctx.runQuery(api.integrations.getIntegrationByType, {
      userId: args.userId,
      type: "google"
    });

    if (!integration || !integration.credentials?.refreshToken) {
      throw new Error("No Google integration found or missing refresh token");
    }

    try {
      console.log("Attempting to refresh token for user:", args.userId);
      
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          refresh_token: integration.credentials.refreshToken,
          grant_type: "refresh_token",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as GoogleErrorResponse;
        console.error("Token refresh failed:", {
          status: response.status,
          error: errorData.error,
          description: errorData.error_description
        });
        throw new Error(`Failed to refresh token: ${errorData.error_description || errorData.error}`);
      }

      const tokens = data as GoogleTokenResponse;
      console.log("Token refresh successful");

      // Update the integration with new tokens
      await ctx.runMutation(api.integrations.upsertIntegration, {
        userId: args.userId,
        type: "google",
        isConnected: true,
        credentials: {
          ...integration.credentials,
          accessToken: tokens.access_token,
          expiryDate: Date.now() + tokens.expires_in * 1000,
        },
      });

      return {
        accessToken: tokens.access_token,
        expiryDate: Date.now() + tokens.expires_in * 1000,
      };
    } catch (error) {
      console.error("Error refreshing token:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to refresh Google token: ${error.message}`);
      }
      throw new Error("Failed to refresh Google token");
    }
  },
}); 