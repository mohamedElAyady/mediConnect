"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAssistant } from "@/hooks/use-assistant"
import { getMedicalResponse } from "@/lib/ai-assistant/medical-api-lib"
import { Avatar } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { Bot, User } from "lucide-react"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

const formatMessage = (content: string) => {
  // Replace **text** with bold text
  const formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  return (
    <div 
      className="text-sm"
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
};

export const ChatInterface = () => {
  const { messages, addMessage } = useAssistant()
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    addMessage(userMessage)
    setInput("")
    setIsLoading(true)

    try {
      // Get AI response
      const response = await getMedicalResponse(input, messages)

      // Add AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      }

      addMessage(aiMessage)
    } catch (error) {
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      }

      addMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[500px]">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-3 p-4">
            <Bot className="h-12 w-12 text-blue-500" />
            <h3 className="font-medium text-lg">MediConnect AI Assistant</h3>
            <p className="text-sm">
              Ask me any medical questions or for information about symptoms, treatments, or general health advice.
            </p>
            <div className="grid grid-cols-2 gap-2 w-full mt-2">
              {[
                "What are symptoms of the flu?",
                "How can I lower my blood pressure?",
                "What causes migraines?",
                "Is this medication safe?",
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  className="text-xs h-auto py-1.5 justify-start text-left"
                  onClick={() => {
                    setInput(suggestion)
                    inputRef.current?.focus()
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`flex-shrink-0 ${message.role === "user" ? "ml-2" : "mr-2"}`}>
                    {message.role === "assistant" ? (
                      <Avatar className="h-8 w-8 bg-blue-100">
                        <img src="/robot.png" alt="logo" className="h-8 w-8" />
                      </Avatar>
                    ) : (
                      <Avatar className="h-8 w-8 bg-gray-100">
                        <img src="/user.png" alt="logo" className="h-8 w-8" />
                      </Avatar>
                    )}
                  </div>
                  <div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {message.role === "assistant" 
                        ? formatMessage(message.content)
                        : message.content
                      }
                    </div>
                    <div
                      className={`text-xs text-gray-500 mt-1 ${message.role === "user" ? "text-right" : "text-left"}`}
                    >
                      {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[80%] flex-row">
                  <div className="mr-2 flex-shrink-0">
                    <Avatar className="h-8 w-8 bg-blue-100">
                      <Bot className="h-4 w-4 text-blue-500" />
                    </Avatar>
                  </div>
                  <div>
                    <div className="rounded-lg bg-gray-100 p-3 text-sm text-gray-800">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <div className="p-3 border-t">
        <div className="flex space-x-2 mb-4">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a medical question..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading} size="icon">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          <p>
            This AI assistant provides general information only and is not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </div>
  )
}

