import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { UserMode } from '../../types';
import { Shield, Skull, AlertTriangle, ArrowLeft, Check } from 'lucide-react';
import { JuicyButton } from '../ui/JuicyButton';
import { soundEngine } from '../../engines/SoundEngine';

export const ModeChangeConfirmationScreen: React.FC = () => {
    const { user, setUserMode, setScreen } = useGameStore();

    const currentMode = user?.mode || UserMode.WARRIOR;
    const targetMode = currentMode === UserMode.WARRIOR ? UserMode.BEAST : UserMode.WARRIOR;

    const handleConfirm = () => {
        setUserMode(targetMode);
        soundEngine.play(targetMode === UserMode.BEAST ? 'BEAST_ROAR' : 'CONFIRM');
        setScreen('SettingsScreen');
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">

            {/* Background Gradient based on target mode */}
            <div className={`absolute inset-0 bg-gradient-to-br ${targetMode === UserMode.BEAST ? 'from-red-900/40 to-black' : 'from-blue-900/40 to-black'}`}></div>

            <div className="relative z-10 max-w-md w-full space-y-8">

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex justify-center mb-4">
                        {targetMode === UserMode.BEAST ? (
                            <Skull size={64} className="text-red-500 animate-pulse" />
                        ) : (
                            <Shield size={64} className="text-blue-500" />
                        )}
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-widest">
                        {targetMode === UserMode.BEAST ? "ENTER BEAST MODE?" : "RETURN TO WARRIOR?"}
                    </h1>
                    <p className="text-gray-400">
                        {targetMode === UserMode.BEAST
                            ? "High stakes. High rewards. Failure has consequences."
                            : "Standard progression. Safe. Steady."}
                    </p>
                </div>

                {/* Comparison Card */}
                <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">XP Multiplier</span>
                        <div className="flex items-center gap-4">
                            <span className={currentMode === UserMode.WARRIOR ? "text-white font-bold" : "text-gray-600"}>1.0x</span>
                            <ArrowLeft size={16} className="rotate-180 text-gray-600" />
                            <span className={targetMode === UserMode.BEAST ? "text-red-400 font-bold" : "text-blue-400 font-bold"}>
                                {targetMode === UserMode.BEAST ? "2.0x" : "1.0x"}
                            </span>
                        </div>
                    </div>
                    <div className="w-full h-px bg-gray-800"></div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Failure Penalty</span>
                        <div className="flex items-center gap-4">
                            <span className={currentMode === UserMode.WARRIOR ? "text-white font-bold" : "text-gray-600"}>None</span>
                            <ArrowLeft size={16} className="rotate-180 text-gray-600" />
                            <span className={targetMode === UserMode.BEAST ? "text-red-400 font-bold" : "text-blue-400 font-bold"}>
                                {targetMode === UserMode.BEAST ? "-20 HP" : "None"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Warning for Beast Mode */}
                {targetMode === UserMode.BEAST && (
                    <div className="flex gap-3 p-4 bg-red-900/20 border border-red-900/50 rounded-lg">
                        <AlertTriangle className="text-red-500 shrink-0" size={24} />
                        <p className="text-xs text-red-300">
                            Warning: In Beast Mode, incomplete daily cards will damage your HP and freeze your streak. Are you ready?
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="space-y-3 pt-4">
                    <JuicyButton
                        onClick={handleConfirm}
                        variant={targetMode === UserMode.BEAST ? "beast" : "primary"}
                        className="w-full"
                        sound="CONFIRM"
                    >
                        <Check size={20} className="mr-2" />
                        Confirm Switch
                    </JuicyButton>

                    <button
                        onClick={() => setScreen('SettingsScreen')}
                        className="w-full p-4 text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
                    >
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    );
};
