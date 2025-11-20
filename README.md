# Beast Quest: Rise of the Fucking Monstruo

An AI-first personal transformation app that gamifies life goals using a Clash Royale-style card system. Built with React, Firebase, and Google Cloud (Vertex AI).

## 🎮 Features

- **AI-Powered Onboarding**: Deep psychological assessment to create personalized 90-day transformation blueprints
- **Daily Deck System**: AI-generated daily tasks and habits as game cards
- **Battle Mode**: Gamified task completion with HP, timers, and rewards
- **Gamification**: Trophies, chests, XP, levels, and in-app economy
- **AI Coach**: Tone-aware motivational messaging powered by Gemini
- **Anti-Fuga Engine**: Distraction monitoring and emergency interventions
- **Arena System**: Progressive leagues and boss fights

## 🛠️ Tech Stack

### Frontend
- **React** (Vite) + TypeScript
- **TailwindCSS** for styling
- **Zustand** for state management
- **React Router** for navigation

### Backend
- **Firebase**:
  - Authentication
  - Firestore (database)
  - Cloud Storage
  - Cloud Functions
- **Google Cloud**:
  - Vertex AI (Gemini 1.5 Flash)
  - Cloud Build
  - Artifact Registry

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Firebase CLI
- Google Cloud account with Vertex AI enabled

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yasuguerra/beast-quest-antigravity.git
   cd beast-quest-antigravity
   ```

2. Install dependencies:
   ```bash
   npm install
   cd functions && npm install && cd ..
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Authenticate with Google Cloud:
   ```bash
   gcloud auth application-default login
   ```

5. Set active Firebase project:
   ```bash
   firebase use quest-beast-vs
   ```

### Running Locally

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Deploying Backend

Deploy Cloud Functions and Firestore rules:
```bash
firebase deploy --only "functions,firestore"
```

## 📁 Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── game/           # Game-specific components (Card, etc.)
│   │   └── screens/        # Screen components
│   ├── services/
│   │   ├── firebase.ts     # Firebase config
│   │   └── ai.ts           # Gemini AI service
│   ├── store/
│   │   └── gameStore.ts    # Zustand state management
│   └── types/
│       └── index.ts        # TypeScript definitions
├── functions/              # Firebase Cloud Functions
│   └── src/
│       └── index.ts        # AI engines (Coach, Deck, Assessment)
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore indexes
└── firebase.json           # Firebase configuration
```

## 🎯 Core Concepts

### Cards
Each task or habit is represented as a card with:
- **Rarity**: Common, Rare, Epic, Legendary
- **Type**: HABIT, TASK, RITUAL
- **Energy Cost**: Required focus/effort
- **Rewards**: XP, Trophies, Gems

### Battle System
- Complete tasks within a time limit
- HP system for accountability
- Sudden Death mode for critical failures
- Dynamic rewards based on performance

### AI Engines
- **Life Assessment Engine**: Analyzes user goals and generates profiles
- **Life Engine AI**: Generates daily decks based on user state
- **Coach Engine**: Provides tone-aware motivational messaging
- **Anti-Fuga Engine**: Monitors distractions and intervenes
- **Reward Engine**: Balances loot and progression

## 📝 License

Private project - All rights reserved

## 🙏 Acknowledgments

Built with assistance from Antigravity AI
