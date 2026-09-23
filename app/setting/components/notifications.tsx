"use client";
import React from "react";
import {
  Mail,
  Bell,
  CreditCard,
  Shield,
  Megaphone,
  MessageSquare,
  MessageCircle,
  UserPlus,
  AlertTriangle,
} from "lucide-react";
import { PanelHeader } from "./settingform";
import { NotificationFormState } from "./settingstate";

interface NotificationSettingsProps {
  form: NotificationFormState;
  onToggle: (key: keyof NotificationFormState) => void;
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

function ToggleSwitch({ checked, onChange, disabled = false }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={` relative inline-flex h-[22px] w-[42px] shrink-0 cursor-pointer items-center rounded-full border transition-all duration-200 ease-in-out focus:outline-none disabled:cursor-not-allowed disabled:opacity-50
        ${checked ? "bg-axc-green border-axc-green" : "bg-gray-300 border-gray-400"}
      `}
    >
      <span
        className={`pointer-events-none absolute top-[2px] h-[16px] w-[16px]  rounded-full  bg-white shadow-sm transition-all duration-200
          ${checked ? "left-[23px]" : "left-[2px]"}
        `}
      />
    </button>
  );
}

interface SectionHeadingProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

function SectionHeading({ icon, iconBg, iconColor, title, description }: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-4">
      <div className={`h-10 w-10 shrink-0 rounded-md flex items-center justify-center ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-bold text-axc-dark-gray">{title}</span>
        <span className="text-regular-small text-axc-gray">{description}</span>
      </div>
    </div>
  );
}

interface NotificationRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

function NotificationRow({ icon, title, description, checked, onChange }: NotificationRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3">
        <span className="h-8 w-8 shrink-0 rounded-md bg-gray-100 text-gray-500 flex items-center justify-center">
          {icon}
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-regular-medium font-semibold text-axc-dark-gray">{title}</span>
          <span className="text-regular-small text-axc-gray">{description}</span>
        </div>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );
}

export default function NotificationSettings({ form, onToggle }: NotificationSettingsProps) {
  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col">
      <PanelHeader title="Notifications" />
      <div className="m-6 p-4 rounded-md border border-axc-border">
        <SectionHeading
          icon={<Mail size={18} />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          title="Email Notifications"
          description="Choose what updates you want to receive via email"
        />

        <div className="mt-2 divide-y divide-axc-border">
          <NotificationRow
            icon={<UserPlus size={14} />}
            title="Team Updates"
            description="Get notified about team member changes and updates"
            checked={form.teamUpdates}
            onChange={() => onToggle("teamUpdates")}
          />
          <NotificationRow
            icon={<CreditCard size={14} />}
            title="Billing & Payments"
            description="Receive updates about invoices and payment status"
            checked={form.billingPayments}
            onChange={() => onToggle("billingPayments")}
          />
          <NotificationRow
            icon={<Shield size={14} />}
            title="Security Alerts"
            description="Important updates about your account security"
            checked={form.securityAlerts}
            onChange={() => onToggle("securityAlerts")}
          />
          <NotificationRow
            icon={<Megaphone size={14} />}
            title="Marketing & Promotions"
            description="Receive news, tips, and special offers"
            checked={form.marketingPromotions}
            onChange={() => onToggle("marketingPromotions")}
          />
          <NotificationRow
            icon={<Bell size={14} />}
            title="New Features & Updates"
            description="Learn about new features and product updates"
            checked={form.newFeatures}
            onChange={() => onToggle("newFeatures")}
          />
        </div>
      </div>
      <div className="mx-6 mb-6 p-4 rounded-md border border-axc-border">
        <SectionHeading
          icon={<Bell size={18} />}
          iconBg="bg-red-100"
          iconColor="text-axc-red"
          title="Push Notifications"
          description="Get instant notifications on your devices"
        />

        <div className="mt-2 divide-y divide-axc-border">
          <NotificationRow
            icon={<MessageSquare size={14} />}
            title="Mentions"
            description="When someone mentions you in a comment"
            checked={form.mentions}
            onChange={() => onToggle("mentions")}
          />
          <NotificationRow
            icon={<MessageCircle size={14} />}
            title="Comments"
            description="New comments on your items"
            checked={form.comments}
            onChange={() => onToggle("comments")}
          />
          <NotificationRow
            icon={<UserPlus size={14} />}
            title="Team Invites"
            description="When you're invited to join a team"
            checked={form.teamInvites}
            onChange={() => onToggle("teamInvites")}
          />
          <NotificationRow
            icon={<AlertTriangle size={14} />}
            title="System Alerts"
            description="Important system notifications and alerts"
            checked={form.systemAlerts}
            onChange={() => onToggle("systemAlerts")}
          />
        </div>
      </div>

      <div className="mx-6 mb-6 p-4 rounded-md border border-axc-border">
        <SectionHeading
          icon={<Bell size={18} />}
          iconBg="bg-green-100"
          iconColor="text-axc-green"
          title="In-App Notifications"
          description="Manage notifications within the application"
        />

        <div className="mt-2 divide-y divide-axc-border">
          <NotificationRow
            icon={<MessageSquare size={14} />}
            title="Messages"
            description="Direct messages from team members"
            checked={form.messages}
            onChange={() => onToggle("messages")}
          />
          <NotificationRow
            icon={<Bell size={14} />}
            title="Task Updates"
            description="Updates on tasks assigned to you"
            checked={form.taskUpdates}
            onChange={() => onToggle("taskUpdates")}
          />
          <NotificationRow
            icon={<Megaphone size={14} />}
            title="Product Updates"
            description="Learn about new features and improvements"
            checked={form.productUpdates}
            onChange={() => onToggle("productUpdates")}
          />
        </div>
      </div>
    </div>
  );
}