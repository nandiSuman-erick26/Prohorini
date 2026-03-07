"use client";

import { useState, useEffect } from "react";
import { ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import ProhoriniShieldLoader from "@/components/ui/loaders/ProhoriniShieldLoader";

export default function ClientInitializationWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    // Force the elite loading experience for 3.5 seconds
    // to give that "Command Center Initializing" feel the user wants.
    const timer = setTimeout(() => setIsBooting(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  if (isBooting) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 animate-in fade-in duration-500">
        <ProhoriniShieldLoader message="Synchronizing Security Protocols..." />
      </div>
    );
  }

  return (
    <>
      <ClerkLoading>
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950">
          <ProhoriniShieldLoader message="Authenticating Credentials..." />
        </div>
      </ClerkLoading>
      <ClerkLoaded>{children}</ClerkLoaded>
    </>
  );
}
