"use client"

import { useState, useRef, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Upload, X } from "lucide-react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"

const personalInfoSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  bio: z.string().optional(),
})

type PersonalInfoValues = z.infer<typeof personalInfoSchema>

export default function PersonalInformation() {
  const { toast } = useToast()
  const { user } = useUser()
  const [avatar, setAvatar] = useState<string | null>("/placeholder.svg?height=100&width=100")
  const [isUploading, setIsUploading] = useState(false)
  const updatePatientPersonalInfo = useMutation(api.users.updatePatientPersonalInfo)
  const generateUploadUrl = useMutation(api.upload.generateUploadUrl)
  const getImageUrl = useMutation(api.upload.getImageUrl)
  const patientSettings = useQuery(api.users.getPatientSettings, user?.id ? { clerkId: user.id } : "skip")

  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: "",
      bio: "",
    },
    mode: "onChange",
  })

  useEffect(() => {
    if (patientSettings?.personal) {
      form.reset({
        name: patientSettings.personal.name,
        bio: patientSettings.personal.bio || "",
      })
      setAvatar(patientSettings.personal.avatar || "/placeholder.svg?height=100&width=100")
    }
  }, [patientSettings, form])

  async function onSubmit(data: PersonalInfoValues) {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      })
      return
    }

    try {
      await updatePatientPersonalInfo({
        clerkId: user.id,
        name: data.name,
        bio: data.bio,
        avatar: avatar || undefined,
      })

      toast({
        title: "Profile updated",
        description: "Your personal information has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)

      // Get upload URL
      const uploadUrl = await generateUploadUrl()

      // Upload the file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      })

      if (!result.ok) {
        throw new Error("Failed to upload image")
      }

      const { storageId } = await result.json()

      // Get the URL for the uploaded image
      const imageUrl = await getImageUrl({ storageId })

      // Update the avatar state with the new URL
      setAvatar(imageUrl)

      toast({
        title: "Avatar uploaded",
        description: "Your profile picture has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const removeAvatar = () => {
    setAvatar("/placeholder.svg?height=100&width=100")

    toast({
      title: "Avatar removed",
      description: "Your profile picture has been removed.",
    })
  }

  if (!user) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details and how others see you on the platform</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative group">
            <Avatar className="h-24 w-24 transition-opacity group-hover:opacity-80">
              <AvatarImage src={avatar || ""} alt="Profile picture" />
              <AvatarFallback>JD</AvatarFallback>
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Avatar>
            {avatar && avatar !== "/placeholder.svg?height=100&width=100" && (
              <Button 
                variant="destructive" 
                size="icon" 
                className="h-8 w-8 rounded-full absolute -bottom-2 -right-2"
                onClick={removeAvatar}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove avatar</span>
              </Button>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium">Profile Picture</h3>
            <p className="text-sm text-muted-foreground">
              Click on the avatar to upload a new profile picture
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormDescription>This is the name that will be displayed to doctors and staff.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little about yourself"
                      className="resize-none min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description that will help doctors understand more about you.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
