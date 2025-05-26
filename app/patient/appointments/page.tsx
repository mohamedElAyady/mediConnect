import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PatientAppointmentsView } from "@/components/patient-appointments/patient-appointments-view"

export default function PatientAppointmentsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="My Appointments" text="View and manage your upcoming and past medical appointments." />
      <PatientAppointmentsView />
    </DashboardShell>
  )
}
