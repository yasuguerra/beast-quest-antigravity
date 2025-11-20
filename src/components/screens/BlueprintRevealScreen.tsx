import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { Check, ArrowRight, Shield, Zap, Crown } from 'lucide-react';

export const BlueprintRevealScreen: React.FC = () => {
    const { generatedBlueprint, setScreen } = useGameStore();
    const [visiblePhase, setVisiblePhase] = useState(0);

    useEffect(() => {
        if (!generatedBlueprint) {
            setScreen('PersonaProfileScreen');
            return;
        }

        // Animate phases appearing one by one
        const timer1 = setTimeout(() => setVisiblePhase(1), 1000);
        const timer2 = setTimeout(() => setVisiblePhase(2), 2500);
        const timer3 = setTimeout(() => setVisiblePhase(3), 4000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [generatedBlueprint]);

    if (!generatedBlueprint) return null;

    return (
        <div className="min-h-screen bg-black text-white p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto space-y-8 pb-20">

                {/* Header */}
                <div className="text-center space-y-2 animate-in fade-in slide-in-from-top-10 duration-700">
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 uppercase tracking-tighter">
                        Your 90-Day Blueprint
                    </h1>
                    <p className="text-gray-400 text-sm uppercase tracking-widest">
                        AI Generated Protocol
                    </p>
                </div>

                {/* Mission Statement */}
                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm animate-in fade-in duration-1000 delay-500">
                    <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-2">Core Mission</h3>
                    <p className="text-xl font-medium text-white leading-relaxed italic">
                        "{generatedBlueprint.missionStatement}"
                    </p>
                </div>

                {/* Phases Timeline */}
                <div className="space-y-6 relative">
                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-800" />

                    {generatedBlueprint.phases.map((phase, index) => (
                        <div
                            key={index}
                            className={`relative pl-12 transition-all duration-700 transform
                ${visiblePhase > index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                        >
                            <div className={`absolute left-0 top-0 w-8 h-8 rounded-full border-4 border-black flex items-center justify-center z-10
                ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-purple-500' : 'bg-red-500'}`}>
                                {index === 0 && <Shield className="w-4 h-4 text-white" />}
                                {index === 1 && <Zap className="w-4 h-4 text-white" />}
                                {index === 2 && <Crown className="w-4 h-4 text-white" />}
                            </div>

                            <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl hover:border-gray-600 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-lg text-white">{phase.phaseName}</h4>
                                    <span className="text-xs font-mono text-gray-500 bg-gray-800 px-2 py-1 rounded">
                                        {phase.duration}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <p><span className="text-gray-500 uppercase text-xs font-bold">Focus:</span> {phase.focus}</p>
                                    <p><span className="text-gray-500 uppercase text-xs font-bold">Key Habit:</span> {phase.keyHabit}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Daily Ritual */}
                <div className={`bg-gradient-to-r from-red-900/20 to-black border border-red-900/50 p-6 rounded-2xl text-center transition-all duration-1000 delay-[4500ms]
           ${visiblePhase >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    <h3 className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2">Your Mandatory Daily Ritual</h3>
                    <p className="text-2xl font-black text-white">{generatedBlueprint.dailyRitual}</p>
                </div>

                {/* CTA */}
                <div className={`fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black to-transparent transition-all duration-500 delay-[5000ms]
           ${visiblePhase >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    <button
                        onClick={() => setScreen('ModeSelectScreen')}
                        className="w-full max-w-md mx-auto py-4 bg-white text-black font-black text-lg uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-transform hover:scale-105 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                    >
                        Accept Mission <ArrowRight className="w-6 h-6" />
                    </button>
                </div>

            </div>
        </div>
    );
};
