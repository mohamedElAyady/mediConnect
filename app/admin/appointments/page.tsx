import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AppointmentsCalendar } from "@/components/appointments/appointments-calendar"
import { AppointmentsFilters } from "@/components/appointments/appointments-filters"
import { AdminAppointmentsList } from "@/components/appointments/admin-appointments-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, List } from "lucide-react"

export default function AdminAppointmentsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Appointments Management"
        text="Monitor and manage all appointments across the platform."
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
          <AdminAppointmentsList />
        </TabsContent>
        <TabsContent value="calendar" className="mt-4">
          <AppointmentsCalendar />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
