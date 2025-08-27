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
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
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

// User profile interface
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  emailVerified: boolean;
  createdAt: any;
  lastLoginAt?: any;
  plan: string;
  enhancedVideos: number;
  storageUsed: number;
  preferences?: {
    defaultResolution?: string;
    defaultFps?: string;
    autoEnhanceColors?: boolean;
    autoDenoising?: boolean;
    autoStabilization?: boolean;
  };
  notifications?: {
    email?: boolean;
    processing?: boolean;
    marketing?: boolean;
  };
  storage?: {
    autoDownload?: boolean;
    deleteAfterDownload?: boolean;
  };
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
      return () => {};
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthInitialized(true);
      
      if (user) {
        try {
          // Fetch user profile from Firestore
          const userData = await getUserData();
          setUserProfile(userData);
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
      
      // Create user profile in Firestore
      if (db) {
        try {
          const userProfile: UserProfile = {
            uid: user.uid,
            email: email,
            displayName: name,
            emailVerified: false,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
            enhancedVideos: 0,
            storageUsed: 0,
            plan: "free",
            preferences: {
              defaultResolution: "4k",
              defaultFps: "60",
              autoEnhanceColors: true,
              autoDenoising: true,
              autoStabilization: false
            },
            notifications: {
              email: true,
              processing: true,
              marketing: false
            },
            storage: {
              autoDownload: false,
              deleteAfterDownload: false
            }
          };
          
          await setDoc(doc(db, "users", user.uid), userProfile);
          setUserProfile(userProfile);
        } catch (error) {
          console.error("Error creating user profile:", error);
        }
      }
      
      toast.success("Account created successfully! Please verify your email.");
      router.push('/auth/verify-email');
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast.error(error.message || "Failed to create account");
      throw error;
    }
  }

  // Login with Google
  async function googleLogin(): Promise<void> {
    if (!auth || !authInitialized) {
      throw new Error("Authentication services are not available");
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create or update user profile in Firestore
      if (db) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            // Create new profile for Google users
            const userProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || '',
              photoURL: user.photoURL || '',
              emailVerified: user.emailVerified,
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
              enhancedVideos: 0,
              storageUsed: 0,
              plan: "free",
              preferences: {
                defaultResolution: "4k",
                defaultFps: "60",
                autoEnhanceColors: true,
                autoDenoising: true,
                autoStabilization: false
              },
              notifications: {
                email: true,
                processing: true,
                marketing: false
              },
              storage: {
                autoDownload: false,
                deleteAfterDownload: false
              }
            };

            await setDoc(userRef, userProfile);
            setUserProfile(userProfile);
          } else {
            // Update last login time for existing users
            await updateDoc(userRef, {
              lastLoginAt: serverTimestamp()
            });
          }
        } catch (error) {
          console.error("Error updating user profile:", error);
        }
      }

      toast.success("Successfully logged in with Google!");
      router.push('/');
    } catch (error: any) {
      console.error("Error logging in with Google:", error);
      
      // Handle specific error cases
      let errorMessage = "Failed to login with Google";
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = "Sign-in was cancelled. Please try again.";
          break;
        case 'auth/popup-blocked':
          errorMessage = "Popup was blocked by your browser. Please allow popups and try again.";
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = "Sign-in was cancelled. Please try again.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Network error. Please check your connection and try again.";
          break;
        case 'auth/invalid-credential':
          errorMessage = "Invalid credentials. Please try again.";
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = "An account already exists with the same email address but different sign-in credentials.";
          break;
        case 'auth/credential-already-in-use':
          errorMessage = "This account is already associated with another user.";
          break;
        case 'auth/operation-not-allowed':
          errorMessage = "Google sign-in is not enabled. Please contact support.";
          break;
        case 'auth/user-disabled':
          errorMessage = "This account has been disabled. Please contact support.";
          break;
        case 'auth/unauthorized-domain':
          errorMessage = "This domain is not authorized for Google sign-in. Please contact support.";
          break;
        case 'auth/timeout':
          errorMessage = "Sign-in timed out. Please try again.";
          break;
        default:
          // Use the original error message if available
          errorMessage = error.message || "Failed to login with Google";
          break;
      }
      
      toast.error(errorMessage);
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
        // Send a new verification email
        await sendEmailVerification(user);
        // Sign out the user
        await signOut(auth);
        // Redirect to verify email page
        router.push('/auth/verify-email');
        throw new Error("Please verify your email before logging in. A new verification email has been sent.");
      }
      
      // Update last login time
      if (db) {
        try {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
            lastLoginAt: serverTimestamp()
          });
        } catch (error) {
          console.error("Error updating last login time:", error);
        }
      }
      
      // Fetch user profile
      const userData = await getUserData();
      setUserProfile(userData);
      
      toast.success("Successfully logged in!");
      router.push('/');
    } catch (error: any) {
      console.error("Error logging in:", error);
      toast.error(error.message || "Failed to login");
      throw error;
    }
  }

  // Logout
  async function logout(): Promise<void> {
    if (!auth || !authInitialized) {
      throw new Error("Authentication services are not available");
    }
    
    try {
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
      toast.error(error.message || "Failed to send reset link");
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
      toast.error(error.message || "Failed to send verification email");
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
      if (db) {
        try {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, { displayName: name });
          
          // Update local user profile state
          const updatedUserData = await getUserData();
          setUserProfile(updatedUserData);
        } catch (error) {
          console.error("Error updating profile in Firestore:", error);
        }
      }
      
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
      if (db) {
        try {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, { 
            email: email
          });
          
          // Update local user profile state
          const updatedUserData = await getUserData();
          setUserProfile(updatedUserData);
        } catch (error) {
          console.error("Error updating email in Firestore:", error);
        }
      }
      
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
      
      toast.success("Password updated successfully");
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Failed to update password");
      throw error;
    }
  }

  // Get user data from Firestore
  async function getUserData(): Promise<UserProfile | null> {
    if (!auth || !db || !auth.currentUser || !authInitialized) {
      return null;
    }
    
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data() as UserProfile;
        return userData;
      } else {
        // Create default user profile if it doesn't exist
        const newUserProfile: UserProfile = {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email || '',
          displayName: auth.currentUser.displayName || '',
          photoURL: auth.currentUser.photoURL || '',
          emailVerified: auth.currentUser.emailVerified,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          enhancedVideos: 0,
          storageUsed: 0,
          plan: "free",
          preferences: {
            defaultResolution: "1080p",
            defaultFps: "30",
            autoEnhanceColors: true,
            autoDenoising: true,
            autoStabilization: false
          },
          notifications: {
            email: true,
            processing: true,
            marketing: false
          },
          storage: {
            autoDownload: false,
            deleteAfterDownload: false
          }
        };
        
        await setDoc(userRef, newUserProfile);
        return newUserProfile;
      }
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  }

  // Update user data in Firestore
  async function updateUserData(data: Partial<UserProfile>): Promise<void> {
    if (!auth || !db || !auth.currentUser || !authInitialized) {
      throw new Error("Authentication services are not available");
    }
    
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, data);
      
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
    googleLogin,
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