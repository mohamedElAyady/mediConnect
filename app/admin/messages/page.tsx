import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { MessagingInterface } from "@/components/messaging/messaging-interface"

export default function AdminMessagesPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Messages" text="Manage and monitor communications across the platform." />
      <MessagingInterface userRole="admin" />
    </DashboardShell>
  )
}
