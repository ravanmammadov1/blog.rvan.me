import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  increment,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ResumeData, ResumeThemeConfig, TECH_CV_PRESET } from "../app/components/tools/resumebuilder/resumeTypes";

const DEFAULT_THEME_FALLBACK: ResumeThemeConfig = {
  template: "tech-cv",
  accentColor: "#111827",
  fontFamily: "sans",
  density: "standard",
  paperSize: "a4",
};

export interface CvAnalyticsRecord {
  totalViews: number;
  lastViewedAt?: string;
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  referrerSources: Record<string, number>;
}

export interface PublicCvRecord {
  id: string;
  userId: string;
  userDisplayName?: string;
  userEmail?: string;
  userPhoto?: string;
  publicSlug: string;
  title: string;
  isPublic: boolean;
  isDiscoverable: boolean; // Controls whether the page is indexable by search engines
  createdAt: string;
  updatedAt: string;
  resumeData: ResumeData;
  theme: ResumeThemeConfig;
  analytics?: CvAnalyticsRecord;
}

export interface SavedCvRecord {
  id: string;
  userId: string;
  title: string;
  publicSlug?: string;
  isPublic: boolean;
  isDiscoverable: boolean;
  createdAt: string;
  updatedAt: string;
  resumeData: ResumeData;
  theme: ResumeThemeConfig;
  analytics?: CvAnalyticsRecord;
}

const LOCAL_STORAGE_KEY_PREFIX = "rvan_saved_cv_";
const LOCAL_PUBLIC_CVS_KEY = "rvan_local_public_cvs";

