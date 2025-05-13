"use client"

import { useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Phone, Video, MoreHorizontal, PaperclipIcon, SmileIcon, Star, Bell, BellOff, Calendar, FileText, ClipboardList, CheckCheck, Pill } from "lucide-react"
import { format } from "date-fns"
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
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

interface MessageThreadProps {
  conversation: Conversation | null;
  messages: Message[];
  userRole: "doctor" | "patient" | "admin";
  onSendMessage: (message: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleMute: (id: string) => void;
  formatAppointmentDate: (timestamp: string | null | undefined) => string;
}

export function MessageThread({
  conversation,
  messages,
  userRole,
  onSendMessage,
  onToggleFavorite,
  onToggleMute,
  formatAppointmentDate,
}: MessageThreadProps) {
  const { user } = useUser()
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messageEndRef = useRef<HTMLDivElement>(null)
  const convexUser = useQuery(api.users.getUserByClerkId, { clerkId: user?.id || "" })

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    onSendMessage(newMessage)
    setNewMessage("")
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md">
          <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
          <p className="text-muted-foreground">
            Choose a conversation from the list to start messaging or search for a specific{" "}
            {userRole === "doctor" ? "patient" : "doctor"}.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Conversation header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={conversation.participantAvatar || "/placeholder.svg"} />
            <AvatarFallback>
              {conversation.participantName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{conversation.participantName}</h3>
              {conversation.isFavorite && (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              )}
            </div>
            <div className="flex items-center gap-3">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {conversation.online ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-green-500 inline-block"></span> Online
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-gray-400 inline-block"></span> Offline
                  </>
                )}
              </p>
              {conversation.participantRole === "doctor" && conversation.specialty && (
                <p className="text-xs text-muted-foreground">{conversation.specialty}</p>
              )}
              {userRole === "doctor" && conversation.participantRole === "patient" && conversation.condition && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Pill className="h-3 w-3" /> {conversation.condition}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Audio call"
                  onClick={() => {
                    toast({
                      title: "Starting audio call",
                      description: "Initiating audio call with " + conversation.participantName,
                    })
                  }}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start audio call</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Video call"
                  onClick={() => {
                    toast({
                      title: "Starting video call",
                      description: "Initiating video call with " + conversation.participantName,
                    })
                  }}
                >
                  <Video className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start video call</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" title="More options">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onToggleFavorite(conversation.id)}>
                {conversation.isFavorite ? (
                  <>
                    <Star className="h-4 w-4 mr-2" /> Remove star
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" /> Add star
                  </>
                )}
              </DropdownMenuItem>

              {userRole === "doctor" && conversation.participantRole === "patient" && (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      toast({
                        title: "Patient profile",
                        description: "Viewing profile for " + conversation.participantName,
                      })
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" /> View patient profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      toast({
                        title: "Medical records",
                        description: "Viewing medical records for " + conversation.participantName,
                      })
                    }}
                  >
                    <ClipboardList className="h-4 w-4 mr-2" /> View medical records
                  </DropdownMenuItem>
                </>
              )}

              {userRole === "patient" && conversation.participantRole === "doctor" && (
                <DropdownMenuItem
                  onClick={() => {
                    toast({
                      title: "Doctor profile",
                      description: "Viewing profile for " + conversation.participantName,
                    })
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" /> View doctor profile
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={() => {
                  toast({
                    title: "Schedule appointment",
                    description: "Opening appointment scheduler",
                  })
                }}
              >
                <Calendar className="h-4 w-4 mr-2" /> Schedule appointment
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onToggleMute(conversation.id)}>
                {Math.random() > 0.5 ? (
                  <>
                    <BellOff className="h-4 w-4 mr-2" /> Mute notifications
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" /> Unmute notifications
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast({
                    title: "Conversation archived",
                    description: "This conversation has been archived",
                  })
                }}
              >
                Archive conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Appointment info (if available) */}
      {conversation.nextAppointment && (
        <div className="px-4 py-2 bg-muted/50 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm">
              Next appointment:{" "}
              <span className="font-medium">
                {formatAppointmentDate(conversation.nextAppointment)}
              </span>
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast({
                title: "Reschedule appointment",
                description: "Opening appointment scheduler",
              })
            }}
          >
            Reschedule
          </Button>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isCurrentUser = message.senderId === convexUser?._id
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-end gap-2 max-w-[80%] ${
                    isCurrentUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={conversation.participantAvatar} />
                      <AvatarFallback>
                        {conversation.participantName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      isCurrentUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {format(new Date(message.timestamp), "h:mm a")}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <Avatar className="mr-2 mt-1 h-8 w-8">
                <AvatarImage src={conversation.participantAvatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {conversation.participantName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messageEndRef} />
        </div>
      </ScrollArea>

      {/* Message input */}
      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  onClick={() => {
                    toast({
                      title: "Attach file",
                      description: "File attachment dialog would open here",
                    })
                  }}
                >
                  <PaperclipIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => {
                      toast({
                        title: "Emoji picker",
                        description: "Emoji picker would open here",
                      })
                    }}
                  >
                    <SmileIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add emoji</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
} 