import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';

export const WelcomeScreen: React.FC = () => {
    const navigate = useNavigate();
    const { setScreen } = useGameStore();

    const handleStart = () => {
        setScreen('AvatarIdentityScreen');
        navigate('/avatar-selection');
    };

    const handleLogin = () => {
        setScreen('AuthLoginScreen');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900 to-black z-0" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-900/20 rounded-full blur-3xl animate-pulse" />

            <div className="z-10 flex flex-col items-center text-center max-w-md w-full space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600 uppercase drop-shadow-lg">
                        Beast Quest
                    </h1>
                    <p className="text-xl font-medium text-gray-400 tracking-widest uppercase">
                        Rise of the Fucking Monstruo
                    </p>
                </div>

                {/* Hero Text */}
                <div className="py-8 space-y-4">
                    <p className="text-2xl font-light text-gray-200 leading-relaxed">
                        "Aquí empieza tu nueva vida.<br />
                        <span className="font-bold text-white">Eres el dueño de tu destino.</span>"
                    </p>
                </div>

                {/* Actions */}
                <div className="w-full space-y-4">
                    <button
                        onClick={handleStart}
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold text-lg uppercase tracking-wider rounded-lg shadow-lg transform transition-all hover:scale-105 active:scale-95 border border-red-500/30"
                    >
                        Comenzar
                    </button>

                    <div className="flex gap-4">
                        <button
                            onClick={handleLogin}
                            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold uppercase tracking-wide rounded-lg border border-gray-700 transition-all"
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold uppercase tracking-wide rounded-lg border border-gray-700 transition-all"
                        >
                            Crear Cuenta
                        </button>
                    </div>

                    <button className="text-sm text-gray-500 hover:text-gray-400 underline decoration-gray-600 underline-offset-4">
                        QuickStart (Invitado)
                    </button>
                </div>

                {/* Footer */}
                <div className="absolute bottom-8 text-xs text-gray-600 font-mono">
                    PROGRESO: 0%
                </div>
            </div>
        </div>
    );
};
