import React from 'react';
import { Flame, Target, Zap } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { BackButton } from '../shared/BackButton';

export const OnboardingIntroScreen: React.FC = () => {
    const { setScreen } = useGameStore();

    const handleContinue = () => {
        setScreen('UserPurposeScreen');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black text-white flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                {/* Back Button */}
                <div className="mb-6">
                    <BackButton />
                </div>

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                        PREPARE FOR THE ARENA
                    </h1>
                    <p className="text-2xl font-bold text-gray-300">
                        "You're not here to improve a little.
                    </p>
                    <p className="text-2xl font-bold text-gray-300">
                        You're here to dominate your life."
                    </p>
                </div>

                {/* Info Cards */}
                <div className="space-y-6 mb-12">
                    <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 backdrop-blur-sm border border-red-500/30 rounded-xl p-6 flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                                <Flame className="w-6 h-6 text-red-500" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-2">You will be trained by AI.</h3>
                            <p className="text-gray-400 text-sm">
                                Powered by Gemini, your coach adapts to your personality, goals, and emotional state.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-900/40 to-yellow-900/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6 flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                <Target className="w-6 h-6 text-orange-500" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-2">You will compete against yourself.</h3>
                            <p className="text-gray-400 text-sm">
                                Every day is a battle. Every card completed brings you closer to becoming unstoppable.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-900/40 to-red-900/40 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6 flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                <Zap className="w-6 h-6 text-yellow-500" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-2">Each day will be a battle.</h3>
                            <p className="text-gray-400 text-sm">
                                No excuses. No shortcuts. Just you versus the person you were yesterday.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-red-500 font-bold">15%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" style={{ width: '15%' }} />
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={handleContinue}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/50"
                >
                    BEGIN
                </button>
            </div>
        </div>
    );
};
