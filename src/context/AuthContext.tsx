import React, { createContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, isKeyConfigured } from "../lib/firebase";
import { signInWithGoogle, checkRedirectResult, logout } from "../services/auth";
import { PeepConfig, generateRandomPeep } from "../app/components/tools/openpeeps/peepsAssets";
import {
  getGuestAvatarConfig,
  saveGuestAvatarConfig,
  getUserAvatarConfig,
  saveUserAvatarConfig,
  peepConfigToSvgDataUri,
} from "../lib/avatarEngine";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  customAvatar: string | null;
  avatarConfig: PeepConfig;
  avatarSvgUri: string;
  userPhoto: string;
  updateCustomAvatar: (avatarUrl: string | null) => void;
  updateAvatarConfig: (config: PeepConfig) => void;
  randomizeAvatar: () => PeepConfig;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [avatarConfig, setAvatarConfig] = useState<PeepConfig>(() => getGuestAvatarConfig());

  useEffect(() => {
    if (!auth || !isKeyConfigured) {
      setUser(null);
      setCustomAvatar(null);
      setAvatarConfig(getGuestAvatarConfig());
      setLoading(false);
      return;
    }

    // Check for redirect result on page load
    checkRedirectResult().then((redirectUser) => {
      if (redirectUser) {
        setUser(redirectUser);
      }
    });

    // Listen for persistent Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        if (currentUser?.uid) {
          try {
            const savedCustomPhoto = localStorage.getItem(`rvan_user_avatar_${currentUser.uid}`);
            setCustomAvatar(savedCustomPhoto);

            const userPeep = getUserAvatarConfig(currentUser.uid, currentUser.email || undefined);
            setAvatarConfig(userPeep);
          } catch (e) {
            setCustomAvatar(null);
            setAvatarConfig(getUserAvatarConfig(currentUser.uid));
          }
        } else {
          setCustomAvatar(null);
          setAvatarConfig(getGuestAvatarConfig());
        }
        setLoading(false);
      },
      (err) => {
        console.error("[Auth Context Error] Auth state listener error:", err);
        setError(err.message);
        setUser(null);
        setCustomAvatar(null);
        setAvatarConfig(getGuestAvatarConfig());
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateCustomAvatar = (avatarUrl: string | null) => {
    if (!user?.uid) return;
    try {
      const storageKey = `rvan_user_avatar_${user.uid}`;
      if (avatarUrl) {
        localStorage.setItem(storageKey, avatarUrl);
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch (e) {}
    setCustomAvatar(avatarUrl);
  };

  const updateAvatarConfig = (newConfig: PeepConfig) => {
    setAvatarConfig(newConfig);
    if (user?.uid) {
      saveUserAvatarConfig(user.uid, newConfig);
    } else {
      saveGuestAvatarConfig(newConfig);
    }
  };

  const randomizeAvatar = (): PeepConfig => {
    const random = generateRandomPeep();
    updateAvatarConfig(random);
    return random;
  };

  const handleSignIn = async (): Promise<User | null> => {
    setError(null);
    setLoading(true);
    try {
      const signedInUser = await signInWithGoogle();
      if (signedInUser) {
        setUser(signedInUser);
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
      setCustomAvatar(null);
      setAvatarConfig(getGuestAvatarConfig());
    } catch (err: any) {
      setError(err?.message || "Sign out failed.");
    }
  };

  const clearError = () => setError(null);

  // Compute active SVG Data URI
  const avatarSvgUri = peepConfigToSvgDataUri(avatarConfig);

  // Active user photo: Custom uploaded base64 photo if available, then Google photoURL, otherwise the character avatar SVG
  const userPhoto = customAvatar || user?.photoURL || avatarSvgUri;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        customAvatar,
        avatarConfig,
        avatarSvgUri,
        userPhoto,
        updateCustomAvatar,
        updateAvatarConfig,
        randomizeAvatar,
        signIn: handleSignIn,
        signOut: handleSignOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
