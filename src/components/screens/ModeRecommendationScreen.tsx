import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { GeminiService } from '../../services/ai';
import { Shield, Flame, ArrowRight, Brain } from 'lucide-react';
import { UserMode } from '../../types';

export const ModeRecommendationScreen: React.FC = () => {
    const { onboardingData, setScreen } = useGameStore();
    const [recommendation, setRecommendation] = useState<{ recommendedMode: 'WARRIOR' | 'BEAST', reason: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendation = async () => {
            // Combine onboarding data and profile for analysis
            // Profile data is already merged into onboardingData by PersonaProfileScreen
            const result = await GeminiService.recommendMode(onboardingData);
            setRecommendation(result);
            setLoading(false);
        };

        fetchRecommendation();
    }, [onboardingData]);

    const handleAccept = () => {
        // Navigate to ModeSelectScreen but pre-select or highlight the recommended mode?
        // PRD says "Accept" might just select it. 
        // But for now, let's go to ModeSelectScreen and let user confirm there, maybe passing the recommendation?
        // Or we can just go to ModeSelectScreen and let the user choose, but we show the recommendation there?
        // The PRD flow implies this screen comes BEFORE ModeSelect.
        // "If user accepts, maybe skip ModeSelect?" 
        // PRD Line 868: "Button: Accept Recommendation" -> Goes to ModeSelect with pre-selection?
        // Or "Button: Choose Manually" -> Goes to ModeSelect.

        // Let's just go to ModeSelectScreen. We can pass state via store if needed, but for now just navigation.
        // Actually, to make it smoother, we could set the mode in store here if accepted, but ModeSelectScreen handles the confirmation logic.
        // Let's just navigate to ModeSelectScreen. The user will see the options again.
        // Ideally, ModeSelectScreen should highlight the recommended one.
        // I'll stick to simple navigation for now.
        setScreen('ModeSelectScreen');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Brain className="w-16 h-16 text-blue-500 animate-pulse mx-auto" />
                    <p className="text-xl font-bold animate-pulse">AI Analyzing Optimal Strategy...</p>
                </div>
            </div>
        );
    }

    if (!recommendation) return null;

    const isBeast = recommendation.recommendedMode === 'BEAST';

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
            <div className="max-w-2xl w-full space-y-8">

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                        AI Strategy Analysis
                    </h1>
                    <p className="text-gray-400">Based on your psychological profile</p>
                </div>

                <div className={`p-8 rounded-2xl border-2 ${isBeast ? 'border-red-600 bg-red-900/20' : 'border-blue-500 bg-blue-900/20'} relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        {isBeast ? <Flame className="w-32 h-32" /> : <Shield className="w-32 h-32" />}
                    </div>

                    <div className="relative z-10 text-center space-y-6">
                        <h2 className="text-xl text-gray-300 uppercase tracking-widest">Recommended Path</h2>

                        <div className="flex justify-center">
                            {isBeast ? (
                                <div className="flex items-center gap-3 text-red-500">
                                    <Flame className="w-12 h-12" />
                                    <span className="text-5xl font-black">BEAST MODE</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 text-blue-500">
                                    <Shield className="w-12 h-12" />
                                    <span className="text-5xl font-black">WARRIOR MODE</span>
                                </div>
                            )}
                        </div>

                        <div className="bg-black/50 p-6 rounded-xl border border-gray-700">
                            <p className="text-lg italic text-gray-300">
                                "{recommendation.reason}"
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <button
                        onClick={handleAccept}
                        className={`w-full py-4 font-black text-lg uppercase tracking-widest rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2
                            ${isBeast ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/50' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50'}`}
                    >
                        Accept Recommendation <ArrowRight className="w-6 h-6" />
                    </button>

                    <button
                        onClick={() => setScreen('ModeSelectScreen')}
                        className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-gray-400 font-bold text-sm uppercase tracking-widest rounded-xl transition-all"
                    >
                        Choose Manually
                    </button>
                </div>

            </div>
        </div>
    );
};
