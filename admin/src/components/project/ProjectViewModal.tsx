import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { CardContent } from "@/components/ui/card";
import { Project } from "@/lib/types";
import { motion } from "framer-motion";

interface ProjectViewModalProps {
  isViewOpen: boolean;
  setIsViewOpen: (isOpen: boolean) => void;
  selectedProject: Project | null;
  categoryName: string | null;
}

export default function ProjectViewModal({
  isViewOpen,
  setIsViewOpen,
  selectedProject,
  categoryName,
}: ProjectViewModalProps) {
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
    const match = url.match(regExp);
    return match ? `https://www.youtube.com/embed/${match[1]}` : undefined;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AlertDialog open={isViewOpen} onOpenChange={setIsViewOpen}>
      <AlertDialogContent className="bg-white dark:bg-[#1F2937] border-[#D1D5DB] dark:border-[#4B5563] max-w-2xl">
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
            exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
          }}
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
  );
}
