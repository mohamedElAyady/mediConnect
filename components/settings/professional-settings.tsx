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

const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  year: z.string().min(4, "Year must be 4 digits").max(4, "Year must be 4 digits"),
})

const professionalFormSchema = z.object({
  specialty: z.string().min(2, {
    message: "Specialty must be at least 2 characters.",
  }),
  education: z.string(),
  experience: z.string().min(2, {
    message: "Experience must be at least 2 characters.",
  }),
  languages: z.string().min(2, {
    message: "Languages must be at least 2 characters.",
  }),
  licenseNumber: z.string().min(2, {
    message: "License number must be at least 2 characters.",
  }),
})

type ProfessionalFormValues = z.infer<typeof professionalFormSchema>
type EducationEntry = z.infer<typeof educationSchema>

export function ProfessionalSettings() {
  const { user } = useUser()
  const updateUser = useMutation(api.users.updateUser)
  const userData = useQuery(api.users.getUser, { clerkId: user?.id ?? "" })
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>([])

  // Initialize education entries from userData
  React.useEffect(() => {
    if (userData?.education) {
      try {
        const parsedEducation = JSON.parse(userData.education)
        setEducationEntries(parsedEducation)
      } catch (error) {
        setEducationEntries([])
      }
    }
  }, [userData])

  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalFormSchema),
    defaultValues: {
      specialty: userData?.specialty ?? "",
      education: userData?.education ?? "",
      experience: userData?.experience ?? "",
      languages: userData?.languages?.join(", ") ?? "",
      licenseNumber: userData?.licenseNumber ?? "",
    },
  })

  const addEducationEntry = () => {
    setEducationEntries([...educationEntries, { degree: "", institution: "", year: "" }])
  }

  const removeEducationEntry = (index: number) => {
    setEducationEntries(educationEntries.filter((_, i) => i !== index))
  }

  const updateEducationEntry = (index: number, field: keyof EducationEntry, value: string) => {
    const newEntries = [...educationEntries]
    newEntries[index] = { ...newEntries[index], [field]: value }
    setEducationEntries(newEntries)
    form.setValue("education", JSON.stringify(newEntries))
  }

  // Update form values when userData changes
  React.useEffect(() => {
    if (userData) {
      form.reset({
        specialty: userData.specialty ?? "",
        education: userData.education ?? "",
        experience: userData.experience ?? "",
        languages: userData.languages?.join(", ") ?? "",
        licenseNumber: userData.licenseNumber ?? "",
      })
    }
  }, [userData, form])

  async function onSubmit(data: ProfessionalFormValues) {
    try {
      await updateUser({
        clerkId: user?.id ?? "",
        specialty: data.specialty,
        education: JSON.stringify(educationEntries),
        experience: data.experience,
        languages: data.languages.split(",").map((lang) => lang.trim()),
        licenseNumber: data.licenseNumber,
      })
      toast({
        title: "Professional information updated",
        description: userData?.isPublished 
          ? "Your profile is published and visible to patients."
          : "Complete all required fields to publish your profile.",
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
        {userData.role === "doctor" && (
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Profile Status</h4>
              <p className="text-sm text-muted-foreground">
                {userData.isPublished 
                  ? "Your profile is published and visible to patients."
                  : "Complete all required fields to publish your profile."}
              </p>
            </div>
            <Badge variant={userData.isPublished ? "default" : "secondary"}>
              {userData.isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
        )}

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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Education</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEducationEntry}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>
          
          <div className="space-y-4">
            {educationEntries.map((entry, index) => (
              <div key={index} className="flex gap-4 items-start p-4 border rounded-lg">
                <div className="flex-1 space-y-4">
                  <div>
                    <FormLabel>Degree</FormLabel>
                    <Input
                      value={entry.degree}
                      onChange={(e) => updateEducationEntry(index, "degree", e.target.value)}
                      placeholder="e.g., MD, PhD"
                    />
                  </div>
                  <div>
                    <FormLabel>Institution</FormLabel>
                    <Input
                      value={entry.institution}
                      onChange={(e) => updateEducationEntry(index, "institution", e.target.value)}
                      placeholder="e.g., University of Medicine"
                    />
                  </div>
                  <div>
                    <FormLabel>Year</FormLabel>
                    <Input
                      value={entry.year}
                      onChange={(e) => updateEducationEntry(index, "year", e.target.value)}
                      placeholder="e.g., 2020"
                      maxLength={4}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEducationEntry(index)}
                  className="mt-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          {educationEntries.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Add your medical degrees, certifications, and training.
            </p>
          )}
        </div>

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

        <FormField
          control={form.control}
          name="licenseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medical License Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter your medical license number" {...field} />
              </FormControl>
              <FormDescription>
                Your official medical license number.
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