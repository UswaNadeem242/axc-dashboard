"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import { usePathname } from "next/navigation";
import Link from "next/link";

const SEGMENT_LABELS: Record<string, string> = {
  "awb-entries": "AWB Entries",
  "create-entries": "Create Entries",
  "manifest": "Manifest Management",
  "all-manifest": "All Manifest",
  "new-manifest": "New Manifest",
  "invoice": "Invoice & Billing",
  "all-invoices": "All Invoices",
  "create-invoice": "Create Invoice",
  "users": "Users",
  "bagging": "Bagging",
};

const PARENT_ROUTE_REDIRECTS: Record<string, string> = {
  "/manifest": "/manifest",
  "/invoice": "/invoice/all-invoices",
};

const ROUTE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/awb-entries": "AWB Management",
  "/create-entries": "AWB Management",
  "/manifest": "Manifest Management",
  "/manifest/new-manifest": "Manifest Management",
  "/invoice/all-invoices": "Invoice & Billing",
  "/invoice/create-invoice": "Invoice & Billing",
  "/users": "Users",
};

function formatSegmentLabel(segment: string): string {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getBreadcrumbs(pathname: string): { label: string; href: string }[] {
  const items: { label: string; href: string }[] = [{ label: "Home", href: "/" }];

  if (!pathname || pathname === "/") {
    return items;
  }

  // Handle special case for create-entries being under AWB Management
  if (pathname === "/create-entries") {
    items.push({ label: "AWB Entries", href: "/awb-entries" });
    items.push({ label: "Create Entries", href: "/create-entries" });
    return items;
  }

  const rawSegments = pathname.split("/").filter(Boolean);
  const segments = rawSegments.filter((s) => s !== "component");

  let accumulatedPath = "";
  segments.forEach((segment) => {
    accumulatedPath += `/${segment}`;
    const mappedHref = PARENT_ROUTE_REDIRECTS[accumulatedPath] || accumulatedPath;
    const label = formatSegmentLabel(segment);
    if (label) {
      items.push({
        label,
        href: mappedHref,
      });
    }
  });

  return items;
}

function getPageTitle(pathname: string): string {
  if (!pathname || pathname === "/") return "Dashboard";
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];

  if (pathname.includes("awb-entries") || pathname.includes("create-entries")) return "AWB Management";
  if (pathname.startsWith("/manifest")) return "Manifest Management";
  if (pathname.startsWith("/invoice")) return "Invoice & Billing";
  if (pathname.startsWith("/users")) return "Users";

  return pathname
    .split("/")
    .filter(Boolean)
    .pop()
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()) || "Dashboard";
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const title = getPageTitle(pathname || "/");
  const breadcrumbs = getBreadcrumbs(pathname || "/");

  return (
    <main className="min-h-screen bg-axc-light-bg">
      <div
        className={`grid min-h-screen transition-all duration-355 ${
          isSidebarCollapsed ? "grid-cols-[80px_minmax(0,1fr)]" : "grid-cols-[280px_minmax(0,1fr)]"
        }`}
      >
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <div className="flex h-screen flex-col border-l border-axc-border overflow-hidden">
          <Header />
          <section className="flex-1 overflow-hidden bg-axc-light-bg lg:p-6 p-4 flex flex-col">
            <div className="mb-4 shrink-0">
              <h1 className="text-axc-navy font-bold">{title}</h1>
              {pathname === "/" ? (
                <p className="mt-0.5 text-axc-gray text-regular-medium">
                  Welcome back, Admin! Here's what's happening today.
                </p>
              ) : (
                <nav aria-label="Breadcrumb" className="mt-0.5">
                  <ol className="flex flex-wrap items-center gap-1.5 text-regular-medium text-axc-gray">
                    {breadcrumbs.map((item, index) => {
                      const isLast = index === breadcrumbs.length - 1;
                      return (
                        <li key={`${item.href}-${index}`} className="flex items-center gap-1.5">
                          {index > 0 && <span className="text-axc-gray select-none">&gt;</span>}
                          {isLast ? (
                            <span className="text-axc-gray" aria-current="page">
                              {item.label}
                            </span>
                          ) : (
                            <Link
                              href={item.href}
                              className="text-axc-gray hover:text-axc-navy hover:underline transition-colors"
                            >
                              {item.label}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </nav>
              )}
            </div>
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
