"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, Home, Menu, Plus } from "lucide-react";
import { menuItems, type MenuItem, type SubMenuItem } from "../constant";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "@/public/image/logo.png"
interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [isAwbOpen, setIsAwbOpen] = useState<boolean>(true); 
  const [isInvoiceOpen, setIsInvoiceOpen] = useState<boolean>(false);
  const [isManifestOpen, setIsManifestOpen] = useState<boolean>(false);

  const handleItemClick = (item: MenuItem) => {
    if (item.hasDropdown) {
      if (item.id === "awb-management") {
        setIsAwbOpen(!isAwbOpen);
      } else if (item.id === "invoice") {
        setIsInvoiceOpen(!isInvoiceOpen);
      } else if (item.id === "manifest") { 
        setIsManifestOpen(!isManifestOpen); 
      }
    }
  };

  return (
    <aside className={`flex h-screen w-full flex-col border-r border-axc-border bg-white pt-1.5 pb-5 font-sans transition-all duration-300 ${isCollapsed ? "max-w-[80px] px-2" : "max-w-[280px] px-4"
      }`}>
      <div className="mb-3 flex border-b border-gray-100 pb-1">
        {isCollapsed ? (
          <div className="flex w-full justify-center">
            <button
              type="button"
              onClick={onToggle}
              title="Expand sidebar"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Menu size={22} className="text-axc-dark-gray" />
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
              <Menu size={22} className="text-axc-dark-gray" />
            </button>
          </div>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto pr-1 space-y-1 scrollbar-none">
        {menuItems.map((item) => {
          const isMainActive = item.href
            ? (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/")))
            : false;
          const hasActiveSubItem = item.subItems?.some((sub) =>
            sub.href && (
              pathname === sub.href ||
              (sub.href !== "/" && pathname.startsWith(sub.href + "/")) ||
              (sub.id === "awb-entries" && pathname === "/create-entries")
            )
          );
          const isDropdownOpen =
            item.id === "awb-management"
              ? isAwbOpen
              : item.id === "invoice"
              ? isInvoiceOpen
              : item.id === "manifest"       
              ? isManifestOpen               
              : false;                      
          const isActive = isMainActive || hasActiveSubItem;

          const buttonClass = `flex w-full flex-nowrap items-center transition-all duration-150 mb-3 cursor-pointer ${isCollapsed ? "justify-center rounded-lg p-2.5" : "justify-between rounded-lg px-3 py-2"
            } ${isActive
              ? "bg-axc-navy text-white shadow-sm"
              : "text-gray-700 hover:bg-axc-navy/10"
            }`;

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
                    <ChevronDown
                      size={14}
                      className={isActive ? "text-white" : "text-gray-400"}
                    />
                  ) : (
                    <ChevronRight
                      size={14}
                      className={isActive ? "text-white" : "text-gray-400"}
                    />
                  )}
                </span>
              )}
            </>
          );

          return (
            <div key={item.id} className="space-y-0.5">
              {item.href ? (
                <Link
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={buttonClass}
                >
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
              {!isCollapsed && item.hasDropdown && isDropdownOpen && item.subItems && (
                <div className="ml-6 mt-0.5 border-l border-axc-gray/30 pl-2 space-y-1.5">
                  {item.subItems.map((sub) => {
                    const isSubActive = sub.href
                      ? (
                        pathname === sub.href ||
                        (sub.href !== "/" && pathname.startsWith(sub.href + "/")) ||
                        (sub.id === "awb-entries" && pathname === "/create-entries")
                      )
                      : false;
                    const subClass = `block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-150 cursor-pointer whitespace-nowrap ${isSubActive
                      ? "bg-axc-navy/10 text-axc-navy"
                      : "text-gray-500 hover:bg-gray-50 hover:text-axc-dark-gray"
                      }`;

                    return sub.href ? (
                      <Link key={sub.id} href={sub.href} className={subClass}>
                        {sub.label}
                      </Link>
                    ) : (
                      <button
                        key={sub.id}
                        type="button"
                        className={subClass}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
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
        <div className="mt-4 rounded-2xl border border-[#FDE8B5] bg-[#FFF9E6] p-4 transition-all duration-300">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-950">Quick AWB Entry</p>
                <p className="text-[10px] text-amber-700/80">Create New Air Waybill</p>
              </div>
            </div>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-amber-500 shadow-sm border border-amber-100 hover:bg-amber-50 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}