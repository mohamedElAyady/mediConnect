import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      throw new Error(`OAuth error: ${error}`);
    }

    if (!code) {
      throw new Error("No authorization code received");
    }

    // Exchange the code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Token exchange error:", errorData);
      throw new Error("Failed to exchange code for tokens");
    }

    const tokens = await tokenResponse.json();
    console.log("Received tokens:", {
      access_token: tokens.access_token?.slice(0, 10) + "...",
      refresh_token: tokens.refresh_token ? "present" : "missing",
    });

    // Get user info
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      throw new Error("Failed to get user info");
    }

    const userInfo = await userInfoResponse.json();

    // Here you would:
    // 1. Create or update the user in your database
    // 2. Store the tokens securely
    // 3. Create a session for the user

    // For now, we'll just redirect to the home page
    return redirect("/");
  } catch (error) {
    console.error("OAuth Callback Error:", error);
    return redirect("/?error=oauth_failed");
  }
} 