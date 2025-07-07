// ProjectStatsCard.tsx (คงเดิม)
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectChart } from "./project-chart";
import { Category, Project } from "@/lib/types";

interface ProjectStatsCardProps {
  projects: Project[];
  categories: Category[];
}

export function ProjectStatsCard({ projects, categories }: ProjectStatsCardProps) {
  return (
    <Card className="col-span-1 border border-border">
      <CardHeader>
        <CardTitle>Project Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full pt-4">
          <ProjectChart projects={projects} categories={categories} />
        </div>
      </CardContent>
    </Card>
  );
}