"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Video, MapPin } from "lucide-react"

// Mock data - would come from Convex in a real app
const appointments = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    date: "2025-04-15",
    time: "09:00 AM",
    type: "Video Consultation",
    status: "Confirmed",
    duration: "30 minutes",
  },
  {
    id: "2",
    patientName: "Michael Chen",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    date: "2025-04-15",
    time: "10:30 AM",
    type: "In-Person",
    status: "Confirmed",
    duration: "45 minutes",
  },
  {
    id: "3",
    patientName: "Emily Rodriguez",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    date: "2025-04-15",
    time: "02:00 PM",
    type: "Video Consultation",
    status: "Pending",
    duration: "30 minutes",
  },
  {
    id: "4",
    patientName: "David Kim",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    date: "2025-04-16",
    time: "11:15 AM",
    type: "In-Person",
    status: "Confirmed",
    duration: "60 minutes",
  },
  {
    id: "5",
    patientName: "Jessica Taylor",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    date: "2025-04-16",
    time: "03:30 PM",
    type: "Video Consultation",
    status: "Cancelled",
    duration: "30 minutes",
  },
]

export function AppointmentsCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedDate, setSelectedDate] = useState<string>("2025-04-15")

  // In a real app, this would filter appointments from Convex based on the selected date
  const filteredAppointments = appointments.filter((appointment) => appointment.date === selectedDate)

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date)
    if (date) {
      // Format date as YYYY-MM-DD
      const formattedDate = date.toISOString().split("T")[0]
      setSelectedDate(formattedDate)
    }
  }

  // Function to highlight dates with appointments
  const isDayWithAppointment = (day: Date) => {
    const formattedDate = day.toISOString().split("T")[0]
    return appointments.some((appointment) => appointment.date === formattedDate)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border"
            modifiers={{
              appointment: isDayWithAppointment,
            }}
            modifiersStyles={{
              appointment: {
                fontWeight: "bold",
                backgroundColor: "rgba(0, 123, 255, 0.1)",
                borderRadius: "100%",
              },
            }}
          />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Appointments for {selectedDate}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">No appointments scheduled for this date.</p>
              <Button variant="outline" className="mt-4">
                Add Appointment
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={appointment.patientAvatar || "/placeholder.svg"} />
                        <AvatarFallback>{appointment.patientName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{appointment.patientName}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {appointment.time} • {appointment.duration}
                        </div>
                        <div className="flex items-center text-xs mt-1">
                          <span className="flex items-center text-primary">
                            {appointment.type === "Video Consultation" ? (
                              <Video className="mr-1 h-3 w-3" />
                            ) : (
                              <MapPin className="mr-1 h-3 w-3" />
                            )}
                            {appointment.type}
                          </span>
                          <Badge
                            className={`ml-2 ${
                              appointment.status === "Confirmed"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : appointment.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                            }`}
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      {appointment.type === "Video Consultation" && appointment.status === "Confirmed" && (
                        <Button size="sm" variant="outline" className="text-xs">
                          <Video className="mr-1 h-3 w-3" />
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
