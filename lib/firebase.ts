import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import {
  getFirestore,
  Firestore,
  initializeFirestore,
} from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getFunctions, Functions } from "firebase/functions";
import { enableIndexedDbPersistence } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCE4bBH8AMAsqOkXUMhL1vSQ98T0vWi-YY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "vidiox-ai-video-enhancer-b46ec.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "vidiox-ai-video-enhancer-b46ec",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "vidiox-ai-video-enhancer-b46ec.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "234190739765",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:234190739765:web:c40701e42df90b3abc947c",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-K6N897KRB3",
};

// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;
let functions: Functions | undefined;

// Initialize Firebase only once
try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Initialize services
  auth = getAuth(app);
  storage = getStorage(app);
  functions = getFunctions(app);

  // Initialize Firestore with proper settings
  if (typeof window !== "undefined") {
    try {
      db = initializeFirestore(app, {
        experimentalForceLongPolling: false,
        cacheSizeBytes: 50 * 1024 * 1024, // 50 MB
      });

      // Enable offline persistence only in browser
      enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === "failed-precondition") {
          console.warn("Persistence failed: Multiple tabs open");
        } else if (err.code === "unimplemented") {
          console.warn("Persistence not supported in this browser");
        }
      });
    } catch (error) {
      console.warn("Firestore initialization warning:", error);
      db = getFirestore(app);
    }
  } else {
    db = getFirestore(app);
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { auth, db, storage, functions, app };
