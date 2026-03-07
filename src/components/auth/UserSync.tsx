"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function UserSync() {
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const syncUser = async () => {
      await fetch("/api/create-user", {
        method: "POST",
      });
    };

    syncUser();
  }, [isLoaded, isSignedIn]);

  return null;
}
