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
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative bg-white p-6 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-b-axc-border pb-0 shrink-0">
          <div className="flex gap-4 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-regular-medium relative shrink-0 flex items-center gap-1.5 px-4 py-4 whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                    isActive ? "text-axc-dark-gray" : "text-axc-gray hover:text-axc-dark-gray"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t transition-all duration-200 ${
                      isActive ? "bg-axc-navy opacity-100" : "opacity-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto mt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}