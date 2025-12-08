"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { currentUser, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!currentUser) {
                router.push("/auth/login");
            } else if (!currentUser.emailVerified) {
                router.push("/auth/verify-email");
            }
        }
    }, [currentUser, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!currentUser) {
        return null; // Don't render anything while redirecting
    }

    return (
        <div className="min-h-screen bg-background">
            {children}
        </div>
    );
}
