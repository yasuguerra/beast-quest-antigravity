import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ArrowLeft, Repeat, Flame, Calendar, CheckCircle, XCircle, Edit2, Save, Trash2 } from 'lucide-react';
import { JuicyButton } from '../ui/JuicyButton';

export const HabitDetailScreen: React.FC = () => {
    const { setScreen } = useGameStore();
    const [isEditing, setIsEditing] = useState(false);

    // Mock Data for MVP (since we don't have a granular habit store yet)
    const [habit, setHabit] = useState({
        id: 'h1',
        title: 'Morning Power Walk',
        description: 'Get sunlight and movement immediately after waking up.',
        streak: 12,
        bestStreak: 15,
        frequency: 'DAILY',
        difficulty: 'MEDIUM'
    });

    const handleSave = () => {
        setIsEditing(false);
        // In real app, dispatch update action
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            {/* Header */}
            <div className="flex items-center mb-8 gap-4">
                <JuicyButton
                    onClick={() => setScreen('HabitsOverviewScreen')}
                    variant="ghost"
                    className="!p-2"
                    sound="CLICK"
                >
                    <ArrowLeft size={24} />
                </JuicyButton>
                <h1 className="text-xl font-bold tracking-wider uppercase">Habit Details</h1>
            </div>

            <div className="max-w-md mx-auto space-y-6">

                {/* Habit Card */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>

                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center">
                                <Repeat className="text-green-400" size={20} />
                            </div>
                            <div>
                                <span className="text-xs text-green-400 font-bold uppercase tracking-wider">Core Habit</span>
                                <p className="text-xs text-gray-500">{habit.frequency}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            {isEditing ? <XCircle size={20} /> : <Edit2 size={20} />}
                        </button>
                    </div>

                    {isEditing ? (
                        <div className="space-y-4">
                            <input
                                value={habit.title}
                                onChange={(e) => setHabit({ ...habit, title: e.target.value })}
                                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white font-bold focus:border-green-500 focus:outline-none"
                            />
                            <textarea
                                value={habit.description}
                                onChange={(e) => setHabit({ ...habit, description: e.target.value })}
                                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-green-500 focus:outline-none min-h-[80px]"
                            />
                            <JuicyButton
                                onClick={handleSave}
                                variant="primary"
                                className="w-full"
                                sound="CONFIRM"
                            >
                                <Save size={18} className="mr-2" />
                                Save Changes
                            </JuicyButton>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-xl font-bold mb-2 leading-tight">{habit.title}</h2>
                            <p className="text-gray-400 text-sm">{habit.description}</p>
                        </div>
                    )}
                </div>

                {/* Streak Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                        <div className="flex items-center gap-2 mb-2">
                            <Flame size={16} className="text-orange-500" />
                            <span className="text-xs text-gray-500 uppercase">Current Streak</span>
                        </div>
                        <p className="text-2xl font-mono font-bold text-orange-400">{habit.streak} <span className="text-sm text-gray-600">Days</span></p>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                        <div className="flex items-center gap-2 mb-2">
                            <Flame size={16} className="text-yellow-500" />
                            <span className="text-xs text-gray-500 uppercase">Best Streak</span>
                        </div>
                        <p className="text-2xl font-mono font-bold text-yellow-400">{habit.bestStreak} <span className="text-sm text-gray-600">Days</span></p>
                    </div>
                </div>

                {/* History Calendar (Mock) */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">Recent History</h3>
                    <div className="flex justify-between">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <span className="text-xs text-gray-500">{day}</span>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                                    ${i < 5 ? 'border-green-500 bg-green-900/20 text-green-500' : 'border-gray-800 text-gray-600'}`}>
                                    {i < 5 ? <CheckCircle size={14} /> : <span className="text-xs">-</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Danger Zone */}
                <button className="w-full p-4 rounded-xl border border-red-900/30 text-red-500 flex items-center justify-center gap-2 hover:bg-red-900/10 transition-colors">
                    <Trash2 size={18} />
                    Delete Habit
                </button>

            </div>
        </div>
    );
};
