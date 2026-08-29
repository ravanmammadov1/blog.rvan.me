import React, { createContext, useEffect, useState, ReactNode, useCallback } from "react";
import { User, onAuthStateChanged, updateProfile as updateFirebaseProfile, deleteUser } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage, isKeyConfigured } from "../lib/firebase";
import { signInWithGoogle, checkRedirectResult, logout } from "../services/auth";
import { isPlatformAdminUid, checkIsAdmin } from "../config/admin";

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
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  userPhoto: string | null;
  customAvatar: string | null;
  updateCustomAvatar: (avatarUrl: string | null) => void;
  randomizeAvatar: () => void;
  uploadAvatarBlob: (blob: Blob) => Promise<string>;
  updateBio: (bio: string) => void;
  updateDisplayName: (name: string) => Promise<void>;
  signIn: () => Promise<User | null>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
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
        if (currentUser) {
          currentUser
            .getIdTokenResult()
            .then((tokenResult) => {
              const hasAdminAccess = checkIsAdmin(currentUser.uid, tokenResult.claims as any);
              setIsAdmin(hasAdminAccess);
            })
            .catch(() => {
              setIsAdmin(isPlatformAdminUid(currentUser.uid));
            })
            .finally(() => {
              setLoading(false);
            });
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      },
      (err) => {
        console.error("[Auth Context Error] Auth state listener error:", err);
        setError(err.message);
        setUser(null);
        setProfile(null);
        setCustomAvatar(null);
        setIsAdmin(false);
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

  const handleDeleteAccount = async () => {
    if (!user) return;
    setError(null);
    try {
      const uid = user.uid;
      // 1. Delete Firebase Auth user
      await deleteUser(user);
      // 2. Clear local storage profile keys
      try {
        localStorage.removeItem(`rvan_user_profile_${uid}`);
        localStorage.removeItem(`rvan_user_avatar_${uid}`);
        const apps = JSON.parse(localStorage.getItem("rvan_contributor_applications_v1") || "{}");
        delete apps[uid];
        localStorage.setItem("rvan_contributor_applications_v1", JSON.stringify(apps));
      } catch (e) {}
      setUser(null);
      setProfile(null);
      setCustomAvatar(null);
    } catch (err: any) {
      console.error("Account deletion error:", err);
      setError(err?.message || "Failed to delete account. Please re-authenticate and try again.");
      throw err;
    }
  };

  const clearError = () => setError(null);

  // Single canonical user photo hierarchy:
  // 1. Custom uploaded photo
  // 2. Google account photoURL
  // 3. Null (Guest fallback initial)
  const userPhoto = user ? customAvatar || user.photoURL || null : null;

  const randomizeAvatar = () => {
    if (!user?.uid) return;
    const randomSeed = Math.random().toString(36).substring(7);
    const dicebearUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${randomSeed}`;
    updateCustomAvatar(dicebearUrl);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        loading,
        error,
        userPhoto,
        customAvatar,
        updateCustomAvatar,
        randomizeAvatar,
        uploadAvatarBlob,
        updateBio,
        updateDisplayName,
        signIn: handleSignIn,
        signOut: handleSignOut,
        deleteAccount: handleDeleteAccount,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
