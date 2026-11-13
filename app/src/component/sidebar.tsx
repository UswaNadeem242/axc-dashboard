"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Menu, Plus } from "lucide-react";
import { menuItems, type MenuItem, type SubMenuItem } from "../constant";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/image/logo.png";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isAwbOpen, setIsAwbOpen] = useState<boolean>(true);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState<boolean>(false);
  const [isManifestOpen, setIsManifestOpen] = useState<boolean>(false);
  const [isVendorInvoiceOpen, setIsVendorInvoiceOpen] = useState<boolean>(false);
  const [isAccountsOpen, setIsAccountsOpen] = useState<boolean>(pathname.startsWith("/accounts"));
  const [isMasterOpen, setIsMasterOpen] = useState<boolean>(pathname.startsWith("/master"));

  // Nested sub-dropdown open states keyed by sub-item id
  const [openSubDropdowns, setOpenSubDropdowns] = useState<Record<string, boolean>>({
    "customer-master":
      pathname.startsWith("/master/customer") ||
      pathname.startsWith("/master/shipper") ||
      pathname.startsWith("/master/consignee") ||
      pathname.startsWith("/master/vendor") ||
      pathname.startsWith("/master/company") ||
      pathname === "/master",
    customer: pathname.startsWith("/master/customer") || pathname === "/master",
    company: pathname.startsWith("/master/company"),
    "service-master":
      pathname.startsWith("/master/product") ||
      pathname.startsWith("/master/service") ||
      pathname.startsWith("/master/charge") ||
      pathname.startsWith("/master/rate-modifier") ||
      pathname.startsWith("/master/currency"),
    service: pathname.startsWith("/master/service"),
  });

  // helper: is a nested leaf path active?
  const isLeafActive = (href?: string) =>
    href
      ? pathname === href || (href !== "/" && pathname.startsWith(href + "/"))
      : false;

  const isSubActive = (sub: SubMenuItem): boolean => {
    if (isLeafActive(sub.href)) return true;
    if (sub.id === "awb-entries" && pathname === "/create-entries") return true;
    if (sub.subItems && sub.subItems.length > 0) {
      return sub.subItems.some((child) => isSubActive(child));
    }
    return false;
  };

  useEffect(() => {
    if (pathname.startsWith("/accounts")) setIsAccountsOpen(true);
    if (pathname.startsWith("/master")) {
      setIsMasterOpen(true);
    }
    const toOpen: Record<string, boolean> = {};
    const checkSubItems = (items?: SubMenuItem[]) => {
      if (!items) return;
      for (const item of items) {
        if (item.hasSubDropdown && item.subItems) {
          if (isSubActive(item)) {
            toOpen[item.id] = true;
          }
          checkSubItems(item.subItems);
        }
      }
    };
    menuItems.forEach((m) => checkSubItems(m.subItems));
    if (Object.keys(toOpen).length > 0) {
      setOpenSubDropdowns((prev) => ({ ...prev, ...toOpen }));
    }
  }, [pathname]);

  const handleItemClick = (item: MenuItem) => {
    if (!item.hasDropdown) return;
    if (item.id === "awb-management") setIsAwbOpen((p) => !p);
    else if (item.id === "invoice") setIsInvoiceOpen((p) => !p);
    else if (item.id === "manifest") setIsManifestOpen((p) => !p);
    else if (item.id === "vendorinvoice") setIsVendorInvoiceOpen((p) => !p);
    else if (item.id === "accounts") setIsAccountsOpen((p) => !p);
    else if (item.id === "master") setIsMasterOpen((p) => !p);
  };

  const toggleSubDropdown = (id: string) => {
    setOpenSubDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderSubMenuItem = (sub: SubMenuItem, depth = 1) => {
    if (sub.hasSubDropdown && sub.subItems && sub.subItems.length > 0) {
      const isSubOpen = !!openSubDropdowns[sub.id];
      const isItemActive = isSubActive(sub);
      const isExactActive = isLeafActive(sub.href);
      const isFolder = !sub.href;

      const headerClasses = isFolder
        ? `flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
            isItemActive
              ? "text-axc-navy bg-axc-navy/5"
              : "text-gray-700 hover:bg-gray-100/70 hover:text-axc-dark-gray"
          }`
        : `flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[13px] font-medium transition-all duration-150 cursor-pointer whitespace-nowrap ${
            isExactActive
              ? "bg-axc-navy/10 text-axc-navy font-semibold shadow-xs"
              : isItemActive
              ? "text-axc-navy font-medium hover:bg-gray-50"
              : "text-gray-600 hover:bg-gray-50 hover:text-axc-dark-gray"
          }`;

      return (
        <div key={sub.id} className="w-full">
          <div
            onClick={() => {
              if (sub.href) {
                setOpenSubDropdowns((prev) => ({ ...prev, [sub.id]: true }));
                router.push(sub.href);
              } else {
                toggleSubDropdown(sub.id);
              }
            }}
            className={headerClasses}
          >
            {sub.href ? (
              <Link
                href={sub.href}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenSubDropdowns((prev) => ({ ...prev, [sub.id]: true }));
                }}
                className="flex-1 text-left truncate"
              >
                {sub.label}
              </Link>
            ) : (
              <span className="flex-1 truncate">{sub.label}</span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleSubDropdown(sub.id);
              }}
              className="p-1 -mr-1 hover:bg-black/5 rounded cursor-pointer transition-colors"
              title={isSubOpen ? "Collapse" : "Expand"}
            >
              {isSubOpen ? (
                <ChevronDown
                  size={13}
                  className={isItemActive ? "text-axc-navy" : "text-gray-400"}
                />
              ) : (
                <ChevronRight
                  size={13}
                  className={isItemActive ? "text-axc-navy" : "text-gray-400"}
                />
              )}
            </button>
          </div>

          {isSubOpen && (
            <div className="ml-2.5 mt-0.5 border-l border-axc-gray/30 pl-2 space-y-0.5">
              {sub.subItems.map((child) => renderSubMenuItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // Regular flat leaf item
    const isLeafSelected =
      isLeafActive(sub.href) ||
      (sub.id === "awb-entries" && pathname === "/create-entries");

    const leafClass = `block w-full rounded-lg px-2.5 ${
      depth === 1
        ? "py-2 text-sm font-medium"
        : depth === 2
        ? "py-1.5 text-[13px] font-medium"
        : "py-1 text-xs font-normal"
    } text-left transition-all duration-150 cursor-pointer whitespace-nowrap truncate ${
      isLeafSelected
        ? "bg-axc-navy/10 text-axc-navy font-semibold shadow-xs"
        : "text-gray-500 hover:bg-gray-50 hover:text-axc-dark-gray"
    }`;

    return sub.href ? (
      <Link key={sub.id} href={sub.href} className={leafClass}>
        {sub.label}
      </Link>
    ) : (
      <button key={sub.id} type="button" className={leafClass}>
        {sub.label}
      </button>
    );
  };

  return (
    <aside
      className={`group flex h-screen w-full flex-col border-r border-axc-border bg-white pt-1.5 pb-5 font-sans transition-all duration-300 ${
        isCollapsed ? "max-w-[80px] px-2" : "max-w-[280px] px-4"
      }`}
    >
      {/* Logo / toggle */}
      <div className="mb-3 flex border-b border-gray-100 pb-1">
        {isCollapsed ? (
          <div className="flex w-full justify-center relative">
            <div className="flex h-10 w-10 items-center justify-center transition-opacity duration-200 group-hover:opacity-0">
              <Image src={logo} width={38} height={38} alt="logo" className="object-contain" />
            </div>
            <button
              type="button"
              onClick={onToggle}
              title="Expand sidebar"
              className="absolute inset-0 flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-all duration-200 opacity-0 group-hover:opacity-100 mx-auto"
            >
              <Menu size={22} className="text-axc-dark-gray cursor-pointer" />
            </button>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between">
            <Image src={logo} width={70} height={70} alt="logo" />
            <button
              type="button"
              onClick={onToggle}
              title="Collapse sidebar"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Menu size={22} className="text-axc-dark-gray cursor-pointer" />
            </button>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto pr-1 space-y-1 scrollbar-none">
        {menuItems.map((item) => {
          const isMainActive = item.href
            ? pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href + "/")) ||
              (item.id === "awb-management" && pathname === "/create-entries")
            : false;

          const hasActiveSubItem = item.subItems?.some((sub) => isSubActive(sub));

          const isDropdownOpen =
            item.id === "awb-management" ? isAwbOpen
            : item.id === "invoice"      ? isInvoiceOpen
            : item.id === "manifest"     ? isManifestOpen
            : item.id === "vendorinvoice"? isVendorInvoiceOpen
            : item.id === "accounts"     ? isAccountsOpen
            : item.id === "master"       ? isMasterOpen
            : false;

          const isActive = isMainActive || hasActiveSubItem;

          const buttonClass = `flex w-full flex-nowrap items-center transition-all duration-150 mb-3 cursor-pointer ${
            isCollapsed ? "justify-center rounded-lg p-2.5" : "justify-between rounded-lg px-3 py-2"
          } ${isActive ? "bg-axc-navy text-white shadow-sm" : "text-gray-700 hover:bg-axc-navy/10"}`;

          const itemContent = (
            <>
              <div className={`flex items-center min-w-0 ${isCollapsed ? "justify-center" : "gap-3"}`}>
                <item.icon
                  size={18}
                  className={`shrink-0 ${isActive ? "text-white" : "text-gray-500"}`}
                />
                {!isCollapsed && (
                  <span className="text-base font-medium whitespace-nowrap">{item.label}</span>
                )}
              </div>
              {!isCollapsed && item.hasDropdown && (
                <span className="shrink-0">
                  {isDropdownOpen ? (
                    <ChevronDown size={14} className={isActive ? "text-white" : "text-gray-400"} />
                  ) : (
                    <ChevronRight size={14} className={isActive ? "text-white" : "text-gray-400"} />
                  )}
                </span>
              )}
            </>
          );

          return (
            <div key={item.id} className="space-y-0.5">
              {/* Main menu button / link */}
              {item.href && !item.hasDropdown ? (
                <Link href={item.href} title={isCollapsed ? item.label : undefined} className={buttonClass}>
                  {itemContent}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => handleItemClick(item)}
                  title={isCollapsed ? item.label : undefined}
                  className={buttonClass}
                >
                  {itemContent}
                </button>
              )}

              {/* Sub-items (supports multi-level nested dropdowns) */}
              {!isCollapsed && item.hasDropdown && isDropdownOpen && item.subItems && (
                <div className="ml-6 mt-0.5 border-l border-axc-gray/30 pl-2 space-y-1.5">
                  {item.subItems.map((sub) => renderSubMenuItem(sub, 1))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {isCollapsed ? (
        <div className="mt-4 flex justify-center py-2">
          <button
            type="button"
            title="Quick AWB Entry"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600 border border-[#FDE8B5] hover:bg-amber-200 transition-colors shadow-sm"
          >
            <Plus size={20} />
          </button>
        </div>
      ) : (
        <></>
      )}
    </aside>
  );
}
