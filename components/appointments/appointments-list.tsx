"use client"

import { useState, useEffect } from "react"
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
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { format, isToday, isTomorrow, parseISO } from "date-fns"

export function AppointmentsList() {
  const { user } = useUser()
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [notes, setNotes] = useState("")
  const [symptoms, setSymptoms] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Get the Convex user ID first
  const convexUser = useQuery(api.users.getUserByClerkId, { clerkId: user?.id as string })

  // Get appointments only for doctors
  const appointments = useQuery(api.appointments.getAppointments, {
    doctorId: convexUser?._id,
  })

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

  const updateAppointment = useMutation(api.appointments.updateAppointment)

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment)
    setNotes(appointment.notes || "")
    setSymptoms(appointment.symptoms || "")
  }

  const handleCancelAppointment = (appointment: any) => {
    setSelectedAppointment(appointment)
    setCancelDialogOpen(true)
  }

  const confirmCancellation = async () => {
    if (!selectedAppointment) return

    try {
      await updateAppointment({
        id: selectedAppointment._id,
        status: "Cancelled",
        cancellationReason: cancelReason,
      })

      setCancelDialogOpen(false)
      setCancelReason("")
      setSelectedAppointment(null)
    } catch (error) {
      console.error("Failed to cancel appointment:", error)
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedAppointment) return
    setIsSaving(true)
    try {
      await updateAppointment({
        id: selectedAppointment._id,
        notes: notes,
      })
    } catch (error) {
      console.error("Failed to save notes:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveSymptoms = async () => {
    if (!selectedAppointment) return
    setIsSaving(true)
    try {
      await updateAppointment({
        id: selectedAppointment._id,
        symptoms: symptoms,
      })
    } catch (error) {
      console.error("Failed to save symptoms:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Group appointments by date
  const groupedAppointments = appointments?.reduce((groups: any, appointment) => {
    const date = appointment.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(appointment)
    return groups
  }, {})

  if (!appointments || appointments.length === 0) {
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
        {groupedAppointments && Object.entries(groupedAppointments as Record<string, any[]>).map(([date, appointments]) => {
          const formattedDate = parseISO(date)
          const dateLabel = isToday(formattedDate)
            ? "Today"
            : isTomorrow(formattedDate)
            ? "Tomorrow"
            : format(formattedDate, "MMMM d, yyyy")

          return (
            <div key={date}>
              <h3 className="text-lg font-semibold mb-3">{dateLabel}</h3>
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                    onViewDetails={handleViewDetails}
                    onCancelAppointment={handleCancelAppointment}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Appointment Details Dialog */}
      {selectedAppointment && (
        <Dialog
          open={!!selectedAppointment && !cancelDialogOpen}
          onOpenChange={(open) => !open && setSelectedAppointment(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>View and manage appointment information</DialogDescription>
            </DialogHeader>

            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {/* Patient Info Section */}
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedAppointment.patient?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{selectedAppointment.patient?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-lg">{selectedAppointment.patient?.name}</h3>
                    <p className="text-sm text-muted-foreground">Patient</p>
                    <p className="text-sm text-muted-foreground">{selectedAppointment.patient?.email}</p>
                    {selectedAppointment.patient?.phone && (
                      <p className="text-sm text-muted-foreground">{selectedAppointment.patient.phone}</p>
                    )}
                    {selectedAppointment.patient?.location && (
                      <p className="text-sm text-muted-foreground">{selectedAppointment.patient.location}</p>
                    )}
                  </div>
                </div>

                {/* Appointment Details Section */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium text-lg">Appointment Information</h4>
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
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {selectedAppointment.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes and Symptoms Section */}
                <div className="space-y-4">
                  <Tabs defaultValue="notes" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                      <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
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
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </CardContent>
                        <CardFooter className="flex justify-end">
                          <Button onClick={handleSaveNotes} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Notes"}
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                    <TabsContent value="symptoms" className="mt-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Patient Symptoms</CardTitle>
                          <CardDescription>Reported symptoms and concerns</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Textarea
                            className="min-h-[150px]"
                            placeholder="Add symptoms and concerns..."
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                          />
                        </CardContent>
                        <CardFooter className="flex justify-end">
                          <Button onClick={handleSaveSymptoms} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Symptoms"}
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="flex justify-between sm:justify-between mt-4">
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
                {selectedAppointment.type === "Video Consultation" && selectedAppointment.status === "confirmed" && (
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
  appointment: any
  onViewDetails: (appointment: any) => void
  onCancelAppointment: (appointment: any) => void
}

function AppointmentCard({ appointment, onViewDetails, onCancelAppointment }: AppointmentCardProps) {
  const updateAppointment = useMutation(api.appointments.updateAppointment)

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateAppointment({
        id: appointment._id,
        status: newStatus,
      })
    } catch (error) {
      console.error("Failed to update appointment status:", error)
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={appointment.patient?.avatar || "/placeholder.svg"} />
          <AvatarFallback>{appointment.patient?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium">{appointment.patient?.name}</h4>
          <p className="text-sm text-muted-foreground">{appointment.patient?.email}</p>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
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
                    : appointment.status === "completed"
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
              }`}
            >
              {appointment.status}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Reason: {appointment.reason}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {appointment.type === "Video Consultation" && appointment.status === "confirmed" && (
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
            {appointment.status === "pending" && (
              <DropdownMenuItem onClick={() => handleStatusChange("confirmed")}>
                Mark as Confirmed
              </DropdownMenuItem>
            )}
            {appointment.status === "confirmed" && (
              <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
                Mark as Completed
              </DropdownMenuItem>
            )}
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
