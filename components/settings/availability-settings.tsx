"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const availabilityItemSchema = z.object({
  day: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  isAvailable: z.boolean(),
});

const availabilityFormSchema = z.object({
  availability: z.array(availabilityItemSchema),
});

type AvailabilityItem = z.infer<typeof availabilityItemSchema>;
type AvailabilityFormValues = z.infer<typeof availabilityFormSchema>;

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function AvailabilitySettings() {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateUser = useMutation(api.users.updateUser);
  const userData = useQuery(api.users.getUser, { clerkId: user?.id ?? "" });

  const form = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilityFormSchema),
    defaultValues: {
      availability: DAYS_OF_WEEK.map((day) => ({
        day,
        startTime: "09:00",
        endTime: "17:00",
        isAvailable: false,
      })),
    },
  });

  // Update form values when userData changes
  React.useEffect(() => {
    if (userData?.availability) {
      const availabilityWithDefaults = DAYS_OF_WEEK.map((day) => {
        const existingSlot = userData.availability?.find(
          (slot) => slot.day === day
        );
        return (
          existingSlot || {
            day,
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: false,
          }
        );
      });

      form.reset({
        availability: availabilityWithDefaults,
      });
    }
  }, [userData, form]);

  async function onSubmit(data: AvailabilityFormValues) {
    setIsSubmitting(true);

    try {
      await updateUser({
        clerkId: user?.id ?? "",
        availability: data.availability,
      });
      toast({
        title: "Availability updated",
        description: "Your availability has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update availability. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability Schedule</CardTitle>
        <CardDescription>
          Set your regular working hours and availability for appointments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              {DAYS_OF_WEEK.map((day, index) => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-32">
                    <FormLabel>{day}</FormLabel>
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`availability.${index}.isAvailable`}
                      render={({ field }) => (
                        <FormItem className="space-y-2 flex flex-row items-center space-y-0.5 gap-4">
                          {/* <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Available
                            </FormLabel>
                            <FormDescription>
                              Toggle availability for this day
                            </FormDescription>
                          </div> */}
                          <FormDescription>
                            Toggle availability for this day
                          </FormDescription>
                          <FormControl>
                            <Switch
                              checked={field.value === undefined ? false : field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {form.watch(`availability.${index}.isAvailable`) && (
                      <>
                        <FormField
                          control={form.control}
                          name={`availability.${index}.startTime`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`availability.${index}.endTime`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update availability
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
