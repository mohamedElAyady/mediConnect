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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

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
    reason: "Annual check-up",
    notes: "Patient has reported mild headaches for the past week.",
    medicalHistory: [
      { date: "2024-10-05", diagnosis: "Common Cold", doctor: "Dr. James Wilson" },
      { date: "2024-02-15", diagnosis: "Influenza", doctor: "Dr. James Wilson" },
    ],
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
    reason: "Follow-up on medication",
    notes: "Review blood pressure medication effectiveness.",
    medicalHistory: [
      { date: "2024-11-20", diagnosis: "Hypertension", doctor: "Dr. James Wilson" },
      { date: "2024-08-05", diagnosis: "Anxiety", doctor: "Dr. Maria Garcia" },
    ],
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
    reason: "Skin rash consultation",
    notes: "Patient has developed a rash on arms and neck.",
    medicalHistory: [{ date: "2024-09-12", diagnosis: "Eczema", doctor: "Dr. James Wilson" }],
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
    reason: "Comprehensive physical",
    notes: "Annual physical examination.",
    medicalHistory: [
      { date: "2024-04-10", diagnosis: "Type 2 Diabetes", doctor: "Dr. James Wilson" },
      { date: "2023-11-22", diagnosis: "High Cholesterol", doctor: "Dr. James Wilson" },
    ],
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
    reason: "Migraine follow-up",
    notes: "Discuss effectiveness of prescribed medication for migraines.",
    medicalHistory: [
      { date: "2024-07-18", diagnosis: "Chronic Migraines", doctor: "Dr. James Wilson" },
      { date: "2024-01-05", diagnosis: "Insomnia", doctor: "Dr. Robert Chen" },
    ],
  },
]

export function AppointmentsList() {
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
        <Button>Schedule an Appointment</Button>
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
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onViewDetails={handleViewDetails}
                onCancelAppointment={handleCancelAppointment}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Tomorrow - April 16, 2025</h3>
          <div className="space-y-3">
            {appointments.slice(3, 5).map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onViewDetails={handleViewDetails}
                onCancelAppointment={handleCancelAppointment}
              />
            ))}
          </div>
        </div>
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
              <DialogDescription>View and manage appointment information</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedAppointment.patientAvatar || "/placeholder.svg"} />
                      <AvatarFallback>{selectedAppointment.patientName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedAppointment.patientName}</h3>
                      <p className="text-sm text-muted-foreground">Patient</p>
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
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="history">Medical History</TabsTrigger>
                  </TabsList>
                  <TabsContent value="notes" className="mt-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Appointment Notes</CardTitle>
                        <CardDescription>Notes for this appointment</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          className="min-h-[150px]"
                          placeholder="Add notes about this appointment..."
                          defaultValue={selectedAppointment.notes}
                        />
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button>Save Notes</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  <TabsContent value="history" className="mt-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Patient Medical History</CardTitle>
                        <CardDescription>Previous diagnoses and treatments</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[200px]">
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
                        </ScrollArea>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button variant="outline">View Full History</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <DialogFooter className="flex justify-between sm:justify-between">
              <div className="flex gap-2">
                {selectedAppointment.status !== "Cancelled" && (
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

interface AppointmentCardProps {
  appointment: (typeof appointments)[0]
  onViewDetails: (appointment: (typeof appointments)[0]) => void
  onCancelAppointment: (appointment: (typeof appointments)[0]) => void
}

function AppointmentCard({ appointment, onViewDetails, onCancelAppointment }: AppointmentCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
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
      <div className="flex items-center gap-2">
        {appointment.type === "Video Consultation" && appointment.status === "Confirmed" && (
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
            <DropdownMenuItem>Reschedule</DropdownMenuItem>
            {appointment.status !== "Cancelled" && (
              <>
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
