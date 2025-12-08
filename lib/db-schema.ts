
export interface UserPlan {
    type: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'cancelled' | 'past_due' | 'expired';
    expiresAt: number | null; // Timestamp
    startedAt: number; // Timestamp
}

export interface UserUsage {
    videosProcessed: number;
    storageUsedBytes: number;
    storageLimitBytes: number;
    creditsAvailable: number;
    creditsTotal: number;
}

export interface UserSettings {
    theme: 'light' | 'dark' | 'system';
    language: string;

    // Notifications
    emailNotifications: boolean;
    processingNotifications: boolean;
    marketingEmails: boolean;

    // Storage
    autoDownload: boolean;
    deleteAfterDownload: boolean;

    // Video Preferences
    defaultResolution: string;
    defaultFps: string;
    autoEnhanceColors: boolean;
    autoDenoising: boolean;
    autoStabilization: boolean;
}

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    createdAt: number; // Timestamp
    lastLoginAt: number; // Timestamp
    isEmailVerified: boolean;
    provider: string; // 'google.com', 'password', etc.

    // Nested Objects
    plan: UserPlan;
    usage: UserUsage;
    settings: UserSettings;
}

export interface VideoMetadata {
    id: string;
    userId: string;
    title: string;
    status: 'uploading' | 'queued' | 'processing' | 'completed' | 'failed';
    progress: number; // 0-100
    errorMessage?: string;

    original: {
        url: string;
        sizeBytes: number;
        durationSec: number;
        resolution: string; // "1920x1080"
        format: string; // "mp4"
        filename: string;
    };

    enhanced?: {
        url: string;
        sizeBytes: number;
        resolution: string; // "3840x2160"
        completedAt: number;
    };

    config: {
        targetResolution: 'HD' | '2K' | '4K' | '8K';
        targetFps: '24' | '30' | '60' | '120';
        aiModel: string;
        enhancements: string[]; // ['denoise', 'color_correction', 'stabilization']
    };

    thumbnailUrl?: string;
    createdAt: number;
    expiresAt?: number; // For auto-deletion of free tier files
}

export interface SubscriptionLog {
    id: string;
    userId: string;
    planId: string;
    startDate: number;
    endDate: number;
    status: 'active' | 'expired' | 'cancelled';
    paymentMethod: string; // "Visa ending 4242"
    amount: number;
    currency: string;
    invoiceUrl?: string;
    createdAt: number;
}

export interface ActivityLog {
    id: string;
    userId: string;
    action: 'LOGIN' | 'LOGOUT' | 'UPLOAD_VIDEO' | 'enhance_Video' | 'DOWNLOAD_VIDEO' | 'UPDATE_PROFILE' | 'CHANGE_PASSWORD' | 'PLAN_UPDATE';
    details: string;
    ipAddress?: string;
    device?: string;
    timestamp: number;
}
