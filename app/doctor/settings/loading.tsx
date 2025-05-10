import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export default function DoctorSettingsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage your account settings and preferences." />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" disabled>
            Profile
          </TabsTrigger>
          <TabsTrigger value="professional" disabled>
            Professional
          </TabsTrigger>
          <TabsTrigger value="practice" disabled>
            Practice
          </TabsTrigger>
          <TabsTrigger value="availability" disabled>
            Availability
          </TabsTrigger>
          <TabsTrigger value="integrations" disabled>
            Integrations
          </TabsTrigger>
          <TabsTrigger value="account" disabled>
            Account
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <div className="space-y-6">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
