import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDsG5doDjEoN5I_6DKfyLJ9lmSaQCBZYqI",
    authDomain: "videox-ai-15-02-2006.firebaseapp.com",
    projectId: "videox-ai-15-02-2006",
    storageBucket: "videox-ai-15-02-2006.firebasestorage.app",
    messagingSenderId: "488291674316",
    appId: "1:488291674316:web:be65c7d5de019c98433a69",
    measurementId: "G-6MHT2XRQB1"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
