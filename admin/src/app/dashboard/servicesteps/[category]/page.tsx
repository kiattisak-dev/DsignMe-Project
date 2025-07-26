"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import ServiceStepCard from "@/components/serviceStep/ServiceStepCard";
import EditServiceStepDialog from "@/components/serviceStep/EditServiceStepDialog";

interface Subtitle {
  text: string;
  headings: string[];
}

interface ServiceStep {
  _id: string;
  title: string;
  subtitles: Subtitle[];
  createdAt: string;
  updatedAt?: string;
}

export default function ServiceStepsPage() {
  const { category } = useParams<{ category: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [serviceSteps, setServiceSteps] = useState<ServiceStep[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const stepsPerPage = 6; // Reduced for better mobile display
  const [stepToDelete, setStepToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<ServiceStep | null>(null);

  // Fetch service steps
  useEffect(() => {
    const fetchServiceSteps = async () => {
      try {
        setIsLoading(true);
        const token = Cookies.get("auth_token");
        if (!token) throw new Error("Please sign in");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/servicesteps/${encodeURIComponent(
            category
          )}/service-steps`,

          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch service steps");
        const data = await response.json();
        setServiceSteps(
          data.data?.filter((step: ServiceStep) => step._id) || []
        );
        setCurrentPage(1);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load service steps",
          variant: "destructive",
        });
        setServiceSteps([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServiceSteps();
  }, [category, toast]);

  // Filter steps based on search query
  const filteredSteps = serviceSteps.filter(
    (step) =>
      step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.subtitles.some(
        (subtitle) =>
          subtitle.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          subtitle.headings.some((heading) =>
            heading.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
  );

  const totalPages = Math.ceil(filteredSteps.length / stepsPerPage);
  const indexOfLastStep = currentPage * stepsPerPage;
  const indexOfFirstStep = indexOfLastStep - stepsPerPage;
  const currentSteps = filteredSteps.slice(indexOfFirstStep, indexOfLastStep);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUpdateStep = (updatedStep: ServiceStep) => {
    setServiceSteps(
      serviceSteps.map((step) =>
        step._id === updatedStep._id ? updatedStep : step
      )
    );
  };

  const handleDeleteStep = async () => {
    if (stepToDelete) {
      try {
        const token = Cookies.get("auth_token");
        if (!token) throw new Error("Please sign in");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/servicesteps/${encodeURIComponent(
            category
          )}/service-steps/${stepToDelete}`,

          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to delete service step");
        setServiceSteps(
          serviceSteps.filter((step) => step._id !== stepToDelete)
        );
        if (currentSteps.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        toast({
          title: "Success",
          description: "Service step deleted successfully",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete service step",
          variant: "destructive",
        });
      } finally {
        setStepToDelete(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.1 },
    }),
    exit: { opacity: 0, y: 20 },
  };

  const viewCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  if (!category || category === "undefined") {
    return (
      <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gray-100 dark:bg-gray-900">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Invalid Category
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-4">
          Please select a valid category
        </p>
        <Link href="/dashboard/projects">
          <Button className="mt-4">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 p-4 sm:p-6 md:p-8 bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Service Steps - {category}
        </h1>
        <Link href={`/dashboard/servicesteps/${category}/new`}>
          <Button className="bg-black text-white border border-gray-300 hover:bg-gray-800 hover:border-gray-400 dark:bg-black dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500 flex items-center justify-center w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Service Step
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Input
          placeholder="Search service steps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-10 text-gray-900 dark:text-gray-100"
            >
              Loading...
            </motion.div>
          ) : currentSteps.length > 0 ? (
            currentSteps.map((step, index) => (
              <motion.div
                key={step._id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="relative">
                  <ServiceStepCard
                    step={step}
                    onView={() => {
                      setSelectedStep(step);
                      setIsViewOpen(true);
                    }}
                    onEdit={() => {
                      setSelectedStep(step);
                      setIsEditOpen(true);
                    }}
                    onDelete={() => setStepToDelete(step._id)}
                  />
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className=" col-span-full text-center py-10 text-gray-900 dark:text-gray-100"
            >
              No service steps found.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {indexOfFirstStep + 1} to{" "}
            {Math.min(indexOfLastStep, filteredSteps.length)} of{" "}
            {filteredSteps.length} service steps
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
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
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
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
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 sm:max-w-lg">
          <motion.div
            variants={viewCardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
                Service Step Details
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
                View the details of the service step.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 p-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {selectedStep?.title || "No Title"}
                </h3>
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Details
                  </h4>
                  {selectedStep?.subtitles.length ? (
                    selectedStep.subtitles.map((subtitle, index) => (
                      <div key={index} className="ml-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {subtitle.text || "No subtitle text"}
                        </p>
                        {subtitle.headings.length > 0 && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                            {subtitle.headings.map((heading, hIndex) => (
                              <div
                                key={hIndex}
                                className="flex items-center gap-2"
                              >
                                <span className="w-6">{hIndex + 1}.</span>
                                <span>{heading}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                      No details
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Created:{" "}
                  {selectedStep?.createdAt
                    ? formatDate(selectedStep.createdAt)
                    : "N/A"}
                </p>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setIsViewOpen(false)}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600"
              >
                Close
              </AlertDialogCancel>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!stepToDelete}
        onOpenChange={() => setStepToDelete(null)}
      >
        <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
              This action cannot be undone. This will permanently delete the
              service step.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setStepToDelete(null)}
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStep}
              className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditServiceStepDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        step={selectedStep}
        categoryName={category}
        onUpdate={handleUpdateStep}
      />
    </div>
  );
}
