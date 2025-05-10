import { clerkClient } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export async function getGoogleAccessToken() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      console.error("No authenticated user");
      return null;
    }
    
    const tokens = await clerkClient.users.getUserOauthAccessToken(userId, "oauth_google");
    
    if (!tokens || tokens.length === 0) {
      console.error("No Google OAuth tokens available");
      return null;
    }
    
    return tokens[0].token;
  } catch (error) {
    console.error("Error getting Google access token:", error);
    return null;
  }
}

export async function listCalendarEvents() {
  const accessToken = await getGoogleAccessToken();
  
  if (!accessToken) {
    return { success: false, error: "Could not get access token" };
  }
  
  try {
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, events: data.items };
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return { success: false, error: "Failed to fetch calendar events" };
  }
}

export async function sendEmail(to: string, subject: string, body: string) {
  const accessToken = await getGoogleAccessToken();
  
  if (!accessToken) {
    return { success: false, error: "Could not get access token" };
  }
  
  try {
    const email = [
      'Content-Type: text/plain; charset="UTF-8"\n',
      'MIME-Version: 1.0\n',
      `To: ${to}\n`,
      `Subject: ${subject}\n\n`,
      body
    ].join('');

    const encodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const response = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: encodedEmail,
        }),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Gmail API error: ${response.status}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Failed to send email" };
  }
} 