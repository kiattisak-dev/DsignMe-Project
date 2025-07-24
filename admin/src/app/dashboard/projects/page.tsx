"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import { Category, Project } from "@/lib/types";
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectFilters from "@/components/project/ProjectFilters";
import ProjectGrid from "@/components/project/ProjectGrid";
import PaginationControls from "@/components/project/PaginationControls";
import ProjectViewModal from "@/components/project/ProjectViewModal";
import debounce from "lodash/debounce";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const projectsPerPage = 6;
  const { toast } = useToast();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsCategoriesLoading(true);
        const token = Cookies.get("auth_token");
        if (!token) throw new Error("No authentication token found");
        const response = await fetch("http://localhost:8081/projects/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data.data || []);
        if (!data.data || data.data.length === 0) {
          toast({
            title: "Warning",
            description: "No categories found. Showing all projects.",
            variant: "default",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load categories.",
          variant: "destructive",
        });
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [toast]);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get("auth_token");
      if (!token) throw new Error("No authentication token found");

      let url = `http://localhost:8081/projects?page=${currentPage}&limit=${projectsPerPage}`;
      if (categoryFilter !== "All") {
        if (!categories.some((cat) => cat.ID === categoryFilter)) {
          console.warn(`Invalid category ID: ${categoryFilter}`);
          throw new Error("Selected category is invalid or not found");
        }
        url += `&categoryId=${categoryFilter}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching projects:", errorData);
        throw new Error(errorData.error || "Failed to fetch projects");
      }

      const data = await response.json();
      const fetchedProjects = data.data || [];
      setProjects(fetchedProjects);

      if (fetchedProjects.length === 0) {
        toast({
          title: "No Projects",
          description: "No projects found for the current filters.",
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error("Fetch projects error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load projects.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, categories, currentPage, toast]);

  // Trigger fetchProjects when dependencies change
  useEffect(() => {
    if (!isCategoriesLoading) {
      fetchProjects();
    }
  }, [fetchProjects, isCategoriesLoading]);

  // Fetch category name for view modal
  const fetchCategoryName = useCallback(async () => {
    if (selectedProject && isViewOpen) {
      try {
        const category = categories.find(
          (c: Category) => c.ID === selectedProject.CategoryID
        );
        if (category) {
          setCategoryName(category.NameCategory);
        } else {
          throw new Error("Category not found");
        }
      } catch (error: any) {
        setCategoryName("Unknown");
        toast({
          title: "Error",
          description: error.message || "Failed to load category name.",
          variant: "destructive",
        });
      }
    }
  }, [selectedProject, isViewOpen, categories, toast]);

  useEffect(() => {
    fetchCategoryName();
  }, [fetchCategoryName]);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, searchQuery, categoryFilter]);

  // Debounced search query handler
  const debouncedSetSearchQuery = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  // Memoized filtered projects
  const filteredProjects = useMemo(() => {
    const filtered = projects.filter((project) => {
      const matchesSearch =
        searchQuery === "" ||
        (project.title || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        typeFilter === "All" ||
        (typeFilter === "Image" && project.ImageUrl) ||
        (typeFilter === "Video" && project.VideoUrl) ||
        (typeFilter === "No Media" && !project.ImageUrl && !project.VideoUrl); // เพิ่ม No Media
      const matchesCategory =
        categoryFilter === "All" || project.CategoryID === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    });
    return filtered;
  }, [projects, searchQuery, typeFilter, categoryFilter]);

  // Notify when no results
  useEffect(() => {
    if (filteredProjects.length === 0 && projects.length > 0 && !isLoading) {
      toast({
        title: "No Results",
        description:
          "No projects match the current filters. Try adjusting your search or filter.",
        variant: "default",
      });
    }
  }, [filteredProjects, projects, isLoading, toast]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = useMemo(
    () => {
      const sliced = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
      return sliced;
    },
    [filteredProjects, indexOfFirstProject, indexOfLastProject]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleDeleteProject = useCallback(async () => {
    if (projectToDelete !== null) {
      try {
        const project = projects.find((p) => p.ID === projectToDelete);
        if (!project) throw new Error("Project not found");
        const category = categories.find(
          (c: Category) => c.ID === project.CategoryID
        );
        if (!category) throw new Error("Category not found");
        const token = Cookies.get("auth_token");
        if (!token) throw new Error("No authentication token found");

        const response = await fetch(
          `http://localhost:8081/projects/${category.NameCategory.toLowerCase()}/${projectToDelete}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to delete project");
        setProjects(projects.filter((project) => project.ID !== projectToDelete));
        if (currentProjects.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        toast({
          title: "Project deleted",
          description: "The project has been successfully deleted.",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete project.",
          variant: "destructive",
        });
      } finally {
        setProjectToDelete(null);
      }
    }
  }, [projectToDelete, projects, categories, currentProjects, currentPage, toast]);

  // Memoized callbacks for ProjectFilters
  const memoizedSetCategoryFilter = useCallback((value: string) => {
    setCategoryFilter(value);
  }, []);

  const memoizedSetTypeFilter = useCallback((value: string) => {
    setTypeFilter(value);
  }, []);

  return (
    <div className="min-h-screen space-y-6 p-4 sm:p-6 md:p-8 dark:bg-[#1F2937] transition-colors duration-200">
      {isCategoriesLoading ? (
        <div className="text-center py-10 text-gray-600 dark:text-gray-400">
          Loading categories...
        </div>
      ) : (
        <>
          <ProjectHeader />
          <ProjectFilters
            searchQuery={searchQuery}
            setSearchQuery={debouncedSetSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={memoizedSetCategoryFilter}
            typeFilter={typeFilter}
            setTypeFilter={memoizedSetTypeFilter}
            categories={categories}
          />
          <ProjectGrid
            projects={currentProjects}
            isLoading={isLoading}
            setSelectedProject={setSelectedProject}
            setIsViewOpen={setIsViewOpen}
            setProjectToDelete={setProjectToDelete}
            handleDeleteProject={handleDeleteProject}
          />
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              indexOfFirstProject={indexOfFirstProject}
              indexOfLastProject={indexOfLastProject}
              totalProjects={filteredProjects.length}
              handlePageChange={handlePageChange}
            />
          )}
          <ProjectViewModal
            isViewOpen={isViewOpen}
            setIsViewOpen={setIsViewOpen}
            selectedProject={selectedProject}
            categoryName={categoryName}
          />
        </>
      )}
    </div>
  );
}