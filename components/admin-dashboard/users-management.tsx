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
import { Search, Filter, MoreHorizontal, UserCheck, UserX, Mail, Edit, Trash, Download, UserCog, Calendar, FileText } from "lucide-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Skeleton } from "../ui/skeleton"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { UserDetailsDialog } from "./user-details-dialog"
import { toast } from "sonner"
import { Id } from "@/convex/_generated/dataModel"

export function UsersManagement() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)

  // Fetch users data
  const users = useQuery(api.users.getAllUsers, {
    paginationOpts: { numItems: 50, cursor: null }
  })

  // Fetch appointments for patients
  const appointments = useQuery(api.appointments.getAppointments, {})

  // Delete mutation
  const deleteUser = useMutation(api.users.softDeleteUser)

  // Handle delete
  const handleDelete = async (userId: string) => {
    try {
      await deleteUser({ userId: userId as Id<"users"> })
      toast.success("User deleted successfully")
    } catch (error) {
      toast.error("Failed to delete user")
      console.error(error)
    }
  }

  // Handle contact
  const handleContact = (email: string) => {
    window.location.href = `mailto:${email}`
  }

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

  // Filter users based on active tab and search
  const filteredUsers = users?.page.filter((user) => {
    // First check if user is deleted
    if (activeTab === "deleted") {
      if (!user.isDeleted) return false;
    } else {
      if (user.isDeleted) return false;
    }

    // Then check role and search
    const matchesTab = activeTab === "all" ||
      activeTab === "deleted" ||
      (activeTab === "doctors" && user.role === "doctor") ||
      (activeTab === "patients" && user.role === "patient") ||
      (activeTab === "admins" && user.role === "admin")

    const matchesSearch = searchQuery === "" || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesSearch
  }) ?? []

  if (!users || !appointments) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Users</CardTitle>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-[200px]" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-[100px]" />
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
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-12 w-[200px]" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
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
            <CardTitle>Users</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
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
                  <DropdownMenuLabel>Filter Users</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserCheck className="mr-2 h-4 w-4" />
                    <span>Verified</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UserX className="mr-2 h-4 w-4" />
                    <span>Unverified</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Export Users</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button>
                <UserCog className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="doctors">Doctors</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
              <TabsTrigger value="deleted">Deleted Users</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      {activeTab === "patients" ? (
                        <>
                          <TableHead>Appointments</TableHead>
                          <TableHead>Last Visit</TableHead>
                          <TableHead>Medical Info</TableHead>
                        </>
                      ) : activeTab === "doctors" ? (
                        <>
                          <TableHead>Specialty</TableHead>
                          <TableHead>Experience</TableHead>
                          <TableHead>Rating</TableHead>
                        </>
                      ) : (
                        <>
                          <TableHead>Role</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Location</TableHead>
                        </>
                      )}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => {
                      if (activeTab === "patients") {
                        const { count, lastAppointment } = getPatientAppointments(user._id)
                        return (
                          <TableRow key={user._id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                  <AvatarFallback>{user.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
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
                                  <span className="text-xs">{user.dateOfBirth ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear() : "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs font-medium">Blood:</span>
                                  <span className="text-xs">{user.bloodType || "N/A"}</span>
                                </div>
                                {user.conditions?.length && user.conditions.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {user.conditions.slice(0, 2).map((condition: string, i: number) => (
                                      <Badge key={i} variant="outline" className="text-xs">
                                        {condition}
                                      </Badge>
                                    ))}
                                    {user.conditions?.length && user.conditions.length > 2 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{user.conditions.length - 2}
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
                                      <DropdownMenuItem onSelect={() => setSelectedUser(user)}>
                                        <FileText className="mr-2 h-4 w-4" />
                                        <span>View Details</span>
                                      </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DropdownMenuItem onSelect={() => handleContact(user.email)}>
                                      <Mail className="mr-2 h-4 w-4" />
                                      <span>Contact</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Calendar className="mr-2 h-4 w-4" />
                                      <span>Appointments</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      className="text-destructive"
                                      onSelect={() => handleDelete(user._id)}
                                    >
                                      <Trash className="mr-2 h-4 w-4" />
                                      <span>Delete</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        )
                      }

                      if (activeTab === "doctors") {
                        return (
                          <TableRow key={user._id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                  <AvatarFallback>{user.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium">{user.specialty || "General Practitioner"}</p>
                                {user.licenseNumber && (
                                  <p className="text-xs text-muted-foreground">License: {user.licenseNumber}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="text-sm">{user.experience || "Not specified"} years</p>
                                {user.education ? (
                                  <div className="flex flex-col gap-1">
                                    {JSON.parse(user.education).map((edu: any, index: number) => (
                                      <div key={index} className="flex items-center gap-1">
                                        <span className="text-xs font-medium">{edu.degree}</span>
                                        <span className="text-xs text-muted-foreground">•</span>
                                        <span className="text-xs text-muted-foreground">{edu.institution}</span>
                                        <span className="text-xs text-muted-foreground">({edu.year})</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-muted-foreground">Education not specified</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">{user.rating || 0}</span>
                                  <span className="text-xs text-muted-foreground">({user.reviews || 0} reviews)</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Fee: ${user.consultationFee || 0}
                                </p>
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
                                      <DropdownMenuItem onSelect={() => setSelectedUser(user)}>
                                        <FileText className="mr-2 h-4 w-4" />
                                        <span>View Details</span>
                                      </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DropdownMenuItem onSelect={() => handleContact(user.email)}>
                                      <Mail className="mr-2 h-4 w-4" />
                                      <span>Contact</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Calendar className="mr-2 h-4 w-4" />
                                      <span>Schedule</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      className="text-destructive"
                                      onSelect={() => handleDelete(user._id)}
                                    >
                                      <Trash className="mr-2 h-4 w-4" />
                                      <span>Delete</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        )
                      }

                      return (
                        <TableRow key={user._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback>{user.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.role === "doctor" ? "default" : user.role === "patient" ? "secondary" : "outline"
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-sm">{user.phone || "No phone"}</p>
                              <p className="text-xs text-muted-foreground">{user.address || "No address"}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{user.location || "Location not specified"}</p>
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
                                    <DropdownMenuItem onSelect={() => setSelectedUser(user)}>
                                      <FileText className="mr-2 h-4 w-4" />
                                      <span>View Details</span>
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                  <DropdownMenuItem onSelect={() => handleContact(user.email)}>
                                    <Mail className="mr-2 h-4 w-4" />
                                    <span>Contact</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onSelect={() => handleDelete(user._id)}
                                  >
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

      <UserDetailsDialog
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        getPatientAppointments={activeTab === "patients" ? getPatientAppointments : undefined}
      />
    </>
  )
}
