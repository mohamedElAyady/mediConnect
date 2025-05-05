import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PatientsList } from "@/components/patients/patients-list"
import { PatientFilters } from "@/components/patients/patient-filters"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { AddPatientButton } from "@/components/patients/add-patient-button"

export default function DoctorPatientsPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <DashboardHeader heading="My Patients" text="Manage your patient list and medical records." />
        <AddPatientButton />
      </div>

      <PatientFilters />
      <PatientsList />
    </DashboardShell>
  )
}
