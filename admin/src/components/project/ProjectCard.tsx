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
import { toast } from "@/hooks/use-toast";

interface ProjectCardProps {
  project: Project;
  setSelectedProject: (project: Project | null) => void;
  setIsViewOpen: (isOpen: boolean) => void;
  setProjectToDelete: (id: string | null) => void; // แก้ type ให้รับ string | null
  handleDeleteProject: () => void;
}

export default function ProjectCard({
  project,
  setSelectedProject,
  setIsViewOpen,
  setProjectToDelete,
  handleDeleteProject,
}: ProjectCardProps) {
  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) {
      return undefined;
    }
    const regExp =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
    const match = url.match(regExp);
    if (!match) {
      return undefined;
    }
    return `https://www.youtube-nocookie.com/embed/${match[1]}?enablejsapi=0&disable_polymer=true&rel=0&modestbranding=1&controls=0&showinfo=0`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="dark:border-white bg-white dark:bg-black hover:shadow-[0_4px_6px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_4px_6px_rgba(255,255,255,0.2)] transition-shadow duration-200">
      <CardHeader className="p-4 relative">
        <CardTitle className="text-lg text-black dark:text-white pr-8">
          {project.title || (project.ImageUrl ? "Image" : project.VideoUrl ? "Video" : "No Media")}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full"
            >
              <MoreHorizontal className="h-5 w-5 text-black dark:text-white" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <AnimatePresence>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.2, ease: "easeOut" },
                },
                exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DropdownMenuContent
                align="end"
                className="bg-white dark:bg-black border-black dark:border-white"
              >
                <DropdownMenuItem
                  onSelect={() => {
                    setSelectedProject(project);
                    setIsViewOpen(true);
                  }}
                  className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  <span>View</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-black dark:bg-white" />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setProjectToDelete(project.ID);
                      }}
                      className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
                    >
                      <Trash2 className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white dark:bg-black border-black dark:border-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-black dark:text-white">
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                        This action cannot be undone. This will permanently
                        delete the project.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setProjectToDelete(null)}
                        className="bg-white dark:bg-black text-black dark:text-white border-black dark:border-white hover:bg-gray-200 dark:hover:bg-gray-800"
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteProject}
                        className="bg-red-500 text-white hover:bg-white hover:text-red-500 border border-black dark:bg-white dark:text-red-500 dark:hover:bg-black dark:hover:text-red-500 dark:border-white"
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
                alt={project.title || "Project image"}
                loading="lazy" 
                className="h-48 w-full object-cover rounded-md border border-black dark:border-white hover:opacity-90 transition-opacity"
                onError={() => {
                  toast({
                    title: "Error",
                    description: `Failed to load image for project ${project.ID}`,
                    variant: "destructive",
                  });
                }}
              />
            ) : getYouTubeEmbedUrl(project.VideoUrl) ? (
              <iframe
                src={getYouTubeEmbedUrl(project.VideoUrl)}
                title={project.title || "YouTube video"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sandbox="allow-same-origin allow-scripts allow-presentation"
                className="h-48 w-full rounded-md border border-black dark:border-white hover:opacity-90 transition-opacity"
                onError={() => {
                  toast({
                    title: "Error",
                    description: `Failed to load YouTube video for project ${project.ID}`,
                    variant: "destructive",
                  });
                }}
              />
            ) : project.VideoUrl ? (
              <video
                src={project.VideoUrl}
                className="h-48 w-full object-cover rounded-md border border-black dark:border-white hover:opacity-90 transition-opacity"
                controls
                onError={() => {
                  toast({
                    title: "Error",
                    description: `Failed to load video for project ${project.ID}`,
                    variant: "destructive",
                  });
                }}
              />
            ) : (
              <div className="h-48 w-full bg-gray-200 dark:bg-gray-800 rounded-md flex items-center justify-center border border-black dark:border-white">
                <span className="text-gray-600 dark:text-gray-400">No Media Available</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Created: {formatDate(project.CreatedAt)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}