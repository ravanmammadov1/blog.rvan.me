import React, { createContext, useEffect, useState, ReactNode, useCallback } from "react";
import { User, onAuthStateChanged, updateProfile as updateFirebaseProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage, isKeyConfigured } from "../lib/firebase";
import { signInWithGoogle, checkRedirectResult, logout } from "../services/auth";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  customAvatar: string | null;
  bio?: string | null;
  updatedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  userPhoto: string | null;
  customAvatar: string | null;
  updateCustomAvatar: (avatarUrl: string | null) => void;
  uploadAvatarBlob: (blob: Blob) => Promise<string>;
  updateBio: (bio: string) => void;
  updateDisplayName: (name: string) => Promise<void>;
  signIn: () => Promise<User | null>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);

  // Helper to load persistent profile from localStorage
  const loadUserProfile = useCallback((currentUser: User | null) => {
    if (!currentUser?.uid) {
      setProfile(null);
      setCustomAvatar(null);
      return;
    }

    try {
      const storageKey = `rvan_user_profile_${currentUser.uid}`;
      const legacyAvatarKey = `rvan_user_avatar_${currentUser.uid}`;

      let savedCustomPhoto = localStorage.getItem(legacyAvatarKey);
      let savedBio = "";

      const storedProfileRaw = localStorage.getItem(storageKey);
      if (storedProfileRaw) {
        const parsed = JSON.parse(storedProfileRaw);
        if (parsed.customAvatar) savedCustomPhoto = parsed.customAvatar;
        if (parsed.bio) savedBio = parsed.bio;
      }

      setCustomAvatar(savedCustomPhoto);

      const userProfile: UserProfile = {
        uid: currentUser.uid,
        displayName: currentUser.displayName || currentUser.email?.split("@")[0] || "User",
        email: currentUser.email,
        photoURL: currentUser.photoURL,
        customAvatar: savedCustomPhoto,
        bio: savedBio,
        updatedAt: new Date().toISOString(),
      };

      setProfile(userProfile);
    } catch (e) {
      console.warn("Failed to load user profile from storage:", e);
    }
  }, []);

  useEffect(() => {
    if (!auth || !isKeyConfigured) {
      setUser(null);
      setProfile(null);
      setCustomAvatar(null);
      setLoading(false);
      return;
    }

    // Check for redirect result on page load
    checkRedirectResult()
      .then((redirectUser) => {
        if (redirectUser) {
          setUser(redirectUser);
          loadUserProfile(redirectUser);
        }
      })
      .catch((err) => {
        console.warn("Redirect result check error:", err);
      });

    // Listen for persistent Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        loadUserProfile(currentUser);
        setLoading(false);
      },
      (err) => {
        console.error("[Auth Context Error] Auth state listener error:", err);
        setError(err.message);
        setUser(null);
        setProfile(null);
        setCustomAvatar(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [loadUserProfile]);

  const updateCustomAvatar = (avatarUrl: string | null) => {
    if (!user?.uid) return;
    try {
      const legacyKey = `rvan_user_avatar_${user.uid}`;
      const profileKey = `rvan_user_profile_${user.uid}`;

      if (avatarUrl) {
        // Cache bust if not data URI
        const finalUrl = avatarUrl.startsWith("data:") ? avatarUrl : `${avatarUrl}${avatarUrl.includes("?") ? "&" : "?"}t=${Date.now()}`;
        localStorage.setItem(legacyKey, finalUrl);
        setCustomAvatar(finalUrl);
      } else {
        localStorage.removeItem(legacyKey);
        setCustomAvatar(null);
      }

      setProfile((prev) => {
        const next: UserProfile = {
          uid: user.uid,
          displayName: user.displayName || "User",
          email: user.email,
          photoURL: user.photoURL,
          customAvatar: avatarUrl,
          bio: prev?.bio || "",
          updatedAt: new Date().toISOString(),
        };
        try {
          localStorage.setItem(profileKey, JSON.stringify(next));
        } catch (e) {
          console.warn("LocalStorage profile write warning:", e);
        }
        return next;
      });
    } catch (e) {
      console.warn("Failed to save custom avatar:", e);
    }
  };

  const uploadAvatarBlob = async (blob: Blob): Promise<string> => {
    if (!user?.uid) throw new Error("Not authenticated");

    // 1. Try Firebase Storage if available
    if (storage) {
      try {
        const avatarRef = ref(storage, `users/${user.uid}/profile/avatar_${Date.now()}.webp`);
        const snapshot = await uploadBytes(avatarRef, blob, {
          contentType: "image/webp",
          cacheControl: "public, max-age=31536000",
        });
        const downloadUrl = await getDownloadURL(snapshot.ref);
        updateCustomAvatar(downloadUrl);
        return downloadUrl;
      } catch (storageErr) {
        console.warn("Firebase Storage upload fallback to local data URI:", storageErr);
      }
    }

    // 2. Fallback: Compact Data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        updateCustomAvatar(dataUrl);
        resolve(dataUrl);
      };
      reader.onerror = () => reject(new Error("Failed to read image blob"));
      reader.readAsDataURL(blob);
    });
  };

  const updateBio = (bio: string) => {
    if (!user?.uid) return;
    setProfile((prev) => {
      if (!prev) return null;
      const next = { ...prev, bio, updatedAt: new Date().toISOString() };
      try {
        localStorage.setItem(`rvan_user_profile_${user.uid}`, JSON.stringify(next));
      } catch (e) {
        console.warn("LocalStorage bio write warning:", e);
      }
      return next;
    });
  };

  const updateDisplayName = async (name: string) => {
    if (!user?.uid || !auth?.currentUser) return;
    try {
      await updateFirebaseProfile(auth.currentUser, { displayName: name });
      setUser({ ...auth.currentUser });
      setProfile((prev) => {
        if (!prev) return null;
        const next = { ...prev, displayName: name, updatedAt: new Date().toISOString() };
        localStorage.setItem(`rvan_user_profile_${user.uid}`, JSON.stringify(next));
        return next;
      });
    } catch (e) {
      console.warn("Failed to update display name:", e);
    }
  };

  const handleSignIn = async (): Promise<User | null> => {
    setError(null);
    setLoading(true);
    try {
      const signedInUser = await signInWithGoogle();
      if (signedInUser) {
        setUser(signedInUser);
        loadUserProfile(signedInUser);
      }
      return signedInUser;
    } catch (err: any) {
      const msg = err?.message || "Sign in failed.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setError(null);
    try {
      await logout();
      setUser(null);
      setProfile(null);
      setCustomAvatar(null);
    } catch (err: any) {
      setError(err?.message || "Sign out failed.");
    }
  };

  const clearError = () => setError(null);

  // Single canonical user photo hierarchy:
  // 1. Custom uploaded photo
  // 2. Google account photoURL
  // 3. Null (Guest fallback initial)
  const userPhoto = user ? customAvatar || user.photoURL || null : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        userPhoto,
        customAvatar,
        updateCustomAvatar,
        uploadAvatarBlob,
        updateBio,
        updateDisplayName,
        signIn: handleSignIn,
        signOut: handleSignOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
