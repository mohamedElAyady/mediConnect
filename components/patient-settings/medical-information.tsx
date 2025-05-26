"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"

const medicalInfoSchema = z.object({
  gender: z.string().min(1, { message: "Please select a gender." }),
  dateOfBirth: z.date({
    required_error: "Please select a date of birth.",
  }),
  bloodType: z.string().optional(),
})

type MedicalInfoValues = z.infer<typeof medicalInfoSchema>

export default function MedicalInformation() {
  const { toast } = useToast()
  const { user } = useUser()
  const [allergies, setAllergies] = useState<string[]>([])
  const [newAllergy, setNewAllergy] = useState("")
  const [conditions, setConditions] = useState<string[]>([])
  const [newCondition, setNewCondition] = useState("")
  const updatePatientMedicalInfo = useMutation(api.users.updatePatientMedicalInfo)
  const patientSettings = useQuery(api.users.getPatientSettings, user?.id ? { clerkId: user.id } : "skip")

  const form = useForm<MedicalInfoValues>({
    resolver: zodResolver(medicalInfoSchema),
    defaultValues: {
      gender: "",
      dateOfBirth: undefined,
      bloodType: "",
    },
    mode: "onChange",
  })

  useEffect(() => {
    if (patientSettings?.medical) {
      form.reset({
        gender: patientSettings.medical.gender || "",
        dateOfBirth: patientSettings.medical.dateOfBirth ? new Date(patientSettings.medical.dateOfBirth) : undefined,
        bloodType: patientSettings.medical.bloodType || "",
      })
      setAllergies(patientSettings.medical.allergies || [])
      setConditions(patientSettings.medical.conditions || [])
    }
  }, [patientSettings, form])

  async function onSubmit(data: MedicalInfoValues) {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      })
      return
    }

    try {
      await updatePatientMedicalInfo({
        clerkId: user.id,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth.toISOString(),
        bloodType: data.bloodType,
        allergies,
        conditions,
      })

      toast({
        title: "Medical information updated",
        description: "Your medical information has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update your medical information. Please try again.",
        variant: "destructive",
      })
    }
  }

  const addAllergy = () => {
    if (newAllergy && !allergies.includes(newAllergy)) {
      setAllergies([...allergies, newAllergy])
      setNewAllergy("")
    }
  }

  const removeAllergy = (allergy: string) => {
    setAllergies(allergies.filter((a) => a !== allergy))
  }

  const addCondition = () => {
    if (newCondition && !conditions.includes(newCondition)) {
      setConditions([...conditions, newCondition])
      setNewCondition("")
    }
  }

  const removeCondition = (condition: string) => {
    setConditions(conditions.filter((c) => c !== condition))
  }

  if (!user) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Information</CardTitle>
        <CardDescription>Update your medical details to help doctors provide better care</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your blood type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Your blood type is important for medical emergencies.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div>
                <FormLabel>Allergies</FormLabel>
                <FormDescription>
                  List any allergies you have, including medications, foods, or environmental factors.
                </FormDescription>
                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                  {allergies.map((allergy) => (
                    <Badge key={allergy} variant="secondary" className="px-3 py-1">
                      {allergy}
                      <button
                        type="button"
                        onClick={() => removeAllergy(allergy)}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {allergy}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an allergy"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addAllergy}>
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add allergy</span>
                  </Button>
                </div>
              </div>

              <div>
                <FormLabel>Medical Conditions</FormLabel>
                <FormDescription>List any ongoing or chronic medical conditions you have.</FormDescription>
                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                  {conditions.map((condition) => (
                    <Badge key={condition} variant="secondary" className="px-3 py-1">
                      {condition}
                      <button
                        type="button"
                        onClick={() => removeCondition(condition)}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {condition}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a medical condition"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addCondition}>
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add condition</span>
                  </Button>
                </div>
              </div>
            </div>

            <Button type="submit">Save Medical Information</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
