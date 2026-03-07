"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface DistributionChartProps {
  data: { name: string; value: number }[];
}

const COLORS = [
  "#ef4444",
  "#f97316",
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#6366f1",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border-2 border-slate-100 rounded-2xl shadow-xl flex flex-col gap-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
          {payload[0].name}
        </p>
        <p className="text-sm font-black text-slate-900 leading-none">
          {payload[0].value}{" "}
          <span className="text-[10px] text-slate-400 font-bold ml-1">
            REPORTS
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 px-4 overflow-hidden">
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function IncidentDistributionChart({
  data,
}: DistributionChartProps) {
  return (
    <div className="bg-white border-2 border-slate-100 rounded-[28px] p-8 shadow-sm h-full flex flex-col group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
            Incident Types
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-1">
            Category distribution
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-[240px] w-full mt-4 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              animationBegin={200}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
