"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const token = Cookies.get("auth_token");

  const showSidebar = token && !pathname.startsWith("/login");

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