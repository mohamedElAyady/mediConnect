"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, UserCheck, UserCog, UserX } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data - would come from Convex in a real app
const users = [
  {
    id: "1",
    name: "Dr. James Wilson",
    email: "james.wilson@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "doctor",
    status: "active",
    joinedAt: "2025-03-15",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "patient",
    status: "active",
    joinedAt: "2025-03-28",
  },
  {
    id: "3",
    name: "Dr. Maria Garcia",
    email: "maria.garcia@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "doctor",
    status: "pending",
    joinedAt: "2025-04-01",
  },
  {
    id: "4",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "patient",
    status: "active",
    joinedAt: "2025-03-25",
  },
]

export function RecentUsers() {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{user.name}</h4>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center text-xs mt-1">
                <span
                  className={`flex items-center ${
                    user.role === "doctor"
                      ? "text-blue-600"
                      : user.role === "admin"
                        ? "text-purple-600"
                        : "text-green-600"
                  }`}
                >
                  {user.role === "doctor" ? (
                    <UserCog className="mr-1 h-3 w-3" />
                  ) : user.role === "admin" ? (
                    <UserCheck className="mr-1 h-3 w-3" />
                  ) : (
                    <UserX className="mr-1 h-3 w-3" />
                  )}
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <span
                  className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                    user.status === "active"
                      ? "bg-green-100 text-green-800"
                      : user.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Profile</DropdownMenuItem>
                <DropdownMenuItem>Edit User</DropdownMenuItem>
                {user.status === "pending" && <DropdownMenuItem>Approve</DropdownMenuItem>}
                <DropdownMenuItem className="text-destructive">Suspend User</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}
