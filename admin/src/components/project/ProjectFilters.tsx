import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@/lib/types";


interface ProjectFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  categories: Category[];
}

export default function ProjectFilters({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  typeFilter,
  setTypeFilter,
  categories,
}: ProjectFiltersProps) {
  return (
    <Card className="border-[#D1D5DB] dark:border-[#4B5563]">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-9 bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px] bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#374151] border-[#D1D5DB] dark:border-[#4B5563]">
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.ID} value={category.NameCategory}>
                    {category.NameCategory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px] bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#374151] border-[#D1D5DB] dark:border-[#4B5563]">
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Image">Image</SelectItem>
                <SelectItem value="Video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}