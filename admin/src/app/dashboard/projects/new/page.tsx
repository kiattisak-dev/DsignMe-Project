"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { motion, Variants } from "framer-motion";
import Cookies from "js-cookie";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import CategorySelect from "@/components/newProject/CategorySelect";
import UploadTypeRadio from "@/components/newProject/UploadTypeRadio";
import ImageUpload from "@/components/newProject/ImageUpload";
import VideoUpload from "@/components/newProject/VideoUpload";
import VideoUrlInput from "@/components/newProject/VideoUrlInput";

interface Category {
  ID: string;
  NameCategory: string;
}

// Define the form values interface based on formSchema
interface FormValues {
  uploadType: "image" | "video" | "videoUrl";
  imageFile?: File;
  videoFile?: File;
  videoUrl?: string;
  category: string;
}

const formSchema = z
  .object({
    uploadType: z.enum(["image", "video", "videoUrl"], {
      message: "Please select an upload type",
    }),
    imageFile: z
      .instanceof(File)
      .optional()
      .refine(
        (file) => !file || ["image/jpeg", "image/png"].includes(file.type),
        "Only JPEG or PNG images are allowed"
      )
      .refine(
        (file) => !file || file.size <= 10 * 1024 * 1024,
        "Image must be less than 10MB"
      ),
    videoFile: z
      .instanceof(File)
      .optional()
      .refine(
        (file) => !file || ["video/mp4", "video/webm"].includes(file.type),
        "Only MP4 or WebM videos are allowed"
      )
      .refine(
        (file) => !file || file.size <= 50 * 1024 * 1024,
        "Video must be less than 50MB"
      ),
    videoUrl: z.string().optional(),
    category: z.string().min(1, "Please select a category"),
  })
  .refine(
    (data) => {
      if (data.uploadType === "videoUrl") {
        return (
          data.videoUrl && z.string().url().safeParse(data.videoUrl).success
        );
      }
      return true;
    },
    {
      message: "Please enter a valid URL",
      path: ["videoUrl"],
    }
  );

