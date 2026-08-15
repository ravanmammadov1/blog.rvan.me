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
  const [customAvatar, setCustomAvatar] = useState<string | null>(() => {
    try {
      return localStorage.getItem("rvan_user_avatar");
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (!auth || !isKeyConfigured) {
      setLoading(false);
      return;
    }

    // Listen for persistent Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (err) => {
        console.error("[Auth Context Error] Auth state listener error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateCustomAvatar = (avatarUrl: string | null) => {
    try {
      if (avatarUrl) {
        localStorage.setItem("rvan_user_avatar", avatarUrl);
      } else {
        localStorage.removeItem("rvan_user_avatar");
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
    } catch (err: any) {
      setError(err?.message || "Sign out failed.");
    }
  };

  const clearError = () => setError(null);

  const userPhoto = customAvatar || user?.photoURL || null;

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
