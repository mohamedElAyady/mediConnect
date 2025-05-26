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
  UserCheck,
  UserX,
  Mail,
  Edit,
  Trash,
  Download,
  FileText,
  Star,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function DoctorsManagement() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedDoctor, setSelectedDoctor] = useState(null)

  // Mock data for doctors
  const doctors = [
    {
      id: "d1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@example.com",
      specialty: "Cardiology",
      status: "active",
      verified: true,
      joinDate: "2023-01-15",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SJ",
      rating: 4.8,
      appointments: 156,
      patients: 87,
      licenseNumber: "MD12345",
      education: "Harvard Medical School",
      experience: "12 years",
      location: "New York, NY",
    },
    {
      id: "d2",
      name: "Dr. Robert Garcia",
      email: "robert.garcia@example.com",
      specialty: "Neurology",
      status: "pending",
      verified: false,
      joinDate: "2023-03-05",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "RG",
      rating: 0,
      appointments: 0,
      patients: 0,
      licenseNumber: "MD54321",
      education: "Johns Hopkins University",
      experience: "8 years",
      location: "Baltimore, MD",
    },
    {
      id: "d3",
      name: "Dr. Lisa Martinez",
      email: "lisa.martinez@example.com",
      specialty: "Dermatology",
      status: "pending",
      verified: false,
      joinDate: "2023-03-18",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "LM",
      rating: 0,
      appointments: 0,
      patients: 0,
      licenseNumber: "MD98765",
      education: "Stanford University",
      experience: "5 years",
      location: "San Francisco, CA",
    },
    {
      id: "d4",
      name: "Dr. David Kim",
      email: "david.kim@example.com",
      specialty: "Pediatrics",
      status: "suspended",
      verified: true,
      joinDate: "2023-01-30",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DK",
      rating: 4.2,
      appointments: 78,
      patients: 45,
      licenseNumber: "MD24680",
      education: "UCLA Medical School",
      experience: "7 years",
      location: "Los Angeles, CA",
    },
    {
      id: "d5",
      name: "Dr. Emily Wilson",
      email: "emily.wilson@example.com",
      specialty: "Obstetrics & Gynecology",
      status: "active",
      verified: true,
      joinDate: "2022-11-12",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "EW",
      rating: 4.9,
      appointments: 210,
      patients: 124,
      licenseNumber: "MD13579",
      education: "University of Pennsylvania",
      experience: "10 years",
      location: "Philadelphia, PA",
    },
    {
      id: "d6",
      name: "Dr. James Rodriguez",
      email: "james.rodriguez@example.com",
      specialty: "Orthopedics",
      status: "active",
      verified: true,
      joinDate: "2022-12-05",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JR",
      rating: 4.6,
      appointments: 185,
      patients: 92,
      licenseNumber: "MD97531",
      education: "Mayo Medical School",
      experience: "15 years",
      location: "Rochester, MN",
    },
  ]

  // Filter doctors based on active tab
  const filteredDoctors = doctors.filter((doctor) => {
    if (activeTab === "all") return true
    if (activeTab === "verified") return doctor.verified
    if (activeTab === "pending") return doctor.status === "pending"
    if (activeTab === "suspended") return doctor.status === "suspended"
    return true
  })

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Doctors</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search doctors..."
                  className="w-full rounded-md pl-8 md:w-[200px] lg:w-[300px]"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter Doctors</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span>Cardiology</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Neurology</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Dermatology</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Pediatrics</span>
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
              <TabsTrigger value="all">All Doctors</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="suspended">Suspended</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Specialty</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Patients</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDoctors.map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
                              <AvatarFallback>{doctor.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{doctor.name}</p>
                              <p className="text-sm text-muted-foreground">{doctor.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{doctor.specialty}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              doctor.status === "active"
                                ? "success"
                                : doctor.status === "pending"
                                  ? "warning"
                                  : "destructive"
                            }
                          >
                            {doctor.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {doctor.verified ? "Verified" : "Unverified"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {doctor.rating > 0 ? (
                              <>
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                <span>{doctor.rating}</span>
                              </>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{doctor.patients}</TableCell>
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
                                  <DropdownMenuItem onSelect={() => setSelectedDoctor(doctor)}>
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
                                {!doctor.verified && (
                                  <DropdownMenuItem>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    <span>Verify</span>
                                  </DropdownMenuItem>
                                )}
                                {doctor.status !== "suspended" ? (
                                  <DropdownMenuItem>
                                    <UserX className="mr-2 h-4 w-4" />
                                    <span>Suspend</span>
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    <span>Reactivate</span>
                                  </DropdownMenuItem>
                                )}
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Doctor Details Dialog */}
      <Dialog>
        <DialogContent className="max-w-3xl">
          {selectedDoctor && (
            <>
              <DialogHeader>
                <DialogTitle>Doctor Details</DialogTitle>
                <DialogDescription>Complete information about {selectedDoctor.name}</DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedDoctor.avatar || "/placeholder.svg"} alt={selectedDoctor.name} />
                      <AvatarFallback className="text-lg">{selectedDoctor.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{selectedDoctor.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedDoctor.email}</p>
                      <div className="mt-1 flex items-center">
                        <Badge
                          variant={
                            selectedDoctor.status === "active"
                              ? "success"
                              : selectedDoctor.status === "pending"
                                ? "warning"
                                : "destructive"
                          }
                        >
                          {selectedDoctor.status}
                        </Badge>
                        <span className="ml-2 text-sm text-muted-foreground">
                          {selectedDoctor.verified ? "Verified" : "Unverified"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Professional Information</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Specialty</p>
                        <p className="font-medium">{selectedDoctor.specialty}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">License Number</p>
                        <p className="font-medium">{selectedDoctor.licenseNumber}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Education</p>
                        <p className="font-medium">{selectedDoctor.education}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Experience</p>
                        <p className="font-medium">{selectedDoctor.experience}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-medium">{selectedDoctor.location}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Joined</p>
                        <p className="font-medium">{new Date(selectedDoctor.joinDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Verification Documents</h4>
                    <div className="rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Medical License</span>
                        </div>
                        {selectedDoctor.verified ? (
                          <Badge variant="success" className="flex items-center">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline">
                            Verify
                          </Button>
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Medical Degree</span>
                        </div>
                        {selectedDoctor.verified ? (
                          <Badge variant="success" className="flex items-center">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline">
                            Verify
                          </Button>
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">ID Verification</span>
                        </div>
                        {selectedDoctor.verified ? (
                          <Badge variant="success" className="flex items-center">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline">
                            Verify
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">Rating</p>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="font-medium">{selectedDoctor.rating || "N/A"}</span>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">Appointments</p>
                          <span className="font-medium">{selectedDoctor.appointments}</span>
                        </div>
                      </Card>
                      <Card className="p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">Patients</p>
                          <span className="font-medium">{selectedDoctor.patients}</span>
                        </div>
                      </Card>
                      <Card className="p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">Completion Rate</p>
                          <span className="font-medium">{selectedDoctor.appointments > 0 ? "98%" : "N/A"}</span>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Administrative Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      {!selectedDoctor.verified && (
                        <Button className="flex items-center">
                          <UserCheck className="mr-2 h-4 w-4" />
                          Verify Doctor
                        </Button>
                      )}
                      {selectedDoctor.status === "pending" && (
                        <Button variant="outline" className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                      )}
                      {selectedDoctor.status === "suspended" ? (
                        <Button variant="outline" className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Reactivate
                        </Button>
                      ) : (
                        <Button variant="outline" className="flex items-center">
                          <XCircle className="mr-2 h-4 w-4" />
                          Suspend
                        </Button>
                      )}
                      <Button variant="outline" className="flex items-center">
                        <Mail className="mr-2 h-4 w-4" />
                        Contact
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
                      placeholder="Add administrative notes about this doctor..."
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
