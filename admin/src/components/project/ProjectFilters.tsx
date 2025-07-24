import { Category } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ProjectFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
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
    <div className="flex flex-col sm:flex-row gap-4">
      <Input
        placeholder="Search by image or video URL..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.ID} value={category.ID}>
              {category.NameCategory}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Types</SelectItem>
          <SelectItem value="Image">Image</SelectItem>
          <SelectItem value="Video">Video</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}