import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { EmotionEngine } from '../../engines/EmotionEngine';
import { EmotionalState } from '../../types';
import { Smile, Frown, Meh, Zap, Battery, Focus, TrendingUp } from 'lucide-react';
import { updateUserProfile } from '../../services/firebase';

export const EmotionCheckInScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useGameStore();

    const [energy, setEnergy] = useState(50);
    const [willpower, setWillpower] = useState(50);
    const [focus, setFocus] = useState(50);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async () => {
        if (!user) return;

        setProcessing(true);

        // Analyze emotional state
        const recentBehavior = {
            cardsCompleted: 5, // TODO: Get from actual stats
            cardsFailed: 1,
            lastLoginHours: 2,
            streakDays: user.streakDays
        };

        const emotionalState = await EmotionEngine.analyzeEmotionalState(
            energy,
            willpower,
            focus,
            recentBehavior
        );

        // Update user profile
        await updateUserProfile(user.uid, {
            currentEmotionalState: emotionalState,
            lastEmotionCheckIn: new Date().toISOString()
        });

        // Get AI coaching message
        const coachMessage = await EmotionEngine.getEmotionBasedCoachMessage(
            emotionalState,
            user.displayName,
            `Energy: ${energy}, Willpower: ${willpower}, Focus: ${focus}`
        );

        setProcessing(false);

        // Navigate to dashboard with emotion result
        navigate('/dashboard', {
            state: {
                emotionCheckIn: true,
                emotionalState,
                coachMessage
            }
        });
    };

    const getEmojiForValue = (value: number) => {
        if (value >= 70) return <Smile className="w-6 h-6 text-green-500" />;
        if (value >= 40) return <Meh className="w-6 h-6 text-yellow-500" />;
        return <Frown className="w-6 h-6 text-red-500" />;
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">How Are You Feeling?</h1>
                    <p className="text-gray-400">Help me adapt today's challenges to your state</p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/40 to-black border-2 border-purple-700/50 rounded-2xl p-6 space-y-6">
                    {/* Energy Level */}
                    <div>
                        <label className="flex items-center gap-2 text-lg font-bold mb-3">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            Energy Level
                            {getEmojiForValue(energy)}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={energy}
                            onChange={(e) => setEnergy(Number(e.target.value))}
                            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Drained</span>
                            <span className="font-bold text-white">{energy}%</span>
                            <span>Explosive</span>
                        </div>
                    </div>

                    {/* Willpower */}
                    <div>
                        <label className="flex items-center gap-2 text-lg font-bold mb-3">
                            <Battery className="w-5 h-5 text-blue-500" />
                            Willpower
                            {getEmojiForValue(willpower)}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={willpower}
                            onChange={(e) => setWillpower(Number(e.target.value))}
                            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Weak</span>
                            <span className="font-bold text-white">{willpower}%</span>
                            <span>Iron</span>
                        </div>
                    </div>

                    {/* Focus */}
                    <div>
                        <label className="flex items-center gap-2 text-lg font-bold mb-3">
                            <Focus className="w-5 h-5 text-purple-500" />
                            Focus & Clarity
                            {getEmojiForValue(focus)}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={focus}
                            onChange={(e) => setFocus(Number(e.target.value))}
                            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Scattered</span>
                            <span className="font-bold text-white">{focus}%</span>
                            <span>Locked In</span>
                        </div>
                    </div>

                    {/* Average */}
                    <div className="pt-4 border-t border-gray-700">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Overall State:</span>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-500" />
                                <span className="text-2xl font-bold">
                                    {Math.round((energy + willpower + focus) / 3)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 py-4 rounded-xl font-bold text-lg disabled:opacity-50 transition-all"
                    >
                        {processing ? 'Analyzing...' : 'Continue'}
                    </button>

                    {/* Skip Option */}
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full text-gray-500 hover:text-gray-300 text-sm py-2"
                    >
                        Skip for now
                    </button>
                </div>

                {/* Info */}
                <p className="text-center text-xs text-gray-600 mt-4">
                    Your emotional state helps me generate the perfect deck difficulty for you today.
                </p>
            </div>
        </div>
    );
};
