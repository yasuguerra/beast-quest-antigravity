import React from 'react';
import { soundEngine } from '../../engines/SoundEngine';
import { hapticEngine, HAPTIC_PATTERNS } from '../../engines/HapticEngine';

interface JuicyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    sound?: 'CLICK' | 'VICTORY' | 'ERROR';
    haptic?: keyof typeof HAPTIC_PATTERNS;
}

export const JuicyButton: React.FC<JuicyButtonProps> = ({
    children,
    onClick,
    className = '',
    variant = 'primary',
    sound = 'CLICK',
    haptic = 'CLICK',
    ...props
}) => {

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Play Sound
        soundEngine.play(sound);

        // Trigger Haptic
        if (typeof haptic === 'string') {
            // @ts-ignore - accessing static map dynamically
            const pattern = HAPTIC_PATTERNS[haptic];
            if (pattern) hapticEngine.vibrate(pattern);
        }

        // Call original handler
        if (onClick) onClick(e);
    };

    // Base styles
    const baseStyles = "font-bold py-3 px-6 rounded-xl transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

    // Variant styles
    const variants = {
        primary: "bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]",
        secondary: "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700",
        danger: "bg-red-600 text-white hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)]",
        ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
    };

    return (
        <button
            onClick={handleClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
