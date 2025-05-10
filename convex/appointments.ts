import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { Id } from "./_generated/dataModel"

export const getAppointments = query({
    args: {
        doctorId: v.optional(v.string()),
        patientId: v.optional(v.string()),
        date: v.optional(v.string()),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let appointments = [];

        if (args.doctorId) {
            appointments = await ctx.db
                .query("appointments")
                .withIndex("by_doctor", (q) => q.eq("doctorId", args.doctorId ?? ""))
                .collect();
        } else if (args.patientId) {
            appointments = await ctx.db
                .query("appointments")
                .withIndex("by_patient", (q) => q.eq("patientId", args.patientId ?? ""))
                .collect();
        } else {
            appointments = await ctx.db.query("appointments").collect();
        }

        // Filter in JS (since Convex can't chain .filter() after .withIndex())
        if (args.date) {
            appointments = appointments.filter((appt) => appt.date === args.date);
        }

        if (args.status) {
            appointments = appointments.filter((appt) => appt.status === args.status);
        }

        // Add patient/doctor details
        const appointmentsWithDetails = await Promise.all(
            appointments.map(async (appointment) => {
                const patient = await ctx.db
                    .query("users")
                    .withIndex("by_id", (q) => q.eq("_id", appointment.patientId as Id<"users">))
                    .first();

                const doctor = await ctx.db
                    .query("users")
                    .withIndex("by_id", (q) => q.eq("_id", appointment.doctorId as Id<"users">))
                    .first();

                return {
                    ...appointment,
                    patient: patient
                        ? {
                            name: patient.name,
                            email: patient.email,
                            avatar: patient.avatar,
                        }
                        : null,
                    doctor: doctor
                        ? {
                            name: doctor.name,
                            specialty: doctor.specialty,
                            avatar: doctor.avatar,
                        }
                        : null,
                };
            })
        );

        return appointmentsWithDetails;
    }

})

export const createAppointment = mutation({
    args: {
        patientId: v.string(),
        doctorId: v.string(),
        date: v.string(),
        time: v.string(),
        type: v.string(),
        status: v.string(),
        duration: v.string(),
        notes: v.optional(v.string()),
        symptoms: v.optional(v.string()),
        reason: v.string(),
    },
    handler: async (ctx, args) => {
        const appointmentId = await ctx.db.insert("appointments", {
            patientId: args.patientId,
            doctorId: args.doctorId,
            date: args.date,
            time: args.time,
            type: args.type,
            status: args.status,
            duration: args.duration,
            notes: args.notes,
            symptoms: args.symptoms,
            reason: args.reason,
        })

        return appointmentId
    },
})

export const updateAppointment = mutation({
    args: {
        id: v.id("appointments"),
        date: v.optional(v.string()),
        time: v.optional(v.string()),
        type: v.optional(v.string()),
        status: v.optional(v.string()),
        duration: v.optional(v.string()),
        notes: v.optional(v.string()),
        symptoms: v.optional(v.string()),
        reason: v.optional(v.string()),
        cancellationReason: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...rest } = args

        // Check if appointment exists
        const appointment = await ctx.db.get(id)
        if (!appointment) {
            throw new Error("Appointment not found")
        }

        // Update appointment
        await ctx.db.patch(id, {
            ...rest
        })

        return id
    },
})

export const deleteAppointment = mutation({
    args: {
        id: v.id("appointments"),
    },
    handler: async (ctx, args) => {
        // Check if appointment exists
        const appointment = await ctx.db.get(args.id)
        if (!appointment) {
            throw new Error("Appointment not found")
        }

        // Delete appointment
        await ctx.db.delete(args.id)

        return args.id
    },
})
