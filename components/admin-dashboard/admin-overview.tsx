import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Users, Calendar, UserCheck, AlertCircle } from "lucide-react"

export function AdminOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2,853</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <span className="text-green-500 flex items-center mr-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              12%
            </span>
            from last month
          </p>
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <div>
              <p className="font-medium">Doctors</p>
              <p className="text-sm">432</p>
            </div>
            <div>
              <p className="font-medium">Patients</p>
              <p className="text-sm">2,421</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Appointments</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,248</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            <span className="text-green-500 flex items-center mr-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              8%
            </span>
            from last month
          </p>
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <div>
              <p className="font-medium">Completed</p>
              <p className="text-sm">876</p>
            </div>
            <div>
              <p className="font-medium">Upcoming</p>
              <p className="text-sm">372</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Verification Queue</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-muted-foreground mt-1">Doctors awaiting verification</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Card className="bg-muted/50 p-2">
              <p className="text-xs font-medium">High Priority</p>
              <p className="text-sm">8</p>
            </Card>
            <Card className="bg-muted/50 p-2">
              <p className="text-xs font-medium">Standard</p>
              <p className="text-sm">16</p>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Issues Reported</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">7</div>
          <p className="text-xs text-muted-foreground mt-1">Active issues requiring attention</p>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs">Critical</span>
              <span className="text-xs font-medium text-red-500">2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">High</span>
              <span className="text-xs font-medium text-amber-500">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Medium</span>
              <span className="text-xs font-medium">2</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
