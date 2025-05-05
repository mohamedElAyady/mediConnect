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

// Mock data - would come from Convex in a real app
const patients = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "sarah.johnson@example.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-06-15",
    gender: "Female",
    address: "123 Main St, Anytown, CA 94321",
    bloodType: "A+",
    allergies: ["Penicillin", "Peanuts"],
    conditions: ["Hypertension", "Asthma"],
    lastVisit: "2025-03-10",
    upcomingAppointment: "2025-04-20",
    medicalHistory: [
      {
        date: "2025-03-10",
        diagnosis: "Hypertension follow-up",
        treatment: "Continued lisinopril 10mg daily",
        notes: "Blood pressure well-controlled. Continue current regimen.",
      },
      {
        date: "2024-12-05",
        diagnosis: "Upper respiratory infection",
        treatment: "Prescribed amoxicillin 500mg TID for 10 days",
        notes: "Patient reported fever and cough for 3 days.",
      },
    ],
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "michael.chen@example.com",
    phone: "(555) 987-6543",
    dateOfBirth: "1978-09-23",
    gender: "Male",
    address: "456 Oak Ave, Somewhere, NY 10001",
    bloodType: "O-",
    allergies: ["Sulfa drugs"],
    conditions: ["Type 2 Diabetes", "High Cholesterol"],
    lastVisit: "2025-02-18",
    upcomingAppointment: "2025-05-15",
    medicalHistory: [
      {
        date: "2025-02-18",
        diagnosis: "Diabetes follow-up",
        treatment: "Adjusted metformin to 1000mg BID",
        notes: "HbA1c improved to 6.8%. Continue diet and exercise plan.",
      },
      {
        date: "2024-11-12",
        diagnosis: "Annual physical",
        treatment: "Continued atorvastatin 20mg daily",
        notes: "Cholesterol levels improved. Encouraged more regular exercise.",
      },
    ],
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "emily.rodriguez@example.com",
    phone: "(555) 456-7890",
    dateOfBirth: "1992-03-30",
    gender: "Female",
    address: "789 Pine St, Elsewhere, TX 75001",
    bloodType: "B+",
    allergies: [],
    conditions: ["Migraine", "Anxiety"],
    lastVisit: "2025-03-25",
    upcomingAppointment: "2025-04-28",
    medicalHistory: [
      {
        date: "2025-03-25",
        diagnosis: "Migraine follow-up",
        treatment: "Prescribed sumatriptan as needed",
        notes: "Frequency of migraines reduced with current preventive medication.",
      },
      {
        date: "2024-10-15",
        diagnosis: "Anxiety",
        treatment: "Started sertraline 50mg daily",
        notes: "Patient reported increased stress at work. Recommended counseling.",
      },
    ],
  },
  {
    id: "4",
    name: "David Kim",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "david.kim@example.com",
    phone: "(555) 789-0123",
    dateOfBirth: "1965-11-08",
    gender: "Male",
    address: "101 Cedar Rd, Nowhere, WA 98001",
    bloodType: "AB+",
    allergies: ["Latex", "Shellfish"],
    conditions: ["Osteoarthritis", "GERD"],
    lastVisit: "2025-01-20",
    upcomingAppointment: null,
    medicalHistory: [
      {
        date: "2025-01-20",
        diagnosis: "Osteoarthritis follow-up",
        treatment: "Recommended physical therapy, prescribed naproxen as needed",
        notes: "Joint pain improved with current regimen. Encouraged weight loss.",
      },
      {
        date: "2024-09-05",
        diagnosis: "GERD",
        treatment: "Prescribed omeprazole 20mg daily",
        notes: "Advised dietary modifications and elevation of head during sleep.",
      },
    ],
  },
]

export function PatientsList() {
  const [selectedPatient, setSelectedPatient] = useState<(typeof patients)[0] | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editedNotes, setEditedNotes] = useState("")

  const handleViewPatient = (patient: (typeof patients)[0]) => {
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

  if (patients.length === 0) {
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
        {patients.map((patient) => (
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
                          {selectedPatient.medicalHistory.length > 0 ? (
                            <div className="space-y-4">
                              {selectedPatient.medicalHistory.map((record, index) => (
                                <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                                  <div className="flex justify-between">
                                    <p className="font-medium">{record.diagnosis}</p>
                                    <p className="text-sm text-muted-foreground">{record.date}</p>
                                  </div>
                                  <p className="text-sm mt-1">{record.treatment}</p>
                                  <p className="text-sm text-muted-foreground mt-1">{record.notes}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No medical history available.</p>
                          )}
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
                        <div className="space-y-4">
                          {selectedPatient.upcomingAppointment ? (
                            <div className="border-b pb-3">
                              <div className="flex justify-between">
                                <div>
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Upcoming</Badge>
                                  <p className="font-medium mt-1">Regular Check-up</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">{selectedPatient.upcomingAppointment}</p>
                                  <p className="text-sm text-muted-foreground">10:30 AM</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
                          )}

                          <div className="border-b pb-3">
                            <div className="flex justify-between">
                              <div>
                                <Badge variant="outline">Past</Badge>
                                <p className="font-medium mt-1">
                                  {selectedPatient.medicalHistory[0]?.diagnosis || "Office Visit"}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">{selectedPatient.lastVisit}</p>
                                <p className="text-sm text-muted-foreground">09:15 AM</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          View All Appointments
                        </Button>
                      </CardFooter>
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
  patient: (typeof patients)[0]
  onViewPatient: (patient: (typeof patients)[0]) => void
}

function PatientCard({ patient, onViewPatient }: PatientCardProps) {
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
              <DropdownMenuItem>Send Message</DropdownMenuItem>
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
