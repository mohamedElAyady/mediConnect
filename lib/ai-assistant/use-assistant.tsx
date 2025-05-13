import type { Message } from "@/hooks/use-assistant"

// This is a simulated API call to a medical AI service
// In a real implementation, you would replace this with an actual API call
export async function getMedicalResponse(query: string, previousMessages: Message[]): Promise<string> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

  // Extract just the content from previous messages for context
  const messageHistory = previousMessages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }))

  // Simple keyword-based responses for demonstration
  const lowerQuery = query.toLowerCase()

  // Check for greetings
  if (/^(hi|hello|hey|greetings)/.test(lowerQuery)) {
    return "Hello! I'm your MediConnect AI assistant. How can I help you with your health questions today?"
  }

  // Check for common symptoms
  if (lowerQuery.includes("headache")) {
    return "Headaches can be caused by various factors including stress, dehydration, lack of sleep, or underlying medical conditions. For occasional headaches, rest, hydration, and over-the-counter pain relievers may help. If you're experiencing severe, persistent, or unusual headaches, please consult with a healthcare professional."
  }

  if (lowerQuery.includes("fever")) {
    return "Fever is often a sign that your body is fighting an infection. Rest, staying hydrated, and taking fever-reducing medications like acetaminophen can help manage symptoms. If your fever is high (above 103°F/39.4°C), persists for more than three days, or is accompanied by severe symptoms, please seek medical attention."
  }

  if (lowerQuery.includes("cold") || lowerQuery.includes("flu")) {
    return "Common cold and flu symptoms include runny nose, sore throat, cough, and sometimes fever. Rest, hydration, and over-the-counter medications can help manage symptoms. Most colds resolve within 7-10 days. If symptoms are severe or persistent, consider consulting with a healthcare provider."
  }

  if (lowerQuery.includes("blood pressure")) {
    return "Maintaining healthy blood pressure is important for cardiovascular health. Normal blood pressure is typically around 120/80 mmHg. Lifestyle factors that can help include regular exercise, a balanced diet low in sodium, maintaining a healthy weight, limiting alcohol, not smoking, and managing stress. If you have concerns about your blood pressure, please consult with a healthcare provider."
  }

  if (lowerQuery.includes("diabetes")) {
    return "Diabetes is a condition that affects how your body processes blood sugar. Managing diabetes typically involves monitoring blood glucose levels, following a balanced diet, regular physical activity, and sometimes medication or insulin therapy. Regular check-ups with healthcare providers are important for managing diabetes effectively."
  }

  if (lowerQuery.includes("covid") || lowerQuery.includes("coronavirus")) {
    return "COVID-19 symptoms can include fever, cough, shortness of breath, fatigue, body aches, loss of taste or smell, sore throat, and more. If you're experiencing symptoms or have been exposed, consider getting tested. Follow local health guidelines regarding isolation and seeking medical care. Vaccination remains an important tool for preventing severe illness."
  }

  if (lowerQuery.includes("vaccine") || lowerQuery.includes("vaccination")) {
    return "Vaccines are an important tool for preventing infectious diseases. They work by training your immune system to recognize and fight specific pathogens. Common vaccines include those for influenza, COVID-19, tetanus, measles, and many others. It's important to stay up-to-date with recommended vaccinations. Consult with your healthcare provider about which vaccines are appropriate for you."
  }

  if (lowerQuery.includes("sleep") || lowerQuery.includes("insomnia")) {
    return "Good sleep is essential for health. Adults typically need 7-9 hours of sleep per night. To improve sleep, maintain a regular sleep schedule, create a restful environment, limit screen time before bed, avoid caffeine and large meals before sleeping, and manage stress. If you have persistent sleep problems, consider consulting with a healthcare provider."
  }

  if (lowerQuery.includes("diet") || lowerQuery.includes("nutrition")) {
    return "A balanced diet typically includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. It's generally recommended to limit processed foods, added sugars, and excessive sodium. Individual nutritional needs can vary based on factors like age, sex, activity level, and health conditions. Consider consulting with a healthcare provider or registered dietitian for personalized advice."
  }

  if (lowerQuery.includes("exercise") || lowerQuery.includes("workout")) {
    return "Regular physical activity is important for overall health. Adults are generally recommended to get at least 150 minutes of moderate-intensity aerobic activity or 75 minutes of vigorous activity per week, plus muscle-strengthening activities on 2 or more days per week. Start gradually and choose activities you enjoy. Consult with a healthcare provider before starting a new exercise program, especially if you have health concerns."
  }

  if (lowerQuery.includes("stress") || lowerQuery.includes("anxiety")) {
    return "Managing stress and anxiety can involve techniques such as deep breathing, meditation, physical activity, adequate sleep, limiting alcohol and caffeine, and seeking social support. If stress or anxiety is interfering with your daily life, consider speaking with a healthcare provider or mental health professional."
  }

  if (lowerQuery.includes("pregnancy")) {
    return "Pregnancy involves many changes and considerations. Prenatal care, a balanced diet, appropriate exercise, avoiding harmful substances, and managing stress are important aspects of a healthy pregnancy. Regular check-ups with healthcare providers are essential. Every pregnancy is unique, so personalized medical advice is important."
  }

  // Default response for queries we don't have specific answers for
  return "Thank you for your question. While I can provide general health information, I recommend consulting with a healthcare professional for personalized medical advice. They can provide guidance specific to your situation and medical history."
}
