"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Trash2, Edit, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { addCategory, deleteCategory, getCategories, updateCategory } from "../../../../services/api";

interface Category {
  ID: string;
  NameCategory: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formCategory, setFormCategory] = useState<Category | null>(null);
  const [formName, setFormName] = useState("");
  const { toast } = useToast();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getCategories();
        console.log("Categories response:", data); // Debug
        setCategories(data.data || []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load categories.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, [toast]);

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.NameCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle create/edit category
  const handleSaveCategory = async () => {
    try {
      const body = { nameCategory: formName };
      let data;
      if (formCategory) {
        // Edit category
        data = await updateCategory(formCategory.ID, body);
        setCategories(
          categories.map((c) => (c.ID === formCategory.ID ? data.data : c))
        );
        toast({
          title: "Category updated",
          description: "The category has been successfully updated.",
        });
      } else {
        // Create category
        data = await addCategory(body);
        setCategories([...categories, data.data]);
        toast({
          title: "Category created",
          description: "The category has been successfully created.",
        });
      }
      setIsFormOpen(false);
      setFormCategory(null);
      setFormName("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save category.",
        variant: "destructive",
      });
    }
  };

  // Handle delete category
  const handleDeleteCategory = async () => {
    if (categoryToDelete !== null) {
      try {
        await deleteCategory(categoryToDelete);
        setCategories(
          categories.filter((category) => category.ID !== categoryToDelete)
        );
        toast({
          title: "Category deleted",
          description: "The category and associated projects and service steps have been deleted.",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete category.",
          variant: "destructive",
        });
      } finally {
        setCategoryToDelete(null);
      }
    }
  };

  // Animation variants
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
    }),
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };

  return (
    <div className="min-h-screen space-y-6 p-4 sm:p-6 md:p-8 dark:bg-[#1F2937] transition-colors duration-200">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111827] dark:text-[#D1D5DB]">
            Categories
          </h1>
        </div>
        <Button
          onClick={() => {
            setFormCategory(null);
            setFormName("");
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          className="pl-9 bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card className="border-[#D1D5DB] dark:border-[#4B5563]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-[#F9FAFB] dark:bg-[#1F2937] hover:bg-[#E5E7EB] dark:hover:bg-[#374151]">
                  <TableHead className="text-[#111827] dark:text-[#D1D5DB]">
                    Name
                  </TableHead>
                  <TableHead className="text-right text-[#111827] dark:text-[#D1D5DB]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        className="text-center py-10 text-[#111827] dark:text-[#D1D5DB]"
                      >
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Loading...
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  ) : filteredCategories.length > 0 ? (
                    filteredCategories.map((category, index) => (
                      <motion.tr
                        key={category.ID}
                        custom={index}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="border-[#D1D5DB] dark:border-[#4B5563] hover:bg-[#E5E7EB] dark:hover:bg-[#374151]"
                      >
                        <TableCell className="text-[#111827] dark:text-[#D1D5DB]">
                          {category.NameCategory}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full"
                              >
                                <MoreHorizontal className="h-5 w-5 text-[#111827] dark:text-[#D1D5DB]" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <AnimatePresence>
                              <motion.div
                                variants={dropdownVariants}
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
                                      setFormCategory(category);
                                      setFormName(category.NameCategory);
                                      setIsFormOpen(true);
                                    }}
                                    className="text-[#111827] dark:text-[#D1D5DB]"
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-[#D1D5DB] dark:bg-[#4B5563]" />
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem
                                        onSelect={(e) => {
                                          e.preventDefault();
                                          setCategoryToDelete(category.ID);
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
                                          This action cannot be undone. This will permanently delete the category and all associated projects and service steps.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel
                                          onClick={() =>
                                            setCategoryToDelete(null)
                                          }
                                          className="bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563]"
                                        >
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={handleDeleteCategory}
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
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        className="text-center py-10 text-[#111827] dark:text-[#D1D5DB]"
                      >
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          No categories found. Try adjusting your search.
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Category Modal */}
      <AlertDialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <AlertDialogContent className="bg-white dark:bg-[#1F2937] border-[#D1D5DB] dark:border-[#4B5563] max-w-md">
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl text-[#111827] dark:text-[#D1D5DB]">
                {formCategory ? "Edit Category" : "Create Category"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#6B7280] dark:text-[#9CA3AF]">
                {formCategory
                  ? "Edit the category name."
                  : "Enter a new category name."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Category name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563]"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setFormCategory(null);
                  setFormName("");
                }}
                className="bg-white dark:bg-[#374151] text-[#111827] dark:text-[#D1D5DB] border-[#D1D5DB] dark:border-[#4B5563]"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSaveCategory}
                className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Save
              </AlertDialogAction>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}