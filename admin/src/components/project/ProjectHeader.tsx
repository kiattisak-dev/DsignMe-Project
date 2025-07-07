import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProjectHeader() {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#111827] dark:text-[#D1D5DB]">
          Projects
        </h1>
      </div>
      <div className="flex space-x-4">
        <Link href="/dashboard/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </Link>
        <Link href="/dashboard/categories">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </div>
    </div>
  );
}