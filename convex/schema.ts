import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.string(), // "doctor", "patient", "admin"
    specialty: v.optional(v.string()),
    location: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatar: v.optional(v.string()),
    rating: v.optional(v.number()),
    reviews: v.optional(v.number()),
    distance: v.optional(v.string()),
    education: v.optional(v.string()),
    experience: v.optional(v.string()),
    languages: v.optional(v.array(v.string())),
    acceptingNewPatients: v.optional(v.boolean()),
    consultationFee: v.optional(v.number()),
    availableDates: v.optional(v.array(v.string())),
    insurances: v.optional(v.array(v.string())),
    about: v.optional(v.string()),
    availability: v.optional(
      v.array(
        v.object({
          day: v.string(),
          startTime: v.string(),
          endTime: v.string(),
          isAvailable: v.boolean(),
        }),
      ),
    ),
    pricing: v.optional(v.number()),
  }).index("by_clerk_id", ["clerkId"]),

  integrations: defineTable({
    userId: v.id("users"),
    type: v.string(), // "google_calendar" or "gmail_smtp"
    isConnected: v.boolean(),
    credentials: v.object({
      // OAuth credentials
      accessToken: v.optional(v.string()),
      refreshToken: v.optional(v.string()),
      tokenType: v.optional(v.string()),
      expiryDate: v.optional(v.number()),
      scope: v.optional(v.string()),
      providerId: v.optional(v.string()),
      // Legacy credentials (can be removed after migration)
      clientId: v.optional(v.string()),
      clientSecret: v.optional(v.string()),
      email: v.optional(v.string()),
      appPassword: v.optional(v.string()),
    }),
    lastSynced: v.optional(v.string()),
    settings: v.optional(v.object({
      syncAppointments: v.optional(v.boolean()),
      sendReminders: v.optional(v.boolean()),
      reminderTime: v.optional(v.string()),
    })),
  })
    .index("by_user", ["userId"])
    .index("by_type", ["type"]),

  appointments: defineTable({
    patientId: v.string(),
    doctorId: v.string(),
    date: v.string(),
    time: v.string(),
    type: v.string(),
    status: v.string(),
    notes: v.optional(v.string()),
    symptoms: v.optional(v.string()),
    duration: v.optional(v.string()),
    reason: v.optional(v.string()),
    cancellationReason: v.optional(v.string()),
  })
    .index("by_patient", ["patientId"])
    .index("by_doctor", ["doctorId"]),

  messages: defineTable({
    senderId: v.string(),
    receiverId: v.string(),
    content: v.string(),
    read: v.boolean(),
    appointmentId: v.optional(v.string()),
  })
    .index("by_sender", ["senderId"])
    .index("by_receiver", ["receiverId"]),

  medicalRecords: defineTable({
    patientId: v.string(),
    doctorId: v.string(),
    date: v.string(),
    diagnosis: v.string(),
    prescription: v.optional(v.string()),
    notes: v.optional(v.string()),
    appointmentId: v.optional(v.string()),
  }).index("by_patient", ["patientId"]),
})

