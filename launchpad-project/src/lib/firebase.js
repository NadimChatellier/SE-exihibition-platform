// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKiLpVPhMxV21GhHI7FWymSuzTP1XkdaM",
  authDomain: "se-exibition.firebaseapp.com",
  projectId: "se-exibition",
  storageBucket: "se-exibition.firebasestorage.app",
  messagingSenderId: "25605836327",
  appId: "1:25605836327:web:1f64d5679a0d4ef4024802",
  measurementId: "G-T5SRD3NV9T",
};

// ✅ initialize app safely
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export { app, auth, db };
