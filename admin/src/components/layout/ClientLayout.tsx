"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("auth_token");
    if (!token && pathname !== "/login") {
      router.push("/login");
    } else if (token && pathname === "/login") {
      router.push("/dashboard");
    }
    setIsLoading(false);
  }, [pathname, router]);

  if (isLoading) return null; // ป้องกัน render ก่อน redirect

  const showSidebar = !!Cookies.get("auth_token") && !pathname.startsWith("/login");

  return (
    <div className="flex min-h-screen relative">
      {showSidebar && <Sidebar expanded={expanded} setExpanded={setExpanded} />}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          showSidebar ? (expanded ? "pl-[256px]" : "pl-[64px]") : ""
        )}
      >
        {children}
      </main>
    </div>
  );
}