import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
    to?: string; // Kept for compatibility but treated as screen name if possible, or ignored
    onClick?: () => void;
    className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ to, onClick, className = '' }) => {
    const { goBack, setScreen } = useGameStore();

    const handleBack = () => {
        if (onClick) {
            onClick();
        } else if (to) {
            // If 'to' looks like a path, try to map it or just ignore. 
            // Ideally 'to' should be a ScreenName now.
            // For now, if it starts with '/', we might need to map it manually or just use goBack()
            if (to.startsWith('/')) {
                console.warn("BackButton used with path in state-router mode:", to);
                goBack();
            } else {
                setScreen(to);
            }
        } else {
            goBack();
        }
    };

    return (
        <button
            onClick={handleBack}
            className={`absolute top-6 left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 z-10 ${className}`}
            aria-label="Go back"
        >
            <ArrowLeft className="w-6 h-6 text-white" />
        </button>
    );
};
