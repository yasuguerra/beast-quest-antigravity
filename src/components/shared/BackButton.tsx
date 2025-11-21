import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const BackButton: React.FC = () => {
    const { screenHistory, goBack } = useGameStore();

    if (screenHistory.length === 0) return null;

    return (
        <button
            onClick={goBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 group"
            aria-label="Go back"
        >
            <ArrowLeft className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm font-medium">Back</span>
        </button>
    );
};
