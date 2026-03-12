"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShieldAlert,
  FileText,
  Crosshair,
  TriangleAlert,
  Users,
  MapPin,
  ScrollText,
  Settings,
  X,
} from "lucide-react";
import Image from "next/image";

const menu = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "SOS Monitor", href: "/admin/sos", icon: ShieldAlert },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Intelligence", href: "/admin/intelligence", icon: Crosshair },
  { name: "Zones", href: "/admin/zones", icon: TriangleAlert },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "POI", href: "/admin/infra", icon: MapPin },
  { name: "Safety Logs", href: "/admin/logs", icon: ScrollText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          // Base styles
          "fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 flex flex-col shrink-0 border-r border-white/5",
          // Desktop: always visible, relative positioning
          "lg:static lg:z-auto lg:translate-x-0",
          // Mobile: slide in/out
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo / Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-18 w-18 rounded-xl flex items-center justify-center overflow-hidden">
              <Image
                src="/prohorini-logo.png"
                width={100}
                height={40}
                alt="Logo"
                className=" object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-xs tracking-[0.2em] uppercase leading-none mb-1">
                PROHORINI
              </span>
              <span className="text-red-500 text-[8px] font-black uppercase tracking-widest opacity-80 leading-none">
                Admin Console
              </span>
            </div>
          </div>

          {/* Close button — only shown on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden h-8 w-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto no-scrollbar">
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-3 pb-2">
            Navigation
          </p>
          {menu.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group",
                  active
                    ? "bg-white/10 text-white"
                    : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    active
                      ? "text-red-400"
                      : "text-zinc-600 group-hover:text-zinc-400",
                  )}
                />
                {item.name}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-red-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/5 p-4 shrink-0">
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest text-center">
            Prohorini Safety Systems &copy; 2026
          </p>
          <br />
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest text-center">
            Developed by <span className="text-red-500">SUMAN NANDI</span>
          </p>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
