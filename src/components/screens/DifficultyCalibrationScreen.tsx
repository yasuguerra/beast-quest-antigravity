import React, { useState, useEffect, useCallback } from 'react';
import { Target } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { BackButton } from '../shared/BackButton';

export const DifficultyCalibrationScreen: React.FC = () => {
    const { setCalibrationScore, setScreen } = useGameStore();
    const [timeLeft, setTimeLeft] = useState(30);
    const [hits, setHits] = useState(0);
    const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });
    const [isActive, setIsActive] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const moveTarget = useCallback(() => {
        setTargetPosition({
            x: Math.random() * 80 + 10, // 10-90%
            y: Math.random() * 80 + 10,
        });
    }, []);

    const handleTargetHit = () => {
        if (!isActive) return;
        setHits(hits + 1);
        moveTarget();
    };

    const startTest = () => {
        setHasStarted(true);
        setIsActive(true);
        setTimeLeft(30);
        setHits(0);
        moveTarget();
    };

    useEffect(() => {
        if (!isActive) return;

        if (timeLeft <= 0) {
            setIsActive(false);
            // Calculate score (0-100)
            const score = Math.min(100, (hits / 20) * 100);
            setCalibrationScore(score);

            // Auto-continue after showing results
            setTimeout(() => {
                setScreen('PersonaProfileScreen');
            }, 2000);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(time => time - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, timeLeft, setCalibrationScore, setScreen]);

    const progress = ((hits / 20) * 100);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black text-white flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                {/* Back Button */}
                <div className="mb-6">
                    <BackButton />
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                        REACTION & FOCUS TEST
                    </h1>
                    <p className="text-lg text-gray-400">
                        "Your mind goes to war before your body."
                    </p>
                </div>

                {!hasStarted ? (
                    <div className="text-center">
                        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4">Instructions</h2>
                            <p className="text-gray-400 mb-6">
                                Tap the moving target as many times as you can in 30 seconds.
                                This helps us calibrate your daily challenge difficulty.
                            </p>
                            <div className="text-4xl font-bold text-red-500 mb-2">20 hits</div>
                            <p className="text-sm text-gray-500">is the target to reach</p>
                        </div>
                        <button
                            onClick={startTest}
                            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/50"
                        >
                            START TEST
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Stats */}
                        <div className="flex justify-between items-center mb-8">
                            <div className="text-center">
                                <div className="text-sm text-gray-400 mb-1">Time</div>
                                <div className="text-3xl font-bold text-red-500">{timeLeft}s</div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm text-gray-400 mb-1">Hits</div>
                                <div className="text-3xl font-bold text-green-500">{hits}/20</div>
                            </div>
                        </div>

                        {/* Target Area */}
                        <div className="relative bg-gray-900/60 border-2 border-gray-700 rounded-xl mb-8 overflow-hidden" style={{ height: '400px' }}>
                            {isActive && (
                                <button
                                    onClick={handleTargetHit}
                                    className="absolute w-16 h-16 bg-red-500 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-red-400 shadow-lg shadow-red-500/50"
                                    style={{
                                        left: `${targetPosition.x}%`,
                                        top: `${targetPosition.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                >
                                    <Target className="w-8 h-8 text-white" />
                                </button>
                            )}
                            {!isActive && timeLeft === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-5xl font-black text-green-500 mb-4">
                                            {hits} / 20
                                        </div>
                                        <p className="text-xl text-gray-400">
                                            {hits >= 20 ? 'Excellent!' : hits >= 15 ? 'Good!' : hits >= 10 ? 'Not bad!' : 'Keep practicing!'}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">Continuing to profile generation...</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Progress</span>
                                <span className="text-red-500 font-bold">65%</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" style={{ width: '65%' }} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
