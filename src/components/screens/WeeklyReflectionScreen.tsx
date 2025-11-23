import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { JuicyButton } from '../ui/JuicyButton';
import { Trophy, Star, Clock, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import { GeminiService } from '../../services/ai';

export const WeeklyReflectionScreen: React.FC = () => {
    const { weeklyStats, user, completeWeeklyReview } = useGameStore();
    const [aiAnalysis, setAiAnalysis] = useState<string>("Analyzing your performance...");
    const [grade, setGrade] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            if (user) {
                // Simulate AI delay for effect
                setTimeout(async () => {
                    try {
                        const analysis = await GeminiService.generateWeeklyAnalysis(weeklyStats, user);
                        setAiAnalysis(analysis.message);
                        setGrade(analysis.grade);
                    } catch (e) {
                        setAiAnalysis("You survived another week. Focus on consistency.");
                        setGrade("B");
                    } finally {
                        setIsAnalyzing(false);
                    }
                }, 1500);
            }
        };
        fetchAnalysis();
    }, [user, weeklyStats]);

    const getGradeColor = (g: string) => {
        if (g === 'S') return 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]';
        if (g === 'A') return 'text-green-400';
        if (g === 'B') return 'text-blue-400';
        return 'text-gray-400';
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center animate-fade-in">
            {/* Header */}
            <div className="mt-8 mb-8 text-center">
                <h1 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    WEEK COMPLETE
                </h1>
                <p className="text-gray-400 text-sm mt-2">The cycle closes. The Beast evolves.</p>
            </div>

            {/* Grade Display */}
            <div className="mb-8 flex flex-col items-center justify-center">
                <div className={`text-8xl font-black ${getGradeColor(grade)} transition-all duration-1000 ${isAnalyzing ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
                    {grade}
                </div>
                {!isAnalyzing && <div className="text-xs tracking-widest text-gray-500 mt-2">PERFORMANCE RATING</div>}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
                <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl flex flex-col items-center">
                    <CheckCircle className="w-6 h-6 text-green-400 mb-2" />
                    <span className="text-2xl font-bold">{weeklyStats.daysCompleted}/7</span>
                    <span className="text-xs text-gray-500">PERFECT DAYS</span>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl flex flex-col items-center">
                    <Star className="w-6 h-6 text-yellow-400 mb-2" />
                    <span className="text-2xl font-bold">{weeklyStats.totalXP}</span>
                    <span className="text-xs text-gray-500">XP EARNED</span>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl flex flex-col items-center">
                    <Trophy className="w-6 h-6 text-purple-400 mb-2" />
                    <span className="text-2xl font-bold">{weeklyStats.totalTrophies}</span>
                    <span className="text-xs text-gray-500">TROPHIES</span>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl flex flex-col items-center">
                    <Clock className="w-6 h-6 text-blue-400 mb-2" />
                    <span className="text-2xl font-bold">{weeklyStats.totalCards}</span>
                    <span className="text-xs text-gray-500">CARDS CRUSHED</span>
                </div>
            </div>

            {/* AI Analysis */}
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-6 rounded-xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600"></div>
                <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Coach Analysis</h3>
                <p className="text-sm leading-relaxed text-gray-300 italic">
                    "{aiAnalysis}"
                </p>
            </div>

            {/* Action */}
            <div className="mt-auto w-full max-w-md pb-8">
                <JuicyButton
                    onClick={completeWeeklyReview}
                    variant="primary"
                    className="w-full py-4 text-lg"
                >
                    CLAIM WEEKLY REWARDS <ArrowRight className="ml-2 w-5 h-5" />
                </JuicyButton>
            </div>
        </div>
    );
};
