import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AppointmentsFilters } from "@/components/appointments/appointments-filters";
import { AppointmentsList } from "@/components/appointments/appointments-list";
import { DoctorCalendar } from "@/components/appointments/doctor-calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, List } from "lucide-react";

export default function DoctorAppointmentsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Appointments"
        text="Manage your patient appointments and schedule."
      />

      <AppointmentsFilters />

      <Tabs defaultValue="list" className="w-full">
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
        <TabsContent value="list" className="mt-4">
          <AppointmentsList />
        </TabsContent>
        <TabsContent value="calendar" className="mt-4">
          <DoctorCalendar />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
