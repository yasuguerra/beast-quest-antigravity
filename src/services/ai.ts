import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { PlayerAssessmentProfile, AIBlueprint } from "../types";

// In a real deployment, this API Key should be protected via backend proxy.
// For the prototype/PRD execution, we assume it's available in the env.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY_HERE' });

export const GeminiService = {
  /**
   * Calls the Coach Engine logic.
   * Uses 'gemini-2.5-flash' for low latency.
   */
  async getCoachMessage(context: string, tone: string): Promise<string> {
    try {
      const model = "gemini-2.5-flash";
      const prompt = `
        You are the Beast Quest Coach. 
        Tone: ${tone} (e.g., Grover/Aggressive, Robbins/Empowering).
        Context: ${context}.
        Keep it short, punchy, and visceral. Maximum 2 sentences.
        ALWAYS RESPOND IN ENGLISH.
      `;

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });

      return response.text || "Focus. Execute.";
    } catch (error) {
      console.error("AI Coach Error:", error);
      return "Stay hard. Keep moving."; // Fallback
    }
  },

  /**
   * Calls the Life Engine to generate a daily deck.
   * Uses 'gemini-2.5-flash' outputting JSON.
   */
  async generateDailyDeck(userProfile: any): Promise<any> {
    try {
      const model = "gemini-2.5-flash";
      const prompt = `
            Generate a daily deck of 6 cards for a user with these stats: ${JSON.stringify(userProfile)}.
            The content MUST be in ENGLISH.
            Return ONLY valid JSON.
            Schema: { "cards": [{ "title": string, "type": "HABIT"|"TASK", "rarity": "COMMON"|"RARE"|"EPIC", "xp": number }] }
        `;

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("AI Deck Error:", error);
      // Return fallback deck logic here
      return { cards: [] };
    }
  },

  /**
   * Calls the Assessment Engine to generate deep questions.
   * Uses 'gemini-2.5-flash' outputting JSON.
   */
  async generateAssessmentQuestions(goal: string): Promise<any> {
    try {
      const model = "gemini-2.5-flash";
      const prompt = `
          Generate 5 deep, psychological, hard-hitting multiple-choice questions to assess a user whose main goal is: "${goal}".
          The questions should identify:
          1. Hidden blockers (fear, procrastination).
          2. Daily habits.
          3. True motivation source (anger, love, duty).
          
          The content MUST be in ENGLISH.
          Return ONLY valid JSON.
          Schema: 
          {
            "questions": [
              {
                "text": "Question text here...",
                "options": ["Option A", "Option B", "Option C", "Option D"]
              }
            ]
          }
        `;

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.warn("AI Assessment Error (Using Fallback):", error);
      // Fallback questions if AI fails (robustness)
      return {
        questions: [
          {
            text: "When you've failed at this goal before, what was the real reason?",
            options: ["I lost motivation", "I got distracted", "I didn't have a plan", "I was afraid of success"]
          },
          {
            text: "How much pain are you willing to endure to achieve this?",
            options: ["None, I want it easy", "Some discomfort", "Whatever it takes", "I thrive in pain"]
          },
          {
            text: "What is your biggest daily distraction?",
            options: ["Social Media", "Video Games", "Procrastination", "Other people"]
          },
          {
            text: "Who are you doing this for?",
            options: ["Myself", "To prove them wrong", "My family", "To dominate"]
          },
          {
            text: "If you don't achieve this in 90 days, how will you feel?",
            options: ["Indifferent", "Disappointed", "Angry", "Destroyed"]
          }
        ]
      };
    }
  },

  async generatePlayerProfile(onboardingData: any): Promise<Partial<PlayerAssessmentProfile>> {
    try {
      const model = "gemini-2.5-flash";
      const prompt = `
            Analyze this user data to create a psychological profile.
            User Data: ${JSON.stringify(onboardingData)}
            
            Determine:
            - Mental Strength (LOW, MEDIUM, HIGH, UNBREAKABLE) based on quiz answers.
            - Emotional Style (e.g. "Stoic Warrior", "Emotional Beast", "Logical Strategist").
            - Top Distraction (Infer from quiz).
            - Recommended Coach Style (GROVER, ROBBINS, CARISMA).

            Return ONLY valid JSON.
            Schema:
            {
                "mentalStrength": "HIGH",
                "emotionalStyle": "Stoic Warrior",
                "topDistraction": "Social Media",
                "coachPreference": "GROVER"
            }
        `;

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("AI Profile Error", e);
      return {
        mentalStrength: 'MEDIUM',
        emotionalStyle: 'Determined',
        topDistraction: 'Procrastination',
        coachPreference: 'GROVER'
      };
    }
  },

  async generateBlueprint(goal: string, profile: any): Promise<AIBlueprint> {
    try {
      const model = "gemini-2.5-flash";
      const prompt = `
            Create a 90-Day Action Blueprint for a user wanting to: "${goal}".
            Profile: ${JSON.stringify(profile)}.
            
            Divide into 3 phases (Days 1-30, 31-60, 61-90).
            Define a powerful mission statement.
            Define ONE key daily ritual.

            Return ONLY valid JSON.
            Schema:
            {
                "missionStatement": "I will...",
                "dailyRitual": "5 min Morning Power Breath",
                "phases": [
                    { "phaseName": "Phase 1: Foundation", "duration": "Days 1-30", "focus": "Discipline", "keyHabit": "No phone before 9am" },
                    { "phaseName": "Phase 2: Acceleration", "duration": "Days 31-60", "focus": "Strength", "keyHabit": "Double workouts" },
                    { "phaseName": "Phase 3: Domination", "duration": "Days 61-90", "focus": "Mastery", "keyHabit": "Teach others" }
                ]
            }
         `;
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("AI Blueprint Error", e);
      return {
        missionStatement: "I will dominate my path.",
        dailyRitual: "Power Journaling",
        phases: [
          { phaseName: "Foundation", duration: "Days 1-30", focus: "Consistency", keyHabit: "Show up daily" },
          { phaseName: "Build", duration: "Days 31-60", focus: "Intensity", keyHabit: "Push limits" },
          { phaseName: "Peak", duration: "Days 61-90", focus: "Result", keyHabit: "Complete transformation" }
        ]
      }
    }
  }
};