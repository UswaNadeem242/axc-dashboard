"use client";

import { useState } from "react";

import UserTab from "./usertab";
import RolesTab from "./roles";
import ActivityLogsTab from "./activitylog";

type TabId = "user" | "roles" | "activity";

const tabs: { id: TabId; label: string }[] = [
  { id: "user", label: "User" },
  { id: "roles", label: "Roles & Permissions" },
  { id: "activity", label: "Activity Logs" },
];

export default function UsersHeader() {
  const [activeTab, setActiveTab] = useState<TabId>("user");

  const renderContent = () => {
    switch (activeTab) {
      case "user":
        return <UserTab />;
      case "roles":
        return <RolesTab />;
      case "activity":
        return <ActivityLogsTab />;
      default:
        return <UserTab />;
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-md border border-axc-border bg-white px-5 pt-2">
        <div className="flex gap-0 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative shrink-0 px-4 py-4 text-[12px] font-semibold whitespace-nowrap transition-colors duration-150 ${
                  isActive ? "text-axc-blue" : "text-axc-gray hover:text-axc-blue"
                }`}
              >
                {tab.label}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-t transition-all duration-200 ${
                    isActive ? "bg-axc-blue opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-3 h-[calc(100vh-170px)] overflow-y-auto rounded-lg border border-axc-border bg-white px-[10px] py-[20px]">
        {renderContent()}
      </div>
    </div>
  );
}