import {
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
  FormField,
} from "@/components/ui/form";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form"; // เพิ่ม import

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function ImageUpload({
  imagePreview,
  setImagePreview,
  isLoading,
}: {
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  isLoading: boolean;
}) {
  const { setValue, control } = useFormContext(); // ใช้ useFormContext เพื่อเข้าถึง setValue และ control

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(
        "Selected image file:",
        file.name,
        "size:",
        file.size,
        "type:",
        file.type
      );
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setValue("imageFile", file, { shouldValidate: false });
    } else {
      console.log("No image file selected");
      setImagePreview(null);
      setValue("imageFile", undefined, { shouldValidate: false });
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
        name="imageFile"
        render={() => (
          <FormItem>
            <FormLabel className="text-base">Project Image</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageChange}
                  disabled={isLoading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:file:bg-gray-200 disabled:file:text-gray-500"
                />
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt="Image preview"
                    width={150}
                    height={150}
                    className="mt-2 h-32 w-32 object-cover rounded-md"
                  />
                )}
              </div>
            </FormControl>
            <FormDescription className="flex items-center gap-1">
              <ImageIcon className="h-4 w-4" />{" "}
              <span>Upload a JPEG or PNG image (max 5MB).</span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
}
