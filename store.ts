import { create } from 'zustand';
import { GameStore, UserProfile, BattleState, UserMode, ArchetypeId, Deck, Chest, AIBlueprint } from './types';

// Mock Initial User for Dev
const MOCK_USER: UserProfile = {
  uid: 'mock-user-1',
  displayName: 'Guest Warrior',
  email: 'guest@beast.quest',
  avatarId: ArchetypeId.WARRIOR,
  mode: UserMode.WARRIOR,
  level: 1,
  xp: 0,
  trophies: 0,
  gold: 100,
  gems: 10,
  fragments: 0,
  monsterSouls: 0,
  streakDays: 0,
  lastActive: new Date().toISOString(),
};

const INITIAL_BATTLE_STATE: BattleState = {
  isActive: false,
  currentHp: 100,
  maxHp: 100,
  timeRemaining: 0,
  cardsRemaining: 0,
  activeCardId: null
};

export const useGameStore = create<GameStore>((set, get) => ({
  user: MOCK_USER,
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

  setUser: (user) => set({ user }),
  
  setUserMode: (mode) => set((state) => ({
    user: state.user ? { ...state.user, mode } : null
  })),
  
  updateResources: (resources) => set((state) => ({
    user: state.user ? { ...state.user, ...resources } : null
  })),
  
  setDeck: (deck) => set({ currentDeck: deck }),
  
  initBattle: (deck) => set({
    currentDeck: deck,
    battle: {
        isActive: true,
        currentHp: 100,
        maxHp: 100,
        timeRemaining: 3600, // Placeholder, actual logic depends on real time
        cardsRemaining: deck.cards.filter(c => !c.isCompleted).length,
        activeCardId: deck.cards.find(c => !c.isCompleted)?.id || null
    }
  }),
  
  completeCard: (cardId) => set((state) => {
    if (!state.currentDeck || !state.user) return {};
    
    const card = state.currentDeck.cards.find(c => c.id === cardId);
    const updatedCards = state.currentDeck.cards.map(c => 
      c.id === cardId ? { ...c, isCompleted: true, completedAt: new Date().toISOString() } : c
    );
    
    const remainingCards = updatedCards.filter(c => !c.isCompleted);
    const newXp = state.user.xp + (card?.xpReward || 0);
    const newTrophies = state.user.trophies + (card?.trophyReward || 0);

    // Heal player slightly on completion
    const newHp = Math.min(state.battle.maxHp, state.battle.currentHp + 15);
    
    return { 
      currentDeck: { ...state.currentDeck, cards: updatedCards },
      user: { ...state.user, xp: newXp, trophies: newTrophies },
      battle: {
          ...state.battle,
          currentHp: newHp,
          cardsRemaining: remainingCards.length,
          activeCardId: remainingCards.length > 0 ? remainingCards[0].id : null
      }
    };
  }),

  failCard: (cardId) => set((state) => {
      // In Beast Mode, this hurts. In Warrior, it's just a delay.
      const damage = state.user?.mode === UserMode.BEAST ? 20 : 10;
      return {
          battle: {
              ...state.battle,
              currentHp: Math.max(0, state.battle.currentHp - damage)
          }
      }
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
      return { activeScreen: previousScreen, screenHistory: newHistory };
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