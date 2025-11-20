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
        if (store.activeScreen !== 'DistractionShieldScreen' && store.activeScreen !== 'BattleScreen') {
            console.log("Distraction detected! Engaging Shield.");
            store.setScreen('DistractionShieldScreen');
        }
    }
}
