import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Archive, Star, Zap, ArrowRight } from 'lucide-react';
import { ChestType } from '../../types';

export const ChestOpenScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { chest } = location.state as { chest: any } || {};
    const [step, setStep] = useState<'CLOSED' | 'OPENING' | 'REVEAL'>('CLOSED');

    useEffect(() => {
        if (!chest) navigate('/dashboard');
    }, [chest, navigate]);

    const handleOpen = () => {
        setStep('OPENING');
        setTimeout(() => {
            setStep('REVEAL');
        }, 2000);
    };

    if (!chest) return null;

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Rays */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className={`w-[200vw] h-[200vw] bg-gradient-conic from-transparent via-yellow-500 to-transparent animate-spin-slow 
          ${step === 'REVEAL' ? 'opacity-100' : 'opacity-0'}`} />
            </div>

            <div className="relative z-10 text-center space-y-8">

                {/* Chest Animation */}
                <div
                    onClick={step === 'CLOSED' ? handleOpen : undefined}
                    className={`transition-all duration-500 transform cursor-pointer
            ${step === 'OPENING' ? 'animate-bounce scale-110' : ''}
            ${step === 'REVEAL' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
          `}
                >
                    <Archive className="w-48 h-48 text-yellow-500 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]" />
                    {step === 'CLOSED' && (
                        <p className="mt-4 text-gray-400 animate-pulse uppercase tracking-widest text-sm">Toca para abrir</p>
                    )}
                </div>

                {/* Rewards Reveal */}
                {step === 'REVEAL' && (
                    <div className="space-y-8 animate-in zoom-in duration-500">
                        <h2 className="text-4xl font-black uppercase tracking-tighter text-yellow-500">
                            ¡Recompensas!
                        </h2>

                        <div className="flex justify-center gap-4">
                            <div className="bg-gray-900 border border-yellow-500/50 p-4 rounded-xl w-32 animate-in slide-in-from-bottom-10 duration-500 delay-100">
                                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Star className="w-6 h-6 text-yellow-500" />
                                </div>
                                <p className="font-bold text-xl">150</p>
                                <p className="text-xs text-gray-500 uppercase">Oro</p>
                            </div>

                            <div className="bg-gray-900 border border-blue-500/50 p-4 rounded-xl w-32 animate-in slide-in-from-bottom-10 duration-500 delay-300">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Zap className="w-6 h-6 text-blue-500" />
                                </div>
                                <p className="font-bold text-xl">5</p>
                                <p className="text-xs text-gray-500 uppercase">Gemas</p>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                        >
                            Recoger <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
