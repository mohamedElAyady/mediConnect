import { Id } from "@/convex/_generated/dataModel"

export interface Conversation {
  id: Id<"conversations">
  participantName: string
  participantRole: "doctor" | "patient" | "admin"
  participantAvatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  online: boolean
  isFavorite: boolean
  lastSeen: string
  nextAppointment: string | null
  condition?: string[]
  specialty?: string
}

export interface Message {
  id: Id<"messages">
  senderId: Id<"users">
  senderName: string
  content: string
  timestamp: string
  read: boolean
}

export interface ConversationsInterfaceProps {
  userRole: "doctor" | "patient" | "admin";
} 