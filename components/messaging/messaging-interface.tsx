"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, Phone, Video, MoreHorizontal, PaperclipIcon, SmileIcon } from "lucide-react"
import { format } from "date-fns"
import { useUser } from "@clerk/nextjs"
import { toast } from "@/components/ui/use-toast"

// Mock data for conversations
const mockConversations = [
  {
    id: "1",
    participantName: "Sarah Johnson",
    participantRole: "patient",
    participantAvatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thank you for the prescription, Dr. Wilson.",
    lastMessageTime: "2025-04-03T10:30:00",
    unreadCount: 0,
    online: false,
  },
  {
    id: "2",
    participantName: "Michael Chen",
    participantRole: "patient",
    participantAvatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I've been feeling much better since our last appointment.",
    lastMessageTime: "2025-04-03T09:15:00",
    unreadCount: 2,
    online: true,
  },
  {
    id: "3",
    participantName: "Emily Rodriguez",
    participantRole: "patient",
    participantAvatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "When should I schedule my follow-up appointment?",
    lastMessageTime: "2025-04-02T16:45:00",
    unreadCount: 0,
    online: false,
  },
  {
    id: "4",
    participantName: "Dr. Maria Garcia",
    participantRole: "doctor",
    participantAvatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Could you share the patient's test results with me?",
    lastMessageTime: "2025-04-02T14:20:00",
    unreadCount: 1,
    online: true,
  },
  {
    id: "5",
    participantName: "David Kim",
    participantRole: "patient",
    participantAvatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I've uploaded my blood pressure readings for the past week.",
    lastMessageTime: "2025-04-01T11:05:00",
    unreadCount: 0,
    online: false,
  },
]

// Mock data for messages in a conversation
const mockMessages = {
  "1": [
    {
      id: "101",
      senderId: "patient-1",
      senderName: "Sarah Johnson",
      content: "Hello Dr. Wilson, I wanted to ask about the medication you prescribed yesterday.",
      timestamp: "2025-04-03T09:30:00",
      read: true,
    },
    {
      id: "102",
      senderId: "doctor-1",
      senderName: "Dr. James Wilson",
      content:
        "Hello Sarah, of course. The medication I prescribed is to help with your blood pressure. Take one pill in the morning with food.",
      timestamp: "2025-04-03T09:45:00",
      read: true,
    },
    {
      id: "103",
      senderId: "patient-1",
      senderName: "Sarah Johnson",
      content: "Are there any side effects I should be aware of?",
      timestamp: "2025-04-03T10:00:00",
      read: true,
    },
    {
      id: "104",
      senderId: "doctor-1",
      senderName: "Dr. James Wilson",
      content:
        "Some patients experience mild dizziness or headaches initially, but these usually subside after a few days. If you experience any severe side effects, please contact me immediately.",
      timestamp: "2025-04-03T10:15:00",
      read: true,
    },
    {
      id: "105",
      senderId: "patient-1",
      senderName: "Sarah Johnson",
      content: "Thank you for the prescription, Dr. Wilson.",
      timestamp: "2025-04-03T10:30:00",
      read: true,
    },
  ],
  "2": [
    {
      id: "201",
      senderId: "patient-2",
      senderName: "Michael Chen",
      content: "Dr. Wilson, I've been taking the medication as prescribed for a week now.",
      timestamp: "2025-04-03T08:30:00",
      read: true,
    },
    {
      id: "202",
      senderId: "doctor-1",
      senderName: "Dr. James Wilson",
      content: "That's great to hear, Michael. How are you feeling?",
      timestamp: "2025-04-03T08:45:00",
      read: true,
    },
    {
      id: "203",
      senderId: "patient-2",
      senderName: "Michael Chen",
      content: "I've been feeling much better since our last appointment.",
      timestamp: "2025-04-03T09:15:00",
      read: false,
    },
    {
      id: "204",
      senderId: "patient-2",
      senderName: "Michael Chen",
      content: "My blood pressure readings have also improved. I'll share them with you.",
      timestamp: "2025-04-03T09:16:00",
      read: false,
    },
  ],
  "3": [
    {
      id: "301",
      senderId: "patient-3",
      senderName: "Emily Rodriguez",
      content: "Hello Dr. Wilson, I hope you're doing well.",
      timestamp: "2025-04-02T16:15:00",
      read: true,
    },
    {
      id: "302",
      senderId: "doctor-1",
      senderName: "Dr. James Wilson",
      content: "Hello Emily, I'm doing well. How can I help you today?",
      timestamp: "2025-04-02T16:30:00",
      read: true,
    },
    {
      id: "303",
      senderId: "patient-3",
      senderName: "Emily Rodriguez",
      content: "When should I schedule my follow-up appointment?",
      timestamp: "2025-04-02T16:45:00",
      read: true,
    },
  ],
  "4": [
    {
      id: "401",
      senderId: "doctor-2",
      senderName: "Dr. Maria Garcia",
      content: "Hi Dr. Wilson, I'm consulting on a patient with a complex cardiac condition.",
      timestamp: "2025-04-02T14:00:00",
      read: true,
    },
    {
      id: "402",
      senderId: "doctor-1",
      senderName: "Dr. James Wilson",
      content: "Hello Dr. Garcia, I'd be happy to provide my input. What are the details?",
      timestamp: "2025-04-02T14:10:00",
      read: true,
    },
    {
      id: "403",
      senderId: "doctor-2",
      senderName: "Dr. Maria Garcia",
      content: "Could you share the patient's test results with me?",
      timestamp: "2025-04-02T14:20:00",
      read: false,
    },
  ],
  "5": [
    {
      id: "501",
      senderId: "patient-5",
      senderName: "David Kim",
      content: "Dr. Wilson, as requested, I've been monitoring my blood pressure daily.",
      timestamp: "2025-04-01T10:45:00",
      read: true,
    },
    {
      id: "502",
      senderId: "doctor-1",
      senderName: "Dr. James Wilson",
      content: "Thank you, David. How have the readings been?",
      timestamp: "2025-04-01T10:55:00",
      read: true,
    },
    {
      id: "503",
      senderId: "patient-5",
      senderName: "David Kim",
      content: "I've uploaded my blood pressure readings for the past week.",
      timestamp: "2025-04-01T11:05:00",
      read: true,
    },
  ],
}

