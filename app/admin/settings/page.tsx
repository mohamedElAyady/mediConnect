import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SystemSettings } from "@/components/admin-dashboard/system-settings"

export default function AdminSettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="System Settings" text="Configure platform settings and preferences." />
      <SystemSettings />
    </DashboardShell>
  )
}