// ─────────────────────────────────────────────────────────────────────────────
// LocalStorage Fallback Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getLocalPublicCvs(): Record<string, PublicCvRecord> {
  try {
    const raw = localStorage.getItem(LOCAL_PUBLIC_CVS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveLocalPublicCv(record: PublicCvRecord) {
  try {
    const map = getLocalPublicCvs();
    map[record.publicSlug.toLowerCase()] = record;
    localStorage.setItem(LOCAL_PUBLIC_CVS_KEY, JSON.stringify(map));
  } catch (e) {
    console.warn("Failed to save local public CV:", e);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Cloud & Local Operations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a clean URL slug from user name or title
 */
export function generateCvSlug(name: string, customSuffix?: string): string {
  const base = (name || "resume")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = customSuffix || Math.random().toString(36).substring(2, 7);
  return `${base}-${suffix}`;
}

/**
 * Save or update a CV for an authenticated user
 */
export async function saveUserCv(
  userId: string,
  resumeData: ResumeData,
  theme: ResumeThemeConfig,
  options: {
    cvId?: string;
    title?: string;
    publicSlug?: string;
    isPublic?: boolean;
    isDiscoverable?: boolean;
    userDisplayName?: string;
    userEmail?: string;
    userPhoto?: string;
  }
): Promise<SavedCvRecord> {
  const now = new Date().toISOString();
  const cvId = options.cvId || `cv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const title = options.title || resumeData.personalInfo.fullName || "Untitled Resume";
  const isPublic = Boolean(options.isPublic);
  const isDiscoverable = Boolean(options.isDiscoverable);
  const publicSlug = options.publicSlug || (isPublic ? generateCvSlug(title) : undefined);

  const cvRecord: SavedCvRecord = {
    id: cvId,
    userId,
    title,
    publicSlug,
    isPublic,
    isDiscoverable,
    createdAt: now,
    updatedAt: now,
    resumeData,
    theme,
    analytics: {
      totalViews: 0,
      deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
      referrerSources: {},
    },
  };

  // 1. Try Firebase Firestore
  if (db) {
    try {
      const userCvRef = doc(db, `users/${userId}/cvs`, cvId);
      await setDoc(userCvRef, cvRecord, { merge: true });

      // If public, also mirror to public_cvs collection
      if (isPublic && publicSlug) {
        const publicCvRef = doc(db, "public_cvs", publicSlug.toLowerCase());
        const publicPayload: PublicCvRecord = {
          ...cvRecord,
          publicSlug: publicSlug.toLowerCase(),
          userDisplayName: options.userDisplayName,
          userEmail: options.userEmail,
          userPhoto: options.userPhoto,
        };
        await setDoc(publicCvRef, publicPayload, { merge: true });
      }
    } catch (err) {
      console.warn("[cvStorage] Firestore save error, falling back to localStorage:", err);
    }
  }

  // 2. LocalStorage sync
  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}_${cvId}`, JSON.stringify(cvRecord));
    if (isPublic && publicSlug) {
      saveLocalPublicCv({
        ...cvRecord,
        publicSlug: publicSlug.toLowerCase(),
        userDisplayName: options.userDisplayName,
        userEmail: options.userEmail,
        userPhoto: options.userPhoto,
      });
    }
  } catch (e) {
    console.warn("LocalStorage save error:", e);
  }

  return cvRecord;
}

/**
 * Fetch all saved CVs for a user
 */
export async function getUserCvs(userId: string): Promise<SavedCvRecord[]> {
  const records: SavedCvRecord[] = [];

  // 1. Try Firestore
  if (db) {
    try {
      const q = collection(db, `users/${userId}/cvs`);
      const snapshot = await getDocs(q);
      snapshot.forEach((docSnap) => {
        records.push(docSnap.data() as SavedCvRecord);
      });
      if (records.length > 0) return records;
    } catch (err) {
      console.warn("[cvStorage] Firestore query error, checking local storage:", err);
    }
  }

  // 2. Local storage fallback
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${LOCAL_STORAGE_KEY_PREFIX}${userId}_`)) {
        const item = localStorage.getItem(key);
        if (item) records.push(JSON.parse(item));
      }
    }
  } catch (e) {}

  return records;
}

/**
 * Fetch a public CV by its URL slug
 */
export async function getPublicCvBySlug(slug: string): Promise<PublicCvRecord | null> {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();

  // 1. Immediate fixture for sample / demo
  if (cleanSlug === "sample" || cleanSlug === "demo") {
    return {
      id: "cv_sample",
      userId: "demo_user",
      userDisplayName: "Ravan Mammadov",
      publicSlug: cleanSlug,
      title: "Senior Product Designer & Creative Developer CV",
      isPublic: true,
      isDiscoverable: false,
      createdAt: "2026-08-18T12:00:00Z",
      updatedAt: "2026-08-18T12:00:00Z",
      resumeData: TECH_CV_PRESET,
      theme: DEFAULT_THEME_FALLBACK,
      analytics: {
        totalViews: 42,
        deviceBreakdown: { desktop: 30, mobile: 10, tablet: 2 },
        referrerSources: { LinkedIn: 24, Direct: 18 },
      },
    };
  }

  // 2. Check local storage first (instant)
  const localMap = getLocalPublicCvs();
  if (localMap[cleanSlug]) {
    return localMap[cleanSlug];
  }

  // 3. Try Firestore with short timeout
  if (db) {
    try {
      const docRef = doc(db, "public_cvs", cleanSlug);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data() as PublicCvRecord;
      }
    } catch (err) {
      console.warn("[cvStorage] Firestore public CV fetch failed:", err);
    }
  }

  return null;
}

/**
 * Record an anonymous visitor view on a public CV page
 */
export async function recordCvView(
  slug: string,
  meta?: { device?: "mobile" | "tablet" | "desktop"; referrer?: string }
): Promise<void> {
  if (!slug) return;
  const cleanSlug = slug.toLowerCase().trim();
  const deviceType = meta?.device || "desktop";
  const referrer = meta?.referrer || "Direct";

  // 1. Firestore update
  if (db) {
    try {
      const docRef = doc(db, "public_cvs", cleanSlug);
      await updateDoc(docRef, {
        "analytics.totalViews": increment(1),
        "analytics.lastViewedAt": new Date().toISOString(),
        [`analytics.deviceBreakdown.${deviceType}`]: increment(1),
        [`analytics.referrerSources.${referrer}`]: increment(1),
      });
    } catch (e) {
      // Non-blocking
    }
  }

  // 2. LocalStorage sync
  try {
    const localMap = getLocalPublicCvs();
    if (localMap[cleanSlug]) {
      const rec = localMap[cleanSlug];
      if (!rec.analytics) {
        rec.analytics = {
          totalViews: 0,
          deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
          referrerSources: {},
        };
      }
      rec.analytics.totalViews = (rec.analytics.totalViews || 0) + 1;
      rec.analytics.lastViewedAt = new Date().toISOString();
      rec.analytics.deviceBreakdown[deviceType] =
        (rec.analytics.deviceBreakdown[deviceType] || 0) + 1;
      rec.analytics.referrerSources[referrer] =
        (rec.analytics.referrerSources[referrer] || 0) + 1;
      saveLocalPublicCv(rec);
    }
  } catch (e) {}
}

/**
 * Delete a saved CV
 */
export async function deleteUserCv(userId: string, cvId: string, publicSlug?: string): Promise<boolean> {
  if (db) {
    try {
      await deleteDoc(doc(db, `users/${userId}/cvs`, cvId));
      if (publicSlug) {
        await deleteDoc(doc(db, "public_cvs", publicSlug.toLowerCase()));
      }
    } catch (e) {}
  }

  try {
    localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}_${cvId}`);
    if (publicSlug) {
      const map = getLocalPublicCvs();
      delete map[publicSlug.toLowerCase()];
      localStorage.setItem(LOCAL_PUBLIC_CVS_KEY, JSON.stringify(map));
    }
  } catch (e) {}

  return true;
}
