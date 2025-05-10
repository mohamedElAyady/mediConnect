import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DoctorSearch } from "@/components/find-doctors/doctor-search"
import { DoctorFilters } from "@/components/find-doctors/doctor-filters"
import { DoctorsList } from "@/components/find-doctors/doctors-list"
import { Separator } from "@/components/ui/separator"

export default function FindDoctorsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Find Doctors"
        text="Search for doctors by name, specialty, or location and book your appointment."
      />

      <div className="flex flex-col gap-6">
        <DoctorSearch />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-64 flex-shrink-0">
            <DoctorFilters />
          </div>

          <Separator orientation="vertical" className="hidden lg:block h-auto" />

          <div className="flex-1">
            <DoctorsList />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
