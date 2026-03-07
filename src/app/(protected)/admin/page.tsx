"use client";

import Statcard from "@/components/admin-panel/dashboard-layout/Statcard";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/lib/axios";
import {
  Loader2,
  Users,
  ShieldAlert,
  TriangleAlert,
  FileText,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/hooks/redux/store/rootRedux";
import IncidentTrendsChart from "@/components/admin-panel/charts/IncidentTrendsChart";
import IncidentDistributionChart from "@/components/admin-panel/charts/IncidentDistributionChart";
import PriorityBarChart from "@/components/admin-panel/charts/PriorityBarChart";
import ProhoriniShieldLoader from "@/components/ui/loaders/ProhoriniShieldLoader";

const AdminPage = () => {
  const { adminProfile } = useAppSelector((state) => state.adminProfile);
  // console.log("adminProfile", adminProfile?.role);

  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const { data } = await API.get("/admin/dashboard-stats");
      return data;
    },
    refetchInterval: 30000,
  });

  const { data: chartData, isLoading: isChartsLoading } = useQuery({
    queryKey: ["adminChartData"],
    queryFn: async () => {
      const { data } = await API.get("/admin/dashboard-charts");
      return data;
    },
    refetchInterval: 60000,
  });

  if (isStatsLoading || isChartsLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <ProhoriniShieldLoader message="Synchronizing Command Data..." />
      </div>
    );
  }

  const quickActions = [
    {
      label: "View SOS Alerts",
      href: "/admin/sos",
      color: "bg-red-600",
      icon: ShieldAlert,
    },
    {
      label: "Manage Reports",
      href: "/admin/reports",
      color: "bg-orange-600",
      icon: FileText,
    },
    {
      label: "Manage Users",
      href: "/admin/users",
      color: "bg-slate-900",
      icon: Users,
    },
    {
      label: "Threat Zones",
      href: "/admin/zones",
      color: "bg-zinc-800",
      icon: TriangleAlert,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 📊 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <Statcard
          title="Total Platform Users"
          value={stats?.totalUsers?.toLocaleString() || "0"}
          change="+8% vs last week"
          positive
          icon={Users}
          accent="blue"
        />
        <Statcard
          title="Active SOS (24h)"
          value={stats?.sosToday?.toString() || "0"}
          change="Real-time monitor"
          neutral
          icon={ShieldAlert}
          accent="red"
        />
        <Statcard
          title="Monitored Zones"
          value={stats?.totalZones?.toString() || "0"}
          change="GPS Geofenced"
          positive
          icon={TriangleAlert}
          accent="orange"
        />
        <Statcard
          title="Pending Review"
          value={stats?.pendingReports?.toString() || "0"}
          change={
            stats?.pendingReports === 0 ? "All cleared" : "Action required"
          }
          positive={stats?.pendingReports === 0}
          icon={FileText}
          accent="purple"
        />
      </div>

      {/* ⚡ Intelligence Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IncidentTrendsChart data={chartData?.trends || []} />
        </div>
        <div>
          <IncidentDistributionChart data={chartData?.distribution || []} />
        </div>
      </div>

      {/* ⚡ Intelligence Charts Row 2 & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriorityBarChart data={chartData?.priorityStats || []} />

        <div className="flex flex-col gap-6">
          <div className="bg-white border-2 border-slate-100 rounded-[28px] p-8 shadow-sm h-full">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-6">
              Critical Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={`${action.color} rounded-[24px] p-5 flex flex-col gap-3 group hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1`}
                  >
                    <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-black text-xs uppercase tracking-wider">
                        {action.label}
                      </span>
                      <ArrowRight className="h-4 w-4 text-white/60 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 Platform Overview */}
      <div className="bg-white border-2 border-slate-100 rounded-[28px] p-8 shadow-sm">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
              Command Center Overview
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-1">
              Real-time core infrastructure status
            </p>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-black text-emerald-700 uppercase tracking-wider">
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Operational
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Location Tracking", status: "Active", ok: true },
            { label: "Alert Pipeline", status: "Active", ok: true },
            { label: "AI Heatmap Engine", status: "Active", ok: true },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 p-5 bg-slate-50/60 rounded-[20px] border border-slate-100 group hover:border-emerald-200 transition-colors"
            >
              <div
                className={`h-2.5 w-2.5 rounded-full ${item.ok ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
              />
              <div>
                <p className="text-xs font-black text-slate-800 tracking-tight">
                  {item.label}
                </p>
                <p
                  className={`text-[9px] font-black uppercase tracking-widest ${item.ok ? "text-emerald-600" : "text-red-500"}`}
                >
                  {item.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
