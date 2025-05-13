"use client"

import { useContext } from "react"
import { AssistantContext } from "@/components/ai-assistant/assistant-provider"

export type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export const useAssistant = () => {
  const context = useContext(AssistantContext)

  if (!context) {
    throw new Error("useAssistant must be used within an AssistantProvider")
  }

  return context
}
