"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { Switch } from "@/components/ui/switch"

const preferencesSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(true),
  appointmentReminders: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
})

type PreferencesValues = z.infer<typeof preferencesSchema>

export default function Preferences() {
  const { toast } = useToast()
  const [languages, setLanguages] = useState<Array<{ name: string; proficiency: string }>>([
    { name: "English", proficiency: "native" },
    { name: "Spanish", proficiency: "intermediate" },
  ])
  const [newLanguage, setNewLanguage] = useState("")
  const [newProficiency, setNewProficiency] = useState("beginner")

  // Mock data - in a real app, this would come from your database
  const defaultValues: Partial<PreferencesValues> = {
    emailNotifications: true,
    smsNotifications: true,
    appointmentReminders: true,
    marketingEmails: false,
  }

  const form = useForm<PreferencesValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(data: PreferencesValues) {
    // In a real app, you would save this data to your database
    console.log(data)
    console.log("Languages:", languages)

    toast({
      title: "Preferences updated",
      description: "Your preferences have been updated successfully.",
    })
  }

  const addLanguage = () => {
    if (newLanguage && !languages.some((l) => l.name.toLowerCase() === newLanguage.toLowerCase())) {
      setLanguages([...languages, { name: newLanguage, proficiency: newProficiency }])
      setNewLanguage("")
      setNewProficiency("beginner")
    }
  }

  const removeLanguage = (languageName: string) => {
    setLanguages(languages.filter((l) => l.name !== languageName))
  }

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case "native":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "fluent":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "advanced":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "beginner":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Customize your experience and communication preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Languages</h3>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {languages.map((language) => (
                  <Badge
                    key={language.name}
                    variant="outline"
                    className={`px-3 py-1 ${getProficiencyColor(language.proficiency)}`}
                  >
                    {language.name} ({language.proficiency})
                    <button
                      type="button"
                      onClick={() => removeLanguage(language.name)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {language.name}</span>
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Add a language"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="flex-1"
                />
                <Select value={newProficiency} onValueChange={setNewProficiency}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Proficiency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="native">Native</SelectItem>
                    <SelectItem value="fluent">Fluent</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" onClick={addLanguage} className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Adding languages helps doctors communicate with you more effectively.
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Preferences</h3>

                <FormField
                  control={form.control}
                  name="emailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Email Notifications</FormLabel>
                        <FormDescription>Receive notifications about your appointments via email</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smsNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">SMS Notifications</FormLabel>
                        <FormDescription>
                          Receive notifications about your appointments via text message
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="appointmentReminders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Appointment Reminders</FormLabel>
                        <FormDescription>Receive reminders before your scheduled appointments</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marketingEmails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Marketing Emails</FormLabel>
                        <FormDescription>Receive emails about new features and health tips</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit">Save Preferences</Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  )
}
