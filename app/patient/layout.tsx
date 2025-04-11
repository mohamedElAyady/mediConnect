import type React from "react"
import { SidebarLayout } from "@/components/layouts/sidebar-layout"

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SidebarLayout role="patient">{children}</SidebarLayout>
}

