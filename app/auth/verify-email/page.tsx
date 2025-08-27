"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Video, Mail, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { currentUser, isEmailVerified, resendVerificationEmail, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const checkVerification = async () => {
      if (!currentUser) {
        router.push('/auth/login');
        return;
      }

      try {
        await currentUser.reload();
        if (isEmailVerified()) {
          toast.success("Your email is already verified!");
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Error checking verification:", error);
      }
    };

    checkVerification();
  }, [currentUser, isEmailVerified, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const handleResendEmail = async () => {
    if (!currentUser) {
      toast.error("Please log in first");
      router.push('/auth/login');
      return;
    }

    setIsLoading(true);
    setResendDisabled(true);
    setCountdown(60);
    
    try {
      await resendVerificationEmail();
      toast.success("Verification email sent. Please check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send verification email");
      setResendDisabled(false);
      setCountdown(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!currentUser) {
      toast.error("Please log in first");
      router.push('/auth/login');
      return;
    }

    setIsLoading(true);
    
    try {
      await currentUser.reload();
      if (isEmailVerified()) {
        toast.success("Email verified successfully!");
        router.push('/dashboard');
      } else {
        toast.info("Your email is not verified yet. Please check your inbox.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to check verification status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error: any) {
      toast.error(error.message || "Failed to log out");
    }
  };

  if (!currentUser) return null;

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <Video className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              VidioX AI
            </span>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Verify your email</CardTitle>
            <CardDescription>
              We&apos;ve sent a verification link to your email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Check your inbox</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                We&apos;ve sent a verification link to{" "}
                <strong>{currentUser?.email}</strong>. 
                Please check your inbox and click the link to verify your email address.
              </p>
              <div className="space-y-4 w-full">
                <Button 
                  onClick={handleRefresh} 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      I&apos;ve verified my email
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleResendEmail} 
                  className="w-full" 
                  disabled={isLoading || resendDisabled}
                >
                  {resendDisabled ? (
                    `Resend in ${countdown}s`
                  ) : (
                    "Resend verification email"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" onClick={handleLogout}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
            <Link href="/contact" className="text-sm text-primary hover:underline">
              Need help?
            </Link>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            If you don&apos;t see the email, check your spam folder or{" "}
            <button 
              onClick={handleResendEmail} 
              className="text-primary hover:underline"
              disabled={resendDisabled}
            >
              click here to resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}