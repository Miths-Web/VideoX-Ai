"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    // Check if the current route is an auth page
    const isAuthPage = pathname?.startsWith("/auth");

    return (
        <div className="flex min-h-screen flex-col">
            {!isAuthPage && <Header />}
            <main className="flex-1 w-full">{children}</main>
            {!isAuthPage && <Footer />}
        </div>
    );
}
