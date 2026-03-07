"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrendsChartProps {
  data: { date: string; count: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border-2 border-slate-100 rounded-2xl shadow-xl flex flex-col gap-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
          {label}
        </p>
        <p className="text-sm font-black text-slate-900 leading-none">
          {payload[0].value}{" "}
          <span className="text-[10px] text-slate-400 font-bold ml-1">
            INCIDENTS
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default function IncidentTrendsChart({ data }: TrendsChartProps) {
  return (
    <div className="bg-white border-2 border-slate-100 rounded-[28px] p-8 shadow-sm h-full group">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
            Incident Trends
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-1">
            Activity over the last 30 days
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-100 rounded-full text-[10px] font-black text-red-700 uppercase tracking-wider">
          Daily Activity
        </div>
      </div>

      <div className="h-[280px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
              dy={10}
              interval={4}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#ef4444"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCount)"
              animationBegin={0}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
