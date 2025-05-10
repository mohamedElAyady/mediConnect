import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Your Google OAuth credentials
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

// Validate required environment variables
if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
  console.error('Missing required environment variables:', {
    hasClientId: !!CLIENT_ID,
    hasClientSecret: !!CLIENT_SECRET,
    hasRedirectUri: !!REDIRECT_URI
  });
}

// Scopes for Google Calendar and Gmail
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

// Create OAuth2 client
const oauth2Client = new OAuth2Client(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Custom error classes
class GetCredentialsException extends Error {
  authorization_url: string;
  constructor(authorization_url: string) {
    super('Error retrieving credentials');
    this.authorization_url = authorization_url;
  }
}

class CodeExchangeException extends GetCredentialsException {
  constructor(authorization_url: string) {
    super(authorization_url);
    this.name = 'CodeExchangeException';
  }
}

class NoRefreshTokenException extends GetCredentialsException {
  constructor(authorization_url: string) {
    super(authorization_url);
    this.name = 'NoRefreshTokenException';
  }
}

// Generate authorization URL
export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Log the configuration (without sensitive data)
    console.log('OAuth Configuration:', {
      redirectUri: REDIRECT_URI,
      scopes: SCOPES,
      hasClientId: !!CLIENT_ID,
      hasClientSecret: !!CLIENT_SECRET
    });

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent', // Force to get refresh token
      state: userId, // Pass the user ID as state
    });

    return NextResponse.json({ url: authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate authorization URL',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle OAuth callback
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code provided' },
      { status: 400 }
    );
  }

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    });

    const userInfo = await oauth2.userinfo.get();

    // Here you would typically:
    // 1. Store the tokens in your database
    // 2. Associate them with the user
    // 3. Create a session

    // For now, we'll just return the tokens and user info
    return NextResponse.json({
      tokens,
      user: userInfo.data,
    });
  } catch (error) {
    console.error('Error exchanging code:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }

    return NextResponse.json(
      { 
        error: 'Failed to exchange authorization code',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 