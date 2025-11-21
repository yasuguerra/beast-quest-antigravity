import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ARENAS } from '../../constants/arenas';
import { Trophy, Star, ArrowRight, Lock, Crown } from 'lucide-react';
import { default as confetti } from 'canvas-confetti';

export const ArenaPromotionScreen: React.FC = () => {
    const { user, setScreen } = useGameStore();

    useEffect(() => {
        // Trigger confetti on mount
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ef4444', '#eab308', '#ffffff']
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ef4444', '#eab308', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    }, []);

    if (!user) return null;

    const currentArena = ARENAS[user.currentArena];

    const handleContinue = () => {
        setScreen('ArenaOverviewScreen');
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

            <div className="relative z-10 max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">

                {/* Header */}
                <div className="space-y-2">
                    <div className="inline-block px-4 py-1 bg-yellow-500/20 border border-yellow-500 rounded-full text-yellow-500 text-xs font-bold uppercase tracking-widest mb-4 animate-bounce">
                        Arena Promotion
                    </div>
                    <h1 className="text-5xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                        Level Up!
                    </h1>
                </div>

                {/* Arena Card */}
                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-600 rounded-3xl p-8 shadow-[0_0_50px_rgba(220,38,38,0.3)] transform hover:scale-105 transition-transform duration-500">
                    <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg border-4 border-black">
                        <Crown className="w-12 h-12 text-white" />
                    </div>

                    <h2 className="text-3xl font-bold text-red-500 mb-2">{currentArena.name}</h2>
                    <p className="text-gray-400 text-sm italic mb-6">"{currentArena.description}"</p>

                    <div className="flex justify-center items-center gap-2 text-yellow-500 font-mono font-bold text-xl bg-yellow-900/20 py-2 rounded-lg">
                        <Trophy className="w-6 h-6" />
                        <span>{user.trophies} Trophies</span>
                    </div>
                </div>

                {/* Unlocked Rewards */}
                <div className="space-y-4">
                    <h3 className="text-sm uppercase text-gray-500 tracking-widest">Unlocked Rewards</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {currentArena.rewards.map((reward, idx) => (
                            <div key={idx} className="bg-gray-900/80 border border-gray-800 p-4 rounded-xl flex items-center gap-4 animate-in slide-in-from-bottom-4 fade-in duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
                                <div className="p-2 bg-gray-800 rounded-lg">
                                    {reward.type === 'CARD' && <Star className="w-5 h-5 text-blue-400" />}
                                    {reward.type === 'CHEST' && <Lock className="w-5 h-5 text-yellow-400" />}
                                    {reward.type === 'RITUAL' && <Trophy className="w-5 h-5 text-purple-400" />}
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-white">{reward.name}</p>
                                    <p className="text-xs text-gray-500">{reward.type}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleContinue}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-lg uppercase tracking-widest rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                    Enter Arena <ArrowRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};
