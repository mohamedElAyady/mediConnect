import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;

// Initialize Convex client
const convex = new ConvexHttpClient(CONVEX_URL);

// Log configuration (without sensitive data)
console.log('OAuth Configuration:', {
  redirectUri: REDIRECT_URI,
  hasClientId: !!CLIENT_ID,
  hasClientSecret: !!CLIENT_SECRET,
  baseUrl: BASE_URL
});

const oauth2Client = new OAuth2Client(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const clerkUserId = searchParams.get("state");

    if (!code || !clerkUserId) {
      console.error("Missing code or state parameter");
      return NextResponse.redirect(`${BASE_URL}/doctor/settings?error=missing_parameters`);
    }

    // Get the Convex user ID using the Clerk user ID
    const convexUser = await convex.query(api.users.getUserByClerkId, { clerkId: clerkUserId });
    
    if (!convexUser) {
      console.error("No Convex user found for Clerk ID:", clerkUserId);
      return NextResponse.redirect(`${BASE_URL}/doctor/settings?error=user_not_found`);
    }

    // Exchange the code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    if (!userInfo.email || !userInfo.id) {
      throw new Error("Failed to get user info from Google");
    }

    // Store the integration data
    await convex.mutation(api.integrations.storeGoogleIntegration, {
      userId: convexUser._id,
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token!,
      tokenType: tokens.token_type!,
      expiryDate: tokens.expiry_date!,
      scope: tokens.scope!,
      email: userInfo.email,
      googleId: userInfo.id,
    });

    return NextResponse.redirect(`${BASE_URL}/doctor/settings?success=true`);
  } catch (error) {
    console.error("Error in Google callback:", error);
    return NextResponse.redirect(`${BASE_URL}/doctor/settings?error=integration_failed`);
  }
} 