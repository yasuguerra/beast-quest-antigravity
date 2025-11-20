import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { getUserGoals, createGoal } from '../../services/firebase';
import { Goal, GoalType } from '../../types';
import { Target, Plus, TrendingUp, Calendar, Award } from 'lucide-react';
import { BackButton } from '../ui/BackButton';

export const GoalsOverviewScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useGameStore();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        if (user) {
            loadGoals();
        }
    }, [user]);

    const loadGoals = async () => {
        if (!user) return;

        setLoading(true);
        const userGoals = await getUserGoals(user.uid);
        setGoals(userGoals as Goal[]);
        setLoading(false);
    };

    const getGoalIcon = (type: GoalType) => {
        switch (type) {
            case GoalType.MACRO: return <Award className="w-5 h-5" />;
            case GoalType.SUB: return <TrendingUp className="w-5 h-5" />;
            case GoalType.MICRO: return <Target className="w-5 h-5" />;
        }
    };

    const getGoalColor = (type: GoalType) => {
        switch (type) {
            case GoalType.MACRO: return 'from-purple-600 to-purple-800';
            case GoalType.SUB: return 'from-blue-600 to-blue-800';
            case GoalType.MICRO: return 'from-green-600 to-green-800';
        }
    };

    const macroGoals = goals.filter(g => g.type === GoalType.MACRO);
    const subGoals = goals.filter(g => g.type === GoalType.SUB);
    const microGoals = goals.filter(g => g.type === GoalType.MICRO);

    return (
        <div className="min-h-screen bg-black text-white pb-24">
            <BackButton to="/dashboard" />

            {/* Header */}
            <div className="p-6 bg-gradient-to-b from-purple-950/50 to-black border-b border-purple-900/30">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold">Goals</h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        New Goal
                    </button>
                </div>
                <p className="text-gray-400">Transform vision into execution</p>
            </div>

            {loading ? (
                <div className="p-6 text-center text-gray-500">Loading goals...</div>
            ) : (
                <div className="p-6 space-y-6">
                    {/* Macro Goals (90-day) */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Award className="w-5 h-5 text-purple-500" />
                            <h2 className="text-xl font-bold">Macro Goals</h2>
                            <span className="text-xs text-gray-500">(90-day vision)</span>
                        </div>
                        {macroGoals.length === 0 ? (
                            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center text-gray-500">
                                No macro goals yet. Create your 90-day vision.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {macroGoals.map(goal => (
                                    <GoalCard key={goal.id} goal={goal} navigate={navigate} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sub Goals (Monthly) */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            <h2 className="text-xl font-bold">Sub Goals</h2>
                            <span className="text-xs text-gray-500">(Monthly milestones)</span>
                        </div>
                        {subGoals.length === 0 ? (
                            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center text-gray-500">
                                No sub goals yet.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {subGoals.map(goal => (
                                    <GoalCard key={goal.id} goal={goal} navigate={navigate} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Micro Goals (Weekly) */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Target className="w-5 h-5 text-green-500" />
                            <h2 className="text-xl font-bold">Micro Goals</h2>
                            <span className="text-xs text-gray-500">(Weekly targets)</span>
                        </div>
                        {microGoals.length === 0 ? (
                            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center text-gray-500">
                                No micro goals yet.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {microGoals.map(goal => (
                                    <GoalCard key={goal.id} goal={goal} navigate={navigate} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Create Goal Modal (simplified for now) */}
            {showCreateModal && (
                <CreateGoalModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={loadGoals}
                    userId={user?.uid || ''}
                />
            )}
        </div>
    );
};

// Goal Card Component
const GoalCard: React.FC<{ goal: Goal; navigate: any }> = ({ goal, navigate }) => {
    const getGoalColor = (type: GoalType) => {
        switch (type) {
            case GoalType.MACRO: return 'border-purple-600 bg-purple-900/20';
            case GoalType.SUB: return 'border-blue-600 bg-blue-900/20';
            case GoalType.MICRO: return 'border-green-600 bg-green-900/20';
        }
    };

    const daysUntil = Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return (
        <div
            onClick={() => navigate(`/goal/${goal.id}`)}
            className={`border-2 ${getGoalColor(goal.type)} rounded-xl p-4 cursor-pointer hover:scale-[1.02] transition-transform`}
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{goal.title}</h3>
                    <p className="text-sm text-gray-400">{goal.description}</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold">{goal.progress}%</div>
                    <div className="text-xs text-gray-500">{daysUntil}d left</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                />
            </div>
        </div>
    );
};

// Create Goal Modal Component
const CreateGoalModal: React.FC<{ onClose: () => void; onCreated: () => void; userId: string }> = ({ onClose, onCreated, userId }) => {
    const [goalType, setGoalType] = useState<GoalType>(GoalType.MACRO);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [creating, setCreating] = useState(false);

    const handleCreate = async () => {
        if (!title || !targetDate) return;

        setCreating(true);

        await createGoal(userId, {
            type: goalType,
            title,
            description,
            targetDate,
            progress: 0
        });

        setCreating(false);
        onCreated();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Create New Goal</h2>

                {/* Goal Type */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Goal Type</label>
                    <select
                        value={goalType}
                        onChange={(e) => setGoalType(e.target.value as GoalType)}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white"
                    >
                        <option value={GoalType.MACRO}>Macro (90 days)</option>
                        <option value={GoalType.SUB}>Sub (30 days)</option>
                        <option value={GoalType.MICRO}>Micro (7 days)</option>
                    </select>
                </div>

                {/* Title */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white"
                        placeholder="e.g., Launch my business"
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
                        placeholder="What does success look like?"
                    />
                </div>

                {/* Target Date */}
                <div className="mb-6">
                    <label className="block text-sm text-gray-400 mb-2">Target Date</label>
                    <input
                        type="date"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-lg font-bold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={creating || !title || !targetDate}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-bold disabled:opacity-50"
                    >
                        {creating ? 'Creating...' : 'Create Goal'}
                    </button>
                </div>
            </div>
        </div>
    );
};
