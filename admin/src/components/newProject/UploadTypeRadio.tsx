import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

interface UploadTypeRadioProps {
  control: Control<FormValues>;
  onChange: (value: string) => void;
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

export default function UploadTypeRadio({ control, onChange }: UploadTypeRadioProps) {
  return (
    <motion.div
      variants={fieldVariants}
      initial="hidden"
      animate="visible"
      custom={1}
      transition={{ delay: 1 * 0.1 }}
    >
      <FormField
        control={control}
        name="uploadType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Upload Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value);
                  onChange(value);
                }}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="image" />
                  <FormLabel htmlFor="image">Image File</FormLabel>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <FormLabel htmlFor="video">Video File</FormLabel>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="videoUrl" id="videoUrl" />
                  <FormLabel htmlFor="videoUrl">Video URL</FormLabel>
                </div>
              </RadioGroup>
            </FormControl>
            <FormDescription>
              Select the type of content to upload for this project.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
}