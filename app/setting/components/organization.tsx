"use client";
import React from "react";
import {
  FieldLabel,
  FieldError,
  FileUploadField,
  PanelHeader,
  inputClass,
  errorInputClass,
} from "./settingform";
import { OrganizationFormState, OrganizationFormErrors } from "./settingstate";

interface OrganizationInformationProps {
  form: OrganizationFormState;
  errors: OrganizationFormErrors;
  updateField: <K extends keyof OrganizationFormState>(field: K, value: OrganizationFormState[K]) => void;
  handleLogoSelect: (file: File | null) => void;
  handleSaveChanges: () => void;
  handleCancel: () => void;
}

export default function OrganizationInformation({
  form,
  errors,
  updateField,
  handleLogoSelect,
  handleSaveChanges,
  handleCancel,
}: OrganizationInformationProps) {
  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col">
      <PanelHeader title="Organization Information" />

      <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-4 items-start">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <FieldLabel required>Company Name</FieldLabel>
            <input
              value={form.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
              className={errors.companyName ? errorInputClass : inputClass}
              placeholder="Name"
            />
            <FieldError message={errors.companyName} />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel required>Phone Number</FieldLabel>
            <input
              value={form.phoneNumber}
              onChange={(e) => updateField("phoneNumber", e.target.value)}
              className={errors.phoneNumber ? errorInputClass : inputClass}
              placeholder="Value"
            />
            <FieldError message={errors.phoneNumber} />
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
            <FieldLabel required>Industry</FieldLabel>
            <input
              value={form.industry}
              onChange={(e) => updateField("industry", e.target.value)}
              className={errors.industry ? errorInputClass : inputClass}
              placeholder="Industry"
            />
            <FieldError message={errors.industry} />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Website URL</FieldLabel>
            <input
              value={form.websiteUrl}
              onChange={(e) => updateField("websiteUrl", e.target.value)}
              className={inputClass}
              placeholder="URL here"
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
            <FieldLabel>State / Province</FieldLabel>
            <input
              value={form.stateProvince}
              onChange={(e) => updateField("stateProvince", e.target.value)}
              className={inputClass}
              placeholder="State"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <FieldLabel required>Email</FieldLabel>
            <input
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={errors.email ? errorInputClass : inputClass}
              placeholder="example@gmail.com"
            />
            <FieldError message={errors.email} />
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
            <FieldLabel>ZIP / Postal Code</FieldLabel>
            <input
              value={form.zipPostalCode}
              onChange={(e) => updateField("zipPostalCode", e.target.value)}
              className={inputClass}
              placeholder="Postal code"
            />
          </div>
        </div>
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-1">
          <FieldLabel>Company Logo</FieldLabel>
          <FileUploadField
            onFileChange={handleLogoSelect}
            acceptedMimeTypes={["image/jpeg", "image/png", "image/svg+xml"]}
            acceptedLabel="JPEG, PNG and SVG formats, up to 10MB (recommended 400x400px)"
          />
          <FieldError message={errors.logo} />
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