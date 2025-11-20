import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

const QUESTIONS = [
    {
        id: 'previous_attempts',
        question: 'What have you tried before?',
        type: 'textarea' as const,
    },
    {
        id: 'biggest_obstacle',
        question: 'What stopped you the most?',
        type: 'textarea' as const,
    },
    {
        id: 'daily_time',
        question: 'How much time can you dedicate per day?',
        type: 'radio' as const,
        options: ['15 min', '30 min', '45 min', '1 hour', 'More than 1 hour'],
    },
    {
        id: 'energy_level',
        question: 'When is your energy highest?',
        type: 'radio' as const,
        options: ['Morning (6-10 AM)', 'Midday (10 AM - 2 PM)', 'Afternoon (2-6 PM)', 'Evening (6-10 PM)', 'Night (10 PM+)'],
    },
    {
        id: 'main_challenge',
        question: 'What is your biggest challenge right now?',
        type: 'radio' as const,
        options: ['Lack of discipline', 'Low energy', 'Too many distractions', 'No clear plan', 'Fear of failure', 'Lack of support'],
    },
];

export const DeepGoalQuizScreen: React.FC = () => {
    const { answerQuizQuestion, setScreen } = useGameStore();
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentQuestion = QUESTIONS[currentIndex];
    const isLastQuestion = currentIndex === QUESTIONS.length - 1;

    const handleAnswer = (questionId: string, answer: string) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    const handleNext = () => {
        if (answers[currentQuestion.id]) {
            answerQuizQuestion(currentQuestion.id, answers[currentQuestion.id]);

            if (isLastQuestion) {
                setScreen('LifestyleQuizScreen');
            } else {
                setCurrentIndex(currentIndex + 1);
            }
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const progress = ((currentIndex + 1) / QUESTIONS.length) * 10 + 25; // 25% base + 10% total for this section

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black text-white flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                        UNDERSTANDING YOUR PATH
                    </h1>
                    <p className="text-lg text-gray-400">
                        "The AI can only guide you as far as you allow yourself to be honest."
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

                    {currentQuestion.type === 'textarea' ? (
                        <textarea
                            value={answers[currentQuestion.id] || ''}
                            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                            placeholder="Your answer..."
                            className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors min-h-[120px] resize-none"
                        />
                    ) : (
                        <div className="space-y-3">
                            {currentQuestion.options?.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleAnswer(currentQuestion.id, option)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${answers[currentQuestion.id] === option
                                            ? 'bg-red-900/40 border-red-500 shadow-lg shadow-red-500/30'
                                            : 'bg-gray-900/40 border-gray-600 hover:border-gray-500'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
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

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                    {currentIndex > 0 && (
                        <button
                            onClick={handlePrevious}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200"
                        >
                            ← BACK
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={!answers[currentQuestion.id]}
                        className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLastQuestion ? 'CONTINUE →' : 'NEXT →'}
                    </button>
                </div>
            </div>
        </div>
    );
};
