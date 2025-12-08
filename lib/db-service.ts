import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    increment,
    addDoc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase"; // Adjust if your firebase export is different
import { UserProfile, VideoMetadata, ActivityLog, UserPlan, UserSettings, UserUsage } from "./db-schema";

// --- User Profile Helpers ---

export const createUserProfile = async (
    uid: string,
    userData: Partial<UserProfile>
): Promise<void> => {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) return; // User already exists

    const now = Date.now();

    const defaultPlan: UserPlan = {
        type: 'free',
        status: 'active',
        expiresAt: null,
        startedAt: now
    };

    const defaultUsage: UserUsage = {
        videosProcessed: 0,
        storageUsedBytes: 0,
        storageLimitBytes: 5 * 1024 * 1024 * 1024, // 5GB
        creditsAvailable: 50, // Starter credits
        creditsTotal: 50
    };

    const defaultSettings: UserSettings = {
        theme: 'system',
        language: 'en',

        // Notifications
        emailNotifications: true,
        processingNotifications: true,
        marketingEmails: false,

        // Storage
        autoDownload: false,
        deleteAfterDownload: false,

        // Video Defaults
        defaultResolution: '4k',
        defaultFps: '60',
        autoEnhanceColors: true,
        autoDenoising: true,
        autoStabilization: false
    };

    const newUser: UserProfile = {
        uid,
        email: userData.email || "",
        displayName: userData.displayName || null,
        photoURL: userData.photoURL || null,
        createdAt: now,
        lastLoginAt: now,
        isEmailVerified: userData.isEmailVerified || false,
        provider: userData.provider || "email",
        plan: defaultPlan,
        usage: defaultUsage,
        settings: defaultSettings,
        ...userData // Override defaults if provided
    };

    await setDoc(userRef, newUser);
    await logActivity(uid, "UPDATE_PROFILE", "Account created");
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
        return snap.data() as UserProfile;
    }
    return null;
};

export const updateUserStats = async (uid: string, updates: Partial<UserProfile>) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, updates);
};

// --- Activity Logging ---

export const logActivity = async (
    userId: string,
    action: ActivityLog['action'],
    details: string
) => {
    try {
        const logsRef = collection(db, "users", userId, "activity_logs");
        await addDoc(logsRef, {
            userId,
            action,
            details,
            timestamp: Date.now(),
            // ipAddress and device would typically be captured server-side or via headers
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
        // Don't block app flow for logging errors
    }
};

// --- Video Management ---

export const createVideoProject = async (videoData: Partial<VideoMetadata>) => {
    if (!videoData.userId) throw new Error("User ID required for video project");

    const videoRef = doc(collection(db, "videos")); // Auto-ID
    const now = Date.now();

    const newVideo: VideoMetadata = {
        id: videoRef.id,
        userId: videoData.userId!,
        title: videoData.title || "Untitled Project",
        status: 'uploading',
        progress: 0,
        original: videoData.original!, // distinct check usually needed
        config: videoData.config || {
            targetResolution: 'HD',
            targetFps: '30',
            aiModel: 'default',
            enhancements: []
        },
        createdAt: now,
        ...videoData
    } as VideoMetadata;

    await setDoc(videoRef, newVideo);

    // Update user storage usage if file size is known
    if (videoData.original?.sizeBytes) {
        const userRef = doc(db, "users", videoData.userId);
        await updateDoc(userRef, {
            "usage.storageUsedBytes": increment(videoData.original.sizeBytes)
        });
    }

    return videoRef.id;
};
