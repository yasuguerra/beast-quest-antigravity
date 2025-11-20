import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
