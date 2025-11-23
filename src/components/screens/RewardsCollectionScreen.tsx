import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ArrowLeft, Grid, Box, Award, Lock } from 'lucide-react';
import { JuicyButton } from '../ui/JuicyButton';
import { CardRarity } from '../../types';

export const RewardsCollectionScreen: React.FC = () => {
    const { setScreen, inventory } = useGameStore();
    const [activeTab, setActiveTab] = useState<'ALL' | 'AVATARS' | 'SKINS' | 'BADGES'>('ALL');

    // Mock Data for MVP (merged with actual inventory if present)
    const mockItems = [
        { id: 'a1', type: 'AVATAR', name: 'Warrior Initiate', rarity: 'COMMON', unlocked: true, image: '🛡️' },
        { id: 'a2', type: 'AVATAR', name: 'Beast Awakened', rarity: 'RARE', unlocked: false, image: '🦁' },
        { id: 's1', type: 'SKIN', name: 'Midnight Blue', rarity: 'COMMON', unlocked: true, image: '🎨' },
        { id: 's2', type: 'SKIN', name: 'Neon Fury', rarity: 'EPIC', unlocked: false, image: '⚡' },
        { id: 'b1', type: 'BADGE', name: 'First Blood', rarity: 'COMMON', unlocked: true, image: '🩸' },
        { id: 'b2', type: 'BADGE', name: 'Week 1 Survivor', rarity: 'RARE', unlocked: true, image: '📅' },
    ];

    const filteredItems = activeTab === 'ALL'
        ? mockItems
        : mockItems.filter(i => i.type === activeTab.slice(0, -1)); // Remove 'S' from tab name

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'COMMON': return 'border-gray-600 text-gray-400';
            case 'RARE': return 'border-blue-500 text-blue-400';
            case 'EPIC': return 'border-purple-500 text-purple-400';
            case 'LEGENDARY': return 'border-yellow-500 text-yellow-400';
            default: return 'border-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            {/* Header */}
            <div className="flex items-center mb-6 gap-4">
                <JuicyButton
                    onClick={() => setScreen('ProfileScreen')}
                    variant="ghost"
                    className="!p-2"
                    sound="CLICK"
                >
                    <ArrowLeft size={24} />
                </JuicyButton>
                <h1 className="text-xl font-bold tracking-wider uppercase">Collection</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
                {['ALL', 'AVATARS', 'SKINS', 'BADGES'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap
                            ${activeTab === tab ? 'bg-white text-black' : 'bg-gray-900 text-gray-500 hover:bg-gray-800'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                    <div
                        key={item.id}
                        className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 relative overflow-hidden group
                            ${item.unlocked ? 'bg-gray-900 ' + getRarityColor(item.rarity) : 'bg-gray-950 border-gray-800 opacity-50'}`}
                    >
                        {!item.unlocked && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                                <Lock size={24} className="text-gray-600" />
                            </div>
                        )}

                        <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                            {item.image}
                        </div>

                        <p className="text-[10px] text-center font-bold uppercase leading-tight truncate w-full">
                            {item.name}
                        </p>
                    </div>
                ))}
            </div>

            {/* Empty State (if needed) */}
            {filteredItems.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <Box size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No items found.</p>
                </div>
            )}

        </div>
    );
};
