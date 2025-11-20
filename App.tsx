import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WelcomeScreen } from './src/components/screens/WelcomeScreen';
import { AvatarIdentityScreen } from './src/components/screens/AvatarIdentityScreen';
import { AuthLoginScreen } from './src/components/screens/AuthLoginScreen';
import { AuthRegisterScreen } from './src/components/screens/AuthRegisterScreen';
import { AssessmentFlowScreen } from './src/components/screens/AssessmentFlowScreen';
import { BlueprintRevealScreen } from './src/components/screens/BlueprintRevealScreen';
import { ModeSelectScreen } from './src/components/screens/ModeSelectScreen';
import { HomeDashboardScreen } from './src/components/screens/HomeDashboardScreen';
import { BattleOverviewScreen } from './src/components/screens/BattleOverviewScreen';
import { BattleResultScreen } from './src/components/screens/BattleResultScreen';
import { SuddenDeathScreen } from './src/components/screens/SuddenDeathScreen';
import { ChestsOverviewScreen } from './src/components/screens/ChestsOverviewScreen';
import { ChestOpenScreen } from './src/components/screens/ChestOpenScreen';
import { ShopHomeScreen } from './src/components/screens/ShopHomeScreen';
import { ProfileScreen } from './src/components/screens/ProfileScreen';
import { CoachHomeScreen } from './src/components/screens/CoachHomeScreen';
import { DistractionShieldScreen } from './src/components/screens/DistractionShieldScreen';

function App() {
    return (
        <Router>
            <div className="bg-black min-h-screen text-white font-sans antialiased">
                <Routes>
                    <Route path="/" element={<WelcomeScreen />} />
                    <Route path="/login" element={<AuthLoginScreen />} />
                    <Route path="/register" element={<AuthRegisterScreen />} />
                    <Route path="/avatar-selection" element={<AvatarIdentityScreen />} />
                    <Route path="/assessment-intro" element={<AssessmentFlowScreen />} />
                    <Route path="/blueprint-reveal" element={<BlueprintRevealScreen />} />
                    <Route path="/mode-select" element={<ModeSelectScreen />} />
                    <Route path="/dashboard" element={<HomeDashboardScreen />} />

                    {/* Battle System */}
                    <Route path="/battle-overview" element={<BattleOverviewScreen />} />
                    <Route path="/battle-result" element={<BattleResultScreen />} />
                    <Route path="/sudden-death" element={<SuddenDeathScreen />} />

                    {/* Gamification & Economy */}
                    <Route path="/chests" element={<ChestsOverviewScreen />} />
                    <Route path="/chest-open" element={<ChestOpenScreen />} />
                    <Route path="/shop" element={<ShopHomeScreen />} />
                    <Route path="/profile" element={<ProfileScreen />} />
                    <Route path="/coach" element={<CoachHomeScreen />} />
                    <Route path="/shield" element={<DistractionShieldScreen />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
