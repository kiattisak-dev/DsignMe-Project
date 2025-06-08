// File: src/components/dashboard/ProjectStatsCard.tsx
"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Category, Project } from "@/lib/types";
import { ProjectChart } from "./project-chart";

interface ProjectData {
  name: string;
  [key: string]: number | string;
}

export function ProjectStatsCard({
  projects,
  categories,
}: {
  projects: Project[];
  categories: Category[];
}) {
  const getProjectStats = (): ProjectData[] => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const stats: ProjectData[] = months.map((month) => {
      const initial: ProjectData = { name: month };
      categories.forEach((cat) => {
        initial[cat.NameCategory] = 0;
      });
      initial["Uncategorized"] = 0;
      return initial;
    });

    projects.forEach((project) => {
      const createdDate = new Date(project.CreatedAt);
      const monthIndex = createdDate.getMonth();
      if (monthIndex < 6) {
        const category = categories.find((c) => c.ID === project.CategoryID);
        const categoryName: string = category
          ? category.NameCategory
          : "Uncategorized";
        stats[monthIndex][categoryName] =
          (stats[monthIndex][categoryName] as number) + 1;
      }
    });
    return stats;
  };

  return (
    <Card className="col-span-1 border border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Project Statistics</CardTitle>
          <CardDescription>
            Project distribution by category over time
          </CardDescription>
        </div>
        <Link href="/dashboard/projects">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Details
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full pt-4">
          <ProjectChart data={getProjectStats()} categories={categories} />
        </div>
      </CardContent>
    </Card>
  );
}
