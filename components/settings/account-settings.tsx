"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function AccountSettings() {
  const { user, isLoaded } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [appointmentReminders, setAppointmentReminders] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  const handleSaveNotificationSettings = async () => {
    setIsSubmitting(true)

    try {
      // In a real app, this would update the user's notification preferences
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Notification preferences updated",
        description: "Your notification preferences have been updated successfully.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "There was an error updating your notification preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAccount = async () => {
    // In a real app, this would delete the user's account
    toast({
      title: "Account deletion requested",
      description:
        "Your account deletion request has been submitted. You will receive an email with further instructions.",
    })
  }

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how and when you receive notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
              <span>Email Notifications</span>
              <span className="text-sm font-normal text-muted-foreground">Receive notifications via email.</span>
            </Label>
            <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="sms-notifications" className="flex flex-col space-y-1">
              <span>SMS Notifications</span>
              <span className="text-sm font-normal text-muted-foreground">Receive notifications via text message.</span>
            </Label>
            <Switch id="sms-notifications" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="appointment-reminders" className="flex flex-col space-y-1">
              <span>Appointment Reminders</span>
              <span className="text-sm font-normal text-muted-foreground">
                Receive reminders about upcoming appointments.
              </span>
            </Label>
            <Switch
              id="appointment-reminders"
              checked={appointmentReminders}
              onCheckedChange={setAppointmentReminders}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="marketing-emails" className="flex flex-col space-y-1">
              <span>Marketing Emails</span>
              <span className="text-sm font-normal text-muted-foreground">
                Receive marketing and promotional emails.
              </span>
            </Label>
            <Switch id="marketing-emails" checked={marketingEmails} onCheckedChange={setMarketingEmails} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveNotificationSettings} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>Manage your account settings and data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Export Your Data</h3>
            <p className="text-sm text-muted-foreground">
              Download a copy of your personal data, including profile information and appointment history.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "Data export requested",
                  description:
                    "Your data export has been requested. You will receive an email with a download link shortly.",
                })
              }}
            >
              Export Data
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Change Password</h3>
            <p className="text-sm text-muted-foreground">Update your account password to maintain security.</p>
            <Button
              variant="outline"
              onClick={() => {
                // In a real app, this would redirect to Clerk's change password flow
                toast({
                  title: "Password reset email sent",
                  description: "Check your email for instructions to reset your password.",
                })
              }}
            >
              Change Password
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-destructive">Delete Account</h3>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove your data from
                    our servers.
                    <br />
                    <br />
                    All your patient records, appointments, and messages will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount}>Delete Account</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
