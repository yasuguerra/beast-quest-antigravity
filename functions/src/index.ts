import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { VertexAI } from "@google-cloud/vertexai";

admin.initializeApp();

// Initialize Vertex AI
const vertex_ai = new VertexAI({ project: 'quest-beast-vs', location: 'us-central1' });
const model = vertex_ai.getGenerativeModel({
  model: 'gemini-1.5-flash-001'
});

// --- Helper to generate content ---
async function generateJSON(prompt: string): Promise<any> {
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.candidates?.[0].content.parts[0].text || "{}";
    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new functions.https.HttpsError('internal', 'AI generation failed');
  }
}

async function generateText(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.candidates?.[0].content.parts[0].text || "";
  } catch (error) {
    console.error("AI Text Generation Error:", error);
    throw new functions.https.HttpsError('internal', 'AI generation failed');
  }
}

// --- Cloud Functions ---

export const getCoachMessage = functions.https.onCall(async (data, context) => {
  const { context: userContext, tone } = data;
  const prompt = `
    You are the Beast Quest Coach. 
    Tone: ${tone} (e.g., Grover/Aggressive, Robbins/Empowering).
    Context: ${userContext}.
    Keep it short, punchy, and visceral. Maximum 2 sentences.
    ALWAYS RESPOND IN ENGLISH.
  `;
  return { message: await generateText(prompt) };
});

export const generateDailyDeck = functions.https.onCall(async (data, context) => {
  const { userProfile } = data;
  const prompt = `
    Generate a daily deck of 6 cards for a user with these stats: ${JSON.stringify(userProfile)}.
    The content MUST be in ENGLISH.
    Return ONLY valid JSON.
    Schema: { "cards": [{ "title": string, "type": "HABIT"|"TASK", "rarity": "COMMON"|"RARE"|"EPIC", "xp": number }] }
  `;
  return await generateJSON(prompt);
});

export const generateAssessmentQuestions = functions.https.onCall(async (data, context) => {
  const { goal } = data;
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
  return await generateJSON(prompt);
});

export const generatePlayerProfile = functions.https.onCall(async (data, context) => {
  const { onboardingData } = data;
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
  return await generateJSON(prompt);
});

export const generateBlueprint = functions.https.onCall(async (data, context) => {
  const { goal, profile } = data;
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
  return await generateJSON(prompt);
});
