import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from '@clerk/backend'

export async function GET() {
  try {
    const { userId, sessionId } = await auth();

    if (!userId) {
      return NextResponse.json({
        error: "Not authenticated",
        details: "No user ID found in the session",
        sessionId: sessionId || "No session ID"
      }, { status: 401 });
    }

    console.log("Testing Google token for user:", userId);
    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
    
    try {
      const response = await clerkClient.users.getUserOauthAccessToken(userId, "google");
      console.log("response : ", response);

      if (!response || response.length === 0) {
        return NextResponse.json({
          error: "No Google tokens found",
          details: "User is authenticated but has no Google OAuth tokens",
          userId,
          sessionId
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        hasTokens: true,
        scopes: response[0].scopes,
        userId,
        sessionId,
      });
    } catch (tokenError) {
      console.error("Error fetching OAuth token:", tokenError);
      return NextResponse.json({
        error: "Failed to fetch OAuth token",
        details: tokenError instanceof Error ? tokenError.message : "Unknown error",
        userId,
        sessionId
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Error testing Google token:", error);

  }
} 