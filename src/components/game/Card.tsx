import React from 'react';
import { Card as CardType, CardRarity, CardType as CardTypeEnum } from '../../types';
import { Sword, Zap, Brain, Trophy, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface CardProps {
    card: CardType;
    onPress?: () => void;
    disabled?: boolean;
}

const RARITY_STYLES = {
    [CardRarity.COMMON]: {
        border: 'border-gray-600',
        bg: 'bg-gray-800',
        text: 'text-gray-400',
        shadow: ''
    },
    [CardRarity.RARE]: {
        border: 'border-blue-500',
        bg: 'bg-blue-900/30',
        text: 'text-blue-400',
        shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]'
    },
    [CardRarity.EPIC]: {
        border: 'border-purple-500',
        bg: 'bg-purple-900/30',
        text: 'text-purple-400',
        shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]'
    },
    [CardRarity.LEGENDARY]: {
        border: 'border-yellow-500',
        bg: 'bg-yellow-900/30',
        text: 'text-yellow-400',
        shadow: 'shadow-[0_0_25px_rgba(234,179,8,0.5)]'
    }
};

export const Card: React.FC<CardProps> = ({ card, onPress, disabled }) => {
    const styles = RARITY_STYLES[card.rarity];
    const { completeCard, failCard } = useGameStore();

    const handleComplete = (e: React.MouseEvent) => {
        e.stopPropagation();
        completeCard(card.id);
    };

    const handleFail = (e: React.MouseEvent) => {
        e.stopPropagation();
        failCard(card.id);
    };

    return (
        <div
            onClick={!disabled ? onPress : undefined}
            className={`relative w-full rounded-xl border-2 p-4 transition-all duration-300 cursor-pointer
        ${styles.border} ${styles.bg} ${styles.shadow}
        ${card.isCompleted ? 'opacity-50 grayscale' : 'hover:scale-[1.02]'}
        ${disabled ? 'cursor-not-allowed opacity-70' : ''}
      `}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border ${styles.border} bg-black/50`}>
                        {card.type === CardTypeEnum.HABIT && <Zap className={`w-4 h-4 ${styles.text}`} />}
                        {card.type === CardTypeEnum.TASK && <Sword className={`w-4 h-4 ${styles.text}`} />}
                        {card.type === CardTypeEnum.RITUAL && <Brain className={`w-4 h-4 ${styles.text}`} />}
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${styles.text}`}>
                        {card.rarity}
                    </span>
                </div>
                <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded text-xs font-mono text-yellow-500">
                    <Trophy className="w-3 h-3" />
                    <span>+{card.trophyReward}</span>
                </div>
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-white mb-1 leading-tight">{card.title}</h3>
            <p className="text-xs text-gray-400 line-clamp-2 mb-4">{card.description}</p>

            {/* Footer Stats */}
            <div className="flex items-center justify-between text-xs text-gray-500 font-mono border-t border-gray-700/50 pt-3">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" /> {card.energyCost} EN
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {card.durationMinutes}m
                    </span>
                </div>

                {/* Actions (Only visible if active and not completed) */}
                {!card.isCompleted && !disabled && (
                    <div className="flex gap-2">
                        <button
                            onClick={handleFail}
                            className="p-1 hover:text-red-500 transition-colors"
                            title="Fail/Skip"
                        >
                            <XCircle className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleComplete}
                            className="p-1 hover:text-green-500 transition-colors"
                            title="Complete"
                        >
                            <CheckCircle className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {card.isCompleted && (
                    <span className="text-green-500 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> DONE
                    </span>
                )}
            </div>
        </div>
    );
};
