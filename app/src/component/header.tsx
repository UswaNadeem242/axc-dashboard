"use client";

import { useState } from "react";
import {
  Bell,
  ChevronDown,
  User,
} from "lucide-react";
import SearchInput from "../common/search";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="flex w-full items-center justify-between gap-5 border-b border-axc-border bg-white px-6 py-2">
      {/* Left Side: Search Bar */}
      <div className="w-64 hidden md:block">
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
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
            <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-axc-border bg-white shadow-lg">
              
              {/* Profile */}
              <button className="w-full cursor-pointer rounded-t-lg px-4 py-2 text-left text-sm font-medium hover:bg-gray-100">
                Profile
              </button>

              {/* Users Page */}
              <Link
                href="/users"
                onClick={() => setIsOpen(false)}
                className="block w-full px-4 py-2 text-left text-sm font-medium hover:bg-gray-100"
              >
                Users
              </Link>

              {/* Sign Out */}
              <button className="w-full cursor-pointer rounded-b-lg px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50">
                Sign Out
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}