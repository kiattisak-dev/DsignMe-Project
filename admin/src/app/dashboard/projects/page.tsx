"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, MoreHorizontal, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";

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
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 12;
  const { toast } = useToast();
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = Cookies.get("auth_token");
        const response = await fetch(
          "http://localhost:8081/projects/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.data || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load categories.",
          variant: "destructive",
        });
      }
    };
    fetchCategories();
  }, [toast]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const token = Cookies.get("auth_token");
        const url =
          categoryFilter === "All"
            ? "http://localhost:8081/projects"
            : `http://localhost:8081/projects/${categoryFilter.toLowerCase()}`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        setProjects(data.data || []);
        setCurrentPage(1); // Reset to first page on new data fetch
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load projects.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [categoryFilter, toast]);

  // Fetch category name for view modal
  useEffect(() => {
    const fetchCategoryName = async () => {
      if (selectedProject && isViewOpen) {
        try {
          const token = Cookies.get("auth_token");
          const response = await fetch(
            `http://localhost:8081/projects/categories`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) throw new Error("Failed to fetch categories");
          const categories = await response.json();
          const category = categories.data.find(
            (c: Category) => c.ID === selectedProject.CategoryID
          );
          setCategoryName(category ? category.NameCategory : "Unknown");
        } catch (error) {
          setCategoryName("Unknown");
          toast({
            title: "Error",
            description: "Failed to load category name.",
            variant: "destructive",
          });
        }
      }
    };
    fetchCategoryName();
  }, [selectedProject, isViewOpen, toast]);

  // Filter projects based on search query
  const filteredProjects = projects.filter(
    (project) =>
      (project.ImageUrl || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (project.VideoUrl || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle project deletion
  const handleDeleteProject = async () => {
    if (projectToDelete !== null) {
      try {
        const project = projects.find((p) => p.ID === projectToDelete);
        if (!project) return;

        const categoryResponse = await fetch(
          `http://localhost:8081/projects/categories`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("auth_token")}`,
            },
          }
        );
        const categories = await categoryResponse.json();
        const category = categories.data.find(
          (c: any) => c.ID === project.CategoryID
        );
        if (!category) throw new Error("Category not found");

        const response = await fetch(
          `http://localhost:8081/projects/${category.NameCategory.toLowerCase()}/${projectToDelete}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${Cookies.get("auth_token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete project");
        }

        setProjects(
          projects.filter((project) => project.ID !== projectToDelete)
        );
        // Adjust current page if necessary
        if (currentProjects.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        toast({
          title: "Project deleted",
          description: "The project has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete project.",
          variant: "destructive",
        });
      } finally {
        setProjectToDelete(null);
      }
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get YouTube embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
    const match = url.match(regExp);
    return match ? `https://www.youtube.com/embed/${match[1]}` : undefined;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
    }),
  };

  const viewCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };

  return (
    <div className="min-h-screen space-y-6 p-4 sm:p-6 md:p-8 bg-[#F9FAFB] dark:bg-[#1F2937] transition-colors duration-200">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111827] dark:text-[#D1D5DB]">
            Projects
          </h1>
        </div>
        <div className="flex space-x-4">
          <Link href="/dashboard/projects/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </Link>
          <Link href="/dashboard/categories">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </Link>
        </div>
      </div>

      <Card className="border-[#D1D5DB] dark:border-[#4B5563]">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-9 bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px] bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#374151] border-[#D1D5DB] dark:border-[#4B5563]">
                  <SelectItem value="All">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.ID} value={category.NameCategory}>
                      {category.NameCategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full text-center py-10 text-[#111827] dark:text-[#D1D5DB]"
            >
              Loading...
            </motion.div>
          ) : currentProjects.length > 0 ? (
            currentProjects.map((project, index) => (
              <motion.div
                key={project.ID}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Card className="border-[#D1D5DB] dark:border-[#4B5563] hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="p-4 relative">
                    <CardTitle className="text-lg text-[#111827] dark:text-[#D1D5DB] pr-8">
                      {project.ImageUrl
                        ? "Image"
                        : project.VideoUrl
                        ? "Video"
                        : "No Media"}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full"
                        >
                          <MoreHorizontal className="h-5 w-5 text-[#111827] dark:text-[#D1D5DB]" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <AnimatePresence>
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <DropdownMenuContent
                            align="end"
                            className="bg-white dark:bg-[#1F2937] border-[#D1D5DB] dark:border-[#4B5563]"
                          >
                            <DropdownMenuItem
                              onSelect={() => {
                                setSelectedProject(project);
                                setIsViewOpen(true);
                              }}
                              className="text-[#111827] dark:text-[#D1D5DB]"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#D1D5DB] dark:bg-[#4B5563]" />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    setProjectToDelete(project.ID);
                                  }}
                                  className="text-[#111827] dark:text-[#D1D5DB]"
                                >
                                  <Trash2 className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-white dark:bg-[#1F2937] border-[#D1D5DB] dark:border-[#4B5563]">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-[#111827] dark:text-[#D1D5DB]">
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-[#6B7280] dark:text-[#9CA3AF]">
                                    This action cannot be undone. This will
                                    permanently delete the project.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel
                                    onClick={() => setProjectToDelete(null)}
                                    className="bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563]"
                                  >
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDeleteProject}
                                    className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </motion.div>
                      </AnimatePresence>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4">
                      <div className="relative">
                        {project.ImageUrl ? (
                          <img
                            src={project.ImageUrl}
                            alt="Project image"
                            className="h-48 w-full object-cover rounded-md border border-[#D1D5DB] dark:border-[#4B5563] hover:opacity-90 transition-opacity"
                          />
                        ) : getYouTubeEmbedUrl(project.VideoUrl) ? (
                          <iframe
                            src={getYouTubeEmbedUrl(project.VideoUrl)}
                            title="YouTube video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="h-48 w-full rounded-md border border-[#D1D5DB] dark:border-[#4B5563] hover:opacity-90 transition-opacity"
                          />
                        ) : project.VideoUrl ? (
                          <video
                            src={project.VideoUrl}
                            className="h-48 w-full object-cover rounded-md border border-[#D1D5DB] dark:border-[#4B5563] hover:opacity-90 transition-opacity"
                            controls
                          />
                        ) : (
                          <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center border border-[#D1D5DB] dark:border-[#4B5563]">
                            <span className="text-gray-500 dark:text-gray-400">
                              No Media
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                        Created: {formatDate(project.CreatedAt)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full text-center py-10 text-[#111827] dark:text-[#D1D5DB]"
            >
              No projects found. Try adjusting your search or filter.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
            Showing {indexOfFirstProject + 1} to{" "}
            {Math.min(indexOfLastProject, filteredProjects.length)} of{" "}
            {filteredProjects.length} projects
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563] disabled:opacity-50"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className={
                  currentPage === page
                    ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    : "bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563]"
                }
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563] disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* View Card Modal */}
      <AlertDialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <AlertDialogContent className="bg-white dark:bg-[#1F2937] border-[#D1D5DB] dark:border-[#4B5563] max-w-2xl">
          <motion.div
            variants={viewCardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl text-[#111827] dark:text-[#D1D5DB]">
                Project Details
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#6B7280] dark:text-[#9CA3AF]">
                View the details of your project.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  {selectedProject?.ImageUrl ? (
                    <img
                      src={selectedProject.ImageUrl}
                      alt="Project image"
                      className="h-80 w-full object-cover rounded-md border border-[#D1D5DB] dark:border-[#4B5563]"
                    />
                  ) : getYouTubeEmbedUrl(selectedProject?.VideoUrl || "") ? (
                    <iframe
                      src={getYouTubeEmbedUrl(selectedProject?.VideoUrl || "")}
                      title="YouTube video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-80 w-full rounded-md border border-[#D1D5DB] dark:border-[#4B5563]"
                    />
                  ) : selectedProject?.VideoUrl ? (
                    <video
                      src={selectedProject.VideoUrl}
                      className="h-80 w-full object-cover rounded-md border border-[#D1D5DB] dark:border-[#4B5563]"
                      controls
                    />
                  ) : (
                    <div className="h-80 w-full bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center border border-[#D1D5DB] dark:border-[#4B5563]">
                      <span className="text-gray-500 dark:text-gray-400">
                        No Media
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                    Created: {formatDate(selectedProject?.CreatedAt || "")}
                  </p>
                  <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                    Category: {categoryName || "Unknown"}
                  </p>
                </div>
              </div>
            </CardContent>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setIsViewOpen(false)}
                className="bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563]"
              >
                Close
              </AlertDialogCancel>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
