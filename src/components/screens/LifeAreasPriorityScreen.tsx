import React, { useState } from 'react';
import { Heart, Briefcase, Users, Sparkles } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { BackButton } from '../shared/BackButton';

const LIFE_AREAS = [
    { id: 'health', label: 'Health', icon: Heart, color: 'red' },
    { id: 'business', label: 'Business', icon: Briefcase, color: 'blue' },
    { id: 'social', label: 'Social', icon: Users, color: 'green' },
    { id: 'spirit', label: 'Spirit', icon: Sparkles, color: 'yellow' },
];

export const LifeAreasPriorityScreen: React.FC = () => {
    const { setLifeAreas, setScreen } = useGameStore();
    const [areas, setAreas] = useState<Record<string, number>>({
        health: 0,
        business: 0,
        social: 0,
        spirit: 0,
    });

    const handleSliderChange = (areaId: string, value: number) => setAreas({ ...areas, [areaId]: value });

    const total = Object.values(areas).reduce((sum, val) => sum + val, 0);

    const handleContinue = () => {
        setLifeAreas(areas);
        setScreen('DeepGoalQuizScreen');
    };

    const getColorClass = (color: string) => {
        const colors: Record<string, string> = {
            red: 'from-red-500 to-red-600',
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            yellow: 'from-yellow-500 to-yellow-600',
        };
        return colors[color] || 'from-gray-500 to-gray-600';
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
                        PRIORITIZE YOUR LIFE
                    </h1>
                    <p className="text-lg text-gray-400">
                        "Your focus defines your power."
                    </p>
                </div>

                {/* Instructions */}
                <p className="text-sm text-gray-400 mb-6 text-center">
                    Drag the sliders to assign importance (Total should be 100%)
                </p>

                {/* Life Areas */}
                <div className="space-y-6 mb-8">
                    {LIFE_AREAS.map((area) => {
                        const Icon = area.icon;
                        const percentage = areas[area.id];
                        return (
                            <div key={area.id} className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 bg-gradient-to-br ${getColorClass(area.color)} rounded-lg flex items-center justify-center`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-bold text-lg">{area.label}</span>
                                    </div>
                                    <span className="text-2xl font-bold text-white">{percentage}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={percentage}
                                    onChange={(e) => handleSliderChange(area.id, parseInt(e.target.value))}
                                    className="w-full h-3 bg-gray-700 rounded-full outline-none appearance-none slider"
                                    style={{
                                        background: `linear-gradient(to right, 
                                            rgb(239, 68, 68) 0%, 
                                            rgb(239, 68, 68) ${percentage}%, 
                                            rgb(55, 65, 81) ${percentage}%, 
                                            rgb(55, 65, 81) 100%)`
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Total Indicator */}
                <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 mb-8">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">Total Allocation:</span>
                        <span className={`text-2xl font-bold ${total === 100 ? 'text-green-500' : 'text-yellow-500'}`}>
                            {total}% {total === 100 ? '✓' : ''}
                        </span>
                    </div>
                    {total !== 100 && (
                        <p className="text-xs text-gray-500 mt-2">
                            {total < 100 ? `Add ${100 - total}% more` : `Reduce by ${total - 100}%`}
                        </p>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-red-500 font-bold">25%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" style={{ width: '25%' }} />
                    </div>
                </div>

                {/* Continue Button */}
                <button
                    onClick={handleContinue}
                    disabled={total !== 100}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    CONTINUE →
                </button>
            </div>
        </div>
    );
};
