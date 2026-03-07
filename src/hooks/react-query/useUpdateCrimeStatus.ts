import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCrimeReportStatus } from "@/app/actions/updateCrimeStatus";

export const useUpdateCrimeStatus = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "approved" | "rejected";
    }) => {
      // Uses Server Action with supabaseAdmin (service role) — bypasses RLS
      const result = await updateCrimeReportStatus(id, status);
      if (!result.success) throw new Error(result.error ?? "Update failed");
      return { status };
    },
    onSuccess: ({ status }) => {
      query.invalidateQueries({ queryKey: ["crime-reports"] });
      if (status === "approved") {
        toast.success("Report approved successfully");
      } else {
        toast.error("Report rejected");
      }
    },
    onError: (error: any) => {
      console.error("Update failed:", error);
      toast.error(`Action failed: ${error?.message ?? "Unknown error"}`);
    },
  });
};
