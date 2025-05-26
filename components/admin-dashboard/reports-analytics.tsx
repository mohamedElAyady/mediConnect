import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download, Calendar } from "lucide-react"

export function ReportsAnalytics() {
  // Mock data for charts
  const userGrowthData = [
    { name: "Jan", doctors: 25, patients: 120 },
    { name: "Feb", doctors: 30, patients: 150 },
    { name: "Mar", doctors: 35, patients: 180 },
    { name: "Apr", doctors: 40, patients: 220 },
    { name: "May", doctors: 45, patients: 250 },
    { name: "Jun", doctors: 50, patients: 300 },
  ]

  const appointmentData = [
    { name: "Mon", scheduled: 45, completed: 40, cancelled: 5 },
    { name: "Tue", scheduled: 55, completed: 48, cancelled: 7 },
    { name: "Wed", scheduled: 60, completed: 55, cancelled: 5 },
    { name: "Thu", scheduled: 50, completed: 45, cancelled: 5 },
    { name: "Fri", scheduled: 65, completed: 60, cancelled: 5 },
    { name: "Sat", scheduled: 40, completed: 35, cancelled: 5 },
    { name: "Sun", scheduled: 30, completed: 25, cancelled: 5 },
  ]

  const specialtyDistribution = [
    { name: "Cardiology", value: 20 },
    { name: "Neurology", value: 15 },
    { name: "Dermatology", value: 18 },
    { name: "Pediatrics", value: 22 },
    { name: "Orthopedics", value: 17 },
    { name: "Other", value: 8 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  // Mock data for tables
  const topDoctors = [
    { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiology", appointments: 156, rating: 4.8 },
    { id: 2, name: "Dr. James Rodriguez", specialty: "Orthopedics", appointments: 142, rating: 4.7 },
    { id: 3, name: "Dr. Emily Wilson", specialty: "Obstetrics", appointments: 138, rating: 4.9 },
    { id: 4, name: "Dr. David Kim", specialty: "Pediatrics", appointments: 125, rating: 4.6 },
    { id: 5, name: "Dr. Lisa Martinez", specialty: "Dermatology", appointments: 118, rating: 4.5 },
  ]

  return (
    <Tabs defaultValue="overview">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
        <TabsTrigger value="financial">Financial</TabsTrigger>
        <TabsTrigger value="custom">Custom Reports</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-medium">Platform Overview</h3>
          <div className="flex items-center gap-2">
            <Select defaultValue="last30days">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Last 7 days</SelectItem>
                <SelectItem value="last30days">Last 30 days</SelectItem>
                <SelectItem value="last90days">Last 90 days</SelectItem>
                <SelectItem value="lastyear">Last year</SelectItem>
                <SelectItem value="alltime">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                <DropdownMenuItem>Export as Excel</DropdownMenuItem>
                <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,853</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,248</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89.7%</div>
              <p className="text-xs text-muted-foreground">+2.3% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.7</div>
              <p className="text-xs text-muted-foreground">+0.2 from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>New user registrations over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="doctors" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="patients" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
              <CardDescription>Weekly appointment statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appointmentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="scheduled" fill="#8884d8" />
                    <Bar dataKey="completed" fill="#82ca9d" />
                    <Bar dataKey="cancelled" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Specialty Distribution</CardTitle>
              <CardDescription>Distribution of doctors by specialty</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={specialtyDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {specialtyDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Top Performing Doctors</CardTitle>
              <CardDescription>Doctors with the highest number of appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Appointments</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell className="font-medium">{doctor.name}</TableCell>
                      <TableCell>{doctor.specialty}</TableCell>
                      <TableCell>{doctor.appointments}</TableCell>
                      <TableCell>{doctor.rating}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="users" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>User Analytics</CardTitle>
            <CardDescription>Detailed analytics about platform users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This section contains detailed analytics about user growth, engagement, and demographics.
            </p>
            <div className="h-[400px] border rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">User analytics charts and tables will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appointments" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Analytics</CardTitle>
            <CardDescription>Detailed analytics about appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This section contains detailed analytics about appointment scheduling, completion rates, and
              cancellations.
            </p>
            <div className="h-[400px] border rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Appointment analytics charts and tables will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="financial" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Financial Analytics</CardTitle>
            <CardDescription>Detailed analytics about platform revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This section contains detailed analytics about revenue, payments, and financial performance.
            </p>
            <div className="h-[400px] border rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Financial analytics charts and tables will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="custom" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Custom Reports</CardTitle>
            <CardDescription>Generate custom reports based on specific criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This section allows you to create and save custom reports based on specific criteria and metrics.
            </p>
            <div className="h-[400px] border rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Custom report builder will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
