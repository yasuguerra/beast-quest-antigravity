
import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from './store';
import { ArchetypeId, AssessmentQuestion, UserMode, Card, CardType, CardRarity, Deck, ChestType } from './types';
import { GeminiService } from './services/ai';

// ------------------------------------------------------------------
// SHARED COMPONENTS
// ------------------------------------------------------------------

interface BeastButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'beast';
  className?: string;
  disabled?: boolean;
}

const BeastButton = ({ onClick, children, variant = 'primary', className = '', disabled = false }: BeastButtonProps) => {
  const baseStyle = "w-full font-bold py-4 px-6 rounded-xl transition-all active:scale-95 uppercase tracking-widest disabled:opacity-50 disabled:grayscale";
  const variants = {
    primary: "bg-beast-red text-white shadow-[0_0_15px_rgba(230,57,70,0.5)] hover:shadow-[0_0_25px_rgba(230,57,70,0.7)]",
    secondary: "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700",
    beast: "bg-beast-gold text-black border-2 border-white shadow-[0_0_20px_#ffd700] hover:scale-105"
  };
  
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const BackButton = () => {
    const goBack = useGameStore(state => state.goBack);
    const screenHistory = useGameStore(state => state.screenHistory);
    const activeScreen = useGameStore(state => state.activeScreen);

    // Don't show back button on root screens
    const isRootScreen = activeScreen === 'WelcomeScreen' || activeScreen === 'Dashboard';
    
    if (isRootScreen || screenHistory.length === 0) return null;

    return (
        <button 
            onClick={goBack} 
            className="absolute top-4 left-4 z-50 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
        </button>
    );
};

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in">
        <div className="w-12 h-12 border-4 border-beast-gray border-t-beast-red rounded-full animate-spin"></div>
        <p className="text-beast-red font-display uppercase tracking-widest text-sm animate-pulse">AI Processing</p>
    </div>
);

// ------------------------------------------------------------------
// SCREENS - PHASE 1 & 2 (Foundation)
// ------------------------------------------------------------------

