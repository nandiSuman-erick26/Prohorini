"use client";

import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import { useQuery } from "@tanstack/react-query";
import { getZones } from "@/services/api/zone.api";
import { setDrawMode } from "@/hooks/redux/redux-slices/adminMapSlice";
import ZoneCreateModal from "@/components/super-admin/threatZone/ZoneCreateModal";
import ZoneManagementPanel from "@/components/super-admin/threatZone/ZoneManagemantPanel";
import ZoneEditPanel from "@/components/super-admin/threatZone/ZoneEditPanel";
import MapType from "@/components/MapType";
import { PenLine, X, TriangleAlert } from "lucide-react";

import { useProfile } from "@/hooks/react-query/useProfile";

const ThreatZoneMapDraw = dynamic(
  () => import("@/components/super-admin/threatZone/ThreatZoneMapDraw"),
  { ssr: false },
);

const ThreatZoneManager = () => {
  const dispatch = useAppDispatch();
  const { drawMode, isZoneEditMode } = useAppSelector(
    (state) => state.adminMap,
  );
  const { data: profile } = useProfile();
  const isSuperAdmin = profile?.role === "SUPER_ADMIN";

  const { data: zones = [] } = useQuery({
    queryKey: ["zones"],
    queryFn: getZones,
  });

  return (
    <div className="flex gap-0 h-[calc(100vh-64px)] -m-8 overflow-hidden bg-white">
      {/* LEFT: Map Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Map Toolbar */}
        <div className="flex items-center justify-between h-14 px-6 bg-white border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <TriangleAlert className="h-4 w-4 text-orange-500" />
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Zone Map Editor
            </h2>
            <div className="h-4 w-px bg-slate-100 mx-1" />
            <span className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100">
              {zones.length} Active Zones
            </span>
          </div>
          <div className="flex gap-3 items-center">
            <MapType />
            {isSuperAdmin ? (
              <>
                <div className="h-6 w-px bg-slate-100 mx-1" />
                {drawMode ? (
                  <Button
                    onClick={() => dispatch(setDrawMode(false))}
                    size="sm"
                    className="h-9 px-5 bg-red-500 hover:bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-full border-none shadow-lg shadow-red-100 transition-all active:scale-95"
                  >
                    <X className="h-3.5 w-3.5 mr-2" />
                    Exit Draw
                  </Button>
                ) : (
                  <Button
                    onClick={() => dispatch(setDrawMode(true))}
                    size="sm"
                    className="h-9 px-5 bg-zinc-900 hover:bg-zinc-800 text-white font-black text-[10px] uppercase tracking-widest rounded-full border-none shadow-lg shadow-zinc-200 transition-all active:scale-95"
                  >
                    <PenLine className="h-3.5 w-3.5 mr-2" />
                    Draw Zone
                  </Button>
                )}
              </>
            ) : (
              <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Editor Restricted to Super Admin
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Draw Instruction Banner */}
        {drawMode && (
          <div className="flex items-center gap-3 px-6 py-2.5 bg-amber-50 border-b border-amber-100 text-amber-800 text-[10px] uppercase font-black tracking-wider animate-in slide-in-from-top duration-300">
            <span className="h-2 w-2 bg-amber-500 rounded-full animate-ping" />
            Draw mode active — Click to place points. Close shape by clicking
            the origin.
          </div>
        )}

        {/* Map Wrapper */}
        <div className="flex-1 relative overflow-hidden bg-slate-50">
          <ThreatZoneMapDraw zones={zones} />
        </div>
      </div>

      {/* RIGHT: Panel */}
      <div className="w-[340px] bg-white border-l border-slate-100 flex flex-col overflow-hidden shrink-0">
        <div className="overflow-y-auto flex-1 p-5">
          {isZoneEditMode ? (
            <ZoneEditPanel zones={zones} />
          ) : (
            <ZoneManagementPanel zones={zones} />
          )}
        </div>
      </div>

      <ZoneCreateModal />
    </div>
  );
};

export default ThreatZoneManager;
