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
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import React from "react"

const practiceFormSchema = z.object({
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  consultationFee: z.string().min(1, {
    message: "Consultation fee is required.",
  }),
  insurances: z.string().min(2, {
    message: "Insurance information is required.",
  }),
  acceptingNewPatients: z.boolean(),
})

type PracticeFormValues = z.infer<typeof practiceFormSchema>

export function PracticeSettings() {
  const { user } = useUser()
  const updateUser = useMutation(api.users.updateUser)
  const userData = useQuery(api.users.getUser, { clerkId: user?.id ?? "" })
  const [newInsurance, setNewInsurance] = useState("")

  const form = useForm<PracticeFormValues>({
    resolver: zodResolver(practiceFormSchema),
    defaultValues: {
      location: userData?.location ?? "",
      consultationFee: userData?.consultationFee?.toString() ?? "",
      insurances: userData?.insurances?.join(", ") ?? "",
      acceptingNewPatients: userData?.acceptingNewPatients ?? true,
    },
  })

  // Update form values when userData changes
  React.useEffect(() => {
    if (userData) {
      form.reset({
        location: userData.location ?? "",
        consultationFee: userData.consultationFee?.toString() ?? "",
        insurances: userData.insurances?.join(", ") ?? "",
        acceptingNewPatients: userData.acceptingNewPatients ?? true,
      })
    }
  }, [userData, form])

  async function onSubmit(data: PracticeFormValues) {
    try {
      await updateUser({
        clerkId: user?.id ?? "",
        location: data.location,
        consultationFee: Number(data.consultationFee),
        insurances: data.insurances.split(",").map((insurance) => insurance.trim()),
        acceptingNewPatients: data.acceptingNewPatients,
      })
      toast({
        title: "Practice information updated",
        description: "Your practice information has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update practice information. Please try again.",
        variant: "destructive",
      })
    }
  }

  const addInsurance = () => {
    if (!newInsurance.trim()) return

    const currentInsurances = form.getValues("insurances") || ""
    const insurancesList = currentInsurances ? currentInsurances.split(", ") : []
    if (!insurancesList.includes(newInsurance)) {
      const updatedInsurances = [...insurancesList, newInsurance].join(", ")
      form.setValue("insurances", updatedInsurances)
    }

    setNewInsurance("")
  }

  const removeInsurance = (insurance: string) => {
    const currentInsurances = form.getValues("insurances") || ""
    const insurancesList = currentInsurances ? currentInsurances.split(", ") : []
    const updatedInsurances = insurancesList.filter((i) => i !== insurance).join(", ")
    form.setValue("insurances", updatedInsurances)
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Practice Location</FormLabel>
              <FormControl>
                <Input placeholder="Your practice location" {...field} />
              </FormControl>
              <FormDescription>
                The address or location of your medical practice.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consultationFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Consultation Fee</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Your consultation fee"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your standard consultation fee in dollars.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="insurances"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accepted Insurances</FormLabel>
              <FormControl>
                <Input placeholder="Aetna, Blue Cross, etc." {...field} />
              </FormControl>
              <FormDescription>
                List the insurance providers you accept, separated by commas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptingNewPatients"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Accepting New Patients</FormLabel>
                <FormDescription>
                  Indicate whether you are currently accepting new patients.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Update practice information
        </Button>
      </form>
    </Form>
  )
}
