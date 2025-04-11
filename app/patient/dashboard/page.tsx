import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PatientAppointmentList } from "@/components/patient/patient-appointment-list"
import { DoctorSearchPreview } from "@/components/patient/doctor-search-preview"

export default function PatientDashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Patient Dashboard" text="Manage your appointments and health records." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Your Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <PatientAppointmentList />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Find Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <DoctorSearchPreview />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

