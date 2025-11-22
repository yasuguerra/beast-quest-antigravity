import React, { useEffect, useState } from 'react';
import { AlertTriangle, Skull, Timer, ArrowRight } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { CardType, CardRarity } from '../../types';

export const SuddenDeathScreen: React.FC = () => {
    const { setScreen, failCard, initBattle, user } = useGameStore();
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Fail logic
                    // We need a dummy card ID to fail, or update failCard to handle null
                    // For now, let's just go to Dashboard to avoid crash, but ideally we penalize
                    setScreen('Dashboard');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [setScreen]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleAccept = () => {
        // Create a Nuclear Task
        const nuclearTask = {
            id: `sudden-death-${Date.now()}`,
            title: "SURVIVE THE AMBUSH",
            description: "Complete 20 Burpees immediately.",
            type: CardType.DUELO,
            rarity: CardRarity.EPIC,
            energyCost: 5,
            xpReward: 100,
            trophyReward: 20,
            durationMinutes: 3,
            isCompleted: false
        };

        // Initialize Battle with this single card
        initBattle({
            id: 'sudden-death-deck',
            userId: user?.uid || 'guest',
            status: 'ACTIVE',
            pressureLevel: 100,
            cards: [nuclearTask]
        });
    };

    return (
        <div className="min-h-screen bg-red-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />

            <div className="relative z-10 text-center space-y-8 animate-pulse">
                <div className="inline-block p-6 rounded-full bg-red-600 shadow-[0_0_100px_rgba(220,38,38,0.8)]">
                    <Skull className="w-24 h-24 text-white animate-bounce" />
                </div>

                <div>
                    <h1 className="text-6xl font-black uppercase tracking-tighter text-red-500 drop-shadow-lg">
                        SUDDEN DEATH
                    </h1>
                    <p className="text-2xl font-bold text-white mt-2">
                        ¡INTERVENCIÓN DE EMERGENCIA!
                    </p>
                </div>

                <div className="bg-black/50 border-2 border-red-500 px-8 py-4 rounded-2xl">
                    <div className="flex items-center justify-center gap-4 text-5xl font-mono font-bold text-red-500">
                        <Timer className="w-12 h-12" />
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <p className="text-xl max-w-md mx-auto leading-relaxed">
                    The Coach has detected hesitation. You have 3 minutes to complete a nuclear task or you will lose 50 HP.
                </p>

                <button
                    onClick={handleAccept}
                    className="w-full max-w-md py-5 bg-white text-red-900 font-black text-xl uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2 mx-auto"
                >
                    Accept Challenge <ArrowRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};
