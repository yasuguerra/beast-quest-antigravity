class HapticEngine {
    private isSupported: boolean;
    private isEnabled: boolean = true;

    constructor() {
        this.isSupported = typeof navigator !== 'undefined' && !!navigator.vibrate;
    }

    /**
     * Trigger a vibration pattern
     * @param pattern Milliseconds or pattern array (e.g. [100, 50, 100])
     */
    public vibrate(pattern: number | number[]): void {
        if (!this.isEnabled || !this.isSupported) return;

        try {
            navigator.vibrate(pattern);
        } catch (e) {
            console.warn('Vibration failed', e);
        }
    }

    /**
     * Trigger a visual shake effect on an element
     * @param elementId ID of the element to shake
     * @param intensity 'light' | 'medium' | 'strong'
     */
    public shake(elementId: string, intensity: 'light' | 'medium' | 'strong' = 'medium'): void {
        if (!this.isEnabled) return;

        const element = document.getElementById(elementId);
        if (!element) return;

        // Remove existing animation class to reset
        element.classList.remove('animate-shake-light', 'animate-shake-medium', 'animate-shake-strong');

        // Force reflow
        void element.offsetWidth;

        // Add animation class
        element.classList.add(`animate-shake-${intensity}`);

        // Remove class after animation completes (approx 500ms)
        setTimeout(() => {
            element.classList.remove(`animate-shake-${intensity}`);
        }, 500);
    }

    public setEnabled(enabled: boolean): void {
        this.isEnabled = enabled;
    }
}

export const hapticEngine = new HapticEngine();

// Common patterns
export const HAPTIC_PATTERNS = {
    CLICK: 10, // Light tap
    SUCCESS: [50, 30, 50], // Double tap
    ERROR: [50, 100, 50], // Buzz
    VICTORY: [100, 50, 100, 50, 200], // Fanfare pattern
    DAMAGE: 200, // Long buzz
};
