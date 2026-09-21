"use client";

import React from "react";
import { Mail, Building2, Pencil } from "lucide-react";
import { FieldLabel, inputClass, PanelHeader } from "../setting/components/settingform";

interface ProfileViewProps {
  firstName?: string;
  lastName?: string;
  roleLabel?: string;
  email?: string;
  username?: string;
  phone?: string;
  city?: string;
  country?: string;
  bio?: string;
  avatarUrl?: string | null;
  lastLogin?: string;
  onEdit?: () => void;
}

function ReadOnlyField({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value?: string;
  multiline?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <FieldLabel>{label}</FieldLabel>
      <div
        className={`${inputClass} ${
          multiline
            ? "min-h-[120px] whitespace-pre-wrap break-words"
            : "flex items-center"
        } bg-gray-50 cursor-default`}
      >
        {value || "-"}
      </div>
    </div>
  );
}

export default function ProfileView({
  firstName = "Super",
  lastName = "Admin",
  roleLabel = "Super Admin",
  email = "admin@admin.com",
  username = "super_admin",
  phone,
  city,
  country,
  bio,
  avatarUrl,
  lastLogin,
  onEdit,
}: ProfileViewProps) {
  return (
    <div className="relative bg-white rounded-lg border border-axc-border shadow-sm flex flex-col w-full flex-1 min-h-0">
      <PanelHeader title="Profile Information" />

      <div className="m-6 p-6 flex items-center justify-between gap-4 rounded-md border border-axc-border">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full overflow-hidden bg-gray-100 border border-axc-border flex items-center justify-center shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-gray-400">
                {(firstName || "").charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-axc-dark-gray">
                {firstName} {lastName}
              </span>
              <span className="text-[10px] font-semibold text-axc-navy bg-axc-navy/10 px-2 py-0.5 rounded-full capitalize">
                {roleLabel}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-regular-small text-axc-gray">
              <Mail size={12} />
              <span>{email}</span>
            </div>

            <div className="flex items-center gap-1.5 text-regular-small text-axc-gray">
              <Building2 size={12} />
              <span>{username}</span>
            </div>
          </div>
        </div>

        {(onEdit || lastLogin) && (
          <div className="flex flex-col items-end gap-2 self-stretch justify-between">
            {onEdit ? (
              <button
                type="button"
                onClick={onEdit}
                title="Edit profile"
                className="h-8 w-8 rounded-full border border-axc-border flex items-center justify-center text-axc-navy bg-white hover:bg-gray-50 transition cursor-pointer"
              >
                <Pencil size={14} />
              </button>
            ) : (
              <span />
            )}

            {lastLogin && (
              <span className="text-[11px] text-axc-gray whitespace-nowrap">
                Last login: {lastLogin}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mx-6 mb-6 p-6 rounded-md border border-axc-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          <ReadOnlyField label="First Name" value={firstName} />
          <ReadOnlyField label="Last Name" value={lastName} />
          <ReadOnlyField label="Username" value={username} />

          <ReadOnlyField label="Phone" value={phone} />
          <ReadOnlyField label="City" value={city} />
          <ReadOnlyField label="Country" value={country} />

          <div className="sm:col-span-2 lg:col-span-3">
            <ReadOnlyField label="Bio" value={bio} multiline />
          </div>
        </div>
      </div>
    </div>
  );
}