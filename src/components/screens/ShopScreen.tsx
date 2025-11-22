import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { ArrowLeft, ShoppingBag, Zap, Shield, Gem, Coins, Crown } from 'lucide-react';
import { JuicyButton } from '../ui/JuicyButton';
import { soundEngine } from '../../engines/SoundEngine';

export const ShopScreen: React.FC = () => {
    const { user, setScreen, spendGold, spendGems } = useGameStore();

    const handleBuyItem = (cost: number, currency: 'GOLD' | 'GEMS', itemName: string) => {
        if (currency === 'GOLD') {
            if ((user?.gold || 0) >= cost) {
                spendGold(cost);
                soundEngine.play('VICTORY'); // Cha-ching!
                alert(`Purchased ${itemName}!`);
            } else {
                soundEngine.play('ERROR');
                alert("Not enough Gold!");
            }
        } else {
            if ((user?.gems || 0) >= cost) {
                spendGems(cost);
                soundEngine.play('VICTORY');
                alert(`Purchased ${itemName}!`);
            } else {
                soundEngine.play('ERROR');
                alert("Not enough Gems!");
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <JuicyButton
                        onClick={() => setScreen('HomeDashboardScreen')}
                        variant="ghost"
                        className="!p-2"
                        sound="CLICK"
                    >
                        <ArrowLeft size={24} />
                    </JuicyButton>
                    <h1 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2">
                        <ShoppingBag className="text-yellow-500" />
                        Shop
                    </h1>
                </div>

                {/* Balance */}
                <div className="flex gap-3">
                    <div className="flex items-center gap-1 bg-gray-900 px-3 py-1 rounded-full border border-yellow-900/50">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        <span className="font-mono font-bold text-yellow-500">{user?.gold || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-900 px-3 py-1 rounded-full border border-purple-900/50">
                        <Gem className="w-4 h-4 text-purple-500" />
                        <span className="font-mono font-bold text-purple-500">{user?.gems || 0}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Daily Deals */}
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Daily Deals</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col items-center gap-3 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">-50%</div>
                            <Zap className="w-12 h-12 text-blue-500" />
                            <div className="text-center">
                                <h3 className="font-bold">Energy Refill</h3>
                                <p className="text-xs text-gray-500">Restore 50 HP</p>
                            </div>
                            <JuicyButton
                                onClick={() => handleBuyItem(100, 'GOLD', 'Energy Refill')}
                                variant="secondary"
                                className="w-full mt-2 !py-1 !text-sm"
                                sound="CLICK"
                            >
                                <div className="flex items-center gap-1">
                                    <Coins className="w-3 h-3" /> 100
                                </div>
                            </JuicyButton>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col items-center gap-3 relative overflow-hidden">
                            <Shield className="w-12 h-12 text-green-500" />
                            <div className="text-center">
                                <h3 className="font-bold">Streak Freeze</h3>
                                <p className="text-xs text-gray-500">Protect 1 day</p>
                            </div>
                            <JuicyButton
                                onClick={() => handleBuyItem(50, 'GEMS', 'Streak Freeze')}
                                variant="secondary"
                                className="w-full mt-2 !py-1 !text-sm"
                                sound="CLICK"
                            >
                                <div className="flex items-center gap-1">
                                    <Gem className="w-3 h-3" /> 50
                                </div>
                            </JuicyButton>
                        </div>
                    </div>
                </section>

                {/* Skins / Cosmetics */}
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Cosmetics</h2>
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-purple-900/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                                <Crown className="w-8 h-8 text-purple-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Golden Beast</h3>
                                <p className="text-xs text-gray-500">Legendary Skin</p>
                            </div>
                        </div>
                        <JuicyButton
                            onClick={() => handleBuyItem(1000, 'GEMS', 'Golden Beast Skin')}
                            variant="primary"
                            sound="CLICK"
                        >
                            <div className="flex items-center gap-1">
                                <Gem className="w-4 h-4" /> 1000
                            </div>
                        </JuicyButton>
                    </div>
                </section>

                {/* Gem Store (Real Money) */}
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Gem Store</h2>
                    <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-xl p-6 flex flex-col items-center text-center gap-4">
                        <Gem className="w-16 h-16 text-purple-400 animate-pulse" />
                        <div>
                            <h3 className="text-xl font-black uppercase">Handful of Gems</h3>
                            <p className="text-sm text-gray-300">Get 500 Gems to speed up progress.</p>
                        </div>
                        <JuicyButton
                            onClick={() => alert("Wompi Integration Coming Soon!")}
                            variant="primary"
                            className="w-full"
                            sound="CLICK"
                        >
                            $4.99 USD
                        </JuicyButton>
                    </div>
                </section>
            </div>
        </div>
    );
};
