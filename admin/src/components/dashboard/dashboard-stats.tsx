import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FolderKanban, Layers, PieChart, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Project {
  ID: string;
  ImageUrl: string;
  VideoUrl: string;
  CategoryID: string;
  CreatedAt: string;
  UpdatedAt: string;
}

interface Category {
  ID: string;
  NameCategory: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}

export function DashboardStats({
  projects,
  categories,
}: {
  projects: Project[];
  categories: Category[];
}) {
  const totalProjects = projects.length;
  const projectCategories = categories.length;

  // Calculate top category
  const categoryCounts: { [key: string]: { name: string; count: number } } = {};
  projects.forEach((p) => {
    const category = categories.find((c) => c.ID === p.CategoryID);
    const name = category ? category.NameCategory : "Uncategorized";
    categoryCounts[name] = {
      name,
      count: (categoryCounts[name]?.count || 0) + 1,
    };
  });
  const topCategory = Object.values(categoryCounts).reduce(
    (max, curr) => (curr.count > max.count ? curr : max),
    { name: "None", count: 0 }
  );

  // Calculate recent projects (last 30 days)
  const now = new Date();
  const recentProjects = projects.filter((p) => {
    const createdDate = new Date(p.CreatedAt);
    return (
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24) <= 30
    );
  }).length;

  // Calculate new projects and categories in the last 30 days
  const newProjectsLast30Days = projects.filter((p) => {
    const createdDate = new Date(p.CreatedAt);
    return (
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24) <= 30
    );
  }).length;
  const newCategoriesLast30Days = categories.filter((c) => {
    const createdDate = c.CreatedAt ? new Date(c.CreatedAt) : null;
    return (
      createdDate &&
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24) <= 30
    );
  }).length;

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects.toString(),
      change: `+${newProjectsLast30Days}`,
      changeTooltip: "Projects added in the last 30 days",
      changeType: "increase",
      icon: FolderKanban,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Top Category",
      value: topCategory.name,
      change: `${topCategory.count} projects`,
      changeTooltip: "Total projects in this category",
      changeType: "increase",
      icon: PieChart,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Recent Projects",
      value: recentProjects.toString(),
      change: `+${newProjectsLast30Days}`,
      changeTooltip: "Projects created in the last 30 days",
      changeType: "increase",
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Project Categories",
      value: projectCategories.toString(),
      change: `+${newCategoriesLast30Days}`,
      changeTooltip: "Categories added in the last 30 days",
      changeType: "increase",
      icon: Layers,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
  ];

  return (
    <TooltipProvider>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h4 className="text-2xl sm:text-3xl font-bold truncate">
                      {stat.value}
                    </h4>
                    <Tooltip>
                      <TooltipTrigger>
                        <span
                          className={`text-xs font-medium ${
                            stat.changeType === "increase"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {stat.change}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{stat.changeTooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <div
                  className={`rounded-full p-1.5 sm:p-2 ${stat.bgColor} flex-shrink-0`}
                >
                  <stat.icon
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
}
