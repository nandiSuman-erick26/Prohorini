"use client";

import {
  resetInfraDraft,
  setInfraMode,
} from "@/hooks/redux/redux-slices/adminMapSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import {
  getSafetyInfra,
  updateSaftyinfra,
} from "@/services/api/safetyInfra.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";

const InfrastructureEditPanel = () => {
  const dispatch = useAppDispatch();
  const { selectedInfraId, infraDraft } = useAppSelector(
    (state) => state.adminMap,
  );
  const query = useQueryClient();
  const { data: infra } = useQuery({
    queryKey: ["infra"],
    queryFn: getSafetyInfra,
  });
  const selected = infra?.find((i: any) => i.id === selectedInfraId);
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: selected?.name,
      type: selected?.type,
      phone: selected?.phone,
      address: selected?.address,
      // lat: selected?.lat,
      // lng: selected?.lng,
    },
  });
  const updateMutation = useMutation({
    mutationFn: updateSaftyinfra,
    onSuccess: async () => {
      await query.refetchQueries({ queryKey: ["infra"] });
      dispatch(resetInfraDraft());
      dispatch(setInfraMode("view"));
      // toast.success("Points Updated successfully");
    },
  });

  if (!selected) return null;

  const onSubmit: SubmitHandler<any> = (data: any) => {
    console.log(data);
    
    updateMutation.mutate({
      id: selected.id,
      name: data.name,
      type: data.type,
      phone: data.phone,
      address: data.address,
      lat: infraDraft?.lat ?? selected.lat,
      lng: infraDraft?.lng ?? selected.lng,
    });
  };
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">EDIT INFRASTRUCTURE</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Name" {...register("name", { required: true })} />
        <Select value={selected.type} onValueChange={(value) => setValue("type", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="police">Police</SelectItem>
            <SelectItem value="hospital">Hospital</SelectItem>
            <SelectItem value="help-center">Help Center</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="Phone" {...register("phone")} />
        <Input placeholder="Address" {...register("address")} />

        {selected && (
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground p-2 border rounded">
              Lat: {infraDraft?.lat.toFixed(5)}
            </p>
            <p className="text-sm text-muted-foreground p-2 border rounded">
              Lng: {infraDraft?.lng.toFixed(5)}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="submit"
            className="w-2/3 bg-blue-500 text-white hover:bg-blue-600"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Updating..." : "Update"}
          </Button>
          <Button
            className="w-1/3 bg-red-500 text-white hover:bg-red-600"
            onClick={() => {
              dispatch(resetInfraDraft());
              dispatch(setInfraMode("view"));
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InfrastructureEditPanel;
