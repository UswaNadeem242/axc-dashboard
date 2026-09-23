"use client";
import React, { useState } from "react";
import { Lock, ShieldCheck, Clock, Eye, EyeOff } from "lucide-react";
import Dropdown from "../../src/common/dropdown"; 
import {
  FieldLabel,
  FieldError,
  inputClass,
  errorInputClass,
  PanelHeader,
  SESSION_TIMEOUT_OPTIONS,
} from "./settingform";
import { SecurityFormState, SecurityFormErrors } from "./settingstate";

interface SecuritySettingsProps {
  form: SecurityFormState;
  errors: SecurityFormErrors;
  updateField: <K extends keyof SecurityFormState>(
    field: K,
    value: SecurityFormState[K],
  ) => void;
  handleUpdatePassword: () => void;
  handleCancel: () => void;
  twoFactorEnabled: boolean;
  onToggleTwoFactor: () => void;
  sessionTimeoutEnabled: boolean;
  onToggleSessionTimeout: () => void;
  sessionTimeoutDuration: string;
  onChangeSessionTimeoutDuration: (minutes: string) => void;
  sessionTimeoutOptions?: { value: string; label: string }[];
  isUpdating?: boolean;
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
}: ToggleSwitchProps) {
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

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  hasError?: boolean;
}

function PasswordInput({
  value,
  onChange,
  placeholder,
  hasError,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${hasError ? errorInputClass : inputClass} pr-10`}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        title={visible ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-axc-gray cursor-pointer hover:text-axc-dark-gray transition"
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

interface SectionHeadingProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function SectionHeading({ icon, title, description }: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 shrink-0 rounded-md bg-axc-navy/10 text-axc-navy flex items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-bold text-axc-dark-gray">{title}</span>
        <span className="text-regular-small text-axc-gray">{description}</span>
      </div>
    </div>
  );
}

export default function SecuritySettings({
  form,
  errors,
  updateField,
  handleUpdatePassword,
  handleCancel,
  twoFactorEnabled,
  onToggleTwoFactor,
  sessionTimeoutEnabled,
  onToggleSessionTimeout,
  sessionTimeoutDuration,
  onChangeSessionTimeoutDuration,
  sessionTimeoutOptions = SESSION_TIMEOUT_OPTIONS,
  isUpdating = false,
}: SecuritySettingsProps) {
  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col">
      <PanelHeader title="Security" />
      <div className="m-6 p-4 rounded-md border border-axc-border">
        <SectionHeading
          icon={<Lock size={18} />}
          title="Change Password"
          description="Update your password regularly to keep your account secure"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 mt-4">
          <div className="flex flex-col gap-1 lg:col-span-2 max-w-md">
            <FieldLabel required>Current Password</FieldLabel>
            <PasswordInput
              value={form.currentPassword}
              onChange={(v) => updateField("currentPassword", v)}
              placeholder="Enter current password"
              hasError={!!errors.currentPassword}
            />
            <FieldError message={errors.currentPassword} />
          </div>

          <div className="flex flex-col gap-1 max-w-md">
            <FieldLabel required>New Password</FieldLabel>
            <PasswordInput
              value={form.newPassword}
              onChange={(v) => updateField("newPassword", v)}
              placeholder="Enter new password"
              hasError={!!errors.newPassword}
            />
            <FieldError message={errors.newPassword} />
          </div>

          <div className="flex flex-col gap-1 max-w-md">
            <FieldLabel required>Confirm Password</FieldLabel>
            <PasswordInput
              value={form.confirmPassword}
              onChange={(v) => updateField("confirmPassword", v)}
              placeholder="Confirm new password"
              hasError={!!errors.confirmPassword}
            />
            <FieldError message={errors.confirmPassword} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="border border-axc-border text-axc-dark-gray text-regular-small px-5 py-2.5 rounded-lg cursor-pointer hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpdatePassword}
            disabled={isUpdating}
            className="bg-axc-navy text-white text-regular-small px-5 py-2.5 rounded-lg cursor-pointer transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
      <div className="mx-6 mb-6 p-4 rounded-md border border-axc-border flex items-center justify-between gap-4">
        <SectionHeading
          icon={<ShieldCheck size={18} />}
          title="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
        />
        <ToggleSwitch checked={twoFactorEnabled} onChange={onToggleTwoFactor} />
      </div>
      <div className="mx-6 mb-6 p-4 rounded-md border border-axc-border">
        <div className="flex items-center justify-between gap-4">
          <SectionHeading
            icon={<Clock size={18} />}
            title="Session Timeout"
            description="Automatically log out after period of inactivity"
          />
          <ToggleSwitch
            checked={sessionTimeoutEnabled}
            onChange={onToggleSessionTimeout}
          />
        </div>

        {sessionTimeoutEnabled && (
          <div className="mt-4 flex flex-col gap-1 w-full lg:max-w-xs">
            <FieldLabel>Timeout Duration</FieldLabel>
            <Dropdown
              options={sessionTimeoutOptions}
              value={sessionTimeoutDuration}
              onChange={onChangeSessionTimeoutDuration}
              placeholder="Select duration"
            />
          </div>
        )}
      </div>
    </div>
  );
}