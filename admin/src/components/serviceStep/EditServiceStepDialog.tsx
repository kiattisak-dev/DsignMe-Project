"use client";

import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

interface Subtitle {
  text: string;
  headings: string[];
}

interface ServiceStep {
  _id: string;
  title: string;
  subtitles: Subtitle[];
  createdAt: string;
}

interface Category {
  ID: string;
  NameCategory: string;
}

interface EditServiceStepDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step: ServiceStep | null;
  categoryName: string;
  onUpdate: (updatedStep: ServiceStep) => void;
}

export default function EditServiceStepDialog({
  open,
  onOpenChange,
  step,
  categoryName,
  onUpdate,
}: EditServiceStepDialogProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [subtitles, setSubtitles] = useState<Subtitle[]>([{ text: "", headings: [""] }]);
  const [categoryId, setCategoryId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with step data
  useEffect(() => {
    if (step) {
      setTitle(step.title);
      setSubtitles(
        step.subtitles.length > 0
          ? step.subtitles
          : [{ text: "", headings: [""] }]
      );
    }
  }, [step]);

  // Fetch category ID
  useEffect(() => {
    const fetchCategoryId = async () => {
      try {
        const token = Cookies.get("auth_token");
        if (!token) throw new Error("Please sign in");
        const res = await fetch("http://localhost:8081/projects/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json();
        const matchingCategory = data.data.find(
          (cat: Category) => cat.NameCategory.toLowerCase() === categoryName.toLowerCase()
        );
        if (matchingCategory) {
          setCategoryId(matchingCategory.ID);
        } else {
          throw new Error("Category not found");
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load category",
          variant: "destructive",
        });
      }
    };
    if (open && categoryName) {
      fetchCategoryId();
    }
  }, [open, categoryName, toast]);

  // Handle subtitle text change
  const handleSubtitleChange = (index: number, value: string) => {
    setSubtitles(subtitles.map((s, i) => (i === index ? { ...s, text: value } : s)));
  };

  // Handle heading change
  const handleHeadingChange = (subtitleIndex: number, headingIndex: number, value: string) => {
    setSubtitles(
      subtitles.map((s, i) =>
        i === subtitleIndex
          ? { ...s, headings: s.headings.map((h, j) => (j === headingIndex ? value : h)) }
          : s
      )
    );
  };

  // Add new subtitle
  const addSubtitle = () => {
    setSubtitles([...subtitles, { text: "", headings: [""] }]);
  };

  // Remove subtitle
  const removeSubtitle = (index: number) => {
    setSubtitles(subtitles.filter((_, i) => i !== index));
  };

  // Add new heading to subtitle
  const addHeading = (subtitleIndex: number) => {
    setSubtitles(
      subtitles.map((s, i) =>
        i === subtitleIndex ? { ...s, headings: [...s.headings, ""] } : s
      )
    );
  };

  // Remove heading from subtitle
  const removeHeading = (subtitleIndex: number, headingIndex: number) => {
    setSubtitles(
      subtitles.map((s, i) =>
        i === subtitleIndex
          ? { ...s, headings: s.headings.filter((_, j) => j !== headingIndex) }
          : s
      )
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!step) return;
    setIsLoading(true);

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    let hasContent = false;
    for (const subtitle of subtitles) {
      if (subtitle.text.trim() || subtitle.headings.some((h) => h.trim())) {
        hasContent = true;
        break;
      }
    }
    if (!hasContent) {
      toast({
        title: "Error",
        description: "At least one subtitle or heading is required",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const payload = {
      categories: categoryId,
      title: title.trim(),
      subtitles: subtitles.map((s) => ({
        text: s.text.trim(),
        headings: s.headings.filter((h) => h.trim()),
      })),
    };

    try {
      const token = Cookies.get("auth_token");
      if (!token) throw new Error("Please sign in");
      const res = await fetch(
        `http://localhost:8081/servicesteps/${categoryName}/service-steps/${step._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update service step");
      }

      const data = await res.json();
      onUpdate(data.data);
      toast({ title: "Success", description: "Service step updated successfully" });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update service step",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 w-[95vw] max-w-lg sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-900 dark:text-gray-100 text-lg sm:text-xl">
            Edit Service Step
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500 dark:text-gray-400 text-sm">
            Modify the details of the service step.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 w-full max-w-md"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Details
            </label>
            {subtitles.map((subtitle, subtitleIndex) => (
              <div
                key={subtitleIndex}
                className="mt-2 p-4 border rounded-md bg-gray-50 dark:bg-gray-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <Input
                    value={subtitle.text}
                    onChange={(e) => handleSubtitleChange(subtitleIndex, e.target.value)}
                    placeholder={`Subtitle ${subtitleIndex + 1}`}
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 w-full max-w-md"
                    disabled={isLoading}
                  />
                  {subtitles.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSubtitle(subtitleIndex)}
                      disabled={isLoading}
                      className="w-full sm:w-auto mt-2 sm:mt-0"
                    >
                      Remove Subtitle
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Sub-details
                  </label>
                  {subtitle.headings.map((heading, headingIndex) => (
                    <div
                      key={headingIndex}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-2 ml-4"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span className="w-6 text-sm text-gray-900 dark:text-gray-100">
                          {headingIndex + 1}.
                        </span>
                        <Input
                          value={heading}
                          onChange={(e) =>
                            handleHeadingChange(subtitleIndex, headingIndex, e.target.value)
                          }
                          placeholder={`Sub-detail ${headingIndex + 1}`}
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 flex-1 max-w-md"
                          disabled={isLoading}
                        />
                      </div>
                      {subtitle.headings.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeHeading(subtitleIndex, headingIndex)}
                          disabled={isLoading}
                          className="w-full sm:w-auto mt-2 sm:mt-0"
                        >
                          Remove Sub-detail
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 ml-4 w-full sm:w-auto"
                    onClick={() => addHeading(subtitleIndex)}
                    disabled={isLoading}
                  >
                    Add Sub-detail
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full sm:w-auto"
              onClick={addSubtitle}
              disabled={isLoading}
            >
              Add Subtitle
            </Button>
          </div>
          <AlertDialogFooter className="flex flex-col sm:flex-row sm:gap-2">
            <AlertDialogCancel
              onClick={() => onOpenChange(false)}
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 w-full sm:w-auto"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto "
            >
              {isLoading ? "Updating..." : "Update Service Step"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}