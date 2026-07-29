"use client";

import React from "react";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  hasDropdown?: boolean;
}

interface CommonTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChangeTab: (id: string) => void;
}

export default function CommonTabs({ tabs, activeTab, onChangeTab }: CommonTabsProps) {
  return (
    <div className="flex border border-axc-border bg-white rounded-lg overflow-hidden shadow-sm w-full">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold uppercase tracking-wider border-r border-gray-200 last:border-r-0 transition-all ${
              isActive
                ? "bg-axc-navy text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
