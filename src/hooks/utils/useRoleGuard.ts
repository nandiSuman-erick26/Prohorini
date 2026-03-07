"use client";
import { useRouter } from "next/navigation";
import { useProfile } from "../react-query/useProfile";
import { useEffect } from "react";

export function useRoleGuard(allowedRoles: string[]) {
  const router = useRouter();
  const { data: profile, isLoading } = useProfile();

  useEffect(() => {
    if (isLoading || !profile) return;

    if (!allowedRoles.includes(profile?.role)) {
      router.replace("/dashboard");
    }
  }, [profile, isLoading, allowedRoles, router]);
}
