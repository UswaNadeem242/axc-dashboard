import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
interface SidebarItemProps {
  title: string;
  icon: React.ElementType;
  collapsed: boolean;
  active: boolean;
  open: boolean;
  childrenItems?: string[];
  activeSubMenu: string;
  onMenuClick: () => void;
  onSubMenuClick: (child: string) => void;
}
export default function SidebarItem({
  title, icon: Icon,collapsed,active,open,childrenItems,activeSubMenu,
  onMenuClick,
  onSubMenuClick,
}: SidebarItemProps) {
  return (
    <div>
      <button
        onClick={onMenuClick}
        className={`w-full h-10 rounded-2xl flex items-center transition-all duration-200 ${
          collapsed
            ? "justify-center px-0"
            : "justify-between px-5"
        } ${
          active
            ? "bg-[#2F6BDB] text-white shadow-sm"
            : "text-[#1F2937] hover:bg-[#F6F8FC]"
        }`}
      >
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <Icon
            size={18}
            strokeWidth={1.8}
            className={active ? "text-white" : "text-[#2F6BDB]"}
          />

          {!collapsed && (
            <span className="text-[14px] font-medium whitespace-nowrap">
              {title}
            </span>
          )}
        </div>

        {!collapsed && childrenItems && (
          open ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )
        )}
      </button>

      {!collapsed && childrenItems && open && (
        <div className="ml-11 mt-3 mb-3 border-l border-[#E8EDF5] pl-5 space-y-3">
          {childrenItems.map((child) => (
            <button
              key={child}
              onClick={() => onSubMenuClick(child)}
              className={`block text-left text-[13px] transition-colors ${
                activeSubMenu === child
                  ? "font-semibold text-[#2F6BDB]"
                  : "text-[#6B7280] hover:text-[#2F6BDB]"
              }`}
            >
              {child}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}