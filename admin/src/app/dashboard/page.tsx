"use client";

import React, { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentProjects } from "@/components/dashboard/recent-projects";
import { ProjectCategories } from "@/components/dashboard/project-categories";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import { CategoryStatsCard } from "@/components/dashboard/categorystats-card";
import { ProjectStatsCard } from "@/components/dashboard/projectstats-card";
import { Category, Project } from "@/lib/types";

export default function DashboardPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = Cookies.get("auth_token");
        if (!token) throw new Error("Please sign in");

        const [projectResponse, categoryResponse] = await Promise.all([
          fetch("http://localhost:8081/projects", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8081/projects/categories", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!projectResponse.ok) throw new Error(`Failed to fetch projects: ${projectResponse.status}`);
        if (!categoryResponse.ok) throw new Error(`Failed to fetch categories: ${categoryResponse.status}`);

        const [projectData, categoryData] = await Promise.all([
          projectResponse.json(),
          categoryResponse.json(),
        ]);

        setProjects(projectData.data || []);
        setCategories(categoryData.data || []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="space-y-8 bg-background text-foreground p-4 md:p-6 lg:p-8">
      <DashboardHeader />
      <DashboardStats projects={projects} categories={categories} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectStatsCard projects={projects} categories={categories} />
        <CategoryStatsCard projects={projects} categories={categories} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentProjects projects={projects} categories={categories} />
        </div>
        <div className="lg:col-span-1">
          <ProjectCategories categories={categories} projects={projects} />
        </div>
      </div>
    </div>
  );
}