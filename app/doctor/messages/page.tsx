import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { MessagingInterface } from "@/components/messaging/messaging-interface"

export default function DoctorMessagesPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Messages"
        text="Communicate securely with your patients and manage your conversations."
      />
      <MessagingInterface userRole="doctor" />
    </DashboardShell>
  )
}
