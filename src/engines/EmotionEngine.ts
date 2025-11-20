import { EmotionalState, EmotionCheckIn, UserProfile } from '../types';
import { GeminiService } from '../services/ai';

/**
 * Emotion Engine - Phase 3 IA
 * Tracks emotional state and adapts deck difficulty
 */
export class EmotionEngine {
    /**
     * Analyze user's emotional state from check-in data
     */
    static async analyzeEmotionalState(
        energy: number,
        willpower: number,
        focus: number,
        recentBehavior: {
            cardsCompleted: number;
            cardsFailed: number;
            lastLoginHours: number;
            streakDays: number;
        }
    ): Promise<EmotionalState> {
        // Simple rule-based classification (can be enhanced with AI later)
        const avgScore = (energy + willpower + focus) / 3;

        // EUPHORIC: High energy + high willpower + good performance
        if (avgScore >= 80 && recentBehavior.cardsCompleted >= 5 && recentBehavior.cardsFailed === 0) {
            return EmotionalState.EUPHORIC;
        }

        // MOTIVATED: Good scores + consistent behavior
        if (avgScore >= 60 && recentBehavior.streakDays >= 3) {
            return EmotionalState.MOTIVATED;
        }

        // ANXIOUS: Moderate scores but recent failures
        if (avgScore >= 50 && recentBehavior.cardsFailed >= 3) {
            return EmotionalState.ANXIOUS;
        }

        // TIRED: Low energy specifically
        if (energy < 40) {
            return EmotionalState.TIRED;
        }

        // DISPERSED: Low focus
        if (focus < 40) {
            return EmotionalState.DISPERSED;
        }

        // SAD: Low overall scores
        if (avgScore < 40) {
            return EmotionalState.SAD;
        }

        // Default: STABLE
        return EmotionalState.STABLE;
    }

    /**
     * Get recommended deck difficulty adjustment based on emotion
     */
    static getDifficultyMultiplier(emotionalState: EmotionalState): number {
        switch (emotionalState) {
            case EmotionalState.EUPHORIC:
                return 1.30; // Increase difficulty by 30%
            case EmotionalState.MOTIVATED:
                return 1.10; // Slight increase
            case EmotionalState.STABLE:
                return 1.0; // No change
            case EmotionalState.TIRED:
                return 0.70; // Reduce difficulty by 30%
            case EmotionalState.ANXIOUS:
                return 0.80; // Reduce by 20%
            case EmotionalState.DISPERSED:
                return 0.75; // Reduce by 25%
            case EmotionalState.SAD:
                return 0.60; // Significantly reduce
        }
    }

    /**
     * Get recommended card count based on emotion and arena
     */
    static getRecommendedCardCount(
        emotionalState: EmotionalState,
        baseCardCount: number
    ): number {
        const multiplier = this.getDifficultyMultiplier(emotionalState);

        // Adjust card count (min 3, max 10)
        const adjustedCount = Math.round(baseCardCount * multiplier);
        return Math.max(3, Math.min(10, adjustedCount));
    }

    /**
     * Get AI-generated coaching message based on emotional state
     */
    static async getEmotionBasedCoachMessage(
        emotionalState: EmotionalState,
        userName: string,
        context?: string
    ): Promise<string> {
        const prompts: Record<EmotionalState, string> = {
            [EmotionalState.EUPHORIC]: `The user ${userName} is feeling EUPHORIC - extremely high energy and motivation. They're crushing their goals. Write a brief celebratory message (2-3 sentences) that challenges them to go even further. Tone: excited but focused.`,

            [EmotionalState.MOTIVATED]: `The user ${userName} is MOTIVATED and on track. They're doing well. Write a brief encouraging message (2-3 sentences) that reinforces their momentum. Tone: supportive and strategic.`,

            [EmotionalState.STABLE]: `The user ${userName} is in a STABLE emotional state - consistent and balanced. Write a brief message (2-3 sentences) that keeps them focused. Tone: steady and professional.`,

            [EmotionalState.TIRED]: `The user ${userName} is feeling TIRED - low energy but still here. Write a brief compassionate message (2-3 sentences) that suggests easier tasks or rest. Tone: understanding but firm.`,

            [EmotionalState.ANXIOUS]: `The user ${userName} is feeling ANXIOUS - worried about performance. Write a brief calming message (2-3 sentences) that reduces pressure. Tone: reassuring and grounding.`,

            [EmotionalState.DISPERSED]: `The user ${userName} is DISPERSED - struggling with focus. Write a brief message (2-3 sentences) that helps them lock in on one thing. Tone: direct and focusing.`,

            [EmotionalState.SAD]: `The user ${userName} is feeling SAD or down. Write a brief empathetic message (2-3 sentences) that shows you understand and suggests one tiny win. Tone: warm and gentle but not pitying.`
        };

        try {
            let prompt = prompts[emotionalState];
            if (context) {
                prompt = prompt + ` Context: ${context}`;
            }

            const tone = emotionalState === EmotionalState.EUPHORIC || emotionalState === EmotionalState.MOTIVATED
                ? 'Robbins/Empowering'
                : 'Supportive/Understanding';

            const message = await GeminiService.getCoachMessage(prompt, tone);
            return message;
        } catch (error) {
            console.error('Error generating emotion-based message:', error);
            return this.getFallbackMessage(emotionalState);
        }
    }

