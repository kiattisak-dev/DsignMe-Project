import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", // เปลี่ยน focus:ring-ring เป็น #2563EB และเพิ่ม transition
  {
    variants: {
      variant: {
        default: "bg-[#2563EB] text-white hover:bg-[#1D4ED8]",
        destructive: "bg-[#EF4444] text-white hover:bg-[#DC2626]", // สีแดง destructive
        outline:
          "border border-[#D1D5DB] bg-[#F9FAFB] hover:bg-[#E0E7FF] hover:text-[#2563EB] dark:border-[#4B5563] dark:bg-[#1F2937] dark:hover:bg-[#E0E7FF] dark:hover:text-[#2563EB]",
        secondary: "bg-[#6B7280] text-white hover:bg-[#4B5563]", // สีเทา secondary
        ghost:
          "hover:bg-[#E0E7FF] hover:text-[#2563EB] dark:hover:bg-[#E0E7FF] dark:hover:text-[#2563EB]",
        link: "text-[#2563EB] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
