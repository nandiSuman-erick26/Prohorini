"use client";

import { useProfile } from "@/hooks/react-query/useProfile";
import { useEmergencyContacts } from "@/hooks/react-query/useEmergencyContacts";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  Info,
  UserPlus,
  AlertTriangle,
  Phone,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmergencyContactsPage() {
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: contacts, isLoading: contactsLoading } = useEmergencyContacts();

  if (profileLoading || contactsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <div className="h-10 w-10 border-4 border-slate-100 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#fdfdfd04]">
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div className="space-y-4 px-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Emergency <span className="text-slate-300">/ Assistance</span>
          </h2>
          <p className="text-slate-400 text-sm font-medium">
            Manage your safety circle, emergency contacts, and active security
            protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Security Overview Card */}
          <div className="bg-zinc-950 rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-zinc-200">
            <div className="absolute top-0 right-0 h-40 w-40 bg-red-500/10 rounded-full -translate-x-10 -translate-y-10 blur-3xl" />

            <h3 className="text-xs font-black text-red-500 uppercase tracking-[0.2em] mb-6">
              Security Context
            </h3>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-tight leading-none mb-1">
                    Access Role
                  </p>
                  <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-widest leading-none">
                    Verified Citizen
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-tight leading-none mb-1">
                    Service Status
                  </p>
                  <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest leading-none flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    All Systems Green
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Notice Card */}
          <div className="bg-white border-2 border-slate-100 rounded-[40px] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Info size={20} />
              </div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                Safety Notice
              </h4>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                <p className="text-[10px] font-black text-slate-800 uppercase mb-1 tracking-tight">
                  Live Heatmaps
                </p>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Analyze historical crime density before travel.
                </p>
              </div>
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                <p className="text-[10px] font-black text-slate-800 uppercase mb-1 tracking-tight">
                  Instant Alerts
                </p>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Enable notifications for SOS triggers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => router.push("/complete-profile")}
            className="flex flex-col items-center justify-center p-8 bg-white border-2 border-slate-100 rounded-[32px] hover:border-slate-900 hover:shadow-xl transition-all gap-4 group shadow-sm active:scale-95"
          >
            <div className="h-14 w-14 bg-zinc-950 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-zinc-200">
              <UserPlus size={28} />
            </div>
            <div className="text-center">
              <span className="block text-[11px] font-black text-slate-900 uppercase tracking-tight">
                Safety Circle
              </span>
              <span className="block text-[9px] text-slate-400 font-bold uppercase">
                Add Members
              </span>
            </div>
          </button>
          <button className="flex flex-col items-center justify-center p-8 bg-white border-2 border-slate-100 rounded-[32px] hover:border-red-200 hover:shadow-xl hover:shadow-red-50 transition-all gap-4 group shadow-sm active:scale-95">
            <div className="h-14 w-14 bg-red-500 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-red-100">
              <AlertTriangle size={28} />
            </div>
            <div className="text-center">
              <span className="block text-[11px] font-black text-slate-900 uppercase tracking-tight">
                Emergency Panic
              </span>
              <span className="block text-[9px] text-slate-400 font-bold uppercase">
                Trigger SOS
              </span>
            </div>
          </button>
        </div>

        {/* Emergency Contacts Section */}
        <div className="bg-white border-2 border-slate-100 rounded-[40px] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 italic">
              <div className="h-8 w-1 bg-red-500 rounded-full" />
              Trusted Circle
            </h3>
            <Button
              onClick={() => router.push("/complete-profile")}
              className="h-10 px-6 bg-zinc-950 text-white rounded-xl text-[10px] font-black uppercase hover:scale-105 transition-transform"
            >
              Manage
            </Button>
          </div>

          <div className="space-y-4">
            {contacts && contacts.length > 0 ? (
              contacts.map((contact: any) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 group-hover:text-zinc-950 transition-colors">
                      <Phone size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                        {contact.relationship || "Guardian"}
                      </span>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                        {contact.name}
                      </p>
                      <p className="text-[11px] text-slate-500 font-bold tracking-wider mt-0.5">
                        {contact.phone}
                      </p>
                    </div>
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200 ring-4 ring-emerald-50" />
                </div>
              ))
            ) : (
              <div className="py-16 text-center bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200">
                <div className="h-16 w-16 bg-white rounded-[24px] shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <AlertTriangle size={32} />
                </div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Your safety circle is empty
                </p>
                <p className="text-[10px] text-slate-300 font-medium mt-2">
                  Add trusted contacts for SOS protection
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
