import React, { useState } from 'react';
import { Smartphone, Gamepad2, Youtube, Pizza, Coffee, Tv } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { BackButton } from '../shared/BackButton';

const DISTRACTIONS = [
    { id: 'social_media', label: 'Social media', icon: Smartphone },
    { id: 'mobile_games', label: 'Mobile games', icon: Gamepad2 },
    { id: 'pornography', label: 'Pornography', icon: Tv },
    { id: 'mental_procrastination', label: 'Mental procrastination', icon: Coffee },
    { id: 'anxiety_avoidance', label: 'Anxiety / avoidance', icon: Coffee },
    { id: 'food_cravings', label: 'Food by craving', icon: Pizza },
    { id: 'youtube_series', label: 'Series / YouTube', icon: Youtube },
];

export const DistractionQuizScreen: React.FC = () => {
    const { answerQuizQuestion, setScreen } = useGameStore();
    const [selectedDistraction, setSelectedDistraction] = useState<string | null>(null);

    const handleSelect = (distractionId: string) => {
        setSelectedDistraction(distractionId);
    };

    const handleContinue = () => {
        if (selectedDistraction) {
            answerQuizQuestion('main_distraction', selectedDistraction);
            setScreen('DisciplineToleranceScreen');
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
                        IDENTIFYING YOUR ENEMIES
                    </h1>
                    <p className="text-lg text-gray-400">
                        "You don't lose against the world.
                    </p>
                    <p className="text-lg text-gray-400">
                        You lose against your distractions."
                    </p>
                </div>

                {/* Question */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-center mb-6">What steals most of your time?</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {DISTRACTIONS.map((distraction) => {
                            const Icon = distraction.icon;
                            const isSelected = selectedDistraction === distraction.id;
                            return (
                                <button
                                    key={distraction.id}
                                    onClick={() => handleSelect(distraction.id)}
                                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${isSelected
                                        ? 'bg-red-900/40 border-red-500 shadow-lg shadow-red-500/30 scale-105'
                                        : 'bg-gray-800/40 border-gray-700 hover:border-gray-600'
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${isSelected ? 'bg-red-500/20' : 'bg-gray-700/40'
                                            }`}>
                                            <Icon className={`w-8 h-8 ${isSelected ? 'text-red-500' : 'text-gray-400'}`} />
                                        </div>
                                        <span className="font-bold text-lg text-center">{distraction.label}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-red-500 font-bold">40%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" style={{ width: '40%' }} />
                    </div>
                </div>

                {/* Continue Button */}
                <button
                    onClick={handleContinue}
                    disabled={!selectedDistraction}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    CONTINUE →
                </button>
            </div>
        </div>
    );
};
