"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import { Category, Project } from "@/lib/types";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentProjects } from "@/components/dashboard/recent-projects";
import { ProjectCategories } from "@/components/dashboard/project-categories";
import { CategoryStatsCard } from "@/components/dashboard/categorystats-card";
import { ProjectStatsCard } from "@/components/dashboard/projectstats-card";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = Cookies.get("auth_token");
        if (!token) throw new Error("Please sign in");

        const [projectResponse, categoryResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!projectResponse.ok)
          throw new Error(
            `Failed to fetch projects: ${projectResponse.status}`
          );
        if (!categoryResponse.ok)
          throw new Error(
            `Failed to fetch categories: ${categoryResponse.status}`
          );

        const [projectData, categoryData] = await Promise.all([
          projectResponse.json(),
          categoryResponse.json(),
        ]);

        setProjects(projectData.data || []);
        setCategories(categoryData.data || []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  // Animation variants for the main container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  // Animation variants for grid sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <AnimatePresence>
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center py-10 text-gray-900 dark:text-white"
        >
          Loading...
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 bg-white dark:bg-black text-gray-900 dark:text-white p-4 md:p-6 lg:p-8"
        >
          <motion.div variants={sectionVariants}>
            <DashboardHeader />
          </motion.div>
          <motion.div variants={sectionVariants}>
            <DashboardStats projects={projects} categories={categories} />
          </motion.div>
          <motion.div
            variants={sectionVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <motion.div variants={sectionVariants}>
              <ProjectStatsCard projects={projects} categories={categories} />
            </motion.div>
            <motion.div variants={sectionVariants}>
              <CategoryStatsCard projects={projects} categories={categories} />
            </motion.div>
          </motion.div>
          <motion.div
            variants={sectionVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <motion.div variants={sectionVariants} className="lg:col-span-2">
              <RecentProjects projects={projects} categories={categories} />
            </motion.div>
            <motion.div variants={sectionVariants} className="lg:col-span-1">
              <ProjectCategories categories={categories} projects={projects} />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
