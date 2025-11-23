import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ArrowLeft, Target, Calendar, CheckCircle, XCircle, Edit2, Save } from 'lucide-react';
import { JuicyButton } from '../ui/JuicyButton';
import { Goal } from '../../types';

export const GoalDetailScreen: React.FC = () => {
    const { user, setScreen, setPrimaryGoal } = useGameStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editedGoal, setEditedGoal] = useState(user?.onboardingData?.primaryGoal || "");

    // In a real app, we'd fetch the specific goal by ID. 
    // For MVP, we are editing the "Primary Goal" from onboarding.

    const handleSave = () => {
        setPrimaryGoal(editedGoal);
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            {/* Header */}
            <div className="flex items-center mb-8 gap-4">
                <JuicyButton
                    onClick={() => setScreen('GoalsOverviewScreen')}
                    variant="ghost"
                    className="!p-2"
                    sound="CLICK"
                >
                    <ArrowLeft size={24} />
                </JuicyButton>
                <h1 className="text-xl font-bold tracking-wider uppercase">Goal Details</h1>
            </div>

            <div className="max-w-md mx-auto space-y-6">

                {/* Goal Card */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>

                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <Target className="text-blue-400" size={20} />
                            </div>
                            <div>
                                <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">Primary Mission</span>
                                <p className="text-xs text-gray-500">90-Day Objective</p>
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
                            <textarea
                                value={editedGoal}
                                onChange={(e) => setEditedGoal(e.target.value)}
                                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none min-h-[100px]"
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
                            <h2 className="text-xl font-bold mb-2 leading-tight">
                                {user?.onboardingData?.primaryGoal || "No Goal Set"}
                            </h2>
                            <p className="text-gray-400 text-sm">
                                This is your North Star. Every daily action should align with this objective.
                            </p>
                        </div>
                    )}
                </div>

                {/* Stats / Progress (Mock) */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar size={16} className="text-gray-500" />
                            <span className="text-xs text-gray-500 uppercase">Time Left</span>
                        </div>
                        <p className="text-2xl font-mono font-bold">64 <span className="text-sm text-gray-600">Days</span></p>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle size={16} className="text-green-500" />
                            <span className="text-xs text-gray-500 uppercase">Progress</span>
                        </div>
                        <p className="text-2xl font-mono font-bold text-green-400">28%</p>
                    </div>
                </div>

                {/* Sub-Tasks (Mock) */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">Milestones</h3>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-black/50 rounded-lg border border-gray-800">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${i === 1 ? 'border-green-500 bg-green-900/20' : 'border-gray-700'}`}>
                                    {i === 1 && <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />}
                                </div>
                                <span className={`text-sm ${i === 1 ? 'text-gray-300 line-through' : 'text-gray-500'}`}>
                                    Milestone Phase {i}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
