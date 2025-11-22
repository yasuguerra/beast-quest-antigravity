import React, { useState } from 'react';
import { Zap, MessageSquare, Mic, Play, Brain, ArrowLeft } from 'lucide-react';
import { GeminiService } from '../../services/ai';
import { useGameStore } from '../../store/gameStore';
import { JuicyButton } from '../ui/JuicyButton';

export const CoachHomeScreen: React.FC = () => {
    const { setScreen } = useGameStore();
    const [dailyMessage, setDailyMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGetMotivation = async () => {
        setLoading(true);
        try {
            const msg = await GeminiService.getCoachMessage("User is feeling low energy", "GROVER");
            setDailyMessage(msg);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <JuicyButton
                        onClick={() => setScreen('HomeDashboardScreen')}
                        variant="ghost"
                        className="!p-2"
                        sound="CLICK"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </JuicyButton>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">AI Coach</h2>
                </div>
                <div className="flex items-center gap-2 bg-red-900/20 px-3 py-1 rounded-lg border border-red-600">
                    <Zap className="w-4 h-4 text-red-500" />
                    <span className="font-mono font-bold text-red-500">LIVE</span>
                </div>
            </div>

            {/* Main Avatar / Visualization */}
            <div className="relative h-64 bg-gray-900 rounded-2xl border border-gray-800 mb-8 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <div className="w-32 h-32 bg-red-600/20 rounded-full blur-3xl animate-pulse absolute" />
                <Brain className="w-24 h-24 text-gray-700 relative z-10" />

                {dailyMessage && (
                    <div className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-md p-4 border-t border-red-500/50 animate-in slide-in-from-bottom-10">
                        <p className="text-lg font-bold italic text-white">"{dailyMessage}"</p>
                    </div>
                )}
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={handleGetMotivation}
                    disabled={loading}
                    className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex flex-col items-center gap-3 hover:bg-gray-800 transition-colors group"
                >
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-white fill-current" />
                    </div>
                    <span className="font-bold uppercase text-sm">Daily Message</span>
                </button>

                <button
                    onClick={() => setScreen('CoachSessionScreen')}
                    className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex flex-col items-center gap-3 hover:bg-gray-800 transition-colors group"
                >
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold uppercase text-sm">Tactical Chat</span>
                </button>

                <button
                    onClick={() => setScreen('MindsetLibraryScreen')}
                    className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex flex-col items-center gap-3 hover:bg-gray-800 transition-colors group"
                >
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold uppercase text-sm">Mindset Library</span>
                </button>

                <button
                    onClick={() => setScreen('StateBoostScreen')}
                    className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex flex-col items-center gap-3 hover:bg-gray-800 transition-colors group"
                >
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold uppercase text-sm">Peak State</span>
                </button>

                <button
                    onClick={() => setScreen('CarismaTrainingScreen')}
                    className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex flex-col items-center gap-3 hover:bg-gray-800 transition-colors group col-span-2"
                >
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mic className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold uppercase text-sm">Charisma Training</span>
                </button>
            </div>
        </div>
    );
};
