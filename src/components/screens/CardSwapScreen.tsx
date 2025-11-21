import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { GeminiService } from '../../services/ai';
import { Card, CardType, CardRarity } from '../../types';
import { ArrowLeft, RefreshCw, Check, Loader } from 'lucide-react';

export const CardSwapScreen: React.FC = () => {
    const { currentDeck, selectedCardId, user, setScreen, swapCard } = useGameStore();
    const [alternatives, setAlternatives] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAltId, setSelectedAltId] = useState<string | null>(null);

    const activeCard = currentDeck?.cards.find(c => c.id === selectedCardId);

    useEffect(() => {
        const fetchAlternatives = async () => {
            if (activeCard && user) {
                setIsLoading(true);
                const alts = await GeminiService.generateCardAlternatives(activeCard, user);
                setAlternatives(alts);
                setIsLoading(false);
            }
        };
        fetchAlternatives();
    }, [activeCard, user]);

    if (!activeCard) return null;

    const handleConfirmSwap = async () => {
        if (selectedAltId) {
            const newCard = alternatives.find(c => c.id === selectedAltId);
            if (newCard) {
                await swapCard(activeCard.id, newCard);
                setScreen('HomeDashboardScreen');
            }
        }
    };

    return (
        <div className="flex flex-col h-screen bg-black text-white p-6">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button onClick={() => setScreen('CardDetailScreen')} className="text-gray-400 hover:text-white">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="ml-4 text-xl font-bold tracking-wider">SWAP MISSION</h1>
            </div>

            <p className="text-gray-400 mb-6">Select an alternative path. This action is only available in Warrior Mode.</p>

            {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader className="animate-spin text-red-500 mb-4" size={48} />
                    <p className="text-gray-400 animate-pulse">Analyzing tactical alternatives...</p>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto space-y-4 pb-20">
                    {alternatives.map((alt) => (
                        <div
                            key={alt.id}
                            onClick={() => setSelectedAltId(alt.id)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedAltId === alt.id ? 'border-red-500 bg-gray-900' : 'border-gray-800 bg-black hover:border-gray-600'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg">{alt.title}</h3>
                                {selectedAltId === alt.id && <Check className="text-red-500" size={20} />}
                            </div>
                            <p className="text-sm text-gray-400 mb-3">{alt.description}</p>
                            <div className="flex space-x-4 text-xs text-gray-500">
                                <span>{alt.durationMinutes} min</span>
                                <span>{alt.energyCost} Energy</span>
                                <span className="uppercase">{alt.type}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="mt-auto pt-4 bg-black">
                <button
                    onClick={handleConfirmSwap}
                    disabled={!selectedAltId || isLoading}
                    className={`w-full py-4 font-bold rounded-lg flex items-center justify-center transition-all ${!selectedAltId || isLoading ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                >
                    <RefreshCw size={20} className="mr-2" />
                    CONFIRM SWAP
                </button>
            </div>
        </div>
    );
};
