"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { CategoryChart } from "./category-chart";
import { Category, Project } from "@/lib/types";
interface CategoryData {
  name: string;
  value: number;
}

export function CategoryStatsCard({
  projects,
  categories,
}: {
  projects: Project[];
  categories: Category[];
}) {
  const getCategoryStats = (): CategoryData[] => {
    const categoryCounts: { [key: string]: number } = {};
    projects.forEach((project) => {
      const category = categories.find((c) => c.ID === project.CategoryID);
      const name = category ? category.NameCategory : "Uncategorized";
      categoryCounts[name] = (categoryCounts[name] || 0) + 1;
    });
    return Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value,
    }));
  };

  return (
    <Card className="col-span-1 border border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Project Categories</CardTitle>
          <CardDescription>Projects by category</CardDescription>
        </div>
        <Link href="/dashboard/servicesteps">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Details
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full pt-4">
          <CategoryChart data={getCategoryStats()} />
        </div>
      </CardContent>
    </Card>
  );
}