import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, User } from "firebase/auth";
import { auth, isKeyConfigured } from "../lib/firebase";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export interface AuthError {
  code: string;
  message: string;
}

/**
 * Executes Google Sign-In via popup with comprehensive error mapping.
 */
export async function signInWithGoogle(): Promise<User | null> {
  if (!auth || !isKeyConfigured) {
    console.warn("[Auth Warning] Cannot sign in: VITE_FIREBASE_API_KEY is not configured in .env file.");
    throw new Error("Google Authentication is not configured yet. Please supply a valid VITE_FIREBASE_API_KEY in your .env file.");
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    const code = error?.code || "auth/unknown-error";
    
    // Ignore benign user-initiated popup closures
    if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
      console.log("[Auth] Google Sign-In popup closed by user.");
      return null;
    }

    if (code === "auth/invalid-api-key") {
      console.error("[Auth Error] Invalid API Key provided in .env.");
      throw new Error("Invalid Firebase API Key in .env. Please update VITE_FIREBASE_API_KEY in your environment configuration.");
    }

    if (code === "auth/unauthorized-domain") {
      console.error("[Auth Error] Domain not authorized in Firebase Console -> Auth -> Settings -> Authorized Domains.");
      throw new Error("This domain is not authorized for Google Sign-In. Add localhost or rvan.me to Firebase Console.");
    }

    if (code === "auth/network-request-failed") {
      console.error("[Auth Error] Network request failed.");
      throw new Error("Network error during sign in. Check your connection.");
    }

    console.error(`[Auth Error] ${code}: ${error?.message}`);
    throw new Error(error?.message || "Failed to sign in with Google.");
  }
}

/**
 * Signs out the currently authenticated user.
 */
export async function logout(): Promise<void> {
  if (!auth) return;
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error("[Auth Error] Sign out failed:", error);
    throw new Error("Failed to sign out.");
  }
}
