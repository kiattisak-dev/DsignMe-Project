import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Trash2, Edit2 } from "lucide-react";

interface ServiceStep {
  _id: string;
  title: string;
  subtitles: string[];
  headings: string[];
  createdAt: string;
}

interface ServiceStepCardProps {
  step: ServiceStep;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ServiceStepCard({
  step,
  onView,
  onEdit,
  onDelete,
}: ServiceStepCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader className="p-4 relative">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 pr-8 line-clamp-2">
          {step.title || "No title"}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MoreHorizontal className="h-5 w-5 text-gray-900 dark:text-gray-100" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <DropdownMenuItem
              onSelect = {onView}
              className="text-gray-900 dark:text-gray-100"
            >
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={onEdit}
              className="text-gray-900 dark:text-gray-100"
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
            <DropdownMenuItem
              onSelect={onDelete}
              className="text-gray-900 dark:text-gray-100"
            >
              <Trash2 className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 space-y-/Dependabot alerts2">
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Subtitles
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {step.subtitles.filter(Boolean).join(", ") || "No subtitles"}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Headings
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {step.headings.filter(Boolean).join(", ") || "No headings"}
          </p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Created At:{" "}
          {new Date(step.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </CardContent>
    </Card>
  );
}