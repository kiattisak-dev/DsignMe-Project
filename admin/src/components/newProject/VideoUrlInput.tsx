import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LinkIcon } from "lucide-react";
import { motion } from "framer-motion";

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({ opacity: 1, x: 0, transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" } }),
};

export default function VideoUrlInput({ control }: { control: any }) {
  return (
    <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
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
              <LinkIcon className="h-4 w-4" /> <span>Enter a URL for the project's video.</span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
}