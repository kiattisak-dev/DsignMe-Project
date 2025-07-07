import { Project } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "./ProjectCard";

interface ProjectGridProps {
  projects: Project[];
  isLoading: boolean;
  setSelectedProject: (project: Project | null) => void;
  setIsViewOpen: (isOpen: boolean) => void;
  setProjectToDelete: (id: string | null) => void;
  handleDeleteProject: () => void;
}

export default function ProjectGrid({
  projects,
  isLoading,
  setSelectedProject,
  setIsViewOpen,
  setProjectToDelete,
  handleDeleteProject,
}: ProjectGridProps) {
  return (
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
        ) : projects.length > 0 ? (
          projects.map((project, index) => (
            <motion.div
              key={project.ID}
              custom={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1, ease: "easeOut" } },
                exit: { opacity: 0, y: 20 },
              }}
              initial="hidden"
              animate="visible"
              exit="hidden"
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
  );
}