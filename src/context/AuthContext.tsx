import React, { createContext, useEffect, useState, ReactNode, useCallback } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, isKeyConfigured } from "../lib/firebase";
import { signInWithGoogle, checkRedirectResult, logout } from "../services/auth";
import { PeepConfig } from "../lib/peepsAssets";
import {
  getUserAvatarConfig,
  saveUserAvatarConfig,
  peepConfigToSvgDataUri,
} from "../lib/avatarEngine";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  customAvatar: string | null;
  bio?: string | null;
  avatarConfig?: PeepConfig | null;
  updatedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  userPhoto: string | null;
  customAvatar: string | null;
  avatarConfig: PeepConfig | null;
  avatarSvgUri: string | null;
  updateCustomAvatar: (avatarUrl: string | null) => void;
  updateAvatarConfig: (config: PeepConfig | null) => void;
  updateBio: (bio: string) => void;
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
  const [avatarConfig, setAvatarConfig] = useState<PeepConfig | null>(null);

  // Helper to load persistent profile from localStorage
  const loadUserProfile = useCallback((currentUser: User | null) => {
    if (!currentUser?.uid) {
      setProfile(null);
      setCustomAvatar(null);
      setAvatarConfig(null);
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
        if (parsed.avatarConfig) setAvatarConfig(parsed.avatarConfig);
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
      setAvatarConfig(null);
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
        setAvatarConfig(null);
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
        localStorage.setItem(legacyKey, avatarUrl);
      } else {
        localStorage.removeItem(legacyKey);
      }

      setCustomAvatar(avatarUrl);
      setProfile((prev) => {
        const next: UserProfile = {
          uid: user.uid,
          displayName: user.displayName || "User",
          email: user.email,
          photoURL: user.photoURL,
          customAvatar: avatarUrl,
          bio: prev?.bio || "",
          avatarConfig: avatarUrl ? null : prev?.avatarConfig,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(profileKey, JSON.stringify(next));
        return next;
      });
    } catch (e) {
      console.warn("Failed to save custom avatar:", e);
    }
  };

  const updateAvatarConfig = (newConfig: PeepConfig | null) => {
    if (!user?.uid) return;
    setAvatarConfig(newConfig);
    if (newConfig) {
      saveUserAvatarConfig(user.uid, newConfig);
    }
    setProfile((prev) => {
      if (!prev) return null;
      const next = { ...prev, avatarConfig: newConfig, updatedAt: new Date().toISOString() };
      localStorage.setItem(`rvan_user_profile_${user.uid}`, JSON.stringify(next));
      return next;
    });
  };

  const updateBio = (bio: string) => {
    if (!user?.uid) return;
    setProfile((prev) => {
      if (!prev) return null;
      const next = { ...prev, bio, updatedAt: new Date().toISOString() };
      localStorage.setItem(`rvan_user_profile_${user.uid}`, JSON.stringify(next));
      return next;
    });
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
      setAvatarConfig(null);
    } catch (err: any) {
      setError(err?.message || "Sign out failed.");
    }
  };

  const clearError = () => setError(null);

  // Compute active SVG Data URI for customized vector avatar if active
  const avatarSvgUri = avatarConfig ? peepConfigToSvgDataUri(avatarConfig) : null;

  // Single canonical user photo:
  // 1. Custom uploaded image if chosen
  // 2. Vector custom avatar SVG if configured
  // 3. Google account photoURL
  // 4. Null for guest visitors
  const userPhoto = user
    ? customAvatar || avatarSvgUri || user.photoURL || null
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        userPhoto,
        customAvatar,
        avatarConfig,
        avatarSvgUri,
        updateCustomAvatar,
        updateAvatarConfig,
        updateBio,
        signIn: handleSignIn,
        signOut: handleSignOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
