"use client";

import { useState } from "react";
import {
  Bell,
  ChevronDown,
  Search,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";
import SearchInput from "../common/search";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
    <header className="flex w-full items-center justify-between gap-5 border-b border-axc-border bg-white px-6 py-2">
      {/* Left Side: Heading */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-axc-navy">{title}</h1>
        <p className="text-xs text-axc-gray mt-1">Home {pathname !== "/" && ` > ${breadcrumb}`}</p>
      </div>

      {/* Center: Search Bar */}
      <div className="w-64 hidden md:block">
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Right Side: Notifications, Profile */}
      <div className="flex items-center gap-5">
        {/* Quick Actions */}
        <div className="flex items-center gap-4 border-r border-gray-100 pr-5">
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Bell size={20} className="text-axc-dark-gray" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-axc-red text-[10px] font-bold text-white leading-none text-center">
              12
            </span>
          </button>

        </div>

        {/* Profile Dropdown */}
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 rounded-lg py-1.5 pl-2 pr-1 hover:bg-gray-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-axc-dark-gray">
              <User size={20} />
            </div>

            <div>
              <p className="text-sm font-bold text-axc-dark-gray leading-none">
                Admin User
              </p>

              <p className="mt-1 text-[11px] text-axc-gray font-medium leading-none">
                Administrator
              </p>
            </div>

            <ChevronDown
              size={16}
              className={`text-gray-500 ml-1 transition-transform ${isOpen ? "rotate-180" : ""
                }`}
            />
          </button>


          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg  border-axc-border border bg-white shadow-lg z-50">
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-t-lg text-sm font-medium">
                Profile
              </button>

              <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-b-lg text-sm font-medium">
                Sign Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
