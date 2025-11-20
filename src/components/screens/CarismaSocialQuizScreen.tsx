import React, { useState } from 'react';
import { Eye, MessageCircle, Users, Smile } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

const QUESTIONS = [
    {
        id: 'confidence_level',
        question: 'How confident are you in social situations?',
        options: ['Very uncomfortable', 'Somewhat uncomfortable', 'Neutral', 'Comfortable', 'Very confident'],
        icon: Eye,
    },
    {
        id: 'conversation_skill',
        question: 'How would you rate your conversation skills?',
        options: ['Struggling', 'Below average', 'Average', 'Good', 'Excellent'],
        icon: MessageCircle,
    },
    {
        id: 'presence',
        question: 'Do people notice when you enter a room?',
        options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
        icon: Users,
    },
    {
        id: 'charisma_goal',
        question: 'Is improving your social presence a goal?',
        options: ['Not a priority', 'Minor goal', 'Moderate goal', 'Important goal', 'Top priority'],
        icon: Smile,
    },
];

export const CarismaSocialQuizScreen: React.FC = () => {
    const { answerQuizQuestion, setScreen } = useGameStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const currentQuestion = QUESTIONS[currentIndex];
    const isLastQuestion = currentIndex === QUESTIONS.length - 1;

    const handleAnswer = (answer: string) => {
        setAnswers({ ...answers, [currentQuestion.id]: answer });
        answerQuizQuestion(currentQuestion.id, answer);

        setTimeout(() => {
            if (isLastQuestion) {
                setScreen('MotivationTypeQuizScreen');
            } else {
                setCurrentIndex(currentIndex + 1);
            }
        }, 300);
    };

    const progress = 55 + (currentIndex / QUESTIONS.length) * 5;

    const Icon = currentQuestion.icon;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black text-white flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                        SOCIAL PRESENCE
                    </h1>
                    <p className="text-lg text-gray-400">
                        Understanding your charisma helps us create social challenges.
                    </p>
                </div>

                <div className="text-center mb-6">
                    <span className="text-sm text-gray-500">
                        Question {currentIndex + 1} of {QUESTIONS.length}
                    </span>
                </div>

                <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-16 bg-red-500/20 rounded-xl flex items-center justify-center">
                            <Icon className="w-8 h-8 text-red-500" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-6">{currentQuestion.question}</h2>

                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = answers[currentQuestion.id] === option;
                            return (
                                <button
                                    key={option}
                                    onClick={() => handleAnswer(option)}
                                    className={`w-full text-center p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                                            ? 'bg-red-900/40 border-red-500 shadow-lg shadow-red-500/30 scale-105'
                                            : 'bg-gray-900/40 border-gray-600 hover:border-gray-500'
                                        }`}
                                >
                                    <span className="font-medium text-lg">{option}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-red-500 font-bold">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
