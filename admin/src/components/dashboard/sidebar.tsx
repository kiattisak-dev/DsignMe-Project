"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  LogOut,
  ShieldIcon,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Layers,
  ListOrdered,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";

interface Category {
  ID: string;
  NameCategory: string;
}

interface SidebarProps {
  className?: string;
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Sidebar({ className, expanded, setExpanded }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true); // เพิ่มสถานะ loading

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true); // เริ่มโหลด
      try {
        const token = Cookies.get("auth_token");
        if (!token) {
          throw new Error("No auth token found");
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/categories`, // ใช้ environment variable
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error("Fetch Categories Error:", error);
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false); // สิ้นสุดการโหลด
      }
    };
    fetchCategories();
  }, [toast, process.env.NEXT_PUBLIC_API_URL]); // เพิ่ม dependency

  // ฟังก์ชัน logout
  const handleLogout = () => {
    try {
      Cookies.remove("auth_token");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
        variant: "default",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout Error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Projects",
      href: "/dashboard/projects",
      icon: FolderKanban,
    },
    {
      name: "Categories",
      href: "/dashboard/categories",
      icon: Layers,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-card transition-all duration-500 ease-in-out fixed h-screen top-0 left-0",
        expanded ? "w-64" : "w-20",
        className
      )}
    >
      <div className="flex items-center h-16 px-4 border-b relative">
        {expanded ? (
          <div className="flex items-center gap-2">
            <ShieldIcon className="h-6 w-6" />
            <span className="font-bold text-lg">DsignMe Admin</span>
          </div>
        ) : (
          <div className="flex justify-center w-full">
            <ShieldIcon className="h-6 w-6 text-primary" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-3 h-8 w-8 rounded-full border shadow-md bg-background z-50 transition-all duration-500 ease-in-out",
            expanded ? "right-2" : "right-[-12px]",
            "hover:bg-black hover:text-white"
          )}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <TooltipProvider
              key={item.href}
              delayDuration={expanded ? 1000 : 0}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-lg px-3 text-muted-foreground transition-colors",
                      pathname === item.href &&
                        "bg-muted border border-primary text-primary font-semibold",
                      !expanded && "justify-center px-0",
                      "hover:bg-transparent hover:text-muted-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5",
                        pathname === item.href && "text-primary"
                      )}
                    />
                    {expanded && <span>{item.name}</span>}
                  </Link>
                </TooltipTrigger>
                {!expanded && (
                  <TooltipContent side="right">{item.name}</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
          {/* Service-Steps with Categories */}
          <TooltipProvider delayDuration={expanded ? 1000 : 0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-lg px-3 text-muted-foreground transition-colors",
                    pathname.includes("/dashboard/servicesteps") &&
                      "bg-muted border border-primary text-primary font-semibold",
                    !expanded && "justify-center px-0",
                    "hover:bg-transparent hover:text-muted-foreground"
                  )}
                >
                  <ListOrdered
                    className={cn(
                      "h-5 w-5",
                      pathname.includes("/dashboard/servicesteps") &&
                        "text-primary"
                    )}
                  />
                  {expanded && <span>Service-Steps</span>}
                </div>
              </TooltipTrigger>
              {!expanded && (
                <TooltipContent side="right">Service-Steps</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          {expanded && !loading && categories.length > 0 && (
            <div className="ml-6 grid gap-1">
              {categories.map((cat) => (
                <Link
                  key={cat.ID}
                  href={`/dashboard/servicesteps/${cat.NameCategory.toLowerCase()}`}
                  className={cn(
                    "flex h-8 items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground transition-colors",
                    pathname ===
                      `/dashboard/servicesteps/${cat.NameCategory.toLowerCase()}` &&
                      "bg-muted text-primary font-semibold",
                    "hover:bg-transparent hover:text-muted-foreground"
                  )}
                >
                  {cat.NameCategory}
                </Link>
              ))}
            </div>
          )}
          {expanded && !loading && categories.length === 0 && (
            <div className="ml-6 text-sm text-muted-foreground">
              No categories available.
            </div>
          )}
          {expanded && loading && (
            <div className="ml-6 text-sm text-muted-foreground">Loading...</div>
          )}
        </nav>
      </div>

      <Separator />

      <div className="p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full mt-4 text-muted-foreground hover:bg-transparent hover:text-muted-foreground",
            !expanded && "justify-center px-0"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {expanded && "Log out"}
        </Button>
      </div>
    </div>
  );
}