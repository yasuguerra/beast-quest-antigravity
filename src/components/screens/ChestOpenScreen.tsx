import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Archive, Star, Zap, ArrowRight, Check } from 'lucide-react';
import { ChestType, CardRarity } from '../../types';
import { RewardEngine, RewardResult } from '../../engines/RewardEngine';
import { useGameStore } from '../../store/gameStore';

export const ChestOpenScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { chest } = location.state as { chest: any } || {};
    const { user, setUser } = useGameStore();

    const [step, setStep] = useState<'CLOSED' | 'OPENING' | 'REVEAL'>('CLOSED');
    const [rewards, setRewards] = useState<RewardResult | null>(null);

    useEffect(() => {
        if (!chest || !user) navigate('/dashboard');
    }, [chest, user, navigate]);

    const handleOpen = async () => {
        if (!user || !chest) return;

        setStep('OPENING');

        // Call Engine
        const result = await RewardEngine.openChest(user, chest.type);
        setRewards(result);

        // Update local store immediately for UI responsiveness
        // (Note: Engine already updated Firestore)
        useGameStore.getState().updateResources({
            gold: user.gold + result.gold,
            gems: user.gems + result.gems
        });

        setTimeout(() => {
            setStep('REVEAL');
        }, 2000);
    };

    if (!chest) return null;

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Rays */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className={`w-[200vw] h-[200vw] bg-gradient-conic from-transparent via-yellow-500 to-transparent animate-spin-slow 
          ${step === 'REVEAL' ? 'opacity-100' : 'opacity-0'}`} />
            </div>

            <div className="relative z-10 text-center space-y-8 w-full max-w-md">

                {/* Chest Animation */}
                <div
                    onClick={step === 'CLOSED' ? handleOpen : undefined}
                    className={`transition-all duration-500 transform cursor-pointer mx-auto
            ${step === 'OPENING' ? 'animate-bounce scale-110' : ''}
            ${step === 'REVEAL' ? 'scale-0 opacity-0 h-0' : 'scale-100 opacity-100'}
          `}
                >
                    <Archive className="w-48 h-48 text-yellow-500 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)] mx-auto" />
                    {step === 'CLOSED' && (
                        <p className="mt-4 text-gray-400 animate-pulse uppercase tracking-widest text-sm">Tap to Open</p>
                    )}
                </div>

                {/* Rewards Reveal */}
                {step === 'REVEAL' && rewards && (
                    <div className="space-y-6 animate-in zoom-in duration-500">
                        <h2 className="text-4xl font-black uppercase tracking-tighter text-yellow-500">
                            Rewards!
                        </h2>

                        <div className="flex justify-center gap-4">
                            <div className="bg-gray-900 border border-yellow-500/50 p-4 rounded-xl w-32 animate-in slide-in-from-bottom-10 duration-500 delay-100">
                                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Star className="w-6 h-6 text-yellow-500" />
                                </div>
                                <p className="font-bold text-xl">{rewards.gold}</p>
                                <p className="text-xs text-gray-500 uppercase">Gold</p>
                            </div>

                            <div className="bg-gray-900 border border-blue-500/50 p-4 rounded-xl w-32 animate-in slide-in-from-bottom-10 duration-500 delay-300">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Zap className="w-6 h-6 text-blue-500" />
                                </div>
                                <p className="font-bold text-xl">{rewards.gems}</p>
                                <p className="text-xs text-gray-500 uppercase">Gems</p>
                            </div>
                        </div>

                        {/* Cards Reveal */}
                        <div className="space-y-2">
                            <h3 className="text-sm text-gray-500 uppercase tracking-widest">New Cards</h3>
                            {rewards.cards.map((card, idx) => (
                                <div key={idx} className="bg-gray-800/50 border border-gray-700 p-3 rounded-lg flex items-center gap-3 animate-in slide-in-from-bottom-10 duration-500" style={{ animationDelay: `${500 + (idx * 100)}ms` }}>
                                    <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs
                                        ${card.rarity === CardRarity.EPIC ? 'bg-purple-900 text-purple-300' :
                                            card.rarity === CardRarity.RARE ? 'bg-blue-900 text-blue-300' : 'bg-gray-700 text-gray-300'}`}>
                                        {card.rarity[0]}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm">{card.title}</p>
                                        <p className="text-[10px] text-gray-400">{card.rarity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full px-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
                        >
                            Collect <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
