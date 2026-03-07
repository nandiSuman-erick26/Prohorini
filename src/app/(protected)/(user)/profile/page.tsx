"use client";

import { useState, useEffect } from "react";
import ProhoriniShieldLoader from "@/components/ui/loaders/ProhoriniShieldLoader";
import SkeletonCard from "@/components/ui/loaders/SkeletonCard";
import { useAppSelector, useAppDispatch } from "@/hooks/redux/store/rootRedux";
import CommunityFeed from "@/components/CommunityFeed";
import { useUserReports } from "@/hooks/react-query/useUserReports";
import { useProfile } from "@/hooks/react-query/useProfile";
import { useEmergencyContacts } from "@/hooks/react-query/useEmergencyContacts";
import {
  setUserProfile,
  setEmergencyContacts,
} from "@/hooks/redux/redux-slices/userProfileSlice";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Clock,
  Shield,
  FileText,
  Layout,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Loader2,
  Settings,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: profile, isLoading: profileFetching } = useProfile();
  const { userProfile } = useAppSelector((state) => state.userProfile);
  const { data: contacts } = useEmergencyContacts();
  const { data: userReports, isLoading: reportsLoading } = useUserReports(
    userProfile?.id || "",
  );
  const [activeTab, setActiveTab] = useState<"posts" | "reports">("posts");

  useEffect(() => {
    if (profile) {
      dispatch(setUserProfile(profile));
    }
  }, [profile, dispatch]);

  useEffect(() => {
    if (contacts) {
      dispatch(setEmergencyContacts(contacts));
    }
  }, [contacts, dispatch]);

  if (profileFetching && !userProfile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <ProhoriniShieldLoader message="Synchronizing Identity..." />
      </div>
    );
  }

  if (!userProfile) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700 font-sans">
      {/* 1. Profile Hero Card */}
      <div className="bg-white border-2 border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
        <div className="h-32 bg-zinc-950" />
        <div className="px-6 pb-8 -mt-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-[32px] bg-white p-1.5 shadow-xl">
                {userProfile.photo_url &&
                userProfile.photo_url !== "{}" &&
                userProfile.photo_url !== "null" ? (
                  <img
                    src={userProfile.photo_url}
                    alt={userProfile.full_name}
                    className="h-full w-full object-cover rounded-[26px]"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-100 rounded-[26px] flex items-center justify-center text-slate-400">
                    <User size={32} />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center shadow-lg">
                <Shield size={14} className="text-white" />
              </div>
            </div>

            <div className="flex-1 md:pb-0 flex justify-between items-end">
              <div className="pb-1">
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic leading-none">
                  {userProfile.full_name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
                    <Mail size={12} className="text-slate-300" />
                    {userProfile.email}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
                    <TrendingUp size={12} className="text-slate-300" />
                    Verified Citizen
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push("/complete-profile")}
                className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Tabs Container */}
      <div className="sticky top-20 z-10 bg-white/80 backdrop-blur-xl border-2 border-slate-100 rounded-full p-1.5 flex gap-2 shadow-lg shadow-slate-100/50">
        <button
          onClick={() => setActiveTab("posts")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300",
            activeTab === "posts"
              ? "bg-slate-900 text-white shadow-lg scale-[1.02]"
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-50",
          )}
        >
          <Layout size={14} />
          My Posts
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300",
            activeTab === "reports"
              ? "bg-slate-900 text-white shadow-lg scale-[1.02]"
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-50",
          )}
        >
          <FileText size={14} />
          Safe Reports
        </button>
      </div>

      {/* 3. Dynamic Content Section */}
      <div className="space-y-6">
        {activeTab === "posts" ? (
          <div className="px-2">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
                Broadcast History
              </h3>
              <div className="h-px flex-1 bg-slate-100 ml-4" />
            </div>
            <CommunityFeed targetUserId={userProfile.id || undefined} />
          </div>
        ) : (
          <div className="space-y-6 px-2">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
                Incident Logs
              </h3>
              <div className="h-px flex-1 bg-slate-100 ml-4" />
            </div>

            {reportsLoading ? (
              <div className="space-y-6">
                <SkeletonCard variant="default" lines={2} />
                <SkeletonCard variant="default" lines={3} />
              </div>
            ) : userReports?.length === 0 ? (
              <div className="bg-slate-50 rounded-[32px] p-12 text-center border-2 border-dashed border-slate-200">
                <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-slate-300" size={24} />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                  No security reports filed yet
                </p>
              </div>
            ) : (
              userReports?.map((report) => (
                <div
                  key={report.id}
                  className="bg-white border-2 border-slate-100 rounded-[28px] p-6 space-y-4 hover:shadow-xl transition-all group animate-in fade-in slide-in-from-bottom-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center",
                          report.status === "approved"
                            ? "bg-emerald-50 text-emerald-500"
                            : report.status === "pending"
                              ? "bg-amber-50 text-amber-500"
                              : "bg-rose-50 text-rose-500",
                        )}
                      >
                        {report.status === "approved" ? (
                          <CheckCircle2 size={18} />
                        ) : report.status === "pending" ? (
                          <Clock3 size={18} />
                        ) : (
                          <AlertTriangle size={18} />
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block leading-none mb-1">
                          Incident Type
                        </span>
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
                          {report.type}
                        </span>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                        report.status === "approved"
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100"
                          : report.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-900 text-white shadow-lg",
                      )}
                    >
                      {report.status}
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {report.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      <Clock size={12} />
                      {report.created_at
                        ? formatDistanceToNow(new Date(report.created_at)) +
                          " ago"
                        : "Just now"}
                    </div>
                    {report.photo_url &&
                      report.photo_url !== "{}" &&
                      report.photo_url !== "null" && (
                        <div className="h-10 w-10 rounded-lg overflow-hidden border border-slate-100 group-hover:scale-110 transition-transform cursor-zoom-in">
                          <img
                            src={report.photo_url}
                            className="h-full w-full object-cover"
                            alt="evidence"
                          />
                        </div>
                      )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
