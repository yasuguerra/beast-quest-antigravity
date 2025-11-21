import React, { useState } from 'react';
import { Shield, Flame, Sword } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { BackButton } from '../shared/BackButton';

const TOLERANCE_LEVELS = [
    {
        id: 'gentle',
        label: 'Gentle — I\'m just starting',
        description: 'Supportive coaching with minimal penalties',
        icon: Shield,
        color: 'from-blue-500 to-blue-600',
    },
    {
        id: 'moderate',
        label: 'Moderate — I can handle pressure',
        description: 'Balanced approach with moderate accountability',
        icon: Flame,
        color: 'from-orange-500 to-orange-600',
    },
    {
        id: 'strong',
        label: 'Strong — I want to be pushed',
        description: 'Firm coaching with real consequences (Grover Mode)',
        icon: Sword,
        color: 'from-red-500 to-red-600',
    },
];

export const DisciplineToleranceScreen: React.FC = () => {
    const { answerQuizQuestion, setScreen } = useGameStore();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (levelId: string) => {
        setSelected(levelId);
    };

    const handleContinue = () => {
        if (selected) {
            answerQuizQuestion('discipline_tolerance', selected);
            setScreen('CoachingStyleScreen');
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
                        YOUR RESISTANCE TO PAIN
                    </h1>
                    <p className="text-lg text-gray-400">
                        "Discipline is the price of freedom."
                    </p>
                </div>

                {/* Question */}
                <h2 className="text-2xl font-bold text-center mb-8">What level can you handle right now?</h2>

                {/* Tolerance Options */}
                <div className="space-y-4 mb-8">
                    {TOLERANCE_LEVELS.map((level) => {
                        const Icon = level.icon;
                        const isSelected = selected === level.id;
                        return (
                            <button
                                key={level.id}
                                onClick={() => handleSelect(level.id)}
                                className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 ${isSelected
                                    ? 'bg-red-900/40 border-red-500 shadow-2xl shadow-red-500/40 scale-102'
                                    : 'bg-gray-800/40 border-gray-700 hover:border-gray-600'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${level.color} rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? 'scale-110' : ''
                                        }`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2">{level.label}</h3>
                                        <p className="text-gray-400 text-sm">{level.description}</p>
                                    </div>
                                    {isSelected && (
                                        <div className="flex-shrink-0">
                                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm">✓</span>
                                            </div>
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
                        <span className="text-red-500 font-bold">45%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" style={{ width: '45%' }} />
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
