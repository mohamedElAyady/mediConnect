"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode
  [key: string]: any
}) {
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch by only rendering theme elements after mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR and initial client render, render without theme classes
  // to prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

