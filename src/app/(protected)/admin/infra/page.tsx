"use client";
import dynamic from "next/dynamic";
import InfrastructurePanel from "@/components/super-admin/Infrastructure/InfrastucturePanel";
import MapType from "@/components/MapType";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import { setInfraMode } from "@/hooks/redux/redux-slices/adminMapSlice";
import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";

import { useProfile } from "@/hooks/react-query/useProfile";

const InfrastructureMap = dynamic(
  () => import("@/components/super-admin/Infrastructure/InfrastructureMap"),
  { ssr: false },
);

const InfraStructure = () => {
  const dispatch = useAppDispatch();
  const { data: profile } = useProfile();
  const isSuperAdmin = profile?.role === "SUPER_ADMIN";

  return (
    <div className="flex gap-0 h-[calc(100vh-64px-2rem)] -m-8 p-0">
      {/* LEFT: Map Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-black text-slate-700 uppercase tracking-tight">
              Infrastructure Map
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapType />
            {isSuperAdmin ? (
              <Button
                onClick={() => dispatch(setInfraMode("add"))}
                size="sm"
                className="h-8 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-black text-[11px] uppercase tracking-wider rounded-xl border-none"
              >
                <Plus className="h-3 w-3 mr-1.5" />
                Add Point
              </Button>
            ) : (
              <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                  POI Restricted to Super Admin
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative overflow-hidden">
          <InfrastructureMap />
        </div>
      </div>

      {/* RIGHT: Panel */}
      <div className="w-[340px] bg-white border-l border-slate-100 flex flex-col overflow-hidden shrink-0">
        <div className="overflow-y-auto flex-1 p-5">
          <InfrastructurePanel />
        </div>
      </div>
    </div>
  );
};

export default InfraStructure;
