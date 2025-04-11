"use client"

import { type ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { Calendar, ChevronLeft, LayoutDashboard, MessageSquare, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarLayoutProps {
  children: ReactNode
  role: "doctor" | "patient" | "admin"
}

export function SidebarLayout({ children, role }: SidebarLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const doctorLinks = [
    {
      name: "Dashboard",
      href: "/doctor/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Appointments",
      href: "/doctor/appointments",
      icon: Calendar,
    },
    {
      name: "Patients",
      href: "/doctor/patients",
      icon: Users,
    },
    {
      name: "Messages",
      href: "/doctor/messages",
      icon: MessageSquare,
    },
    {
      name: "Settings",
      href: "/doctor/settings",
      icon: Settings,
    },
  ]

  const patientLinks = [
    {
      name: "Dashboard",
      href: "/patient/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Find Doctors",
      href: "/patient/find-doctors",
      icon: Users,
    },
    {
      name: "Appointments",
      href: "/patient/appointments",
      icon: Calendar,
    },
    {
      name: "Messages",
      href: "/patient/messages",
      icon: MessageSquare,
    },
    {
      name: "Settings",
      href: "/patient/settings",
      icon: Settings,
    },
  ]

  const adminLinks = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Appointments",
      href: "/admin/appointments",
      icon: Calendar,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  const links = role === "doctor" ? doctorLinks : role === "patient" ? patientLinks : adminLinks

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className={cn("bg-white border-r transition-all duration-300 flex flex-col", collapsed ? "w-16" : "w-64")}>
        <div className="p-4 border-b flex items-center justify-between">
          {!collapsed && (
            <Link href="/" className="font-bold text-primary text-lg">
              MediConnect
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="ml-auto">
            <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                pathname === link.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <link.icon className="h-5 w-5 mr-2" />
              {!collapsed && <span>{link.name}</span>}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t flex items-center">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "h-8 w-8",
              },
            }}
          />
          {!collapsed && (
            <div className="ml-3 text-sm">
              <p className="font-medium">My Account</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-slate-50">{children}</main>
    </div>
  )
}

