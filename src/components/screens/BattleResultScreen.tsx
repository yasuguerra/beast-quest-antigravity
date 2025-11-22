import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, XCircle, ArrowRight } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const BattleResultScreen: React.FC = () => {
    // Remove useNavigate as we use custom router
    // const navigate = useNavigate(); 
    const { lastBattleResult, setScreen } = useGameStore();

    React.useEffect(() => {
        console.log("BattleResultScreen Mounted. Result:", lastBattleResult);
    }, [lastBattleResult]);

    if (!lastBattleResult || !lastBattleResult.card) {
        console.warn("BattleResultScreen: No result found. Redirecting to dashboard.");
        // FIX: Use setScreen instead of navigate
        React.useEffect(() => {
            setScreen('HomeDashboardScreen');
        }, [setScreen]);
        return null;
    }

    const { result, card } = lastBattleResult;
    const isVictory = result === 'VICTORY';

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-white relative overflow-hidden
      ${isVictory ? 'bg-green-900/20' : 'bg-red-900/20'}`}>

            <div className={`absolute inset-0 z-0 ${isVictory ? 'bg-green-900/10' : 'bg-red-900/10'}`} />

            <div className="relative z-10 text-center space-y-6 animate-in zoom-in duration-500">
                {isVictory ? (
                    <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.5)]">
                        <Trophy className="w-16 h-16 text-white" />
                    </div>
                ) : (
                    <div className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(239,68,68,0.5)]">
                        <XCircle className="w-16 h-16 text-white" />
                    </div>
                )}

                <h1 className="text-5xl font-black uppercase tracking-tighter">
                    {isVictory ? 'VICTORY' : 'DEFEAT'}
                </h1>

                <p className="text-xl text-gray-300 font-medium max-w-xs mx-auto">
                    {isVictory
                        ? `You have conquered "${card.title}". Your legend grows.`
                        : `You failed at "${card.title}". The monster laughs.`}
                </p>

                {isVictory && (
                    <div className="flex justify-center gap-4 py-4">
                        <div className="bg-black/50 px-4 py-2 rounded-lg border border-gray-700">
                            <span className="text-xs text-gray-500 uppercase block">XP Gained</span>
                            <span className="text-xl font-bold text-blue-400">+{card.xpReward}</span>
                        </div>
                        <div className="bg-black/50 px-4 py-2 rounded-lg border border-gray-700">
                            <span className="text-xs text-gray-500 uppercase block">Trophies</span>
                            <span className="text-xl font-bold text-yellow-500">+{card.trophyReward}</span>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setScreen('HomeDashboardScreen')}
                    className="mt-8 px-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                >
                    Continue <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
