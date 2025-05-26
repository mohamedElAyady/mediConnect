import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function RecentActivities() {
  const activities = [
    {
      id: 1,
      user: {
        name: "Dr. Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SJ",
      },
      action: "verified their account",
      time: "2 minutes ago",
      type: "doctor",
    },
    {
      id: 2,
      user: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "MC",
      },
      action: "booked an appointment with Dr. Williams",
      time: "15 minutes ago",
      type: "patient",
    },
    {
      id: 3,
      user: {
        name: "Dr. Robert Garcia",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "RG",
      },
      action: "cancelled 3 appointments",
      time: "1 hour ago",
      type: "doctor",
    },
    {
      id: 4,
      user: {
        name: "Emma Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "EW",
      },
      action: "updated their medical information",
      time: "2 hours ago",
      type: "patient",
    },
    {
      id: 5,
      user: {
        name: "Admin",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "A",
      },
      action: "updated system settings",
      time: "3 hours ago",
      type: "admin",
    },
    {
      id: 6,
      user: {
        name: "Dr. Lisa Martinez",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "LM",
      },
      action: "requested verification",
      time: "5 hours ago",
      type: "doctor",
    },
  ]

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{activity.user.name}</span>
                  <Badge
                    variant={
                      activity.type === "doctor" ? "default" : activity.type === "patient" ? "secondary" : "outline"
                    }
                    className="text-xs"
                  >
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
