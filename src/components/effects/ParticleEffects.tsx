import confetti from 'canvas-confetti';

class ParticleEffects {
    private isEnabled: boolean = true;

    /**
     * Trigger a victory confetti explosion
     */
    public victory(): void {
        if (!this.isEnabled) return;

        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ef4444', '#f97316', '#ffffff'] // Red, Orange, White
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ef4444', '#f97316', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    }

    /**
     * Trigger a level up radial burst
     */
    public levelUp(): void {
        if (!this.isEnabled) return;

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ffd700', '#ffffff', '#fbbf24'], // Gold, White, Amber
            zIndex: 1000
        });
    }

    /**
     * Trigger a chest open fireworks effect
     */
    public chestOpen(): void {
        if (!this.isEnabled) return;

        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const particleCount = 50;
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        setTimeout(() => clearInterval(interval), 1500);
    }

    /**
     * Trigger a damage flash (visual only, no confetti)
     * This is usually handled by CSS, but we can add red particles if needed
     */
    public damage(): void {
        // Optional: Red sparks
    }

    public setEnabled(enabled: boolean): void {
        this.isEnabled = enabled;
    }
}

export const particleEffects = new ParticleEffects();
