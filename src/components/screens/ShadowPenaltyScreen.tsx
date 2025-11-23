import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Skull, AlertTriangle, ArrowRight } from 'lucide-react';
import { soundEngine } from '../../engines/SoundEngine';
import { hapticEngine, HAPTIC_PATTERNS } from '../../engines/HapticEngine';
import { JuicyButton } from '../ui/JuicyButton';

export const ShadowPenaltyScreen: React.FC = () => {
    const { setScreen, user } = useGameStore();

    useEffect(() => {
        // Play intense sound and haptics on mount
        soundEngine.play('DEFEAT'); // Assuming we have a defeat sound or similar
        hapticEngine.vibrate(HAPTIC_PATTERNS.ERROR);
    }, []);

    const handleAccept = () => {
        setScreen('HomeDashboardScreen');
    };

    return (
        <div className="min-h-screen bg-red-950 text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80"></div>

            <div className="relative z-10 max-w-md w-full text-center space-y-8">

                <div className="animate-pulse">
                    <Skull size={80} className="text-red-500 mx-auto drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-black uppercase tracking-widest text-red-500 glitch-text">
                        FAILURE
                    </h1>
                    <p className="text-red-300 font-bold tracking-wider">
                        BEAST MODE UNFORGIVING
                    </p>
                </div>

                <div className="bg-black/60 backdrop-blur-sm border border-red-900/50 p-6 rounded-xl space-y-4">
                    <div className="flex items-center justify-center gap-3 text-red-400">
                        <AlertTriangle size={24} />
                        <span className="font-bold uppercase">Consequence Applied</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-red-900/20 p-3 rounded-lg border border-red-900/30">
                            <span className="block text-xs text-red-400 uppercase">HP Lost</span>
                            <span className="text-2xl font-bold text-white">-20</span>
                        </div>
                        <div className="bg-red-900/20 p-3 rounded-lg border border-red-900/30">
                            <span className="block text-xs text-red-400 uppercase">Streak</span>
                            <span className="text-2xl font-bold text-white">FROZEN</span>
                        </div>
                    </div>

                    <p className="text-sm text-gray-400 italic">
                        "The shadow grows with every hesitation. Act, or be consumed."
                    </p>
                </div>

                <JuicyButton
                    onClick={handleAccept}
                    variant="ghost"
                    className="w-full border border-red-500/50 text-red-500 hover:bg-red-900/20"
                    sound="CLICK"
                >
                    I Accept the Consequences <ArrowRight size={18} className="ml-2" />
                </JuicyButton>

            </div>
        </div>
    );
};
