import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, updateDoc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { UserProfile } from "../types";

const firebaseConfig = {
  apiKey: "AIzaSyDIbQA-_0Fl02bNPx8-Kb-dWu8AwJ87sa0",
  authDomain: "quest-beast-vs.firebaseapp.com",
  projectId: "quest-beast-vs",
  storageBucket: "quest-beast-vs.firebasestorage.app",
  messagingSenderId: "644719883786",
  appId: "1:644719883786:web:d67577e513a2c44a1311f3",
  measurementId: "G-1M325CN9BP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };

// --- Firestore Helpers ---

export const createUserProfile = async (uid: string, profileData: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, profileData, { merge: true });
    console.log("User profile created/updated for:", uid);
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, updates);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// --- Deck Helpers ---

export const getDailyDeck = async (uid: string, dateId: string): Promise<any | null> => {
  try {
    const deckRef = doc(db, "decks", `${dateId}_${uid}`);
    const docSnap = await getDoc(deckRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching daily deck:", error);
    return null;
  }
};

export const saveDailyDeck = async (deck: any) => {
  try {
    // Deck ID format: YYYY-MM-DD_uid
    // We assume the deck object already has an ID or we construct the ref manually
    // For safety, let's use the ID from the deck object if it matches our schema, 
    // or construct one. The store should ideally handle the ID generation.
    // Let's assume deck.id is the document ID.
    const deckRef = doc(db, "decks", deck.id);
    await setDoc(deckRef, deck);
    console.log("Deck saved:", deck.id);
  } catch (error) {
    console.error("Error saving daily deck:", error);
    throw error;
  }
};

export const updateDeckCard = async (deckId: string, cards: any[]) => {
  try {
    const deckRef = doc(db, "decks", deckId);
    await updateDoc(deckRef, { cards });
  } catch (error) {
    console.error("Error updating deck cards:", error);
    throw error;
  }
};

// --- Coach Helpers ---

export const saveCoachInteraction = async (uid: string, message: string, type: 'GREETING' | 'MOTIVATION' | 'WARNING' | 'CELEBRATION') => {
  try {
    // We'll store interactions in a subcollection for scalability
    // users/{uid}/coach_memory/{timestamp}
    const memoryRef = doc(db, "users", uid, "coach_memory", new Date().toISOString());
    await setDoc(memoryRef, {
      message,
      type,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error saving coach interaction:", error);
    throw error;
  }
};

export const getCoachHistory = async (uid: string, limitCount: number = 10): Promise<any[]> => {
  try {
    const memoryRef = collection(db, "users", uid, "coach_memory");
    const q = query(memoryRef, orderBy("timestamp", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching coach history:", error);
    return [];
  }
};

// --- Inventory Helpers ---

export const addToInventory = async (uid: string, items: any[]) => {
  try {
    // We'll add items to a subcollection 'inventory'
    // For simplicity, each item is a new doc. In production, we might stack duplicates.
    const inventoryRef = collection(db, "users", uid, "inventory");

    const batchPromises = items.map(item => {
      // Create a new doc reference with auto-ID
      const itemDoc = doc(inventoryRef);
      return setDoc(itemDoc, { ...item, acquiredAt: new Date().toISOString() });
    });

    await Promise.all(batchPromises);
    console.log(`Added ${items.length} items to inventory for ${uid}`);
  } catch (error) {
    console.error("Error adding to inventory:", error);
    throw error;
  }
};

export const getInventory = async (uid: string): Promise<any[]> => {
  try {
    const inventoryRef = collection(db, "users", uid, "inventory");
    const q = query(inventoryRef, orderBy("acquiredAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
};

// --- Goals Helpers ---

export const createGoal = async (uid: string, goal: any) => {
  try {
    const goalsRef = collection(db, "goals");
    const goalDoc = doc(goalsRef);
    await setDoc(goalDoc, { ...goal, userId: uid, id: goalDoc.id, createdAt: new Date().toISOString() });
    return goalDoc.id;
  } catch (error) {
    console.error("Error creating goal:", error);
    throw error;
  }
};

export const getUserGoals = async (uid: string): Promise<any[]> => {
  try {
    const goalsRef = collection(db, "goals");
    const q = query(goalsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    // Filter by userId client-side (add Firestore index for where clause in production)
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((goal: any) => goal.userId === uid);
  } catch (error) {
    console.error("Error fetching goals:", error);
    return [];
  }
};

export const updateGoalProgress = async (goalId: string, progress: number) => {
  try {
    const goalRef = doc(db, "goals", goalId);
    await updateDoc(goalRef, { progress, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Error updating goal:", error);
    throw error;
  }
};

// --- Habits Helpers ---

export const createHabit = async (uid: string, habit: any) => {
  try {
    const habitsRef = collection(db, "habits");
    const habitDoc = doc(habitsRef);
    await setDoc(habitDoc, {
      ...habit,
      userId: uid,
      id: habitDoc.id,
      createdAt: new Date().toISOString(),
      streak: 0,
      bestStreak: 0
    });
    return habitDoc.id;
  } catch (error) {
    console.error("Error creating habit:", error);
    throw error;
  }
};

export const getUserHabits = async (uid: string): Promise<any[]> => {
  try {
    const habitsRef = collection(db, "habits");
    const q = query(habitsRef);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((habit: any) => habit.userId === uid && habit.isActive);
  } catch (error) {
    console.error("Error fetching habits:", error);
    return [];
  }
};

export const completeHabit = async (habitId: string) => {
  try {
    const habitRef = doc(db, "habits", habitId);
    const habitSnap = await getDoc(habitRef);

    if (habitSnap.exists()) {
      const habitData = habitSnap.data();
      const newStreak = (habitData.streak || 0) + 1;
      const newBestStreak = Math.max(newStreak, habitData.bestStreak || 0);

      await updateDoc(habitRef, {
        streak: newStreak,
        bestStreak: newBestStreak,
        lastCompleted: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Error completing habit:", error);
    throw error;
  }
};

// --- Achievements Helpers ---

export const getUserAchievements = async (uid: string): Promise<any[]> => {
  try {
    const achievementsRef = collection(db, "users", uid, "achievements");
    const querySnapshot = await getDocs(achievementsRef);

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return [];
  }
};

export const unlockAchievement = async (uid: string, achievementId: string) => {
  try {
    const achievementRef = doc(db, "users", uid, "achievements", achievementId);
    await setDoc(achievementRef, {
      achievementId,
      unlockedAt: new Date().toISOString()
    });
    console.log(`Achievement ${achievementId} unlocked for ${uid}`);
  } catch (error) {
    console.error("Error unlocking achievement:", error);
    throw error;
  }
};

// --- Arena Progression Helpers ---

export const updateArenaProgress = async (uid: string, arenaData: {
  currentArena: string;
  currentMiniLeague: string;
  trophies: number;
}) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      currentArena: arenaData.currentArena,
      currentMiniLeague: arenaData.currentMiniLeague,
      trophies: arenaData.trophies,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating arena progress:", error);
    throw error;
  }
};

export const recordArenaPromotion = async (uid: string, arenaId: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const arenaHistory = userData.arenaHistory || [];

      await updateDoc(userRef, {
        arenaHistory: [...arenaHistory, arenaId],
        lastArenaPromotion: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Error recording arena promotion:", error);
    throw error;
  }
};

// --- Statistics Helpers ---

export const saveDailyStats = async (uid: string, stats: any) => {
  try {
    const statsRef = doc(db, "users", uid, "daily_stats", stats.date);
    await setDoc(statsRef, stats);
  } catch (error) {
    console.error("Error saving daily stats:", error);
    throw error;
  }
};

export const getDailyStats = async (uid: string, date: string): Promise<any | null> => {
  try {
    const statsRef = doc(db, "users", uid, "daily_stats", date);
    const statsSnap = await getDoc(statsRef);

    return statsSnap.exists() ? statsSnap.data() : null;
  } catch (error) {
    console.error("Error fetching daily stats:", error);
    return null;
  }
};

