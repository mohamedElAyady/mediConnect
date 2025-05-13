import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import PersonalInformation from "@/components/patient-settings/personal-information"
import ContactInformation from "@/components/patient-settings/contact-information"
import MedicalInformation from "@/components/patient-settings/medical-information"
import Preferences from "@/components/patient-settings/preferences"
import { Skeleton } from "@/components/ui/skeleton"

export default function PatientSettingsPage() {
  return (
    <div className="container py-6 max-w-5xl">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your profile information and preferences</p>
      </div>
      <Separator className="my-6" />

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4 py-4">
          <Suspense fallback={<SettingsSkeleton />}>
            <PersonalInformation />
          </Suspense>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4 py-4">
          <Suspense fallback={<SettingsSkeleton />}>
            <ContactInformation />
          </Suspense>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4 py-4">
          <Suspense fallback={<SettingsSkeleton />}>
            <MedicalInformation />
          </Suspense>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4 py-4">
          <Suspense fallback={<SettingsSkeleton />}>
            <Preferences />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-10 w-20" />
    </div>
  )
}
