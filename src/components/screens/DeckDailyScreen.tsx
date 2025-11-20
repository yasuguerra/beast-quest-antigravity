import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Card } from '../game/Card';
import { RefreshCw, Shield, Flame } from 'lucide-react';

export const DeckDailyScreen: React.FC = () => {
    const { currentDeck, generateDeck, isLoading, user } = useGameStore();

    useEffect(() => {
        if (!currentDeck) {
            generateDeck();
        }
    }, [currentDeck, generateDeck]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
                <p className="text-gray-400 animate-pulse">The Coach is preparing your deck...</p>
            </div>
        );
    }

    if (!currentDeck) return null;

    const completedCount = currentDeck.cards.filter(c => c.isCompleted).length;
    const totalCount = currentDeck.cards.length;
    const progress = (completedCount / totalCount) * 100;

    return (
        <div className="space-y-6">
            {/* Deck Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                        Daily Deck
                    </h2>
                    <p className="text-xs text-gray-500 font-mono">
                        ID: {currentDeck.id.slice(-6)} | PRESSURE: {currentDeck.pressureLevel}%
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-bold text-white">{completedCount}/{totalCount}</span>
                    <div className="w-24 h-2 bg-gray-800 rounded-full mt-1 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Coach Message (Mini) */}
            <div className="bg-gray-900/50 border-l-4 border-red-500 p-4 rounded-r-xl">
                <p className="text-sm text-gray-300 italic">
                    "Today is not a day to hesitate. Execute the red cards first."
                </p>
                <p className="text-xs text-red-500 font-bold mt-1 uppercase">- Coach Grover</p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 gap-4 pb-20">
                {currentDeck.cards.map((card) => (
                    <Card key={card.id} card={card} />
                ))}
            </div>
        </div>
    );
};
