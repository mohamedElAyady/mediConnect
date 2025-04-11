"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "@/components/ui/use-toast";
import { clerkClient } from "@clerk/nextjs/server";

const formSchema = z.object({
  role: z.enum(["doctor", "patient", "admin"]),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const createUser = useMutation(api.users.createUser);
  const updateUser = useMutation(api.users.updateUser);
  const existingUser = useQuery(api.users.getUser, {
    clerkId: user?.id || "",
  });

  // Initialize form with existing data if available
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role:
        (user?.unsafeMetadata.role as "doctor" | "patient" | "admin") ||
        "patient",
      name: user?.fullName || "",
    },
  });

  // Check if user already has a role
  useEffect(() => {
    if (isLoaded && user) {
      // If user exists in Convex and has a role in Clerk, redirect to dashboard
      if (existingUser && user.unsafeMetadata.role) {
        const userRole = user.unsafeMetadata.role as string;

        if (userRole === "doctor") {
          router.push("/doctor/dashboard");
        } else if (userRole === "patient") {
          router.push("/patient/dashboard");
        } else if (userRole === "admin") {
          router.push("/admin/dashboard");
        }
      }
      // If user exists in Convex but doesn't have a role in Clerk, sync the role
      else if (existingUser && !user.unsafeMetadata.role && existingUser.role) {
        // Sync Convex role to Clerk
        user
          .update({
            unsafeMetadata: {
              role: existingUser.role,
            },
          })
          .then(() => {
            // Redirect based on the role from Convex
            if (existingUser.role === "doctor") {
              router.push("/doctor/dashboard");
            } else if (existingUser.role === "patient") {
              router.push("/patient/dashboard");
            } else if (existingUser.role === "admin") {
              router.push("/admin/dashboard");
            }
          });
      }
    }
  }, [isLoaded, user, existingUser, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      if (existingUser) {
        // Update existing user in Convex
        await updateUser({
          clerkId: user?.id || "",
          name: values.name,
          role: values.role,
        });
      } else {
        // Create new user in Convex
        await createUser({
          clerkId: user?.id || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
          name: values.name,
          role: values.role,
        });
      }

      // Update user metadata in Clerk
      await user?.update({
        unsafeMetadata: {
          role: values.role,
        },
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      // small delay to give Clerk time to update
      await new Promise((resolve) => setTimeout(resolve, 500));

      router.push(`/${values.role}/dashboard`);
      console.log(`/${values.role}/dashboard`);
      // Redirect based on role
      if (values.role === "doctor") {
        // console.log("values.role : ", values.role);
        router.prefetch("/doctor/dashboard");
        router.push("/doctor/dashboard");
      } else if (values.role === "patient") {
        router.push("/patient/dashboard");
      } else if (values.role === "admin") {
        router.push("/admin/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // If checking user role, show loading
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete your profile</CardTitle>
          <CardDescription>
            Tell us a bit about yourself to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>I am a...</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="patient" />
                          </FormControl>
                          <FormLabel className="font-normal">Patient</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="doctor" />
                          </FormControl>
                          <FormLabel className="font-normal">Doctor</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="admin" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Administrator
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : "Continue"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
