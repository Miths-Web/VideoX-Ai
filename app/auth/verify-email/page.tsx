"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion"; // Added motion
import { Logo } from "@/components/logo";
import { formatFirebaseError } from "@/lib/utils";

export default function VerifyEmailPage() {
    const router = useRouter();
    const { currentUser, isEmailVerified, resendVerificationEmail, logout } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isChecking, setIsChecking] = useState(false); // New state for checking

    useEffect(() => {
        // Initial check on mount
        const checkVerification = async () => {
            if (!currentUser) {
                router.push('/auth/login');
                return;
            }
            try {
                // Background check without toast
                await currentUser.reload();
                if (isEmailVerified()) {
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
        if (!currentUser) return;
        setIsLoading(true);
        setResendDisabled(true);
        setCountdown(60);
        try {
            await resendVerificationEmail();
            toast.success("Verification email sent");
        } catch (error: any) {
            toast.error(formatFirebaseError(error));
            setResendDisabled(false);
            setCountdown(0);
        } finally {
            setIsLoading(false);
        }
    };

    const handleManualCheck = async () => {
        if (!currentUser) return;
        setIsChecking(true);
        try {
            // Force reload user to get latest status
            await currentUser.reload();
            if (isEmailVerified()) {
                toast.success("Email verified successfully!");
                router.push('/dashboard');
            } else {
                toast.error("Email verification pending. Please check your inbox.");
            }
        } catch (error: any) {
            toast.error("Error checking status. Please try again.");
        } finally {
            setIsChecking(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/auth/login');
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (!currentUser) return null;

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50/50 dark:bg-[#030303] relative overflow-hidden">

            {/* Ambient Background - Same as Login */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px]" />
                <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-center" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-[420px] relative z-10"
            >
                {/* Card Container - Glassmorphism */}
                <div className="bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/20 dark:border-white/5 p-6 sm:p-8">

                    <div className="flex flex-col items-center text-center">
                        <div className="mb-8 scale-100">
                            <Logo />
                        </div>

                        <div className="w-full text-center space-y-6">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Mail className="h-8 w-8 text-primary" />
                                </div>
                            </div>

                            <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">
                                    Verify your email
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    We've sent a verification link to <br />
                                    <span className="font-medium text-foreground">{currentUser.email}</span>
                                </p>
                            </motion.div>

                            <div className="space-y-3 pt-2">
                                <Button
                                    onClick={handleResendEmail}
                                    className="w-full h-10 text-sm font-medium rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                                    disabled={isLoading || resendDisabled}
                                >
                                    {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : (resendDisabled ? `Resend available in ${countdown}s` : "Resend verification email")}
                                </Button>

                                <Button
                                    variant="ghost"
                                    onClick={handleManualCheck}
                                    className="w-full text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-white/5"
                                    disabled={isChecking}
                                >
                                    {isChecking ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "I've verified my email"}
                                </Button>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleLogout}
                                    className="text-xs text-muted-foreground hover:text-foreground flex items-center justify-center mx-auto transition-colors"
                                >
                                    <ArrowLeft className="mr-1.5 h-3 w-3" />
                                    Back to Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
