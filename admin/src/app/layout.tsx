import "./globals.css";
import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";
import ClientLayout from "@/components/layout/ClientLayout";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Modern admin dashboard for managing projects and contacts",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // ตรวจสอบ token เมื่อโหลดหน้า
  const token = Cookies.get("auth_token");
  if (!token && !["/login"].includes(window.location.pathname)) {
    redirect("/login");
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${roboto.variable} font-roboto`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ClientLayout>{children}</ClientLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}