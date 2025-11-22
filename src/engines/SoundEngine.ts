import { useGameStore } from '../store/gameStore';

class SoundEngine {
    private sounds: Record<string, HTMLAudioElement> = {};
    private isMuted: boolean = false;
    private volume: number = 0.7;

    constructor() {
        // Initialize with default settings
        this.isMuted = false;
        this.volume = 0.7;
    }

    /**
     * Preload sound assets
     */
    public async preload(soundMap: Record<string, string>): Promise<void> {
        const promises = Object.entries(soundMap).map(([key, url]) => {
            return new Promise<void>((resolve, reject) => {
                const audio = new Audio(url);
                audio.addEventListener('canplaythrough', () => resolve(), { once: true });
                audio.addEventListener('error', (e) => {
                    console.warn(`Failed to load sound: ${key}`, e);
                    resolve(); // Resolve anyway to not block app
                });
                this.sounds[key] = audio;
                audio.load();
            });
        });

        await Promise.all(promises);
    }

    /**
     * Play a sound by ID
     */
    public play(soundId: string, volumeOverride?: number): void {
        if (this.isMuted) return;

        const sound = this.sounds[soundId];
        if (sound) {
            // Clone node to allow overlapping sounds
            const clone = sound.cloneNode() as HTMLAudioElement;
            clone.volume = (volumeOverride ?? this.volume);
            clone.play().catch(e => console.warn('Audio play failed (user interaction needed?)', e));
        } else {
            console.warn(`Sound not found: ${soundId}`);
        }
    }

    /**
     * Stop a sound (if we were tracking instances, but for SFX we usually just let them finish)
     */
    public stop(soundId: string): void {
        // Implementation would require tracking active instances
    }

    public setMuted(muted: boolean): void {
        this.isMuted = muted;
    }

    public setVolume(volume: number): void {
        this.volume = Math.max(0, Math.min(1, volume));
    }
}

export const soundEngine = new SoundEngine();

// Default sound map (using placeholders or free CDN links for now)
export const SOUNDS = {
    CLICK: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Short click
    VICTORY: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Success fanfare
    DEFEAT: 'https://assets.mixkit.co/active_storage/sfx/2050/2050-preview.mp3', // Failure tone
    LEVEL_UP: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', // Magical chime
    ERROR: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', // Error buzz
    DAMAGE: 'https://assets.mixkit.co/active_storage/sfx/2178/2178-preview.mp3', // Impact
};
