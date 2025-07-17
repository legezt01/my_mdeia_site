// src/app/logout/page.tsx
'use client';

import { LogOut } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      signOut().then(() => {
        // Optional: can redirect after sign out is complete
        setTimeout(() => router.push('/'), 2000);
      });
    } else {
        // If already signed out, redirect to home
        setTimeout(() => router.push('/'), 2000);
    }
  }, [user, signOut, router]);

  return (
    <div className="flex flex-col h-full items-center justify-center bg-background p-6 text-center">
      <LogOut className="h-16 w-16 mb-4 text-primary animate-pulse" />
      <h1 className="text-4xl font-bold font-headline mb-2">Logging Out</h1>
      <p className="text-lg text-muted-foreground mb-6">
        You are being logged out. Please wait...
      </p>
      <Button onClick={() => router.push('/')}>Go to Homepage</Button>
    </div>
  );
}
