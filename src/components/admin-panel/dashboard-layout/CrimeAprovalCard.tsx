"use client";
import { useUpdateCrimeStatus } from "@/hooks/react-query/useUpdateCrimeStatus";
import { Check, X, MapPin, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const typeColors: Record<string, string> = {
  harassment: "bg-orange-100 text-orange-700 border-orange-200",
  theft: "bg-yellow-100 text-yellow-700 border-yellow-200",
  stalking: "bg-purple-100 text-purple-700 border-purple-200",
  assault: "bg-red-100 text-red-700 border-red-200",
  domestic_violence: "bg-rose-100 text-rose-700 border-rose-200",
  kidnapping: "bg-zinc-900 text-white border-zinc-700",
  other: "bg-slate-100 text-slate-600 border-slate-200",
};

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: {
    label: "Pending Review",
    color: "text-yellow-600 bg-yellow-50 border-yellow-200",
  },
  approved: {
    label: "Approved",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  rejected: {
    label: "Rejected",
    color: "text-red-600 bg-red-50 border-red-200",
  },
};

const CrimeAprovalCard = ({ report }: { report: any }) => {
  const { mutate, isPending } = useUpdateCrimeStatus();

  const typeColor =
    typeColors[report.type] ?? "bg-slate-100 text-slate-600 border-slate-200";
  const statusCfg = statusConfig[report.status] ?? statusConfig.pending;
  const isActioned = report.status !== "pending";

  return (
    <div className="bg-white border-2 border-slate-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span
            className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
              typeColor,
            )}
          >
            {report.type?.replace("_", " ")}
          </span>
          <span
            className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
              statusCfg.color,
            )}
          >
            {statusCfg.label}
          </span>
        </div>
        <AlertCircle className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
      </div>

      {/* Description */}
      <div className="px-5 pb-3">
        <p className="text-sm text-slate-600 font-medium leading-relaxed line-clamp-3">
          {report.description || (
            <span className="text-slate-300 italic">
              No description provided
            </span>
          )}
        </p>
      </div>

      {/* Evidence Image */}
      {report.photo_url && (
        <div className="px-5 pb-3">
          <img
            src={report.photo_url}
            alt="Evidence"
            className="w-full rounded-xl max-h-40 object-cover border border-slate-100"
          />
        </div>
      )}

      {/* Meta Info */}
      <div className="flex items-center gap-4 px-5 pb-4 text-[10px] font-bold text-slate-400">
        {report.lat && report.lng && (
          <a
            href={`https://maps.google.com/?q=${report.lat},${report.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:underline transition-all"
          >
            <MapPin className="h-3 w-3" />
            View Map
          </a>
        )}
        {report.created_at && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(report.created_at).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      {!isActioned && (
        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={() => {
              mutate({ id: report.id, status: "approved" });
              toast.success("Report approved");
            }}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 h-10 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-colors"
          >
            <Check className="h-3.5 w-3.5" />
            Approve
          </button>
          <button
            onClick={() => {
              mutate({ id: report.id, status: "rejected" });
              toast.error("Report rejected");
            }}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 h-10 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Reject
          </button>
        </div>
      )}

      {isActioned && (
        <div className="px-5 pb-5">
          <div
            className={cn(
              "text-center py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
              statusCfg.color,
            )}
          >
            {report.status === "approved"
              ? "✓ Verified & Published"
              : "✗ Decision: Rejected"}
          </div>
        </div>
      )}
    </div>
  );
};

export default CrimeAprovalCard;
