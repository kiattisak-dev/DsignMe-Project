"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Folder } from "lucide-react";

interface ProjectCategory {
  id: string;
  name: string;
  projectCount: number;
  description: string;
}

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

export function ProjectCategories({
  categories,
  projects,
}: {
  categories: Category[];
  projects: Project[];
}) {
  const projectCategories: ProjectCategory[] = categories.map((category) => ({
    id: category.ID,
    name: category.NameCategory,
    projectCount: projects.filter((p) => p.CategoryID === category.ID).length,
    description: `Projects under ${category.NameCategory} category`,
  }));

  return (
    <Card className="h-full w-full max-w-4xl mx-auto border border-border">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <CardTitle className="text-lg sm:text-xl md:text-2xl">
          Project Categories
        </CardTitle>
        <Link href="/dashboard/categories">
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-6">
        <div className="space-y-3 sm:space-y-4">
          {projectCategories.length > 0 ? (
            projectCategories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-3 sm:p-4 gap-3 sm:gap-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="rounded-full p-2 bg-blue-50 dark:bg-blue-900/20 flex-shrink-0">
                    <Folder className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <Link href={`/dashboard/servicesteps/${category.name}`}>
                      <p className="font-medium hover:underline text-sm sm:text-base truncate">
                        {category.name}
                      </p>
                    </Link>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                      {category.description}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 w-fit sm:min-w-[100px] text-center flex items-center justify-center"
                >
                  {category.projectCount} Project
                  {category.projectCount !== 1 ? "s" : ""}
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No categories available.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
