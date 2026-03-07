"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useActiveSos } from "@/hooks/react-query/useActiveSos";
import {
  Loader2,
  ShieldAlert,
  Phone,
  User,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Dynamic import for Leaflet elements (no SSR)
const SOSMonitorMap = dynamic(
  () => import("@/components/admin-panel/sos/SOSMonitorMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center">
        Loading Monitor Map...
      </div>
    ),
  },
);

const SosMonitorPage = () => {
  const { data: activeSos = [], isLoading } = useActiveSos();
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const activeSosList = Array.isArray(activeSos) ? activeSos : [];

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-red-600 animate-pulse" />
            LIVE SOS MONITOR
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Real-time status of all active emergency requests across the
            platform.
          </p>
        </div>
        <div className="bg-red-600 text-white px-4 py-2 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg shadow-red-200">
          <span className="h-2 w-2 bg-white rounded-full animate-ping" />
          {activeSosList.length} ACTIVE EMERGENCIES
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* User List Sidebar */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {activeSosList.map((sos: any) => (
              <div
                key={sos.user_id}
                onClick={() => setSelectedUser(sos)}
                className={`p-4 rounded-[20px] border-2 transition-all cursor-pointer ${
                  selectedUser?.user_id === sos.user_id
                    ? "border-red-600 bg-red-50"
                    : "border-slate-100 bg-white hover:border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">
                        {sos.users_profile?.full_name || "Unknown"}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        ID: {sos.user_id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="destructive"
                    className="animate-pulse text-[9px] font-black uppercase"
                  >
                    SOS ACTIVE
                  </Badge>
                </div>
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                    <Phone className="h-3 w-3" />
                    {sos.users_profile?.phone || "No phone linked"}
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${sos.latitude},${sos.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline text-xs font-medium transition-all"
                  >
                    <MapPin className="h-3 w-3" />
                    View Map
                  </a>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-[10px] font-black uppercase py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
                    Details
                  </button>
                  <a
                    href={`https://maps.google.com/?q=${sos.latitude},${sos.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase py-2 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-md shadow-red-100"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Maps
                  </a>
                </div>
              </div>
            ))}

            {activeSosList.length === 0 && !isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                  <ShieldAlert className="h-8 w-8 text-slate-200" />
                </div>
                <h3 className="font-black text-slate-400 text-sm uppercase">
                  No Active SOS
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  The platform is currently safe. All users are secure.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Live Map Panel */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[32px] border-2 border-slate-100 overflow-hidden shadow-sm relative">
          <SOSMonitorMap
            activeSos={activeSosList}
            selectedUser={selectedUser}
            onMarkerClick={(sos: any) => setSelectedUser(sos)}
          />
        </div>
      </div>
    </div>
  );
};

export default SosMonitorPage;
