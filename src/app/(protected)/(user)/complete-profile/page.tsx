"use client";

import EmergencyContacForm from "@/components/profile/EmergencyContacForm";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfilePhotoUploader from "@/components/profile/ProfilePhotoUploader";
import CircleMemberPreviewCard from "@/components/user-panel/CircleMemberPreviewCard";
import ProfileCompletionCard from "@/components/user-panel/ProfileCompletionCard";
import { useEmergencyContacts } from "@/hooks/react-query/useEmergencyContacts";
import { useProfile } from "@/hooks/react-query/useProfile";
import { setProfileCompletion } from "@/hooks/redux/redux-slices/userSessionSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import { SelectIsProfileComplete } from "@/hooks/redux/store/user/userSelector";
import { fetchUserProfile } from "@/lib/api/getProfile";
import { supabase } from "@/lib/supabaseClient";
import { calculateProfileCompletation } from "@/services/helper/profileCompetion";
import { useQuery } from "@tanstack/react-query";

import { ShieldCheck } from "lucide-react";
import { useEffect } from "react";

const CompleteProfilePage = () => {
  const dispatch = useAppDispatch();
  const isComplete = useAppSelector(SelectIsProfileComplete);
  // const { data: profile, isLoading } = useQuery({
  //   queryKey:["profiles",clerk_id],
  //   queryFn: (id)=>fetchUserProfile()
  // });
  // const { data: circleMember } = useQuery({
  //   queryKey:["circle-member"],
  //   queryFn:
  // });

  const { data: circleMember } = useEmergencyContacts();
  const { data: profile, isLoading } = useProfile();

  const circle = circleMember;
  const percentage = calculateProfileCompletation(profile, circleMember);
  console.log("%", percentage);

  useEffect(() => {
    if (profile) {
      const percentage = calculateProfileCompletation(profile, circleMember);
      dispatch(setProfileCompletion(percentage));
    }
  }, [dispatch, profile, circleMember]);

  if (isLoading)
    return <div className="min-h-screen justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc00] pb-12">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Setup Your Profile
            </h1>
            <p className="text-lg text-slate-500 max-w-lg">
              Welcome to Prohorini! Let's get your account ready with your
              essential details and safety network.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-500 mb-1">
                Onboarding Progress
              </p>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-700">
                  {percentage}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Profile Photo Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-900">
                  1. Identity
                </h2>
                <p className="text-sm text-slate-500">
                  Your visual presence on the platform.
                </p>
              </div>
              <div className="p-8">
                <ProfilePhotoUploader />
              </div>
            </div>

            {/* Personal Details Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-900">
                  2. Personal Details
                </h2>
                <p className="text-sm text-slate-500">
                  Basic information to identify you.
                </p>
              </div>
              <div className="p-8">
                <ProfileForm />
              </div>
            </div>

            {/* Emergency Contacts Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    3. Emergency Contacts
                  </h2>
                  <p className="text-sm text-slate-500">
                    People we can reach in case of emergency.
                  </p>
                </div>
                <span className="bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  Crucial
                </span>
              </div>
              <div id="emergency-form" className="p-8">
                <EmergencyContacForm />
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
            <div className="block md:hidden">
              <ProfileCompletionCard />
            </div>

            <div className="hidden md:block">
              <ProfileCompletionCard />
            </div>

            <CircleMemberPreviewCard members={circle || []} />

            <div className="p-6 bg-slate-900 rounded-2xl text-white space-y-4 shadow-xl shadow-slate-200">
              <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-white">Privacy First</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Your data is encrypted end-to-end. We only share emergency
                  details with authorized responders when an alert is triggered.
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="pt-12 pb-8 text-center border-t border-slate-200">
          <p className="text-sm text-slate-400">
            &copy; 2026 Prohorini Safety Systems. All headers and data are
            protected.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
