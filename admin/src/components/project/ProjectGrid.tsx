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

export default function ProjectGrid({
  projects,
  isLoading,
  setSelectedProject,
  setIsViewOpen,
  setProjectToDelete,
  handleDeleteProject,
}: ProjectGridProps) {
  // กำหนด variants สำหรับ container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // ลด stagger เพื่อให้สมูทและเร็วขึ้น
      },
    },
    exit: { opacity: 0 },
  };

  // กำหนด variants สำหรับแต่ละการ์ด
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring", // ใช้ spring เพื่อความสมูท
        stiffness: 120, // ความแข็งของ spring
        damping: 20, // การหน่วงเพื่อลดการเด้ง
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
          <div className="col-span-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} height={300} className="rounded-lg" />
              ))}
            </div>
          </div>
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <motion.div
              key={project.ID}
              variants={cardVariants}
              layout // เพิ่ม layout เพื่อให้การเปลี่ยนแปลงขนาดหรือตำแหน่งสมูท
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