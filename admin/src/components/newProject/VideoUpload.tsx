import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Video } from "lucide-react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form"; 

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function VideoUpload({ isLoading }: { isLoading: boolean }) {
  const { setValue, control } = useFormContext(); // ใช้ useFormContext เพื่อเข้าถึง setValue และ control

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(
        "Selected video file:",
        file.name,
        "size:",
        file.size,
        "type:",
        file.type
      );
      setValue("videoFile", file, { shouldValidate: false });
    } else {
      console.log("No video file selected");
      setValue("videoFile", undefined, { shouldValidate: false });
    }
  };

  return (
    <motion.div
      custom={2}
      variants={fieldVariants}
      initial="hidden"
      animate="visible"
    >
      <FormField
        control={control}
        name="videoFile"
        render={() => (
          <FormItem>
            <FormLabel className="text-base">Project Video</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={handleVideoChange}
                  disabled={isLoading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:file:bg-gray-200 disabled:file:text-gray-500"
                />
              </div>
            </FormControl>
            <FormDescription className="flex items-center gap-1">
              <Video className="h-4 w-4" />{" "}
              <span>Upload an MP4 or WebM video (max 50MB).</span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
}
