"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import type { SkillScore } from "@/types";

interface SkillRadarProps {
  data: SkillScore[];
  height?: number;
}

export function SkillRadar({ data, height = 280 }: SkillRadarProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="rgb(var(--border))" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "rgb(var(--muted))", fontSize: 11 }}
          />
          <Radar
            name="Skill"
            dataKey="value"
            stroke="rgb(var(--primary))"
            fill="rgb(var(--primary))"
            fillOpacity={0.35}
            isAnimationActive
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
