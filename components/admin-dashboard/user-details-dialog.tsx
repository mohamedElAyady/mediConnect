import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit, Mail, Calendar, Trash } from "lucide-react"

interface UserDetailsDialogProps {
  user: any
  isOpen: boolean
  onClose: () => void
  getPatientAppointments?: (patientId: string) => { count: number; lastAppointment: string | null }
}

export function UserDetailsDialog({ user, isOpen, onClose, getPatientAppointments }: UserDetailsDialogProps) {
  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl  max-h-[90vh]">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Complete information about {user.name}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4 md:grid-cols-2  max-h-[75vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-lg">{user.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge variant={user.role === "doctor" ? "default" : user.role === "patient" ? "secondary" : "outline"}>
                  {user.role}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Contact Information</h4>
              <div className="rounded-md border p-3 space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm">{user.phone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm">{user.address || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm">{user.location || "Not provided"}</p>
                </div>
              </div>
            </div>

            {user.role === "doctor" && (
              <>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Professional Information</h4>
                  <div className="rounded-md border p-3 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Specialty</p>
                      <p className="text-sm">{user.specialty || "General Practitioner"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">License Number</p>
                      <p className="text-sm">{user.licenseNumber || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Education</p>
                      {user.education ? (
                        <div className="mt-2 space-y-3">
                          {JSON.parse(user.education).map((edu: any, index: number) => (
                            <div key={index} className="relative pl-6 border-l-2 border-muted">
                              <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary" />
                              <div className="space-y-1">
                                <p className="text-sm font-medium">{edu.degree}</p>
                                <p className="text-xs text-muted-foreground">{edu.institution}</p>
                                <p className="text-xs text-muted-foreground">{edu.year}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm">Not provided</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Experience</p>
                      <p className="text-sm">{user.experience || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Consultation Fee</p>
                      <p className="text-sm">${user.consultationFee || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Languages & Insurance</h4>
                  <div className="rounded-md border p-3 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Languages</p>
                      {user.languages?.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.languages.map((language: string, i: number) => (
                            <Badge key={i} variant="outline">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm">Not specified</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Accepted Insurance</p>
                      {user.insurances?.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.insurances.map((insurance: string, i: number) => (
                            <Badge key={i} variant="outline">
                              {insurance}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm">Not specified</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {user.role === "patient" && (
              <>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Medical Information</h4>
                  <div className="rounded-md border p-3 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Age</p>
                      <p className="text-sm">
                        {user.dateOfBirth 
                          ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear()
                          : "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Gender</p>
                      <p className="text-sm">{user.gender || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Blood Type</p>
                      <p className="text-sm">{user.bloodType || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Medical Conditions</p>
                      {user.conditions?.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.conditions.map((condition: string, i: number) => (
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
                      {user.allergies?.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.allergies.map((allergy: string, i: number) => (
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

                {getPatientAppointments && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Appointment History</h4>
                    <Card className="p-3">
                      {(() => {
                        const { count, lastAppointment } = getPatientAppointments(user._id)
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
                )}
              </>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Account Information</h4>
              <div className="rounded-md border p-3 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="text-sm">{new Date(user._creationTime).toLocaleDateString()}</p>
                </div>
                {user.role === "doctor" && (
                  <>
                    <div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                      <p className="text-sm">{user.rating || 0} ({user.reviews || 0} reviews)</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Accepting New Patients</p>
                      <p className="text-sm">{user.acceptingNewPatients ? "Yes" : "No"}</p>
                    </div>
                  </>
                )}
              </div>
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
                  Contact User
                </Button>
                <Button variant="destructive" className="flex items-center">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </div>

            {user.bio && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">About</h4>
                <div className="rounded-md border p-3">
                  <p className="text-sm">{user.bio}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 