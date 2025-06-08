"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Category } from "@/lib/types";

interface ProjectData {
  name: string;
  [key: string]: number | string;
}

export function ProjectChart({
  data,
  categories,
}: {
  data: ProjectData[];
  categories: Category[];
}) {
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip />
        {categories.map((category, index) => (
          <Bar
            key={category.ID}
            dataKey={category.NameCategory}
            stackId="a"
            fill={COLORS[index % COLORS.length]}
            radius={
              index === categories.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]
            }
          />
        ))}
        <Bar
          dataKey="Uncategorized"
          stackId="a"
          fill={COLORS[categories.length % COLORS.length]}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}