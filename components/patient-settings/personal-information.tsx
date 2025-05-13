"use client"

import { useState } from "react"
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

const personalInfoSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  bio: z.string().optional(),
})

type PersonalInfoValues = z.infer<typeof personalInfoSchema>

export default function PersonalInformation() {
  const { toast } = useToast()
  const [avatar, setAvatar] = useState<string | null>("/placeholder.svg?height=100&width=100")
  const [isUploading, setIsUploading] = useState(false)

  // Mock data - in a real app, this would come from your database
  const defaultValues: Partial<PersonalInfoValues> = {
    name: "John Doe",
    bio: "I'm a patient at MediConnect, looking for quality healthcare services.",
  }

  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(data: PersonalInfoValues) {
    // In a real app, you would save this data to your database
    console.log(data)

    toast({
      title: "Profile updated",
      description: "Your personal information has been updated successfully.",
    })
  }

  const handleAvatarUpload = () => {
    // Simulate file upload
    setIsUploading(true)
    setTimeout(() => {
      setAvatar("/placeholder.svg?height=100&width=100&text=JD")
      setIsUploading(false)

      toast({
        title: "Avatar uploaded",
        description: "Your profile picture has been updated successfully.",
      })
    }, 1500)
  }

  const removeAvatar = () => {
    setAvatar("/placeholder.svg?height=100&width=100")

    toast({
      title: "Avatar removed",
      description: "Your profile picture has been removed.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details and how others see you on the platform</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatar || ""} alt="Profile picture" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 flex gap-1">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleAvatarUpload}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4" />
                <span className="sr-only">Upload avatar</span>
              </Button>
              {avatar && avatar.includes("text=JD") && (
                <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full" onClick={removeAvatar}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove avatar</span>
                </Button>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium">Profile Picture</h3>
            <p className="text-sm text-muted-foreground">
              This will be displayed on your profile and in discussions with doctors
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
