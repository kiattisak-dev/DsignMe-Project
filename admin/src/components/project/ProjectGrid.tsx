import { memo } from "react";
import { Project } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "./ProjectCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface ProjectGridProps {
  projects: Project[];
  isLoading: boolean;
  setSelectedProject: (project: Project | null) => void;
  setIsViewOpen: (isOpen: boolean) => void;
  setProjectToDelete: (id: string | null) => void;
  handleDeleteProject: () => void;
}

const ProjectGrid = memo(
  ({
    projects,
    isLoading,
    setSelectedProject,
    setIsViewOpen,
    setProjectToDelete,
    handleDeleteProject,
  }: ProjectGridProps) => {
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: projects.length > 6 ? 0 : 0.08, // ปรับตาม projectsPerPage
        },
      },
      exit: { opacity: 0 },
    };

    const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: projects.length > 6 ? "tween" : "spring",
          stiffness: 120,
          damping: 20,
          duration: 0.4,
        },
      },
      exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
    };

    return (
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              key="skeleton"
              variants={cardVariants}
              className="col-span-full"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6) // ปรับเป็น 6 เพื่อให้ตรงกับ projectsPerPage
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton
                      key={`skeleton-${i}`}
                      height={300}
                      className="rounded-lg"
                    />
                  ))}
              </div>
            </motion.div>
          ) : projects.length > 0 ? (
            projects.map((project) => (
              <motion.div
                key={project.ID}
                variants={cardVariants}
                layout
              >
                <ProjectCard
                  project={project}
                  setSelectedProject={setSelectedProject}
                  setIsViewOpen={setIsViewOpen}
                  setProjectToDelete={setProjectToDelete}
                  handleDeleteProject={handleDeleteProject}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              key="no-projects"
              variants={cardVariants}
              className="col-span-full text-center py-10 text-[#111827] dark:text-[#D1D5DB]"
            >
              No projects found. Try adjusting your search or filter.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

export default ProjectGrid;