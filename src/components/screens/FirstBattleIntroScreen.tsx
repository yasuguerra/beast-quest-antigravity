import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Sword, Skull, ArrowRight } from 'lucide-react';

export const FirstBattleIntroScreen: React.FC = () => {
    const { generateFirstBattleDeck, initBattle, currentDeck } = useGameStore();
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const handleEnterArena = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Generate the specific first battle deck
            await generateFirstBattleDeck();

            // Get the deck from the store (it should be set by generateFirstBattleDeck)
            // We need to access the fresh state, but since we are inside a component, 
            // we can rely on the store update if we use useGameStore.getState() or just trust the flow.
            // However, since generateFirstBattleDeck is async and updates the store, 
            // we should grab the updated deck.
            const freshDeck = useGameStore.getState().currentDeck;

            if (freshDeck) {
                initBattle(freshDeck);
                // initBattle automatically switches screen to BattleOverviewScreen
            } else {
                console.error("Failed to generate deck");
                setError("Failed to summon the arena. The connection to the ether is weak. Try again.");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error entering arena:", error);
            setError("An unknown force blocked your entry. Check your connection and try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

            <div className="relative z-10 max-w-lg w-full text-center space-y-12">

                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(220,38,38,0.6)] animate-pulse">
                        <Sword className="w-10 h-10 text-white" />
                    </div>

                    <h1 className="text-4xl font-black uppercase tracking-tighter leading-tight">
                        Your Blueprint<br />Is Ready.
                    </h1>

                    <p className="text-xl text-gray-400 font-medium leading-relaxed">
                        But a plan without action is just a <span className="text-red-500 font-bold">hallucination</span>.
                    </p>
                </div>

                <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 p-6 rounded-xl animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                    <p className="text-lg italic text-gray-300">
                        "The enemy is waiting. Procrastination is sharpening its blade.
                        Strike first."
                    </p>
                </div>

                <div className="pt-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-1000">
                    <button
                        onClick={handleEnterArena}
                        disabled={isLoading}
                        className="group relative w-full py-5 bg-red-600 hover:bg-red-500 text-white font-black text-xl uppercase tracking-[0.2em] rounded-xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.5)] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                        {isLoading ? (
                            <span className="flex items-center justify-center gap-3">
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Summoning...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-3">
                                Enter The Arena <ArrowRight className="w-6 h-6" />
                            </span>
                        )}
                    </button>
                    <p className="text-xs text-gray-600 mt-4 uppercase tracking-widest">
                        First Battle • 3 Cards • 5 Minutes
                    </p>
                    {error && (
                        <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg animate-in fade-in slide-in-from-top-2">
                            <p className="text-red-200 text-sm font-bold flex items-center justify-center gap-2">
                                <Skull className="w-4 h-4" /> {error}
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
