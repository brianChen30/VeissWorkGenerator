// src/utils/aiGenerator.js
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateSmartWorkoutAI(musclesArray, timeLimit) {
  if (!musclesArray || musclesArray.length === 0) return null;
  const primaryLabel = musclesArray.join(", ");

  const prompt = `
    You are an elite sports scientist programming for an athlete. 
    Design a strictly ${timeLimit} minute workout targeting: ${primaryLabel}.
    
    Rules:
    1. Only output raw JSON matching the exact schema below. No markdown, no conversational text.
    2. "estTime" is the estimated minutes that exercise takes. The sum of all "estTime" MUST equal exactly ${timeLimit}.
    3. Ensure exercises are realistic for the requested muscle groups.
    
    JSON Schema:
    {
      "primary": "${primaryLabel}",
      "secondary": "List 3-5 secondary muscles engaged",
      "totalTime": ${timeLimit},
      "exercises": [
        { "name": "Exercise Name", "sets": "3", "reps": "10", "velocity": "1.0", "estTime": 10 }
      ]
    }
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant", // 👈 This is the only line that changed!
      response_format: { type: "json_object" },
    });

    return JSON.parse(chatCompletion.choices[0].message.content);
  } catch (error) {
    console.error("AI Error:", error);
    throw new Error("Failed to generate workout.");
  }
}
