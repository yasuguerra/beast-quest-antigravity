import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { GeminiService } from '../../services/ai';
import { AssessmentQuestion } from '../../types';
import { Brain, ArrowRight, Check } from 'lucide-react';
import { BackButton } from '../ui/BackButton';

export const AssessmentFlowScreen: React.FC = () => {
    const navigate = useNavigate();
    const {
        user,
        setPrimaryGoal,
        setAssessmentQuestions,
        assessmentQuestions,
        answerQuizQuestion,
        setGeneratedProfile,
        setBlueprint
    } = useGameStore();

    const [step, setStep] = useState<'GOAL' | 'AI_QUESTIONS' | 'ANALYZING' | 'COMPLETE'>('GOAL');
    const [goalInput, setGoalInput] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    // Step 1: User enters primary goal
    const handleGoalSubmit = async () => {
        if (!goalInput.trim()) return;

        setLoading(true);
        setPrimaryGoal(goalInput);

        try {
            // Call AI to generate deep questions based on this goal
            const result = await GeminiService.generateAssessmentQuestions(goalInput);
            setAssessmentQuestions(result.questions);
            setStep('AI_QUESTIONS');
        } catch (error) {
            console.error("Failed to generate questions", error);
            // Fallback or error state
        } finally {
            setLoading(false);
        }
    };

    // Step 2: User answers AI questions
    const handleAnswer = (answer: string) => {
        const currentQ = assessmentQuestions[currentQuestionIndex];
        answerQuizQuestion(currentQ.text, answer);

        if (currentQuestionIndex < assessmentQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            finishAssessment();
        }
    };

    // Step 3: AI Analyzes and creates Profile + Blueprint
    const finishAssessment = async () => {
        setStep('ANALYZING');
        setLoading(true);

        try {
            // 1. Generate Profile
            const profile = await GeminiService.generatePlayerProfile({
                goal: goalInput,
            });
            setGeneratedProfile(profile);

            // 2. Generate Blueprint
            const blueprint = await GeminiService.generateBlueprint(goalInput, profile);
            setBlueprint(blueprint);

            setStep('COMPLETE');
            setTimeout(() => {
                navigate('/blueprint-reveal');
            }, 2000);

        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setLoading(false);
        }
    };

    if (step === 'GOAL') {
        return (
            <div className="min-h-screen bg-black text-white p-6 flex flex-col justify-center items-center relative">
                <BackButton to="/avatar-selection" />
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <Brain className="w-16 h-16 text-red-600 mx-auto mb-4 animate-pulse" />
                        <h2 className="text-3xl font-bold">What will be your beastly achievement?</h2>
                        <p className="text-gray-400 mt-2">Define your primary goal. Be specific.</p>
                    </div>

                    <div className="space-y-4">
                        <textarea
                            value={goalInput}
                            onChange={(e) => setGoalInput(e.target.value)}
                            placeholder="E.g., I want to make $10k/month with my agency..."
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white h-32 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none resize-none"
                        />
                        <button
                            onClick={handleGoalSubmit}
                            disabled={loading || !goalInput}
                            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Analyzing...' : <>Continue <ArrowRight className="w-5 h-5" /></>}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'AI_QUESTIONS') {
        const question = assessmentQuestions[currentQuestionIndex];
        return (
            <div className="min-h-screen bg-black text-white p-6 flex flex-col justify-center items-center relative">
                <BackButton onClick={() => currentQuestionIndex > 0 ? setCurrentQuestionIndex(prev => prev - 1) : setStep('GOAL')} />
                <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-500">
                    <div className="flex justify-between text-sm text-gray-500 uppercase tracking-widest">
                        <span>Deep Analysis</span>
                        <span>{currentQuestionIndex + 1} / {assessmentQuestions.length}</span>
                    </div>

                    <h2 className="text-2xl font-bold leading-relaxed">
                        {question?.text || "Loading..."}
                    </h2>

                    <div className="space-y-3">
                        {question?.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(option)}
                                className="w-full p-4 text-left bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-red-500/50 rounded-xl transition-all text-gray-300 hover:text-white group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full border border-gray-600 group-hover:border-red-500 flex items-center justify-center">
                                        <div className="w-3 h-3 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    {option}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'ANALYZING') {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
                <div className="w-24 h-24 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-8" />
                <h2 className="text-2xl font-bold animate-pulse">Building your Blueprint...</h2>
                <p className="text-gray-500 mt-2">AI is designing your 90-day plan.</p>
            </div>
        );
    }

    return null;
};
