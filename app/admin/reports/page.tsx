import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ReportsAnalytics } from "@/components/admin-dashboard/reports-analytics"

export default function AdminReportsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Reports & Analytics" text="View detailed reports and analytics about platform usage." />
      <ReportsAnalytics />
    </DashboardShell>
  )
}
