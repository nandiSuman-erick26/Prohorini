import AdminSidebar from "@/components/admin-panel/layout/AdminSidebar";
import AdminTopbar from "@/components/admin-panel/layout/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50/80 overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <AdminTopbar />
        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-grid-pattern-admin">
          {children}
        </main>
      </div>
    </div>
  );
}
