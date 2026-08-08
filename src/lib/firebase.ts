import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

// Fallback constants ensure production builds always have valid Firebase credentials embedded
const apiKey = (import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDF4OYeWUMtc_odsXetUolhoKuPYxQnHhk").trim();
const authDomain = (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rvan-2796c.firebaseapp.com").trim();
const projectId = (import.meta.env.VITE_FIREBASE_PROJECT_ID || "rvan-2796c").trim();
const storageBucket = (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rvan-2796c.firebasestorage.app").trim();
const messagingSenderId = (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "613710474824").trim();
const appId = (import.meta.env.VITE_FIREBASE_APP_ID || "1:613710474824:web:a447c5825d22b56a90b27d").trim();
const measurementId = (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-G4SWCE6CMT").trim();

const isKeyConfigured = Boolean(apiKey);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

if (isKeyConfigured) {
  try {
    const firebaseConfig = {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
      measurementId,
    };

    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // Initialize Analytics conditionally in browser if supported
    if (typeof window !== "undefined") {
      isSupported().then((supported) => {
        if (supported && app) {
          analytics = getAnalytics(app);
        }
      });
    }
  } catch (err: any) {
    console.warn("[Firebase Auth/Firestore] Error initializing Firebase SDK:", err?.message || err);
  }
}

export { app, auth, db, analytics, isKeyConfigured };
export default app;
