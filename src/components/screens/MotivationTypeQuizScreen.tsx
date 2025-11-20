import React, { useState } from 'react';
import { Trophy, AlertCircle, Heart, TrendingUp, Users, Lightbulb } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

const MOTIVATION_TYPES = [
    {
        id: 'achievement',
        label: 'Achievement',
        description: 'I want to accomplish goals and prove my capability',
        icon: Trophy,
    },
    {
        id: 'fear',
        label: 'Fear',
        description: 'I\'m motivated by avoiding failure and consequences',
        icon: AlertCircle,
    },
    {
        id: 'pride',
        label: 'Pride',
        description: 'I want to feel proud of who I\'m becoming',
        icon: Heart,
    },
    {
        id: 'demonstration',
        label: 'Demonstration (Leviathan)',
        description: 'I need to prove my worth to others',
        icon: TrendingUp,
    },
    {
        id: 'competition',
        label: 'Competition',
        description: 'I thrive on winning and being the best',
        icon: Users,
    },
    {
        id: 'inspiration',
        label: 'Inspiration',
        description: 'I\'m driven by vision and possibility',
        icon: Lightbulb,
    },
];

export const MotivationTypeQuizScreen: React.FC = () => {
    const { answerQuizQuestion, setScreen } = useGameStore();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (typeId: string) => {
        setSelected(typeId);
    };

    const handleContinue = () => {
        if (selected) {
            answerQuizQuestion('motivation_type', selected);
            setScreen('DifficultyCalibrationScreen');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black text-white flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                        WHAT DRIVES YOU?
                    </h1>
                    <p className="text-lg text-gray-400">
                        Understanding your motivation type helps us tailor your experience.
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-center mb-6">Select what motivates you most:</h2>

                <div className="space-y-3 mb-8">
                    {MOTIVATION_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isSelected = selected === type.id;
                        return (
                            <button
                                key={type.id}
                                onClick={() => handleSelect(type.id)}
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
                                        <h3 className="font-bold text-lg mb-1">{type.label}</h3>
                                        <p className="text-gray-400 text-sm">{type.description}</p>
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

                <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-red-500 font-bold">60%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" style={{ width: '60%' }} />
                    </div>
                </div>

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
