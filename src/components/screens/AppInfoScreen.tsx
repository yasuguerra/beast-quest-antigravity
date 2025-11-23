import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ArrowLeft, Info, Shield, Heart, Code } from 'lucide-react';
import { JuicyButton } from '../ui/JuicyButton';
import { soundEngine } from '../../engines/SoundEngine';

export const AppInfoScreen: React.FC = () => {
    const { setScreen } = useGameStore();
    const [tapCount, setTapCount] = useState(0);

    const handleVersionTap = () => {
        const newCount = tapCount + 1;
        setTapCount(newCount);

        if (newCount === 5) {
            soundEngine.play('UNLOCK'); // Or a special secret sound
            setScreen('DevToolsScreen');
            setTapCount(0);
        } else if (newCount > 2) {
            // Subtle feedback for being on the right track
            soundEngine.play('CLICK');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-8 gap-4">
                <JuicyButton
                    onClick={() => setScreen('SettingsScreen')}
                    variant="ghost"
                    className="!p-2"
                    sound="CLICK"
                >
                    <ArrowLeft size={24} />
                </JuicyButton>
                <h1 className="text-xl font-bold tracking-wider uppercase">About Beast Quest</h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center space-y-8 max-w-md mx-auto w-full">

                {/* Logo / Icon */}
                <div className="w-24 h-24 bg-gray-900 rounded-2xl flex items-center justify-center border-2 border-gray-800 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    <Shield size={48} className="text-white" />
                </div>

                {/* App Name & Version */}
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black uppercase tracking-widest">Beast Quest</h2>
                    <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Rise of the Monstruo</p>

                    <button
                        onClick={handleVersionTap}
                        className="px-4 py-2 rounded-full bg-gray-900/50 text-gray-600 text-xs font-mono mt-4 hover:text-gray-400 transition-colors"
                    >
                        v1.0.0 (Alpha Build)
                    </button>
                    {tapCount > 0 && tapCount < 5 && (
                        <p className="text-[10px] text-gray-800 mt-1">{5 - tapCount}...</p>
                    )}
                </div>

                {/* Credits */}
                <div className="w-full bg-gray-900/30 rounded-xl p-6 border border-gray-800 space-y-4">
                    <div className="flex items-center gap-3 text-gray-400">
                        <Code size={18} />
                        <span className="text-sm font-bold uppercase">Engineering</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed pl-8">
                        Built with React, TypeScript, and TailwindCSS. Powered by Google Gemini AI.
                    </p>

                    <div className="w-full h-px bg-gray-800"></div>

                    <div className="flex items-center gap-3 text-gray-400">
                        <Heart size={18} className="text-red-900" />
                        <span className="text-sm font-bold uppercase">Mission</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed pl-8">
                        Designed to transform intent into action through gamification and psychological frameworks.
                    </p>
                </div>

                {/* Legal Links (Mock) */}
                <div className="flex gap-4 text-xs text-gray-600 underline">
                    <button>Privacy Policy</button>
                    <button>Terms of Service</button>
                </div>

            </div>

            <div className="text-center py-4">
                <p className="text-[10px] text-gray-700 uppercase tracking-widest">
                    © 2025 Beast Quest Inc.
                </p>
            </div>
        </div>
    );
};
