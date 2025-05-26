import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AdminOverview } from "@/components/admin-dashboard/admin-overview"
import { RecentActivities } from "@/components/admin-dashboard/recent-activities"
import { PlatformStats } from "@/components/admin-dashboard/platform-stats"

export default function AdminDashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Admin Dashboard" text="Monitor and manage the entire platform." />
      <div className="grid gap-6">
        <AdminOverview />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <RecentActivities />
          <PlatformStats />
        </div>
      </div>
    </DashboardShell>
  )
}
