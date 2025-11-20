import React, { useState } from 'react';
import { Sun, Cloud, Moon, Zap, Coffee } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

const QUESTIONS = [
    {
        id: 'wake_time',
        question: 'What time do you usually wake up?',
        options: [
            { value: '5-6 AM', icon: Sun },
            { value: '6-8 AM', icon: Sun },
            { value: '8-10 AM', icon: Cloud },
            { value: '10 AM+', icon: Cloud },
        ],
    },
    {
        id: 'peak_energy',
        question: 'When do you have the most energy?',
        options: [
            { value: 'Early morning (5-8 AM)', icon: Sun },
            { value: 'Late morning (8-12 PM)', icon: Coffee },
            { value: 'Afternoon (12-5 PM)', icon: Zap },
            { value: 'Evening (5-9 PM)', icon: Moon },
            { value: 'Night (9 PM+)', icon: Moon },
        ],
    },
    {
        id: 'work_schedule',
        question: 'What is your work schedule like?',
        options: [
            { value: 'Fixed 9-5', icon: Coffee },
            { value: 'Flexible hours', icon: Zap },
            { value: 'Shift work', icon: Cloud },
            { value: 'Self-employed / Freelance', icon: Sun },
            { value: 'Student', icon: Cloud },
        ],
    },
    {
        id: 'daily_availability',
        question: 'How much free time do you have daily for personal growth?',
        options: [
            { value: 'Less than 30 min', icon: Cloud },
            { value: '30 - 60 min', icon: Coffee },
            { value: '1 - 2 hours', icon: Zap },
            { value: '2+ hours', icon: Sun },
        ],
    },
];

export const LifestyleQuizScreen: React.FC = () => {
    const { answerQuizQuestion, setScreen } = useGameStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const currentQuestion = QUESTIONS[currentIndex];
    const isLastQuestion = currentIndex === QUESTIONS.length - 1;

    const handleAnswer = (questionId: string, answer: string) => {
        setAnswers({ ...answers, [questionId]: answer });
        answerQuizQuestion(questionId, answer);

        // Auto-advance after selection
        setTimeout(() => {
            if (isLastQuestion) {
                setScreen('DistractionQuizScreen');
            } else {
                setCurrentIndex(currentIndex + 1);
            }
        }, 300);
    };

    const progress = 35 + (currentIndex / QUESTIONS.length) * 5; // 35% base + 5% for this section

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black text-white flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                        YOUR LIFESTYLE
                    </h1>
                    <p className="text-lg text-gray-400">
                        Understanding your schedule helps us optimize your daily deck.
                    </p>
                </div>

                {/* Question Counter */}
                <div className="text-center mb-6">
                    <span className="text-sm text-gray-500">
                        Question {currentIndex + 1} of {QUESTIONS.length}
                    </span>
                </div>

                {/* Question Card */}
                <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-6">{currentQuestion.question}</h2>

                    <div className="space-y-3">
                        {currentQuestion.options.map((option) => {
                            const Icon = option.icon;
                            const isSelected = answers[currentQuestion.id] === option.value;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${isSelected
                                            ? 'bg-red-900/40 border-red-500 shadow-lg shadow-red-500/30 scale-105'
                                            : 'bg-gray-900/40 border-gray-600 hover:border-gray-500 hover:scale-102'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isSelected ? 'bg-red-500/20' : 'bg-gray-700/40'
                                        }`}>
                                        <Icon className={`w-6 h-6 ${isSelected ? 'text-red-500' : 'text-gray-400'}`} />
                                    </div>
                                    <span className="font-medium text-lg">{option.value}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-red-500 font-bold">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* Back Button */}
                {currentIndex > 0 && (
                    <button
                        onClick={() => setCurrentIndex(currentIndex - 1)}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200"
                    >
                        ← BACK
                    </button>
                )}
            </div>
        </div>
    );
};
