"use client";
import React, { useRef } from "react";
import { Mail, Building2, Pencil } from "lucide-react";
import {
  FieldLabel,
  FieldError,
  inputClass,
  errorInputClass,
  PanelHeader,
} from "./settingform";
import { ProfileFormState, ProfileFormErrors } from "./settingstate";

interface ProfileInformationProps {
  form: ProfileFormState;
  errors: ProfileFormErrors;
  updateField: <K extends keyof ProfileFormState>(field: K, value: ProfileFormState[K]) => void;
  handleAvatarSelect: (file: File | null) => void;
  handleSaveChanges: () => void;
  handleCancel: () => void;
  roleLabel?: string;
  email?: string;
  username?: string;
  lastLogin?: string;
}

export default function ProfileInformation({
  form,
  errors,
  updateField,
  handleAvatarSelect,
  handleSaveChanges,
  handleCancel,
  roleLabel = "Super Admin",
  email = "admin@admin.com",
  username = "super_admin",
  lastLogin,
}: ProfileInformationProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col">
      <PanelHeader title="Profile Information" />
      <div className="m-6 p-4 flex items-center justify-between gap-4 rounded-md border border-axc-border">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="h-14 w-14 rounded-full overflow-hidden bg-gray-100 border border-axc-border flex items-center justify-center">
              {form.avatarPreview ? (
                <img
                  src={form.avatarPreview}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-gray-400">
                  {(form.firstName || "S").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              title="Change photo"
              className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-axc-navy text-white flex items-center justify-center shadow-sm cursor-pointer hover:bg-axc-navy/90 transition"
            >
              <Pencil size={11} />
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              className="hidden"
              onChange={(e) => handleAvatarSelect(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-axc-dark-gray">
                {form.firstName || "Super"} {form.lastName || "Admin"}
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

        {lastLogin && (
          <span className="text-[11px] text-axc-gray whitespace-nowrap">
            Last login: {lastLogin}
          </span>
        )}
      </div>
      {errors.avatar && <div className="px-6 pt-2"><FieldError message={errors.avatar} /></div>}

      <div className="mx-6 mb-6 p-4 rounded-md border border-axc-border">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-4">
          <div className="flex flex-col gap-1">
            <FieldLabel required>First Name</FieldLabel>
            <input
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className={errors.firstName ? errorInputClass : inputClass}
              placeholder="Enter first name"
            />
            <FieldError message={errors.firstName} />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel required>Last Name</FieldLabel>
            <input
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              className={errors.lastName ? errorInputClass : inputClass}
              placeholder="Enter last name"
            />
            <FieldError message={errors.lastName} />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Username</FieldLabel>
            <input
              value={form.username}
              onChange={(e) => updateField("username", e.target.value)}
              className={inputClass}
              placeholder="Enter username"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Phone</FieldLabel>
            <input
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={inputClass}
              placeholder="Enter phone"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Address Line 1</FieldLabel>
            <input
              value={form.addressLine1}
              onChange={(e) => updateField("addressLine1", e.target.value)}
              className={inputClass}
              placeholder="Enter address"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Address Line 2</FieldLabel>
            <input
              value={form.addressLine2}
              onChange={(e) => updateField("addressLine2", e.target.value)}
              className={inputClass}
              placeholder="Enter address"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>City</FieldLabel>
            <input
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              className={inputClass}
              placeholder="City"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>State</FieldLabel>
            <input
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
              className={inputClass}
              placeholder="State"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Country</FieldLabel>
            <input
              value={form.country}
              onChange={(e) => updateField("country", e.target.value)}
              className={inputClass}
              placeholder="Country"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>ZIP Code</FieldLabel>
            <input
              value={form.zipCode}
              onChange={(e) => updateField("zipCode", e.target.value)}
              className={inputClass}
              placeholder="ZIP"
            />
          </div>

          <div className="flex flex-col gap-1 lg:col-span-3">
            <FieldLabel>Bio</FieldLabel>
            <textarea
              rows={5}
              maxLength={500}
              value={form.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              className={`${inputClass} resize-none`}
              placeholder="Maximum 500 words allowed"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 px-6 pb-6 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          className="border border-axc-border text-axc-dark-gray text-regular-small px-5 py-2.5 rounded-lg cursor-pointer hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveChanges}
          className="bg-axc-navy text-white text-regular-small px-5 py-2.5 rounded-lg cursor-pointer transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}