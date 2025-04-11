"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MoreHorizontal, Video } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data - would come from Convex in a real app
const appointments = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    date: "2025-04-03",
    time: "09:00 AM",
    type: "Video Consultation",
    status: "Confirmed",
  },
  {
    id: "2",
    patientName: "Michael Chen",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    date: "2025-04-03",
    time: "10:30 AM",
    type: "In-Person",
    status: "Confirmed",
  },
  {
    id: "3",
    patientName: "Emily Rodriguez",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    date: "2025-04-03",
    time: "02:00 PM",
    type: "Video Consultation",
    status: "Pending",
  },
]

export function AppointmentList() {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No appointments</h3>
        <p className="text-sm text-muted-foreground">You have no upcoming appointments.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={appointment.patientAvatar} />
              <AvatarFallback>{appointment.patientName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{appointment.patientName}</h4>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                {appointment.date} • <Clock className="mx-1 h-3 w-3" />
                {appointment.time}
              </div>
              <div className="flex items-center text-xs mt-1">
                <span className="flex items-center text-primary">
                  {appointment.type === "Video Consultation" && <Video className="mr-1 h-3 w-3" />}
                  {appointment.type}
                </span>
                <span
                  className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                    appointment.status === "Confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {appointment.status}
                </span>
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

