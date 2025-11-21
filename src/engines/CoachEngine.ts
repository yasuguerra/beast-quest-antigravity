import { UserProfile, UserMode } from '../types';
import { GeminiService } from '../services/ai';
import { saveCoachInteraction, getCoachHistory } from '../services/firebase';

export class CoachEngine {
    static async getCoachMessage(user: UserProfile, context: string): Promise<string> {
        try {
            // 1. Fetch recent history for context
            const history = await getCoachHistory(user.uid, 5);
            const historyContext = history.map(h => `[${h.type}] ${h.message}`).join('\n');

            // 2. Build rich context with user state
            const fullContext = `
                User Mode: ${user.mode}
                Current Arena: ${user.currentArena}
                Streak: ${user.streakDays} days
                Trophies: ${user.trophies}
                Level: ${user.level}
                Current Context: ${context}
                Recent History:
                ${historyContext}
            `;

            // 3. Get message from AI
            // Determine tone based on user mode and arena
            let tone = 'Robbins/Empowering';
            if (user.mode === UserMode.BEAST) {
                tone = 'Grover/Aggressive';
            } else if (user.currentArena === 'LEYENDA' || user.currentArena === 'MONSTRUO') {
                tone = 'Grover/Intense';
            }

            const message = await GeminiService.getCoachMessage(fullContext, tone);

            // 4. Determine type based on context (simplified for now)
            let type: 'GREETING' | 'MOTIVATION' | 'WARNING' | 'CELEBRATION' = 'MOTIVATION';
            if (context.includes('welcome')) type = 'GREETING';
            if (context.includes('fail') || context.includes('distraction')) type = 'WARNING';
            if (context.includes('complete') || context.includes('level up')) type = 'CELEBRATION';

            // 5. Save interaction
            await saveCoachInteraction(user.uid, message, type);

            return message;
        } catch (error) {
            console.error("CoachEngine error:", error);
            return "Stay focused. Your destiny awaits."; // Fallback
        }
    }
}
