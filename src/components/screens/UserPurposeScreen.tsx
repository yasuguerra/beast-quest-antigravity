import React, { useState } from 'react';
import { Target, TrendingUp, Briefcase, Heart, Award, Brain } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

const GOALS = [
    { id: 'weight_loss', label: 'Lose weight — Physical transformation', icon: Target },
    { id: 'muscle_gain', label: 'Gain muscle mass', icon: TrendingUp },
    { id: 'discipline', label: 'Improve discipline', icon: Award },
    { id: 'business', label: 'Grow my business', icon: Briefcase },
    { id: 'income', label: 'Increase income', icon: TrendingUp },
    { id: 'career', label: 'Career advancement', icon: Briefcase },
    { id: 'charisma', label: 'Increase charisma / presence', icon: Heart },
    { id: 'relationships', label: 'Improve relationships', icon: Heart },
    { id: 'focus', label: 'Mental energy / focus', icon: Brain },
];

export const UserPurposeScreen: React.FC = () => {
    const { setPrimaryGoal, setScreen } = useGameStore();
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [customGoal, setCustomGoal] = useState('');

    const toggleGoal = (goalId: string) => {
        if (selectedGoals.includes(goalId)) {
            setSelectedGoals(selectedGoals.filter(g => g !== goalId));
        } else if (selectedGoals.length < 3) {
            setSelectedGoals([...selectedGoals, goalId]);
        }
    };

    const handleContinue = () => {
        if (selectedGoals.length > 0 || customGoal) {
            const primaryGoal = selectedGoals[0] || customGoal;
            setPrimaryGoal(primaryGoal);
            setScreen('LifeAreasPriorityScreen');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black text-white flex items-center justify-center p-6">
            <div className="max-w-3xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                        WHAT DO YOU WANT TO ACHIEVE IN THE NEXT 90 DAYS?
                    </h1>
                    <p className="text-lg text-gray-400">
                        "Define your mission. The AI will guide you."
                    </p>
                </div>

                {/* Goal Selection */}
                <div className="mb-8">
                    <p className="text-sm text-gray-400 mb-4">Select up to 3 goals:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {GOALS.map((goal) => {
                            const Icon = goal.icon;
                            const isSelected = selectedGoals.includes(goal.id);
                            return (
                                <button
                                    key={goal.id}
                                    onClick={() => toggleGoal(goal.id)}
                                    className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                                            ? 'bg-red-900/40 border-red-500 shadow-lg shadow-red-500/30'
                                            : 'bg-gray-800/40 border-gray-700 hover:border-gray-600'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-red-500/20' : 'bg-gray-700/40'
                                            }`}>
                                            <Icon className={`w-5 h-5 ${isSelected ? 'text-red-500' : 'text-gray-400'}`} />
                                        </div>
                                        <span className="font-medium">{goal.label}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Custom Goal */}
                <div className="mb-8">
                    <label className="block text-sm text-gray-400 mb-2">Or enter a custom goal:</label>
                    <input
                        type="text"
                        value={customGoal}
                        onChange={(e) => setCustomGoal(e.target.value)}
                        placeholder="Describe your unique goal..."
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-red-500 font-bold">20%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" style={{ width: '20%' }} />
                    </div>
                </div>

                {/* Continue Button */}
                <button
                    onClick={handleContinue}
                    disabled={selectedGoals.length === 0 && !customGoal}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    CONTINUE →
                </button>

                {selectedGoals.length > 0 && (
                    <p className="text-center text-sm text-gray-500 mt-4">
                        {selectedGoals.length} of 3 goals selected
                    </p>
                )}
            </div>
        </div>
    );
};
