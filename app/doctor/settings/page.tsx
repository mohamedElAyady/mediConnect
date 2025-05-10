import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { ProfessionalSettings } from "@/components/settings/professional-settings";
import { PracticeSettings } from "@/components/settings/practice-settings";
import { AvailabilitySettings } from "@/components/settings/availability-settings";
import { IntegrationsSettings } from "@/components/settings/integrations-settings";
import { AccountSettings } from "@/components/settings/account-settings";

export default function DoctorSettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage your account settings and preferences."
      />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <ProfileSettings />
        </TabsContent>
        <TabsContent value="professional" className="mt-6">
          <ProfessionalSettings />
        </TabsContent>
        <TabsContent value="practice" className="mt-6">
          <PracticeSettings />
        </TabsContent>
        <TabsContent value="availability" className="mt-6">
          <AvailabilitySettings />
        </TabsContent>
        <TabsContent value="integrations" className="mt-6">
          <IntegrationsSettings />
        </TabsContent>
        <TabsContent value="account" className="mt-6">
          <AccountSettings />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
