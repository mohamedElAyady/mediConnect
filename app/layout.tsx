import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import { ConvexClientProvider } from "@/components/convex-client-provider"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Toaster } from "@/components/ui/toaster"
import { AssistantProvider } from "@/components/ai-assistant/assistant-provider"
import { AIMedicalAssistant } from "@/components/ai-assistant/ai-medical-assistant"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MediConnect - Medical Appointment Management",
  description: "Modern platform for managing medical appointments",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} bg-background text-foreground`} suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            forcedTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <ConvexClientProvider>
              <AssistantProvider>
                <AuthLayout>{children}</AuthLayout>
                <AIMedicalAssistant />
                <Toaster />
              </AssistantProvider>
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
