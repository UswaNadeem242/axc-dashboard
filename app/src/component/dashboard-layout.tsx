"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const formatTitle = (path: string) => {
    if (!path || path === "/") return "Dashboard";
    
    if (path.includes("awb-entries")) return "AWB Management";
    
    return path
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) || "Dashboard";
  };

  const title = formatTitle(pathname || "/");
  const breadcrumb = pathname?.includes("awb-entries") ? "AWB Entries" : title;

  return (
    <main className="min-h-screen bg-axc-light-bg">
      <div className={`grid min-h-screen transition-all duration-355 ${isSidebarCollapsed ? "grid-cols-[80px_minmax(0,1fr)]" : "grid-cols-[280px_minmax(0,1fr)]"
        }`}>
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <div className="flex h-screen flex-col border-l border-axc-border overflow-hidden">
          <Header />
          <section className="flex-1 overflow-hidden bg-axc-light-bg lg:p-6 p-4 flex flex-col">
            <div className="mb-4 shrink-0">
              <h1 className=" text-axc-navy">{title}</h1>
              {pathname === "/" ? (
                <p className="mt-0.5  text-axc-gray text-regular-medium">
                  Welcome back, Admin! Here's what's happening today.
                </p>
              ) : (
                <p className="mt-0.5 text-regular-medium text-axc-gray ">
                  Home {pathname !== "/" && ` > ${breadcrumb}`}
                </p>
              )}
            </div>
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
