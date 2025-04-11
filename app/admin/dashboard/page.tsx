import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AdminStatsCards } from "@/components/admin/admin-stats-cards"
import { RecentUsers } from "@/components/admin/recent-users"

export default function AdminDashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Admin Dashboard" text="Monitor and manage the platform." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AdminStatsCards />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentUsers />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Server Status</span>
                <span className="flex items-center text-sm text-green-500">
                  <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database</span>
                <span className="flex items-center text-sm text-green-500">
                  <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Authentication</span>
                <span className="flex items-center text-sm text-green-500">
                  <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
                  Operational
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

