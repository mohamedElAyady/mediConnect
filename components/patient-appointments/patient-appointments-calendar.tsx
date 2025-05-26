"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Video, MapPin, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { Id } from "@/convex/_generated/dataModel"

export function PatientAppointmentsCalendar() {
  const router = useRouter()
  const { user } = useUser()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()))

  const convexUser = useQuery(api.users.getUser, { clerkId: user?.id || "" })
  const appointments = useQuery(api.appointments.getPatientAppointments, { patientId: convexUser?._id || "" }) || []
  const createConversation = useMutation(api.conversations.createDoctorPatientConversation)

  // Format date as YYYY-MM-DD
  function formatDate(date: Date): string {
    return date.toISOString().split("T")[0]
  }

  // Filter appointments for the selected date
  const filteredAppointments = appointments.filter((appointment) => appointment.date === selectedDate)

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date)
    if (date) {
      const formattedDate = formatDate(date)
      setSelectedDate(formattedDate)
    }
  }

  // Function to highlight dates with appointments
  const isDayWithAppointment = (day: Date) => {
    const formattedDate = formatDate(day)
    return appointments.some((appointment) => appointment.date === formattedDate)
  }

  const handleSendMessage = async (doctorId: string) => {
    if (!convexUser?._id) return

    try {
      const conversationId = await createConversation({
        doctorId: doctorId as Id<"users">,
        patientId: convexUser._id,
      })

      router.push(`/patient/conversations?conversation=${conversationId}`)
    } catch (error) {
      console.error("Error creating conversation:", error)
    }
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
          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center text-sm">
              <div className="h-3 w-3 rounded-full bg-blue-100 mr-1"></div>
              <span className="text-muted-foreground">Appointment scheduled</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Appointments for {selectedDate}</CardTitle>
          <Button variant="outline" size="sm" onClick={() => router.push("/patient/find-doctors")}>
            Book New
          </Button>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">No appointments scheduled for this date.</p>
              <Button variant="outline" className="mt-4" onClick={() => router.push("/patient/find-doctors")}>
                Book an Appointment
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={appointment.doctorAvatar || "/placeholder.svg"} />
                        <AvatarFallback>{appointment.doctorName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{appointment.doctorName}</h4>
                        <p className="text-sm text-muted-foreground">{appointment.doctorSpecialty}</p>
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
                              appointment.status === "confirmed"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : appointment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                            }`}
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {appointment.type === "Video Consultation" && appointment.status === "confirmed" && (
                        <Button size="sm" variant="outline" className="text-xs">
                          <Video className="mr-1 h-3 w-3" />
                          Join
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs"
                        onClick={() => handleSendMessage(appointment.doctorId)}
                      >
                        <MessageSquare className="mr-1 h-3 w-3" />
                        Message
                      </Button>
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
