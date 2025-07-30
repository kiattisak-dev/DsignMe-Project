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

interface Category {
  ID: string;
  NameCategory: string;
}

interface ServiceStep {
  _id: string;
  title: string;
  subtitles: string[];
  headings: string[];
  createdAt: string;
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
  const [subtitles, setSubtitles] = useState<string[]>([""]);
  const [headings, setHeadings] = useState<string[]>([""]);
  const [categoryId, setCategoryId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (step) {
      setTitle(step.title);
      setSubtitles(step.subtitles.length > 0 ? step.subtitles : [""]);
      setHeadings(step.headings.length > 0 ? step.headings : [""]);
    }
  }, [step]);

  useEffect(() => {
    const fetchCategoryId = async () => {
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
        const matchingCategory = data.data.find(
          (cat: Category) => cat.NameCategory.toLowerCase() === categoryName.toLowerCase()
        );
        if (matchingCategory) {
          setCategoryId(matchingCategory.ID);
        } else {
          throw new Error("ไม่พบหมวดหมู่");
        }
      } catch (error: any) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: error.message || "ไม่สามารถโหลดหมวดหมู่ได้",
          variant: "destructive",
        });
      }
    };
    if (open && categoryName) {
      fetchCategoryId();
    }
  }, [open, categoryName, toast]);

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
    if (!step) return;
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

    const hasContent = subtitles.some((s) => s.trim()) || headings.some((h) => h.trim());
    if (!hasContent) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ต้องมีอย่างน้อยหนึ่งรายการย่อยหรือหัวข้อ",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const payload = {
      categories: categoryId,
      title: title.trim(),
      subtitles: subtitles.filter((s) => s.trim()),
      headings: headings.filter((h) => h.trim()),
    };

    try {
      const token = Cookies.get("auth_token");
      if (!token) throw new Error("กรุณาเข้าสู่ระบบ");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/servicesteps/${encodeURIComponent(categoryName)}/service-steps/${step._id}`,
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
        throw new Error(errorData.error || "ไม่สามารถอัปเดตรายการได้");
      }

      const data = await res.json();
      onUpdate(data.data);
      toast({ title: "สำเร็จ", description: "อัปเดตรายการสำเร็จ" });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถอัปเดตรายการได้",
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
            แก้ไขรายการ
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500 dark:text-gray-400 text-sm">
            ปรับเปลี่ยนรายละเอียดของรายการ
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              ชื่อ
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="กรอกชื่อ"
              className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 w-full max-w-md"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              รายการย่อย
            </label>
            {subtitles.map((subtitle, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <Input
                  value={subtitle}
                  onChange={(e) => handleSubtitleChange(index, e.target.value)}
                  placeholder={`รายการย่อย ${index + 1}`}
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 w-full max-w-md"
                  disabled={isLoading}
                />
                {subtitles.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSubtitle(index)}
                    disabled={isLoading}
                    className="w-full sm:w-auto mt-2 sm:mt-0"
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
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              หัวข้อ
            </label>
            {headings.map((heading, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <Input
                  value={heading}
                  onChange={(e) => handleHeadingChange(index, e.target.value)}
                  placeholder={`หัวข้อ ${index + 1}`}
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 w-full max-w-md"
                  disabled={isLoading}
                />
                {headings.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeHeading(index)}
                    disabled={isLoading}
                    className="w-full sm:w-auto mt-2 sm:mt-0"
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
          <AlertDialogFooter className="flex flex-col sm:flex-row sm:gap-2">
            <AlertDialogCancel
              onClick={() => onOpenChange(false)}
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 w-full sm:w-auto"
            >
              ยกเลิก
            </AlertDialogCancel>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "กำลังอัปเดต..." : "อัปเดตรายการ"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}