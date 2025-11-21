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

            if (existingDeck) {
                console.log("Loaded existing deck:", deckId);
                set({ currentDeck: existingDeck as Deck, isLoading: false });
                return;
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

            await saveDailyDeck(newDeck);
            set({ currentDeck: newDeck, isLoading: false });

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
        if (!state.user) return;

        set({ isLoading: true });

        try {
            const aiDeckData = await GeminiService.generateFirstBattleDeck(state.user);

            const newDeck: Deck = {
                id: `first_battle_${state.user.uid}`,
                userId: state.user.uid,
                status: 'ACTIVE',
                pressureLevel: 0,
                cards: aiDeckData.cards.map((c: any, i: number) => ({
                    id: `card-first-${Date.now()}-${i}`,
                    title: c.title,
                    description: c.description || "Execute this task to dominate your day.",
                    type: (c.type as CardType) || CardType.TASK,
                    rarity: (c.rarity as CardRarity) || CardRarity.COMMON,
                    energyCost: 1,
                    xpReward: c.xp || 20,
                    trophyReward: 5,
                    durationMinutes: c.durationMinutes || 5,
                    isCompleted: false
                }))
            };

            await saveDailyDeck(newDeck);
            set({ currentDeck: newDeck, isLoading: false });

        } catch (error) {
            console.error("Failed to generate first battle deck:", error);
            set({ isLoading: false });
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
                activeCardId: null
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
            }
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

    setGuestMode: (isGuest) => set({ isGuestMode: isGuest })
}));
