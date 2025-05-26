import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SystemSettings() {
  return (
    <Tabs defaultValue="general">
      <TabsList className="mb-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <CardDescription>Configure general platform settings and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform-name">Platform Name</Label>
              <Input id="platform-name" defaultValue="MediConnect" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Support Email</Label>
              <Input id="support-email" type="email" defaultValue="support@mediconnect.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Default Timezone</Label>
              <Select defaultValue="America/New_York">
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Put the platform in maintenance mode</p>
              </div>
              <Switch id="maintenance-mode" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registration Settings</CardTitle>
            <CardDescription>Configure user registration and onboarding settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="open-registration">Open Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new users to register</p>
              </div>
              <Switch id="open-registration" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="doctor-verification">Doctor Verification</Label>
                <p className="text-sm text-muted-foreground">Require manual verification for doctor accounts</p>
              </div>
              <Switch id="doctor-verification" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="invite-only">Invite Only</Label>
                <p className="text-sm text-muted-foreground">Restrict registration to invited users only</p>
              </div>
              <Switch id="invite-only" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="welcome-message">Welcome Message</Label>
              <Textarea
                id="welcome-message"
                defaultValue="Welcome to MediConnect! We're excited to have you join our platform."
                rows={3}
              />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Configure email notification settings and templates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="appointment-reminders">Appointment Reminders</Label>
                <p className="text-sm text-muted-foreground">Send email reminders for upcoming appointments</p>
              </div>
              <Switch id="appointment-reminders" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder-time">Reminder Time</Label>
              <Select defaultValue="24">
                <SelectTrigger id="reminder-time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour before</SelectItem>
                  <SelectItem value="3">3 hours before</SelectItem>
                  <SelectItem value="24">24 hours before</SelectItem>
                  <SelectItem value="48">48 hours before</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="welcome-emails">Welcome Emails</Label>
                <p className="text-sm text-muted-foreground">Send welcome emails to new users</p>
              </div>
              <Switch id="welcome-emails" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing-emails">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">Send promotional and marketing emails</p>
              </div>
              <Switch id="marketing-emails" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-sender">Email Sender Name</Label>
              <Input id="email-sender" defaultValue="MediConnect Team" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Notifications</CardTitle>
            <CardDescription>Configure internal system notification settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="new-doctor-alerts">New Doctor Alerts</Label>
                <p className="text-sm text-muted-foreground">Notify admins when new doctors register</p>
              </div>
              <Switch id="new-doctor-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="issue-alerts">Issue Alerts</Label>
                <p className="text-sm text-muted-foreground">Notify admins when users report issues</p>
              </div>
              <Switch id="issue-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="system-alerts">System Alerts</Label>
                <p className="text-sm text-muted-foreground">Notify admins about system performance issues</p>
              </div>
              <Switch id="system-alerts" defaultChecked />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Configure platform security and access controls.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="two-factor">Require Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
              </div>
              <Switch id="two-factor" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input id="session-timeout" type="number" defaultValue="30" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="password-complexity">Password Complexity</Label>
                <p className="text-sm text-muted-foreground">Require strong passwords with special characters</p>
              </div>
              <Switch id="password-complexity" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-expiry">Password Expiry (days)</Label>
              <Input id="password-expiry" type="number" defaultValue="90" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="login-attempts">Limit Login Attempts</Label>
                <p className="text-sm text-muted-foreground">Lock accounts after multiple failed login attempts</p>
              </div>
              <Switch id="login-attempts" defaultChecked />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Protection</CardTitle>
            <CardDescription>Configure data protection and privacy settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="data-encryption">Data Encryption</Label>
                <p className="text-sm text-muted-foreground">Enable end-to-end encryption for sensitive data</p>
              </div>
              <Switch id="data-encryption" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="data-retention">Data Retention Policy</Label>
                <p className="text-sm text-muted-foreground">Automatically delete inactive user data</p>
              </div>
              <Switch id="data-retention" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retention-period">Retention Period (months)</Label>
              <Input id="retention-period" type="number" defaultValue="24" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="privacy-policy">Privacy Policy</Label>
              <Textarea
                id="privacy-policy"
                defaultValue="Our privacy policy outlines how we collect, use, and protect your personal information..."
                rows={3}
              />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="integrations" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>API Settings</CardTitle>
            <CardDescription>Configure API access and integration settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable-api">Enable API Access</Label>
                <p className="text-sm text-muted-foreground">Allow external applications to access the API</p>
              </div>
              <Switch id="enable-api" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="flex gap-2">
                <Input id="api-key" defaultValue="sk_live_51KjM8dGhTR7NbTgH..." type="password" />
                <Button variant="outline">Regenerate</Button>
              </div>
              <p className="text-xs text-muted-foreground">Keep this key secret. Last regenerated on May 10, 2023.</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="rate-limiting">Rate Limiting</Label>
                <p className="text-sm text-muted-foreground">Limit API requests per minute</p>
              </div>
              <Switch id="rate-limiting" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate-limit">Rate Limit (requests per minute)</Label>
              <Input id="rate-limit" type="number" defaultValue="100" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Third-Party Integrations</CardTitle>
            <CardDescription>Configure integrations with external services.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="google-calendar">Google Calendar</Label>
                <p className="text-sm text-muted-foreground">Sync appointments with Google Calendar</p>
              </div>
              <Switch id="google-calendar" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="stripe">Stripe Payments</Label>
                <p className="text-sm text-muted-foreground">Process payments through Stripe</p>
              </div>
              <Switch id="stripe" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="twilio">Twilio SMS</Label>
                <p className="text-sm text-muted-foreground">Send SMS notifications via Twilio</p>
              </div>
              <Switch id="twilio" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="zoom">Zoom Meetings</Label>
                <p className="text-sm text-muted-foreground">Integrate with Zoom for video consultations</p>
              </div>
              <Switch id="zoom" defaultChecked />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appearance" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
            <CardDescription>Configure the appearance and branding of the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme-mode">Theme Mode</Label>
              <Select defaultValue="system">
                <SelectTrigger id="theme-mode">
                  <SelectValue placeholder="Select theme mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex gap-2">
                <Input id="primary-color" type="color" defaultValue="#0070f3" className="w-16 h-10" />
                <Input defaultValue="#0070f3" className="flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex gap-2">
                <Input id="secondary-color" type="color" defaultValue="#f5f5f5" className="w-16 h-10" />
                <Input defaultValue="#f5f5f5" className="flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo-upload">Logo</Label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-md border flex items-center justify-center bg-muted">
                  <img src="/placeholder.svg?height=64&width=64" alt="Logo preview" className="h-12 w-12" />
                </div>
                <Button variant="outline">Upload New Logo</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="favicon-upload">Favicon</Label>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-md border flex items-center justify-center bg-muted">
                  <img src="/placeholder.svg?height=32&width=32" alt="Favicon preview" className="h-8 w-8" />
                </div>
                <Button variant="outline">Upload New Favicon</Button>
              </div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom CSS</CardTitle>
            <CardDescription>Add custom CSS to customize the platform appearance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-css">Custom CSS</Label>
              <Textarea
                id="custom-css"
                className="font-mono text-sm"
                rows={8}
                placeholder="/* Add your custom CSS here */
.custom-class {
  color: #333;
  background-color: #f9f9f9;
}"
              />
              <p className="text-xs text-muted-foreground">
                Custom CSS will be applied to the entire platform. Use with caution.
              </p>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
