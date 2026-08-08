import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const apiKey = (import.meta.env.VITE_FIREBASE_API_KEY || "").trim();
const authDomain = (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rvan-2796c.firebaseapp.com").trim();
const projectId = (import.meta.env.VITE_FIREBASE_PROJECT_ID || "rvan-2796c").trim();
const storageBucket = (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rvan-2796c.appspot.com").trim();
const messagingSenderId = (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "").trim();
const appId = (import.meta.env.VITE_FIREBASE_APP_ID || "").trim();

// Check if API key is a valid non-placeholder value
const isKeyConfigured = Boolean(
  apiKey &&
  !apiKey.includes("YOUR_FIREBASE_API_KEY") &&
  !apiKey.includes("your_firebase_api_key")
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (isKeyConfigured) {
  try {
    const firebaseConfig = {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
    };

    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (err: any) {
    console.warn("[Firebase Auth] Error initializing Firebase SDK:", err?.message || err);
  }
} else {
  console.warn(
    "[Firebase Auth Warning] VITE_FIREBASE_API_KEY is missing or contains placeholder in .env. Authentication running in graceful fallback mode to prevent app crash."
  );
}

export { app, auth, isKeyConfigured };
export default app;
