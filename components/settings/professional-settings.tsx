"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import React from "react"

const professionalFormSchema = z.object({
  specialty: z.string().min(2, {
    message: "Specialty must be at least 2 characters.",
  }),
  education: z.string().min(2, {
    message: "Education must be at least 2 characters.",
  }),
  experience: z.string().min(2, {
    message: "Experience must be at least 2 characters.",
  }),
  languages: z.string().min(2, {
    message: "Languages must be at least 2 characters.",
  }),
})

type ProfessionalFormValues = z.infer<typeof professionalFormSchema>

export function ProfessionalSettings() {
  const { user } = useUser()
  const updateUser = useMutation(api.users.updateUser)
  const userData = useQuery(api.users.getUser, { clerkId: user?.id ?? "" })

  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalFormSchema),
    defaultValues: {
      specialty: userData?.specialty ?? "",
      education: userData?.education ?? "",
      experience: userData?.experience ?? "",
      languages: userData?.languages?.join(", ") ?? "",
    },
  })

  // Update form values when userData changes
  React.useEffect(() => {
    if (userData) {
      form.reset({
        specialty: userData.specialty ?? "",
        education: userData.education ?? "",
        experience: userData.experience ?? "",
        languages: userData.languages?.join(", ") ?? "",
      })
    }
  }, [userData, form])

  async function onSubmit(data: ProfessionalFormValues) {
    try {
      await updateUser({
        clerkId: user?.id ?? "",
        specialty: data.specialty,
        education: data.education,
        experience: data.experience,
        languages: data.languages.split(",").map((lang) => lang.trim()),
      })
      toast({
        title: "Professional information updated",
        description: "Your professional information has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update professional information. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="specialty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialty</FormLabel>
              <FormControl>
                <Input placeholder="Your medical specialty" {...field} />
              </FormControl>
              <FormDescription>
                Your primary medical specialty or area of expertise.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Education</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your medical education and qualifications"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                List your medical degrees, certifications, and training.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your professional experience"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Describe your professional experience and achievements.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="languages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Languages</FormLabel>
              <FormControl>
                <Input placeholder="English, Spanish, etc." {...field} />
              </FormControl>
              <FormDescription>
                List the languages you speak, separated by commas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Update professional information
        </Button>
      </form>
    </Form>
  )
}