const WelcomeScreen = () => {
  const setScreen = useGameStore(state => state.setScreen);
  const setGuestMode = useGameStore(state => state.setGuestMode);

  const handleStart = () => {
      setGuestMode(false); // Will require registration later
      setScreen('AvatarIdentityScreen');
  };

  const handleQuickStart = () => {
      setGuestMode(true); // Will skip registration
      setScreen('AvatarIdentityScreen');
  };

  const handleLogin = () => {
      setScreen('AuthLoginScreen');
  };

  return (
  <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-8 animate-fade-in bg-[url('https://images.unsplash.com/photo-1605218427360-6961d3748c34?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center relative">
    <div className="absolute inset-0 bg-black/80"></div>
    <div className="relative z-10 flex flex-col items-center space-y-8">
        <h1 className="text-6xl font-display font-bold text-beast-red tracking-tighter uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
        Beast<br/>Quest
        </h1>
        <p className="text-gray-400 text-lg max-w-xs font-light">
        Rise of the Fucking Monster
        </p>
        <div className="w-full max-w-xs space-y-4 mt-12">
            <p className="text-white text-xl font-semibold italic">
                "Your new life starts here. You are the master of your destiny."
            </p>
            <BeastButton onClick={handleStart}>
                Start Transformation
            </BeastButton>
            <div className="flex justify-between text-xs text-gray-500 pt-4 w-full px-2">
                <button onClick={handleLogin} className="hover:text-white uppercase transition-colors p-2">Log In</button>
                <button onClick={handleQuickStart} className="hover:text-white uppercase transition-colors p-2">QuickStart</button>
            </div>
        </div>
    </div>
  </div>
  );
};

const AuthLoginScreen = () => {
    const setScreen = useGameStore(state => state.setScreen);
    
    return (
        <div className="flex flex-col h-full p-6 bg-beast-black animate-fade-in justify-center">
            <h2 className="text-3xl font-display text-white text-center mb-8 uppercase">Return to the Arena</h2>
            
            <div className="space-y-4 mb-8">
                <div className="space-y-1">
                    <label className="text-xs text-gray-400 uppercase tracking-widest">Email</label>
                    <input type="email" className="w-full bg-gray-900 border border-gray-700 p-4 rounded-xl text-white focus:border-beast-red outline-none" placeholder="beast@example.com" />
                </div>
                <div className="space-y-1">
                     <label className="text-xs text-gray-400 uppercase tracking-widest">Password</label>
                    <input type="password" className="w-full bg-gray-900 border border-gray-700 p-4 rounded-xl text-white focus:border-beast-red outline-none" placeholder="••••••••" />
                </div>
            </div>

            <BeastButton onClick={() => setScreen('Dashboard')}>LOG IN</BeastButton>
        </div>
    );
};

const AuthRegisterScreen = () => {
    const setScreen = useGameStore(state => state.setScreen);

    return (
        <div className="flex flex-col h-full p-6 bg-beast-black animate-fade-in justify-center">
             <div className="w-full mb-6">
                <div className="h-1 w-full bg-gray-800 rounded-full">
                    <div className="h-full bg-beast-red w-[10%] rounded-full"></div>
                </div>
                <p className="text-center text-gray-600 text-[10px] mt-2 uppercase tracking-widest">Progress: 10%</p>
            </div>

            <h2 className="text-3xl font-display text-white text-center mb-2 uppercase">Commitment</h2>
            <p className="text-gray-400 text-center text-sm mb-8">Create your account to save your soul.</p>
            
            <div className="space-y-4 mb-8">
                <div className="space-y-1">
                    <label className="text-xs text-gray-400 uppercase tracking-widest">Email</label>
                    <input type="email" className="w-full bg-gray-900 border border-gray-700 p-4 rounded-xl text-white focus:border-beast-red outline-none" placeholder="beast@example.com" />
                </div>
                <div className="space-y-1">
                     <label className="text-xs text-gray-400 uppercase tracking-widest">Password</label>
                    <input type="password" className="w-full bg-gray-900 border border-gray-700 p-4 rounded-xl text-white focus:border-beast-red outline-none" placeholder="••••••••" />
                </div>
            </div>

            <BeastButton onClick={() => setScreen('OnboardingIntro')}>CREATE ACCOUNT</BeastButton>
        </div>
    );
};

const AvatarIdentityScreen = () => {
    const setArchetype = useGameStore(state => state.setArchetype);
    const setScreen = useGameStore(state => state.setScreen);
    const isGuestMode = useGameStore(state => state.isGuestMode);

    const archetypes = [
        { id: ArchetypeId.WARRIOR, title: "Disciplined Warrior", desc: "Firmness. Resistance. Order.", icon: "⚔️" },
        { id: ArchetypeId.BEAST, title: "Unstoppable Beast", desc: "Power. Focus. Controlled Fury.", icon: "🔥" },
        { id: ArchetypeId.STRATEGIST, title: "Mental Strategist", desc: "Intelligence. Precision. Mastery.", icon: "🧠" },
        { id: ArchetypeId.SOCIAL_ALPHA, title: "Social Alpha", desc: "Presence. Charisma. Connection.", icon: "🐺" },
    ];

    const handleSelect = (id: ArchetypeId) => {
        setArchetype(id);
        // Branching logic per PRD
        if (isGuestMode) {
            setScreen('OnboardingIntro'); // Skip Auth
        } else {
            setScreen('AuthRegisterScreen'); // Require Auth
        }
    };

    return (
        <div className="flex flex-col h-full p-6 bg-beast-black animate-fade-in">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-display text-beast-red uppercase tracking-wide mb-2">Identity Creates Destiny</h2>
                <p className="text-gray-400 text-sm">Who enters the Arena today?</p>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto pb-4">
                {archetypes.map((arch) => (
                    <button 
                        key={arch.id}
                        onClick={() => handleSelect(arch.id)}
                        className="w-full bg-beast-dark border border-gray-800 p-5 rounded-2xl flex items-center gap-4 hover:border-beast-red hover:bg-gray-900 transition-all text-left group"
                    >
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform border border-gray-700 group-hover:border-beast-gold">
                            {arch.icon}
                        </div>
                        <div>
                            <h3 className="text-white font-bold uppercase text-sm">{arch.title}</h3>
                            <p className="text-gray-500 text-xs mt-1">{arch.desc}</p>
                        </div>
                    </button>
                ))}
            </div>
            <div className="mt-4">
                <div className="h-1 w-full bg-gray-800 rounded-full">
                    <div className="h-full bg-beast-red w-[5%] rounded-full"></div>
                </div>
                <p className="text-center text-gray-600 text-[10px] mt-2 uppercase tracking-widest">Progress: 5%</p>
            </div>
        </div>
    );
};

const OnboardingIntro = () => (
  <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-beast-black animate-fade-in">
    <div className="w-20 h-20 bg-beast-red rounded-full flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(230,57,70,0.6)] animate-pulse-slow">
        <span className="text-4xl">⛩️</span>
    </div>
    <h2 className="text-3xl font-display text-white mb-6 uppercase tracking-tighter">Prepare for the Arena</h2>
    <p className="text-gray-300 mb-12 leading-relaxed max-w-xs mx-auto">
      "You are not here to improve a little bit.<br/><br/>
      You are here to <span className="text-beast-gold font-bold">dominate your life</span>."
    </p>
    <div className="w-full space-y-4">
        <BeastButton onClick={() => useGameStore.getState().setScreen('UserPurposeScreen')}>
        ENTER THE ARENA
        </BeastButton>
    </div>
  </div>
);

const UserPurposeScreen = () => {
    const setPrimaryGoal = useGameStore(state => state.setPrimaryGoal);
    const setScreen = useGameStore(state => state.setScreen);
    
    const goals = [
        "Lose Weight — Physical Transformation",
        "Build Muscle — Aesthetic Power",
        "Extreme Discipline — Mental Iron",
        "Grow Business — Financial Freedom",
        "Career Ascension — Professional Power",
        "Increase Charisma — Social Dominance"
    ];

    const handleGoal = (goal: string) => {
        setPrimaryGoal(goal);
        setScreen('LifeAreasPriorityScreen');
    };

    return (
        <div className="flex flex-col h-full p-6 bg-beast-black animate-fade-in">
            <div className="mb-8">
                <h2 className="text-2xl font-display text-white uppercase tracking-wide mb-2">What is your Mission?</h2>
                <p className="text-beast-gold text-sm font-semibold">Define it. The AI will guide you.</p>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto pb-4">
                {goals.map((goal, idx) => (
                    <button 
                        key={idx}
                        onClick={() => handleGoal(goal)}
                        className="w-full bg-beast-dark border border-gray-800 p-5 rounded-xl text-left hover:bg-gray-900 hover:border-beast-blue transition-all active:scale-[0.98]"
                    >
                        <span className="text-gray-200 font-medium text-sm">{goal}</span>
                    </button>
                ))}
            </div>
            <div className="mt-4">
                <div className="h-1 w-full bg-gray-800 rounded-full">
                    <div className="h-full bg-beast-red w-[20%] rounded-full"></div>
                </div>
                <p className="text-center text-gray-600 text-[10px] mt-2 uppercase tracking-widest">Progress: 20%</p>
            </div>
        </div>
    );
}

const LifeAreasPriorityScreen = () => {
    const setLifeAreas = useGameStore(state => state.setLifeAreas);
    const setScreen = useGameStore(state => state.setScreen);
    const [areas, setAreas] = useState({ "Health": 50, "Business": 50, "Mindset": 50, "Social": 50, "Spirit": 50 });

    const handleContinue = () => {
        setLifeAreas(areas);
        setScreen('DeepGoalQuizScreen');
    };

    return (
        <div className="flex flex-col h-full p-6 bg-beast-black animate-fade-in">
            <div className="mb-6">
                <h2 className="text-2xl font-display text-white uppercase tracking-wide mb-2">Prioritize Your Life</h2>
                <p className="text-gray-400 text-sm">Your focus defines your power. Drag to adjust.</p>
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto">
                {Object.entries(areas).map(([area, value]) => (
                    <div key={area} className="space-y-2">
                        <div className="flex justify-between text-sm font-bold text-gray-300 uppercase">
                            <span>{area}</span>
                            <span className="text-beast-gold">{value}%</span>
                        </div>
                        <input 
                            type="range" min="0" max="100" value={value} 
                            onChange={(e) => setAreas(prev => ({ ...prev, [area]: parseInt(e.target.value) }))}
                            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-beast-red"
                        />
                    </div>
                ))}
            </div>
            <div className="mt-6 space-y-4">
                <BeastButton onClick={handleContinue}>Continue</BeastButton>
            </div>
        </div>
    );
};

const DeepGoalQuizScreen = () => {
    const primaryGoal = useGameStore(state => state.onboardingData.primaryGoal);
    const setAssessmentQuestions = useGameStore(state => state.setAssessmentQuestions);
    const questions = useGameStore(state => state.assessmentQuestions);
    const answerQuestion = useGameStore(state => state.answerQuizQuestion);
    const setScreen = useGameStore(state => state.setScreen);
    const [loading, setLoading] = useState(false);
    const [currentQIndex, setCurrentQIndex] = useState(0);

    useEffect(() => {
        if (questions.length === 0 && primaryGoal) {
            const fetchQuestions = async () => {
                setLoading(true);
                const result = await GeminiService.generateAssessmentQuestions(primaryGoal || "General");
                setAssessmentQuestions(result.questions);
                setLoading(false);
            };
            fetchQuestions();
        }
    }, [primaryGoal, questions.length]);

    const handleAnswer = (answer: string) => {
        answerQuestion(questions[currentQIndex].text, answer);
        if (currentQIndex < questions.length - 1) setCurrentQIndex(prev => prev + 1);
        else setScreen('DifficultyCalibrationScreen');
    };

    if (loading) return <div className="flex h-full items-center justify-center bg-beast-black"><LoadingSpinner /></div>;
    if (questions.length === 0) return null;

    const currentQ = questions[currentQIndex];
    const progress = Math.round(((currentQIndex + 1) / questions.length) * 100);

    return (
        <div className="flex flex-col h-full p-6 bg-beast-black animate-fade-in">
            <div className="mb-8">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-beast-red text-xs font-bold tracking-widest">ASSESSMENT PROTOCOL</span>
                    <span className="text-gray-600 text-xs">{currentQIndex + 1}/{questions.length}</span>
                </div>
                <h2 className="text-xl font-display text-white leading-snug">{currentQ.text}</h2>
            </div>
            <div className="flex-1 space-y-3">
                {currentQ.options.map((option, idx) => (
                    <button key={idx} onClick={() => handleAnswer(option)} className="w-full bg-gray-900 border border-gray-700 p-4 rounded-xl text-left hover:border-beast-gold hover:bg-gray-800 transition-all text-gray-300 text-sm">
                        {option}
                    </button>
                ))}
            </div>
            <div className="mt-6">
                 <div className="h-1 w-full bg-gray-800 rounded-full mb-2">
                    <div className="h-full bg-beast-red rounded-full transition-all duration-500 ease-out" style={{ width: `${30 + (progress * 0.2)}%` }}></div>
                </div>
            </div>
        </div>
    );
};

const DifficultyCalibrationScreen = () => {
    const setScreen = useGameStore(state => state.setScreen);
    const setCalibrationScore = useGameStore(state => state.setCalibrationScore);
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [taps, setTaps] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    
    useEffect(() => {
        if (started && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else if (started && timeLeft === 0) {
            setFinished(true);
            setCalibrationScore(taps);
        }
    }, [started, timeLeft]);

    const handleTap = () => {
        if (!started) setStarted(true);
        if (!finished) setTaps(t => t + 1);
    };

    return (
        <div className="flex flex-col h-full p-6 bg-beast-black select-none">
            {!finished ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <h2 className="text-lg font-display text-white uppercase tracking-wide mb-4">Reaction Test</h2>
                    <div className="mb-6 text-4xl font-display text-beast-gold font-bold">{timeLeft}s</div>
                    <button onPointerDown={handleTap} className="w-48 h-48 rounded-full bg-gradient-to-b from-beast-red to-beast-dark border-4 border-beast-red shadow-[0_0_40px_rgba(230,57,70,0.4)] flex items-center justify-center active:scale-95 transition-transform">
                        <span className="text-4xl text-white font-black">{taps}</span>
                    </button>
                    <p className="mt-8 text-gray-500 text-sm uppercase tracking-widest animate-pulse">{started ? "TAP FAST!" : "TAP TO START"}</p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-6 animate-fade-in">
                    <h2 className="text-3xl font-display text-white">TEST COMPLETE</h2>
                    <div className="text-center"><p className="text-gray-400 text-sm">SCORE</p><p className="text-6xl font-black text-beast-gold">{taps}</p></div>
                    <BeastButton onClick={() => setScreen('PersonaProfileScreen')}>Analyze Results</BeastButton>
                </div>
            )}
        </div>
    );
};

const PersonaProfileScreen = () => {
    const setScreen = useGameStore(state => state.setScreen);
    const onboardingData = useGameStore(state => state.onboardingData);
    const setGeneratedProfile = useGameStore(state => state.setGeneratedProfile);
    const profile = useGameStore(state => state.onboardingData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const generate = async () => {
            const result = await GeminiService.generatePlayerProfile(onboardingData);
            setGeneratedProfile(result);
            setLoading(false);
        };
        generate();
    }, []);

    if (loading) return <div className="flex h-full items-center justify-center bg-beast-black"><LoadingSpinner /></div>;

    return (
        <div className="flex flex-col h-full p-6 bg-beast-black animate-fade-in">
            <div className="mb-6 text-center">
                <h2 className="text-xl font-display text-gray-400 uppercase tracking-widest">AI Profile Generated</h2>
                <h1 className="text-3xl font-black text-white mt-2 uppercase text-beast-red shadow-red-500/50 drop-shadow-lg">{profile.emotionalStyle || "UNKNOWN ENTITY"}</h1>
            </div>
            <div className="flex-1 space-y-4 bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                <div className="flex justify-between border-b border-gray-800 pb-4"><span className="text-gray-400 text-sm">Mental Strength</span><span className="text-beast-gold font-bold">{profile.mentalStrength}</span></div>
                <div className="flex justify-between border-b border-gray-800 pb-4"><span className="text-gray-400 text-sm">Recommended Coach</span><span className="text-beast-blue font-bold">{profile.coachPreference}</span></div>
            </div>
            <div className="mt-8 space-y-4">
                <BeastButton onClick={() => setScreen('AIOnboardingSummaryScreen')}>View 90-Day Blueprint</BeastButton>
            </div>
        </div>
    );
};

const AIOnboardingSummaryScreen = () => {
    const setScreen = useGameStore(state => state.setScreen);
    const profile = useGameStore(state => state.onboardingData);
    const setBlueprint = useGameStore(state => state.setBlueprint);
    const blueprint = useGameStore(state => state.generatedBlueprint);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!blueprint && profile.primaryGoal) {
            const generate = async () => {
                const result = await GeminiService.generateBlueprint(profile.primaryGoal!, profile);
                setBlueprint(result);
                setLoading(false);
            };
            generate();
        } else setLoading(false);
    }, []);

    if (loading) return <div className="flex h-full items-center justify-center bg-beast-black"><LoadingSpinner /></div>;

    return (
        <div className="flex flex-col h-full p-6 bg-beast-black animate-fade-in">
            <div className="mb-6">
                <h2 className="text-2xl font-display text-white uppercase tracking-wide">Your Battle Plan</h2>
                <p className="text-beast-gold text-xs font-bold uppercase tracking-widest mt-1">90 Day Protocol</p>
            </div>
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                <div className="bg-gray-900 border-l-4 border-beast-red p-4 rounded-r-xl">
                    <p className="text-gray-400 text-[10px] uppercase mb-1">Mission Statement</p>
                    <p className="text-white font-medium italic">"{blueprint?.missionStatement}"</p>
                </div>
                <div className="space-y-4 relative">
                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-800"></div>
                    {blueprint?.phases.map((phase, i) => (
                        <div key={i} className="relative pl-8">
                            <div className="absolute left-0 top-1 w-6 h-6 bg-beast-dark border-2 border-beast-gold rounded-full flex items-center justify-center text-[10px] font-bold text-white z-10">{i+1}</div>
                            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                                <h3 className="text-white font-bold mb-1">{phase.phaseName}</h3>
                                <p className="text-gray-300 text-xs mt-2 border-t border-gray-700 pt-2"><span className="text-beast-red">Key Habit:</span> {phase.keyHabit}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-800">
                 <BeastButton onClick={() => setScreen('ModeRecommendationScreen')}>CHOOSE DIFFICULTY</BeastButton>
            </div>
        </div>
    );
};

// ------------------------------------------------------------------
// SCREENS - PHASE 3 & 4 (Game Loop Initialization)
// ------------------------------------------------------------------

const ModeRecommendationScreen = () => {
    const setScreen = useGameStore(state => state.setScreen);
    const mentalStrength = useGameStore(state => state.onboardingData.mentalStrength);
    const isStrong = mentalStrength === 'HIGH' || mentalStrength === 'UNBREAKABLE';

    return (
        <div className="flex flex-col h-full p-6 bg-beast-black animate-fade-in">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-display text-white uppercase tracking-wide">AI Recommendation</h2>
                <p className="text-gray-400 text-sm mt-2">Based on your psychological profile...</p>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-6">
                <div className={`p-6 rounded-2xl border-2 ${isStrong ? 'bg-gray-900 border-gray-700 opacity-60' : 'bg-beast-dark border-beast-blue shadow-[0_0_20px_rgba(67,97,238,0.3)]'}`}>
                    <h3 className="text-2xl font-display text-white uppercase">Warrior Mode</h3>
                    <ul className="text-gray-300 text-xs list-disc list-inside mt-3 space-y-1">
                        <li>Standard Progression</li>
                        <li>Friendly Coach</li>
                        <li>No Punishments</li>
                    </ul>
                </div>

                <div className={`p-6 rounded-2xl border-2 ${isStrong ? 'bg-beast-dark border-beast-gold shadow-[0_0_25px_rgba(255,215,0,0.4)] transform scale-105' : 'bg-gray-900 border-gray-700'}`}>
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-display text-beast-gold uppercase">Beast Mode</h3>
                        {isStrong && <span className="bg-beast-gold text-black text-[10px] font-bold px-2 py-1 rounded uppercase">Recommended</span>}
                    </div>
                    <ul className="text-gray-300 text-xs list-disc list-inside mt-3 space-y-1">
                        <li>Accelerated Growth</li>
                        <li>Aggressive Coach</li>
                        <li className="text-beast-red font-bold">Punishments Enabled</li>
                    </ul>
                </div>
            </div>

            <div className="mt-6">
                <BeastButton onClick={() => setScreen('ModeSelectScreen')}>Select Mode</BeastButton>
            </div>
        </div>
    );
};

const ModeSelectScreen = () => {
    const setScreen = useGameStore(state => state.setScreen);
    const setUserMode = useGameStore(state => state.setUserMode);

    const handleSelect = (mode: UserMode) => {
        setUserMode(mode);
        setScreen('FirstBattleIntroScreen');
    };

    return (
        <div className="flex flex-col h-full p-6 bg-beast-black animate-fade-in">
            <h2 className="text-2xl font-display text-white text-center uppercase mb-8">Make Your Choice</h2>
            
            <div className="space-y-4 flex-1">
                <button onClick={() => handleSelect(UserMode.BEAST)} className="w-full bg-gradient-to-r from-beast-red/20 to-transparent border border-beast-red p-6 rounded-xl text-left hover:bg-beast-red/30 transition-all group">
                    <span className="text-2xl block mb-2">🔥</span>
                    <span className="text-beast-red font-bold text-xl uppercase block group-hover:tracking-widest transition-all">Beast Mode</span>
                    <span className="text-gray-400 text-xs">"I am ready to suffer to grow."</span>
                </button>
                
                <button onClick={() => handleSelect(UserMode.WARRIOR)} className="w-full bg-gray-900 border border-gray-700 p-6 rounded-xl text-left hover:bg-gray-800 transition-all">
                     <span className="text-2xl block mb-2">🛡️</span>
                    <span className="text-white font-bold text-xl uppercase block">Warrior Mode</span>
                    <span className="text-gray-400 text-xs">"I want consistent progress."</span>
                </button>
            </div>
        </div>
    );
};

const FirstBattleIntroScreen = () => {
    const setScreen = useGameStore(state => state.setScreen);
    const initBattle = useGameStore(state => state.initBattle);

    const startTutorialBattle = () => {
        const tutorialDeck: Deck = {
            id: 'tutorial-deck',
            userId: 'user-1',
            status: 'ACTIVE',
            pressureLevel: 0,
            cards: [
                { id: 'c1', title: 'Drink Water', description: 'Hydrate immediately.', type: CardType.HABIT, rarity: CardRarity.COMMON, energyCost: 1, xpReward: 10, trophyReward: 5, durationMinutes: 1, isCompleted: false },
                { id: 'c2', title: 'Deep Breath', description: 'Take 5 deep breaths.', type: CardType.RITUAL, rarity: CardRarity.COMMON, energyCost: 2, xpReward: 15, trophyReward: 5, durationMinutes: 2, isCompleted: false },
                { id: 'c3', title: '10 Squats', description: 'Move your body now.', type: CardType.TASK, rarity: CardRarity.RARE, energyCost: 5, xpReward: 25, trophyReward: 10, durationMinutes: 2, isCompleted: false },
            ]
        };
        initBattle(tutorialDeck);
        setScreen('BattleOverviewScreen');
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-beast-black text-center animate-fade-in">
            <h1 className="text-4xl font-display text-white uppercase tracking-tighter mb-6">The Old You<br/><span className="text-beast-red">Dies Today</span></h1>
            <p className="text-gray-400 text-sm mb-12 max-w-xs">
                Your transformation begins with action. Not tomorrow. <span className="text-white font-bold">NOW.</span>
            </p>
            
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 w-full mb-8 text-left">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Tutorial Deck Generated:</p>
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm text-gray-300"><span className="text-blue-400">💧</span> Drink Water</div>
                    <div className="flex items-center gap-3 text-sm text-gray-300"><span className="text-green-400">🌬️</span> Breathe</div>
                    <div className="flex items-center gap-3 text-sm text-gray-300"><span className="text-red-400">🏋️</span> Move</div>
                </div>
            </div>

            <BeastButton variant="beast" onClick={startTutorialBattle}>
                FIGHT FIRST BATTLE
            </BeastButton>
        </div>
    );
};

const BattleOverviewScreen = () => {
    const battle = useGameStore(state => state.battle);
    const currentDeck = useGameStore(state => state.currentDeck);
    const completeCard = useGameStore(state => state.completeCard);
    const setScreen = useGameStore(state => state.setScreen);
    const addChest = useGameStore(state => state.addChest);

    // Check victory condition
    useEffect(() => {
        if (battle.cardsRemaining === 0 && battle.isActive) {
            // Victory!
            setTimeout(() => {
                addChest({
                    id: `chest-${Date.now()}`,
                    type: ChestType.COMMON, // Tutorial Reward
                    status: 'READY'
                });
                setScreen('BattleResultScreen');
            }, 500);
        }
    }, [battle.cardsRemaining]);

    const activeCard = currentDeck?.cards.find(c => c.id === battle.activeCardId);

    if (!activeCard) return <div className="h-full flex items-center justify-center bg-beast-black text-white">VICTORY PENDING...</div>;

    return (
        <div className="flex flex-col h-full bg-beast-black relative overflow-hidden">
            {/* HUD */}
            <div className="p-4 flex justify-between items-end bg-gradient-to-b from-black/80 to-transparent z-10">
                <div className="flex flex-col w-full">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400 mb-1">
                        <span>Willpower</span>
                        <span>{battle.currentHp}%</span>
                    </div>
                    <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                        <div className="h-full bg-gradient-to-r from-red-900 to-beast-red transition-all duration-500" style={{ width: `${battle.currentHp}%` }}></div>
                    </div>
                </div>
            </div>

            {/* BATTLEFIELD */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-0">
                
                {/* Enemy / Context (Abstract for now) */}
                <div className="absolute top-10 text-center opacity-50">
                    <h3 className="text-beast-red font-display text-6xl uppercase font-black tracking-widest opacity-10">RESISTANCE</h3>
                </div>

                {/* The Card (Hero) */}
                <div className="w-full max-w-xs bg-gray-900 border-2 border-gray-700 rounded-2xl p-6 shadow-2xl transform transition-all hover:scale-105 hover:border-beast-gold relative group">
                    <div className="absolute -top-3 -right-3 bg-beast-gold text-black font-bold text-xs px-2 py-1 rounded uppercase">
                        {activeCard.rarity}
                    </div>
                    <div className="text-4xl mb-4 text-center">{activeCard.title === 'Drink Water' ? '💧' : activeCard.title === 'Deep Breath' ? '🌬️' : '🏋️'}</div>
                    <h2 className="text-2xl font-display text-white uppercase text-center mb-2">{activeCard.title}</h2>
                    <p className="text-gray-400 text-sm text-center mb-6">{activeCard.description}</p>
                    
                    <div className="flex gap-2 text-[10px] font-bold uppercase justify-center text-gray-500 mb-6">
                        <span className="bg-black/40 px-2 py-1 rounded border border-gray-800">+{activeCard.xpReward} XP</span>
                        <span className="bg-black/40 px-2 py-1 rounded border border-gray-800">{activeCard.durationMinutes} MIN</span>
                    </div>

                    <BeastButton onClick={() => completeCard(activeCard.id)}>
                        COMPLETE
                    </BeastButton>
                </div>

                <p className="mt-8 text-gray-500 text-xs uppercase tracking-widest animate-pulse">
                    {battle.cardsRemaining} Enemy Cards Remaining
                </p>
            </div>
        </div>
    );
};

const BattleResultScreen = () => {
    const setScreen = useGameStore(state => state.setScreen);
    
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-beast-black text-center animate-fade-in relative overflow-hidden">
            <div className="absolute inset-0 bg-beast-gold/10 animate-pulse-slow"></div>
            <h1 className="text-6xl font-display text-beast-gold font-black uppercase tracking-tighter mb-2 drop-shadow-lg animate-shake">VICTORY</h1>
            <p className="text-white font-bold uppercase tracking-widest mb-12">First Blood Spilled</p>

            <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl w-full max-w-xs mb-8 transform rotate-1">
                <p className="text-gray-400 text-xs uppercase mb-2">Loot Acquired</p>
                <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-lg">Monster Chest</span>
                    <span className="text-2xl">📦</span>
                </div>
            </div>

            <BeastButton variant="beast" onClick={() => setScreen('ChestOpenScreen')}>
                CLAIM REWARD
            </BeastButton>
        </div>
    );
};

const ChestOpenScreen = () => {
    const setScreen = useGameStore(state => state.setScreen);
    const [opened, setOpened] = useState(false);

    const handleOpen = () => {
        setOpened(true);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-beast-black text-center select-none">
            {!opened ? (
                <>
                    <div 
                        onClick={handleOpen}
                        className="text-9xl cursor-pointer hover:scale-110 transition-transform active:scale-95 animate-bounce"
                    >
                        📦
                    </div>
                    <p className="mt-8 text-gray-400 text-sm uppercase tracking-widest animate-pulse">Tap to Open</p>
                </>
            ) : (
                <div className="animate-fade-in space-y-6">
                    <h2 className="text-3xl font-display text-white uppercase">REWARDS</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-900 p-4 rounded-xl border border-beast-gold/50">
                            <span className="block text-2xl mb-1">🪙</span>
                            <span className="text-beast-gold font-bold">+100 Gold</span>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-xl border border-blue-500/50">
                            <span className="block text-2xl mb-1">💎</span>
                            <span className="text-blue-400 font-bold">+10 Gems</span>
                        </div>
                    </div>
                    <BeastButton onClick={() => setScreen('Dashboard')} className="mt-8">
                        ENTER DASHBOARD
                    </BeastButton>
                </div>
            )}
        </div>
    );
};

const Dashboard = () => {
  const user = useGameStore(state => state.user);
  const activeArchetype = user?.avatarId || ArchetypeId.WARRIOR;
  const archetypeLabels: Record<string, string> = {
    [ArchetypeId.WARRIOR]: "Warrior",
    [ArchetypeId.BEAST]: "Beast",
    [ArchetypeId.STRATEGIST]: "Strategist",
    [ArchetypeId.SOCIAL_ALPHA]: "Alpha",
    [ArchetypeId.MONSTER_BUILDING]: "Monster"
  };

  return (
    <div className="flex flex-col h-full bg-beast-black">
      <div className="bg-beast-gray p-4 flex justify-between items-center border-b border-gray-800">
        <div className="flex flex-col">
            <span className="text-[10px] text-beast-gold font-bold tracking-widest uppercase">
                {user?.mode} MODE — {archetypeLabels[activeArchetype]}
            </span>
            <span className="text-white font-bold text-lg tracking-tight">{user?.displayName}</span>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Trophies</span>
                <span className="text-beast-purple font-bold font-display text-xl">{user?.trophies}</span>
            </div>
            <div className="w-10 h-10 bg-gray-700 rounded-full border-2 border-beast-gold flex items-center justify-center text-xs">
                lvl {user?.level}
            </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-2xl border border-gray-700 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
                <div className="h-full bg-beast-red w-[60%] shadow-[0_0_10px_#e63946]"></div>
            </div>
            <h3 className="text-gray-400 text-[10px] uppercase tracking-widest mb-2">Daily Progress</h3>
            <div className="flex justify-between items-end">
                <span className="text-4xl font-display text-white">60%</span>
                <span className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded-md border border-gray-700">Streak: <span className="text-beast-red font-bold">4 days 🔥</span></span>
            </div>
        </div>
        <button className="w-full bg-beast-gray hover:bg-gray-800 border border-gray-700 p-6 rounded-2xl flex flex-col items-center justify-center gap-4 group transition-all shadow-[0_10px_20px_rgba(0,0,0,0.3)] relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-beast-red text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">ACTION REQUIRED</div>
            <div className="w-16 h-24 bg-beast-black border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center group-hover:border-beast-gold transition-colors shadow-inner">
                <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">🎴</span>
            </div>
            <div className="text-center">
                <span className="text-white font-bold text-lg block tracking-wide">VIEW DAILY DECK</span>
                <span className="text-xs text-gray-500">6 Cards Remaining</span>
            </div>
        </button>
      </div>
      <div className="bg-beast-dark border-t border-gray-800 pb-6 pt-3 px-6 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-gray-600">
        <button className="flex flex-col items-center text-beast-red gap-1"><span className="text-xl">🏠</span><span>Home</span></button>
        <button className="flex flex-col items-center hover:text-white transition-colors gap-1"><span className="text-xl">⚔️</span><span>Deck</span></button>
        <div className="relative -top-5"><button className="w-14 h-14 bg-beast-gold rounded-full border-4 border-beast-black flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.3)] text-black text-2xl">⚡</button></div>
        <button className="flex flex-col items-center hover:text-white transition-colors gap-1"><span className="text-xl">🧠</span><span>Coach</span></button>
        <button className="flex flex-col items-center hover:text-white transition-colors gap-1"><span className="text-xl">👤</span><span>Profile</span></button>
      </div>
    </div>
  );
}

// -- Main App Router Shell --
const App = () => {
  const activeScreen = useGameStore(state => state.activeScreen);

  const renderScreen = () => {
    switch(activeScreen) {
      case 'WelcomeScreen': return <WelcomeScreen />;
      case 'AuthLoginScreen': return <AuthLoginScreen />;
      case 'AuthRegisterScreen': return <AuthRegisterScreen />;
      case 'AvatarIdentityScreen': return <AvatarIdentityScreen />;
      case 'OnboardingIntro': return <OnboardingIntro />;
      case 'UserPurposeScreen': return <UserPurposeScreen />;
      case 'LifeAreasPriorityScreen': return <LifeAreasPriorityScreen />;
      case 'DeepGoalQuizScreen': return <DeepGoalQuizScreen />;
      case 'DifficultyCalibrationScreen': return <DifficultyCalibrationScreen />;
      case 'PersonaProfileScreen': return <PersonaProfileScreen />;
      case 'AIOnboardingSummaryScreen': return <AIOnboardingSummaryScreen />;
      case 'ModeRecommendationScreen': return <ModeRecommendationScreen />;
      case 'ModeSelectScreen': return <ModeSelectScreen />;
      case 'FirstBattleIntroScreen': return <FirstBattleIntroScreen />;
      case 'BattleOverviewScreen': return <BattleOverviewScreen />;
      case 'BattleResultScreen': return <BattleResultScreen />;
      case 'ChestOpenScreen': return <ChestOpenScreen />;
      case 'Dashboard': return <Dashboard />;
      default: return <WelcomeScreen />;
    }
  }
  
  return (
    <div className="bg-black min-h-screen w-full flex justify-center">
      <div className="w-full max-w-md bg-beast-black shadow-2xl h-screen overflow-hidden relative flex flex-col">
        <BackButton />
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;
