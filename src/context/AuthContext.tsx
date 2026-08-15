import React, { createContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, isKeyConfigured } from "../lib/firebase";
import { signInWithGoogle, logout } from "../services/auth";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  customAvatar: string | null;
  userPhoto: string | null;
  updateCustomAvatar: (avatarUrl: string | null) => void;
  signIn: () => Promise<void>;
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

  useEffect(() => {
    if (!auth || !isKeyConfigured) {
      setUser(null);
      setCustomAvatar(null);
      setLoading(false);
      return;
    }

    // Listen for persistent Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        if (currentUser?.uid) {
          try {
            const savedAvatar = localStorage.getItem(`rvan_user_avatar_${currentUser.uid}`);
            setCustomAvatar(savedAvatar);
          } catch (e) {
            setCustomAvatar(null);
          }
        } else {
          setCustomAvatar(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("[Auth Context Error] Auth state listener error:", err);
        setError(err.message);
        setUser(null);
        setCustomAvatar(null);
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

  const handleSignIn = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err?.message || "Sign in failed.");
    }
  };

  const handleSignOut = async () => {
    setError(null);
    try {
      await logout();
      setUser(null);
      setCustomAvatar(null);
    } catch (err: any) {
      setError(err?.message || "Sign out failed.");
    }
  };

  const clearError = () => setError(null);

  // If unauthenticated (user === null), userPhoto MUST be null.
  const userPhoto = user ? customAvatar || user.photoURL || null : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        customAvatar,
        userPhoto,
        updateCustomAvatar,
        signIn: handleSignIn,
        signOut: handleSignOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
