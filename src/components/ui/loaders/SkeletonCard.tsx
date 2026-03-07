"use client";

import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  lines?: number;
  className?: string;
  variant?: "default" | "compact" | "wide";
}

const SkeletonCard = ({
  lines = 3,
  className,
  variant = "default",
}: SkeletonCardProps) => {
  const variantStyles = {
    default: "p-5 rounded-[24px]",
    compact: "p-4 rounded-2xl",
    wide: "p-6 rounded-[28px]",
  };

  return (
    <div
      className={cn(
        "bg-white border-2 border-slate-100 animate-pulse overflow-hidden relative",
        variantStyles[variant],
        className,
      )}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-100/60 to-transparent z-10" />

      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div className="h-3 w-28 bg-slate-200 rounded-full" />
        <div className="h-8 w-8 bg-slate-100 rounded-xl" />
      </div>

      {/* Big value */}
      <div className="h-7 w-20 bg-slate-200 rounded-lg mb-4" />

      {/* Content lines */}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-2.5 rounded-full bg-slate-100"
            style={{ width: `${85 - i * 15}%` }}
          />
        ))}
      </div>

      {/* Inline shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
};

// ─── Skeleton Grid (Multiple cards) ───
interface SkeletonGridProps {
  count?: number;
  columns?: number;
  variant?: "default" | "compact" | "wide";
}

export const SkeletonGrid = ({
  count = 4,
  columns = 4,
  variant = "default",
}: SkeletonGridProps) => {
  const colClass =
    columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : columns === 3
        ? "grid-cols-1 md:grid-cols-3"
        : "grid-cols-1 md:grid-cols-2 xl:grid-cols-4";

  return (
    <div className={cn("grid gap-5", colClass)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} variant={variant} lines={2 + (i % 2)} />
      ))}
    </div>
  );
};

// ─── Skeleton List Item (For sidebar/list views) ───
export const SkeletonListItem = () => (
  <div className="flex items-center gap-4 p-4 bg-white border-2 border-slate-100 rounded-2xl animate-pulse relative overflow-hidden">
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-100/60 to-transparent z-10" />
    <div className="h-10 w-10 bg-slate-100 rounded-xl shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-32 bg-slate-200 rounded-full" />
      <div className="h-2 w-20 bg-slate-100 rounded-full" />
    </div>
    <div className="h-6 w-16 bg-slate-100 rounded-full" />
    <style jsx>{`
      @keyframes shimmer {
        100% {
          transform: translateX(200%);
        }
      }
    `}</style>
  </div>
);

// ─── Skeleton Map Overlay ───
export const SkeletonMapOverlay = () => (
  <div className="h-full w-full bg-slate-100 rounded-xl animate-pulse flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />
    <div className="flex flex-col items-center gap-3 z-0">
      <div className="h-12 w-12 bg-slate-200 rounded-2xl" />
      <div className="h-3 w-32 bg-slate-200 rounded-full" />
    </div>
    <style jsx>{`
      @keyframes shimmer {
        100% {
          transform: translateX(200%);
        }
      }
    `}</style>
  </div>
);

export default SkeletonCard;
