"use client"

import type React from "react"
import { createContext, useState, useEffect } from "react"

export type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

type AssistantContextType = {
  isOpen: boolean
  toggleChat: () => void
  minimized: boolean
  toggleMinimized: () => void
  messages: Message[]
  addMessage: (message: Message) => void
  clearMessages: () => void
}

export const AssistantContext = createContext<AssistantContextType>({
  isOpen: false,
  toggleChat: () => {},
  minimized: false,
  toggleMinimized: () => {},
  messages: [],
  addMessage: () => {},
  clearMessages: () => {},
})

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  content: "Hello! I'm your MediConnect AI assistant. How can I help you with your health questions today?",
  role: "assistant",
  timestamp: new Date(),
}

export const AssistantProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [initialized, setInitialized] = useState(false)

  // Initialize with welcome message when first opened
  useEffect(() => {
    if (isOpen && !initialized && messages.length === 0) {
      setMessages([WELCOME_MESSAGE])
      setInitialized(true)
    }
  }, [isOpen, initialized, messages.length])

  const toggleChat = () => {
    setIsOpen((prev) => !prev)
    if (minimized) {
      setMinimized(false)
    }
  }

  const toggleMinimized = () => {
    setMinimized((prev) => !prev)
  }

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message])
  }

  const clearMessages = () => {
    setMessages([WELCOME_MESSAGE])
  }

  return (
    <AssistantContext.Provider
      value={{
        isOpen,
        toggleChat,
        minimized,
        toggleMinimized,
        messages,
        addMessage,
        clearMessages,
      }}
    >
      {children}
    </AssistantContext.Provider>
  )
}
