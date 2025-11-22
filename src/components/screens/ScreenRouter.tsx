import React from 'react';
import { useGameStore } from '../../store/gameStore';

// Import all screens
import { WelcomeScreen } from './WelcomeScreen';
import { AvatarIdentityScreen } from './AvatarIdentityScreen';
import { AuthLoginScreen } from './AuthLoginScreen';
import { AuthRegisterScreen } from './AuthRegisterScreen';
import { OnboardingIntroScreen } from './OnboardingIntroScreen';
import { UserPurposeScreen } from './UserPurposeScreen';
import { LifeAreasPriorityScreen } from './LifeAreasPriorityScreen';
import { DeepGoalQuizScreen } from './DeepGoalQuizScreen';
import { LifestyleQuizScreen } from './LifestyleQuizScreen';
import { DistractionQuizScreen } from './DistractionQuizScreen';
import { DisciplineToleranceScreen } from './DisciplineToleranceScreen';
import { CoachingStyleScreen } from './CoachingStyleScreen';
import { CarismaSocialQuizScreen } from './CarismaSocialQuizScreen';
import { MotivationTypeQuizScreen } from './MotivationTypeQuizScreen';
import { DifficultyCalibrationScreen } from './DifficultyCalibrationScreen';
import { PersonaProfileScreen } from './PersonaProfileScreen';
import { BlueprintRevealScreen } from './BlueprintRevealScreen';
import { ModeSelectScreen } from './ModeSelectScreen';
import { HomeDashboardScreen } from './HomeDashboardScreen';
import { BattleOverviewScreen } from './BattleOverviewScreen';
import { BattleResultScreen } from './BattleResultScreen';
import { SuddenDeathScreen } from './SuddenDeathScreen';
import { ChestsOverviewScreen } from './ChestsOverviewScreen';
import { ChestOpenScreen } from './ChestOpenScreen';
import { ShopScreen } from './ShopScreen';
import { ProfileScreen } from './ProfileScreen';
import { CoachHomeScreen } from './CoachHomeScreen';
import { DistractionShieldScreen } from './DistractionShieldScreen';
import { ArenaOverviewScreen } from './ArenaOverviewScreen';
import { GoalsOverviewScreen } from './GoalsOverviewScreen';
import { HabitsOverviewScreen } from './HabitsOverviewScreen';
import { EmotionCheckInScreen } from './EmotionCheckInScreen';
import { AssessmentFlowScreen } from './AssessmentFlowScreen';
import { ArenaPromotionScreen } from './ArenaPromotionScreen';
import { ModeRecommendationScreen } from './ModeRecommendationScreen';
import { FirstBattleIntroScreen } from './FirstBattleIntroScreen';
import { CardDetailScreen } from './CardDetailScreen';
import { CardSwapScreen } from './CardSwapScreen';
import { SettingsScreen } from './SettingsScreen';
import { CoachSessionScreen } from './CoachSessionScreen';
import { StateBoostScreen } from './StateBoostScreen';
import { EmergencyRescueScreen } from './EmergencyRescueScreen';
import { MindsetLibraryScreen } from './MindsetLibraryScreen';
import { CarismaTrainingScreen } from './CarismaTrainingScreen';
import { AppUsageMonitorScreen } from './AppUsageMonitorScreen';

/**
 * Central Screen Router
 * Routes to screens based on gameStore.activeScreen
 * This allows for state-based navigation without React Router for the onboarding flow
 */
export const ScreenRouter: React.FC = () => {
    const { activeScreen } = useGameStore();

    // Screen mapping
    const screens: Record<string, React.ReactElement> = {
        WelcomeScreen: <WelcomeScreen />,
        AvatarIdentityScreen: <AvatarIdentityScreen />,
        AuthLoginScreen: <AuthLoginScreen />,
        AuthRegisterScreen: <AuthRegisterScreen />,
        OnboardingIntroScreen: <OnboardingIntroScreen />,
        UserPurposeScreen: <UserPurposeScreen />,
        LifeAreasPriorityScreen: <LifeAreasPriorityScreen />,
        DeepGoalQuizScreen: <DeepGoalQuizScreen />,
        LifestyleQuizScreen: <LifestyleQuizScreen />,
        DistractionQuizScreen: <DistractionQuizScreen />,
        DisciplineToleranceScreen: <DisciplineToleranceScreen />,
        CoachingStyleScreen: <CoachingStyleScreen />,
        CarismaSocialQuizScreen: <CarismaSocialQuizScreen />,
        MotivationTypeQuizScreen: <MotivationTypeQuizScreen />,
        DifficultyCalibrationScreen: <DifficultyCalibrationScreen />,
        PersonaProfileScreen: <PersonaProfileScreen />,
        BlueprintRevealScreen: <BlueprintRevealScreen />,
        AIOnboardingSummaryScreen: <BlueprintRevealScreen />, // Alias
        ModeRecommendationScreen: <ModeRecommendationScreen />,
        ModeSelectScreen: <ModeSelectScreen />,
        FirstBattleIntroScreen: <FirstBattleIntroScreen />,
        HomeDashboardScreen: <HomeDashboardScreen />,
        BattleOverviewScreen: <BattleOverviewScreen />,
        BattleResultScreen: <BattleResultScreen />,
        SuddenDeathScreen: <SuddenDeathScreen />,
        ChestsOverviewScreen: <ChestsOverviewScreen />,
        ChestOpenScreen: <ChestOpenScreen />,
        ShopScreen: <ShopScreen />,
        ShopHomeScreen: <ShopScreen />, // Alias for backward compatibility
        ProfileScreen: <ProfileScreen />,
        CoachHomeScreen: <CoachHomeScreen />,
        DistractionShieldScreen: <DistractionShieldScreen />,
        ArenaOverviewScreen: <ArenaOverviewScreen />,
        ArenaPromotionScreen: <ArenaPromotionScreen />,
        GoalsOverviewScreen: <GoalsOverviewScreen />,
        HabitsOverviewScreen: <HabitsOverviewScreen />,
        EmotionCheckInScreen: <EmotionCheckInScreen />,
        AssessmentFlowScreen: <AssessmentFlowScreen />,
        CardDetailScreen: <CardDetailScreen />,
        CardSwapScreen: <CardSwapScreen />,
        SettingsScreen: <SettingsScreen />,
        CoachSessionScreen: <CoachSessionScreen />,
        StateBoostScreen: <StateBoostScreen />,
        EmergencyRescueScreen: <EmergencyRescueScreen />,
        MindsetLibraryScreen: <MindsetLibraryScreen />,
        CarismaTrainingScreen: <CarismaTrainingScreen />,
        AppUsageMonitorScreen: <AppUsageMonitorScreen />,
    };

    // Return the appropriate screen or fallback to Welcome
    return screens[activeScreen] || <WelcomeScreen />;
};
