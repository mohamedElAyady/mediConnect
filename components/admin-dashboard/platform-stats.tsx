import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function PlatformStats() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Platform Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">System Uptime</span>
              <span className="text-sm text-green-500 font-medium">99.98%</span>
            </div>
            <Progress value={99.98} className="h-2" />
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Appointment Completion Rate</span>
              <span className="text-sm font-medium">87.3%</span>
            </div>
            <Progress value={87.3} className="h-2" />
            <p className="text-xs text-muted-foreground">Completed vs. scheduled</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Doctor Verification Rate</span>
              <span className="text-sm font-medium">92.1%</span>
            </div>
            <Progress value={92.1} className="h-2" />
            <p className="text-xs text-muted-foreground">Approved vs. applied</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Patient Satisfaction</span>
              <span className="text-sm font-medium">4.7/5</span>
            </div>
            <Progress value={94} className="h-2" />
            <p className="text-xs text-muted-foreground">Based on post-appointment surveys</p>
          </div>

          <div className="pt-2">
            <h4 className="text-sm font-medium mb-2">Active Users Today</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <Card className="p-2">
                <p className="text-xs text-muted-foreground">Doctors</p>
                <p className="text-lg font-medium">127</p>
              </Card>
              <Card className="p-2">
                <p className="text-xs text-muted-foreground">Patients</p>
                <p className="text-lg font-medium">843</p>
              </Card>
              <Card className="p-2">
                <p className="text-xs text-muted-foreground">Admins</p>
                <p className="text-lg font-medium">12</p>
              </Card>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
