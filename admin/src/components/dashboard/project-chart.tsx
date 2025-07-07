"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
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

  // Count projects for each category
  safeCategories.forEach((category) => {
    const count = projects.filter((p) => p.CategoryID === category.ID).length;
    projectData.push({ name: category.NameCategory, count });
  });

  // Count uncategorized projects
  const uncategorizedCount = projects.filter(
    (p) => !safeCategories.some((c) => c.ID === p.CategoryID)
  ).length;
  if (uncategorizedCount > 0) {
    projectData.push({ name: "Uncategorized", count: uncategorizedCount });
  }

  // If no data, show a message
  if (projectData.length === 0) {
    return <div className="text-center py-10">No project data available</div>;
  }

  // Define colors for bars
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
        data={projectData}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip />
        <Bar
          dataKey="count"
          radius={[4, 4, 0, 0]}
          fill={COLORS[0]} // Default color for single bar
          // Dynamically assign fill color based on index
          fillOpacity={1}
        >
          {projectData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}