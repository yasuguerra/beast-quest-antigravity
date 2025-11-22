import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { ARENAS, getArenaByTrophies, getNextArena } from '../../constants/arenas';
import { ArenaId, MiniLeague } from '../../types';
import { Trophy, Lock, CheckCircle, Flame, Star, Crown } from 'lucide-react';
import { BackButton } from '../ui/BackButton';

export const ArenaOverviewScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useGameStore();

    if (!user) return null;

    const currentArena = ARENAS[user.currentArena];
    const nextArena = getNextArena(user.currentArena);
    const allArenas = Object.values(ARENAS);

    const getArenaIcon = (arenaId: ArenaId) => {
        switch (arenaId) {
            case ArenaId.DESPERTAR: return <Star className="w-6 h-6" />;
            case ArenaId.DISCIPLINA: return <CheckCircle className="w-6 h-6" />;
            case ArenaId.FOCO_ENERGIA: return <Flame className="w-6 h-6" />;
            case ArenaId.PODER_PERSONAL: return <Trophy className="w-6 h-6" />;
            case ArenaId.EJECUCION: return <Star className="w-6 h-6" />;
            case ArenaId.PRESENCIA: return <Crown className="w-6 h-6" />;
            case ArenaId.MONSTRUO: return <Flame className="w-6 h-6" />;
            case ArenaId.LEYENDA: return <Crown className="w-6 h-6 text-yellow-500" />;
            default: return <Star className="w-6 h-6" />;
        }
    };

    const getMiniLeagueColor = (league: MiniLeague) => {
        switch (league) {
            case MiniLeague.BRONZE: return 'bg-amber-700';
            case MiniLeague.SILVER: return 'bg-gray-400';
            case MiniLeague.GOLD: return 'bg-yellow-500';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pb-24">
            <BackButton to="/dashboard" />

            {/* Header */}
            <div className="p-6 bg-gradient-to-b from-red-950/50 to-black border-b border-red-900/30">
                <h1 className="text-3xl font-bold mb-2">Arena Progression</h1>
                <p className="text-gray-400">The Path of the Monstruo</p>
            </div>

            {/* Current Arena Card */}
            <div className="p-6">
                <div className="bg-gradient-to-br from-red-900/40 to-black border-2 border-red-500 rounded-2xl p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <span className="text-xs uppercase text-gray-400 tracking-widest">Current Arena</span>
                            <h2 className="text-2xl font-bold text-red-500 mt-1">{currentArena.name}</h2>
                            <p className="text-sm text-gray-400 mt-2">{currentArena.description}</p>
                        </div>
                        <div className="text-red-500">
                            {getArenaIcon(currentArena.id)}
                        </div>
                    </div>

                    {/* Mini League */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs text-gray-500">Mini-League:</span>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${getMiniLeagueColor(user.currentMiniLeague)}`}>
                            {user.currentMiniLeague}
                        </div>
                    </div>

                    {/* Trophy Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Trophies</span>
                            <span className="font-mono font-bold text-yellow-500">{user.trophies} / {currentArena.trophyMax}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden relative">
                            <div
                                className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-500"
                                style={{
                                    width: `${Math.min(100, ((user.trophies - currentArena.trophyMin) / (currentArena.trophyMax - currentArena.trophyMin)) * 100)}%`
                                }}
                            />
                        </div>

                        {/* Life Engine Promotion Check */}
                        {nextArena && (
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-gray-500">
                                    {Math.max(0, currentArena.trophyMax - user.trophies + 1)} trophies to {nextArena.name}
                                </p>
                                {user.trophies > currentArena.trophyMax && (
                                    <span className="text-xs font-bold text-green-400 animate-pulse">
                                        PROMOTION READY!
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Rewards */}
                    <div className="mt-4 pt-4 border-t border-gray-800">
                        <span className="text-xs uppercase text-gray-400 tracking-widest block mb-2">Arena Rewards</span>
                        <div className="grid grid-cols-2 gap-2">
                            {currentArena.rewards.map((reward, idx) => (
                                <div key={idx} className="bg-black/50 p-2 rounded-lg text-xs">
                                    <span className="text-gray-500">{reward.type}:</span>
                                    <span className="text-white ml-1">{reward.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Arena Map */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold mb-4">All Arenas</h3>

                    {allArenas.map((arena, index) => {
                        const isUnlocked = user.trophies >= arena.unlocksAt;
                        const isPassed = user.arenaHistory.includes(arena.id);
                        const isCurrent = arena.id === user.currentArena;

                        return (
                            <div
                                key={arena.id}
                                className={`relative p-4 rounded-xl border-2 transition-all ${isCurrent
                                    ? 'bg-red-900/20 border-red-500'
                                    : isUnlocked || isPassed
                                        ? 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                                        : 'bg-gray-950/30 border-gray-900 opacity-50'
                                    }`}
                            >
                                {/* Arena Number Badge */}
                                <div className="absolute -left-3 -top-3 w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                </div>

                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-lg">{arena.name}</h4>
                                            {isPassed && <CheckCircle className="w-4 h-4 text-green-500" />}
                                            {!isUnlocked && <Lock className="w-4 h-4 text-gray-600" />}
                                        </div>
                                        <p className="text-sm text-gray-400 mb-2">{arena.description}</p>
                                        <div className="flex items-center gap-4 text-xs">
                                            <span className="text-gray-500">
                                                <Trophy className="w-3 h-3 inline mr-1" />
                                                {arena.trophyMin} - {arena.trophyMax}
                                            </span>
                                            {arena.bossName && (
                                                <span className="text-red-400">
                                                    Boss: {arena.bossName}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`${isUnlocked || isPassed ? 'text-yellow-500' : 'text-gray-700'}`}>
                                        {getArenaIcon(arena.id)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
