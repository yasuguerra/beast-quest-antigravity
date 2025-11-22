import { create } from 'zustand';
import { GameStore, UserProfile, BattleState, UserMode, ArchetypeId, Deck, Chest, AIBlueprint, CardType, CardRarity, MiniLeague, Card } from '../types';
import { GeminiService } from '../services/ai';
import { updateUserProfile, getDailyDeck, saveDailyDeck, updateDeckCard } from '../services/firebase';
import { ARENAS, getArenaByTrophies } from '../constants/arenas';

const INITIAL_BATTLE_STATE: BattleState = {
    isActive: false,
    currentHp: 100,
    maxHp: 100,
    timeRemaining: 0,
    cardsRemaining: 0,
    activeCardId: null
};

export const useGameStore = create<GameStore>((set, get) => ({
    user: null,
    currentDeck: null,
    battle: INITIAL_BATTLE_STATE,
    chests: [],
    activeScreen: 'WelcomeScreen',
    isLoading: false,
    onboardingData: {
        lifeAreas: {},
        quizAnswers: {}
    },
    assessmentQuestions: [],
    generatedBlueprint: null,
    isGuestMode: false,
    screenHistory: [],
    selectedCardId: null,
    lastBattleResult: null,

    setUser: (user) => set({ user }),

    setUserMode: (mode) => {
        set((state) => {
            const updatedUser = state.user ? { ...state.user, mode } : null;
            if (state.user?.uid && updatedUser) {
                updateUserProfile(state.user.uid, { mode });
            }
            return { user: updatedUser };
        });
    },

    updateResources: (resources) => set((state) => ({
        user: state.user ? { ...state.user, ...resources } : null
    })),

    setDeck: (deck) => set({ currentDeck: deck }),

    generateDeck: async () => {
        const state = get();
        if (!state.user) return;

        set({ isLoading: true });

        try {
            const today = new Date().toISOString().split('T')[0];
            const deckId = `${today}_${state.user.uid}`;

            // 1. Check if deck exists in Firestore
            const existingDeck = await getDailyDeck(state.user.uid, today);

            if (existingDeck && existingDeck.cards && existingDeck.cards.length > 0) {
                console.log("Loaded existing deck:", deckId);
                set({ currentDeck: existingDeck as Deck, isLoading: false });
                return;
            } else if (existingDeck) {
                console.warn("Found empty deck in storage, regenerating...");
            }

            // 2. If not, generate with AI
            const aiDeckData = await GeminiService.generateDailyDeck(state.user);

            // 3. Transform and Save
            const newDeck: Deck = {
                id: deckId,
                userId: state.user.uid,
                status: 'ACTIVE',
                pressureLevel: 0,
                cards: aiDeckData.cards.map((c: any, i: number) => ({
                    id: `card-${Date.now()}-${i}`,
                    title: c.title,
                    description: c.description || "Execute this task to dominate your day.",
                    type: (c.type as CardType) || CardType.TASK,
                    rarity: (c.rarity as CardRarity) || CardRarity.COMMON,
                    energyCost: 1,
                    xpReward: c.xp || 20,
                    trophyReward: 5,
                    durationMinutes: 15,
                    isCompleted: false
                }))
            };

            // Update state immediately so user can play
            set({ currentDeck: newDeck, isLoading: false });

            // Try to save in background
            try {
                await saveDailyDeck(newDeck);
            } catch (saveError) {
                console.error("Failed to save deck to Firestore (Background):", saveError);
            }

        } catch (error) {
            console.error("Failed to generate deck:", error);
            set({ isLoading: false });
        }
    },

    swapCard: async (oldCardId: string, newCard: Card) => {
        const state = get();
        if (!state.currentDeck || !state.user) return;

        const updatedCards = state.currentDeck.cards.map(card =>
            card.id === oldCardId ? newCard : card
        );

        const updatedDeck = { ...state.currentDeck, cards: updatedCards };

        // Optimistic update
        set({ currentDeck: updatedDeck });

        // Persist to Firestore
        try {
            await updateDeckCard(state.currentDeck.id, updatedDeck.cards);
        } catch (error) {
            console.error("Failed to swap card:", error);
            // Revert on error (optional, for now just log)
        }
    },

    generateFirstBattleDeck: async () => {
        const state = get();
        if (!state.user) {
            console.error("generateFirstBattleDeck: No user found in state");
            return;
        }

        set({ isLoading: true });

        try {
            console.log("Generating first battle deck for user:", state.user.uid);
            let aiDeckData = await GeminiService.generateFirstBattleDeck(state.user);

            // Validate AI response
            if (!aiDeckData || !Array.isArray(aiDeckData.cards) || aiDeckData.cards.length === 0) {
                console.warn("AI returned invalid deck data, using fallback:", aiDeckData);
                aiDeckData = {
                    cards: [
                        { title: "Drink a glass of water", description: "Hydrate to dominate.", type: "HABIT", rarity: "COMMON", xp: 20, durationMinutes: 2 },
                        { title: "Do 10 Pushups", description: "Activate your body.", type: "TASK", rarity: "COMMON", xp: 20, durationMinutes: 5 },
                        { title: "Clear your workspace", description: "Order brings clarity.", type: "TASK", rarity: "COMMON", xp: 20, durationMinutes: 5 }
                    ]
                };
            }

            const newDeck: Deck = {
                id: `first_battle_${state.user.uid}`,
                userId: state.user.uid,
                status: 'ACTIVE',
                pressureLevel: 0,
                cards: aiDeckData.cards.map((c: any, i: number) => ({
                    id: `card-first-${Date.now()}-${i}`,
                    title: c.title || "Unknown Task",
                    description: c.description || "Execute this task.",
                    type: (c.type as CardType) || CardType.TASK,
                    rarity: (c.rarity as CardRarity) || CardRarity.COMMON,
                    energyCost: 1,
                    xpReward: c.xp || 20,
                    trophyReward: 5,
                    durationMinutes: c.durationMinutes || 5,
                    isCompleted: false
                }))
            };

            console.log("Saving new deck:", newDeck);

            // Update state immediately
            set({ currentDeck: newDeck, isLoading: false });

            try {
                await saveDailyDeck(newDeck);
            } catch (saveError) {
                console.error("Failed to save first battle deck (Background):", saveError);
            }

        } catch (error) {
            console.error("Failed to generate first battle deck:", error);

            // Emergency Fallback if everything else fails (e.g. Firestore error)
            // We still set the deck in state so the user can play, even if saving fails
            const emergencyDeck: Deck = {
                id: `first_battle_emergency_${state.user.uid}`,
                userId: state.user.uid,
                status: 'ACTIVE',
                pressureLevel: 0,
                cards: [
                    { id: 'e1', title: "Breathe Deeply", description: "Take 10 deep breaths.", type: CardType.RITUAL, rarity: CardRarity.COMMON, energyCost: 1, xpReward: 10, trophyReward: 0, durationMinutes: 2, isCompleted: false },
                    { id: 'e2', title: "Stand Up", description: "Get out of your chair.", type: CardType.TASK, rarity: CardRarity.COMMON, energyCost: 1, xpReward: 10, trophyReward: 0, durationMinutes: 1, isCompleted: false },
                    { id: 'e3', title: "Focus", description: "Stare at a point for 30s.", type: CardType.RITUAL, rarity: CardRarity.COMMON, energyCost: 1, xpReward: 10, trophyReward: 0, durationMinutes: 1, isCompleted: false }
                ]
            };

            set({ currentDeck: emergencyDeck, isLoading: false });
        }
    },

    setSelectedCard: (cardId) => set({ selectedCardId: cardId }),

    initBattle: (deck) => {
        set({
            battle: {
                isActive: true,
                currentHp: 100,
                maxHp: 100,
                timeRemaining: deck.cards.length * 15 * 60, // Approx time
                cardsRemaining: deck.cards.length,
                activeCardId: deck.cards.length > 0 ? deck.cards[0].id : null
            },
            activeScreen: 'BattleOverviewScreen'
        });
    },

    completeCard: (cardId) => set((state) => {
        if (!state.currentDeck || !state.user) return {};

        const card = state.currentDeck.cards.find(c => c.id === cardId);
        const updatedCards = state.currentDeck.cards.map(c =>
            c.id === cardId ? { ...c, isCompleted: true, completedAt: new Date().toISOString() } : c
        );

        const remainingCards = updatedCards.filter(c => !c.isCompleted);

        // Calculate Multipliers
        let trophyMultiplier = 1.0;
        if (state.user.streakDays >= 30) trophyMultiplier = 1.5;
        else if (state.user.streakDays >= 10) trophyMultiplier = 1.3;
        else if (state.user.streakDays >= 5) trophyMultiplier = 1.2;

        const earnedTrophies = Math.floor((card?.trophyReward || 0) * trophyMultiplier);
        const newXp = state.user.xp + (card?.xpReward || 0);
        const newTrophies = state.user.trophies + earnedTrophies;

        // Heal player slightly on completion
        const newHp = Math.min(state.battle.maxHp, state.battle.currentHp + 15);

        // Arena Progression Logic
        const newArena = getArenaByTrophies(newTrophies);
        const didPromote = newArena.id !== state.user.currentArena;

        // Mini League Logic
        let newMiniLeague = MiniLeague.BRONZE;
        const range = newArena.trophyMax - newArena.trophyMin;
        const progress = newTrophies - newArena.trophyMin;

        if (progress > range * 0.66) newMiniLeague = MiniLeague.GOLD;
        else if (progress > range * 0.33) newMiniLeague = MiniLeague.SILVER;

        // Prepare updates
        const userUpdates: Partial<UserProfile> = {
            xp: newXp,
            trophies: newTrophies,
            currentMiniLeague: newMiniLeague
        };

        if (didPromote) {
            userUpdates.currentArena = newArena.id;
            if (!state.user.arenaHistory.includes(newArena.id)) {
                userUpdates.arenaHistory = [...state.user.arenaHistory, newArena.id];
            }
        }

        // Async update
        updateDeckCard(state.currentDeck.id, updatedCards);
        updateUserProfile(state.user.uid, userUpdates);

        // Return new state
        const newState: Partial<GameStore> = {
            currentDeck: { ...state.currentDeck, cards: updatedCards },
            user: { ...state.user, ...userUpdates },
            battle: {
                ...state.battle,
                currentHp: newHp,
                cardsRemaining: remainingCards.length,
                activeCardId: remainingCards.length > 0 ? remainingCards[0].id : null
            },
            lastBattleResult: { result: 'VICTORY', card: card! }
        };

        // Trigger Promotion Screen if needed
        if (didPromote) {
            newState.activeScreen = 'ArenaPromotionScreen';
        }

        return newState;
    }),

    failCard: (cardId) => set((state) => {
        // In Beast Mode, this hurts. In Warrior, it's just a delay.
        const damage = state.user?.mode === UserMode.BEAST ? 20 : 10;
        return {
            battle: {
                ...state.battle,
                currentHp: Math.max(0, state.battle.currentHp - damage)
            },
            lastBattleResult: {
                result: 'DEFEAT',
                card: state.currentDeck?.cards.find(c => c.id === cardId)!
            }
        };
    }),

    addChest: (chest) => set((state) => ({ chests: [...state.chests, chest] })),

    unlockChest: (chestId) => set((state) => ({
        chests: state.chests.map(c => c.id === chestId ? { ...c, status: 'UNLOCKING', unlockTimeStart: new Date().toISOString() } : c)
    })),

    setScreen: (screenName) => set((state) => {
        // Don't push history if we are just staying on same screen
        if (state.activeScreen === screenName) return {};

        // Clear history if we go back to root screens to prevent infinite back loops
        if (screenName === 'WelcomeScreen' || screenName === 'Dashboard') {
            return { activeScreen: screenName, screenHistory: [] };
        }

        return {
            activeScreen: screenName,
            screenHistory: [...state.screenHistory, state.activeScreen]
        };
    }),

    goBack: () => set((state) => {
        if (state.screenHistory.length === 0) return {};
        const previousScreen = state.screenHistory[state.screenHistory.length - 1];
        const newHistory = state.screenHistory.slice(0, -1);
        return {
            activeScreen: previousScreen,
            screenHistory: newHistory
        };
    }),

    setLoading: (loading) => set({ isLoading: loading }),

    setArchetype: (archetype) => set((state) => ({
        user: state.user ? { ...state.user, avatarId: archetype } : null
    })),

    setPrimaryGoal: (goal) => set((state) => ({
        onboardingData: { ...state.onboardingData, primaryGoal: goal }
    })),

    setLifeAreas: (areas) => set((state) => ({
        onboardingData: { ...state.onboardingData, lifeAreas: areas }
    })),

    setAssessmentQuestions: (questions) => set({ assessmentQuestions: questions }),

    answerQuizQuestion: (q, a) => set((state) => ({
        onboardingData: {
            ...state.onboardingData,
            quizAnswers: { ...state.onboardingData.quizAnswers, [q]: a }
        }
    })),

    setCalibrationScore: (score) => set((state) => ({
        onboardingData: { ...state.onboardingData, calibrationScore: score }
    })),

    setGeneratedProfile: (profile) => set((state) => ({
        onboardingData: { ...state.onboardingData, ...profile }
    })),

    setBlueprint: (blueprint) => set({ generatedBlueprint: blueprint }),

    setGuestMode: (isGuest) => set({ isGuestMode: isGuest }),

    // ============================================
    // ECONOMY ACTIONS (Phase 2)
    // ============================================

    addGold: (amount) => set((state) => {
        if (!state.user) return {};
        const newGold = (state.user.gold || 0) + amount;
        updateUserProfile(state.user.uid, { gold: newGold });
        return { user: { ...state.user, gold: newGold } };
    }),

    spendGold: (amount) => set((state) => {
        if (!state.user) return {};
        if ((state.user.gold || 0) < amount) return {}; // Insufficient funds
        const newGold = (state.user.gold || 0) - amount;
        updateUserProfile(state.user.uid, { gold: newGold });
        return { user: { ...state.user, gold: newGold } };
    }),

    addGems: (amount) => set((state) => {
        if (!state.user) return {};
        const newGems = (state.user.gems || 0) + amount;
        updateUserProfile(state.user.uid, { gems: newGems });
        return { user: { ...state.user, gems: newGems } };
    }),

    spendGems: (amount) => set((state) => {
        if (!state.user) return {};
        if ((state.user.gems || 0) < amount) return {}; // Insufficient funds
        const newGems = (state.user.gems || 0) - amount;
        updateUserProfile(state.user.uid, { gems: newGems });
        return { user: { ...state.user, gems: newGems } };
    })
}));
