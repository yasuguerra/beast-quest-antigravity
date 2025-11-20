import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { ChestType } from '../../types';
import { Archive, Lock, Clock, Key } from 'lucide-react';

const CHEST_STYLES = {
    [ChestType.COMMON]: { bg: 'bg-gray-800', border: 'border-gray-600', text: 'text-gray-400' },
    [ChestType.RARE]: { bg: 'bg-blue-900/30', border: 'border-blue-500', text: 'text-blue-400' },
    [ChestType.EPIC]: { bg: 'bg-purple-900/30', border: 'border-purple-500', text: 'text-purple-400' },
    [ChestType.LEGENDARY]: { bg: 'bg-yellow-900/30', border: 'border-yellow-500', text: 'text-yellow-400' },
    [ChestType.BEAST]: { bg: 'bg-red-900/30', border: 'border-red-600', text: 'text-red-500' },
    [ChestType.DIVINE]: { bg: 'bg-white/10', border: 'border-white', text: 'text-white' },
};

export const ChestsOverviewScreen: React.FC = () => {
    const navigate = useNavigate();
    const { chests, unlockChest } = useGameStore();

    // Mock chests if empty for demo
    const displayChests = chests.length > 0 ? chests : [
        { id: 'c1', type: ChestType.COMMON, status: 'READY' },
        { id: 'c2', type: ChestType.RARE, status: 'LOCKED' },
        { id: 'c3', type: ChestType.EPIC, status: 'LOCKED' },
        { id: 'c4', type: ChestType.LEGENDARY, status: 'LOCKED' },
    ];

    const handleChestClick = (chest: any) => {
        if (chest.status === 'READY') {
            navigate('/chest-open', { state: { chest } });
        } else if (chest.status === 'LOCKED') {
            unlockChest(chest.id);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Loot Chamber</h2>
                <div className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded-lg border border-gray-800">
                    <Key className="w-4 h-4 text-yellow-500" />
                    <span className="font-mono font-bold">3</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {displayChests.map((chest: any) => {
                    const styles = CHEST_STYLES[chest.type as ChestType] || CHEST_STYLES[ChestType.COMMON];
                    return (
                        <button
                            key={chest.id}
                            onClick={() => handleChestClick(chest)}
                            className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-3 relative overflow-hidden transition-all
                ${styles.bg} ${styles.border}
                ${chest.status === 'READY' ? 'animate-pulse hover:scale-105' : 'opacity-80'}
              `}
                        >
                            <Archive className={`w-12 h-12 ${styles.text}`} />

                            <div className="text-center">
                                <span className={`text-xs font-bold uppercase ${styles.text}`}>
                                    {chest.type}
                                </span>
                                <div className="mt-1">
                                    {chest.status === 'LOCKED' && <Lock className="w-4 h-4 mx-auto text-gray-500" />}
                                    {chest.status === 'UNLOCKING' && <Clock className="w-4 h-4 mx-auto text-blue-400 animate-spin" />}
                                    {chest.status === 'READY' && <span className="text-xs font-bold bg-yellow-500 text-black px-2 py-0.5 rounded">OPEN</span>}
                                </div>
                            </div>
                        </button>
                    );
                })}

                {/* Empty Slots */}
                {[...Array(4 - displayChests.length)].map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square rounded-2xl border-2 border-gray-800 border-dashed bg-gray-900/20 flex items-center justify-center">
                        <span className="text-gray-700 text-xs uppercase">Empty</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
