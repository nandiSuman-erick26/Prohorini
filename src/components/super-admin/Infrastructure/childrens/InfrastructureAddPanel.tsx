"use client";

import {
  resetInfraDraft,
  setInfraMode,
} from "@/hooks/redux/redux-slices/adminMapSlice";
import { createSafetyInfra } from "@/services/api/safetyInfra.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import { toast } from "sonner";
import { Loader2, Save, X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const InfrastructureAddPanel = () => {
  const dispatch = useAppDispatch();
  const query = useQueryClient();
  const { infraDraft } = useAppSelector((state) => state.adminMap);

  const createMutation = useMutation({
    mutationFn: createSafetyInfra,
    onSuccess: async () => {
      await query.refetchQueries({ queryKey: ["infra"] });
      dispatch(resetInfraDraft());
      dispatch(setInfraMode("view"));
      toast.success("Infrastructure point saved");
    },
    onError: () => toast.error("Failed to save point"),
  });

  const { handleSubmit, register, setValue } = useForm({
    defaultValues: {
      name: "",
      type: "",
      lat: "",
      lng: "",
      address: "",
      phone: "",
    },
  });

  const cancel = () => {
    dispatch(resetInfraDraft());
    dispatch(setInfraMode("view"));
  };

  const onSubmit: SubmitHandler<any> = (data: any) => {
    if (!infraDraft) {
      toast.error("Click on the map to set a location first");
      return;
    }
    createMutation.mutate({
      ...data,
      lat: infraDraft.lat,
      lng: infraDraft.lng,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">
            New Point
          </p>
          <h2 className="text-base font-black text-slate-900 tracking-tight">
            Add Infrastructure
          </h2>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={cancel}
          className="h-8 w-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X size={16} />
        </Button>
      </div>

      {/* Location Status */}
      <div
        className={cn(
          "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-bold",
          infraDraft
            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
            : "bg-amber-50 border-amber-100 text-amber-700",
        )}
      >
        <span
          className={cn(
            "h-2 w-2 rounded-full shrink-0",
            infraDraft ? "bg-emerald-500" : "bg-amber-400 animate-pulse",
          )}
        />
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        {infraDraft
          ? `Location set: ${infraDraft.lat.toFixed(4)}, ${infraDraft.lng.toFixed(4)}`
          : "Click on the map to set location"}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Name
          </label>
          <Input
            placeholder="e.g. Kolkata Police HQ"
            {...register("name", { required: true })}
            className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm font-semibold focus:bg-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Type
          </label>
          <Select onValueChange={(val) => setValue("type", val)}>
            <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs font-bold">
              <SelectValue placeholder="Select type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="police">🚓 Police Station</SelectItem>
              <SelectItem value="hospital">🏥 Hospital</SelectItem>
              <SelectItem value="help-center">🆘 Help Center</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Phone <span className="normal-case font-medium">(optional)</span>
          </label>
          <Input
            placeholder="+91 00000 00000"
            {...register("phone")}
            className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm font-semibold focus:bg-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Address <span className="normal-case font-medium">(optional)</span>
          </label>
          <Input
            placeholder="Street, Area, City"
            {...register("address")}
            className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm font-semibold focus:bg-white"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="flex-1 h-10 bg-zinc-900 hover:bg-zinc-800 text-white font-black text-[11px] uppercase tracking-widest rounded-xl border-none"
          >
            {createMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="h-3.5 w-3.5 mr-1.5" /> Save Point
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={cancel}
            className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border-none shadow-none"
            size="icon"
          >
            <X size={16} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InfrastructureAddPanel;
