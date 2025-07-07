"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getProjects, getCategories } from "../../../services/api"; // ปรับ path
import { Category } from "@/lib/types";

interface ProjectData {
  name: string;
  [key: string]: number | string;
}

export function ProjectChart() {
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsData = await getProjects();
        const categoriesData = await getCategories();
        setProjects(projectsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Prepare data for chart (count projects per category)
  const projectData: ProjectData[] = [];
  categories.forEach((category) => {
    const count = projects.filter((p) => p.CategoryID === category.ID).length;
    if (count > 0) {
      projectData.push({ name: category.NameCategory, [category.NameCategory]: count });
    }
  });
  const uncategorizedCount = projects.filter((p) => !categories.some(c => c.ID === p.CategoryID)).length;
  if (uncategorizedCount > 0) {
    projectData.push({ name: "Uncategorized", Uncategorized: uncategorizedCount });
  }

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
        {categories.map((category, index) => (
          <Bar
            key={category.ID}
            dataKey={category.NameCategory}
            stackId="a"
            fill={COLORS[index % COLORS.length]}
            radius={index === categories.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
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