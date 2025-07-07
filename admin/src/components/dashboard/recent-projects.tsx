"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Category, Project } from "@/lib/types";

interface RecentProjectsProps {
  projects: Project[];
  categories: Category[];
}

export function RecentProjects({ projects, categories }: RecentProjectsProps) {
  const recentProjects = projects
    .sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime())
    .slice(0, 5);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Projects</CardTitle>
        <Link href="/dashboard/projects">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recentProjects.length > 0 ? (
            recentProjects.map((project) => {
              const category = categories.find((c) => c.ID === project.CategoryID);
              return (
                <div key={project.ID} className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 rounded-md border">
                    <AvatarImage
                      src={project.ImageUrl || ""}
                      alt={project.ID}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-md">
                      {project.ID.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{project.ID}</p>
                        <p className="text-xs text-muted-foreground">
                          {category ? category.NameCategory : "Uncategorized"}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {project.ImageUrl || project.VideoUrl || "No description available"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No recent projects available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
