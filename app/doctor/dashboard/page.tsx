import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AppointmentList } from "@/components/doctor/appointment-list"
import { StatsCards } from "@/components/doctor/stats-cards"

export default function DoctorDashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Doctor Dashboard" text="Manage your appointments and patient care." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCards />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentList />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">You have no unread messages.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

