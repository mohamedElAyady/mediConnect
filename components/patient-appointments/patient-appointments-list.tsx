"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MoreHorizontal, Video, MapPin, FileText, AlertCircle, MessageSquare } from "lucide-react"
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
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { Id } from "@/convex/_generated/dataModel"


export function PatientAppointmentsList() {
  const router = useRouter()
  const { user } = useUser()
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false)

  const convexUser = useQuery(api.users.getUser, { clerkId: user?.id || "" })
  const appointments = useQuery(api.appointments.getPatientAppointments, { patientId: convexUser?._id || "" }) || []
  const cancelAppointment = useMutation(api.appointments.cancelAppointment)
  const rescheduleAppointment = useMutation(api.appointments.rescheduleAppointment)
  const createConversation = useMutation(api.conversations.createDoctorPatientConversation)

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment)
  }

  const handleCancelAppointment = (appointment: any) => {
    setSelectedAppointment(appointment)
    setCancelDialogOpen(true)
  }

  const handleRescheduleAppointment = (appointment: any) => {
    setSelectedAppointment(appointment)
    setRescheduleDialogOpen(true)
  }

  const confirmCancellation = async () => {
    if (!selectedAppointment) return
    try {
      await cancelAppointment({
        appointmentId: selectedAppointment._id,
        reason: cancelReason,
      })
      setCancelDialogOpen(false)
      setCancelReason("")
    } catch (error) {
      console.error("Failed to cancel appointment:", error)
    }
  }

  const confirmReschedule = async () => {
    if (!selectedAppointment) return
    try {
      // In a real app, you would get these values from a date/time picker
      const newDate = "2025-05-20" // Example date
      const newTime = "10:00 AM" // Example time
      
      await rescheduleAppointment({
        appointmentId: selectedAppointment._id,
        newDate,
        newTime,
      })
      setRescheduleDialogOpen(false)
    } catch (error) {
      console.error("Failed to reschedule appointment:", error)
    }
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
            <Button onClick={() => router.push("/patient/find-doctors")}>Book an Appointment</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <PatientAppointmentCard
                key={appointment._id}
                appointment={appointment}
                onViewDetails={handleViewDetails}
                onCancelAppointment={handleCancelAppointment}
                onRescheduleAppointment={handleRescheduleAppointment}
                onSendMessage={handleSendMessage}
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
                key={appointment._id}
                appointment={appointment}
                onViewDetails={handleViewDetails}
                onCancelAppointment={handleCancelAppointment}
                onRescheduleAppointment={handleRescheduleAppointment}
                onSendMessage={handleSendMessage}
                isPast={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Appointment Details Dialog */}
      {selectedAppointment && (
        <Dialog
          open={!!selectedAppointment && !cancelDialogOpen && !rescheduleDialogOpen}
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
                            selectedAppointment.status === "confirmed"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : selectedAppointment.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : selectedAppointment.status === "completed"
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
                              {selectedAppointment.medicalHistory.map((record: any, index: number) => (
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
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelectedAppointment(null)
                        handleCancelAppointment(selectedAppointment)
                      }}
                    >
                      Cancel Appointment
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedAppointment(null)
                        handleRescheduleAppointment(selectedAppointment)
                      }}
                    >
                      Reschedule
                    </Button>
                  </>
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

      {/* Reschedule Appointment Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Please select a new date and time for your appointment with {selectedAppointment?.doctorName}.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              To reschedule your appointment, you'll be redirected to the booking page where you can select a new date
              and time.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmReschedule}>Continue to Reschedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface PatientAppointmentCardProps {
  appointment: {
    _id: Id<"appointments">;
    doctorId: string;
    doctorName: string;
    doctorSpecialty: string;
    doctorAvatar: string;
    date: string;
    time: string;
    type: string;
    status: string;
    duration?: string;
    reason?: string;
    notes?: string;
  };
  onViewDetails: (appointment: any) => void;
  onCancelAppointment: (appointment: any) => void;
  onRescheduleAppointment: (appointment: any) => void;
  onSendMessage: (doctorId: string) => void;
  isPast?: boolean;
}

function PatientAppointmentCard({
  appointment,
  onViewDetails,
  onCancelAppointment,
  onRescheduleAppointment,
  onSendMessage,
  isPast = false,
}: PatientAppointmentCardProps) {
  const router = useRouter()

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
                appointment.status === "confirmed"
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : appointment.status === "pending"
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    : appointment.status === "completed"
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

        <Button
          size="sm"
          variant="ghost"
          className="text-xs"
          onClick={() => onSendMessage(appointment.doctorId)}
        >
          <MessageSquare className="mr-1 h-3 w-3" />
          Message
        </Button>

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
                <DropdownMenuItem onClick={() => onRescheduleAppointment(appointment)}>Reschedule</DropdownMenuItem>
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
