import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, User } from "firebase/auth";
import { auth } from "../lib/firebase";

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

    if (code === "auth/unauthorized-domain") {
      console.error("[Auth Error] This domain is not authorized in Firebase Console -> Auth -> Settings -> Authorized Domains.");
      throw new Error("This domain is not authorized for Google Sign-In. Please add it to Firebase Console.");
    }

    if (code === "auth/network-request-failed") {
      console.error("[Auth Error] Network request failed. Check internet connection.");
      throw new Error("Network error during sign in. Please check your connection and try again.");
    }

    console.error(`[Auth Error] ${code}: ${error?.message}`);
    throw new Error(error?.message || "Failed to sign in with Google.");
  }
}

/**
 * Signs out the currently authenticated user.
 */
export async function logout(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error("[Auth Error] Sign out failed:", error);
    throw new Error("Failed to sign out.");
  }
}
