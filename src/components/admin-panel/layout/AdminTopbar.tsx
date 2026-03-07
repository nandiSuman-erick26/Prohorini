"use client";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/UserMenu";
import { useClerk } from "@clerk/nextjs";
import { useState } from "react";
import ProhoriniShieldLoader from "@/components/ui/loaders/ProhoriniShieldLoader";
import { usePathname, useRouter } from "next/navigation";
import { Download, Bell } from "lucide-react";
import { useProfile } from "@/hooks/react-query/useProfile";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/admin": { title: "Dashboard", subtitle: "Platform overview & live stats" },
  "/admin/sos": { title: "SOS Monitor", subtitle: "Live emergency response" },
  "/admin/reports": {
    title: "Crime Reports",
    subtitle: "Review & moderate submissions",
  },
  "/admin/heatmap": {
    title: "Heatmap",
    subtitle: "Spatial crime density analysis",
  },
  "/admin/zones": {
    title: "Threat Zones",
    subtitle: "Manage geofenced risk areas",
  },
  "/admin/users": {
    title: "User Management",
    subtitle: "Accounts, roles & verification",
  },
  "/admin/infra": {
    title: "Infrastructure",
    subtitle: "Safety POI management",
  },
  "/admin/logs": {
    title: "Safety Logs",
    subtitle: "Incident history & audit trail",
  },
  "/admin/settings": { title: "Settings", subtitle: "Platform configuration" },
};

const AdminTopbar = () => {
  const router = useRouter();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const { data: profile } = useProfile();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const page = pageTitles[pathname] ?? { title: "Admin", subtitle: "" };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ redirectUrl: "/sign-in" });
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const handleSwitch = () => {
    router.push("/admin/settings");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
      {/* Page Title */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-1.5 bg-red-500 rounded-full" />
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none italic">
            {page.title}
          </h1>
          <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-[0.2em] opacity-70">
            {page.subtitle}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* <button className="relative h-9 w-9 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors">
          <Bell className="h-4 w-4 text-slate-500" />
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white" />
        </button>

        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex h-9 px-4 rounded-xl border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider hover:bg-slate-50"
        >
          <Download className="h-3.5 w-3.5 mr-2" />
          Export
        </Button> */}

        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* User Profile Info */}
        <div className="flex items-center gap-3 pl-1">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-xs font-black text-slate-900 leading-none uppercase">
              {profile?.full_name || "New Admin"}
            </span>
            <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest mt-1">
              {profile?.role || "Moderator"}
            </span>
          </div>
          <UserMenu
            imageUrl={profile?.photo_url}
            handleLogout={handleLogout}
            handleProfileVisit={handleSwitch}
            handleSetupVisit={handleSwitch}
          />
        </div>
      </div>
      {isLoggingOut && (
        <div className="fixed inset-0 z-[99999] bg-white/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
          <ProhoriniShieldLoader message="Terminating secure session..." />
        </div>
      )}
    </header>
  );
};

export default AdminTopbar;
