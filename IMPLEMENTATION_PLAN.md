# Engineering Assessment & Implementation Plan
## Project: Beast Quest

### 1. Executive Summary
This document outlines the technical architecture for **Beast Quest**, transforming the React Native PRD into a high-performance React Web Application (PWA compatible). The system relies heavily on **Gemini 2.5** for dynamic content generation (Life Engine, Coach Engine) and **Firebase** for real-time data synchronization.

**LANGUAGE REQUIREMENT:** The entire application, including code comments, metadata, and user-facing text, must be in **ENGLISH**. The tone must remain aggressive ("Beast Mode") as per the PRD.

### 2. Technical Architecture

#### Frontend (React + TypeScript + Vite)
*   **Runtime:** React 18+
*   **Styling:** Tailwind CSS (Mobile-first, Dark Mode "Beast" Aesthetic).
*   **State Management:** `Zustand` for global game state (User Profile, Resources, Active Deck).
*   **Routing:** `React Router` (HashRouter for portability).
*   **Animation:** `Framer Motion` (Cards, Chest openings) + `Lottie` (Celebrations).

#### Backend & AI Layers (Simulated/Serverless)
*   **AI Service:** Direct integration with `@google/genai` for the prototype phase, abstracting to Cloud Functions later.
*   **Engines:**
    *   **Assessment Engine:** Gemini 2.0 Pro (Complex analysis).
    *   **Coach Engine:** Gemini 2.5 Flash (Low latency, persona-based).
    *   **Life Engine:** Generates JSON-structured Cards/Decks.

#### Data Schema (Firestore Mapped)
We will enforce strict typing in `types.ts` to mirror the PRD's Firestore schema:
*   `users`: Profile, XP, Level, Arena ID.
*   `goals`: Active objectives.
*   `cards`: The atomic unit of the game (Habits/Tasks).
*   `decks`: Daily generated arrays of cards.
*   `arenas`: Configuration for thresholds and themes.

### 3. Phased Implementation Strategy

#### Phase 1: The Foundation (Complete)
*   **Core Skeleton:** Project structure, Types, Tailwind configuration.
*   **AI Integration:** Basic Gemini connection for "Coach" testing.
*   **State Store:** Zustand setup for Resources (Gold, Gems) and User Profile.
*   **Localization:** Anglicized all metadata and types.

#### Phase 2: Onboarding & Deep Assessment (Next)
*   **Screens:** Welcome, Auth, Avatar Selection, Purpose, Deep Goal Quiz.
*   **AI Task:** "Life Assessment Engine" to generate the `PlayerProfile`.

#### Phase 3: The Core Loop (Dashboard & Deck)
*   **Screens:** Home Dashboard, Daily Deck View, Card Detail.
*   **AI Task:** "Life Engine" to generate a daily deck based on the profile.

#### Phase 4: Battle & Gamification
*   **Screens:** Battle Mode, Results, Sudden Death.
*   **Features:** XP Calculation, Streak logic, "Press" mechanics.

#### Phase 5: Economy & Rewards
*   **Screens:** Chest Opening, Store, Inventory.
*   **Features:** Loot tables, Rarity logic (Common -> God Tier).

### 4. Immediate Next Steps
We are currently moving to **Phase 2**. The next tasks are:
1.  Build the `AvatarIdentityScreen` (Beast/Warrior/Strategist selection).
2.  Build the `UserPurposeScreen` (Goal definition).
3.  Implement the `DeepGoalQuizScreen` using Gemini to generate dynamic questions based on the user's goal.