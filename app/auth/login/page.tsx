"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/logo";
import { formatFirebaseError } from "@/lib/utils";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required")
});

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    terms: z.boolean().refine(val => val === true, {
        message: "You must accept the terms and conditions",
    }),
});

const resetSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

// Official Google Logo Component
const GoogleLogo = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
    </svg>
);

export default function AuthPage() {
    const { login, signup, loginWithGoogle, resetPassword } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const {
        register: registerLogin,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors }
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema)
    });

    const {
        register: registerSignup,
        handleSubmit: handleSignupSubmit,
        watch: watchSignup,
        setValue: setValueSignup,
        formState: { errors: signupErrors }
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            terms: false
        }
    });

    const {
        register: registerReset,
        handleSubmit: handleResetSubmit,
        formState: { errors: resetErrors }
    } = useForm<ResetFormValues>({
        resolver: zodResolver(resetSchema)
    });

    const signupPassword = watchSignup("password");

    useEffect(() => {
        if (!signupPassword) {
            setPasswordStrength(0);
            return;
        }

        let strength = 0;
        if (signupPassword.length >= 8) strength += 1;
        if (/[A-Z]/.test(signupPassword)) strength += 1;
        if (/[0-9]/.test(signupPassword)) strength += 1;
        if (/[^A-Za-z0-9]/.test(signupPassword)) strength += 1;

        setPasswordStrength(strength);
    }, [signupPassword]);

    const getStrengthColor = (strength: number) => {
        if (strength === 0) return "bg-gray-200 dark:bg-zinc-700";
        if (strength === 1) return "bg-red-500";
        if (strength === 2) return "bg-orange-500";
        if (strength === 3) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getStrengthText = (strength: number) => {
        if (strength === 0) return "";
        if (strength === 1) return "Weak";
        if (strength === 2) return "Fair";
        if (strength === 3) return "Good";
        return "Strong";
    };

    const onLoginSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        try {
            await login(data.email, data.password);
        } catch (error: any) {
            console.error("Login error:", error);
            toast.error(formatFirebaseError(error));
        } finally {
            setIsLoading(false);
        }
    };

    const onSignupSubmit = async (data: SignupFormValues) => {
        setIsLoading(true);
        try {
            await signup(data.email, data.password, data.name);
            toast.success("Account created successfully!");
        } catch (error: any) {
            console.error("Signup error:", error);
            toast.error(formatFirebaseError(error));
        } finally {
            setIsLoading(false);
        }
    };

    const onResetSubmit = async (data: { email: string }) => {
        setIsLoading(true);
        try {
            await resetPassword(data.email);
            setIsForgotPassword(false);
            setIsLogin(true);
        } catch (error: any) {
            console.error("Reset error:", error);
            toast.error(formatFirebaseError(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        try {
            await loginWithGoogle();
        } catch (error: any) {
            console.error("Google login error", error);
            toast.error(formatFirebaseError(error));
        } finally {
            setIsGoogleLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50/50 dark:bg-[#030303] relative overflow-hidden">

            {/* Ambient Background - Enhanced Gradient Spots */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px]" />
                {/* Additional side gradients to fill empty space */}
                <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />

                {/* Micro Grid Pattern */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-center" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-[420px] relative z-10"
            >
                {/* Card Container - Compacted padding */}
                <div className="bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/20 dark:border-white/5 p-6 sm:p-8">

                    {/* Header Section - Compacted margins */}
                    <div className="flex flex-col items-center text-center mb-6">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="mb-6 scale-90"
                        >
                            <Logo />
                        </motion.div>

                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-1.5">
                                {isForgotPassword ? "Reset Password" : (isLogin ? "Welcome back" : "Create your account")}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {isForgotPassword ? "Enter your email to receive a reset link" : (isLogin ? "Enter your credentials to continue" : "Start your AI journey in seconds")}
                            </p>
                        </motion.div>
                    </div>

                    {/* Forms - Compacted spacing & inputs */}
                    <AnimatePresence mode="wait">
                        {isForgotPassword ? (
                            <motion.div
                                key="forgot-password"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <form className="space-y-3" onSubmit={handleResetSubmit(onResetSubmit)}>
                                    <div className="space-y-2">
                                        <Input
                                            id="reset-email"
                                            type="email"
                                            placeholder="Email address"
                                            className="h-10 px-4 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm rounded-xl"
                                            {...registerReset("email")}
                                        />
                                        {resetErrors.email && <p className="text-red-500 text-xs pl-1 font-medium">{resetErrors.email.message}</p>}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-10 text-sm font-medium rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Send Reset Link"}
                                    </Button>

                                    <div className="text-center mt-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsForgotPassword(false)}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            Back to Login
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={isLogin ? "login" : "signup"}
                                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <form className="space-y-3" onSubmit={isLogin ? handleLoginSubmit(onLoginSubmit) : handleSignupSubmit(onSignupSubmit)}>
                                    {!isLogin && (
                                        <div className="space-y-1.5">
                                            <Input
                                                id="name"
                                                placeholder="Full Name"
                                                className="h-10 px-4 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm rounded-xl"
                                                {...registerSignup("name")}
                                            />
                                            {signupErrors.name && <p className="text-red-500 text-xs pl-1 font-medium">{signupErrors.name.message}</p>}
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Email address"
                                            className="h-10 px-4 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm rounded-xl"
                                            {...(isLogin ? registerLogin("email") : registerSignup("email"))}
                                        />
                                        {(isLogin ? loginErrors.email : signupErrors.email) && <p className="text-red-500 text-xs pl-1 font-medium">{(isLogin ? loginErrors.email?.message : signupErrors.email?.message)}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Password"
                                                className="h-10 px-4 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm rounded-xl pr-10"
                                                {...(isLogin ? registerLogin("password") : registerSignup("password"))}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {(isLogin ? loginErrors.password : signupErrors.password) && <p className="text-red-500 text-xs pl-1 font-medium">{(isLogin ? loginErrors.password?.message : signupErrors.password?.message)}</p>}

                                        {/* Password Strength Meter (Only for Signup) */}
                                        {!isLogin && (
                                            <div className="pt-1">
                                                <div className="flex gap-1 h-0.5 mb-1.5">
                                                    {[1, 2, 3, 4].map((level) => (
                                                        <div
                                                            key={level}
                                                            className={`h-full flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength ? getStrengthColor(passwordStrength) : "bg-gray-100 dark:bg-white/5"}`}
                                                        />
                                                    ))}
                                                </div>
                                                {passwordStrength > 0 && (
                                                    <p className={`text-[10px] text-right font-medium ${passwordStrength === 1 ? 'text-red-500' :
                                                        passwordStrength === 2 ? 'text-orange-500' :
                                                            passwordStrength === 3 ? 'text-yellow-500' : 'text-green-500'
                                                        }`}>
                                                        {getStrengthText(passwordStrength)}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Terms & Conditions (Only for Signup) */}
                                    {!isLogin && (
                                        <div className="flex items-start space-x-2 pt-1">
                                            <Checkbox
                                                id="terms"
                                                className="mt-0.5"
                                                onCheckedChange={(checked) => setValueSignup("terms", checked as boolean)}
                                            />
                                            <Label htmlFor="terms" className="text-[11px] text-muted-foreground leading-tight cursor-pointer">
                                                I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                                            </Label>
                                        </div>
                                    )}
                                    {/* Show Terms Error if any */}
                                    {!isLogin && signupErrors.terms && (
                                        <p className="text-red-500 text-xs pl-1 font-medium">{signupErrors.terms.message}</p>
                                    )}

                                    {isLogin && (
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setIsForgotPassword(true)}
                                                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full h-10 text-sm font-medium rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5 mt-2"
                                        disabled={isLoading || isGoogleLoading}
                                    >
                                        {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : (isLogin ? "Sign In" : "Create Account")}
                                    </Button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Divider - Compacted */}
                    {!isForgotPassword && (
                        <>
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100 dark:border-white/5" />
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase tracking-wide">
                                    <span className="bg-white/0 backdrop-blur-xl px-3 text-muted-foreground/60">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            {/* Social Buttons - Compacted */}
                            <div className="grid grid-cols-1 gap-3">
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="h-10 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 rounded-xl transition-all text-sm"
                                    onClick={handleGoogleLogin}
                                    disabled={isLoading || isGoogleLoading}
                                >
                                    {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleLogo />}
                                    Google
                                </Button>
                            </div>

                            {/* Toggle Link - Compacted */}
                            <div className="mt-6 text-center">
                                <p className="text-xs text-muted-foreground">
                                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                                    <button
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="text-primary hover:text-primary/80 font-semibold transition-colors ml-1 hover:underline underline-offset-4"
                                    >
                                        {isLogin ? "Sign up" : "Log in"}
                                    </button>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}