"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ExternalLink, ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  imageUrl: z.string().url({ message: "Please enter a valid URL" }),
  status: z.enum([
    "Planning",
    "In Progress",
    "Complete",
    "On Hold",
    "Cancelled",
  ]),
});

export default function NewProjectPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      status: "Planning",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // Simulate API request
    setTimeout(() => {
      console.log(values);

      toast({
        title: "Project created",
        description: "Your new project has been successfully created.",
      });

      router.push("/dashboard/projects");
      setIsLoading(false);
    }, 1500);
  }

  // Animation variants for the header and card
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Animation variants for form fields (staggered effect)
  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
    }),
  };

  // Animation variants for buttons
  const buttonVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, delay: 0.6 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="space-y-8 p-6 sm:p-8 md:p-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Add New Project</h1>
          <p className="text-lg text-muted-foreground">
            Create a new project with all the necessary details.
          </p>
        </div>

        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Link href="/dashboard/projects">
            <Button variant="outline" size="lg">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Projects
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <Card className="shadow-lg">
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl">Project Information</CardTitle>
            <CardDescription className="text-base">
              Fill out the form below to add a new project to your dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <motion.div
                    custom={0}
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Project Title
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter project title"
                              {...field}
                              className="h-12 text-base"
                            />
                          </FormControl>
                          <FormDescription>
                            A clear and concise title for your project.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    custom={1}
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 text-base">
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Planning">Planning</SelectItem>
                              <SelectItem value="In Progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="Complete">Complete</SelectItem>
                              <SelectItem value="On Hold">On Hold</SelectItem>
                              <SelectItem value="Cancelled">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The current status of your project.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>

                <motion.div
                  custom={2}
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a detailed description of the project"
                            className="min-h-[150px] text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a comprehensive description of the project's
                          goals, scope, and other relevant details.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  custom={3}
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Project Image URL
                        </FormLabel>
                        <FormControl>
                          <div className="flex space-x-3">
                            <Input
                              placeholder="https://example.com/image.jpg"
                              {...field}
                              className="h-12 text-base"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => window.open(field.value, "_blank")}
                              disabled={!field.value}
                              className="h-12 w-12"
                            >
                              <ExternalLink className="h-5 w-5" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription className="flex items-center gap-1">
                          <ImageIcon className="h-4 w-4" />
                          <span>
                            Enter a URL for the project's featured image.
                          </span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex justify-end gap-4"
                >
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link href="/dashboard/projects">
                      <Button variant="outline" size="lg" type="button">
                        Cancel
                      </Button>
                    </Link>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button type="submit" size="lg" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Project"
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
