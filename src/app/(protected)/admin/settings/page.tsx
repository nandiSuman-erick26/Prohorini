"use client";

import React from "react";
import AdminProfileForm from "@/components/admin-panel/settings/AdminProfileForm";
import { Settings as SettingsIcon, ShieldCheck } from "lucide-react";

const AdminSettingsPage = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-zinc-950 rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-200">
            <SettingsIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter leading-none">
              Console Settings
            </h1>
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-red-500" />
              Advanced Security Controls
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-12">
        {/* Profile Section */}
        <section className="space-y-4">
          <div className="px-1 border-l-4 border-red-500">
            <h2 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">
              Profile Management
            </h2>
          </div>
          <AdminProfileForm />
        </section>

        {/* Potentially more sections in the future (Notifications, Preferences, etc.) */}
      </div>
    </div>
  );
};

export default AdminSettingsPage;
