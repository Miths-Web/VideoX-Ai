"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.push("/auth/login");
  }, [router]);
  
  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>Redirecting to login page...</p>
      </div>
    </div>
  );
}