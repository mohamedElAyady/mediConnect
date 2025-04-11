import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.string(),
    specialty: v.optional(v.string()),
    location: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatar: v.optional(v.string()),
    availability: v.optional(
      v.array(
        v.object({
          day: v.string(),
          startTime: v.string(),
          endTime: v.string(),
        }),
      ),
    ),
    pricing: v.optional(v.number()),
  }).index("by_clerk_id", ["clerkId"]),

  appointments: defineTable({
    patientId: v.string(),
    doctorId: v.string(),
    date: v.string(),
    time: v.string(),
    type: v.string(),
    status: v.string(),
    notes: v.optional(v.string()),
    symptoms: v.optional(v.string()),
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

