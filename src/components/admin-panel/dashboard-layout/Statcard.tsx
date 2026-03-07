"use client";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
  neutral?: boolean;
  icon?: LucideIcon;
  accent?: string; // Tailwind color e.g. "red" | "blue" | "green" | "orange"
}

const Statcard = ({
  title,
  value,
  change,
  positive = false,
  neutral = false,
  icon: Icon,
  accent = "blue",
}: StatCardProps) => {
  const accentMap: Record<
    string,
    { bg: string; text: string; ring: string; iconBg: string }
  > = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      ring: "ring-blue-100",
      iconBg: "bg-blue-100",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-600",
      ring: "ring-red-100",
      iconBg: "bg-red-100",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      ring: "ring-green-100",
      iconBg: "bg-green-100",
    },
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      ring: "ring-orange-100",
      iconBg: "bg-orange-100",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      ring: "ring-purple-100",
      iconBg: "bg-purple-100",
    },
  };

  const colors = accentMap[accent] ?? accentMap.blue;

  return (
    <div className="bg-white border-2 border-slate-100 rounded-[24px] p-6 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 group">
      {/* Top Row */}
      <div className="flex items-start justify-between mb-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {title}
        </p>
        {Icon && (
          <div
            className={cn(
              "h-9 w-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
              colors.iconBg,
            )}
          >
            <Icon className={cn("h-4 w-4", colors.text)} />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="text-3xl font-black text-slate-900 tracking-tight mb-3">
        {value}
      </div>

      {/* Change Badge */}
      <div
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit text-[10px] font-black uppercase tracking-wider",
          neutral
            ? "bg-slate-100 text-slate-500"
            : positive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700",
        )}
      >
        {neutral ? (
          <Minus className="h-2.5 w-2.5" />
        ) : positive ? (
          <TrendingUp className="h-2.5 w-2.5" />
        ) : (
          <TrendingDown className="h-2.5 w-2.5" />
        )}
        {change}
      </div>
    </div>
  );
};

export default Statcard;
