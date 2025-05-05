"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MoreHorizontal, Video, MapPin, FileText, AlertCircle } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data - would come from Convex in a real app
const appointments = [
  {
    id: "1",
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
    medicalHistory: [
      { date: "2024-10-05", diagnosis: "Common Cold", doctor: "Dr. James Wilson" },
      { date: "2024-02-15", diagnosis: "Influenza", doctor: "Dr. James Wilson" },
    ],
  },
  {
    id: "2",
    doctorName: "Dr. Maria Garcia",
    doctorSpecialty: "Dermatologist",
    doctorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2025-04-16",
    time: "02:30 PM",
    type: "In-Person",
    status: "Confirmed",
    duration: "45 minutes",
    reason: "Skin rash examination",
    notes: "Follow-up on previous treatment.",
    medicalHistory: [{ date: "2024-11-20", diagnosis: "Eczema", doctor: "Dr. Maria Garcia" }],
  },
  {
    id: "3",
    doctorName: "Dr. Robert Chen",
    doctorSpecialty: "Neurologist",
    doctorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2025-04-20",
    time: "10:15 AM",
    type: "Video Consultation",
    status: "Pending",
    duration: "30 minutes",
    reason: "Headache consultation",
    notes: "Initial consultation for recurring headaches.",
    medicalHistory: [],
  },
  {
    id: "4",
    doctorName: "Dr. James Wilson",
    doctorSpecialty: "Cardiologist",
    doctorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2025-03-10",
    time: "11:00 AM",
    type: "In-Person",
    status: "Completed",
    duration: "45 minutes",
    reason: "Blood pressure check",
    notes: "Blood pressure readings were normal. Continue current medication.",
    medicalHistory: [
      { date: "2024-10-05", diagnosis: "Common Cold", doctor: "Dr. James Wilson" },
      { date: "2024-02-15", diagnosis: "Influenza", doctor: "Dr. James Wilson" },
    ],
  },
]

