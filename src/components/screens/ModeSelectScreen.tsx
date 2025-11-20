import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { UserMode } from '../../types';
import { Shield, Flame, AlertTriangle, CheckCircle } from 'lucide-react';

export const ModeSelectScreen: React.FC = () => {
    const navigate = useNavigate();
    const { setUserMode, generateDeck } = useGameStore();
    const [selectedMode, setSelectedMode] = useState<UserMode | null>(null);

    const handleConfirm = async () => {
        if (selectedMode) {
            setUserMode(selectedMode);
            // Generate the first daily deck immediately
            await generateDeck();
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black uppercase tracking-tighter">Elige tu Dificultad</h2>
                    <p className="text-gray-400">¿Cómo quieres jugar el juego de tu vida?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Warrior Mode */}
                    <button
                        onClick={() => setSelectedMode(UserMode.WARRIOR)}
                        className={`relative p-8 rounded-2xl border-2 text-left transition-all duration-300 group overflow-hidden
              ${selectedMode === UserMode.WARRIOR
                                ? 'border-blue-500 bg-blue-900/20 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-105'
                                : 'border-gray-800 bg-gray-900/50 hover:border-gray-600'}`}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Shield className="w-32 h-32" />
                        </div>

                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                                    <Shield className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">Modo Guerrero</h3>
                            </div>

                            <div className="space-y-2 text-gray-400 text-sm">
                                <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Ritmo sostenible</p>
                                <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Castigos moderados</p>
                                <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Enfoque en consistencia</p>
                            </div>

                            <p className="text-xs text-gray-500 mt-4 italic">
                                "Para quienes buscan progreso constante sin quemarse."
                            </p>
                        </div>
                    </button>

                    {/* Beast Mode */}
                    <button
                        onClick={() => setSelectedMode(UserMode.BEAST)}
                        className={`relative p-8 rounded-2xl border-2 text-left transition-all duration-300 group overflow-hidden
              ${selectedMode === UserMode.BEAST
                                ? 'border-red-600 bg-red-900/20 shadow-[0_0_30px_rgba(220,38,38,0.4)] scale-105'
                                : 'border-gray-800 bg-gray-900/50 hover:border-red-900/50'}`}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Flame className="w-32 h-32" />
                        </div>

                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-red-600/20 rounded-lg text-red-500">
                                    <Flame className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-red-500">MODO BESTIA</h3>
                            </div>

                            <div className="space-y-2 text-gray-400 text-sm">
                                <p className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500" /> Ritmo brutal</p>
                                <p className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500" /> Castigos severos (HP)</p>
                                <p className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500" /> Enfoque en resultados extremos</p>
                            </div>

                            <p className="text-xs text-red-400/60 mt-4 italic font-bold">
                                "ADVERTENCIA: Solo para quienes están dispuestos a sufrir por su meta."
                            </p>
                        </div>
                    </button>
                </div>

                <div className="pt-8 flex justify-center">
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedMode}
                        className={`px-12 py-4 font-black text-lg uppercase tracking-widest rounded-full transition-all
              ${selectedMode
                                ? 'bg-white text-black hover:scale-110 shadow-xl'
                                : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
                    >
                        Confirmar Destino
                    </button>
                </div>
            </div>
        </div>
    );
};
