import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { getUserHabits, createHabit, completeHabit } from '../../services/firebase';
import { Habit, HabitCategory } from '../../types';
import { Flame, CheckCircle, Plus, Zap, Calendar, Crown } from 'lucide-react';
import { BackButton } from '../ui/BackButton';

export const HabitsOverviewScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useGameStore();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        if (user) {
            loadHabits();
        }
    }, [user]);

    const loadHabits = async () => {
        if (!user) return;

        setLoading(true);
        const userHabits = await getUserHabits(user.uid);
        setHabits(userHabits as Habit[]);
        setLoading(false);
    };

    const handleCompleteHabit = async (habitId: string) => {
        await completeHabit(habitId);
        loadHabits(); // Reload to show updated streak
    };

    const coreHabits = habits.filter(h => h.category === HabitCategory.CORE);
    const dynamicHabits = habits.filter(h => h.category === HabitCategory.DYNAMIC);
    const seasonalHabits = habits.filter(h => h.category === HabitCategory.SEASONAL);
    const bestialHabits = habits.filter(h => h.category === HabitCategory.BESTIAL);

    return (
        <div className="min-h-screen bg-black text-white pb-24">
            <BackButton to="/dashboard" />

            {/* Header */}
            <div className="p-6 bg-gradient-to-b from-orange-950/50 to-black border-b border-orange-900/30">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold">Habits</h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        New Habit
                    </button>
                </div>
                <p className="text-gray-400">Build the foundation of excellence</p>
            </div>

            {loading ? (
                <div className="p-6 text-center text-gray-500">Loading habits...</div>
            ) : (
                <div className="p-6 space-y-6">
                    {/* Core Habits */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Flame className="w-5 h-5 text-red-500" />
                            <h2 className="text-xl font-bold">Core Habits</h2>
                            <span className="text-xs text-gray-500">(Daily fundamentals)</span>
                        </div>
                        {coreHabits.length === 0 ? (
                            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center text-gray-500">
                                No core habits yet. Start with the basics.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {coreHabits.map(habit => (
                                    <HabitCard
                                        key={habit.id}
                                        habit={habit}
                                        onComplete={handleCompleteHabit}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Dynamic Habits (AI-Generated) */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-5 h-5 text-blue-500" />
                            <h2 className="text-xl font-bold">Dynamic Habits</h2>
                            <span className="text-xs text-gray-500">(AI-recommended)</span>
                        </div>
                        {dynamicHabits.length === 0 ? (
                            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center text-gray-500">
                                AI will recommend habits based on your progress.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {dynamicHabits.map(habit => (
                                    <HabitCard
                                        key={habit.id}
                                        habit={habit}
                                        onComplete={handleCompleteHabit}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Seasonal Habits */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-5 h-5 text-green-500" />
                            <h2 className="text-xl font-bold">Seasonal Habits</h2>
                            <span className="text-xs text-gray-500">(Time-limited)</span>
                        </div>
                        {seasonalHabits.length === 0 ? (
                            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center text-gray-500">
                                No seasonal habits active.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {seasonalHabits.map(habit => (
                                    <HabitCard
                                        key={habit.id}
                                        habit={habit}
                                        onComplete={handleCompleteHabit}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bestial Habits (Beast Mode Only) */}
                    {user?.mode === 'BEAST' && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Crown className="w-5 h-5 text-purple-500" />
                                <h2 className="text-xl font-bold">Bestial Habits</h2>
                                <span className="text-xs text-gray-500">(Beast mode only)</span>
                            </div>
                            {bestialHabits.length === 0 ? (
                                <div className="bg-gray-900/50 border border-purple-800 rounded-xl p-4 text-center text-gray-500">
                                    Unlock extreme habits in Beast mode.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {bestialHabits.map(habit => (
                                        <HabitCard
                                            key={habit.id}
                                            habit={habit}
                                            onComplete={handleCompleteHabit}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Create Habit Modal */}
            {showCreateModal && (
                <CreateHabitModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={loadHabits}
                    userId={user?.uid || ''}
                    userMode={user?.mode || 'WARRIOR'}
                />
            )}
        </div>
    );
};

// Habit Card Component
const HabitCard: React.FC<{ habit: Habit; onComplete: (id: string) => void }> = ({ habit, onComplete }) => {
    const getCategoryColor = (category: HabitCategory) => {
        switch (category) {
            case HabitCategory.CORE: return 'border-red-600 bg-red-900/20';
            case HabitCategory.DYNAMIC: return 'border-blue-600 bg-blue-900/20';
            case HabitCategory.SEASONAL: return 'border-green-600 bg-green-900/20';
            case HabitCategory.BESTIAL: return 'border-purple-600 bg-purple-900/20';
        }
    };

    const isCompletedToday = habit.lastCompleted &&
        new Date(habit.lastCompleted).toDateString() === new Date().toDateString();

    return (
        <div className={`border-2 ${getCategoryColor(habit.category)} rounded-xl p-4`}>
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{habit.title}</h3>
                    <p className="text-sm text-gray-400">{habit.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{habit.frequency}</span>
                        <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3 text-orange-500" />
                            {habit.streak} day streak
                        </span>
                        <span>Best: {habit.bestStreak}</span>
                    </div>
                </div>
                <div>
                    {isCompletedToday ? (
                        <div className="bg-green-600 p-3 rounded-full">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                    ) : (
                        <button
                            onClick={() => onComplete(habit.id)}
                            className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full border-2 border-gray-600"
                        >
                            <CheckCircle className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Create Habit Modal Component
const CreateHabitModal: React.FC<{
    onClose: () => void;
    onCreated: () => void;
    userId: string;
    userMode: string;
}> = ({ onClose, onCreated, userId, userMode }) => {
    const [category, setCategory] = useState<HabitCategory>(HabitCategory.CORE);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [frequency, setFrequency] = useState<'DAILY' | 'WEEKLY'>('DAILY');
    const [creating, setCreating] = useState(false);

    const handleCreate = async () => {
        if (!title) return;

        setCreating(true);

        await createHabit(userId, {
            category,
            title,
            description,
            frequency,
            isActive: true
        });

        setCreating(false);
        onCreated();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Create New Habit</h2>

                {/* Category */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as HabitCategory)}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white"
                    >
                        <option value={HabitCategory.CORE}>Core (Daily fundamentals)</option>
                        <option value={HabitCategory.DYNAMIC}>Dynamic (AI-suggested)</option>
                        <option value={HabitCategory.SEASONAL}>Seasonal (Time-limited)</option>
                        {userMode === 'BEAST' && (
                            <option value={HabitCategory.BESTIAL}>Bestial (Beast mode)</option>
                        )}
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
                        placeholder="e.g., Morning workout"
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
                        placeholder="What does this habit involve?"
                    />
                </div>

                {/* Frequency */}
                <div className="mb-6">
                    <label className="block text-sm text-gray-400 mb-2">Frequency</label>
                    <select
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value as 'DAILY' | 'WEEKLY')}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white"
                    >
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                    </select>
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
                        disabled={creating || !title}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-bold disabled:opacity-50"
                    >
                        {creating ? 'Creating...' : 'Create Habit'}
                    </button>
                </div>
            </div>
        </div>
    );
};
