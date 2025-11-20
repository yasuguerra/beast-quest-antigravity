import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { DeckDailyScreen } from './DeckDailyScreen';
import { UserMode } from '../../types';
import { Shield, Flame, Trophy, Zap, Menu, Bell } from 'lucide-react';

export const HomeDashboardScreen: React.FC = () => {
    const { user } = useGameStore();

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Top Bar */}
            <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
            ${user.mode === UserMode.BEAST ? 'border-red-600 bg-red-900/20' : 'border-blue-500 bg-blue-900/20'}`}>
                        {user.mode === UserMode.BEAST ? <Flame className="w-5 h-5 text-red-500" /> : <Shield className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div>
                        <h3 className="font-bold text-sm leading-none">{user.displayName}</h3>
                        <span className="text-xs text-gray-500 font-mono">LVL {user.level}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-gray-900 px-2 py-1 rounded-lg border border-gray-800">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs font-bold text-yellow-500">{user.trophies}</span>
                    </div>
                    <button className="relative">
                        <Bell className="w-6 h-6 text-gray-400" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    </button>
                    <button>
                        <Menu className="w-6 h-6 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-4 max-w-2xl mx-auto">

                {/* Resources Bar */}
                <div className="flex justify-between mb-6 bg-gray-900/50 p-3 rounded-xl border border-gray-800">
                    <div className="flex flex-col items-center w-1/3 border-r border-gray-800">
                        <span className="text-xs text-gray-500 uppercase">XP</span>
                        <span className="font-mono font-bold text-blue-400">{user.xp}</span>
                    </div>
                    <div className="flex flex-col items-center w-1/3 border-r border-gray-800">
                        <span className="text-xs text-gray-500 uppercase">Gems</span>
                        <span className="font-mono font-bold text-green-400">{user.gems}</span>
                    </div>
                    <div className="flex flex-col items-center w-1/3">
                        <span className="text-xs text-gray-500 uppercase">Streak</span>
                        <span className="font-mono font-bold text-orange-500 flex items-center gap-1">
                            <Flame className="w-3 h-3" /> {user.streakDays}
                        </span>
                    </div>
                </div>

                {/* Daily Deck */}
                <DeckDailyScreen />

            </div>

            {/* Bottom Navigation (Placeholder) */}
            <div className="fixed bottom-0 w-full bg-black border-t border-gray-800 py-4 px-6 flex justify-between items-center z-50">
                <button className="flex flex-col items-center gap-1 text-red-500">
                    <Shield className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">Arena</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
                    <Zap className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">Coach</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
                    <Trophy className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">Logros</span>
                </button>
            </div>
        </div>
    );
};
