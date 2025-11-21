import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Volume2, Zap, CheckCircle2 } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { GeminiService } from '../../services/ai';

interface SocialChallenge {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const CarismaTrainingScreen: React.FC = () => {
    const { user, goBack } = useGameStore();
    const [dailyChallenge, setDailyChallenge] = useState<SocialChallenge | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedModule, setSelectedModule] = useState<string | null>(null);
    const [practiceComplete, setPracticeComplete] = useState(false);

    useEffect(() => {
        loadDailyChallenge();
    }, []);

    const loadDailyChallenge = async () => {
        setLoading(true);
        try {
            // Generate AI challenge (simplified for now)
            const challenge: SocialChallenge = {
                title: "Eye Contact Challenge",
                description: "Hold eye contact with 3 different people for 5 seconds each during conversations today.",
                difficulty: "Medium"
            };
            setDailyChallenge(challenge);
        } catch (error) {
            console.error('Failed to load challenge:', error);
        } finally {
            setLoading(false);
        }
    };

    const modules = [
        {
            id: 'eye-contact',
            title: 'Eye Contact Mastery',
            icon: Eye,
            color: 'blue',
            description: 'Hold eye contact 3 seconds longer than comfortable',
            practice: `Eye Contact Protocol:

1. Look at the bridge of their nose (less intense)
2. Hold for 3 seconds
3. Look away briefly
4. Return and hold for 5 seconds
5. Repeat

Practice this during every conversation today. Most people break eye contact first. You won't.`
        },
        {
            id: 'slow-speech',
            title: 'Slow Speech',
            icon: Volume2,
            color: 'purple',
            description: 'Speak 30% slower to command attention',
            practice: `Slow Speech Protocol:

1. Take a breath before speaking
2. Speak at 70% of your normal speed
3. Pause between sentences
4. Lower your voice pitch
5. Don't rush to fill silence

Alpha energy is calm energy. Rushing = low status. Slow = power.`
        },
        {
            id: 'calm-dominance',
            title: 'Calm Dominance',
            icon: Zap,
            color: 'red',
            description: 'Project power through stillness',
            practice: `Calm Dominance Protocol:

1. Move slower (no rushed movements)
2. Take up space (don't shrink)
3. Speak less (let others fill silence)
4. React less (emotional control)
5. Decide more (make clear calls)

Dominance isn't aggression. It's calm certainty. You know who you are. Act like it.`
        }
    ];

    if (selectedModule) {
        const module = modules.find(m => m.id === selectedModule);
        if (!module) return null;

        const Icon = module.icon;

        return (
            <div className="min-h-screen bg-black text-white flex flex-col">
                <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-gray-800 p-4">
                    <div className="flex items-center justify-between">
                        <button onClick={() => setSelectedModule(null)} className="p-2 hover:bg-gray-900 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-bold uppercase tracking-wider">Practice Module</span>
                        <div className="w-9" />
                    </div>
                </div>

                <div className="flex-1 p-6">
                    <div className={`w-16 h-16 bg-${module.color}-600/20 rounded-full flex items-center justify-center mb-4`}>
                        <Icon className={`w-8 h-8 text-${module.color}-500`} />
                    </div>
                    <h1 className="text-3xl font-black mb-2 uppercase tracking-tight">{module.title}</h1>
                    <p className="text-gray-400 mb-8">{module.description}</p>

                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
                        <div className="whitespace-pre-line text-gray-300 leading-relaxed">
                            {module.practice}
                        </div>
                    </div>

                    {!practiceComplete ? (
                        <button
                            onClick={() => setPracticeComplete(true)}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 py-4 rounded-xl font-black uppercase tracking-wider transition-all"
                        >
                            Mark as Practiced
                        </button>
                    ) : (
                        <div className="bg-green-900/20 border border-green-600 rounded-xl p-4 flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                            <div>
                                <div className="font-bold text-green-400">Practice Complete</div>
                                <div className="text-xs text-gray-400">Apply this in your next interaction</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-gray-800 p-4">
                <div className="flex items-center justify-between">
                    <button onClick={goBack} className="p-2 hover:bg-gray-900 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold uppercase tracking-wider">Charisma Training</span>
                    <div className="w-9" />
                </div>
            </div>

            <div className="flex-1 p-6">
                {/* Daily Challenge */}
                <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/50 rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-5 h-5 text-purple-400" />
                        <span className="text-sm font-bold uppercase tracking-wider text-purple-400">Today's Challenge</span>
                    </div>
                    {loading ? (
                        <div className="text-gray-500">Loading...</div>
                    ) : dailyChallenge ? (
                        <>
                            <h2 className="text-xl font-black mb-2">{dailyChallenge.title}</h2>
                            <p className="text-gray-300 text-sm mb-3">{dailyChallenge.description}</p>
                            <div className="inline-block bg-purple-600/20 border border-purple-500 px-3 py-1 rounded-full text-xs font-bold text-purple-400">
                                {dailyChallenge.difficulty}
                            </div>
                        </>
                    ) : null}
                </div>

                {/* Practice Modules */}
                <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-4 font-bold">Practice Modules</h3>
                <div className="space-y-3">
                    {modules.map((module) => {
                        const Icon = module.icon;
                        return (
                            <button
                                key={module.id}
                                onClick={() => setSelectedModule(module.id)}
                                className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-left hover:border-purple-500/50 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 bg-${module.color}-600/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <Icon className={`w-6 h-6 text-${module.color}-500`} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black mb-1 group-hover:text-purple-400 transition-colors">
                                            {module.title}
                                        </h4>
                                        <p className="text-sm text-gray-500">{module.description}</p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
