import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { Id } from "./_generated/dataModel"

// Get all conversations for a user
export const getUserConversations = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // First get the Convex user ID from the Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.userId))
      .first()

    if (!user) return []

    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_participant1", (q) => q.eq("participant1Id", user._id))
      .collect()

    const conversations2 = await ctx.db
      .query("conversations")
      .withIndex("by_participant2", (q) => q.eq("participant2Id", user._id))
      .collect()

    const allConversations = [...conversations, ...conversations2]

    // Get participant details for each conversation
    const conversationsWithDetails = await Promise.all(
      allConversations.map(async (conv) => {
        const otherParticipantId = conv.participant1Id === user._id ? conv.participant2Id : conv.participant1Id
        const otherParticipant = await ctx.db.get(otherParticipantId)
        
        return {
          id: conv._id,
          participantName: otherParticipant?.name || "Unknown User",
          participantRole: (otherParticipant?.role || "user") as "doctor" | "patient" | "admin",
          participantAvatar: otherParticipant?.avatar || "/placeholder.svg",
          lastMessage: conv.lastMessage,
          lastMessageTime: conv.lastMessageTime,
          unreadCount: conv.participant1Id === user._id ? conv.unreadCount1 : conv.unreadCount2,
          online: true,
          isFavorite: conv.participant1Id === user._id ? conv.isFavorite1 : conv.isFavorite2,
          lastSeen: conv.participant1Id === user._id ? conv.lastSeen1 : conv.lastSeen2,
          nextAppointment: conv.nextAppointment || null,
          condition: otherParticipant?.role === "patient" ? otherParticipant?.conditions : undefined,
          specialty: otherParticipant?.role === "doctor" ? otherParticipant?.specialty : undefined,
        }
      })
    )

    return conversationsWithDetails
  },
})

// Get messages for a conversation
export const getConversationMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect()

    // Get sender details for each message
    const messagesWithDetails = await Promise.all(
      messages.map(async (msg) => {
        const sender = await ctx.db.get(msg.senderId)
        return {
          id: msg._id,
          senderId: msg.senderId,
          senderName: sender?.name || "Unknown User",
          content: msg.content,
          timestamp: msg.timestamp,
          read: msg.read,
        }
      })
    )

    return messagesWithDetails
  },
})

// Create a new conversation
export const createConversation = mutation({
  args: {
    participant1Id: v.id("users"),
    participant2Id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const conversationId = await ctx.db.insert("conversations", {
      participant1Id: args.participant1Id,
      participant2Id: args.participant2Id,
      lastMessage: "",
      lastMessageTime: new Date().toISOString(),
      unreadCount1: 0,
      unreadCount2: 0,
      isFavorite1: false,
      isFavorite2: false,
      lastSeen1: new Date().toISOString(),
      lastSeen2: new Date().toISOString(),
    })

    return conversationId
  },
})

// Send a message
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId)
    if (!conversation) throw new Error("Conversation not found")

    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: args.senderId,
      content: args.content,
      timestamp: new Date().toISOString(),
      read: false,
    })

    // Update conversation with last message
    await ctx.db.patch(args.conversationId, {
      lastMessage: args.content,
      lastMessageTime: new Date().toISOString(),
      unreadCount1: conversation.participant1Id === args.senderId ? conversation.unreadCount1 : conversation.unreadCount1 + 1,
      unreadCount2: conversation.participant2Id === args.senderId ? conversation.unreadCount2 : conversation.unreadCount2 + 1,
    })

    return messageId
  },
})

// Mark messages as read
export const markMessagesAsRead = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId)
    if (!conversation) throw new Error("Conversation not found")

    // Update unread count
    await ctx.db.patch(args.conversationId, {
      unreadCount1: conversation.participant1Id === args.userId ? 0 : conversation.unreadCount1,
      unreadCount2: conversation.participant2Id === args.userId ? 0 : conversation.unreadCount2,
      lastSeen1: conversation.participant1Id === args.userId ? new Date().toISOString() : conversation.lastSeen1,
      lastSeen2: conversation.participant2Id === args.userId ? new Date().toISOString() : conversation.lastSeen2,
    })

    // Mark all unread messages as read
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .filter((q) => q.eq(q.field("senderId"), args.userId))
      .filter((q) => q.eq(q.field("read"), false))
      .collect()

    for (const message of messages) {
      await ctx.db.patch(message._id, { read: true })
    }
  },
})

// Toggle favorite status
export const toggleFavorite = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId)
    if (!conversation) throw new Error("Conversation not found")

    await ctx.db.patch(args.conversationId, {
      isFavorite1: conversation.participant1Id === args.userId ? !conversation.isFavorite1 : conversation.isFavorite1,
      isFavorite2: conversation.participant2Id === args.userId ? !conversation.isFavorite2 : conversation.isFavorite2,
    })
  },
})

// Create a conversation between doctor and patient
export const createDoctorPatientConversation = mutation({
  args: {
    doctorId: v.id("users"),
    patientId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Check if conversation already exists
    const existingConversation = await ctx.db
      .query("conversations")
      .withIndex("by_participants", (q) => 
        q.eq("participant1Id", args.doctorId).eq("participant2Id", args.patientId)
      )
      .first()

    if (existingConversation) {
      return existingConversation._id
    }

    // Create new conversation
    const conversationId = await ctx.db.insert("conversations", {
      participant1Id: args.doctorId,
      participant2Id: args.patientId,
      lastMessage: "",
      lastMessageTime: new Date().toISOString(),
      unreadCount1: 0,
      unreadCount2: 0,
      isFavorite1: false,
      isFavorite2: false,
      lastSeen1: new Date().toISOString(),
      lastSeen2: new Date().toISOString(),
    })

    return conversationId
  },
}) 