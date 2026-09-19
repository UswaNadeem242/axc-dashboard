"use client";
import React from "react";
import {
  FieldLabel,
  FieldError,
  FileUploadField,
  PanelHeader,
  inputClass,
  errorInputClass,
  disabledInputClass,
} from "./settingform";
import { ProfileFormState, ProfileFormErrors } from "./settingstate";

interface ProfileInformationProps {
  form: ProfileFormState;
  errors: ProfileFormErrors;
  updateField: <K extends keyof ProfileFormState>(
    field: K,
    value: ProfileFormState[K],
  ) => void;
  handleAvatarSelect: (file: File | null) => void;
  handleSaveChanges: () => void;
  handleCancel: () => void;
  roleLabel?: string;
  email?: string;
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
}: ProfileInformationProps) {
  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col">
      <PanelHeader title="Profile Information" />

      <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-4 items-start">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <FieldLabel>Email</FieldLabel>
            <input
              disabled
              value={email}
              className={disabledInputClass}
              placeholder="Email"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel required>First Name</FieldLabel>
            <input
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className={errors.firstName ? errorInputClass : inputClass}
              placeholder="First name"
            />
            <FieldError message={errors.firstName} />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Phone</FieldLabel>
            <input
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={inputClass}
              placeholder="Phone"
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
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <FieldLabel>Role</FieldLabel>
            <input
              disabled
              value={roleLabel}
              className={disabledInputClass}
              placeholder="Role"
            />
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
            <FieldLabel>Address Line 1</FieldLabel>
            <input
              value={form.addressLine1}
              onChange={(e) => updateField("addressLine1", e.target.value)}
              className={inputClass}
              placeholder="Address"
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
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <FieldLabel>Username</FieldLabel>
            <input
              value={form.username}
              onChange={(e) => updateField("username", e.target.value)}
              className={inputClass}
              placeholder="Username"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Address Line 2</FieldLabel>
            <input
              value={form.addressLine2}
              onChange={(e) => updateField("addressLine2", e.target.value)}
              className={inputClass}
              placeholder="Address"
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
        </div>

        <div className="col-span-1 lg:col-span-3 flex flex-col gap-1">
          <FieldLabel>Profile Photo</FieldLabel>
          <FileUploadField
            onFileChange={handleAvatarSelect}
            acceptedMimeTypes={["image/jpeg", "image/png", "image/svg+xml"]}
            acceptedLabel="JPEG, PNG and SVG formats, up to 10MB"
          />
          <FieldError message={errors.avatar} />
        </div>

        <div className="col-span-1 lg:col-span-3 flex flex-col gap-1">
          <FieldLabel>Bio</FieldLabel>
          <textarea
            rows={5}
            maxLength={500}
            value={form.bio}
            onChange={(e) => updateField("bio", e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="Write here"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 px-6 pb-5 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          className="border border-axc-border text-axc-dark-gray text-regular-small px-5 py-4 rounded-lg cursor-pointer hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveChanges}
          className="bg-axc-navy text-white text-regular-small px-5 py-4 rounded-lg cursor-pointer transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
