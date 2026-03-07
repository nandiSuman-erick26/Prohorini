"use client";

import React from "react";
import UserMenu from "../UserMenu";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import { useClerk } from "@clerk/nextjs";
import { clearUserProfile } from "@/hooks/redux/redux-slices/userProfileSlice";
import {
  stopSharingSession,
  clearSos,
} from "@/hooks/redux/redux-slices/userSafetySlice";
import { ShieldAlert, Sparkles, Tag } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProhoriniShieldLoader from "@/components/ui/loaders/ProhoriniShieldLoader";

import { calculateProfileCompletation } from "@/services/helper/profileCompetion";
import { useEmergencyContacts } from "@/hooks/react-query/useEmergencyContacts";
import { setProfileCompletion } from "@/hooks/redux/redux-slices/userSessionSlice";

const UserNavbar = () => {
  const router = useRouter();
  const { signOut } = useClerk();
  const dispatch = useAppDispatch();
  const { userProfile } = useAppSelector((state) => state.userProfile);
  const { data: contacts } = useEmergencyContacts();
  const { safetyStatus } = useAppSelector((state) => state.userSafty);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isSos = safetyStatus === "sos";
  const profilePic = userProfile?.photo_url;

  const completionPercentage = calculateProfileCompletation(
    userProfile,
    contacts,
  );

  useEffect(() => {
    if (userProfile) {
      dispatch(setProfileCompletion(completionPercentage));
    }
  }, [dispatch, userProfile, completionPercentage]);

  const isProfileIncomplete = userProfile && completionPercentage < 100;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ redirectUrl: "/sign-in" });
      dispatch(clearUserProfile());
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const handleProfilevisit = () => {
    router.push("/profile");
  };

  const handleProfileSetup = () => {
    router.push("/complete-profile");
  };
  const handleEndSos = () => {
    dispatch(stopSharingSession());
    dispatch(clearSos());
  };

  return (
    <div
      className={cn(
        "h-14 w-[650px] max-w-[95vw] border-2 rounded-full flex justify-between items-center px-4 md:px-8 shadow-2xl transition-all duration-500 overflow-hidden relative",
        isSos
          ? "bg-red-500 border-white/40 ring-4 ring-red-500/30 animate-pulse-gentle"
          : "bg-white/95 backdrop-blur-2xl border-zinc-200/60 bg-hitech-capsule",
      )}
    >
      {/* Left: Brand or Emergency Label */}
      <div className="flex items-center gap-2">
        {isSos ? (
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-white animate-bounce-slow" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-red-100 uppercase tracking-widest leading-none">
                Emergency
              </span>
              <span className="text-[10px] font-bold text-white leading-none">
                Active tracking
              </span>
            </div>
          </div>
        ) : (
          <Image
            width={120}
            height={40}
            src="/prohorini-logo-with-text.png"
            alt="Prohorini Logo"
            className="h-18 w-auto object-contain cursor-pointer brightness-110"
            onClick={() => router.push("/home")}
          />
        )}
      </div>

      {/* Right: END SOS or User Avatar */}
      <div className="flex items-center gap-4">
        {isSos ? (
          <Button
            size="sm"
            onClick={handleEndSos}
            className="bg-white text-red-600 hover:bg-neutral-100 font-black rounded-full px-5 text-[11px] h-8 border-none shadow-lg tracking-wider uppercase"
          >
            End SOS
          </Button>
        ) : (
          <>
            {isProfileIncomplete && (
              <button
                onClick={handleProfileSetup}
                className="flex items-center gap-2 md:gap-4 pl-2 pr-3 h-8 bg-[#f3f3b189] text-black rounded-3xl group hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] transition-all duration-500 border-yellow-400 border-[2px]"
              >
                <div className="flex flex-row items-center gap-1.5 leading-tight">
                  <Tag className="h-3.5 w-3.5 text-red-500 shrink-0" />
                  <span className="text-[7.5px] md:text-[8.5px] font-bold text-zinc-900 group-hover:text-red-500 transition-colors line-clamp-1 max-w-[120px] md:max-w-none">
                    Complete your profile setup to enable the full potentials
                  </span>
                </div>
              </button>
            )}
            <UserMenu
              imageUrl={profilePic}
              handleLogout={handleLogout}
              handleProfileVisit={handleProfilevisit}
              handleSetupVisit={handleProfileSetup}
              isProfileIncomplete={!!isProfileIncomplete}
            />
          </>
        )}
      </div>
      {isLoggingOut && (
        <div className="fixed inset-0 z-[99999] bg-white/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
          <ProhoriniShieldLoader message="Terminating secure session..." />
        </div>
      )}
    </div>
  );
};

export default UserNavbar;
