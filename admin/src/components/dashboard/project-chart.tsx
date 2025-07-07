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
import { Category, Project } from "@/lib/types";

interface ProjectData {
  name: string;
  count: number;
}

interface ProjectChartProps {
  projects: Project[];
  categories: Category[];
}

export function ProjectChart({ projects, categories }: ProjectChartProps) {
  // Prepare data for chart (count projects per category)
  const projectData: ProjectData[] = [];

  // Ensure categories is an array
  const safeCategories = Array.isArray(categories) ? categories : [];
  safeCategories.forEach((category) => {
    const count = projects.filter((p) => p.CategoryID === category.ID).length;
    if (count > 0) {
      projectData.push({ name: category.NameCategory, count });
    }
  });

  const uncategorizedCount = projects.filter(
    (p) => !safeCategories.some((c) => c.ID === p.CategoryID)
  ).length;
  if (uncategorizedCount > 0) {
    projectData.push({ name: "Uncategorized", count: uncategorizedCount });
  }

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  // If no data, show a message
  if (projectData.length === 0) {
    return <div className="text-center py-10">No project data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={projectData}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip />
        {safeCategories.map((category, index) => (
          <Bar
            key={category.ID}
            dataKey="count"
            name={category.NameCategory}
            fill={COLORS[index % COLORS.length]}
            radius={index === safeCategories.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
          />
        ))}
        {uncategorizedCount > 0 && (
          <Bar
            dataKey="count"
            name="Uncategorized"
            fill={COLORS[safeCategories.length % COLORS.length]}
            radius={[4, 4, 0, 0]}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}