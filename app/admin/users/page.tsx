import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { UsersManagement } from "@/components/admin-dashboard/users-management"

export default function AdminUsersPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="User Management" text="View and manage all users on the platform." />
      <UsersManagement />
    </DashboardShell>
  )
}
