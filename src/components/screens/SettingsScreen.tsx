import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ArrowLeft, Bell, Volume2, Smartphone, LogOut, Trash2, Shield, Info } from 'lucide-react';
import { soundEngine } from '../../engines/SoundEngine';
import { hapticEngine, HAPTIC_PATTERNS } from '../../engines/HapticEngine';
import { JuicyButton } from '../ui/JuicyButton';

export const SettingsScreen: React.FC = () => {
    const { user, setScreen, setUser } = useGameStore();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    // Initialize to true for now (engines don't expose getters yet)
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [hapticsEnabled, setHapticsEnabled] = useState(true);

    // Sync state on mount (in case engines changed elsewhere)
    useEffect(() => {
        // In a real app, we'd read from localStorage here
    }, []);

    const toggleSound = () => {
        const newState = !soundEnabled;
        setSoundEnabled(newState);
        soundEngine.setMuted(!newState);
        if (newState) {
            soundEngine.play('CLICK');
        }
    };

    const toggleHaptics = () => {
        const newState = !hapticsEnabled;
        setHapticsEnabled(newState);
        hapticEngine.setEnabled(newState);
        if (newState) hapticEngine.vibrate(HAPTIC_PATTERNS.CLICK);
    };

    const handleLogout = () => {
        // In a real app, sign out from Firebase here
        setUser(null);
        setScreen('WelcomeScreen');
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure? This action is irreversible and you will lose all progress.")) {
            // In a real app, delete user from Firebase here
            setUser(null);
            setScreen('WelcomeScreen');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            {/* Header */}
            <div className="flex items-center mb-8 gap-4">
                <JuicyButton
                    onClick={() => setScreen('HomeDashboardScreen')}
                    variant="ghost"
                    className="!p-2"
                    sound="CLICK"
                >
                    <ArrowLeft size={24} />
                </JuicyButton>
                <h1 className="text-xl font-bold tracking-wider uppercase">Settings</h1>
            </div>

            <div className="max-w-md mx-auto space-y-8">

                {/* Account Section */}
                <section>
                    <h2 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Account</h2>
                    <div className="bg-gray-900 rounded-xl p-4 flex items-center gap-4 border border-gray-800">
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                            <Shield className="text-gray-400" size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-white">{user?.displayName || 'Guest User'}</p>
                            <p className="text-xs text-gray-500">{user?.email || 'No email linked'}</p>
                        </div>
                    </div>
                </section>

                {/* Preferences Section */}
                <section>
                    <h2 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Preferences</h2>
                    <div className="bg-gray-900 rounded-xl border border-gray-800 divide-y divide-gray-800">

                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bell size={20} className="text-gray-400" />
                                <span>Notifications</span>
                            </div>
                            <button
                                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${notificationsEnabled ? 'bg-green-500' : 'bg-gray-700'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Volume2 size={20} className="text-gray-400" />
                                <span>Sound Effects</span>
                            </div>
                            <button
                                onClick={toggleSound}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${soundEnabled ? 'bg-green-500' : 'bg-gray-700'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Smartphone size={20} className="text-gray-400" />
                                <span>Haptics</span>
                            </div>
                            <button
                                onClick={toggleHaptics}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${hapticsEnabled ? 'bg-green-500' : 'bg-gray-700'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${hapticsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>

                    </div>
                </section>

                {/* About Section */}
                <section>
                    <h2 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">About</h2>
                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 flex items-center gap-3">
                        <Info size={20} className="text-gray-400" />
                        <div>
                            <p className="text-sm font-bold">Beast Quest</p>
                            <p className="text-xs text-gray-500">Version 0.1.0 (Alpha)</p>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="pt-4 space-y-3">
                    <button
                        onClick={handleLogout}
                        className="w-full p-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl flex items-center justify-center gap-2 transition-colors border border-gray-800"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>

                    <button
                        onClick={handleDeleteAccount}
                        className="w-full p-4 bg-red-900/20 hover:bg-red-900/40 text-red-500 rounded-xl flex items-center justify-center gap-2 transition-colors border border-red-900/30"
                    >
                        <Trash2 size={20} />
                        Delete Account
                    </button>
                </section>

            </div>
        </div>
    );
};
