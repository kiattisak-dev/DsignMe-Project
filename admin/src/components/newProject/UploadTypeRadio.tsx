import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function UploadTypeRadio({
  control,
  onChange,
}: {
  control: any;
  onChange: (value: string) => void;
}) {
  return (
    <motion.div
      custom={1}
      variants={fieldVariants}
      initial="hidden"
      animate="visible"
    >
      <FormField
        control={control}
        name="uploadType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Upload Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={onChange}
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
