import { paginationOptsValidator } from "convex/server"
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

export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    
    return user;
  },
});

export const updateUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.string()),
    specialty: v.optional(v.string()),
    education: v.optional(v.string()),
    location: v.optional(v.string()),
    bio: v.optional(v.string()),
    experience: v.optional(v.string()),
    languages: v.optional(v.array(v.string())),
    avatar: v.optional(v.string()),
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
    consultationFee: v.optional(v.number()),
    insurances: v.optional(v.array(v.string())),
    acceptingNewPatients: v.optional(v.boolean()),
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

export const getAllUsers = query({
  args: {
    role: v.optional(v.string()),
    specialty: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("users")

    // Filter by role if provided
    if (args.role) {
      query = query.filter((q) => q.eq(q.field("role"), args.role))
    }

    // Filter by specialty if provided
    if (args.specialty) {
      query = query.filter((q) => q.eq(q.field("specialty"), args.specialty))
    }

    const results = await query
      .order("desc")
      .paginate(args.paginationOpts);
    
    // Add default values for undefined fields
    const users = results.page.map(user => ({
      ...user,
      rating: user.rating ?? 0,
      reviews: user.reviews ?? 0,
      distance: user.distance ?? "N/A",
      education: user.education ?? "Not specified",
      experience: user.experience ?? "Not specified",
      languages: user.languages ?? ["English"],
      acceptingNewPatients: user.acceptingNewPatients ?? true,
      consultationFee: user.consultationFee ?? 0,
      availableDates: user.availableDates ?? [],
      insurances: user.insurances ?? [],
      about: user.about ?? "No description available",
      avatar: user.avatar ?? "/placeholder.svg",
      location: user.location ?? "Location not specified",
      specialty: user.specialty ?? "General Practitioner",
    }));
    
    return {
      ...results,
      page: users
    };
  },
})
