import React, { useState, useEffect } from 'react';
import { ArrowLeft, Zap, Brain, MessageCircle, Send } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { CoachEngine } from '../../engines/CoachEngine';

interface Message {
    role: 'coach' | 'user';
    content: string;
    timestamp: string;
}

export const CoachSessionScreen: React.FC = () => {
    const { user, goBack } = useGameStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [emotionRadar, setEmotionRadar] = useState({
        energy: 50,
        willpower: 50,
        focus: 50
    });

    useEffect(() => {
        // Initial greeting
        if (user) {
            const greeting: Message = {
                role: 'coach',
                content: `What's on your mind? I'm here to help you break through.`,
                timestamp: new Date().toISOString()
            };
            setMessages([greeting]);
        }
    }, [user]);

    const handleQuickAction = async (action: string) => {
        if (!user) return;

        setLoading(true);

        // Add user message
        const userMsg: Message = {
            role: 'user',
            content: action,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMsg]);

        try {
            // Get AI response with context
            const context = `User clicked: "${action}". Current state: Arena ${user.currentArena}, Streak ${user.streakDays} days, Trophies ${user.trophies}`;
            const response = await CoachEngine.getCoachMessage(user, context);

            const coachMsg: Message = {
                role: 'coach',
                content: response,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, coachMsg]);
        } catch (error) {
            console.error('Coach error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!input.trim() || !user) return;

        setLoading(true);

        const userMsg: Message = {
            role: 'user',
            content: input,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        try {
            const context = `User message: "${input}". Arena ${user.currentArena}, Streak ${user.streakDays}, Mode ${user.mode}`;
            const response = await CoachEngine.getCoachMessage(user, context);

            const coachMsg: Message = {
                role: 'coach',
                content: response,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, coachMsg]);
        } catch (error) {
            console.error('Coach error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-gray-800 p-4">
                <div className="flex items-center justify-between">
                    <button onClick={goBack} className="p-2 hover:bg-gray-900 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-sm font-bold uppercase tracking-wider">Coach Session</span>
                    </div>
                    <div className="w-9" /> {/* Spacer */}
                </div>

                {/* Emotion Radar */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="bg-gray-900 rounded-lg p-2 border border-gray-800">
                        <div className="text-xs text-gray-500 mb-1">Energy</div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-500 transition-all duration-300"
                                    style={{ width: `${emotionRadar.energy}%` }}
                                />
                            </div>
                            <span className="text-xs font-mono">{emotionRadar.energy}</span>
                        </div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-2 border border-gray-800">
                        <div className="text-xs text-gray-500 mb-1">Willpower</div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-red-500 transition-all duration-300"
                                    style={{ width: `${emotionRadar.willpower}%` }}
                                />
                            </div>
                            <span className="text-xs font-mono">{emotionRadar.willpower}</span>
                        </div>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-2 border border-gray-800">
                        <div className="text-xs text-gray-500 mb-1">Focus</div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${emotionRadar.focus}%` }}
                                />
                            </div>
                            <span className="text-xs font-mono">{emotionRadar.focus}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-900 border border-gray-800'
                                }`}
                        >
                            {msg.role === 'coach' && (
                                <div className="flex items-center gap-2 mb-2">
                                    <Brain className="w-4 h-4 text-red-500" />
                                    <span className="text-xs font-bold text-red-500 uppercase">Coach AI</span>
                                </div>
                            )}
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-75" />
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-150" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="fixed bottom-20 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-4">
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                        onClick={() => handleQuickAction("Give me clarity on my next move")}
                        disabled={loading}
                        className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        <Zap className="w-3 h-3 inline mr-1" />
                        Give me clarity
                    </button>
                    <button
                        onClick={() => handleQuickAction("I need a push to execute")}
                        disabled={loading}
                        className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        <Zap className="w-3 h-3 inline mr-1" />
                        I need a push
                    </button>
                    <button
                        onClick={() => handleQuickAction("I'm feeling anxious and scattered")}
                        disabled={loading}
                        className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        <MessageCircle className="w-3 h-3 inline mr-1" />
                        I'm anxious
                    </button>
                    <button
                        onClick={() => handleQuickAction("Give me a 60-second action plan")}
                        disabled={loading}
                        className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        <Zap className="w-3 h-3 inline mr-1" />
                        60s plan
                    </button>
                </div>

                {/* Input */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        disabled={loading}
                        className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors disabled:opacity-50"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={loading || !input.trim()}
                        className="bg-red-600 hover:bg-red-500 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