export default function NewProjectPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uploadType: "image",
      imageFile: undefined,
      videoFile: undefined,
      videoUrl: "",
      category: "",
    },
    mode: "onSubmit",
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = Cookies.get("auth_token");
        if (!token) {
          throw new Error("Authentication token not found. Please log in.");
        }
        const response = await fetch(
          "http://localhost:8081/projects/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }
        const data = await response.json();
        setCategories(data.data || []);
        if (data.data && data.data.length > 0) {
          form.setValue("category", data.data[0].NameCategory);
        } else {
          toast({
            title: "Warning",
            description: "No categories found. Please create a category first.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load categories.",
          variant: "destructive",
        });
      }
    };
    fetchCategories();
  }, [toast, form]);

  const formErrors = form.formState.errors;
  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      console.log("Form validation errors:", formErrors);
      toast({
        title: "Validation Error",
        description: "Please check the form for errors.",
        variant: "destructive",
      });
    }
  }, [formErrors, toast]);

  const handleUploadTypeChange = (value: string) => {
    form.setValue("uploadType", value as "image" | "video" | "videoUrl", {
      shouldValidate: false,
    });
    form.setValue("imageFile", undefined, { shouldValidate: false });
    form.setValue("videoFile", undefined, { shouldValidate: false });
    form.setValue("videoUrl", "", { shouldValidate: false });
    setImagePreview(null);
  };

  async function onSubmit(values: FormValues) {
    setIsLoading(true);

    const customValidation = z
      .object({
        uploadType: z.enum(["image", "video", "videoUrl"]),
        imageFile: z.instanceof(File).optional(),
        videoFile: z.instanceof(File).optional(),
        videoUrl: z.string().optional(),
        category: z.string().min(1),
      })
      .refine(
        (data) => {
          if (data.uploadType === "image") return !!data.imageFile;
          if (data.uploadType === "video") return !!data.videoFile;
          if (data.uploadType === "videoUrl") return !!data.videoUrl;
          return true;
        },
        {
          message: "Please provide the selected upload type content",
          path: ["uploadType"],
        }
      )
      .safeParse(values);

    if (!customValidation.success) {
      console.log("Custom validation errors:", customValidation.error.errors);
      toast({
        title: "Validation Error",
        description: "Please provide the selected upload type content.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const token = Cookies.get("auth_token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const formData = new FormData();
      if (values.uploadType === "image" && values.imageFile) {
        console.log("Image file size:", values.imageFile.size / 1024 / 1024, "MB");
        formData.append("file", values.imageFile);
        formData.append("type", "image");
      } else if (values.uploadType === "video" && values.videoFile) {
        console.log("Video file size:", values.videoFile.size / 1024 / 1024, "MB");
        formData.append("file", values.videoFile);
        formData.append("type", "video");
      } else if (values.uploadType === "videoUrl" && values.videoUrl) {
        formData.append("videoUrl", values.videoUrl);
        formData.append("type", "videoUrl");
      }
      formData.append("category", values.category);
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const url = `http://localhost:8081/projects/${encodeURIComponent(
        values.category
      )}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        signal: AbortSignal.timeout(30000),
      });

      const responseBody = await response.text();

      if (!response.ok) {
        const errorData = responseBody ? JSON.parse(responseBody) : {};
        let errorMessage = errorData.error || `Failed to create project (status: ${response.status})`;
        if (errorMessage.includes("file too large")) {
          errorMessage = "File size exceeds server limit (10MB for images). Please use a smaller file.";
        }
        throw new Error(errorMessage);
      }
      toast({
        title: "Project created",
        description: "Your new project has been successfully created.",
      });
      router.push("/dashboard/projects");
    } catch (error: any) {
      console.error("Error in onSubmit:", error);
      let errorMessage = "Failed to create project. Please try again.";
      if (error.name === "TimeoutError") {
        errorMessage = "Request timed out. Try a smaller file or check your connection.";
      } else if (error.message.includes("token")) {
        errorMessage = "Authentication error. Please log in again.";
        router.push("/login");
      } else if (error.message.includes("Category not found")) {
        errorMessage = "Selected category does not exist. Please create it first.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = "Cannot connect to the server. Please ensure the server is running at http://localhost:8081.";
      } else if (error.message.includes("file too large")) {
        errorMessage = "File size exceeds server limit (10MB for images). Please use a smaller file.";
      } else if (error.message.includes("Failed to create project")) {
        errorMessage = `Server error: ${error.message}`;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Define variants with explicit type
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.6,
        ease: "easeOut" as const,
      },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeOut" as const },
    },
    tap: { scale: 0.95 },
  };

  return (
    <div className="space-y-8 p-6 sm:p-8 md:p-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Add New Project</h1>
          <p className="text-lg text-muted-foreground">
            Create a new project with an image, video, or video URL.
          </p>
        </div>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Link href="/dashboard/projects">
            <Button variant="outline" size="lg">
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Projects
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <Card className="shadow-lg">
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl">Project Information</CardTitle>
            <CardDescription className="text-base">
              Fill out the form below to add a new project to your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <CategorySelect
                  control={form.control}
                  categories={categories}
                />
                <UploadTypeRadio
                  control={form.control}
                  onChange={handleUploadTypeChange}
                />
                {form.watch("uploadType") === "image" && (
                  <ImageUpload
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                    isLoading={isLoading}
                  />
                )}
                {form.watch("uploadType") === "video" && (
                  <VideoUpload isLoading={isLoading} />
                )}
                {form.watch("uploadType") === "videoUrl" && (
                  <VideoUrlInput control={form.control} />
                )}
                <motion.div
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex justify-end gap-4"
                >
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link href="/dashboard/projects">
                      <Button variant="outline" size="lg" type="button">
                        Cancel
                      </Button>
                    </Link>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading || categories.length === 0}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                          Creating...
                        </>
                      ) : (
                        "Create Project"
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}