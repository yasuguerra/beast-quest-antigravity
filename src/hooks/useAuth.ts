import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db, updateUserProfile } from '../services/firebase';
import { useGameStore } from '../store/gameStore';
import { doc, onSnapshot } from 'firebase/firestore';
import { UserProfile } from '../types';

export const useAuth = () => {
    const [loading, setLoading] = useState(true);
    const { setUser, setGuestMode } = useGameStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
            if (firebaseUser) {
                // User is signed in, listen to their profile in Firestore
                const userRef = doc(db, 'users', firebaseUser.uid);

                const unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data() as UserProfile;
                        setUser(userData);

                        // --- Midnight Reset Logic ---
                        const lastActiveDate = userData.lastActive ? new Date(userData.lastActive).toISOString().split('T')[0] : null;
                        const today = new Date().toISOString().split('T')[0];

                        if (lastActiveDate !== today) {
                            console.log("New day detected! Triggering Midnight Reset...");
                            // Update last active
                            updateUserProfile(firebaseUser.uid, { lastActive: new Date().toISOString() });
                            // Generate new deck (store handles check if exists)
                            useGameStore.getState().generateDeck();
                        } else {
                            // Same day, just ensure deck is loaded
                            useGameStore.getState().generateDeck();
                        }

                    } else {
                        console.warn('User authenticated but no profile found in Firestore');
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching user profile:", error);
                    setLoading(false);
                });

                return () => unsubscribeSnapshot();
            } else {
                // User is signed out
                setUser(null);
                setGuestMode(false); // Reset guest mode on logout
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [setUser, setGuestMode]);

    return { loading };
};
