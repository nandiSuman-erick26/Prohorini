"use client";

import CommunityFeed from "@/components/CommunityFeed";
import { useProfile } from "@/hooks/react-query/useProfile";
import { setUserProfile } from "@/hooks/redux/redux-slices/userProfileSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, MapPin, AlertTriangle, Camera } from "lucide-react";
import CreateCommunityPost from "@/components/CreateCommunityPost";
import { useEmergencyContacts } from "@/hooks/react-query/useEmergencyContacts";

import ProhoriniShieldLoader from "@/components/ui/loaders/ProhoriniShieldLoader";

export default function DashboardPage() {
  const { user } = useUser();
  const { data: profile, isLoading } = useProfile();
  const { data: contacts, isLoading: contactsLoading } = useEmergencyContacts();
  const dispatch = useAppDispatch();
  const { userProfile } = useAppSelector((state) => state.userProfile);

  useEffect(() => {
    if (profile) {
      dispatch(setUserProfile(profile));
    }
  }, [dispatch, profile]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <ProhoriniShieldLoader message="Synchronizing Security Feed..." />
      </div>
    );
  }

  const isProfileIncomplete =
    !contactsLoading &&
    (!profile?.full_name ||
      !profile?.phone ||
      !contacts ||
      contacts.length === 0);

  if (profile?.is_active === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
        <div className="max-w-md w-full bg-white rounded-[40px] p-10 text-center shadow-2xl space-y-6 border border-white/10">
          <div className="h-20 w-20 bg-red-50 rounded-[32px] flex items-center justify-center mx-auto">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              Access Restricted
            </h1>
            <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">
              Your account has been temporarily disabled by security
              administration.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest border-2"
          >
            Contact Support
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* 2. Welcome & Onboarding */}
        <div className="space-y-4 px-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Home <span className="text-slate-300">/ Intelligence</span>
          </h2>
          <p className="text-slate-400 text-sm font-medium">
            Welcome back,{" "}
            <b>{profile?.full_name?.split(" ")[0] || "Citizen"}</b>. Here is the
            latest from your area.
          </p>
        </div>

        {isProfileIncomplete && (
          <div className="bg-amber-50 border-2 border-amber-100 rounded-[32px] p-6 flex flex-col items-center text-center gap-4 animate-in zoom-in-95 duration-500">
            <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
              <ShieldCheck className="h-6 w-6 text-amber-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[11px] font-black text-amber-900 uppercase tracking-tight">
                Security Credentials Incomplete
              </h3>
              <p className="text-[10px] text-amber-700 font-medium">
                Please update emergency contacts to activate full protection.
              </p>
            </div>
            <Link
              href="/complete-profile"
              className="px-6 h-10 bg-amber-500 hover:bg-amber-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-200 flex items-center"
            >
              Update Now
            </Link>
          </div>
        )}

        {/* 3. Feed Section (Centered Column) */}
        <div className="space-y-6">
          {/* Create Post */}
          <CreateCommunityPost />

          {/* Community Feed */}
          <div className="space-y-10">
            <div className="flex items-center gap-4 px-2">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                Broadcast History
              </span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            <CommunityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
