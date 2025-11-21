import { useGameStore } from '../store/gameStore';

export class AntiFugaEngine {
    private static distractionTimeout: NodeJS.Timeout | null = null;
    private static readonly DISTRACTION_THRESHOLD_MS = 1000 * 60 * 5; // 5 minutes of inactivity

    static startMonitoring() {
        this.resetTimer();

        // Listen for user activity (mouse, keypress, touch)
        window.addEventListener('mousemove', () => this.resetTimer());
        window.addEventListener('keypress', () => this.resetTimer());
        window.addEventListener('touchstart', () => this.resetTimer());

        // Listen for visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log("App hidden - potential distraction!");
                // In a real app, we might trigger a notification here
            } else {
                console.log("App visible - welcome back");
                this.resetTimer();
            }
        });
    }

    static stopMonitoring() {
        if (this.distractionTimeout) {
            clearTimeout(this.distractionTimeout);
        }
        // Remove listeners if needed (though singleton pattern usually keeps them)
    }

    private static resetTimer() {
        if (this.distractionTimeout) {
            clearTimeout(this.distractionTimeout);
        }

        this.distractionTimeout = setTimeout(() => {
            this.triggerShield();
        }, this.DISTRACTION_THRESHOLD_MS);
    }

    private static triggerShield() {
        const store = useGameStore.getState();

        // Whitelist screens where interruptions are NOT appropriate (reading, thinking, assessment)
        const SAFE_SCREENS = [
            'DistractionShieldScreen',
            'EmergencyRescueScreen',
            'BattleScreen',
            'BattleOverviewScreen',
            // Onboarding & Assessment screens
            'OnboardingIntroScreen',
            'AvatarIdentityScreen',
            'UserPurposeScreen',
            'LifeAreasScreen',
            'DeepGoalQuizScreen',
            'LifestyleQuizScreen',
            'DistractionQuizScreen',
            'DisciplineToleranceScreen',
            'CoachingStyleScreen',
            'CarismaSocialQuizScreen',
            'MotivationTypeQuizScreen',
            'DifficultyCalibrationScreen',
            'PersonaProfileScreen',
            'ModeSelectScreen',
            'BlueprintRevealScreen',
            'FirstBattleIntroScreen'
        ];

        if (!SAFE_SCREENS.includes(store.activeScreen)) {
            console.log("Distraction detected! Triggering Emergency Rescue.");
            store.setScreen('EmergencyRescueScreen');
        }
    }

    /**
     * Track shield status
     */
    static isShieldActive = false;
    static shieldEndTime: Date | null = null;

    static activateShield(durationMinutes: number) {
        this.isShieldActive = true;
        this.shieldEndTime = new Date(Date.now() + durationMinutes * 60 * 1000);
        console.log(`Shield activated for ${durationMinutes} minutes`);
    }

    static deactivateShield() {
        this.isShieldActive = false;
        this.shieldEndTime = null;
        console.log("Shield deactivated");
    }

    static getShieldStatus(): { active: boolean; remainingMinutes: number } {
        if (!this.isShieldActive || !this.shieldEndTime) {
            return { active: false, remainingMinutes: 0 };
        }

        const now = new Date();
        if (now >= this.shieldEndTime) {
            this.deactivateShield();
            return { active: false, remainingMinutes: 0 };
        }

        const remainingMs = this.shieldEndTime.getTime() - now.getTime();
        const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));

        return { active: true, remainingMinutes };
    }
}
