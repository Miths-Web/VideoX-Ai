"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";

// ...imports
import { useAuth } from "@/contexts/AuthContext";

const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { resetPassword } = useAuth();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
        setIsLoading(true);
        try {
            await resetPassword(values.email);
            setIsSubmitted(true);
            toast.success("Password reset email sent");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to send reset email");
        } finally {
            setIsLoading(false);
        }
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground antialiased selection:bg-primary/20">
                <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8">
                    <div className="mb-10 scale-105">
                        <Logo />
                    </div>
                    <div className="w-full max-w-[400px]">
                        <div className="w-full text-center space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                            <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
                            <p className="text-muted-foreground">
                                We've sent a password reset link to <span className="font-medium text-foreground">{form.getValues("email")}</span>.
                            </p>
                            <div className="pt-4">
                                <Button asChild variant="default" className="w-full h-12 text-base font-medium">
                                    <Link href="/auth/login">
                                        Return to Login
                                    </Link>
                                </Button>
                            </div>
                            <div className="pt-2">
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Click to try another email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground antialiased selection:bg-primary/20">
            <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8">
                <div className="mb-10 scale-105">
                    <Logo />
                </div>
                <div className="w-full max-w-[400px]">
                    <div className="w-full space-y-6">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold tracking-tight mb-2">Reset password</h1>
                            <p className="text-muted-foreground">
                                Enter your email address and we'll send you instructions to reset your password.
                            </p>
                        </div>

                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    placeholder="Email address"
                                    className="h-12 border-muted-foreground/20 text-base"
                                    {...form.register("email")}
                                />
                                {form.formState.errors.email && (
                                    <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                                )}
                            </div>
                            <Button className="w-full h-12 text-base font-medium" type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    "Continue"
                                )}
                            </Button>
                        </form>

                        <div className="flex justify-center mt-6">
                            <Link href="/auth/login" className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
