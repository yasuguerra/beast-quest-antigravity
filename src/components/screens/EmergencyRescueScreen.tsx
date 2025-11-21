import React, { useState } from 'react';
import { AlertTriangle, Zap, Wind, XCircle } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { updateUserProfile } from '../../services/firebase';

export const EmergencyRescueScreen: React.FC = () => {
    const { user, goBack, updateResources } = useGameStore();
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCompleting, setIsCompleting] = useState(false);

    if (!user) return null;

    const handleOption = async (option: number) => {
        setSelectedOption(option);
        setIsCompleting(true);

        let xpChange = 0;
        let trophyChange = 0;

        switch (option) {
            case 1: // Micro-challenge
                xpChange = 10;
                trophyChange = 5;
                break;
            case 2: // Breathing reset
                xpChange = 5;
                trophyChange = 0;
                break;
            case 3: // Return without challenge
                xpChange = 0;
                trophyChange = -3;
                break;
        }

        const newXP = user.xp + xpChange;
        const newTrophies = Math.max(0, user.trophies + trophyChange);

        updateResources({ xp: newXP, trophies: newTrophies });
        await updateUserProfile(user.uid, { xp: newXP, trophies: newTrophies });

        // Wait 2 seconds then return
        setTimeout(() => {
            goBack();
        }, 2000);
    };

    if (isCompleting && selectedOption) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
                <div className="text-center">
                    {selectedOption === 1 && (
                        <>
                            <div className="w-24 h-24 bg-green-600/20 rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
                                <Zap className="w-12 h-12 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-black mb-4 uppercase">Micro-Challenge Accepted</h2>
                            <p className="text-gray-400 mb-4">Do 10 squats + drink water + return</p>
                            <div className="text-sm text-green-400">+10 XP, +5 Trophies</div>
                        </>
                    )}
                    {selectedOption === 2 && (
                        <>
                            <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
                                <Wind className="w-12 h-12 text-blue-500" />
                            </div>
                            <h2 className="text-2xl font-black mb-4 uppercase">Breathing Reset</h2>
                            <p className="text-gray-400 mb-4">Take 3 deep breaths. Box breathing: 4-4-4-4</p>
                            <div className="text-sm text-blue-400">+5 XP</div>
                        </>
                    )}
                    {selectedOption === 3 && (
                        <>
                            <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <XCircle className="w-12 h-12 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-black mb-4 uppercase">Penalty Applied</h2>
                            <p className="text-gray-400 mb-4">You chose to skip the challenge.</p>
                            <div className="text-sm text-red-400">-3 Trophies</div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Urgent Header */}
            <div className="bg-gradient-to-b from-red-900/50 to-black border-b border-red-500/50 p-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
                    <h1 className="text-2xl font-black uppercase tracking-tight">Distraction Detected</h1>
                </div>
                <p className="text-center text-gray-400 text-sm">
                    You've been away for <span className="text-red-400 font-bold">14 minutes</span>
                </p>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 flex flex-col justify-center">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
                    <h2 className="text-lg font-black mb-3 uppercase">What happened?</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        The Anti-Fuga system detected extended inactivity. You were likely distracted by social media,
                        notifications, or procrastination.
                    </p>
                </div>

                <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-4 font-bold">Choose Your Response</h3>

                {/* Option 1: Micro-Challenge */}
                <button
                    onClick={() => handleOption(1)}
                    className="bg-gradient-to-br from-green-900/30 to-green-900/10 border-2 border-green-600 rounded-2xl p-6 mb-4 text-left hover:border-green-500 transition-all group"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-black mb-2 uppercase text-green-400">Micro-Challenge</h4>
                            <p className="text-sm text-gray-400 mb-3">
                                Do 10 squats + drink a glass of water + return to your deck
                            </p>
                            <div className="flex items-center gap-4 text-xs">
                                <span className="text-green-400 font-bold">+10 XP</span>
                                <span className="text-yellow-400 font-bold">+5 Trophies</span>
                            </div>
                        </div>
                    </div>
                </button>

                {/* Option 2: Breathing Reset */}
                <button
                    onClick={() => handleOption(2)}
                    className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 border-2 border-blue-600 rounded-2xl p-6 mb-4 text-left hover:border-blue-500 transition-all group"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Wind className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-black mb-2 uppercase text-blue-400">Breathing Reset</h4>
                            <p className="text-sm text-gray-400 mb-3">
                                30-second box breathing (4-4-4-4) to recenter your focus
                            </p>
                            <div className="flex items-center gap-4 text-xs">
                                <span className="text-blue-400 font-bold">+5 XP</span>
                            </div>
                        </div>
                    </div>
                </button>

                {/* Option 3: Skip (Penalty) */}
                <button
                    onClick={() => handleOption(3)}
                    className="bg-gradient-to-br from-gray-900/30 to-gray-900/10 border-2 border-gray-700 rounded-2xl p-6 text-left hover:border-red-500 transition-all group"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <XCircle className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-black mb-2 uppercase text-gray-400">Return Without Challenge</h4>
                            <p className="text-sm text-gray-400 mb-3">
                                Skip the rescue challenge and go back
                            </p>
                            <div className="flex items-center gap-4 text-xs">
                                <span className="text-red-400 font-bold">-3 Trophies Penalty</span>
                            </div>
                        </div>
                    </div>
                </button>
            </div>

            {/* Footer Warning */}
            <div className="bg-gray-900/50 border-t border-gray-800 p-4">
                <p className="text-center text-xs text-gray-500">
                    Repeated distractions will trigger harder interventions
                </p>
            </div>
        </div>
    );
};
