import { UserProfile } from '../types';
import { updateUserProfile } from '../services/firebase';

export class LifeEngine {
    /**
     * Calculates the current streak based on last active date.
     * Should be called on app launch.
     */
    static calculateStreak(user: UserProfile): number {
        if (!user.lastActive) return 0;

        const lastActiveDate = new Date(user.lastActive);
        const today = new Date();

        // Normalize to midnight for comparison
        lastActiveDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffTime = Math.abs(today.getTime() - lastActiveDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return user.streakDays; // Already active today
        } else if (diffDays === 1) {
            return user.streakDays; // Streak continues (will be incremented if not already done today? Logic depends on when we increment)
            // Actually, usually streak increments when you COMPLETE the daily loop.
            // Here we just return the current valid streak.
        } else {
            return 0; // Streak broken
        }
    }

    /**
     * Checks if a midnight reset is needed and performs necessary updates.
     * Returns true if a reset occurred.
     */
    static async checkMidnightReset(user: UserProfile): Promise<boolean> {
        const lastActiveDate = user.lastActive ? new Date(user.lastActive).toISOString().split('T')[0] : null;
        const today = new Date().toISOString().split('T')[0];

        if (lastActiveDate !== today) {
            console.log("LifeEngine: Midnight Reset Triggered");

            // Check if streak was broken
            const currentStreak = this.calculateStreak(user);
            const newStreak = currentStreak === 0 ? 0 : user.streakDays; // If broken, 0. If not, keep it (increment happens on completion)

            await updateUserProfile(user.uid, {
                lastActive: new Date().toISOString(),
                streakDays: newStreak
            });

            return true;
        }
        return false;
    }

    // ============================================
    // ARENA PROGRESSION (Phase 2)
    // ============================================

    /**
     * Calculate trophy reward based on card completion
     * Applies streak multipliers
     */
    static calculateTrophyReward(
        baseReward: number,
        streakDays: number,
        isPerfectCompletion: boolean = false
    ): number {
        let multiplier = 1.0;

        // Streak multiplier
        if (streakDays >= 30) multiplier = 1.50;
        else if (streakDays >= 10) multiplier = 1.30;
        else if (streakDays >= 5) multiplier = 1.20;
        else if (streakDays >= 2) multiplier = 1.10;

        // Perfect completion bonus
        if (isPerfectCompletion) multiplier += 0.10;

        return Math.floor(baseReward * multiplier);
    }

    /**
     * Calculate XP reward based on multiple factors
     */
    static calculateXPReward(
        baseXP: number,
        streakDays: number,
        peakStateUsed: boolean = false,
        speedBonus: boolean = false
    ): number {
        let multiplier = 1.0;

        // Streak multiplier
        if (streakDays >= 30) multiplier += 0.50;
        else if (streakDays >= 10) multiplier += 0.30;
        else if (streakDays >= 5) multiplier += 0.20;
        else if (streakDays >= 2) multiplier += 0.10;

        // Peak State bonus
        if (peakStateUsed) multiplier += 0.10;

        // Speed bonus (completed quickly)
        if (speedBonus) multiplier += 0.15;

        return Math.floor(baseXP * multiplier);
    }

    /**
     * Determine if user should advance to next arena
     * Returns new ArenaId or null if no change
     */
    static checkArenaPromotion(currentTrophies: number, currentArena: string): string | null {
        // Arena thresholds (matching arenas.ts config)
        const ARENA_THRESHOLDS = {
            'DESPERTAR': { max: 99, next: 'DISCIPLINA' },
            'DISCIPLINA': { max: 299, next: 'FOCO_ENERGIA' },
            'FOCO_ENERGIA': { max: 599, next: 'PODER_PERSONAL' },
            'PODER_PERSONAL': { max: 999, next: 'EJECUCION' },
            'EJECUCION': { max: 1499, next: 'PRESENCIA' },
            'PRESENCIA': { max: 2199, next: 'MONSTRUO' },
            'MONSTRUO': { max: 2999, next: 'LEYENDA' },
            'LEYENDA': { max: 999999, next: null }
        };

        const threshold = ARENA_THRESHOLDS[currentArena as keyof typeof ARENA_THRESHOLDS];

        if (threshold && currentTrophies > threshold.max && threshold.next) {
            return threshold.next;
        }

        return null;
    }

    /**
     * Check mini-league promotion within current arena
     * Returns new MiniLeague or null if no change
     */
    static checkMiniLeaguePromotion(
        currentTrophies: number,
        currentArena: string,
        currentLeague: string
    ): string | null {
        // Calculate arena range
        const ARENA_RANGES: Record<string, { min: number, max: number }> = {
            'DESPERTAR': { min: 0, max: 99 },
            'DISCIPLINA': { min: 100, max: 299 },
            'FOCO_ENERGIA': { min: 300, max: 599 },
            'PODER_PERSONAL': { min: 600, max: 999 },
            'EJECUCION': { min: 1000, max: 1499 },
            'PRESENCIA': { min: 1500, max: 2199 },
            'MONSTRUO': { min: 2200, max: 2999 },
            'LEYENDA': { min: 3000, max: 999999 }
        };

        const range = ARENA_RANGES[currentArena];
        if (!range) return null;

        const arenaProgress = (currentTrophies - range.min) / (range.max - range.min);

        // Mini-league thresholds
        if (arenaProgress >= 0.66 && currentLeague !== 'GOLD') {
            return 'GOLD';
        } else if (arenaProgress >= 0.33 && currentLeague === 'BRONZE') {
            return 'SILVER';
        }

        return null;
    }

    /**
     * Apply trophy penalty for failed cards in Beast mode
     */
    static calculateTrophyPenalty(
        currentTrophies: number,
        failedCardCount: number,
        isBeastMode: boolean
    ): number {
        if (!isBeastMode) return 0;

        // Beast mode: -10 trophies per failed card
        const penalty = failedCardCount * 10;

        // Can't go below 0
        return Math.max(0, currentTrophies - penalty);
    }
}

