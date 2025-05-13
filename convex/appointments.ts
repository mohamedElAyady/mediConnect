import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { Id } from "./_generated/dataModel"
import { api } from "./_generated/api"

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
                            phone: patient.phone,
                            gender: patient.gender,
                            dateOfBirth: patient.dateOfBirth,
                            address: patient.address,
                            bloodType: patient.bloodType,
                            allergies: patient.allergies,
                            conditions: patient.conditions,
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
        // Get patient and doctor details
        const patient = await ctx.db
            .query("users")
            .withIndex("by_id", (q) => q.eq("_id", args.patientId as Id<"users">))
            .first();

        const doctor = await ctx.db
            .query("users")
            .withIndex("by_id", (q) => q.eq("_id", args.doctorId as Id<"users">))
            .first();

        if (!patient || !doctor) {
            throw new Error("Patient or doctor not found");
        }

        // Format time to ensure it's stored exactly as provided
        const [hours, minutes] = args.time.split(":");
        const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;

        // Create the appointment
        const appointmentId = await ctx.db.insert("appointments", {
            patientId: args.patientId,
            doctorId: args.doctorId,
            date: args.date,
            time: formattedTime,
            type: args.type,
            status: args.status,
            duration: args.duration,
            notes: args.notes,
            symptoms: args.symptoms,
            reason: args.reason,
        });

        // Create Google Calendar event
        try {
            await ctx.scheduler.runAfter(0, api.integrations.createGoogleCalendarEvent, {
                userId: args.doctorId as Id<"users">,
                appointment: {
                    patientId: args.patientId,
                    doctorId: args.doctorId,
                    date: args.date,
                    time: args.time,
                    type: args.type,
                    duration: args.duration,
                    reason: args.reason,
                    patientEmail: patient.email,
                    patientName: patient.name,
                    doctorEmail: doctor.email,
                    doctorName: doctor.name,
                    appointmentId: appointmentId,
                },
            });
        } catch (error) {
            console.error("Failed to create Google Calendar event:", error);
            // Don't throw error here, as the appointment was created successfully
        }

        return appointmentId;
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
        meetingLink: v.optional(v.string()),
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
