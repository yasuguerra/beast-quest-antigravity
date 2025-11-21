import React, { useState } from 'react';
import { Shield, Flame, Brain, Zap, Target } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { BackButton } from '../shared/BackButton';

const COACHING_STYLES = [
    {
        id: 'firm',
        label: 'Firm',
        description: 'Direct and clear guidance without emotional intensity',
        icon: Shield,
    },
    {
        id: 'confrontational',
        label: 'Confrontational',
        description: 'Tough love, challenges excuses, pushes boundaries',
        icon: Flame,
    },
    {
        id: 'emotional',
        label: 'Emotional',
        description: 'Energy-driven, peak state focused, transformational',
        icon: Zap,
    },
    {
        id: 'strategic',
        label: 'Strategic',
        description: 'Logical, plan-oriented, systematic approach',
        icon: Brain,
    },
    {
        id: 'motivational',
        label: 'Motivational',
        description: 'Inspiring, uplifting, vision-focused messaging',
        icon: Target,
    },
];

export const CoachingStyleScreen: React.FC = () => {
    const { answerQuizQuestion, setScreen } = useGameStore();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (styleId: string) => {
        setSelected(styleId);
    };

    const handleContinue = () => {
        if (selected) {
            answerQuizQuestion('coaching_style', selected);
            setScreen('CarismaSocialQuizScreen');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black text-white flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                {/* Back Button */}
                <div className="mb-6">
                    <BackButton />
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                        YOUR COACH AI
                    </h1>
                    <p className="text-lg text-gray-400">
                        How do you want your AI coach to communicate with you?
                    </p>
                </div>

                {/* Coaching Style Options */}
                <div className="space-y-3 mb-8">
                    {COACHING_STYLES.map((style) => {
                        const Icon = style.icon;
                        const isSelected = selected === style.id;
                        return (
                            <button
                                key={style.id}
                                onClick={() => handleSelect(style.id)}
                                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${isSelected
                                    ? 'bg-red-900/40 border-red-500 shadow-lg shadow-red-500/30 scale-102'
                                    : 'bg-gray-800/40 border-gray-700 hover:border-gray-600'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isSelected ? 'bg-red-500/20' : 'bg-gray-700/40'
                                        }`}>
                                        <Icon className={`w-6 h-6 ${isSelected ? 'text-red-500' : 'text-gray-400'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg mb-1">{style.label}</h3>
                                        <p className="text-gray-400 text-sm">{style.description}</p>
                                    </div>
                                    {isSelected && (
                                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-xs">✓</span>
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-red-500 font-bold">50%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" style={{ width: '50%' }} />
                    </div>
                </div>

                {/* Continue Button */}
                <button
                    onClick={handleContinue}
                    disabled={!selected}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    CONTINUE →
                </button>
            </div>
        </div>
    );
};
