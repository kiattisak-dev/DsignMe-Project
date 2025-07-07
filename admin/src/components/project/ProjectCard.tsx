import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
  setSelectedProject: (project: Project | null) => void;
  setIsViewOpen: (isOpen: boolean) => void;
  setProjectToDelete: (id: string | null) => void;
  handleDeleteProject: () => void;
}

export default function ProjectCard({
  project,
  setSelectedProject,
  setIsViewOpen,
  setProjectToDelete,
  handleDeleteProject,
}: ProjectCardProps) {
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
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
    <Card className="border-[#D1D5DB] dark:border-[#4B5563] hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-4 relative">
        <CardTitle className="text-lg text-[#111827] dark:text-[#D1D5DB] pr-8">
          {project.ImageUrl ? "Image" : project.VideoUrl ? "Video" : "No Media"}
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
              variants={{
                hidden: { opacity: 0, y: -10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
                exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
              }}
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
                        This action cannot be undone. This will permanently delete the project.
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
                <span className="text-gray-500 dark:text-gray-400">No Media</span>
              </div>
            )}
          </div>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
            Created: {formatDate(project.CreatedAt)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}