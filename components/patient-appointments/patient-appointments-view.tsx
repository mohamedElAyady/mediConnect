"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PatientAppointmentsList } from "@/components/patient-appointments/patient-appointments-list"
import { PatientAppointmentsCalendar } from "@/components/patient-appointments/patient-appointments-calendar"
import { PatientAppointmentsFilters } from "@/components/patient-appointments/patient-appointments-filters"
import { CalendarDays, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function PatientAppointmentsView() {
  const router = useRouter()
  const [view, setView] = useState<"list" | "calendar">("list")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PatientAppointmentsFilters />
        <Button onClick={() => router.push("/patient/find-doctors")} className="w-full sm:w-auto">
          Book New Appointment
        </Button>
      </div>

      <Tabs defaultValue="list" className="w-full" onValueChange={(value) => setView(value as "list" | "calendar")}>
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-6">
          <PatientAppointmentsList />
        </TabsContent>
        <TabsContent value="calendar" className="mt-6">
          <PatientAppointmentsCalendar />
        </TabsContent>
      </Tabs>
    </div>
  )
}
