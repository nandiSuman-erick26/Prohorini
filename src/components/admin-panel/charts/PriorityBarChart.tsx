"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface PriorityChartProps {
  data: { name: string; count: number }[];
}

const COLORS = ["#ef4444", "#fbbf24", "#10b981"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border-2 border-slate-100 rounded-2xl shadow-xl flex flex-col gap-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
          {label}
        </p>
        <p className="text-sm font-black text-slate-900 leading-none">
          {payload[0].value}{" "}
          <span className="text-[10px] text-slate-400 font-bold ml-1">
            EVENTS
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default function PriorityBarChart({ data }: PriorityChartProps) {
  return (
    <div className="bg-white border-2 border-slate-100 rounded-[28px] p-8 shadow-sm h-full group">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
            Security Log Summary
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-1">
            Last 7 days activity
          </p>
        </div>
      </div>

      <div className="h-[240px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barSize={16}>
            <CartesianGrid
              horizontal={false}
              strokeDasharray="3 3"
              stroke="#f1f5f9"
            />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              radius={[0, 8, 8, 0]}
              animationBegin={400}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
