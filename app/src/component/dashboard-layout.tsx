"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
          <section className="flex-1 overflow-y-auto bg-axc-light-bg lg:p-12 p-4 scrollbar-none">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
