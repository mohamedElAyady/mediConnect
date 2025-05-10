import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, event } = await req.json();

    // Get user's Google OAuth credentials from your database
    // This is where you'd fetch the stored access token and refresh token
    const credentials = {
      access_token: 'YOUR_ACCESS_TOKEN', // Get this from your database
      refresh_token: 'YOUR_REFRESH_TOKEN', // Get this from your database
    };

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials(credentials);

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    switch (action) {
      case 'create':
        const response = await calendar.events.insert({
          calendarId: 'primary',
          requestBody: event,
        });
        return NextResponse.json(response.data);

      case 'list':
        const events = await calendar.events.list({
          calendarId: 'primary',
          timeMin: new Date().toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: 'startTime',
        });
        return NextResponse.json(events.data);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Calendar API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 