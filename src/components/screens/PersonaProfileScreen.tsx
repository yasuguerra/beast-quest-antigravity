import React, { useEffect, useState } from 'react';
import { Brain, Target, Shield, Zap, AlertCircle } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { GeminiService } from '../../services/ai';

export const PersonaProfileScreen: React.FC = () => {
    const { onboardingData, setGeneratedProfile, setBlueprint, setScreen, setLoading } = useGameStore();
    const [profile, setProfile] = useState<any>(null);

    // Helper function to convert coach names to descriptive text
    const getCoachingStyleDescription = (coachName: string): string => {
        const coachMap: Record<string, string> = {
            'GROVER': 'Iron Commander',
            'ROBBINS': 'Tactical Architect',
            'CARISMA': 'Inner Flame Mentor',
            'BEAST': 'Iron Commander',
            'WARRIOR': 'Tactical Architect'
        };
        return coachMap[coachName] || 'Strategic Mentor';
    };

    useEffect(() => {
        // Prevent infinite loop: If blueprint already exists, don't regenerate
        const { generatedBlueprint } = useGameStore.getState();
        if (generatedBlueprint && profile) {
            setLoading(false);
            return;
        }
        generateProfile();
    }, []);

    const generateProfile = async () => {
        setLoading(true);
        try {
            // Use Gemini to analyze all onboarding data and generate profile
            const generatedProfile = await GeminiService.generatePlayerProfile(onboardingData);
            setProfile(generatedProfile);
            setGeneratedProfile(generatedProfile);

            // Generate blueprint based on profile and goal
            const generatedBlueprint = await GeminiService.generateBlueprint(
                onboardingData.primaryGoal || 'Transform my life',
                generatedProfile
            );
            setBlueprint(generatedBlueprint);
        } catch (error) {
            console.error('Failed to generate profile:', error);
            // Fallback profile
            const fallbackProfile = {
                mentalStrength: 'MEDIUM',
                emotionalStyle: 'Strategic disciplined',
                topDistraction: 'Social media',
                coachPreference: 'Firm + strategic',
            };
            setProfile(fallbackProfile);
            setGeneratedProfile(fallbackProfile);

            // Fallback Blueprint to prevent loop
            setBlueprint({
                missionStatement: "To forge a new identity through discipline and action.",
                phases: [
                    { phaseName: "Foundation", duration: "Days 1-30", focus: "Discipline", keyHabit: "Morning Protocol" },
                    { phaseName: "Expansion", duration: "Days 31-60", focus: "Strength", keyHabit: "Deep Work" },
                    { phaseName: "Mastery", duration: "Days 61-90", focus: "Power", keyHabit: "Leadership" }
                ],
                dailyRitual: "5 Minutes of Silence"
            });
        } finally {
            setLoading(false);
        }
    };

    const [isNavigating, setIsNavigating] = useState(false);

    const handleContinue = () => {
        if (isNavigating) return;
        setIsNavigating(true);
        // Skip redundant ModeRecommendationScreen, go directly to ModeSelectScreen
        setScreen('ModeSelectScreen');
    };

    // ... (inside return)

    <button
        onClick={handleContinue}
        disabled={isNavigating}
        className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {isNavigating ? 'LOADING...' : 'CONTINUE →'}
    </button>

    if (!profile) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-gray-400">Analyzing your profile...</p>
                    <p className="text-sm text-gray-500 mt-2">AI is processing your assessment</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black text-white flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                        YOUR AI PROFILE
                    </h1>
                    <p className="text-lg text-gray-400">
                        "Your history doesn't define you.
                    </p>
                    <p className="text-lg text-gray-400">
                        Your decisions do."
                    </p>
                </div>

                {/* Profile Cards */}
                <div className="space-y-4 mb-8">
                    <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Target className="w-6 h-6 text-red-500" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-gray-400 mb-1">PRIMARY GOAL</div>
                                <div className="text-xl font-bold">{onboardingData.primaryGoal || 'Transformation'}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-6 h-6 text-orange-500" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-gray-400 mb-1">DOMINANT DISTRACTION</div>
                                <div className="text-xl font-bold">{profile.topDistraction}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Brain className="w-6 h-6 text-blue-500" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-gray-400 mb-1">MENTAL STRENGTH</div>
                                <div className="text-xl font-bold uppercase">{profile.mentalStrength}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Zap className="w-6 h-6 text-purple-500" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-gray-400 mb-1">EMOTIONAL STYLE</div>
                                <div className="text-xl font-bold">{profile.emotionalStyle}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Shield className="w-6 h-6 text-green-500" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-gray-400 mb-1">RECOMMENDED COACHING</div>
                                <div className="text-xl font-bold">{getCoachingStyleDescription(profile.coachPreference)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-red-500 font-bold">70%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" style={{ width: '70%' }} />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={() => setScreen('DeepGoalQuizScreen')}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-200"
                    >
                        ← EDIT
                    </button>
                    <button
                        onClick={handleContinue}
                        disabled={isNavigating}
                        className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isNavigating ? 'LOADING...' : 'CONTINUE →'}
                    </button>
                </div>
            </div>
        </div>
    );
};
