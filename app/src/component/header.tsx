"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import SearchInput from "../common/search";
import NotificationDropdown from "./Notification";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <header className="flex w-full items-center justify-between gap-5 border-b border-axc-border bg-white px-6 py-2">
      <div className="w-64 hidden md:block">
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center bg-gray-200 rounded-full border border-axc-border">
            <NotificationDropdown />
          </div>

          <Link
            href="/setting"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-axc-border text-axc-dark-gray bg-gray-200 transition-colors"
            aria-label="Settings"
          >
            <Settings size={20} className="stroke-[1.8]" />
          </Link>
        </div>

        <div ref={dropdownRef} className="relative inline-block">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 rounded-lg py-1.5 pl-2 pr-1 hover:bg-gray-50 transition-colors text-left cursor-pointer select-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-axc-dark-gray">
              <User size={20} />
            </div>

            <div>
              <p className="text-regular-semibold text-axc-dark-gray leading-none">
                Admin User
              </p>

              <p className="mt-1 text-regular-small text-axc-gray leading-none">
                Administrator
              </p>
            </div>

            <ChevronDown
              size={16}
              className={`text-gray-500 ml-1 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute right-0 z-50 mt-3 w-52 rounded-2xl border border-gray-200/90 bg-white shadow-xl overflow-visible animate-in fade-in zoom-in-95 duration-150">
              <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 border-l border-t border-gray-200/90 bg-white" />
              <div className="relative z-10 overflow-hidden rounded-2xl divide-y divide-gray-100">
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3.5 px-4 py-2 text-left text-[14px] font-medium text-gray-700 hover:bg-gray-50/90 transition-colors group"
                >
                  <User size={18} className="text-navy shrink-0 stroke-[1.8]" />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/users"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3.5 px-4 py-2 text-left text-[14px] font-medium text-gray-700 hover:bg-gray-50/90 transition-colors group"
                >
                  <User size={18} className="text-navy shrink-0 stroke-[1.8]" />
                  <span>User & Roles</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3.5 px-4 py-2 text-left text-[14px] font-medium text-gray-700 hover:bg-gray-50/90 transition-colors w-full cursor-pointer group"
                >
                  <LogOut size={18} className="text-navy shrink-0 stroke-[1.8]" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}