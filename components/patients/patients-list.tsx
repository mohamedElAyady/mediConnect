"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, FileText, MoreHorizontal, Phone, Mail, MapPin, User, Heart } from 'lucide-react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  bloodType: string;
  allergies: string[];
  conditions: string[];
  lastVisit: string;
  upcomingAppointment: string | null;
  medicalHistory: {
    date: string;
    diagnosis: string;
    treatment: string;
    notes: string;
  }[];
}

export function PatientsList() {
  const { user } = useUser()
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editedNotes, setEditedNotes] = useState("")

  // Get the Convex user ID first
  const convexUser = useQuery(api.users.getUserByClerkId, { clerkId: user?.id as string })

  // Get appointments with patient details
  const appointments = useQuery(api.appointments.getAppointments, {
    doctorId: convexUser?._id as string,
  })

  // Get unique patients from appointments
  const uniquePatients = appointments?.reduce((acc: Patient[], appointment) => {
    if (!acc.find(p => p.id === appointment.patientId)) {
      acc.push({
        id: appointment.patientId,
        name: appointment.patient?.name || "Unknown Patient",
        email: appointment.patient?.email || "No email",
        phone: appointment.patient?.phone || "No phone",
        avatar: appointment.patient?.avatar || "/placeholder.svg",
        gender: appointment.patient?.gender || "Not specified",
        dateOfBirth: appointment.patient?.dateOfBirth || "Not specified",
        address: appointment.patient?.address || "Not specified",
        bloodType: appointment.patient?.bloodType || "Not specified",
        allergies: appointment.patient?.allergies || [],
        conditions: appointment.patient?.conditions || [],
        lastVisit: appointment.date,
        upcomingAppointment: appointment.status === "confirmed" ? appointment.date : null,
        medicalHistory: [{
          date: appointment.date,
          diagnosis: appointment.reason || "No diagnosis",
          treatment: appointment.notes || "No treatment specified",
          notes: appointment.symptoms || "No symptoms recorded"
        }]
      });
    }
    return acc;
  }, []);

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setEditMode(false)
  }

  const handleEditNotes = () => {
    setEditMode(true)
    if (selectedPatient?.medicalHistory[0]) {
      setEditedNotes(selectedPatient.medicalHistory[0].notes)
    }
  }

  const handleSaveNotes = () => {
    // In a real app, this would call a Convex mutation to update the patient's notes
    console.log(`Saving notes for patient ${selectedPatient?.id}: ${editedNotes}`)
    setEditMode(false)
  }

  if (!uniquePatients || uniquePatients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <User className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No patients</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">You don't have any patients yet.</p>
        <Button>Add Your First Patient</Button>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {uniquePatients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} onViewPatient={handleViewPatient} />
        ))}
      </div>

      {/* Patient Details Dialog */}
      {selectedPatient && (
        <Dialog open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Patient Details</DialogTitle>
              <DialogDescription>View and manage patient information</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="flex flex-col items-center text-center mb-4">
                  <Avatar className="h-24 w-24 mb-2">
                    <AvatarImage src={selectedPatient.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{selectedPatient.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">{selectedPatient.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedPatient.gender}, {new Date().getFullYear() - new Date(selectedPatient.dateOfBirth).getFullYear()} years
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{selectedPatient.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{selectedPatient.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{selectedPatient.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Date of Birth</p>
                      <p className="text-sm text-muted-foreground">{selectedPatient.dateOfBirth}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Heart className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Blood Type</p>
                      <p className="text-sm text-muted-foreground">{selectedPatient.bloodType}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="font-medium mb-2">Allergies</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedPatient.allergies.length > 0 ? (
                        selectedPatient.allergies.map((allergy, index) => (
                          <Badge key={index} variant="secondary">
                            {allergy}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No known allergies</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="font-medium mb-2">Medical Conditions</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedPatient.conditions.map((condition, index) => (
                        <Badge key={index} variant="outline">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <Tabs defaultValue="history" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="history">Medical History</TabsTrigger>
                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
                  </TabsList>
                  <TabsContent value="history" className="mt-4 space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-base">Latest Visit</CardTitle>
                            <CardDescription>
                              {selectedPatient.medicalHistory[0]?.date || "No recent visits"}
                            </CardDescription>
                          </div>
                          {!editMode && (
                            <Button variant="outline" size="sm" onClick={handleEditNotes}>
                              Edit Notes
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {selectedPatient.medicalHistory.length > 0 ? (
                          <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <Label className="text-sm font-medium">Diagnosis</Label>
                                <p className="text-sm mt-1">{selectedPatient.medicalHistory[0].diagnosis}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Treatment</Label>
                                <p className="text-sm mt-1">{selectedPatient.medicalHistory[0].treatment}</p>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Notes</Label>
                              {editMode ? (
                                <Textarea
                                  className="mt-1"
                                  value={editedNotes}
                                  onChange={(e) => setEditedNotes(e.target.value)}
                                />
                              ) : (
                                <p className="text-sm mt-1">{selectedPatient.medicalHistory[0].notes}</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No medical history available.</p>
                        )}
                      </CardContent>
                      {editMode && (
                        <CardFooter className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setEditMode(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveNotes}>Save Notes</Button>
                        </CardFooter>
                      )}
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Medical History</CardTitle>
                        <CardDescription>Previous diagnoses and treatments</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[200px]">
                          <div className="space-y-4 pr-4">
                            {appointments?.filter(app => app.patientId === selectedPatient?.id)
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                              .map((appointment) => (
                                <div key={appointment._id} className="border-b pb-3 last:border-0 last:pb-0">
                                  <div className="flex justify-between">
                                    <p className="font-medium">{appointment.reason || "Office Visit"}</p>
                                    <p className="text-sm text-muted-foreground">{appointment.date}</p>
                                  </div>
                                  <p className="text-sm mt-1">{appointment.notes || "No treatment specified"}</p>
                                  <p className="text-sm text-muted-foreground mt-1">{appointment.symptoms || "No symptoms recorded"}</p>
                                </div>
                              ))}
                            </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="appointments" className="mt-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-base">Appointments</CardTitle>
                            <CardDescription>Past and upcoming appointments</CardDescription>
                          </div>
                          <Button size="sm">Schedule Appointment</Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-4 pr-4">
                            {appointments?.filter(app => app.patientId === selectedPatient?.id)
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                              .map((appointment) => (
                              <div key={appointment._id} className="border-b pb-3 last:border-0 last:pb-0">
                              <div className="flex justify-between">
                                <div>
                                    <Badge className={appointment.status === "confirmed" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"}>
                                      {appointment.status}
                                    </Badge>
                                    <p className="font-medium mt-1">{appointment.reason || "Office Visit"}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {appointment.type} • {appointment.duration} min
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">{appointment.date}</p>
                                    <p className="text-sm text-muted-foreground">{appointment.time}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedPatient(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

interface PatientCardProps {
  patient: Patient;
  onViewPatient: (patient: Patient) => void;
}

function PatientCard({ patient, onViewPatient }: PatientCardProps) {
  const router = useRouter()
  const createConversation = useMutation(api.conversations.createDoctorPatientConversation)
  const { user } = useUser()
  const convexUser = useQuery(api.users.getUserByClerkId, { clerkId: user?.id || "" })

  const handleSendMessage = async () => {
    if (!user?.id || !convexUser) return

    try {
      // Create or get existing conversation
      const conversationId = await createConversation({
        doctorId: convexUser._id,
        patientId: patient.id as Id<"users">,
      })

      // Navigate to conversations with the new conversation selected
      router.push(`/doctor/conversations?conversation=${conversationId}`)
    } catch (error) {
      console.error("Error creating conversation:", error)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={patient.avatar || "/placeholder.svg"} />
              <AvatarFallback>{patient.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{patient.name}</CardTitle>
              <CardDescription>
                {patient.gender}, {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewPatient(patient)}>View Details</DropdownMenuItem>
              <DropdownMenuItem>Schedule Appointment</DropdownMenuItem>
              <DropdownMenuItem onClick={handleSendMessage}>Send Message</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Remove Patient
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{patient.phone}</span>
          </div>
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{patient.email}</span>
          </div>
          <div className="flex items-start text-sm">
            <FileText className="mr-2 h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <span className="font-medium">Conditions:</span>{" "}
              <span className="text-muted-foreground">{patient.conditions.join(", ")}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          <span>Last visit: {patient.lastVisit}</span>
        </div>
        <Button size="sm" variant="outline" onClick={() => onViewPatient(patient)}>
          View
        </Button>
      </CardFooter>
    </Card>
  )
}
