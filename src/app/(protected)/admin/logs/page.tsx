"use client";

import React from "react";
import { useAdminLogs } from "@/hooks/react-query/useAdminLogs";
import { Loader2, ShieldAlert, MapPin, Clock, User } from "lucide-react";

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(dateString));
};

const SafetyLogsPage = () => {
  const { data: logs, isLoading, error } = useAdminLogs();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
        Failed to load safety logs. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px-4rem)] gap-4">
      {/* Pinned Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-base font-black text-slate-900 uppercase tracking-tight leading-none">
            Safety Incident Logs
          </h1>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">
            Real-time feed of all threat zone entries and SOS triggers.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold border border-green-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          LIVE MONITORING
        </div>
      </div>

      {/* Scrollable Table */}
      <div className="flex-1 overflow-hidden bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
        <div className="h-full overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">
                  Time
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">
                  User
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">
                  Event
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">
                  Zone
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">
                  Location
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs?.map((log: any) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="h-3.5 w-3.5 opacity-50" />
                      <span className="text-sm font-medium">
                        {formatDate(log.created_at)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-slate-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 leading-tight">
                          {log.users_profile?.full_name || "Unknown User"}
                        </span>
                        <span className="text-[10px] text-slate-400 lowercase">
                          {log.users_profile?.email || "No email"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        log.event_type === "zone_alert"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-red-50 text-red-700 border-red-100"
                      }`}
                    >
                      <ShieldAlert className="h-3 w-3" />
                      {log.event_type.replace("_", " ")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-slate-700">
                      {log.zone_name || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={`https://maps.google.com/?q=${log.lat},${log.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      View Map
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-md font-mono line-clamp-1 group-hover:line-clamp-none transition-all">
                      {JSON.stringify(log.details)}
                    </div>
                  </td>
                </tr>
              ))}
              {(!logs || logs.length === 0) && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No safety incidents logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SafetyLogsPage;
