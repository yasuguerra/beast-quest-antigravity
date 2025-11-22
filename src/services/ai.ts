import { GoogleGenerativeAI } from "@google/generative-ai";
import { UserProfile, Deck, Card, CardType, CardRarity, PlayerAssessmentProfile, AIBlueprint } from '../types';

// In a real deployment, this API Key should be protected via backend proxy.
// For the prototype/PRD execution, we assume it's available in the env.
const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY_HERE');

export const GeminiService = {
  /**
   * Calls the Coach Engine logic.
   * Uses 'gemini-2.5-flash' for low latency.
   */
  async getCoachMessage(context: string, tone: string): Promise<string> {
    try {
      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `
        You are the Beast Quest Coach. 
        Tone: ${tone} (e.g., Grover/Aggressive, Robbins/Empowering).
        Context: ${context}.
        Keep it short, punchy, and visceral. Maximum 2 sentences.
        ALWAYS RESPOND IN ENGLISH.
      `;

      const response = await model.generateContent(prompt);
      return response.response.text() || "Focus. Execute.";
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
      const model = ai.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const prompt = `
            Generate a daily deck of 6 cards for a user with these stats: ${JSON.stringify(userProfile)}.
            The content MUST be in ENGLISH.
            Return ONLY valid JSON.
            Schema: { "cards": [{ "title": string, "description": string, "type": "HABIT"|"TASK", "rarity": "COMMON"|"RARE"|"EPIC", "xp": number, "durationMinutes": number }] }
        `;

      const response = await model.generateContent(prompt);
      const data = JSON.parse(response.response.text() || "{}");

      // Validate data
      if (!data.cards || !Array.isArray(data.cards) || data.cards.length === 0) {
        throw new Error("AI returned empty or invalid deck");
      }

      return data;
    } catch (error) {
      console.error("AI Deck Error (Using Fallback):", error);
      // Robust Fallback
      return {
        cards: [
          { title: "Morning Power Walk", description: "Get sunlight and movement.", type: "HABIT", rarity: "COMMON", xp: 20, durationMinutes: 15 },
          { title: "Deep Work Block", description: "45 minutes of undistracted focus.", type: "TASK", rarity: "RARE", xp: 50, durationMinutes: 45 },
          { title: "Hydration Check", description: "Drink 1L of water.", type: "HABIT", rarity: "COMMON", xp: 10, durationMinutes: 5 },
          { title: "Read 10 Pages", description: "Feed your mind.", type: "HABIT", rarity: "COMMON", xp: 20, durationMinutes: 20 },
          { title: "Plan Tomorrow", description: "Write down top 3 priorities.", type: "TASK", rarity: "COMMON", xp: 20, durationMinutes: 10 },
          { title: "Cold Shower", description: "Embrace the shock.", type: "TASK", rarity: "EPIC", xp: 100, durationMinutes: 5 }
        ]
      };
    }
  },

  /**
   * Calls the Assessment Engine to generate deep questions.
   * Uses 'gemini-2.5-flash' outputting JSON.
   */
  async generateAssessmentQuestions(goal: string): Promise<any> {
    try {
      const model = ai.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
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

      const response = await model.generateContent(prompt);
      return JSON.parse(response.response.text() || "{}");
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
      const model = ai.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
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

      const response = await model.generateContent(prompt);
      return JSON.parse(response.response.text() || "{}");
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
      const model = ai.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
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
      const response = await model.generateContent(prompt);
      return JSON.parse(response.response.text() || "{}");
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
  },

  async recommendMode(profile: any): Promise<{ recommendedMode: 'WARRIOR' | 'BEAST', reason: string }> {
    try {
      const model = ai.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const prompt = `
            Analyze this user profile and recommend a game mode: WARRIOR (Sustainable) or BEAST (Extreme).
            Profile: ${JSON.stringify(profile)}
            
            If Mental Strength is HIGH/UNBREAKABLE and Coach Preference is GROVER/BEAST -> Recommend BEAST.
            Otherwise -> Recommend WARRIOR.

            Return ONLY valid JSON.
            Schema:
            {
                "recommendedMode": "WARRIOR" | "BEAST",
                "reason": "Based on your high mental strength, you are ready for the extreme challenge."
            }
        `;

      const response = await model.generateContent(prompt);
      return JSON.parse(response.response.text() || '{"recommendedMode": "WARRIOR", "reason": "Start strong, build consistency."}');
    } catch (e) {
      console.error("AI Mode Recommendation Error", e);
      return { recommendedMode: 'WARRIOR', reason: "Start here to build your foundation." };
    }
  },

  async generateCardAlternatives(card: Card, userProfile: UserProfile): Promise<Card[]> {
    try {
      const model = ai.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const prompt = `
            Generate 3 alternative tasks for this specific card: "${card.title}" (${card.description}).
            User Profile: ${JSON.stringify(userProfile)}
            
            The alternatives should be:
            1. Easier/Shorter (Low Energy)
            2. Different Approach (Creative)
            3. Physical/Active (Body Activation)
            
            Format as JSON array of objects with: title, description, type, energyCost (1-3), durationMinutes.
            `;

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const alternatives = JSON.parse(cleanText);

      return alternatives.map((alt: any, index: number) => ({
        id: `alt-${Date.now()}-${index}`,
        title: alt.title,
        description: alt.description,
        type: (alt.type as CardType) || CardType.TASK,
        rarity: CardRarity.COMMON,
        energyCost: alt.energyCost || 1,
        xpReward: 15,
        trophyReward: 3,
        durationMinutes: alt.durationMinutes || 15,
        isCompleted: false
      }));
    } catch (error) {
      console.error("Error generating alternatives:", error);
      // Fallback alternatives
      return [
        {
          id: `fallback-1`,
          title: "Walk 10 min",
          description: "Take a quick walk to reset.",
          type: CardType.TASK,
          rarity: CardRarity.COMMON,
          energyCost: 1,
          xpReward: 10,
          trophyReward: 2,
          durationMinutes: 10,
          isCompleted: false
        },
        {
          id: `fallback-2`,
          title: "Box Breathing",
          description: "4-4-4-4 breathing for focus.",
          type: CardType.RITUAL,
          rarity: CardRarity.COMMON,
          energyCost: 1,
          xpReward: 10,
          trophyReward: 2,
          durationMinutes: 5,
          isCompleted: false
        },
        {
          id: `fallback-3`,
          title: "Quick Hydration",
          description: "Drink a glass of water and stretch.",
          type: CardType.HABIT,
          rarity: CardRarity.COMMON,
          energyCost: 1,
          xpReward: 10,
          trophyReward: 2,
          durationMinutes: 2,
          isCompleted: false
        }
      ];
    }
  },

  async generateFirstBattleDeck(userProfile: any): Promise<any> {
    try {
      const model = ai.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const prompt = `
            Generate a "First Battle" mini-deck of exactly 3 cards for a new user.
            User Profile: ${JSON.stringify(userProfile)}
            
            Cards should be simple, immediate wins to build momentum.
            1. A simple physical task (e.g. Drink water, 10 pushups).
            2. A simple mental task (e.g. Write down one goal).
            3. A simple organization task (e.g. Clear desk).

            The content MUST be in ENGLISH.
            Return ONLY valid JSON.
            Schema: { "cards": [{ "title": string, "description": string, "type": "HABIT"|"TASK", "rarity": "COMMON", "xp": 20, "durationMinutes": 5 }] }
        `;

      const response = await model.generateContent(prompt);
      return JSON.parse(response.response.text() || "{}");
    } catch (error) {
      console.error("AI First Battle Deck Error:", error);
      return {
        cards: [
          { title: "Drink a glass of water", description: "Hydrate to dominate.", type: "HABIT", rarity: "COMMON", xp: 20, durationMinutes: 2 },
          { title: "Do 10 Pushups", description: "Activate your body.", type: "TASK", rarity: "COMMON", xp: 20, durationMinutes: 5 },
          { title: "Clear your workspace", description: "Order brings clarity.", type: "TASK", rarity: "COMMON", xp: 20, durationMinutes: 5 }
        ]
      };
    }
  }
};