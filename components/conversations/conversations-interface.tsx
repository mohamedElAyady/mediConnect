"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Send,
  Phone,
  Video,
  MoreHorizontal,
  PaperclipIcon,
  SmileIcon,
  Filter,
  Star,
  Clock,
  CheckCheck,
  Bell,
  BellOff,
  Calendar,
  FileText,
  Pill,
  ClipboardList,
} from "lucide-react"
import { format, isToday, isYesterday } from "date-fns"
import { useUser } from "@clerk/nextjs"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Conversation, Message } from "./types"
import { ConversationList } from "./conversation-list"
import { MessageThread } from "./message-thread"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

// Helper function to format message time
const formatMessageTime = (timestamp: string) => {
  const date = new Date(timestamp)
  if (isToday(date)) {
    return format(date, "h:mm a")
  } else if (isYesterday(date)) {
    return "Yesterday"
  } else {
    return format(date, "MMM d")
  }
}

// Helper function to format appointment date
const formatAppointmentDate = (timestamp: string | null | undefined) => {
  if (!timestamp) return "No upcoming appointment"
  const date = new Date(timestamp)
  return `${format(date, "MMM d")} at ${format(date, "h:mm a")}`
}

interface ConversationsInterfaceProps {
  userRole: "doctor" | "patient" | "admin"
}

export function ConversationsInterface({ userRole }: ConversationsInterfaceProps) {
  const { user } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isTyping, setIsTyping] = useState(false)
  const messageEndRef = useRef<HTMLDivElement>(null)
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  // Get the Convex user ID
  const convexUser = useQuery(api.users.getUserByClerkId, { clerkId: user?.id || "" })

  // Get user's conversations from Convex
  const conversations = useQuery(api.conversations.getUserConversations, {
    userId: user?.id || "",
  }) || []

  // Get messages for selected conversation
  const messages = useQuery(
    api.conversations.getConversationMessages,
    selectedConversation?.id ? { conversationId: selectedConversation.id } : "skip"
  ) || []

  // Mutations
  const sendMessageMutation = useMutation(api.conversations.sendMessage)
  const markAsReadMutation = useMutation(api.conversations.markMessagesAsRead)
  const toggleFavoriteMutation = useMutation(api.conversations.toggleFavorite)

  // Filter conversations based on search query and active tab
  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = conversation.participantName.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "unread") return matchesSearch && conversation.unreadCount > 0
    if (activeTab === "favorites") return matchesSearch && conversation.isFavorite

    return matchesSearch
  })

  // Sort conversations by last message time (most recent first)
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
  })

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversation && convexUser?._id) {
      markAsReadMutation({
        conversationId: selectedConversation.id as Id<"conversations">,
        userId: convexUser._id,
      })

      // Scroll to the bottom of the message list
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedConversation, markAsReadMutation, convexUser?._id])

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !convexUser?._id) return

    try {
      await sendMessageMutation({
        conversationId: selectedConversation.id as Id<"conversations">,
        senderId: convexUser._id,
        content,
      })
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }

  const handleToggleFavorite = async (id: string) => {
    if (!convexUser?._id) return

    try {
      await toggleFavoriteMutation({
        conversationId: id as Id<"conversations">,
        userId: convexUser._id,
      })
    } catch (error) {
    toast({
        title: "Error updating favorite status",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }

  const handleToggleMute = (id: string) => {
    // Implement mute/unmute functionality
    console.log("Toggle mute for conversation:", id)
  }

  return (
    <div className="flex overflow-hidden rounded-lg border bg-background shadow">
      <ConversationList
        conversations={sortedConversations as Conversation[]}
        selectedConversation={selectedConversation?.id || null}
        onSelectConversation={(id) => setSelectedConversation(conversations.find(c => c.id === id) || null)}
        userRole={userRole}
        onToggleFavorite={handleToggleFavorite}
        onToggleMute={handleToggleMute}
      />
      <MessageThread
        conversation={selectedConversation}
        messages={messages}
        userRole={userRole}
        onSendMessage={handleSendMessage}
        onToggleFavorite={handleToggleFavorite}
        onToggleMute={handleToggleMute}
        formatAppointmentDate={formatAppointmentDate}
      />
    </div>
  )
}
