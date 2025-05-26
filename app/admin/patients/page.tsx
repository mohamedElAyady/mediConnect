import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PatientsManagement } from "@/components/admin-dashboard/patients-management"

export default function AdminPatientsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Patient Management" text="View and manage patients on the platform." />
      <PatientsManagement />
    </DashboardShell>
  )
}
