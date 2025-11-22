import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Sword, Heart, Clock, Shield, Skull } from 'lucide-react';
import { JuicyButton } from '../ui/JuicyButton';
import { soundEngine } from '../../engines/SoundEngine';
import { hapticEngine, HAPTIC_PATTERNS } from '../../engines/HapticEngine';

export const BattleOverviewScreen: React.FC = () => {
    const { battle, user, currentDeck, completeCard, failCard, setScreen } = useGameStore();
    const [activeCard, setActiveCard] = useState(currentDeck?.cards.find(c => c.id === battle.activeCardId));
    const prevHpRef = useRef(battle.currentHp);

    useEffect(() => {
        if (!battle.isActive || !currentDeck) {
            setScreen('HomeDashboardScreen');
        }
        setActiveCard(currentDeck?.cards.find(c => c.id === battle.activeCardId));
    }, [battle, currentDeck, setScreen]);

    // Effect: Trigger Shake/Sound on Damage
    useEffect(() => {
        if (battle.currentHp < prevHpRef.current) {
            // Damage taken
            soundEngine.play('DAMAGE');
            hapticEngine.shake('battle-container', 'medium');
            hapticEngine.vibrate(HAPTIC_PATTERNS.DAMAGE);
        }
        prevHpRef.current = battle.currentHp;
    }, [battle.currentHp]);

    if (!activeCard) return null;

    const handleVictory = () => {
        completeCard(activeCard.id);
        setScreen('BattleResultScreen');
    };

    const handleDefeat = () => {
        failCard(activeCard.id);
        setScreen('BattleResultScreen');
    };

    return (
        <div id="battle-container" className="min-h-screen bg-black text-white p-6 flex flex-col relative overflow-hidden">
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
                <JuicyButton
                    onClick={handleDefeat}
                    variant="secondary"
                    sound="CLICK"
                    className="w-full"
                >
                    Surrender
                </JuicyButton>
                <JuicyButton
                    onClick={handleVictory}
                    variant="danger"
                    sound="CLICK"
                    className="w-full"
                >
                    Execute
                </JuicyButton>
            </div>
        </div>
    );
};
