"use client"

import { useState, useEffect } from "react"
import { Bot, X, Minimize2, Maximize2 } from "lucide-react"
import { ChatInterface } from "./chat-interface"
import { useAssistant } from "@/hooks/use-assistant"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export const AIMedicalAssistant = () => {
  const { isOpen, toggleChat, minimized, toggleMinimized } = useAssistant()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <div
          className={cn(
            "mb-2 w-[350px] sm:w-[400px] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out",
            minimized ? "h-14" : "",
          )}
        >
          <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-cyan-500 to-blue-500">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-white" />
              <h3 className="font-medium text-white">MediConnect Assistant</h3>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white  rounded-full"
                onClick={toggleMinimized}
              >
                {minimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white  rounded-full"
                onClick={toggleChat}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!minimized && <ChatInterface />}
        </div>
      )}

      <Button
        onClick={toggleChat}
        size="icon"
        className={cn(
          "h-24 w-24 bg-transparent hover:bg-transparent hover:scale-105 hover:ease-in-out rounded-full transition-all duration-300",
          isOpen ? "opacity-100" : "opacity-100",
          "relative",
        )}
      >
        <img 
          src="/robot.png" 
          alt="logo" 
          className="h-20 w-20" 
        />
        <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
      </Button>
    </div>
  )
}
