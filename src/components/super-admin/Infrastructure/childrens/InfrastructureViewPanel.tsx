"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  setInfraFilterType,
  setInfraMode,
  setSelectedInfra,
} from "@/hooks/redux/redux-slices/adminMapSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import {
  deleteSafetyInfra,
  getSafetyInfra,
} from "@/services/api/safetyInfra.api";
import { InfraType } from "@/typeScript/types/redux.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, ShieldCheck, Cross, MapPin } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/react-query/useProfile";

const typeConfig: Record<
  string,
  { label: string; icon: any; bg: string; text: string; border: string }
> = {
  police: {
    label: "Police",
    icon: ShieldCheck,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  hospital: {
    label: "Hospital",
    icon: Cross,
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  "help-line": {
    label: "Help Line",
    icon: MapPin,
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  "help-center": {
    label: "Help Center",
    icon: MapPin,
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
};

const InfrastructureViewPanel = () => {
  const dispatch = useAppDispatch();
  const query = useQueryClient();
  const { infraFilterType, selectedInfraId } = useAppSelector(
    (state) => state.adminMap,
  );
  const { data: profile } = useProfile();
  const isSuperAdmin = profile?.role === "SUPER_ADMIN";

  const { data: infra } = useQuery({
    queryKey: ["infra"],
    queryFn: getSafetyInfra,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSafetyInfra,
    onSuccess: async () => {
      await query.refetchQueries({ queryKey: ["infra"] });
      toast.success("Infrastructure point deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const filteredInfra =
    infra?.filter((i: any) =>
      infraFilterType === "all" ? true : i.type === infraFilterType,
    ) ?? [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
            POI Registry
          </h2>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            {filteredInfra.length} / {infra?.length ?? 0} points shown
          </p>
        </div>
        {isSuperAdmin && (
          <Button
            onClick={() => dispatch(setInfraMode("add"))}
            size="icon"
            className="h-8 w-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border-none shadow"
          >
            <Plus size={14} />
          </Button>
        )}
      </div>

      {/* Filter */}
      <Select
        value={infraFilterType}
        onValueChange={(val: InfraType) => dispatch(setInfraFilterType(val))}
      >
        <SelectTrigger className="h-9 text-xs font-bold bg-slate-50 border-slate-200 rounded-xl">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent className="z-[1000]">
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="police">Police Stations</SelectItem>
          <SelectItem value="hospital">Hospitals</SelectItem>
          <SelectItem value="help-line">Help Lines</SelectItem>
        </SelectContent>
      </Select>

      {/* List */}
      <div className="space-y-2">
        {filteredInfra.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
            <MapPin className="h-8 w-8 text-slate-200 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              No points found
            </p>
          </div>
        )}

        {filteredInfra.map((i: any) => {
          const cfg = typeConfig[i.type] ?? typeConfig["help-line"];
          const Icon = cfg.icon;
          const isSelected = selectedInfraId === i.id;

          return (
            <div
              key={i.id}
              className={cn(
                "border-2 rounded-2xl p-3.5 transition-all duration-200 hover:shadow-sm",
                isSelected
                  ? "border-blue-200 bg-blue-50/50"
                  : "border-slate-100 bg-white hover:border-slate-200",
              )}
            >
              {/* Top Row */}
              <div className="flex items-start gap-3 mb-3">
                <div
                  className={cn(
                    "h-8 w-8 rounded-xl flex items-center justify-center shrink-0",
                    cfg.bg,
                    cfg.text,
                  )}
                >
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900 truncate leading-tight">
                    {i.name}
                  </p>
                  <span
                    className={cn(
                      "inline-flex text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border mt-1",
                      cfg.bg,
                      cfg.text,
                      cfg.border,
                    )}
                  >
                    {cfg.label}
                  </span>
                </div>
              </div>

              {/* Address / Phone */}
              {(i.address || i.phone) && (
                <div className="space-y-0.5 mb-3">
                  {i.address && (
                    <p className="text-[11px] text-slate-500 font-medium truncate">
                      {i.address}
                    </p>
                  )}
                  {i.phone && (
                    <p className="text-[11px] font-bold text-blue-600">
                      📞 {i.phone}
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              {isSuperAdmin && (
                <div className="flex gap-1.5">
                  <Button
                    size="icon"
                    onClick={() => {
                      dispatch(setSelectedInfra(i.id));
                      dispatch(setInfraMode("edit"));
                    }}
                    className="h-7 w-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border-none shadow-none"
                  >
                    <Pencil size={12} />
                  </Button>
                  <Button
                    size="icon"
                    onClick={() => {
                      if (confirm("Delete this infrastructure point?")) {
                        deleteMutation.mutate(i.id);
                      }
                    }}
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

export default InfrastructureViewPanel;
