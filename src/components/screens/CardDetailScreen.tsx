import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { CardType, UserMode } from '../../types';
import { Shield, Clock, Zap, RefreshCw, Play, ArrowLeft } from 'lucide-react';

export const CardDetailScreen: React.FC = () => {
    const { currentDeck, selectedCardId, user, setScreen, completeCard } = useGameStore();

    const activeCard = currentDeck?.cards.find(c => c.id === selectedCardId);

    if (!activeCard) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
                <p>No card selected.</p>
                <button onClick={() => setScreen('HomeDashboardScreen')} className="mt-4 px-4 py-2 bg-red-600 rounded">Back to Dashboard</button>
            </div>
        );
    }

    const isWarriorMode = user?.mode === UserMode.WARRIOR;

    const handleStart = () => {
        // For now, we'll just complete it to simulate "doing" the task.
        // In a real app, this might go to a timer or active state.
        completeCard(activeCard.id);
        setScreen('HomeDashboardScreen');
    };

    const handleSwap = () => {
        setScreen('CardSwapScreen');
    };

    return (
        <div className="flex flex-col h-screen bg-black text-white p-6">
            {/* Header */}
            <div className="flex items-center mb-8">
                <button onClick={() => setScreen('HomeDashboardScreen')} className="text-gray-400 hover:text-white">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="ml-4 text-xl font-bold tracking-wider">CARD DETAILS</h1>
            </div>

            {/* Card Display */}
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className={`w-full max-w-md bg-gray-900 border-2 ${activeCard.type === CardType.HABIT ? 'border-blue-500' : 'border-red-500'} rounded-xl p-6 shadow-[0_0_20px_rgba(255,0,0,0.2)]`}>
                    <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded text-xs font-bold ${activeCard.type === CardType.HABIT ? 'bg-blue-900 text-blue-200' : 'bg-red-900 text-red-200'}`}>
                            {activeCard.type}
                        </span>
                        <div className="flex items-center text-yellow-500">
                            <Shield size={16} className="mr-1" />
                            <span className="font-bold">{activeCard.xpReward} XP</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-2">{activeCard.title}</h2>
                    <p className="text-gray-400 mb-6">{activeCard.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-800 p-3 rounded flex items-center justify-center flex-col">
                            <Clock size={20} className="text-gray-400 mb-1" />
                            <span className="text-sm text-gray-300">{activeCard.durationMinutes} min</span>
                        </div>
                        <div className="bg-gray-800 p-3 rounded flex items-center justify-center flex-col">
                            <Zap size={20} className="text-yellow-400 mb-1" />
                            <span className="text-sm text-gray-300">{activeCard.energyCost} Energy</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-auto space-y-4 max-w-md mx-auto w-full">
                <button
                    onClick={handleStart}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg flex items-center justify-center transition-all"
                >
                    <Play size={20} className="mr-2" />
                    START MISSION
                </button>

                {isWarriorMode && (
                    <button
                        onClick={handleSwap}
                        className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-lg flex items-center justify-center transition-all border border-gray-700"
                    >
                        <RefreshCw size={20} className="mr-2" />
                        SWAP CARD (WARRIOR ONLY)
                    </button>
                )}
            </div>
        </div>
    );
};
