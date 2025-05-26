import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DoctorsManagement } from "@/components/admin-dashboard/doctors-management"

export default function AdminDoctorsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Doctor Management" text="Verify and manage doctors on the platform." />
      <DoctorsManagement />
    </DashboardShell>
  )
}
