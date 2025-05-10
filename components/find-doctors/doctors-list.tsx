"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Star,
  MapPin,
  Clock,
  Video,
  User,
  Award,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function DoctorsList() {
  const searchParams = useSearchParams();
  const { user } = useUser();

  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [appointmentType, setAppointmentType] = useState<string>("video");
  const [reason, setReason] = useState<string>("");

  // Fetch doctors from Convex
  const doctors = useQuery(api.users.getAllUsers, {
    role: "doctor",
    paginationOpts: { numItems: 10, cursor: null },
  });

  // Get current user's Convex ID
  const currentUser = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id ?? "",
  });

  // Filter doctors based on search params
  const filteredDoctors =
    doctors?.page?.filter((doctor) => {
      const query = searchParams.get("query")?.toLowerCase();
      const specialty = searchParams.get("specialty")?.toLowerCase();
      const location = searchParams.get("location")?.toLowerCase();
      const gender = searchParams.get("gender")?.toLowerCase();
      const rating = searchParams.get("rating");
      const insurances = searchParams.get("insurances")?.split(",");

      // Filter by search query
      if (
        query &&
        !doctor.name.toLowerCase().includes(query) &&
        !doctor.specialty?.toLowerCase().includes(query)
      ) {
        return false;
      }

      // Filter by specialty
      if (specialty && doctor.specialty?.toLowerCase() !== specialty) {
        return false;
      }

      // Filter by location
      if (location && !doctor.location?.toLowerCase().includes(location)) {
        return false;
      }

      // Filter by gender (assuming doctor gender is the first name Dr.)
      if (gender) {
        const doctorGender = doctor.name.includes("Dr. M") ? "male" : "female";
        if (doctorGender !== gender) return false;
      }

      // Filter by rating
      if (rating) {
        const minRating = Number.parseFloat(rating.replace("+", ""));
        if ((doctor.rating ?? 0) < minRating) return false;
      }

      // Filter by insurance
      if (insurances && insurances.length > 0) {
        const hasInsurance = insurances.some((insurance) =>
          (doctor.insurances ?? []).some(
            (i) => i.toLowerCase() === insurance.toLowerCase()
          )
        );
        if (!hasInsurance) return false;
      }

      return true;
    }) ?? [];

  const createAppointment = useMutation(api.appointments.createAppointment);

  const handleBookAppointment = (doctor: any) => {
    setSelectedDoctor(doctor);
    setBookingStep(1);
    setSelectedDate(undefined);
    setSelectedTime("");
    setAppointmentType("video");
    setReason("");
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime || !reason || !currentUser) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createAppointment({
        patientId: currentUser._id,
        doctorId: selectedDoctor._id,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        type: appointmentType,
        status: "pending",
        duration: "30", // Default duration in minutes
        reason: reason,
      });

      toast({
        title: "Appointment Booked",
        description: `Your appointment with ${selectedDoctor.name} on ${format(selectedDate, "MMMM d, yyyy")} at ${selectedTime} has been confirmed.`,
      });

      setSelectedDoctor(null);
      setBookingStep(1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getAvailableTimesForDate = (date: Date | undefined) => {
    if (!date || !selectedDoctor) return [];

    const dayOfWeek = format(date, "EEEE"); // Get day name (Monday, Tuesday, etc.)
    const doctorAvailability = selectedDoctor.availability?.find(
      (slot: any) => slot.day === dayOfWeek
    );

    if (!doctorAvailability) return [];

    // Generate time slots between start and end time
    const startTime = new Date(`2000-01-01T${doctorAvailability.startTime}`);
    const endTime = new Date(`2000-01-01T${doctorAvailability.endTime}`);
    const timeSlots = [];

    // Generate 30-minute slots
    let currentTime = startTime;
    while (currentTime < endTime) {
      timeSlots.push(format(currentTime, "HH:mm"));
      currentTime = new Date(currentTime.getTime() + 30 * 60000); // Add 30 minutes
    }

    return timeSlots;
  };

  const isDateAvailable = (date: Date) => {
    const dayOfWeek = format(date, "EEEE");
    return selectedDoctor?.availability?.some(
      (slot: any) => slot.day === dayOfWeek && slot.isAvailable
    ) ?? false;
  };

  if (!doctors) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {filteredDoctors.length}{" "}
          {filteredDoctors.length === 1 ? "Doctor" : "Doctors"} Found
        </h2>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsContent value="list" className="mt-0">
          <div className="space-y-4">
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border">
                <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No doctors found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              filteredDoctors.map((doctor) => (
                <Card key={doctor._id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex flex-col md:flex-row items-start gap-4 flex-1">
                      <Avatar className="h-20 w-20">
                        <AvatarImage
                          src={doctor.avatar || "/placeholder.svg"}
                          alt={doctor.name}
                        />
                        <AvatarFallback>
                          {doctor.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="space-y-2 flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {doctor.name}
                            </h3>
                            <p className="text-muted-foreground">
                              {doctor.specialty || "General Practitioner"}
                            </p>
                          </div>

                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="font-medium">
                              {doctor.rating || 0}
                            </span>
                            <span className="text-muted-foreground ml-1">
                              ({doctor.reviews || 0} reviews)
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                            <span>
                              {doctor.location || "Location not specified"}
                            </span>
                            <span className="text-muted-foreground ml-1">
                              ({doctor.distance || "N/A"})
                            </span>
                          </div>

                          <div className="flex items-center text-sm">
                            <Award className="h-4 w-4 text-muted-foreground mr-1" />
                            <span>
                              {doctor.experience || "Not specified"} experience
                            </span>
                          </div>

                          <div className="flex items-center text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                            <span>
                              {doctor.acceptingNewPatients
                                ? "Accepting new patients"
                                : "Not accepting new patients"}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-1">
                          {(doctor.insurances || []).map(
                            (insurance: string, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {insurance}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t md:border-t-0 md:border-l flex flex-col justify-center items-center gap-2 md:min-w-[180px]">
                      <div className="text-center">
                        <p className="font-medium text-lg">
                          ${doctor.consultationFee || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Consultation Fee
                        </p>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => handleBookAppointment(doctor)}
                      >
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Booking Dialog */}
      {selectedDoctor && (
        <Dialog
          open={!!selectedDoctor}
          onOpenChange={(open) => !open && setSelectedDoctor(null)}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                Book an Appointment with {selectedDoctor.name}
              </DialogTitle>
              <DialogDescription>
                Select your preferred date, time, and appointment type
              </DialogDescription>
            </DialogHeader>

            {bookingStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Select Date</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      // Disable dates that are not in the doctor's availability
                      return date < new Date() || !isDateAvailable(date);
                    }}
                    className="border rounded-md"
                  />
                </div>

                <div>
                  <h3 className="font-medium mb-2">Select Time</h3>
                  {!selectedDate ? (
                    <p className="text-muted-foreground">
                      Please select a date first
                    </p>
                  ) : getAvailableTimesForDate(selectedDate).length === 0 ? (
                    <p className="text-muted-foreground">
                      No available times for this date
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {getAvailableTimesForDate(selectedDate).map((time: string) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => setSelectedTime(time)}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}

                  <h3 className="font-medium mt-6 mb-2">Appointment Type</h3>
                  <RadioGroup
                    value={appointmentType}
                    onValueChange={setAppointmentType}
                  >
                    <div className="flex items-center space-x-2 border rounded-md p-3 mb-2">
                      <RadioGroupItem value="video" id="video" />
                      <Label htmlFor="video" className="flex items-center">
                        <Video className="mr-2 h-4 w-4" />
                        Video Consultation
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3">
                      <RadioGroupItem value="in-person" id="in-person" />
                      <Label htmlFor="in-person" className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        In-Person Visit
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {bookingStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Reason for Visit</h3>
                  <Textarea
                    placeholder="Please describe your symptoms or reason for the appointment..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Appointment Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Doctor:</span>
                      <span className="font-medium">{selectedDoctor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>
                        {selectedDate
                          ? format(selectedDate, "MMMM d, yyyy")
                          : ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span>{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span>
                        {appointmentType === "video"
                          ? "Video Consultation"
                          : "In-Person Visit"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fee:</span>
                      <span className="font-medium">
                        ${selectedDoctor.consultationFee || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="flex justify-between sm:justify-between">
              {bookingStep === 1 ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDoctor(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setBookingStep(2)}
                    disabled={!selectedDate || !selectedTime}
                  >
                    Next
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setBookingStep(1)}>
                    Back
                  </Button>
                  <Button onClick={handleConfirmBooking}>
                    Confirm Booking
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
