"use client";
import { useState } from "react";
import AdminSidebar from "@/components/admin-panel/layout/AdminSidebar";
import AdminTopbar from "@/components/admin-panel/layout/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50/80 overflow-hidden">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <AdminTopbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar bg-grid-pattern-admin">
          {children}
        </main>
      </div>
    </div>
  );
}
