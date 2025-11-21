import React, { useState } from 'react';
import { ArrowLeft, Brain, Bookmark, ChevronRight } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface MindsetTopic {
    id: string;
    title: string;
    category: string;
    description: string;
    content: string;
    isFavorite?: boolean;
}

const MINDSET_TOPICS: MindsetTopic[] = [
    {
        id: 'discipline',
        title: 'The Discipline Equation',
        category: 'Foundation',
        description: 'Why discipline beats motivation every time',
        content: `Motivation is fleeting. Discipline is permanent.

The formula: Discipline = (Clear Identity) × (Consistent Action) × (No Negotiation)

Your identity determines your actions. If you see yourself as "disciplined," you don't negotiate with yourself. You just execute.

Action: Choose ONE non-negotiable daily action. Do it for 30 days without exception.`
    },
    {
        id: 'self-sabotage',
        title: 'Breaking Self-Sabotage',
        category: 'Psychology',
        description: 'How to stop destroying your own progress',
        content: `Self-sabotage is your subconscious protecting you from change.

Why we self-sabotage:
1. Fear of success (new responsibilities)
2. Comfort in familiar pain
3. Identity mismatch ("I'm not that person")

Solution: Rewrite your identity. You're not "trying to be disciplined." You ARE disciplined. Act accordingly.`
    },
    {
        id: 'alpha-presence',
        title: 'Alpha Presence',
        category: 'Social',
        description: 'Command respect without saying a word',
        content: `Presence is 80% body language, 20% words.

The Alpha Formula:
- Slow movements (never rushed)
- Deep voice (speak from chest)
- Eye contact (hold 3 seconds longer)
- Space (take up room, don't shrink)

Practice: Walk slower. Speak slower. Hold eye contact until THEY look away.`
    },
    {
        id: 'instant-reframe',
        title: 'Instant Reframe',
        category: 'Mindset',
        description: 'Turn any negative into fuel',
        content: `Every obstacle is a test. Every setback is data.

Reframe Formula:
"This is happening FOR me, not TO me."

Failed? You learned what doesn't work.
Rejected? You're one step closer to the right fit.
Tired? Your body is adapting to a higher standard.

Action: Next time something "bad" happens, immediately ask: "What's the gift in this?"`
    },
    {
        id: 'brutal-focus',
        title: 'Brutal Focus Protocol',
        category: 'Execution',
        description: 'How to eliminate all distractions',
        content: `Focus is a muscle. Train it brutally.

The Protocol:
1. ONE task at a time (no multitasking)
2. 25-min blocks (Pomodoro)
3. Phone in another room (not just silent)
4. Close all tabs except ONE
5. Tell people you're unavailable

Your focus determines your future. Protect it like your life depends on it.`
    }
];

export const MindsetLibraryScreen: React.FC = () => {
    const { goBack } = useGameStore();
    const [selectedTopic, setSelectedTopic] = useState<MindsetTopic | null>(null);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    const toggleFavorite = (id: string) => {
        setFavorites(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    if (selectedTopic) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col">
                <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-gray-800 p-4">
                    <div className="flex items-center justify-between">
                        <button onClick={() => setSelectedTopic(null)} className="p-2 hover:bg-gray-900 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">{selectedTopic.category}</span>
                        <button
                            onClick={() => toggleFavorite(selectedTopic.id)}
                            className="p-2 hover:bg-gray-900 rounded-lg transition-colors"
                        >
                            <Bookmark
                                className={`w-5 h-5 ${favorites.has(selectedTopic.id) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-500'}`}
                            />
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-6">
                    <h1 className="text-3xl font-black mb-4 uppercase tracking-tight">{selectedTopic.title}</h1>
                    <p className="text-gray-400 mb-8">{selectedTopic.description}</p>

                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <div className="prose prose-invert max-w-none">
                            {selectedTopic.content.split('\n\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-4 text-gray-300 leading-relaxed whitespace-pre-line">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
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
                    <span className="text-sm font-bold uppercase tracking-wider">Mindset Library</span>
                    <div className="w-9" />
                </div>
            </div>

            <div className="flex-1 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                        <Brain className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight">Mental Frameworks</h1>
                        <p className="text-sm text-gray-500">Upgrade your operating system</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {MINDSET_TOPICS.map((topic) => (
                        <button
                            key={topic.id}
                            onClick={() => setSelectedTopic(topic)}
                            className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-left hover:border-purple-500/50 transition-all group"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs text-purple-500 font-bold uppercase tracking-wider">
                                            {topic.category}
                                        </span>
                                        {favorites.has(topic.id) && (
                                            <Bookmark className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                        )}
                                    </div>
                                    <h3 className="font-black mb-1 group-hover:text-purple-400 transition-colors">
                                        {topic.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">{topic.description}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-purple-500 transition-colors flex-shrink-0" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
