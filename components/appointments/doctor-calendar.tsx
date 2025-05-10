"use client"

import { useEffect, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { useQuery, useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Calendar as CalendarIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Id } from "@/convex/_generated/dataModel"

interface GoogleCalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor?: string
  borderColor?: string
}

export function DoctorCalendar() {
  const { user } = useUser()
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get the Convex user ID first
  const convexUser = useQuery(api.users.getUserByClerkId, { clerkId: user?.id as string })

  // Get Google Calendar integration
  const integrations = useQuery(api.integrations.getUserIntegrations, {
    userId: convexUser?._id as Id<"users">,
  })
  const googleCalendarIntegration = integrations?.find(i => i.type === "google")
  const refreshToken = useAction(api.integrations.refreshGoogleToken)

  const fetchGoogleCalendarEvents = async (accessToken: string) => {
    try {
      // Get current date and 30 days from now
      const now = new Date()
      const thirtyDaysLater = new Date()
      thirtyDaysLater.setDate(now.getDate() + 30)

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
        `timeMin=${now.toISOString()}&` +
        `timeMax=${thirtyDaysLater.toISOString()}&` +
        `singleEvents=true&` +
        `orderBy=startTime`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || "Failed to fetch calendar events")
      }

      const data = await response.json()
      const formattedEvents = data.items.map((event: any) => ({
        id: event.id,
        title: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        backgroundColor: event.colorId ? getColorFromId(event.colorId) : "#3788d8",
        borderColor: event.colorId ? getColorFromId(event.colorId) : "#3788d8",
      }))

      setEvents(formattedEvents)
      setError(null)
    } catch (err) {
      console.error("Error fetching calendar events:", err)
      throw err
    }
  }

  useEffect(() => {
    const loadEvents = async () => {
      if (!googleCalendarIntegration?.credentials?.accessToken) {
        setError("Google Calendar not connected")
        setIsLoading(false)
        return
      }

      try {
        // Check if token is expired
        const isExpired = Date.now() >= (googleCalendarIntegration.credentials.expiryDate || 0)
        
        if (isExpired && convexUser?._id) {
          // Refresh the token
          const { accessToken } = await refreshToken({ userId: convexUser._id })
          await fetchGoogleCalendarEvents(accessToken)
        } else {
          await fetchGoogleCalendarEvents(googleCalendarIntegration.credentials.accessToken)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load calendar events")
      } finally {
        setIsLoading(false)
      }
    }

    if (googleCalendarIntegration) {
      loadEvents()
    }
  }, [googleCalendarIntegration, convexUser?._id, refreshToken])

  // If user is not a doctor, show access denied
  if (convexUser && convexUser.role !== "doctor") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium">Access Denied</h3>
        <p className="text-sm text-muted-foreground mt-1">This page is only accessible to doctors.</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Calendar</CardTitle>
        {!googleCalendarIntegration?.credentials?.accessToken && (
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Connect Google Calendar
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          height="auto"
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          nowIndicator={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          eventClick={(info) => {
            // Handle event click
            console.log("Event clicked:", info.event)
          }}
          select={(info) => {
            // Handle date/time selection
            console.log("Selected:", info.start, info.end)
          }}
        />
      </CardContent>
    </Card>
  )
}

// Helper function to get color from Google Calendar color ID
function getColorFromId(colorId: string): string {
  const colorMap: { [key: string]: string } = {
    "1": "#7986cb", // Lavender
    "2": "#33b679", // Sage
    "3": "#8e24aa", // Grape
    "4": "#e67c73", // Flamingo
    "5": "#f6c026", // Banana
    "6": "#f5511d", // Tangerine
    "7": "#039be5", // Peacock
    "8": "#616161", // Graphite
    "9": "#3f51b5", // Blueberry
    "10": "#0b8043", // Basil
    "11": "#d60000", // Tomato
  }
  return colorMap[colorId] || "#3788d8" // Default blue if color ID not found
} 