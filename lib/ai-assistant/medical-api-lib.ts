import type { Message } from "@/hooks/use-assistant"

const OPENROUTER_API_KEY = "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"
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

// This is a simulated API call to a medical AI service
// In a real implementation, you would replace this with an actual API call
export async function getMedicalResponse(query: string, previousMessages: Message[]): Promise<string> {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://mediconnect.com", // Replace with your actual domain
        "X-Title": "MediConnect Medical Assistant"
      },
      body: JSON.stringify({
        model: "openai/gpt-4.1",
        messages: [
          {
            role: "system",
            content: "You are a medical assistant AI that provides helpful, accurate, and safe medical information. Always include appropriate disclaimers and encourage users to consult healthcare professionals for personalized advice. Be clear, concise, and empathetic in your responses."
          },
          ...previousMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          {
            role: "user",
            content: query
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error("Error calling OpenRouter API:", error)
    return "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment or consult with a healthcare professional for immediate assistance."
  }
}
