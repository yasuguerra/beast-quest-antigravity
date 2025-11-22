import React from 'react';
import { ShoppingBag, Zap, Shield, Crown, Archive } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { ChestType } from '../../types';
import { updateUserProfile, addToInventory } from '../../services/firebase';

export const ShopHomeScreen: React.FC = () => {
    const { user, addChest, spendGold } = useGameStore();

    if (!user) return null;

    const handleBuyChest = async (type: ChestType, price: number) => {
        if (user.gold < price) {
            alert("Not enough Gold!");
            return;
        }

        // Use store action to deduct gold (handles local + firestore)
        spendGold(price);

        // Add Chest
        const newChest = {
            id: `chest_${Date.now()}`,
            type: type,
            status: 'LOCKED' as const,
            unlockTimeStart: undefined
        };
        addChest(newChest);

        // In a real app, we'd save the chest to Firestore here too
        // For now, let's assume addChest handles local state and we'd need a persistChest helper
        alert(`Purchased ${type} Chest!`);
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Black Market</h2>
                <div className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded-lg border border-gray-800">
                    <span className="font-mono font-bold text-green-400">{user.gold} G</span>
                    <span className="font-mono font-bold text-blue-400 ml-2">{user.gems} 💎</span>
                </div>
            </div>

            {/* Chests */}
            <section className="mb-8">
                <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-4 font-bold">Chests</h3>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {[
                        { type: ChestType.COMMON, price: 100, name: 'Common Crate' },
                        { type: ChestType.RARE, price: 500, name: 'Rare Vault' },
                        { type: ChestType.EPIC, price: 2000, name: 'Epic Hoard' }
                    ].map((chest) => (
                        <div key={chest.type} className="min-w-[160px] bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                                <Archive className={`w-8 h-8 ${chest.type === ChestType.EPIC ? 'text-purple-500' :
                                    chest.type === ChestType.RARE ? 'text-blue-500' : 'text-gray-400'
                                    }`} />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-sm">{chest.name}</p>
                                <p className="text-xs text-gray-500">Contains Cards</p>
                            </div>
                            <button
                                onClick={() => handleBuyChest(chest.type, chest.price)}
                                className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-xs font-bold uppercase transition-colors"
                            >
                                {chest.price} G
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Gem Packs */}
            <section>
                <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-4 font-bold">Gem Bank</h3>
                <div className="space-y-3">
                    {[
                        { amount: 100, price: '$1.99', icon: <Shield className="w-5 h-5 text-blue-400" /> },
                        { amount: 550, price: '$4.99', icon: <Shield className="w-6 h-6 text-blue-500" /> },
                        { amount: 1200, price: '$9.99', icon: <Crown className="w-6 h-6 text-purple-500" /> },
                    ].map((pack, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-900 border border-gray-800 p-4 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                    {pack.icon}
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{pack.amount} Gems</p>
                                    <p className="text-xs text-gray-500">Pack {i === 0 ? 'Basic' : i === 1 ? 'Popular' : 'Beast'}</p>
                                </div>
                            </div>
                            <button className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200">
                                {pack.price}
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
