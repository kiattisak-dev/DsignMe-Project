import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  indexOfFirstProject: number;
  indexOfLastProject: number;
  totalProjects: number;
  handlePageChange: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  indexOfFirstProject,
  indexOfLastProject,
  totalProjects,
  handlePageChange,
}: PaginationControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <div className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
        Showing {indexOfFirstProject + 1} to {Math.min(indexOfLastProject, totalProjects)} of {totalProjects} projects
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563] disabled:opacity-50"
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
                : "bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563]"
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
          className="bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563] disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
}