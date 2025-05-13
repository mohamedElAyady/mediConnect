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
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  role: z.enum(["doctor", "patient", "admin"]),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  // Patient specific fields
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().optional(),
    relationship: z.string().optional(),
    phoneNumber: z.string().optional(),
  }).optional(),
  medicalHistory: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),
  // Doctor specific fields
  specialty: z.string().optional(),
  licenseNumber: z.string().optional(),
  experience: z.string().optional(),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    year: z.string(),
  })).optional(),
  languages: z.array(z.string()).optional(),
  consultationFee: z.string().optional(),
  calendarIntegration: z.boolean().optional(),
});

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showPatientFields, setShowPatientFields] = useState(false);
  const [showDoctorFields, setShowDoctorFields] = useState(false);
  const createUser = useMutation(api.users.createUser);
  const updateUser = useMutation(api.users.updateUser);
  const existingUser = useQuery(api.users.getUser, {
    clerkId: user?.id || "",
  });

  // Initialize form with existing data if available
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: (user?.unsafeMetadata.role as "doctor" | "patient" | "admin") || "patient",
      name: user?.fullName || "",
      dateOfBirth: "",
      gender: undefined,
      bloodType: undefined,
      height: "",
      weight: "",
      address: "",
      phoneNumber: "",
      emergencyContact: {
        name: "",
        relationship: "",
        phoneNumber: "",
      },
      medicalHistory: [],
      allergies: [],
      currentMedications: [],
      specialty: "",
      licenseNumber: "",
      experience: "",
      education: [],
      languages: [],
      consultationFee: "",
      calendarIntegration: false,
    },
  });

  // Watch role changes to show/hide fields
  const role = form.watch("role");
  useEffect(() => {
    setShowPatientFields(role === "patient");
    setShowDoctorFields(role === "doctor");
  }, [role]);

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

      // Check if all required doctor fields are filled
      const isDoctorProfileComplete = Boolean(
        values.role === "doctor" && 
        values.specialty &&
        values.licenseNumber &&
        values.experience &&
        (values.education ?? []).length > 0 &&
        values.consultationFee
      );

      if (existingUser) {
        // Update existing user in Convex
        await updateUser({
          clerkId: user?.id || "",
          name: values.name,
          role: values.role,
          ...(values.role === "doctor" && {
            specialty: values.specialty,
            licenseNumber: values.licenseNumber,
            experience: values.experience,
            education: JSON.stringify(values.education),
            languages: values.languages,
            consultationFee: values.consultationFee ? Number(values.consultationFee) : undefined,
            isPublished: false,
          }),
        });
      } else {
        // Create new user in Convex
        await createUser({
          clerkId: user?.id || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
          name: values.name,
          role: values.role,
          ...(values.role === "doctor" && {
            specialty: values.specialty,
            licenseNumber: values.licenseNumber,
            experience: values.experience,
            education: JSON.stringify(values.education),
            languages: values.languages,
            consultationFee: values.consultationFee ? Number(values.consultationFee) : undefined,
            isPublished: false,
          }),
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
        description: isDoctorProfileComplete 
          ? "Your profile has been published and is now visible to patients."
          : "Your profile has been updated.",
      });

      // small delay to give Clerk time to update
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Redirect based on role
      if (values.role === "doctor") {
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
      <Card className="w-full max-w-2xl">
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
                          <FormLabel className="font-normal">Administrator</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showPatientFields && (
                <div className="space-y-6 border-t pt-6">
                  <h3 className="text-lg font-medium">Additional Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <select
                              className="w-full p-2 border rounded-md"
                              {...field}
                            >
                              <option value="">Select gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="170" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="70" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bloodType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Type</FormLabel>
                        <FormControl>
                          <select
                            className="w-full p-2 border rounded-md"
                            {...field}
                          >
                            <option value="">Select blood type</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </FormControl>
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
                          <Input placeholder="123 Main St, City, Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 234 567 890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <h4 className="font-medium">Emergency Contact</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="emergencyContact.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Emergency contact name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="emergencyContact.relationship"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Spouse, Parent" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="emergencyContact.phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 234 567 890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Medical Information</h4>
                    <FormField
                      control={form.control}
                      name="medicalHistory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medical History</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter conditions (comma-separated)"
                              onChange={(e) => {
                                const values = e.target.value.split(",").map(v => v.trim());
                                field.onChange(values);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="allergies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allergies</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter allergies (comma-separated)"
                              onChange={(e) => {
                                const values = e.target.value.split(",").map(v => v.trim());
                                field.onChange(values);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currentMedications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Medications</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter medications (comma-separated)"
                              onChange={(e) => {
                                const values = e.target.value.split(",").map(v => v.trim());
                                field.onChange(values);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {showDoctorFields && (
                <div className="space-y-6 border-t pt-6">
                  <h3 className="text-lg font-medium">Professional Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="specialty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialty</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Cardiology" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>License Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Medical license number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="5" {...field} />
                          </FormControl>
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
                            <Input type="number" placeholder="100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Education</h4>
                    {form.watch("education")?.map((_, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`education.${index}.degree`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Degree</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., MD" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`education.${index}.institution`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Institution</FormLabel>
                              <FormControl>
                                <Input placeholder="University name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`education.${index}.year`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year</FormLabel>
                              <FormControl>
                                <Input placeholder="2020" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const currentEducation = form.getValues("education") || [];
                        form.setValue("education", [
                          ...currentEducation,
                          { degree: "", institution: "", year: "" },
                        ]);
                      }}
                    >
                      Add Education
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Languages</h4>
                    <FormField
                      control={form.control}
                      name="languages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Languages Spoken</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter languages (comma-separated)"
                              onChange={(e) => {
                                const values = e.target.value.split(",").map(v => v.trim());
                                field.onChange(values);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Calendar Integration</h4>
                    <FormField
                      control={form.control}
                      name="calendarIntegration"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Connect Google Calendar
                            </FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Sync your availability with Google Calendar
                            </div>
                          </div>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                // Here you would typically redirect to Google OAuth
                                toast({
                                  title: "Calendar Integration",
                                  description: "Redirecting to Google Calendar integration...",
                                });
                              }}
                            >
                              Connect Calendar
                            </Button>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
