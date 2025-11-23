import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { ArrowLeft, Trash2, Database, Zap, RefreshCw, AlertTriangle } from 'lucide-react';
import { JuicyButton } from '../ui/JuicyButton';
import { soundEngine } from '../../engines/SoundEngine';

export const DevToolsScreen: React.FC = () => {
    const { setScreen, user, setUser, addGold, addGems, checkWeeklyCycle } = useGameStore();

    const handleResetUser = () => {
        if (confirm("ARE YOU SURE? This will wipe all local progress.")) {
            setUser(null as any); // Force reset
            localStorage.clear();
            soundEngine.play('DEFEAT');
            window.location.reload();
        }
    };

    const handleAddResources = () => {
        addGold(1000);
        addGems(50);
        soundEngine.play('REWARD_TIER_1');
    };

    const handleForceWeekly = () => {
        checkWeeklyCycle();
        soundEngine.play('CONFIRM');
        alert("Weekly cycle check triggered. Check console for logs.");
    };

    return (
        <div className="min-h-screen bg-gray-950 text-green-400 p-6 font-mono">
            {/* Header */}
            <div className="flex items-center mb-8 gap-4 border-b border-green-900 pb-4">
                <JuicyButton
                    onClick={() => setScreen('AppInfoScreen')}
                    variant="ghost"
                    className="!p-2 text-green-400 hover:bg-green-900/20"
                    sound="CLICK"
                >
                    <ArrowLeft size={24} />
                </JuicyButton>
                <h1 className="text-xl font-bold tracking-wider uppercase">DEV TOOLS // GOD MODE</h1>
            </div>

            <div className="space-y-8 max-w-md mx-auto">

                {/* State Inspector */}
                <section className="space-y-2">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-green-600 flex items-center gap-2">
                        <Database size={14} /> Current State
                    </h2>
                    <div className="bg-black border border-green-900/50 p-4 rounded-lg text-xs overflow-x-auto">
                        <pre>{JSON.stringify({
                            uid: user?.uid,
                            mode: user?.mode,
                            level: user?.level,
                            xp: user?.xp,
                            gold: user?.gold,
                            gems: user?.gems,
                            arena: user?.currentArena
                        }, null, 2)}</pre>
                    </div>
                </section>

                {/* Actions */}
                <section className="space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-green-600 flex items-center gap-2">
                        <Zap size={14} /> Actions
                    </h2>

                    <div className="grid grid-cols-1 gap-3">
                        <button
                            onClick={handleAddResources}
                            className="flex items-center justify-between p-4 bg-green-900/10 border border-green-900/30 rounded hover:bg-green-900/20 transition-colors"
                        >
                            <span className="font-bold">+1000 Gold / +50 Gems</span>
                            <Zap size={16} />
                        </button>

                        <button
                            onClick={handleForceWeekly}
                            className="flex items-center justify-between p-4 bg-blue-900/10 border border-blue-900/30 rounded hover:bg-blue-900/20 transition-colors text-blue-400"
                        >
                            <span className="font-bold">Force Weekly Review</span>
                            <RefreshCw size={16} />
                        </button>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="space-y-4 pt-8 border-t border-red-900/30">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-red-600 flex items-center gap-2">
                        <AlertTriangle size={14} /> Danger Zone
                    </h2>

                    <button
                        onClick={handleResetUser}
                        className="w-full flex items-center justify-center gap-2 p-4 bg-red-900/10 border border-red-900/50 rounded hover:bg-red-900/30 transition-colors text-red-500 font-bold"
                    >
                        <Trash2 size={18} />
                        WIPE USER DATA & RESET
                    </button>
                </section>

            </div>
        </div>
    );
};
