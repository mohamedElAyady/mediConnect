"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MoreHorizontal, Video, MapPin, FileText, AlertCircle, UserCog, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data - would come from Convex in a real app
const appointments = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    doctorName: "Dr. James Wilson",
    doctorSpecialty: "Cardiologist",
    doctorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2025-04-15",
    time: "09:00 AM",
    type: "Video Consultation",
    status: "Confirmed",
    duration: "30 minutes",
    reason: "Annual check-up",
    notes: "Patient has reported mild headaches for the past week.",
  },
  {
    id: "2",
    patientName: "Michael Chen",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    doctorName: "Dr. James Wilson",
    doctorSpecialty: "Cardiologist",
    doctorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2025-04-15",
    time: "10:30 AM",
    type: "In-Person",
    status: "Confirmed",
    duration: "45 minutes",
    reason: "Follow-up on medication",
    notes: "Review blood pressure medication effectiveness.",
  },
  {
    id: "3",
    patientName: "Emily Rodriguez",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    doctorName: "Dr. Maria Garcia",
    doctorSpecialty: "Dermatologist",
    doctorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2025-04-15",
    time: "02:00 PM",
    type: "Video Consultation",
    status: "Pending",
    duration: "30 minutes",
    reason: "Skin rash consultation",
    notes: "Patient has developed a rash on arms and neck.",
  },
  {
    id: "4",
    patientName: "David Kim",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    doctorName: "Dr. Robert Chen",
    doctorSpecialty: "Neurologist",
    doctorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2025-04-16",
    time: "11:15 AM",
    type: "In-Person",
    status: "Confirmed",
    duration: "60 minutes",
    reason: "Comprehensive physical",
    notes: "Annual physical examination.",
  },
  {
    id: "5",
    patientName: "Jessica Taylor",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    doctorName: "Dr. James Wilson",
    doctorSpecialty: "Cardiologist",
    doctorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2025-04-16",
    time: "03:30 PM",
    type: "Video Consultation",
    status: "Cancelled",
    duration: "30 minutes",
    reason: "Migraine follow-up",
    notes: "Discuss effectiveness of prescribed medication for migraines.",
  },
]

export function AdminAppointmentsList() {
  const [selectedAppointment, setSelectedAppointment] = useState<(typeof appointments)[0] | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [statusValue, setStatusValue] = useState("")

  const handleViewDetails = (appointment: (typeof appointments)[0]) => {
    setSelectedAppointment(appointment)
  }

  const handleEditAppointment = (appointment: (typeof appointments)[0]) => {
    setSelectedAppointment(appointment)
    setStatusValue(appointment.status)
    setEditDialogOpen(true)
  }

  const saveAppointmentChanges = () => {
    // In a real app, this would call a Convex mutation to update the appointment
    console.log(`Updating appointment ${selectedAppointment?.id} with status: ${statusValue}`)
    setEditDialogOpen(false)
  }

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No appointments</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">There are no appointments in the system.</p>
        <Button>Create Appointment</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Group appointments by date */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Today - April 15, 2025</h3>
          <div className="space-y-3">
            {appointments.slice(0, 3).map((appointment) => (
              <AdminAppointmentCard
                key={appointment.id}
                appointment={appointment}
                onViewDetails={handleViewDetails}
                onEditAppointment={handleEditAppointment}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Tomorrow - April 16, 2025</h3>
          <div className="space-y-3">
            {appointments.slice(3, 5).map((appointment) => (
              <AdminAppointmentCard
                key={appointment.id}
                appointment={appointment}
                onViewDetails={handleViewDetails}
                onEditAppointment={handleEditAppointment}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Details Dialog */}
      {selectedAppointment && (
        <Dialog
          open={!!selectedAppointment && !editDialogOpen}
          onOpenChange={(open) => !open && setSelectedAppointment(null)}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>View and manage appointment information</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Patient Information</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedAppointment.patientAvatar || "/placeholder.svg"} />
                    <AvatarFallback>{selectedAppointment.patientName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedAppointment.patientName}</h3>
                    <p className="text-sm text-muted-foreground">Patient</p>
                  </div>
                </div>

                <h3 className="text-sm font-medium text-muted-foreground mb-3">Doctor Information</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedAppointment.doctorAvatar || "/placeholder.svg"} />
                    <AvatarFallback>{selectedAppointment.doctorName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedAppointment.doctorName}</h3>
                    <p className="text-sm text-muted-foreground">{selectedAppointment.doctorSpecialty}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Appointment Details</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Date & Time</p>
                      <p className="text-sm text-muted-foreground">{selectedAppointment.date}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedAppointment.time} ({selectedAppointment.duration})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    {selectedAppointment.type === "Video Consultation" ? (
                      <Video className="h-5 w-5 text-muted-foreground mt-0.5" />
                    ) : (
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">Appointment Type</p>
                      <p className="text-sm text-muted-foreground">{selectedAppointment.type}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Reason for Visit</p>
                      <p className="text-sm text-muted-foreground">{selectedAppointment.reason}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Status</p>
                      <Badge
                        className={
                          selectedAppointment.status === "Confirmed"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : selectedAppointment.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : selectedAppointment.status === "Completed"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {selectedAppointment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Appointment Notes</CardTitle>
                <CardDescription>Notes for this appointment</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{selectedAppointment.notes || "No notes available."}</p>
              </CardContent>
            </Card>

            <DialogFooter className="flex justify-between sm:justify-between">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  setSelectedAppointment(null)
                  handleEditAppointment(selectedAppointment)
                }}
              >
                Edit Appointment
              </Button>
              <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Appointment Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>Update appointment details and status</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">Appointment Status</Label>
              <Select value={statusValue} onValueChange={setStatusValue}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-notes">Admin Notes</Label>
              <Textarea id="admin-notes" placeholder="Add administrative notes about this appointment..." />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveAppointmentChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface AdminAppointmentCardProps {
  appointment: (typeof appointments)[0]
  onViewDetails: (appointment: (typeof appointments)[0]) => void
  onEditAppointment: (appointment: (typeof appointments)[0]) => void
}

function AdminAppointmentCard({ appointment, onViewDetails, onEditAppointment }: AdminAppointmentCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          <Avatar className="border-2 border-background">
            <AvatarImage src={appointment.patientAvatar || "/placeholder.svg"} />
            <AvatarFallback>{appointment.patientName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarImage src={appointment.doctorAvatar || "/placeholder.svg"} />
            <AvatarFallback>{appointment.doctorName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-muted-foreground" />
            <h4 className="text-sm">{appointment.patientName}</h4>
            <span className="text-muted-foreground mx-1">with</span>
            <UserCog className="h-3 w-3 text-muted-foreground" />
            <h4 className="text-sm">{appointment.doctorName}</h4>
          </div>
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
                    : appointment.status === "Completed"
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
              }`}
            >
              {appointment.status}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(appointment)}>View Details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditAppointment(appointment)}>Edit Appointment</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">Delete Appointment</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
