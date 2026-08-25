/**
 * Secure Firebase Admin Custom Claim Provisioning Script
 * 
 * Sets custom claim `admin: true` on the Platform Owner UID.
 * 
 * Usage:
 * 1. Set GOOGLE_APPLICATION_CREDENTIALS to your serviceAccountKey.json, OR
 * 2. Run with standard Firebase Admin credentials.
 * 
 * node scripts/set-admin-claim.mjs
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";
import path from "path";

const TARGET_ADMIN_UID = "6oo1oPvtLZZ93Sry6jbcDuvIuPG3";

async function run() {
  console.log(`[Admin Claims Setup] Provisioning admin custom claim for UID: ${TARGET_ADMIN_UID}...`);

  let app;
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || path.resolve(process.cwd(), "serviceAccountKey.json");

  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
    app = initializeApp({
      credential: cert(serviceAccount),
    });
    console.log(`[Admin Claims Setup] Authenticated with service account file: ${serviceAccountPath}`);
  } else {
    // Default application credentials or default project
    app = getApps().length > 0 ? getApps()[0] : initializeApp({
      projectId: "rvan-2796c",
    });
    console.log(`[Admin Claims Setup] Using default project context: rvan-2796c`);
  }

  const auth = getAuth(app);

  try {
    const user = await auth.getUser(TARGET_ADMIN_UID);
    console.log(`[Admin Claims Setup] Found user: ${user.email || user.displayName || user.uid}`);

    await auth.setCustomUserClaims(TARGET_ADMIN_UID, { admin: true });
    console.log(`[Admin Claims Setup] SUCCESS: custom claim { admin: true } set for UID ${TARGET_ADMIN_UID}.`);
    console.log(`[Admin Claims Setup] The user token will reflect this claim on the next token refresh.`);
  } catch (err) {
    console.error(`[Admin Claims Setup] Error setting custom claims:`, err.message);
    console.log(`\nNote: Firestore Security Rules already directly verify UID '${TARGET_ADMIN_UID}', providing full server-side protection even before custom claims are set.`);
  }
}

run();
