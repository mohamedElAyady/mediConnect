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
    education: v.optional(v.string()),
    experience: v.optional(v.string()),
    languages: v.optional(v.array(v.string())),
    licenseNumber: v.optional(v.string()),
    consultationFee: v.optional(v.number()),
    isPublished: v.optional(v.boolean()),
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
      education: args.education,
      experience: args.experience,
      languages: args.languages,
      licenseNumber: args.licenseNumber,
      consultationFee: args.consultationFee,
      isPublished: args.isPublished,
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
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first()
  },
})

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
    licenseNumber: v.optional(v.string()),
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
    isPublished: v.optional(v.boolean()),
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

    // If role is doctor, verify required fields and integrations
    if (user.role === "doctor") {
      const updatedUser = { ...user, ...rest };
      
      // Check if user has a valid calendar integration
      const integration = await ctx.db
        .query("integrations")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .filter((q) => q.eq(q.field("type"), "google"))
        .first();

      const hasValidIntegration = Boolean(
        integration?.isConnected && 
        integration?.credentials?.accessToken
      );

      const isProfileComplete = Boolean(
        updatedUser.specialty && 
        updatedUser.licenseNumber &&
        updatedUser.education &&
        updatedUser.experience &&
        updatedUser.consultationFee &&
        updatedUser.availability &&
        updatedUser.availability.length > 0 &&
        hasValidIntegration
      );

      // Add isPublished to the update
      rest.isPublished = isProfileComplete;
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

export const updateIsPublished = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== "doctor") {
      throw new Error("Only doctors can be published");
    }

    // Check if user has a valid calendar integration
    const integration = await ctx.db
      .query("integrations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("type"), "google"))
      .first();

    const hasValidIntegration = Boolean(
      integration?.isConnected && 
      integration?.credentials?.accessToken
    );

    const isProfileComplete = Boolean(
      user.specialty && 
      user.licenseNumber &&
      user.education &&
      user.experience &&
      user.consultationFee &&
      user.availability &&
      user.availability.length > 0 &&
      hasValidIntegration
    );
 
    await ctx.db.patch(args.userId, {
      isPublished: isProfileComplete
    });

    return isProfileComplete;
  },
});

export const getPatientSettings = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first()

    if (!user) throw new Error("User not found")
    if (user.role !== "patient") throw new Error("User is not a patient")

    return {
      personal: {
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
      },
      contact: {
        email: user.email,
        phone: user.phone,
        address: user.address,
        location: user.location,
      },
      medical: {
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        bloodType: user.bloodType,
        allergies: user.allergies,
        conditions: user.conditions,
      },
      preferences: {
        ...user.preferences,
        languages: user.languageProficiencies,
      },
    }
  },
})

export const updatePatientPersonalInfo = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    bio: v.optional(v.string()),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { clerkId, ...rest } = args
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first()

    if (!user) throw new Error("User not found")
    if (user.role !== "patient") throw new Error("User is not a patient")

    await ctx.db.patch(user._id, rest)
    return user._id
  },
})

export const updatePatientContactInfo = mutation({
  args: {
    clerkId: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { clerkId, ...rest } = args
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first()

    if (!user) throw new Error("User not found")
    if (user.role !== "patient") throw new Error("User is not a patient")

    await ctx.db.patch(user._id, rest)
    return user._id
  },
})

export const updatePatientMedicalInfo = mutation({
  args: {
    clerkId: v.string(),
    gender: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    bloodType: v.optional(v.string()),
    allergies: v.optional(v.array(v.string())),
    conditions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { clerkId, ...rest } = args
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first()

    if (!user) throw new Error("User not found")
    if (user.role !== "patient") throw new Error("User is not a patient")

    await ctx.db.patch(user._id, rest)
    return user._id
  },
})

export const updatePatientPreferences = mutation({
  args: {
    clerkId: v.string(),
    preferences: v.object({
      emailNotifications: v.boolean(),
      smsNotifications: v.boolean(),
      appointmentReminders: v.boolean(),
      marketingEmails: v.boolean(),
    }),
    languageProficiencies: v.array(
      v.object({
        language: v.string(),
        proficiency: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { clerkId, ...rest } = args
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first()

    if (!user) throw new Error("User not found")
    if (user.role !== "patient") throw new Error("User is not a patient")

    await ctx.db.patch(user._id, rest)
    return user._id
  },
})

export const softDeleteUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(args.userId, {
      isDeleted: true
    });

    return args.userId;
  },
});
