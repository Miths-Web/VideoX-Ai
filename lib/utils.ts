import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// List of known temporary email domains to block
const TEMP_EMAIL_DOMAINS = [
  'tempmail.com',
  'temp-mail.org',
  'fakeinbox.com',
  'tempinbox.com',
  'mailinator.com',
  '10minutemail.com',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'sharklasers.com',
  'yopmail.com',
  'disposablemail.com',
  'mailnesia.com',
  'mailnator.com',
  'trashmail.com',
  'trashmail.net',
  'dispostable.com',
  'tempmail.net',
  'spamgourmet.com',
  'throwawaymail.com',
  'getairmail.com',
  'getnada.com',
  'emailondeck.com',
  'emailfake.com',
  'mohmal.com',
  'incognitomail.com',
  'fakemailgenerator.com',
  'tempmailer.com',
  'temp-mail.io',
  'tempmailaddress.com'
];

// Validate if email is from a temporary domain
function isTemporaryEmail(email: string): boolean {
  if (!email) return false;
  
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  return TEMP_EMAIL_DOMAINS.includes(domain);
}

// Format error messages from Firebase
function formatFirebaseError(error: any): string {
  const errorCode = error?.code || '';
  
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered. Please log in or use a different email.',
    'auth/invalid-email': 'The email address is not valid.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/user-not-found': 'No account found with this email. Please check your email or sign up.',
    'auth/wrong-password': 'Incorrect password. Please try again or reset your password.',
    'auth/weak-password': 'Password is too weak. Please use a stronger password.',
    'auth/invalid-credential': 'Invalid login credentials. Please try again.',
    'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
    'auth/account-exists-with-different-credential': 'An account already exists with the same email but different sign-in credentials.',
    'auth/email-already-exists': 'The email address is already in use by another account.',
    'auth/invalid-verification-code': 'The verification code is invalid.',
    'auth/invalid-verification-id': 'The verification ID is invalid.',
    'auth/requires-recent-login': 'This operation requires recent authentication. Please log in again.',
    'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later.',
    'auth/unverified-email': 'Your email has not been verified. Please check your inbox and verify your email.',
    'auth/configuration-not-found': 'Authentication configuration not found. Please contact support.',
  };
  
  return errorMessages[errorCode] || error?.message || 'An unexpected error occurred. Please try again.';
}

// Validate password strength
function isStrongPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
}

// Rate limiting helper (for client-side)
class RateLimiter {
  private attempts: Record<string, { count: number, timestamp: number }> = {};
  private maxAttempts: number;
  private timeWindow: number; // in milliseconds

  constructor(maxAttempts = 5, timeWindowInSeconds = 60) {
    this.maxAttempts = maxAttempts;
    this.timeWindow = timeWindowInSeconds * 1000;
  }

  canAttempt(key: string): boolean {
    const now = Date.now();
    const record = this.attempts[key];
    
    // If no record or record is expired, allow attempt
    if (!record || now - record.timestamp > this.timeWindow) {
      this.attempts[key] = { count: 1, timestamp: now };
      return true;
    }
    
    // If under max attempts, increment and allow
    if (record.count < this.maxAttempts) {
      record.count++;
      return true;
    }
    
    // Too many attempts
    return false;
  }

  getRemainingTime(key: string): number {
    const record = this.attempts[key];
    if (!record) return 0;
    
    const now = Date.now();
    const elapsed = now - record.timestamp;
    
    if (elapsed > this.timeWindow) return 0;
    return Math.ceil((this.timeWindow - elapsed) / 1000);
  }

  reset(key: string): void {
    delete this.attempts[key];
  }
}