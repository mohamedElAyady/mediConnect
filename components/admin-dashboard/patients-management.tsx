"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Edit,
  Trash,
  Download,
  FileText,
  Calendar,
  UserX,
  UserCheck,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Skeleton } from "@/components/ui/skeleton"

export function PatientsManagement() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch patients data
  const patients = useQuery(api.users.getAllUsers, {
    role: "patient",
    paginationOpts: { numItems: 50, cursor: null }
  })

  // Fetch all appointments
  const appointments = useQuery(api.appointments.getAppointments, {})

  // Filter patients based on active tab and search query
  const filteredPatients = patients?.page.filter((patient) => {
    const matchesSearch = searchQuery === "" || 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  }) ?? []

  // Get patient appointments and last appointment
  const getPatientAppointments = (patientId: string) => {
    if (!appointments) return { count: 0, lastAppointment: null }
    
    const patientAppointments = appointments.filter(apt => apt.patientId === patientId)
    const sortedAppointments = patientAppointments.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    
    return {
      count: patientAppointments.length,
      lastAppointment: sortedAppointments[0]?.date || null
    }
  }

  if (!patients || !appointments) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Patients</CardTitle>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-[200px]" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-[400px]" />
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Appointments</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Medical Info</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-12 w-[200px]" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-[40px]" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                      <TableCell><Skeleton className="h-12 w-[150px]" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Patients</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search patients..."
                  className="w-full rounded-md pl-8 md:w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter Patients</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span>With appointments</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>No appointments</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>With medical conditions</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>With allergies</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Export List</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Patients</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="suspended">Suspended</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Appointments</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead>Medical Info</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => {
                      const { count, lastAppointment } = getPatientAppointments(patient._id)
                      return (
                        <TableRow key={patient._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                                <AvatarFallback>{patient.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{patient.name}</p>
                                <p className="text-sm text-muted-foreground">{patient.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{count}</TableCell>
                          <TableCell>
                            {lastAppointment ? new Date(lastAppointment).toLocaleDateString() : "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium">Age:</span>
                                <span className="text-xs">{patient.dateOfBirth ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() : "N/A"}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium">Blood:</span>
                                <span className="text-xs">{patient.bloodType || "N/A"}</span>
                              </div>
                              {patient.conditions?.length && patient.conditions.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {patient.conditions.slice(0, 2).map((condition: string, i: number) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {condition}
                                    </Badge>
                                  ))}
                                  {patient.conditions?.length && patient.conditions.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{patient.conditions.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Dialog>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem onSelect={() => setSelectedPatient(patient)}>
                                      <FileText className="mr-2 h-4 w-4" />
                                      <span>View Details</span>
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Mail className="mr-2 h-4 w-4" />
                                    <span>Contact</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <span>Appointments</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Patient Details Dialog */}
      <Dialog>
        <DialogContent className="max-w-3xl">
          {selectedPatient && (
            <>
              <DialogHeader>
                <DialogTitle>Patient Details</DialogTitle>
                <DialogDescription>Complete information about {selectedPatient.name}</DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedPatient.avatar || "/placeholder.svg"} alt={selectedPatient.name} />
                      <AvatarFallback className="text-lg">{selectedPatient.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{selectedPatient.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedPatient.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Personal Information</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Age</p>
                        <p className="font-medium">{selectedPatient.dateOfBirth ? new Date().getFullYear() - new Date(selectedPatient.dateOfBirth).getFullYear() : "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Gender</p>
                        <p className="font-medium">{selectedPatient.gender || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-medium">{selectedPatient.phone || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Joined</p>
                        <p className="font-medium">{selectedPatient._creationTime ? new Date(selectedPatient._creationTime).toLocaleDateString() : "N/A"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Address</p>
                        <p className="font-medium">{selectedPatient.address || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Medical Information</h4>
                    <div className="rounded-md border p-3 space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Blood Type</p>
                        <p className="text-sm font-medium">{selectedPatient.bloodType || "N/A"}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Medical Conditions</p>
                        {selectedPatient.conditions?.length > 0 ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedPatient.conditions.map((condition: string, i: number) => (
                              <Badge key={i} variant="outline">
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm">No known conditions</p>
                        )}
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Allergies</p>
                        {selectedPatient.allergies?.length > 0 ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedPatient.allergies.map((allergy: string, i: number) => (
                              <Badge key={i} variant="outline" className="bg-red-50">
                                {allergy}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm">No known allergies</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Appointment History</h4>
                    <Card className="p-3">
                      {(() => {
                        const { count, lastAppointment } = getPatientAppointments(selectedPatient._id)
                        return (
                          <>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-muted-foreground">Total Appointments</p>
                              <span className="font-medium">{count}</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <p className="text-sm text-muted-foreground">Last Appointment</p>
                              <span className="font-medium">
                                {lastAppointment
                                  ? new Date(lastAppointment).toLocaleDateString()
                                  : "N/A"}
                              </span>
                            </div>
                            <Button size="sm" className="mt-3 w-full">
                              <Calendar className="mr-2 h-4 w-4" />
                              View All Appointments
                            </Button>
                          </>
                        )
                      })()}
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Administrative Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" className="flex items-center">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                      <Button variant="outline" className="flex items-center">
                        <Mail className="mr-2 h-4 w-4" />
                        Contact Patient
                      </Button>
                      <Button variant="destructive" className="flex items-center">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Notes</h4>
                    <textarea
                      className="w-full rounded-md border p-2 text-sm"
                      rows={4}
                      placeholder="Add administrative notes about this patient..."
                    />
                    <Button size="sm">Save Notes</Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
