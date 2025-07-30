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

export default function AddServiceStepPage() {
  const { category } = useParams<{ category: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [subtitles, setSubtitles] = useState<string[]>([""]);
  const [headings, setHeadings] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = Cookies.get("auth_token");
        if (!token) throw new Error("กรุณาเข้าสู่ระบบ");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("ไม่สามารถโหลดหมวดหมู่ได้");
        const data = await res.json();
        setCategories(data.data || []);
        const matchingCategory = data.data.find(
          (cat: Category) =>
            cat.NameCategory.toLowerCase() === category?.toLowerCase()
        );
        if (matchingCategory) setSelectedCategoryId(matchingCategory.ID);
      } catch (error: any) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: error.message || "ไม่สามารถโหลดหมวดหมู่ได้",
          variant: "destructive",
        });
      }
    };
    fetchCategories();
  }, [category, toast]);

  const handleSubtitleChange = (index: number, value: string) => {
    setSubtitles(subtitles.map((s, i) => (i === index ? value : s)));
  };

  const handleHeadingChange = (index: number, value: string) => {
    setHeadings(headings.map((h, i) => (i === index ? value : h)));
  };

  const addSubtitle = () => {
    setSubtitles([...subtitles, ""]);
  };

  const removeSubtitle = (index: number) => {
    setSubtitles(subtitles.filter((_, i) => i !== index));
  };

  const addHeading = () => {
    setHeadings([...headings, ""]);
  };

  const removeHeading = (index: number) => {
    setHeadings(headings.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!title.trim()) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ต้องระบุชื่อ",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const filteredSubtitles = subtitles.filter((s) => s.trim());
    const filteredHeadings = headings.filter((h) => h.trim());

    if (filteredSubtitles.length === 0 && filteredHeadings.length === 0) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ต้องมีอย่างน้อยหนึ่งรายการย่อยหรือหัวข้อ",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const payload = {
      categories: selectedCategoryId,
      title: title.trim(),
      subtitles: filteredSubtitles,
      headings: filteredHeadings,
    };

    try {
      const token = Cookies.get("auth_token");
      if (!token) throw new Error("กรุณาเข้าสู่ระบบ");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/servicesteps/${encodeURIComponent(
          category
        )}/service-steps`,
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
        throw new Error(errorData.error || "ไม่สามารถเพิ่มรายการได้");
      }

      toast({ title: "สำเร็จ", description: "เพิ่มรายการสำเร็จ" });
      router.push(`/dashboard/servicesteps/${category}`);
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถเพิ่มรายการได้",
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
          หมวดหมู่ไม่ถูกต้อง
        </h1>
        <p className="text-[#6B7280] dark:text-[#9CA3AF] mt-4">
          กรุณาเลือกหมวดหมู่ที่ถูกต้อง
        </p>
        <Link href="/dashboard/projects">
          <Button className="mt-4">กลับไปยังโปรเจกต์</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-[#F9FAFB] dark:bg-[#1F2937]">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
        <h1 className="text-3xl font-bold tracking-tight text-[#111827] dark:text-[#D1D5DB]">
          เพิ่มรายการ - {category}
        </h1>
        <Link href={`/dashboard/servicesteps/${category}`}>
          <Button variant="outline">กลับไปยังรายการ</Button>
        </Link>
      </div>

      <Card className="mt-6 border-[#D1D5DB] dark:border-[#4B5563]">
        <CardHeader>
          <CardTitle className="text-[#111827] dark:text-[#D1D5DB]">
            รายการ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#111827] dark:text-[#D1D5DB]">
                หมวดหมู่
              </label>
              <Select
                value={selectedCategoryId}
                onValueChange={setSelectedCategoryId}
                disabled={isLoading}
              >
                <SelectTrigger className="mt-1 bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563]">
                  <SelectValue placeholder="เลือกหมวดหมู่" />
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
                ชื่อ
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="กรอกชื่อ"
                className="mt-1 bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563]"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827] dark:text-[#D1D5DB]">
                รายการย่อย
              </label>
              {subtitles.map((subtitle, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <Input
                    value={subtitle}
                    onChange={(e) => handleSubtitleChange(index, e.target.value)}
                    placeholder={`รายการย่อย ${index + 1}`}
                    className="bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563]"
                    disabled={isLoading}
                  />
                  {subtitles.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSubtitle(index)}
                      disabled={isLoading}
                    >
                      ลบรายการย่อย
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="mt-4 w-full sm:w-auto"
                onClick={addSubtitle}
                disabled={isLoading}
              >
                เพิ่มรายการย่อย
              </Button>
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827] dark:text-[#D1D5DB]">
                หัวข้อ
              </label>
              {headings.map((heading, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <Input
                    value={heading}
                    onChange={(e) => handleHeadingChange(index, e.target.value)}
                    placeholder={`หัวข้อ ${index + 1}`}
                    className="bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563]"
                    disabled={isLoading}
                  />
                  {headings.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeHeading(index)}
                      disabled={isLoading}
                    >
                      ลบหัวข้อ
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="mt-4 w-full sm:w-auto"
                onClick={addHeading}
                disabled={isLoading}
              >
                เพิ่มหัวข้อ
              </Button>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "กำลังเพิ่ม..." : "เพิ่มรายการ"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}