interface MessagingInterfaceProps {
  userRole: "doctor" | "patient" | "admin"
}

export function MessagingInterface({ userRole }: MessagingInterfaceProps) {
  const { user } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [conversations, setConversations] = useState(mockConversations)
  const [messages, setMessages] = useState(mockMessages)
  const messageEndRef = useRef<HTMLDivElement>(null)

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) =>
    conversation.participantName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      // In a real app, this would call a mutation to update the read status
      const updatedConversations = conversations.map((conv) => {
        if (conv.id === selectedConversation) {
          return { ...conv, unreadCount: 0 }
        }
        return conv
      })
      setConversations(updatedConversations)

      // Scroll to the bottom of the message list
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedConversation, conversations])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    // In a real app, this would call a mutation to create a new message
    const currentTime = new Date().toISOString()
    const newMessageObj = {
      id: `new-${Date.now()}`,
      senderId: `${userRole}-1`,
      senderName: user?.fullName || `Dr. James Wilson`,
      content: newMessage,
      timestamp: currentTime,
      read: false,
    }

    // Update messages
    setMessages({
      ...messages,
      [selectedConversation]: [...(messages[selectedConversation as keyof typeof messages] || []), newMessageObj],
    })

    // Update conversation last message
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === selectedConversation) {
        return {
          ...conv,
          lastMessage: newMessage,
          lastMessageTime: currentTime,
        }
      }
      return conv
    })
    setConversations(updatedConversations)

    // Clear input
    setNewMessage("")

    // Scroll to bottom
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)

    toast({
      title: "Message sent",
      description: "Your message has been sent successfully.",
    })
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] overflow-hidden rounded-lg border bg-background shadow">
      {/* Conversations sidebar */}
      <div className="w-full max-w-xs border-r">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search conversations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all">
          <div className="px-4 pt-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="flagged">Flagged</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="m-0">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="space-y-0.5 p-2">
                {filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No conversations found</div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedConversation === conversation.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={conversation.participantAvatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {conversation.participantName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p
                              className={`truncate font-medium ${
                                conversation.unreadCount > 0 && selectedConversation !== conversation.id
                                  ? "font-semibold"
                                  : ""
                              }`}
                            >
                              {conversation.participantName}
                            </p>
                            <p
                              className={`text-xs ${
                                selectedConversation === conversation.id
                                  ? "text-primary-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {format(new Date(conversation.lastMessageTime), "h:mm a")}
                            </p>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <p
                              className={`text-sm truncate ${
                                selectedConversation === conversation.id
                                  ? "text-primary-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {conversation.lastMessage}
                            </p>
                            {conversation.unreadCount > 0 && selectedConversation !== conversation.id && (
                              <Badge className="ml-2">{conversation.unreadCount}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="unread" className="m-0">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="space-y-0.5 p-2">
                {filteredConversations.filter((c) => c.unreadCount > 0).length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No unread messages</div>
                ) : (
                  filteredConversations
                    .filter((c) => c.unreadCount > 0)
                    .map((conversation) => (
                      <button
                        key={conversation.id}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedConversation === conversation.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={conversation.participantAvatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {conversation.participantName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className="truncate font-semibold">{conversation.participantName}</p>
                              <p
                                className={`text-xs ${
                                  selectedConversation === conversation.id
                                    ? "text-primary-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {format(new Date(conversation.lastMessageTime), "h:mm a")}
                              </p>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <p
                                className={`text-sm truncate ${
                                  selectedConversation === conversation.id
                                    ? "text-primary-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {conversation.lastMessage}
                              </p>
                              <Badge className="ml-2">{conversation.unreadCount}</Badge>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="flagged" className="m-0">
            <div className="p-4 text-center text-muted-foreground">No flagged messages</div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Message thread */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Conversation header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={
                      conversations.find((c) => c.id === selectedConversation)?.participantAvatar || "/placeholder.svg"
                    }
                  />
                  <AvatarFallback>
                    {conversations
                      .find((c) => c.id === selectedConversation)
                      ?.participantName.substring(0, 2)
                      .toUpperCase() || "??"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">
                    {conversations.find((c) => c.id === selectedConversation)?.participantName}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {conversations.find((c) => c.id === selectedConversation)?.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" title="Audio call">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Video call">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title="More options">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages[selectedConversation as keyof typeof messages]?.map((message) => {
                  const isCurrentUser = message.senderId.startsWith(userRole)
                  return (
                    <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">{format(new Date(message.timestamp), "h:mm a")}</p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messageEndRef} />
              </div>
            </ScrollArea>

            {/* Message input */}
            <div className="p-4 border-t">
              <div className="flex items-end gap-2">
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                  <PaperclipIcon className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type your message..."
                    className="pr-10"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => {
                      // In a real app, this would open an emoji picker
                      toast({
                        title: "Emoji picker",
                        description: "Emoji picker would open here.",
                      })
                    }}
                  >
                    <SmileIcon className="h-4 w-4" />
                  </Button>
                </div>
                <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <div className="max-w-md">
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the list to start messaging or search for a specific patient.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
