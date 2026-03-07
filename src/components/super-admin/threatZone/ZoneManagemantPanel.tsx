"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  setSelectedZone,
  setZoneSeverity,
  startEditZone,
  toggleZoneVisibility,
} from "@/hooks/redux/redux-slices/adminMapSlice";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOff, Pencil, Trash2, TriangleAlert } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteZone } from "@/services/api/zone.api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useProfile } from "@/hooks/react-query/useProfile";

const severityConfig: Record<
  number,
  { label: string; color: string; bg: string; border: string }
> = {
  1: {
    label: "Safe",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  2: {
    label: "Low",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  3: {
    label: "Medium",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  4: {
    label: "High",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  5: {
    label: "Extreme",
    color: "text-rose-800",
    bg: "bg-rose-100",
    border: "border-rose-300",
  },
};

const typeConfig: Record<string, { label: string; color: string }> = {
  threat_zone: { label: "Threat", color: "text-red-600" },
  safe_zone: { label: "Safe Zone", color: "text-emerald-600" },
  exit_route: { label: "Route", color: "text-blue-600" },
};

const ZoneManagementPanel = ({ zones }: any) => {
  const query = useQueryClient();
  const dispatch = useAppDispatch();
  const { activeZoneFilter, hiddenZoneIds } = useAppSelector(
    (state) => state.adminMap,
  );
  const { data: profile } = useProfile();
  const isSuperAdmin = profile?.role === "SUPER_ADMIN";

  const filteredZone = zones?.filter((z: any) => {
    if (activeZoneFilter === "all") return true;
    return Number(z.severity) === Number(activeZoneFilter);
  });

  const deleteMutation = useMutation({
    mutationFn: deleteZone,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["zones"] });
      dispatch(setSelectedZone(null));
      toast.success("Zone deleted");
    },
    onError: () => toast.error("Failed to delete zone"),
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between h-14 px-5 border-b border-slate-50 -mx-5 -mt-5 mb-5 bg-white/50">
        <div>
          <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.15em]">
            Zone Registry
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">
            {filteredZone?.length} / {zones?.length} shown
          </p>
        </div>
        <div className="h-8 w-8 rounded-xl bg-orange-50 flex items-center justify-center">
          <TriangleAlert className="h-4 w-4 text-orange-400" />
        </div>
      </div>

      {/* Severity Filter */}
      <Select
        value={activeZoneFilter}
        onValueChange={(value) =>
          dispatch(setZoneSeverity(value === "all" ? "all" : (value as any)))
        }
      >
        <SelectTrigger className="h-9 text-xs font-bold bg-slate-50 border-slate-200 rounded-xl">
          <SelectValue placeholder="Filter by severity" />
        </SelectTrigger>
        <SelectContent className="z-[1000]">
          <SelectItem value="all">All Severities</SelectItem>
          <SelectItem value="2">Low</SelectItem>
          <SelectItem value="3">Medium</SelectItem>
          <SelectItem value="4">High</SelectItem>
          <SelectItem value="5">Extreme</SelectItem>
        </SelectContent>
      </Select>

      {/* Zone List */}
      <div className="space-y-2">
        {filteredZone?.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
            <TriangleAlert className="h-8 w-8 text-slate-200 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              No zones found
            </p>
          </div>
        )}

        {filteredZone?.map((zone: any) => {
          const isHidden = hiddenZoneIds?.includes(zone.id);
          const sev = severityConfig[zone.severity] ?? severityConfig[3];
          const typ = typeConfig[zone.type] ?? {
            label: zone.type,
            color: "text-slate-500",
          };

          return (
            <div
              key={zone.id}
              className={cn(
                "border-2 rounded-2xl p-3.5 transition-all duration-200 hover:shadow-sm",
                isHidden
                  ? "opacity-50 bg-slate-50 border-slate-100"
                  : "bg-white border-slate-100 hover:border-slate-200",
              )}
            >
              {/* Zone Info */}
              <div
                className="cursor-pointer mb-3"
                onClick={() => dispatch(setSelectedZone(zone.id))}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-sm font-black text-slate-900 leading-none">
                    {zone?.name}
                  </p>
                  <span
                    className={cn(
                      "text-[9px] font-black uppercase tracking-wider",
                      typ.color,
                    )}
                  >
                    {typ.label}
                  </span>
                </div>
                <span
                  className={cn(
                    "inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                    sev.bg,
                    sev.color,
                    sev.border,
                  )}
                >
                  {sev.label}
                </span>
              </div>

              {/* Actions */}
              {isSuperAdmin && (
                <div className="flex gap-1.5">
                  <Button
                    size="icon"
                    onClick={() => dispatch(startEditZone(zone.id))}
                    className="h-7 w-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border-none shadow-none"
                  >
                    <Pencil size={12} />
                  </Button>
                  <Button
                    size="icon"
                    onClick={() => dispatch(toggleZoneVisibility(zone.id))}
                    className={cn(
                      "h-7 w-7 rounded-lg border-none shadow-none",
                      isHidden
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-500"
                        : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600",
                    )}
                  >
                    {!isHidden ? <EyeIcon size={12} /> : <EyeOff size={12} />}
                  </Button>
                  <Button
                    size="icon"
                    onClick={() => deleteMutation.mutate(zone.id)}
                    disabled={deleteMutation.isPending}
                    className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 border-none shadow-none ml-auto"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ZoneManagementPanel;
