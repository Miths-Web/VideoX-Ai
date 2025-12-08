import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatFirebaseError(error: any): string {
    if (typeof error === 'string') return error;
    const code = error.code || '';
    switch (code) {
        case 'auth/email-already-in-use':
            return 'Email is already in use by another account.';
        case 'auth/user-not-found':
            return 'No account found with this email. Please sign up.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
        case 'auth/weak-password':
            return 'Password is too weak. It should be at least 6 characters.';
        case 'auth/credential-already-in-use':
            return 'This account is already linked to another user.';
        case 'auth/requires-recent-login':
            return 'Please log in again to perform this action.';
        case 'auth/invalid-credential':
            return 'Invalid credentials. Please check your details.';
        default:
            // return code || error.message || 'An unknown error occurred';
            if (error.message && error.message.includes('network')) {
                return 'Network error. Please check your connection.';
            }
            return 'An error occurred. Please try again.';
    }
}