export function PatientAppointmentsList() {
  const [selectedAppointment, setSelectedAppointment] = useState<(typeof appointments)[0] | null>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")

  const handleViewDetails = (appointment: (typeof appointments)[0]) => {
    setSelectedAppointment(appointment)
  }

  const handleCancelAppointment = (appointment: (typeof appointments)[0]) => {
    setSelectedAppointment(appointment)
    setCancelDialogOpen(true)
  }

  const confirmCancellation = () => {
    // In a real app, this would call a Convex mutation to update the appointment status
    console.log(`Cancelling appointment ${selectedAppointment?.id} with reason: ${cancelReason}`)
    setCancelDialogOpen(false)
    setCancelReason("")
  }

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No appointments</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">You have no upcoming appointments.</p>
        <Button>Book an Appointment</Button>
      </div>
    )
  }

  // Group appointments by upcoming and past
  const upcomingAppointments = appointments.filter(
    (appointment) =>
      new Date(`${appointment.date}T00:00:00`) >= new Date() &&
      appointment.status !== "Completed" &&
      appointment.status !== "Cancelled",
  )

  const pastAppointments = appointments.filter(
    (appointment) =>
      new Date(`${appointment.date}T00:00:00`) < new Date() ||
      appointment.status === "Completed" ||
      appointment.status === "Cancelled",
  )

  return (
    <div className="space-y-6">
      {/* Upcoming Appointments */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Upcoming Appointments</h3>
        {upcomingAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center border rounded-lg bg-slate-50">
            <p className="text-muted-foreground mb-4">You have no upcoming appointments.</p>
            <Button>Book an Appointment</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <PatientAppointmentCard
                key={appointment.id}
                appointment={appointment}
                onViewDetails={handleViewDetails}
                onCancelAppointment={handleCancelAppointment}
              />
            ))}
          </div>
        )}
      </div>

      {/* Past Appointments */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Past Appointments</h3>
        {pastAppointments.length === 0 ? (
          <div className="flex justify-center py-8 text-center border rounded-lg bg-slate-50">
            <p className="text-muted-foreground">You have no past appointments.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pastAppointments.map((appointment) => (
              <PatientAppointmentCard
                key={appointment.id}
                appointment={appointment}
                onViewDetails={handleViewDetails}
                onCancelAppointment={handleCancelAppointment}
                isPast={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Appointment Details Dialog */}
      {selectedAppointment && (
        <Dialog
          open={!!selectedAppointment && !cancelDialogOpen}
          onOpenChange={(open) => !open && setSelectedAppointment(null)}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>View your appointment information</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedAppointment.doctorAvatar || "/placeholder.svg"} />
                      <AvatarFallback>{selectedAppointment.doctorName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedAppointment.doctorName}</h3>
                      <p className="text-sm text-muted-foreground">{selectedAppointment.doctorSpecialty}</p>
                    </div>
                  </div>

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

              <div className="md:col-span-2">
                <Tabs defaultValue="notes" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="notes">Doctor's Notes</TabsTrigger>
                    <TabsTrigger value="history">Medical History</TabsTrigger>
                  </TabsList>
                  <TabsContent value="notes" className="mt-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Appointment Notes</CardTitle>
                        <CardDescription>Notes from your doctor</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {selectedAppointment.notes ? (
                          <p className="text-sm">{selectedAppointment.notes}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            No notes available for this appointment.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="history" className="mt-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Your Medical History</CardTitle>
                        <CardDescription>Previous diagnoses and treatments</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[200px]">
                          {selectedAppointment.medicalHistory.length > 0 ? (
                            <div className="space-y-4">
                              {selectedAppointment.medicalHistory.map((record, index) => (
                                <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                                  <div className="flex justify-between">
                                    <p className="font-medium">{record.diagnosis}</p>
                                    <p className="text-sm text-muted-foreground">{record.date}</p>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{record.doctor}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">No medical history available.</p>
                          )}
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <DialogFooter className="flex justify-between sm:justify-between">
              <div className="flex gap-2">
                {selectedAppointment.status !== "Cancelled" && selectedAppointment.status !== "Completed" && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setSelectedAppointment(null)
                      handleCancelAppointment(selectedAppointment)
                    }}
                  >
                    Cancel Appointment
                  </Button>
                )}
                {selectedAppointment.type === "Video Consultation" && selectedAppointment.status === "Confirmed" && (
                  <Button className="gap-2">
                    <Video className="h-4 w-4" />
                    Join Video Call
                  </Button>
                )}
              </div>
              <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Cancel Appointment Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">Reason for cancellation</Label>
              <Textarea
                id="cancel-reason"
                placeholder="Please provide a reason for cancellation..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Appointment
            </Button>
            <Button variant="destructive" onClick={confirmCancellation}>
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface PatientAppointmentCardProps {
  appointment: (typeof appointments)[0]
  onViewDetails: (appointment: (typeof appointments)[0]) => void
  onCancelAppointment: (appointment: (typeof appointments)[0]) => void
  isPast?: boolean
}

function PatientAppointmentCard({
  appointment,
  onViewDetails,
  onCancelAppointment,
  isPast = false,
}: PatientAppointmentCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={appointment.doctorAvatar || "/placeholder.svg"} />
          <AvatarFallback>{appointment.doctorName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium">{appointment.doctorName}</h4>
          <p className="text-sm text-muted-foreground">{appointment.doctorSpecialty}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            {appointment.date} • <Clock className="mx-1 h-3 w-3" />
            {appointment.time}
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
        {appointment.type === "Video Consultation" && appointment.status === "Confirmed" && !isPast && (
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
            <DropdownMenuItem onClick={() => onViewDetails(appointment)}>View Details</DropdownMenuItem>
            {!isPast && appointment.status !== "Cancelled" && (
              <>
                <DropdownMenuItem>Reschedule</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onCancelAppointment(appointment)}
                >
                  Cancel Appointment
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
