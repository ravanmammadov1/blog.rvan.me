import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const apiKey = (import.meta.env.VITE_FIREBASE_API_KEY || "").trim();
const authDomain = (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rvan-2796c.firebaseapp.com").trim();
const projectId = (import.meta.env.VITE_FIREBASE_PROJECT_ID || "rvan-2796c").trim();
const storageBucket = (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rvan-2796c.appspot.com").trim();
const messagingSenderId = (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "").trim();
const appId = (import.meta.env.VITE_FIREBASE_APP_ID || "").trim();

const isKeyConfigured = Boolean(apiKey);

// Helper to safely mask secrets for console verification
const maskSecret = (val: string) => {
  if (!val) return "UNDEFINED / MISSING";
  if (val.length <= 8) return `${val.substring(0, 2)}***${val.substring(val.length - 2)}`;
  return `${val.substring(0, 6)}...${val.substring(val.length - 4)}`;
};

if (typeof window !== "undefined") {
  console.log("[Firebase Runtime Env Check]:", {
    VITE_FIREBASE_API_KEY: maskSecret(apiKey),
    VITE_FIREBASE_AUTH_DOMAIN: maskSecret(authDomain),
    VITE_FIREBASE_PROJECT_ID: maskSecret(projectId),
    VITE_FIREBASE_STORAGE_BUCKET: maskSecret(storageBucket),
    VITE_FIREBASE_MESSAGING_SENDER_ID: maskSecret(messagingSenderId),
    VITE_FIREBASE_APP_ID: maskSecret(appId),
  });
}

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
}

export { app, auth, isKeyConfigured };
export default app;
