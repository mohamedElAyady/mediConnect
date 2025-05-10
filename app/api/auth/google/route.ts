import { NextResponse } from "next/server";

export async function POST() {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

    // Define the scopes we want to request
    const scopes = [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" ");

    // Create the Google OAuth URL
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.append("client_id", clientId!);
    authUrl.searchParams.append("redirect_uri", redirectUri);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("scope", scopes);
    authUrl.searchParams.append("access_type", "offline"); // Request refresh token
    authUrl.searchParams.append("prompt", "consent"); // Force consent screen to get refresh token

    return NextResponse.json({ url: authUrl.toString() });
  } catch (error) {
    console.error("Google OAuth Error:", error);
    return NextResponse.json(
      { error: "Failed to initiate Google sign in" },
      { status: 500 }
    );
  }
} 