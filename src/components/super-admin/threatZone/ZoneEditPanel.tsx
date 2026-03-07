"use client";
import {
  setEditingZoneDraft,
  stopEditZone,
} from "@/hooks/redux/redux-slices/adminMapSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import { updateZone } from "@/services/api/zone.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { X, Check, Loader2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const severityOptions = [
  {
    value: 2,
    label: "Low",
    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
  },
  {
    value: 3,
    label: "Medium",
    color: "bg-orange-50 border-orange-200 text-orange-700",
  },
  { value: 4, label: "High", color: "bg-red-50 border-red-200 text-red-700" },
  {
    value: 5,
    label: "Extreme",
    color: "bg-rose-100 border-rose-300 text-rose-800",
  },
];

const ZoneEditPanel = ({ zones }: any) => {
  const dispatch = useAppDispatch();
  const query = useQueryClient();
  const { editingZoneDraft, editingZoneId } = useAppSelector(
    (state) => state.adminMap,
  );

  const zone = zones?.find((z: any) => z.id === editingZoneId);
  const currentSeverity = editingZoneDraft?.severity ?? zone?.severity;

  const updateMutation = useMutation({
    mutationFn: updateZone,
    onSuccess: async () => {
      await query.invalidateQueries({ queryKey: ["zones"] });
      dispatch(stopEditZone());
      toast.success("Zone updated successfully");
    },
    onError: () => toast.error("Failed to update zone"),
  });

  if (!zone) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">
            Editing Zone
          </p>
          <h2 className="text-base font-black text-slate-900 tracking-tight leading-tight">
            {zone.name}
          </h2>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => dispatch(stopEditZone())}
          className="h-8 w-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X size={16} />
        </Button>
      </div>

      {/* Severity Selector */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Severity Level
        </label>
        <div className="flex flex-col gap-2">
          {severityOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                dispatch(setEditingZoneDraft({ severity: opt.value }))
              }
              className={cn(
                "flex items-center justify-between px-4 py-2.5 rounded-xl border-2 text-sm font-black transition-all duration-150",
                currentSeverity === opt.value
                  ? opt.color + " ring-2 ring-offset-1 ring-current"
                  : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200",
              )}
            >
              {opt.label}
              {currentSeverity === opt.value && <Check size={14} />}
            </button>
          ))}
        </div>
      </div>

      {/* Warning */}
      <div className="flex gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
        <TriangleAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-700 font-medium">
          Changing severity will update alert thresholds and map visibility for
          all users.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <Button
          onClick={() => {
            if (!editingZoneDraft) return;
            updateMutation.mutate({
              id: editingZoneId,
              geojson: editingZoneDraft?.geojson ?? zone?.geojson,
              severity: editingZoneDraft?.severity ?? zone?.severity,
            });
          }}
          disabled={updateMutation.isPending || !editingZoneDraft}
          className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-black text-[11px] uppercase tracking-wider h-10 rounded-xl border-none"
        >
          {updateMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Check className="h-3.5 w-3.5 mr-1.5" />
              Save Changes
            </>
          )}
        </Button>
        <Button
          size="icon"
          onClick={() => dispatch(stopEditZone())}
          disabled={updateMutation.isPending}
          className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border-none shadow-none"
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ZoneEditPanel;
