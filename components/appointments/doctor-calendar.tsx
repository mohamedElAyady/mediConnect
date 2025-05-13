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
import { AlertCircle, CalendarIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Id } from "@/convex/_generated/dataModel"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface GoogleCalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor?: string
  borderColor?: string
  extendedProps?: {
    patientName: string
    patientContact: string
    status: string
    duration: string
    reason?: string
    symptoms?: string
    meetingLink?: string
  }
}

export function DoctorCalendar() {
  const { user } = useUser()
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<GoogleCalendarEvent | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Get the Convex user ID first
  const convexUser = useQuery(api.users.getUserByClerkId, { clerkId: user?.id as string })

  // Get appointments
  const appointments = useQuery(api.appointments.getAppointments, {
    doctorId: convexUser?._id as Id<"users">,
  })

  // Get Google Calendar integration
  const integrations = useQuery(api.integrations.getUserIntegrations, {
    userId: convexUser?._id as Id<"users">,
  })
  const googleCalendarIntegration = integrations?.find((i) => i.type === "google")
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
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || "Failed to fetch calendar events")
      }

      const data = await response.json()
      
      const formattedEvents = data.items.map((event: any) => {
        // Find matching appointment in database
        const matchingAppointment = appointments?.find(
          (appointment) => appointment.date === new Date(event.start.dateTime || event.start.date).toISOString().split('T')[0]
        )

        return {
          id: event.id,
          title: event.summary,
          start: event.start.dateTime || event.start.date,
          end: event.end.dateTime || event.end.date,
          backgroundColor: event.colorId ? getColorFromId(event.colorId) : "#3788d8",
          borderColor: event.colorId ? getColorFromId(event.colorId) : "#3788d8",
          extendedProps: {
            patientName: matchingAppointment?.patient?.name || "Not available",
            patientContact: matchingAppointment?.patient?.email || "Not available",
            status: matchingAppointment?.status || "Scheduled",
            duration: matchingAppointment?.duration || "30 minutes",
            reason: matchingAppointment?.reason,
            symptoms: matchingAppointment?.symptoms,
            meetingLink: matchingAppointment?.meetingLink || event.hangoutLink || event.conferenceData?.entryPoints?.[0]?.uri,
          },
        }
      })

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
    <Card className="shadow-md border-0 p-2">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <CardTitle>Doctor's Schedule</CardTitle>
        </div>
        {!googleCalendarIntegration?.credentials?.accessToken && (
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Connect Google Calendar
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0 pt-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          height="700px"
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          nowIndicator={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
            startTime: "09:00",
            endTime: "17:00",
          }}
          slotLabelFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
          eventDidMount={(info) => {
            // Add tooltip to event
            const event = info.event
            const tooltip = document.createElement("div")
            tooltip.innerHTML = `
              <div class="p-2">
                <strong>${event.title}</strong><br/>
                Start: ${event.start?.toLocaleString()}<br/>
                End: ${event.end?.toLocaleString()}
              </div>
            `
            info.el.setAttribute("title", tooltip.innerHTML)
          }}
          eventClick={(info) => {
            const event = info.event
            setSelectedEvent({
              id: event.id,
              title: event.title,
              start: event.start?.toISOString() || "",
              end: event.end?.toISOString() || "",
              backgroundColor: event.backgroundColor,
              borderColor: event.borderColor,
              extendedProps: event.extendedProps as GoogleCalendarEvent["extendedProps"],
            })
            setIsDialogOpen(true)
          }}
          select={(info) => {
            // Handle date/time selection
            console.log("Selected:", info.start, info.end)
          }}
        />
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{selectedEvent?.title}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Date & Time</p>
                <p className="text-sm text-muted-foreground">
                  {selectedEvent?.start &&
                    new Date(selectedEvent.start).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                </p>
                <div className="mt-1 flex items-center text-sm text-muted-foreground">
                  <span>
                    {selectedEvent?.start &&
                      new Date(selectedEvent.start).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </span>
                  <span className="mx-2">-</span>
                  <span>
                    {selectedEvent?.end &&
                      new Date(selectedEvent.end).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                <div
                  className="h-5 w-5 rounded-full"
                  style={{ backgroundColor: selectedEvent?.backgroundColor || "#3788d8" }}
                />
              </div>
              <div>
                <p className="font-medium">Appointment Type</p>
                <p className="text-sm text-muted-foreground">
                  {selectedEvent?.backgroundColor ? getEventTypeFromColor(selectedEvent.backgroundColor) : "Appointment"}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="font-medium mb-2">Patient Information</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Name: {selectedEvent?.extendedProps?.patientName || "Not available"}</p>
                <p>Contact: {selectedEvent?.extendedProps?.patientContact || "Not available"}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="font-medium mb-2">Appointment Details</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Status: <span className="capitalize">{selectedEvent?.extendedProps?.status || "Scheduled"}</span></p>
                <p>Duration: {selectedEvent?.extendedProps?.duration || "30 minutes"}</p>
                {selectedEvent?.extendedProps?.reason && (
                  <p>Reason: {selectedEvent.extendedProps.reason}</p>
                )}
                {selectedEvent?.extendedProps?.symptoms && (
                  <p>Symptoms: {selectedEvent.extendedProps.symptoms}</p>
                )}
              </div>
            </div>

            {selectedEvent?.extendedProps?.meetingLink && (
              <div className="border-t pt-4">
                <p className="font-medium mb-2">Meeting Link</p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-primary text-white"
                    onClick={() => {
                      const link = selectedEvent?.extendedProps?.meetingLink;
                      if (link) window.open(link, '_blank');
                    }}
                  >
                    Join Meeting
                  </Button>
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button variant="outline" className="w-full" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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

function getEventTypeFromColor(color: string): string {
  const colorTypeMap: { [key: string]: string } = {
    "#7986cb": "Meeting",
    "#33b679": "Appointment",
    "#8e24aa": "Consultation",
    "#e67c73": "Emergency",
    "#f6c026": "Follow-up",
    "#f5511d": "Surgery",
    "#039be5": "Check-up",
    "#616161": "Administrative",
    "#3f51b5": "Conference",
    "#0b8043": "Personal",
    "#d60000": "Urgent",
  }

  // Find the closest color match
  let closestColor = "#3788d8"
  let minDistance = Number.MAX_VALUE

  Object.keys(colorTypeMap).forEach((mapColor) => {
    const distance = getColorDistance(color, mapColor)
    if (distance < minDistance) {
      minDistance = distance
      closestColor = mapColor
    }
  })

  return colorTypeMap[closestColor] || "Appointment"
}

function getColorDistance(color1: string, color2: string): number {
  // Simple RGB distance calculation
  const r1 = Number.parseInt(color1.slice(1, 3), 16)
  const g1 = Number.parseInt(color1.slice(3, 5), 16)
  const b1 = Number.parseInt(color1.slice(5, 7), 16)

  const r2 = Number.parseInt(color2.slice(1, 3), 16)
  const g2 = Number.parseInt(color2.slice(3, 5), 16)
  const b2 = Number.parseInt(color2.slice(5, 7), 16)

  return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2))
}
