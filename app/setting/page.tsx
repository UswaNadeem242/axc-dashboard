"use client";
import React, { useState } from "react";
import { User, Building2, Users, CreditCard, ShieldCheck, Bell } from "lucide-react";
import ProfileInformation from "./components/profile";
import OrganizationInformation from "./components/organization";
import TeamAccess from "./components/teamaccess";
import BillingSettings from "./components/billing";
import SecuritySettings from "./components/security";
import NotificationSettings from "./components/notifications";
import {
  useProfileForm,
  useOrganizationForm,
  useBillingForm,
  useSecurityForm,
  useNotificationForm,
} from "./components/settingform";

type TabItem = { id: string; label: string; icon?: React.ReactNode };

const tabs: TabItem[] = [
  { id: "profile", label: "Profile", icon: <User size={14} /> },
  { id: "organization", label: "Organization", icon: <Building2 size={14} /> },
  { id: "team-access", label: "Team & Access", icon: <Users size={14} /> },
  { id: "billing", label: "Billing", icon: <CreditCard size={14} /> },
  { id: "security", label: "Security", icon: <ShieldCheck size={14} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={14} /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const profile = useProfileForm();
  const organization = useOrganizationForm();
  const billing = useBillingForm();
  const security = useSecurityForm();
  const notifications = useNotificationForm();

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-b-axc-border pb-0 shrink-0">
          <div className="flex gap-4 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`text-regular-medium relative shrink-0 flex items-center gap-1.5 px-4 py-4 whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                  activeTab === tab.id ? "text-axc-dark-gray" : "text-axc-gray hover:text-axc-dark-gray"
                }`}
              >
                {tab.icon}
                {tab.label}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t transition-all duration-200 ${
                    activeTab === tab.id ? "bg-axc-navy opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto mt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {activeTab === "profile" && (
            <ProfileInformation
              form={profile.form}
              errors={profile.errors}
              updateField={profile.updateField}
              handleAvatarSelect={profile.handleAvatarSelect}
              handleSaveChanges={profile.handleSaveChanges}
              handleCancel={profile.handleCancel}
            />
          )}
          {activeTab === "organization" && (
            <OrganizationInformation
              form={organization.form}
              errors={organization.errors}
              updateField={organization.updateField}
              handleLogoSelect={organization.handleLogoSelect}
              handleSaveChanges={organization.handleSaveChanges}
              handleCancel={organization.handleCancel}
            />
          )}
          {activeTab === "team-access" && <TeamAccess />}
          {activeTab === "billing" && <BillingSettings {...billing} />}
          {activeTab === "security" && <SecuritySettings {...security} />}
          {activeTab === "notifications" && (
            <NotificationSettings form={notifications.form} onToggle={notifications.onToggle} />
          )}
        </div>
      </div>
    </div>
  );
}