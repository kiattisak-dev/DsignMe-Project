import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LinkIcon } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Control } from "react-hook-form";

// Use the shared FormValues interface
interface FormValues {
  uploadType: "image" | "video" | "videoUrl";
  imageFile?: File;
  videoFile?: File;
  videoUrl?: string;
  category: string;
}

interface VideoUrlInputProps {
  control: Control<FormValues>;
}

const fieldVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export default function VideoUrlInput({ control }: VideoUrlInputProps) {
  return (
    <motion.div
      variants={fieldVariants}
      initial="hidden"
      animate="visible"
      custom={2}
      transition={{ delay: 2 * 0.1 }}
    >
      <FormField
        control={control}
        name="videoUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Project Video URL</FormLabel>
            <FormControl>
              <Input
                placeholder="https://youtu.be/example"
                {...field}
                className="h-12 text-base"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value || "")}
              />
            </FormControl>
            <FormDescription className="flex items-center gap-1">
              <LinkIcon className="h-4 w-4" />{" "}
              <span>Enter a URL for the project's video.</span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
}
