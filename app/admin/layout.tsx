import type React from "react"
import { SidebarLayout } from "@/components/layouts/sidebar-layout"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SidebarLayout role="admin">{children}</SidebarLayout>
}

