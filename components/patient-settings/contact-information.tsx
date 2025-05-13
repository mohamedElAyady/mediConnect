"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Lock } from "lucide-react"

const contactInfoSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }).optional(),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).optional(),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }).optional(),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }).optional(),
})

type ContactInfoValues = z.infer<typeof contactInfoSchema>

export default function ContactInformation() {
  const { toast } = useToast()

  // Mock data - in a real app, this would come from your database
  const defaultValues: Partial<ContactInfoValues> = {
    email: "john.doe@example.com",
    phone: "555-123-4567",
    address: "123 Main St, Apt 4B",
    location: "New York, NY",
  }

  const form = useForm<ContactInfoValues>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(data: ContactInfoValues) {
    // In a real app, you would save this data to your database
    console.log(data)

    toast({
      title: "Contact information updated",
      description: "Your contact details have been updated successfully.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>Update your contact details for communications and appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Input placeholder="Enter your email address" {...field} disabled className="flex-1" />
                    </FormControl>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <FormDescription>
                    Your email is managed through your account settings and cannot be changed here.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your phone number will be used for appointment reminders and urgent communications.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your address" {...field} />
                  </FormControl>
                  <FormDescription>Your full address for medical records and billing purposes.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>General Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City, State" {...field} />
                  </FormControl>
                  <FormDescription>Your general location helps us find nearby doctors for you.</FormDescription>
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
