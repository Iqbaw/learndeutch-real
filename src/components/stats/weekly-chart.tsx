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

interface WeeklyChartProps {
  data: { week: string; accuracy: number; minutes: number }[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
          <XAxis dataKey="week" tick={{ fill: "rgb(var(--muted))", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgb(var(--muted))", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "rgb(var(--elevated))" }}
            contentStyle={{
              background: "rgb(var(--card))",
              border: "1px solid rgb(var(--border))",
              borderRadius: 12,
              color: "rgb(var(--ink))",
              fontSize: 12,
            }}
            formatter={(value: number, name: string) =>
              name === "accuracy" ? [`${value}%`, "Akurasi"] : [`${value} mnt`, "Durasi"]
            }
          />
          <Bar dataKey="accuracy" radius={[6, 6, 0, 0]} maxBarSize={42}>
            {data.map((_, i) => (
              <Cell key={i} fill="rgb(var(--primary))" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
