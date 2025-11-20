import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { Sword, Heart, Clock, Shield, Skull } from 'lucide-react';

export const BattleOverviewScreen: React.FC = () => {
    const navigate = useNavigate();
    const { battle, user, currentDeck, completeCard, failCard } = useGameStore();
    const [activeCard, setActiveCard] = useState(currentDeck?.cards.find(c => c.id === battle.activeCardId));

    useEffect(() => {
        if (!battle.isActive || !currentDeck) {
            navigate('/dashboard');
        }
        setActiveCard(currentDeck?.cards.find(c => c.id === battle.activeCardId));
    }, [battle, currentDeck, navigate]);

    if (!activeCard) return null;

    const handleVictory = () => {
        completeCard(activeCard.id);
        navigate('/battle-result', { state: { result: 'VICTORY', card: activeCard } });
    };

    const handleDefeat = () => {
        failCard(activeCard.id);
        navigate('/battle-result', { state: { result: 'DEFEAT', card: activeCard } });
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full bg-red-900/10 z-0 animate-pulse" />

            {/* HUD */}
            <div className="relative z-10 flex justify-between items-center mb-8">
                <div className="flex items-center gap-2 bg-gray-900/80 px-4 py-2 rounded-full border border-red-900">
                    <Heart className="w-6 h-6 text-red-600 fill-current animate-pulse" />
                    <span className="text-xl font-black">{battle.currentHp}/{battle.maxHp}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-900/80 px-4 py-2 rounded-full border border-blue-900">
                    <Clock className="w-6 h-6 text-blue-500" />
                    <span className="text-xl font-mono">00:45:00</span>
                </div>
            </div>

            {/* Enemy (The Task) */}
            <div className="flex-1 flex flex-col items-center justify-center z-10 space-y-8">
                <div className="relative">
                    <div className="absolute -inset-4 bg-red-600/20 rounded-full blur-xl animate-pulse" />
                    <Skull className="w-32 h-32 text-gray-200 relative z-10" />
                </div>

                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-red-500">
                        {activeCard.title}
                    </h2>
                    <p className="text-gray-400 max-w-xs mx-auto">
                        {activeCard.description}
                    </p>
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-sm font-mono text-gray-500">
                    <span className="flex items-center gap-1"><Sword className="w-4 h-4" /> {activeCard.xpReward} XP</span>
                    <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> {activeCard.energyCost} EN</span>
                </div>
            </div>

            {/* Actions */}
            <div className="relative z-10 grid grid-cols-2 gap-4 mt-auto">
                <button
                    onClick={handleDefeat}
                    className="py-4 bg-gray-900 border border-gray-700 rounded-xl text-gray-400 font-bold uppercase hover:bg-gray-800 hover:text-white transition-colors"
                >
                    Surrender
                </button>
                <button
                    onClick={handleVictory}
                    className="py-4 bg-red-600 border border-red-500 rounded-xl text-white font-black uppercase hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all hover:scale-105"
                >
                    Execute
                </button>
            </div>
        </div>
    );
};
