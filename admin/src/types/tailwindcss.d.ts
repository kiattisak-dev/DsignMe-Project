// types/tailwindcss.d.ts
import { Config } from "tailwindcss";

declare module "tailwindcss" {
  interface Config {
    darkMode?: string | ["class" | "media", string];
    content?: string[];
    theme?: {
      extend?: {
        colors?: {
          [key: string]: string | { DEFAULT: string; foreground?: string };
        };
        borderRadius?: {
          [key: string]: string;
        };
      };
    };
    plugins?: any[];
    daisyui?: {
      themes?: Array<{
        [key: string]: {
          [key: string]: string;
        };
      }>;
    };
  }
}