import type { Metadata } from "next"
import { ConversationsInterface } from "@/components/conversations/conversations-interface"

export const metadata: Metadata = {
  title: "Conversations | MediConnect",
  description: "Monitor and manage communications between doctors and patients.",
}

export default function AdminConversationsPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ConversationsInterface userRole="admin" />
      </div>
    </div>
  )
}
