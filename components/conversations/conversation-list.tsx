"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Star, Filter, MoreHorizontal, Bell, BellOff, FileText, ClipboardList } from "lucide-react"
import { format, isToday, isYesterday } from "date-fns"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Conversation } from "./types"

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
  userRole: "doctor" | "patient" | "admin";
  onToggleFavorite: (id: string) => void;
  onToggleMute: (id: string) => void;
}

export function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
  userRole,
  onToggleFavorite,
  onToggleMute,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showFilterMenu, setShowFilterMenu] = useState(false)

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

  return (
    <div className="w-80 min-w-80 border-r">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={`Search ${userRole === "doctor" ? "patients" : "doctors"}...`}
            className="pl-8 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filter conversations</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 pt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="favorites">Starred</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="m-0">
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="space-y-0.5 p-2">
              {sortedConversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No conversations found</div>
              ) : (
                sortedConversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isSelected={selectedConversation === conversation.id}
                    onSelect={() => onSelectConversation(conversation.id)}
                    onToggleFavorite={() => onToggleFavorite(conversation.id)}
                    onToggleMute={() => onToggleMute(conversation.id)}
                    userRole={userRole}
                    formatMessageTime={formatMessageTime}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="unread" className="m-0">
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="space-y-0.5 p-2">
              {sortedConversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No unread messages</div>
              ) : (
                sortedConversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isSelected={selectedConversation === conversation.id}
                    onSelect={() => onSelectConversation(conversation.id)}
                    onToggleFavorite={() => onToggleFavorite(conversation.id)}
                    onToggleMute={() => onToggleMute(conversation.id)}
                    userRole={userRole}
                    formatMessageTime={formatMessageTime}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="favorites" className="m-0">
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="space-y-0.5 p-2">
              {sortedConversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No starred conversations</div>
              ) : (
                sortedConversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isSelected={selectedConversation === conversation.id}
                    onSelect={() => onSelectConversation(conversation.id)}
                    onToggleFavorite={() => onToggleFavorite(conversation.id)}
                    onToggleMute={() => onToggleMute(conversation.id)}
                    userRole={userRole}
                    formatMessageTime={formatMessageTime}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
  onToggleMute: () => void;
  userRole: "doctor" | "patient" | "admin";
  formatMessageTime: (timestamp: string) => string;
}

function ConversationItem({
  conversation,
  isSelected,
  onSelect,
  onToggleFavorite,
  onToggleMute,
  userRole,
  formatMessageTime,
}: ConversationItemProps) {
  return (
    <div className="relative group">
      <button
        className={`w-full text-left p-3 rounded-lg transition-colors ${
          isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        }`}
        onClick={onSelect}
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
              <div className="flex items-center">
                <p
                  className={`truncate font-medium ${
                    conversation.unreadCount > 0 && !isSelected ? "font-semibold" : ""
                  }`}
                >
                  {conversation.participantName}
                </p>
                {conversation.isFavorite && (
                  <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                )}
              </div>
              <p
                className={`text-xs ${
                  isSelected ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {formatMessageTime(conversation.lastMessageTime)}
              </p>
            </div>
            <div className="flex justify-between items-center mt-1">
              <p
                className={`text-sm truncate ${
                  isSelected
                    ? "text-primary-foreground"
                    : conversation.unreadCount > 0
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                }`}
              >
                {conversation.lastMessage}
              </p>
              {conversation.unreadCount > 0 && !isSelected && (
                <Badge className="ml-2">{conversation.unreadCount}</Badge>
              )}
            </div>
            <div className="mt-1">
              <p
                className={`text-xs truncate ${
                  isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}
              >
                {conversation.participantRole === "doctor"
                  ? `${conversation.specialty}`
                  : userRole === "doctor" && conversation.condition
                    ? `${conversation.condition}`
                    : ""}
              </p>
            </div>
          </div>
        </div>
      </button>
      <div
        className={`absolute right-2 top-3 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onToggleFavorite}>
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
            <DropdownMenuItem onClick={onToggleMute}>
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
            <DropdownMenuSeparator />
            {userRole === "doctor" && conversation.participantRole === "patient" && (
              <>
                <DropdownMenuItem
                  onClick={() => {
                    toast({
                      title: "Patient profile",
                      description: `Viewing profile for ${conversation.participantName}`,
                    })
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" /> View patient profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    toast({
                      title: "Medical records",
                      description: `Viewing medical records for ${conversation.participantName}`,
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
                    description: `Viewing profile for ${conversation.participantName}`,
                  })
                }}
              >
                <FileText className="h-4 w-4 mr-2" /> View doctor profile
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                toast({
                  title: "Conversation archived",
                  description: "This conversation has been archived",
                  duration: 2000,
                })
              }}
            >
              Archive conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
} 