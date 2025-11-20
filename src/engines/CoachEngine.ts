import { UserProfile, UserMode } from '../types';
import { GeminiService } from '../services/ai';
import { saveCoachInteraction, getCoachHistory } from '../services/firebase';

export class CoachEngine {
    static async getCoachMessage(user: UserProfile, context: string): Promise<string> {
        try {
            // 1. Fetch recent history for context
            const history = await getCoachHistory(user.uid, 5);
            const historyContext = history.map(h => `[${h.type}] ${h.message}`).join('\n');

            // 2. Construct prompt context
            const fullContext = `
                User Mode: ${user.mode}
                Current Context: ${context}
                Recent History:
                ${historyContext}
            `;

            // 3. Get message from AI
            // Determine tone based on user mode or preference (defaulting to 'Grover' for Beast mode)
            const tone = user.mode === UserMode.BEAST ? 'Grover/Aggressive' : 'Robbins/Empowering';
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
