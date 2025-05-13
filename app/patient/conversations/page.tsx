import type { Metadata } from "next"
import { ConversationsInterface } from "@/components/conversations/conversations-interface"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export const metadata: Metadata = {
    title: "Conversations",
    description: "Communicate with your patients securely through our messaging platform.",
}

export default function ConversationsPage() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Conversations"
                text="Communicate with your healthcare providers securely through our messaging platform."
            />
            <ConversationsInterface userRole="patient" />
        </DashboardShell>

    )
}
