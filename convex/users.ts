import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.string(),
    specialty: v.optional(v.string()),
    location: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first()

    if (existingUser) {
      return existingUser._id
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      role: args.role,
      specialty: args.specialty,
      location: args.location,
      bio: args.bio,
      avatar: args.avatar,
    })

    return userId
  },
})

export const getUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first()

    return user
  },
})


export const updateUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const { clerkId, ...rest } = args

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    await ctx.db.patch(user._id, rest)

    return user._id
  },
})
