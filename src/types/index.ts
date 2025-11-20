export enum UserMode {
    WARRIOR = 'WARRIOR',
    BEAST = 'BEAST'
}

export enum ArchetypeId {
    WARRIOR = 'WARRIOR',
    BEAST = 'BEAST',
    STRATEGIST = 'STRATEGIST',
    SOCIAL_ALPHA = 'SOCIAL_ALPHA',
    MONSTER_BUILDING = 'MONSTER_BUILDING'
}

export enum CardType {
    HABIT = 'HABIT',
    TASK = 'TASK',
    RITUAL = 'RITUAL'
}

export enum CardRarity {
    COMMON = 'COMMON',
    RARE = 'RARE',
    EPIC = 'EPIC',
    LEGENDARY = 'LEGENDARY'
}

export enum ChestType {
    COMMON = 'COMMON',
    RARE = 'RARE',
    EPIC = 'EPIC',
    LEGENDARY = 'LEGENDARY',
    BEAST = 'BEAST',
    DIVINE = 'DIVINE'
}

export enum ArenaTier {
    CIVILIAN = 'CIVILIAN',
    WARRIOR = 'WARRIOR',
    ELITE = 'ELITE',
    BEAST = 'BEAST',
    LEGENDARY_MONSTER = 'LEGENDARY_MONSTER'
}

export interface Card {
    id: string;
    title: string;
    description: string;
    type: CardType;
    rarity: CardRarity;
    energyCost: number;
    xpReward: number;
    trophyReward: number;
    durationMinutes: number;
    isCompleted: boolean;
    completedAt?: string;
}

export interface Deck {
    id: string;
    userId: string;
    status: 'ACTIVE' | 'COMPLETED' | 'FAILED';
    pressureLevel: number;
    cards: Card[];
}

export interface Chest {
    id: string;
    type: ChestType;
    status: 'LOCKED' | 'UNLOCKING' | 'READY' | 'OPENED';
    unlockTimeStart?: string;
}

export interface UserProfile {
    uid: string;
    displayName: string;
    email: string;
    avatarId: ArchetypeId;
    mode: UserMode;
    level: number;
    xp: number;
    trophies: number;
    gold: number;
    gems: number;
    fragments: number;
    monsterSouls: number;
    streakDays: number;
    lastActive: string;
}

export interface BattleState {
    isActive: boolean;
    currentHp: number;
    maxHp: number;
    timeRemaining: number;
    cardsRemaining: number;
    activeCardId: string | null;
}

export interface AssessmentQuestion {
    text: string;
    options: string[];
}

export interface PlayerAssessmentProfile {
    mentalStrength: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNBREAKABLE';
    emotionalStyle: string;
    topDistraction: string;
    coachPreference: string;
}

export interface AIBlueprintPhase {
    phaseName: string;
    duration: string;
    focus: string;
    keyHabit: string;
}

export interface AIBlueprint {
    missionStatement: string;
    dailyRitual: string;
    phases: AIBlueprintPhase[];
}

export interface OnboardingData {
    primaryGoal?: string;
    lifeAreas: Record<string, number>;
    quizAnswers: Record<string, string>;
    calibrationScore?: number;
    mentalStrength?: string;
    emotionalStyle?: string;
    coachPreference?: string;
    topDistraction?: string;
}

export interface GameStore {
    user: UserProfile | null;
    currentDeck: Deck | null;
    battle: BattleState;
    chests: Chest[];
    activeScreen: string;
    isLoading: boolean;
    onboardingData: OnboardingData;
    assessmentQuestions: AssessmentQuestion[];
    generatedBlueprint: AIBlueprint | null;
    isGuestMode: boolean;
    screenHistory: string[];
    selectedCardId: string | null;

    setUser: (user: UserProfile) => void;
    setUserMode: (mode: UserMode) => void;
    updateResources: (resources: Partial<UserProfile>) => void;
    setDeck: (deck: Deck) => void;
    generateDeck: () => Promise<void>;
    setSelectedCard: (cardId: string | null) => void;
    initBattle: (deck: Deck) => void;
    completeCard: (cardId: string) => void;
    failCard: (cardId: string) => void;
    addChest: (chest: Chest) => void;
    unlockChest: (chestId: string) => void;
    setScreen: (screenName: string) => void;
    goBack: () => void;
    setLoading: (loading: boolean) => void;
    setArchetype: (archetype: ArchetypeId) => void;
    setPrimaryGoal: (goal: string) => void;
    setLifeAreas: (areas: Record<string, number>) => void;
    setAssessmentQuestions: (questions: AssessmentQuestion[]) => void;
    answerQuizQuestion: (q: string, a: string) => void;
    setCalibrationScore: (score: number) => void;
    setGeneratedProfile: (profile: Partial<PlayerAssessmentProfile>) => void;
    setBlueprint: (blueprint: AIBlueprint) => void;
    setGuestMode: (isGuest: boolean) => void;
}
