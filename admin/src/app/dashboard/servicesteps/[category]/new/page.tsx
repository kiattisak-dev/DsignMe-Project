"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import Link from "next/link";

interface Category {
  ID: string;
  NameCategory: string;
}

interface Subtitle {
  text: string;
  headings: string[];
}

export default function AddServiceStepPage() {
  const { category } = useParams<{ category: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [subtitles, setSubtitles] = useState<Subtitle[]>([
    { text: "", headings: [""] },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = Cookies.get("auth_token");
        if (!token) throw new Error("Please go back login");
        const res = await fetch("http://localhost:8081/projects/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Can not load categories");
        const data = await res.json();
        setCategories(data.data || []);
        const matchingCategory = data.data.find(
          (cat: Category) =>
            cat.NameCategory.toLowerCase() === category?.toLowerCase()
        );
        if (matchingCategory) setSelectedCategoryId(matchingCategory.ID);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Can not load categories",
          variant: "destructive",
        });
      }
    };
    fetchCategories();
  }, [category, toast]);

  const handleSubtitleChange = (index: number, value: string) => {
    setSubtitles(
      subtitles.map((s, i) => (i === index ? { ...s, text: value } : s))
    );
  };

  const handleHeadingChange = (
    subtitleIndex: number,
    headingIndex: number,
    value: string
  ) => {
    setSubtitles(
      subtitles.map((s, i) =>
        i === subtitleIndex
          ? {
              ...s,
              headings: s.headings.map((h, j) =>
                j === headingIndex ? value : h
              ),
            }
          : s
      )
    );
  };

  const addSubtitle = () => {
    setSubtitles([...subtitles, { text: "", headings: [""] }]);
  };

  const removeSubtitle = (index: number) => {
    setSubtitles(subtitles.filter((_, i) => i !== index));
  };

  const addHeading = (subtitleIndex: number) => {
    setSubtitles(
      subtitles.map((s, i) =>
        i === subtitleIndex ? { ...s, headings: [...s.headings, ""] } : s
      )
    );
  };

  const removeHeading = (subtitleIndex: number, headingIndex: number) => {
    setSubtitles(
      subtitles.map((s, i) =>
        i === subtitleIndex
          ? { ...s, headings: s.headings.filter((_, j) => j !== headingIndex) }
          : s
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        description: "At least one subtitle or detail is required",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const payload = {
      categories: selectedCategoryId,
      title,
      subtitles: subtitles.map((s) => ({
        text: s.text,
        headings: s.headings.filter((h) => h.trim()),
      })),
    };

    try {
      const token = Cookies.get("auth_token");
      if (!token) throw new Error("Please go back login");
      const res = await fetch(
        `http://localhost:8081/servicesteps/${category}/service-steps`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Add service step not success");
      }

      toast({ title: "Success", description: "Add service step success" });
      router.push(`/dashboard/servicesteps/${category}`);
    } catch (error: any) {
      toast({
        title: "Something error",
        description: error.message || "Add service step not success",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!category || category === "undefined") {
    return (
      <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-[#F9FAFB] dark:bg-[#1F2937]">
        <h1 className="text-3xl font-bold tracking-tight text-[#111827] dark:text-[#D1D5DB]">
          Category incorrect
        </h1>
        <p className="text-[#6B7280] dark:text-[#9CA3AF] mt-4">
          Please choose category correct
        </p>
        <Link href="/dashboard/projects">
          <Button className="mt-4">Go back Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-[#F9FAFB] dark:bg-[#1F2937]">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
        <h1 className="text-3xl font-bold tracking-tight text-[#111827] dark:text-[#D1D5DB]">
          Add Service Step - {category}
        </h1>
        <Link href={`/dashboard/servicesteps/${category}`}>
          <Button variant="outline">Go back Service Steps</Button>
        </Link>
      </div>

      <Card className="mt-6 border-[#D1D5DB] dark:border-[#4B5563]">
        <CardHeader>
          <CardTitle className="text-[#111827] dark:text-[#D1D5DB]">
            Service Step
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#111827] dark:text-[#D1D5DB]">
                Category
              </label>
              <Select
                value={selectedCategoryId}
                onValueChange={setSelectedCategoryId}
                disabled={isLoading}
              >
                <SelectTrigger className="mt-1 bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#374151] border-[#D1D5DB] dark:border-[#4B5563]">
                  {categories.map((cat) => (
                    <SelectItem key={cat.ID} value={cat.ID}>
                      {cat.NameCategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827] dark:text-[#D1D5DB]">
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                className="mt-1 bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563]"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827] dark:text-[#D1D5DB]">
                Details
              </label>
              {subtitles.map((subtitle, subtitleIndex) => (
                <div
                  key={subtitleIndex}
                  className="mt-2 p-4 border rounded-md bg-gray-50 dark:bg-[#2D3748]"
                >
                  <div className="flex flex-col gap-2">
                    <Input
                      value={subtitle.text}
                      onChange={(e) =>
                        handleSubtitleChange(subtitleIndex, e.target.value)
                      }
                      placeholder={`Subtitle ${subtitleIndex + 1}`}
                      className="bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563]"
                      disabled={isLoading}
                    />
                    {subtitles.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeSubtitle(subtitleIndex)}
                        disabled={isLoading}
                      >
                        Remove Subtitle
                      </Button>
                    )}
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-medium text-[#666666] dark:text-[#9CA3AF]">
                      Sub-details
                    </label>
                    {subtitle.headings.map((heading, headingIndex) => (
                      <div
                        key={headingIndex}
                        className="flex items-center gap-2 mt-1 ml-4"
                      >
                        <span className="text-sm text-[#111827] dark:text-[#D1D5DB] w-6">
                          {headingIndex + 1}.
                        </span>
                        <Input
                          value={heading}
                          onChange={(e) =>
                            handleHeadingChange(
                              subtitleIndex,
                              headingIndex,
                              e.target.value
                            )
                          }
                          placeholder={`Sub-detail ${headingIndex + 1}`}
                          className="bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563]"
                          disabled={isLoading}
                        />
                        {subtitle.headings.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              removeHeading(subtitleIndex, headingIndex)
                            }
                            disabled={isLoading}
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
                      className="mt-2 ml-4"
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
                className="mt-4"
                onClick={addSubtitle}
                disabled={isLoading}
              >
                Add Subtitle
              </Button>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Service Step"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
