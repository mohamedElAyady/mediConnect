"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MoreHorizontal, Video, MapPin } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data - would come from Convex in a real app
const appointments = [
  {
    id: "1",
    doctorName: "Dr. James Wilson",
    doctorSpecialty: "Cardiologist",
    doctorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2025-04-05",
    time: "11:00 AM",
    type: "Video Consultation",
    status: "Confirmed",
    location: "Online",
  },
  {
    id: "2",
    doctorName: "Dr. Maria Garcia",
    doctorSpecialty: "Dermatologist",
    doctorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2025-04-10",
    time: "02:30 PM",
    type: "In-Person",
    status: "Confirmed",
    location: "123 Medical Center, Suite 4B",
  },
]

export function PatientAppointmentList() {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No appointments</h3>
        <p className="text-sm text-muted-foreground">You have no upcoming appointments.</p>
        <Button className="mt-4" size="sm">
          Find a Doctor
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={appointment.doctorAvatar} />
              <AvatarFallback>{appointment.doctorName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{appointment.doctorName}</h4>
              <p className="text-sm text-muted-foreground">{appointment.doctorSpecialty}</p>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Calendar className="mr-1 h-3 w-3" />
                {appointment.date} • <Clock className="mx-1 h-3 w-3" />
                {appointment.time}
              </div>
              <div className="flex items-center text-xs mt-1">
                {appointment.type === "Video Consultation" ? (
                  <span className="flex items-center text-primary">
                    <Video className="mr-1 h-3 w-3" />
                    {appointment.type}
                  </span>
                ) : (
                  <span className="flex items-center text-primary">
                    <MapPin className="mr-1 h-3 w-3" />
                    {appointment.location}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {appointment.type === "Video Consultation" && (
              <Button size="sm" variant="outline" className="text-xs">
                <Video className="mr-1 h-3 w-3" />
                Join
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Reschedule</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}

