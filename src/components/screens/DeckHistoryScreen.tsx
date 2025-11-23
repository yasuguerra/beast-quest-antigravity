import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ArrowLeft, Calendar, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { JuicyButton } from '../ui/JuicyButton';

export const DeckHistoryScreen: React.FC = () => {
    const { setScreen } = useGameStore();

    // Mock Data for MVP
    const history = [
        { date: 'Today', completed: 4, total: 6, xp: 120, status: 'ACTIVE' },
        { date: 'Yesterday', completed: 6, total: 6, xp: 250, status: 'PERFECT' },
        { date: 'Nov 20', completed: 3, total: 6, xp: 80, status: 'FAILED' },
        { date: 'Nov 19', completed: 5, total: 6, xp: 180, status: 'GOOD' },
        { date: 'Nov 18', completed: 6, total: 6, xp: 250, status: 'PERFECT' },
    ];

    return (
        <div className="min-h-screen bg-black text-white p-6">
            {/* Header */}
            <div className="flex items-center mb-8 gap-4">
                <JuicyButton
                    onClick={() => setScreen('ProfileScreen')}
                    variant="ghost"
                    className="!p-2"
                    sound="CLICK"
                >
                    <ArrowLeft size={24} />
                </JuicyButton>
                <h1 className="text-xl font-bold tracking-wider uppercase">Deck History</h1>
            </div>

            <div className="max-w-md mx-auto space-y-4">

                {/* Stats Summary */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-gray-900 rounded-xl p-3 border border-gray-800 text-center">
                        <span className="text-xs text-gray-500 uppercase block mb-1">Perfect</span>
                        <span className="text-xl font-bold text-yellow-500">12</span>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-3 border border-gray-800 text-center">
                        <span className="text-xs text-gray-500 uppercase block mb-1">Total XP</span>
                        <span className="text-xl font-bold text-blue-500">4.2k</span>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-3 border border-gray-800 text-center">
                        <span className="text-xs text-gray-500 uppercase block mb-1">Avg</span>
                        <span className="text-xl font-bold text-green-500">85%</span>
                    </div>
                </div>

                {/* History List */}
                <div className="space-y-3">
                    {history.map((day, i) => (
                        <div key={i} className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex items-center justify-between hover:bg-gray-800 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 
                                    ${day.status === 'PERFECT' ? 'border-yellow-500 bg-yellow-900/20' :
                                        day.status === 'FAILED' ? 'border-red-500 bg-red-900/20' : 'border-blue-500 bg-blue-900/20'}`}>
                                    {day.status === 'PERFECT' ? <CheckCircle size={20} className="text-yellow-500" /> :
                                        day.status === 'FAILED' ? <XCircle size={20} className="text-red-500" /> :
                                            <Calendar size={20} className="text-blue-500" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{day.date}</h3>
                                    <p className="text-xs text-gray-500">{day.completed}/{day.total} Cards • {day.xp} XP</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-gray-600" />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};
