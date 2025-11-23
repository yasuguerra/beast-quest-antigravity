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
    RITUAL = 'RITUAL',
    SOCIAL = 'SOCIAL',
    BUSINESS = 'BUSINESS',
    ANTI_FUGA = 'ANTI_FUGA',
    DUELO = 'DUELO',
    SOMBRA = 'SOMBRA',
    BOOST = 'BOOST',
    FURIA = 'FURIA',
    IDENTIDAD = 'IDENTIDAD'
}

export enum CardRarity {
    COMMON = 'COMMON',
    RARE = 'RARE',
    EPIC = 'EPIC',
    LEGENDARY = 'LEGENDARY',
    MAESTRA = 'MAESTRA' // Arena 8 only
}

export enum ChestType {
    COMMON = 'COMMON',
    RARE = 'RARE',
    EPIC = 'EPIC',
    LEGENDARY = 'LEGENDARY',
    BEAST = 'BEAST',
    DIVINE = 'DIVINE'
}

export enum ArenaId {
    DESPERTAR = 'DESPERTAR',              // Arena 1: 0-99 trophies
    DISCIPLINA = 'DISCIPLINA',            // Arena 2: 100-299
    FOCO_ENERGIA = 'FOCO_ENERGIA',        // Arena 3: 300-599
    PODER_PERSONAL = 'PODER_PERSONAL',    // Arena 4: 600-999
    EJECUCION = 'EJECUCION',              // Arena 5: 1000-1499
    PRESENCIA = 'PRESENCIA',              // Arena 6: 1500-2199
    MONSTRUO = 'MONSTRUO',                // Arena 7: 2200-2999
    LEYENDA = 'LEYENDA'                   // Arena 8: 3000+
}

export enum MiniLeague {
    BRONZE = 'BRONZE',
    SILVER = 'SILVER',
    GOLD = 'GOLD'
}

export enum CoachTone {
    GUIDE = 'GUIDE',                      // Arena 1-2
    FIRM = 'FIRM',                        // Arena 3-5
    BEAST = 'BEAST',                      // Arena 6-7
    LEGENDARY = 'LEGENDARY'               // Arena 8
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

    // Resources (Economy)
    gold: number;
    gems: number;
    fragments: number;
    monsterSouls: number;
    keys: number;

    // Progression
    streakDays: number;
    bestStreak: number;
    lastActive: string;

    // Arena System
    currentArena: ArenaId;
    currentMiniLeague: MiniLeague;
    arenaHistory: ArenaId[];

    // Coach System
    coachLevel: number;
    coachAfinidad: number;
    preferredCoachTone: CoachTone;

    // State Tracking
    currentEmotionalState?: EmotionalState;
    lastEmotionCheckIn?: string;

    // Achievements
    achievementsUnlocked: string[];

    // Weekly Loop
    weeklyStats?: WeeklyStats;

    // Subscription
    isPrime: boolean;
    primeExpiresAt?: string;
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
    weeklyStats: WeeklyStats;
    inventory: Inventory;

    setUser: (user: UserProfile) => void;
    setUserMode: (mode: UserMode) => void;
    updateResources: (resources: Partial<UserProfile>) => void;
    setDeck: (deck: Deck) => void;
    generateDeck: () => Promise<void>;
    generateFirstBattleDeck: () => Promise<void>;
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

    // Weekly Loop
    checkWeeklyCycle: () => void;
    completeWeeklyReview: () => void;

    // Settings (Sprint 2)
    settings: GameSettings;
    toggleSound: () => void;
    toggleHaptics: () => void;
    toggleNotifications: () => void;

    // Economy Actions
    addGold: (amount: number) => void;
    spendGold: (amount: number) => void;
    addGems: (amount: number) => void;
    spendGems: (amount: number) => void;
}

export interface GameSettings {
    soundEnabled: boolean;
    hapticsEnabled: boolean;
    notificationsEnabled: boolean;
}

// ============================================
// ARENA SYSTEM (PRD Phase 2)
// ============================================

export interface Arena {
    id: ArenaId;
    name: string;
    description: string;
    trophyMin: number;
    trophyMax: number;
    coachTone: CoachTone;
    rewards: ArenaReward[];
    bossName?: string;
    unlocksAt: number;
}

export interface ArenaReward {
    type: 'CARD' | 'CHEST' | 'RITUAL' | 'BOOSTER';
    id: string;
    name: string;
}

export interface PlayerArenaState {
    currentArena: ArenaId;
    currentMiniLeague: MiniLeague;
    arenaHistory: ArenaId[];
    bossesDefeated: string[];
}

// ============================================
// GOALS & HABITS SYSTEM (PRD Phase 2)
// ============================================

export enum GoalType {
    MACRO = 'MACRO',       // 90-day goal
    SUB = 'SUB',           // Monthly sub-goal
    MICRO = 'MICRO'        // Weekly target
}

export interface Goal {
    id: string;
    userId: string;
    type: GoalType;
    title: string;
    description: string;
    targetDate: string;
    progress: number;      // 0-100
    parentGoalId?: string; // For sub/micro goals
    createdAt: string;
}

export enum HabitCategory {
    CORE = 'CORE',         // Fixed daily habits
    DYNAMIC = 'DYNAMIC',   // AI-generated
    SEASONAL = 'SEASONAL', // Time-limited
    BESTIAL = 'BESTIAL'    // Beast mode only
}

