"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { closeZoneModal } from "@/hooks/redux/redux-slices/adminMapSlice";
import { useForm } from "react-hook-form";
import { ThreatInput } from "@/typeScript/types/global.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createZone } from "@/services/api/zone.api";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Save, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const ZoneCreateModal = () => {
  const open = useAppSelector((state) => state.adminMap.zoneModalOpen);
  const draftGeo = useAppSelector((state) => state.adminMap.zoneDraftGeo);
  const dispatch = useAppDispatch();
  const query = useQueryClient();
  const { register, handleSubmit, setValue, reset } = useForm<ThreatInput>({
    defaultValues: { name: "", severity: 0, type: "threat_zone" },
  });

  const saveMutation = useMutation({
    mutationFn: createZone,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["zones"] });
      dispatch(closeZoneModal());
      reset();
      toast.success("Zone created successfully");
    },
    onError: () => toast.error("Failed to save zone"),
  });

  const onSubmit = (data: ThreatInput) => {
    if (!draftGeo) {
      toast.error("Please draw a zone on the map first");
      return;
    }
    saveMutation.mutate({
      name: data.name,
      severity: data.severity,
      type: data.type,
      geojson: draftGeo,
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => dispatch(closeZoneModal())}>
      <DialogContent className="z-[10000] max-w-md rounded-[28px] border-0 shadow-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-zinc-950 px-7 py-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-white font-black text-base uppercase tracking-tight">
              <TriangleAlert className="h-5 w-5 text-orange-400" />
              Create Zone
            </DialogTitle>
            <p className="text-zinc-400 text-xs font-medium mt-1">
              Define a new geographic risk or safety boundary.
            </p>
          </DialogHeader>
        </div>

        {/* Body */}
        <form className="space-y-5 px-7 py-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Zone Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Zone Name
            </label>
            <Input
              type="text"
              placeholder="e.g. Night Market District"
              {...register("name")}
              className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm font-semibold focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Type
              </label>
              <Select
                onValueChange={(v: any) => setValue("type", v)}
                defaultValue="threat_zone"
              >
                <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs font-bold">
                  <SelectValue placeholder="Zone Type" />
                </SelectTrigger>
                <SelectContent className="z-[10001]">
                  <SelectGroup>
                    <SelectItem value="threat_zone">🔴 Threat Zone</SelectItem>
                    <SelectItem value="safe_zone">🟢 Safe Zone</SelectItem>
                    <SelectItem value="exit_route">
                      🔵 Emergency Route
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Severity */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Severity
              </label>
              <Select
                onValueChange={(v: any) => setValue("severity", Number(v))}
              >
                <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs font-bold">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="z-[10001]">
                  <SelectGroup>
                    <SelectItem value="1">✅ Safe / Clear</SelectItem>
                    <SelectItem value="2">🟡 Low</SelectItem>
                    <SelectItem value="3">🟠 Medium</SelectItem>
                    <SelectItem value="4">🔴 High</SelectItem>
                    <SelectItem value="5">⚫ Extreme</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Map Draw Status */}
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold",
              draftGeo
                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                : "bg-amber-50 border-amber-100 text-amber-700",
            )}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full shrink-0",
                draftGeo ? "bg-emerald-500" : "bg-amber-400 animate-pulse",
              )}
            />
            {draftGeo
              ? "Zone boundary captured ✓"
              : "Draw a boundary on the map first"}
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-black text-[11px] uppercase tracking-widest rounded-xl border-none shadow-lg"
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Zone
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ZoneCreateModal;
