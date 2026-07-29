"use client";
import React from "react";
import {
  Home,
  SquarePen,
  UserRound,
  Users,
  Package,
  RotateCcw,
  Headphones,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
interface MenuItem {
  title: string;
  icon: React.ElementType;
  children?: string[];
}
interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}
const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: Home,
  },
  {
    title: "Products",
    icon: SquarePen,
    children: ["Manage All Products","B2B Products","B2C Products", "Collection",],
  },
  {
    title: "Seller",
    icon: UserRound,
    children: ["All Seller", "Payout", "Commission",],
  },
  {
    title: "Customer",
    icon: Users,
  },
  {
    title: "Sales",
    icon: Package,
  },
  {
    title: "Refund Management",
    icon: RotateCcw,
    children: [ "Dashboard","All Refunds", "Refund Policy", ],
  },
];
export default function Sidebar({collapsed,setCollapsed,}: SidebarProps) {
  const [activeMenu, setActiveMenu] =
    React.useState("Dashboard");
  const [activeSubMenu, setActiveSubMenu] =
    React.useState("");
  const [openMenu, setOpenMenu] =
    React.useState("");
  const handleMenuClick = (
    title: string,
    hasChildren: boolean
  ) => {
    setActiveMenu(title);
    if (!hasChildren) {
      setOpenMenu("");
      return;
    }
    setOpenMenu((prev) =>
      prev === title ? "" : title
    );
  };
  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-screen border-r border-[#E9EDF5] bg-white shadow-sm flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-2 top-8 z-[999] flex h-4 w-3.5 items-center justify-center rounded-md border border-[#DDE3EC] bg-white shadow-sm transition-all hover:bg-[#F5F7FB]"
      >
        {collapsed ? (
          <ChevronRight size={12} strokeWidth={2} />
        ) : (
          <ChevronLeft size={12} strokeWidth={2} />
        )}
      </button>
      <div
        className={`h-22 flex items-center transition-all ${
          collapsed
            ? "justify-center"
            : "justify-start px-6"
        }`}
      >
        <h1
          className={`font-black tracking-[-1px] whitespace-nowrap ${
            collapsed
              ? "text-[22px]"
              : "text-[44px]"
          }`}
        >
          <span className="text-[#2F6BDB]">A</span>
          <span className="text-[#F97316]">B</span>
          <span className="text-[#FACC15]">ii</span>
          <span className="text-[#22C55E]">L</span>
          <span className="text-[#3B82F6]">O</span>
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-5">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.title}
              title={item.title}
              icon={item.icon}
              collapsed={collapsed}
              active={activeMenu === item.title}
              open={openMenu === item.title}
              childrenItems={item.children}
              activeSubMenu={activeSubMenu}
              onMenuClick={() =>
                handleMenuClick(
                  item.title,
                  !!item.children
                )
              }
              onSubMenuClick={setActiveSubMenu}
            />
          ))}
        </div>
      </nav>
      <div className="border-t border-[#EEF2F7] p-4">
        <button
          className={`w-full flex ${
            collapsed
              ? "justify-center"
              : "items-center gap-3"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F6F9]">
            <Headphones
              size={18}
              className="text-[#6B7280]"
            />
          </div>
          {!collapsed && (
            <div className="text-left">
              <p className="text-[14px] font-semibold text-[#111827]">
                Support
              </p>

              <span className="mt-1 inline-flex rounded-full bg-[#FFD84D] px-2 py-0.5 text-[10px] font-semibold text-[#111827]">
                Need Help?
              </span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}