export interface Habit {
    id: string;
    userId: string;
    category: HabitCategory;
    title: string;
    description: string;
    frequency: 'DAILY' | 'WEEKLY';
    streak: number;
    bestStreak: number;
    lastCompleted?: string;
    isActive: boolean;
}

// ============================================
// ACHIEVEMENT SYSTEM (PRD Phase 5)
// ============================================

export enum AchievementTier {
    BRONZE = 'BRONZE',
    SILVER = 'SILVER',
    GOLD = 'GOLD',
    PLATINUM = 'PLATINUM',
    LEGENDARY = 'LEGENDARY'
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    tier: AchievementTier;
    icon: string;
    unlockedAt?: string;
    progress: number;    // 0-100
    requirement: number; // e.g., "Complete 100 cards"
}

// ============================================
// NOTIFICATION SYSTEM (PRD Phase 3)
// ============================================

export enum NotificationType {
    EMOTIONAL = 'EMOTIONAL',
    STRATEGIC = 'STRATEGIC',
    PROGRESS = 'PROGRESS',
    ANTI_FUGA = 'ANTI_FUGA',
    CELEBRATION = 'CELEBRATION',
    URGENCY = 'URGENCY',
    COACH_DIRECT = 'COACH_DIRECT',
    NARRATIVE = 'NARRATIVE',
    REWARD_LOOT = 'REWARD_LOOT'
}

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    scheduledFor: string;
    sentAt?: string;
    clickedAt?: string;
    metadata?: Record<string, any>;
}

// ============================================
// EMOTION & RISK ENGINES (PRD Phase 3)
// ============================================

export enum EmotionalState {
    MOTIVATED = 'MOTIVATED',
    TIRED = 'TIRED',
    ANXIOUS = 'ANXIOUS',
    DISPERSED = 'DISPERSED',
    EUPHORIC = 'EUPHORIC',
    SAD = 'SAD',
    STABLE = 'STABLE'
}

export interface EmotionCheckIn {
    id: string;
    userId: string;
    state: EmotionalState;
    energy: number;        // 0-100
    willpower: number;     // 0-100
    focus: number;         // 0-100
    timestamp: string;
}

export interface RiskScore {
    abandonmentRisk: number;  // 0-100
    procrastinationRisk: number;
    burnoutRisk: number;
    lastCalculated: string;
}

// ============================================
// ECONOMY & RESOURCES (PRD Phase 1 & 4)
// ============================================

export enum ResourceType {
    GOLD = 'GOLD',
    GEMS = 'GEMS',
    FRAGMENTS = 'FRAGMENTS',
    MONSTER_SOULS = 'MONSTER_SOULS',
    KEYS = 'KEYS',
    XP_BOOSTER = 'XP_BOOSTER',
    TROPHY_BOOSTER = 'TROPHY_BOOSTER',
    FRAGMENT_BOOSTER = 'FRAGMENT_BOOSTER'
}

export interface Resource {
    type: ResourceType;
    amount: number;
    expiresAt?: string; // For boosters
}

export interface Inventory {
    userId: string;
    resources: Resource[];
    items: InventoryItem[];
}

export interface InventoryItem {
    id: string;
    type: 'RITUAL' | 'SKIN' | 'CARD' | 'AVATAR';
    name: string;
    rarity: CardRarity;
    acquiredAt: string;
}

// ============================================
// COACH SYSTEM (PRD Phase 3)
// ============================================

export interface CoachState {
    level: number;         // 1-10
    afinidad: number;      // 0-100 (user-coach bond)
    currentTone: CoachTone;
    messagesDelivered: number;
    lastInteraction: string;
}

export interface CoachMessage {
    id: string;
    userId: string;
    type: 'GREETING' | 'MOTIVATION' | 'WARNING' | 'CELEBRATION' | 'INTERVENTION';
    content: string;
    tone: CoachTone;
    deliveredAt: string;
}

// ============================================
// STATISTICS & ANALYTICS (PRD Phase 5)
// ============================================

export interface DailyStats {
    date: string;
    cardsCompleted: number;
    xpEarned: number;
    trophiesEarned: number;
    timeInvestedMinutes: number;
    energyLevel: number;
}

export interface WeeklyStats {
    weekStart: string;
    daysCompleted: number;
    totalCards: number;
    totalXP: number;
    totalTrophies: number;
    timeTotal: number;
    topArea: string;
    weakArea: string;
}

export interface MonthlyStats {
    monthStart: string;
    daysCompleted: number;
    longestStreak: number;
    totalXP: number;
    totalTrophies: number;
    cardsCompleted: number;
    goalsAdvanced: number;
}

// ============================================
// SHOP & MONETIZATION (PRD Phase 6)
// ============================================

export enum PurchaseType {
    GEMS = 'GEMS',
    CHEST = 'CHEST',
    SUBSCRIPTION = 'SUBSCRIPTION',
    RITUAL = 'RITUAL',
    SKIN = 'SKIN',
    BOOSTER = 'BOOSTER'
}

export interface ShopOffer {
    id: string;
    type: PurchaseType;
    name: string;
    description: string;
    priceUSD: number;
    discount?: number;
    isFlashOffer: boolean;
    expiresAt?: string;
    items: Resource[];
}

export interface Subscription {
    userId: string;
    tier: 'PRIME';
    active: boolean;
    startedAt: string;
    expiresAt: string;
    autoRenew: boolean;
}

