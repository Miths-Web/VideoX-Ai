"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  sendEmailVerification,
  EmailAuthProvider,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { UserProfile } from '@/lib/db-schema';
import { createUserProfile, getUserProfile, logActivity, updateUserStats } from '@/lib/db-service';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (name: string) => Promise<void>;
  updateUserEmail: (email: string, password?: string) => Promise<void>;
  updateUserPassword: (newPassword: string, currentPassword?: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  getUserData: () => Promise<UserProfile | null>;
  updateUserData: (data: Partial<UserProfile>) => Promise<void>;
  isEmailVerified: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const router = useRouter();

  // Auth state listener
  useEffect(() => {
    if (!auth) {
      console.error("Authentication services are not available");
      return () => { };
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthInitialized(true);

      if (user) {
        try {
          // Fetch user profile from Firestore
          let userData = await getUserProfile(user.uid);

          // CRITICAL: If verified but no profile, create it now.
          if (!userData && user.emailVerified) {
            console.log("User verified but no profile. Creating new Firestore profile...");
            await createUserProfile(user.uid, {
              email: user.email!,
              displayName: user.displayName,
              photoURL: user.photoURL,
              isEmailVerified: true,
              provider: user.providerData[0]?.providerId || 'unknown'
            });
            userData = await getUserProfile(user.uid);
          }

          setUserProfile(userData);

          if (userData) {
            // Log login if it's a fresh session (simple check)
            // In a real app we might want to debounce this or check lastLoginAt
            // For now, we update lastLoginAt
            await updateUserStats(user.uid, { lastLoginAt: Date.now() });
          }

        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Check if email is verified
  function isEmailVerified(): boolean {
    if (!auth?.currentUser) return false;
    // Force a reload to get the latest email verification status
    return auth.currentUser.emailVerified;
  }

  // Sign up with email and password
  async function signup(email: string, password: string, name: string): Promise<void> {
    if (!auth || !authInitialized) {
      throw new Error("Authentication services are not available");
    }

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, {
        displayName: name
      });

      // Send verification email
      await sendEmailVerification(user);

      // NOTE: We do NOT create the Firestore profile here anymore.
      // It will be triggered automatically in onAuthStateChanged -> getUserData
      // ONCE the user has verified their email.

      router.push('/auth/verify-email');
    } catch (error: any) {
      console.error("Error signing up:", error);
      throw error;
    }
  }

  // Login with Google
  async function loginWithGoogle(): Promise<void> {
    if (!auth || !authInitialized) {
      throw new Error("Authentication services are not available");
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Google users are automatically verified
      // Profile creation handled by onAuthStateChanged

      router.push('/');
    } catch (error: any) {
      console.error("Error logging in with Google:", error);
      throw error;
    }
  }

  // Login with email and password
  async function login(email: string, password: string): Promise<void> {
    if (!auth || !authInitialized) {
      throw new Error("Authentication services are not available");
    }

    try {
      // Sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Force reload user to get latest email verification status
      await user.reload();

      // Check if email is verified before proceeding
      if (!user.emailVerified) {
        toast.info("Please verify your email address.");
        router.push('/auth/verify-email');
        return;
      }

      await logActivity(user.uid, 'LOGIN', 'User logged in via email/password');

      toast.success("Successfully logged in!");
      router.push('/');
    } catch (error: any) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  // Logout
  async function logout(): Promise<void> {
    if (!auth || !authInitialized) {
      throw new Error("Authentication services are not available");
    }

    try {
      if (currentUser) {
        await logActivity(currentUser.uid, 'LOGOUT', 'User logged out');
      }
      await signOut(auth);
      setUserProfile(null);

      toast.success("Successfully logged out");
      router.push('/');
    } catch (error: any) {
      console.error("Error logging out:", error);
      toast.error(error.message || "Failed to log out");
      throw error;
    }
  }

  // Reset password
  async function resetPassword(email: string): Promise<void> {
    if (!auth || !authInitialized) {
      throw new Error("Authentication services are not available");
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset link sent to your email");
    } catch (error: any) {
      console.error("Error resetting password:", error);
      throw error;
    }
  }

  // Resend verification email
  async function resendVerificationEmail(): Promise<void> {
    if (!auth || !auth.currentUser || !authInitialized) {
      throw new Error("Authentication services are not available");
    }

    try {
      // Force reload user to get latest status
      await auth.currentUser.reload();

      if (auth.currentUser.emailVerified) {
        toast.success("Your email is already verified!");
        router.push('/');
        return;
      }

      await sendEmailVerification(auth.currentUser);
      toast.success("Verification email sent. Please check your inbox.");
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      throw error;
    }
  }

  // Update user profile
  async function updateUserProfile(name: string): Promise<void> {
    if (!auth || !auth.currentUser || !authInitialized) {
      throw new Error("Authentication services are not available");
    }

    try {
      const user = auth.currentUser;

      // Update display name in Firebase Auth
      await updateProfile(user, { displayName: name });

      // Update Firestore document
      await updateUserStats(user.uid, { displayName: name });
      await logActivity(user.uid, 'UPDATE_PROFILE', `Display name updated to ${name}`);

      // Update local user profile state
      const updatedUserData = await getUserData();
      setUserProfile(updatedUserData);

      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
      throw error;
    }
  }

  // Update user email
  async function updateUserEmail(email: string, password?: string): Promise<void> {
    if (!auth || !auth.currentUser || !authInitialized) {
      throw new Error("Authentication services are not available");
    }

    try {
      const user = auth.currentUser;

      // Re-authenticate user if password is provided
      if (password && user.email) {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      }

      // Update email in Firebase Auth
      await updateEmail(user, email);

      // Update email in Firestore
      await updateUserStats(user.uid, { email: email });
      await logActivity(user.uid, 'UPDATE_PROFILE', `Email updated to ${email}`);

      // Update local user profile state
      const updatedUserData = await getUserData();
      setUserProfile(updatedUserData);

      toast.success("Email updated successfully");
    } catch (error: any) {
      console.error("Error updating email:", error);
      toast.error(error.message || "Failed to update email");
      throw error;
    }
  }

  // Update user password
  async function updateUserPassword(newPassword: string, currentPassword?: string): Promise<void> {
    if (!auth || !auth.currentUser || !authInitialized) {
      throw new Error("Authentication services are not available");
    }

    try {
      const user = auth.currentUser;

      // Re-authenticate user if current password is provided
      if (currentPassword && user.email) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
      }

      // Update password in Firebase Auth
      await updatePassword(user, newPassword);
      await logActivity(user.uid, 'CHANGE_PASSWORD', 'User changed password');

      toast.success("Password updated successfully");
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Failed to update password");
      throw error;
    }
  }

  // Get user data from Firestore
  async function getUserData(): Promise<UserProfile | null> {
    if (!auth || !auth.currentUser || !authInitialized) {
      return null;
    }

    try {
      return await getUserProfile(auth.currentUser.uid);
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  }

  // Update user data in Firestore
  async function updateUserData(data: Partial<UserProfile>): Promise<void> {
    if (!auth || !auth.currentUser || !authInitialized) {
      throw new Error("Authentication services are not available");
    }

    try {
      await updateUserStats(auth.currentUser.uid, data);

      // Update local user profile state
      const updatedUserData = await getUserData();
      setUserProfile(updatedUserData);

      toast.success("Settings updated successfully");
    } catch (error: any) {
      console.error("Error updating user data:", error);
      toast.error(error.message || "Failed to update settings");
      throw error;
    }
  }

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    resendVerificationEmail,
    getUserData,
    updateUserData,
    isEmailVerified
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
}