    /**
     * Fallback messages if AI fails
     */
    private static getFallbackMessage(emotionalState: EmotionalState): string {
        const fallbacks: Record<EmotionalState, string> = {
            [EmotionalState.EUPHORIC]: "You're on fire! Channel this energy into your biggest challenge today.",
            [EmotionalState.MOTIVATED]: "Strong momentum. Keep executing with discipline.",
            [EmotionalState.STABLE]: "Consistency wins. Execute your deck as planned.",
            [EmotionalState.TIRED]: "Energy is low. Take it easier today. Recovery is part of the game.",
            [EmotionalState.ANXIOUS]: "Breathe. You don't need perfection. You need progress. One card at a time.",
            [EmotionalState.DISPERSED]: "Focus is scattered. Pick ONE thing. Complete it. Then the next.",
            [EmotionalState.SAD]: "I see you're struggling. That's okay. Just show up. One small win matters."
        };

        return fallbacks[emotionalState];
    }

    /**
     * Determine if user should be prompted for emotion check-in
     */
    static shouldPromptCheckIn(lastCheckIn?: string): boolean {
        if (!lastCheckIn) return true; // Never checked in

        const lastCheckInDate = new Date(lastCheckIn);
        const now = new Date();
        const hoursSinceCheckIn = (now.getTime() - lastCheckInDate.getTime()) / (1000 * 60 * 60);

        // Prompt every 24 hours
        return hoursSinceCheckIn >= 24;
    }

    /**
     * Calculate risk score based on emotional patterns
     * (Integrates with Risk Engine concept from PRD)
     */
    static calculateEmotionalRisk(
        recentEmotions: EmotionalState[],
        streakDays: number,
        completionRate: number
    ): number {
        let riskScore = 0;

        // Check for negative emotional patterns
        const negativeStates = [EmotionalState.SAD, EmotionalState.ANXIOUS, EmotionalState.DISPERSED, EmotionalState.TIRED];
        const negativeCount = recentEmotions.filter(e => negativeStates.includes(e)).length;

        if (negativeCount >= 3) riskScore += 40; // 3+ negative states = high risk
        else if (negativeCount >= 2) riskScore += 25;

        // Low streak indicates struggle
        if (streakDays === 0) riskScore += 30;
        else if (streakDays < 3) riskScore += 15;

        // Low completion rate
        if (completionRate < 50) riskScore += 30;
        else if (completionRate < 70) riskScore += 15;

        return Math.min(100, riskScore);
    }

    /**
     * Get recommended intervention based on risk score
     */
    static getInterventionRecommendation(riskScore: number): {
        type: 'NONE' | 'COACH_MESSAGE' | 'EASIER_DECK' | 'EMERGENCY_RESCUE';
        message: string;
    } {
        if (riskScore >= 70) {
            return {
                type: 'EMERGENCY_RESCUE',
                message: 'High abandonment risk detected. Trigger Emergency Rescue flow.'
            };
        } else if (riskScore >= 50) {
            return {
                type: 'EASIER_DECK',
                message: 'Moderate risk. Generate easier deck and send coach intervention.'
            };
        } else if (riskScore >= 30) {
            return {
                type: 'COACH_MESSAGE',
                message: 'Slight risk. Send motivational coach message.'
            };
        }

        return {
            type: 'NONE',
            message: 'User is stable. No intervention needed.'
        };
    }
}
