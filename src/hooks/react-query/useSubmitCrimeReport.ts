import { submitCrimeReport } from "@/lib/api/crimeReportSubmit";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSubmitCrimeReport = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: submitCrimeReport,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["crime-reports-approved"] });
    },
  });
};
