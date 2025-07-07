"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import { Category, Project } from "@/lib/types";
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectFilters from "@/components/project/ProjectFilters";
import ProjectGrid from "@/components/project/ProjectGrid";
import PaginationControls from "@/components/project/PaginationControls";
import ProjectViewModal from "@/components/project/ProjectViewModal";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const projectsPerPage = 12;
  const { toast } = useToast();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = Cookies.get("auth_token");
        const response = await fetch("http://localhost:8081/projects/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch categories");
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
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(data.data || []);
        setCurrentPage(1);
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
          const response = await fetch("http://localhost:8081/projects/categories", {
            headers: { Authorization: `Bearer ${token}` },
          });
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

  // Reset current page when type filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter]);

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      (project.ImageUrl || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.VideoUrl || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === "All" ||
      (typeFilter === "Image" && project.ImageUrl && !project.VideoUrl) ||
      (typeFilter === "Video" && project.VideoUrl);
    return matchesSearch && matchesType; // Fixed typo here
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteProject = async () => {
    if (projectToDelete !== null) {
      try {
        const project = projects.find((p) => p.ID === projectToDelete);
        if (!project) return;
        const categoryResponse = await fetch("http://localhost:8081/projects/categories", {
          headers: { Authorization: `Bearer ${Cookies.get("auth_token")}` },
        });
        const categories = await categoryResponse.json();
        const category = categories.data.find((c: any) => c.ID === project.CategoryID);
        if (!category) throw new Error("Category not found");
        const response = await fetch(
          `http://localhost:8081/projects/${category.NameCategory.toLowerCase()}/${projectToDelete}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${Cookies.get("auth_token")}` },
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

  return (
    <div className="min-h-screen space-y-6 p-4 sm:p-6 md:p-8 dark:bg-[#1F2937] transition-colors duration-200">
      <ProjectHeader />
      <ProjectFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
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
    </div>
  );
}