import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth, isKeyConfigured } from "../lib/firebase";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export interface AuthError {
  code: string;
  message: string;
}

/**
 * Handles redirect result on page load if user signed in via redirect.
 */
export async function checkRedirectResult(): Promise<User | null> {
  if (!auth) return null;
  try {
    const result = await getRedirectResult(auth);
    return result?.user || null;
  } catch (error: any) {
    console.warn("[Auth Warning] getRedirectResult error:", error?.message || error);
    return null;
  }
}

/**
 * Executes Google Sign-In with popup, falling back to redirect if popup is blocked.
 */
export async function signInWithGoogle(): Promise<User | null> {
  if (!auth || !isKeyConfigured) {
    console.warn("[Auth Warning] Cannot sign in: Firebase is not configured.");
    throw new Error("Google Authentication is currently unavailable.");
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

    // If popup was blocked by browser, try redirect flow
    if (code === "auth/popup-blocked") {
      console.warn("[Auth] Popup was blocked by browser. Falling back to redirect...");
      try {
        await signInWithRedirect(auth, googleProvider);
        return null;
      } catch (redirectError: any) {
        console.error("[Auth Error] Redirect sign-in failed:", redirectError);
        throw new Error("Popup blocked. Please allow popups or try again.");
      }
    }

    if (code === "auth/invalid-api-key") {
      console.error("[Auth Error] Invalid API Key provided in .env.");
      throw new Error("Authentication configuration error. Please contact administrator.");
    }

    if (code === "auth/unauthorized-domain") {
      console.error("[Auth Error] Domain not authorized in Firebase Console.");
      throw new Error("This domain is not authorized for Google Sign-In.");
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
