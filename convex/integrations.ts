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
    // Update isPublished status after integration deletion
    await ctx.runMutation(api.users.updateIsPublished, {
      userId: args.userId
    });
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
      // Update isPublished status after successful integration
      await ctx.runMutation(api.users.updateIsPublished, {
        userId: userId
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

    // Update isPublished status after successful integration
    await ctx.runMutation(api.users.updateIsPublished, {
      userId: userId
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

interface GoogleCalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: Array<{
    email: string;
  }>;
  conferenceData?: {
    createRequest: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      };
    };
  };
}

export const createGoogleCalendarEvent = action({
  args: {
    userId: v.id("users"),
    appointment: v.object({
      patientId: v.string(),
      doctorId: v.string(),
      date: v.string(),
      time: v.string(),
      type: v.string(),
      duration: v.string(),
      reason: v.string(),
      patientEmail: v.string(),
      patientName: v.string(),
      doctorEmail: v.string(),
      doctorName: v.string(),
      appointmentId: v.id("appointments"),
    }),
  },
  handler: async (ctx, args): Promise<{ eventId: string; meetingLink?: string }> => {
    const integration = await ctx.runQuery(api.integrations.getIntegrationByType, {
      userId: args.userId,
      type: "google"
    });

    if (!integration?.credentials?.accessToken) {
      throw new Error("No Google Calendar integration found");
    }

    try {
      // Check if token is expired
      const isExpired = Date.now() >= (integration.credentials.expiryDate || 0);

      // Refresh token if expired
      let accessToken = integration.credentials.accessToken;
      if (isExpired) {
        const { accessToken: newToken } = await ctx.runAction(api.integrations.refreshGoogleToken, {
          userId: args.userId
        });
        accessToken = newToken;
      }

      // Parse date and time
      const [hours, minutes] = args.appointment.time.split(":");
      const appointmentDate = new Date(args.appointment.date);
      
      if (isNaN(appointmentDate.getTime())) {
        throw new Error(`Invalid date format: ${args.appointment.date}`);
      }
      
      const parsedHours = parseInt(hours);
      const parsedMinutes = parseInt(minutes);
      
      if (isNaN(parsedHours) || isNaN(parsedMinutes)) {
        throw new Error(`Invalid time format: ${args.appointment.time}`);
      }
      
      // Set the time in local timezone
      const localDate = new Date(appointmentDate);
      localDate.setHours(parsedHours, parsedMinutes, 0, 0);

      // Calculate end time based on duration
      const endDate = new Date(localDate);
      let durationMinutes = 0;
      
      if (args.appointment.duration.includes(":")) {
        const [durationHours, durationMinutesStr] = args.appointment.duration.split(":");
        durationMinutes = parseInt(durationHours) * 60 + parseInt(durationMinutesStr);
      } else {
        durationMinutes = parseInt(args.appointment.duration);
      }
      
      if (isNaN(durationMinutes)) {
        throw new Error(`Invalid duration format: ${args.appointment.duration}`);
      }
      
      endDate.setMinutes(endDate.getMinutes() + durationMinutes);

      // Format dates in local timezone
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      };

      const timeZone = "Africa/Casablanca";

      console.log("TimeZone:", timeZone);
      console.log("Start (local):", localDate.toString());
      console.log("Parsed dates:", {
        start: formatDate(localDate),
        end: formatDate(endDate)
      });

      const event: GoogleCalendarEvent = {
        summary: `Medical Appointment: ${args.appointment.patientName}`,
        description: `Reason: ${args.appointment.reason}\nType: ${args.appointment.type}`,
        start: {
          dateTime: formatDate(localDate),
          timeZone: timeZone,
        },
        end: {
          dateTime: formatDate(endDate),
          timeZone: timeZone,
        },
        attendees: [
          { email: args.appointment.patientEmail },
          { email: args.appointment.doctorEmail },
        ],
      };

      // Add conference data for video appointments
      if (args.appointment.type === "video") {
        event.conferenceData = {
          createRequest: {
            requestId: `${args.appointment.patientId}-${Date.now()}`,
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            }
          },
        };
      }

      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create calendar event: ${errorData.error?.message || "Unknown error"}`);
      }

      const createdEvent = await response.json();
      console.log("Google Calendar API Response:", createdEvent);
      
      // Update appointment with meeting link if it's a video consultation
      if (args.appointment.type === "video") {
        const meetingLink = createdEvent.hangoutLink || createdEvent.conferenceData?.entryPoints?.[0]?.uri;
        if (meetingLink) {
          await ctx.runMutation(api.appointments.updateAppointment, {
            id: args.appointment.appointmentId,
            meetingLink,
          });
        } else {
          console.error("No meeting link found in response:", createdEvent);
        }
      }

      return {
        eventId: createdEvent.id,
        meetingLink: createdEvent.hangoutLink || createdEvent.conferenceData?.entryPoints?.[0]?.uri,
      };
    } catch (error) {
      console.error("Error creating calendar event:", error);
      throw new Error("Failed to create calendar event");
    }
  },
}); 