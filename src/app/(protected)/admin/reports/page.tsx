"use client";
import { useEffect, useState } from "react";
import { useFetchCrimeReports } from "@/hooks/react-query/usePendingCrimeReports";
import { useUpdateCrimeStatus } from "@/hooks/react-query/useUpdateCrimeStatus";
import { setCrimeData } from "@/hooks/redux/redux-slices/adminCrimeSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux/store/rootRedux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Check,
  X,
  MapPin,
  Eye,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const statusTabs = [
  {
    value: "pending",
    label: "Pending",
    icon: Clock,
    color: "text-yellow-600 bg-yellow-50 border-yellow-200",
  },
  {
    value: "approved",
    label: "Approved",
    icon: CheckCircle2,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: XCircle,
    color: "text-red-600 bg-red-50 border-red-200",
  },
  {
    value: "all",
    label: "All",
    icon: FileText,
    color: "text-slate-600 bg-slate-50 border-slate-200",
  },
];

const crimeTypes = [
  { value: "all", label: "All Types" },
  { value: "harassment", label: "Harassment" },
  { value: "theft", label: "Theft" },
  { value: "stalking", label: "Stalking" },
  { value: "assault", label: "Assault" },
  { value: "domestic_violence", label: "Domestic Violence" },
  { value: "kidnapping", label: "Kidnapping" },
  { value: "other", label: "Other" },
];

const typeColors: Record<string, string> = {
  harassment: "bg-orange-100 text-orange-700",
  theft: "bg-yellow-100 text-yellow-700",
  stalking: "bg-purple-100 text-purple-700",
  assault: "bg-red-100 text-red-700",
  domestic_violence: "bg-rose-100 text-rose-700",
  kidnapping: "bg-zinc-900 text-white",
  other: "bg-slate-100 text-slate-600",
};

const statusBadge: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700" },
};

const Reports = () => {
  const dispatch = useAppDispatch();
  const { reports } = useAppSelector((state) => state.adminCrimeReport);
  const { data, isLoading } = useFetchCrimeReports();
  const { mutate, isPending: isActioning } = useUpdateCrimeStatus();
  const [status, setStatus] = useState("pending");
  const [crimeType, setCrimeType] = useState("all");
  const [previewReport, setPreviewReport] = useState<any>(null);

  useEffect(() => {
    if (data) dispatch(setCrimeData(data));
  }, [data, dispatch]);

  const filtered = reports
    .filter((r) => status === "all" || r.status === status)
    .filter((r) => crimeType === "all" || r.type === crimeType);

  const counts = {
    pending: reports.filter((r) => r.status === "pending").length,
    approved: reports.filter((r) => r.status === "approved").length,
    rejected: reports.filter((r) => r.status === "rejected").length,
    all: reports.length,
  };

  return (
    <div className="space-y-6">
      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        {statusTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = status === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setStatus(tab.value)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-xs font-black uppercase tracking-wider transition-all duration-200",
                isActive
                  ? tab.color + " shadow-sm"
                  : "text-slate-400 bg-white border-slate-100 hover:border-slate-200",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
              <span
                className={cn(
                  "ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-black",
                  isActive ? "bg-white/60" : "bg-slate-100",
                )}
              >
                {counts[tab.value as keyof typeof counts]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Type Filter + Count */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-bold text-slate-400">
          Showing{" "}
          <span className="text-slate-700 font-black">{filtered.length}</span>{" "}
          report{filtered.length !== 1 ? "s" : ""}
        </p>
        <Select value={crimeType} onValueChange={setCrimeType}>
          <SelectTrigger className="h-9 w-48 text-xs font-bold rounded-xl border-slate-200 bg-slate-50">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {crimeTypes.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-7 w-7 text-slate-300 animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Loading reports...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-100 rounded-2xl gap-3">
          <FileText className="h-10 w-10 text-slate-200" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
            No reports found
          </p>
          <p className="text-xs font-medium text-slate-300">
            Try adjusting the filters above
          </p>
        </div>
      )}

      {/* Table View */}
      {!isLoading && filtered.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest w-10">
                    #
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Type
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest max-w-[250px]">
                    Description
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Location
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Date
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Evidence
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((report: any, idx: number) => {
                  const typeCls =
                    typeColors[report.type] ?? "bg-slate-100 text-slate-600";
                  const sBadge =
                    statusBadge[report.status] ?? statusBadge.pending;

                  return (
                    <tr
                      key={report.id}
                      className={cn(
                        "border-b border-slate-100 hover:bg-slate-50/50 transition-colors",
                        idx % 2 === 1 && "bg-slate-50/30",
                      )}
                    >
                      {/* Index */}
                      <td className="px-4 py-3 text-xs font-bold text-slate-400">
                        {idx + 1}
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                            typeCls,
                          )}
                        >
                          {report.type?.replace("_", " ")}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="px-4 py-3 max-w-[250px]">
                        <p className="text-xs text-slate-600 font-medium truncate">
                          {report.description || (
                            <span className="text-slate-300 italic">
                              No description
                            </span>
                          )}
                        </p>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3">
                        {report.lat && report.lng ? (
                          <a
                            href={`https://maps.google.com/?q=${report.lat},${report.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-wider"
                          >
                            <MapPin className="h-3 w-3" />
                            View Map
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-300">—</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold text-slate-400">
                          {report.created_at
                            ? new Date(report.created_at).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </span>
                      </td>

                      {/* Evidence */}
                      <td className="px-4 py-3">
                        {report.photo_url ? (
                          <button
                            onClick={() => setPreviewReport(report)}
                            className="flex items-center gap-1 text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-wider"
                          >
                            <ImageIcon className="h-3 w-3" />
                            View
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-300">
                            None
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                            sBadge.color,
                          )}
                        >
                          {sBadge.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        {report.status === "pending" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              onClick={() =>
                                mutate({ id: report.id, status: "approved" })
                              }
                              disabled={isActioning}
                              className="h-7 px-3 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                mutate({ id: report.id, status: "rejected" })
                              }
                              disabled={isActioning}
                              className="h-7 px-3 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span
                            className={cn(
                              "text-[10px] font-black uppercase tracking-wider",
                              report.status === "approved"
                                ? "text-emerald-600"
                                : "text-red-500",
                            )}
                          >
                            {report.status === "approved"
                              ? "✓ Published"
                              : "✗ Rejected"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Evidence Preview Modal */}
      <Dialog
        open={!!previewReport}
        onOpenChange={() => setPreviewReport(null)}
      >
        <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="px-5 pt-5 pb-3">
            <DialogTitle className="text-sm font-black uppercase tracking-wider text-slate-700">
              Evidence Preview
            </DialogTitle>
          </DialogHeader>
          {previewReport?.photo_url && (
            <div className="px-5 pb-5">
              <img
                src={previewReport.photo_url}
                alt="Evidence"
                className="w-full rounded-xl max-h-80 object-contain border border-slate-100"
              />
              <p className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-wider">
                {previewReport.type?.replace("_", " ")} — Reported on{" "}
                {new Date(previewReport.created_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
