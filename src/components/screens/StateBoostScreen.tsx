import React, { useState, useEffect } from 'react';
import { ArrowLeft, Zap, CheckCircle2 } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { updateUserProfile } from '../../services/firebase';

enum RitualStep {
    INTRO = 'INTRO',
    POSTURE = 'POSTURE',
    BREATHING = 'BREATHING',
    VICTORY = 'VICTORY',
    AFFIRMATION = 'AFFIRMATION',
    COMPLETE = 'COMPLETE'
}

export const StateBoostScreen: React.FC = () => {
    const { user, goBack, updateResources } = useGameStore();
    const [currentStep, setCurrentStep] = useState<RitualStep>(RitualStep.INTRO);
    const [breathCount, setBreathCount] = useState(0);
    const [isBreathing, setIsBreathing] = useState(false);
    const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

    useEffect(() => {
        if (currentStep === RitualStep.BREATHING && isBreathing) {
            const timer = setInterval(() => {
                setBreathPhase(prev => {
                    if (prev === 'inhale') return 'hold';
                    if (prev === 'hold') return 'exhale';
                    // Complete one breath cycle
                    setBreathCount(c => c + 1);
                    return 'inhale';
                });
            }, 3000); // 3 seconds per phase = 9 seconds per breath

            return () => clearInterval(timer);
        }
    }, [currentStep, isBreathing]);

    useEffect(() => {
        if (breathCount >= 3) {
            setIsBreathing(false);
            setTimeout(() => setCurrentStep(RitualStep.VICTORY), 1000);
        }
    }, [breathCount]);

    const handleComplete = async () => {
        if (!user) return;

        // Grant rewards
        const newXP = user.xp + 10;
        const newTrophies = user.trophies + 5;

        updateResources({ xp: newXP, trophies: newTrophies });
        await updateUserProfile(user.uid, { xp: newXP, trophies: newTrophies });

        setCurrentStep(RitualStep.COMPLETE);
    };

    const renderStep = () => {
        switch (currentStep) {
            case RitualStep.INTRO:
                return (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <Zap className="w-12 h-12 text-red-500" />
                        </div>
                        <h1 className="text-3xl font-black mb-4 uppercase tracking-tight">Peak State Ritual</h1>
                        <p className="text-gray-400 mb-8 max-w-md">
                            This 60-second ritual will shift your physiology and psychology into a state of power.
                        </p>
                        <div className="space-y-2 mb-8 text-left bg-gray-900 border border-gray-800 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                                <span className="text-sm">Power Posture</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                                <span className="text-sm">Breathing Cycle (3x)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                                <span className="text-sm">Victory Gesture</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold">4</div>
                                <span className="text-sm">Power Affirmation</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setCurrentStep(RitualStep.POSTURE)}
                            className="bg-red-600 hover:bg-red-500 px-8 py-4 rounded-xl font-black uppercase tracking-wider transition-colors"
                        >
                            Start Ritual
                        </button>
                    </div>
                );

            case RitualStep.POSTURE:
                return (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <div className="text-sm text-gray-500 mb-2 uppercase tracking-wider">Step 1/4</div>
                        <h2 className="text-2xl font-black mb-6 uppercase">Power Posture</h2>
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8 max-w-md">
                            <p className="text-lg mb-4">Stand up. Shoulders back. Chest out.</p>
                            <p className="text-gray-400 text-sm">
                                Your body language affects your mind. Stand like a champion for 10 seconds.
                            </p>
                        </div>
                        <button
                            onClick={() => setCurrentStep(RitualStep.BREATHING)}
                            className="bg-red-600 hover:bg-red-500 px-8 py-4 rounded-xl font-black uppercase tracking-wider transition-colors"
                        >
                            I'm Ready
                        </button>
                    </div>
                );

            case RitualStep.BREATHING:
                return (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <div className="text-sm text-gray-500 mb-2 uppercase tracking-wider">Step 2/4</div>
                        <h2 className="text-2xl font-black mb-6 uppercase">Power Breathing</h2>

                        {/* Breathing Circle */}
                        <div className="relative w-64 h-64 mb-8">
                            <div
                                className={`absolute inset-0 rounded-full border-4 transition-all duration-3000 ${breathPhase === 'inhale' ? 'scale-100 border-blue-500' :
                                        breathPhase === 'hold' ? 'scale-100 border-yellow-500' :
                                            'scale-75 border-red-500'
                                    }`}
                                style={{
                                    transform: breathPhase === 'inhale' ? 'scale(1)' : breathPhase === 'exhale' ? 'scale(0.75)' : 'scale(1)',
                                    transition: 'transform 3s ease-in-out'
                                }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-4xl font-black mb-2 uppercase">
                                            {breathPhase === 'inhale' ? 'Inhale' : breathPhase === 'hold' ? 'Hold' : 'Exhale'}
                                        </div>
                                        <div className="text-gray-500 text-sm">Breath {breathCount + 1}/3</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {!isBreathing && (
                            <button
                                onClick={() => setIsBreathing(true)}
                                className="bg-red-600 hover:bg-red-500 px-8 py-4 rounded-xl font-black uppercase tracking-wider transition-colors"
                            >
                                Start Breathing
                            </button>
                        )}
                    </div>
                );

            case RitualStep.VICTORY:
                return (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <div className="text-sm text-gray-500 mb-2 uppercase tracking-wider">Step 3/4</div>
                        <h2 className="text-2xl font-black mb-6 uppercase">Victory Gesture</h2>
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8 max-w-md">
                            <p className="text-lg mb-4">Raise both fists in the air.</p>
                            <p className="text-gray-400 text-sm">
                                Hold for 3 seconds. Feel the power. You are unstoppable.
                            </p>
                        </div>
                        <button
                            onClick={() => setCurrentStep(RitualStep.AFFIRMATION)}
                            className="bg-red-600 hover:bg-red-500 px-8 py-4 rounded-xl font-black uppercase tracking-wider transition-colors"
                        >
                            Done
                        </button>
                    </div>
                );

            case RitualStep.AFFIRMATION:
                return (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <div className="text-sm text-gray-500 mb-2 uppercase tracking-wider">Step 4/4</div>
                        <h2 className="text-2xl font-black mb-6 uppercase">Power Affirmation</h2>
                        <div className="bg-gradient-to-br from-red-900/20 to-purple-900/20 border border-red-500/50 rounded-2xl p-8 mb-8 max-w-md">
                            <p className="text-2xl font-black italic mb-4 text-red-400">
                                "I am discipline incarnate."
                            </p>
                            <p className="text-gray-400 text-sm">
                                Say this out loud. Mean it.
                            </p>
                        </div>
                        <button
                            onClick={handleComplete}
                            className="bg-red-600 hover:bg-red-500 px-8 py-4 rounded-xl font-black uppercase tracking-wider transition-colors"
                        >
                            Complete Ritual
                        </button>
                    </div>
                );

            case RitualStep.COMPLETE:
                return (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-24 h-24 bg-green-600/20 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <h1 className="text-3xl font-black mb-4 uppercase tracking-tight">Ritual Complete</h1>
                        <p className="text-gray-400 mb-8">
                            You've shifted your state. Now execute.
                        </p>
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
                            <div className="text-sm text-gray-500 mb-2">Rewards Earned</div>
                            <div className="flex items-center justify-center gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-black text-blue-400">+10</div>
                                    <div className="text-xs text-gray-500">XP</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-black text-yellow-400">+5</div>
                                    <div className="text-xs text-gray-500">Trophies</div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={goBack}
                            className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-xl font-black uppercase tracking-wider transition-colors"
                        >
                            Return to Coach
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Header */}
            {currentStep !== RitualStep.COMPLETE && (
                <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-gray-800 p-4">
                    <div className="flex items-center justify-between">
                        <button onClick={goBack} className="p-2 hover:bg-gray-900 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-bold uppercase tracking-wider">Peak State</span>
                        <div className="w-9" />
                    </div>
                </div>
            )}

            {renderStep()}
        </div>
    );
};
