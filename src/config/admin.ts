/**
 * Platform Admin Authorization Configuration
 * 
 * The primary platform administrator identity is bound to the platform owner's
 * Firebase Authentication UID (cryptographically verified by Google Firebase Auth).
 * 
 * IMPORTANT SECURITY RULES:
 * 1. Admin identity is NEVER based solely on client-side state or user-provided email strings.
 * 2. Firestore Security Rules enforce `request.auth.uid == PLATFORM_ADMIN_UID || request.auth.token.admin == true`.
 * 3. Client state only reflects authorization for UI rendering; server/database rules independently reject unauthorized writes.
 */

export const PLATFORM_ADMIN_UID = "6oo1oPvtLZZ93Sry6jbcDuvIuPG3";

/**
 * Validates whether a given Firebase UID is the platform owner.
 */
export function isPlatformAdminUid(uid: string | null | undefined): boolean {
  if (!uid || typeof uid !== "string") return false;
  return uid.trim() === PLATFORM_ADMIN_UID;
}

/**
 * Checks if a user has admin privileges based on their UID or Firebase token custom claims.
 */
export function checkIsAdmin(
  uid: string | null | undefined,
  customClaims?: { admin?: boolean } | null
): boolean {
  if (isPlatformAdminUid(uid)) return true;
  if (customClaims?.admin === true) return true;
  return false;
}
