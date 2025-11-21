import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { UserMode, ArchetypeId } from '../../types';
import { Shield, Flame, Trophy, Target, Activity, Settings } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
    const { user } = useGameStore();

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                    <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center
            ${user.mode === UserMode.BEAST ? 'border-red-600 bg-red-900/20' : 'border-blue-500 bg-blue-900/20'}`}>
                        {user.mode === UserMode.BEAST ? <Flame className="w-10 h-10 text-red-500" /> : <Shield className="w-10 h-10 text-blue-500" />}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">{user.displayName}</h2>
                        <p className="text-gray-500 font-mono text-sm">LVL {user.level} • {user.avatarId}</p>
                    </div>
                </div>
                <button onClick={() => useGameStore.getState().setScreen('SettingsScreen')} className="p-2 bg-gray-900 rounded-full hover:bg-gray-800">
                    <Settings className="w-6 h-6 text-gray-400" />
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs text-gray-500 uppercase font-bold">Trofeos</span>
                    </div>
                    <p className="text-2xl font-mono font-bold text-white">{user.trophies}</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-gray-500 uppercase font-bold">Racha</span>
                    </div>
                    <p className="text-2xl font-mono font-bold text-white">{user.streakDays} Días</p>
                </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between text-xs uppercase font-bold text-gray-500 mb-2">
                        <span>XP Nivel {user.level}</span>
                        <span>{user.xp} / 1000</span>
                    </div>
                    <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-500"
                            style={{ width: `${Math.min((user.xp / 1000) * 100, 100)}%` }}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-xs uppercase font-bold text-gray-500 mb-2">
                        <span>Progreso Semanal</span>
                        <span>85%</span>
                    </div>
                    <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[85%]" />
                    </div>
                </div>
            </div>

            {/* Achievements Preview */}
            <div className="mt-8">
                <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-4 font-bold">Logros Recientes</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 p-3 rounded-xl opacity-50">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                            <Target className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-400">Primer Sangre</p>
                            <p className="text-xs text-gray-600">Completa tu primera tarea</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
