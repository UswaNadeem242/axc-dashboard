"use client";
import React, { useRef } from "react";
import { Building2, Upload } from "lucide-react";
import {
  FieldLabel,
  FieldError,
  inputClass,
  errorInputClass,
  PanelHeader,
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
  const logoInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col">
      <PanelHeader title="Organization Information" />
      <div className="m-6 p-6 flex items-center  gap-4 rounded-md border border-axc-border">
        <div className="h-16 w-16 rounded-lg bg-axc-navy flex items-center justify-center overflow-hidden shrink-0">
          {form.logoPreview ? (
            <img src={form.logoPreview} alt="Company Logo" className="h-full w-full object-cover" />
          ) : (
            <Building2 size={26} className="text-white" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div>
            <p className="font-bold text-axc-dark-gray text-regular-small">Company Logo</p>
            <p className="text-[11px] text-axc-gray">
              Upload your company logo recommended size 400x400px
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="flex items-center gap-2 border border-axc-border text-axc-dark-gray text-regular-small px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition"
            >
              <Upload size={14} />
              Upload Logo
            </button>
            {form.logoPreview && (
              <button
                type="button"
                onClick={() => handleLogoSelect(null)}
                className="text-axc-red text-[11px] font-semibold cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            className="hidden"
            onChange={(e) => handleLogoSelect(e.target.files?.[0] ?? null)}
          />
          <FieldError message={errors.logo} />
        </div>
      </div>
    
      <div className="mx-6 mb-6 p-6 rounded-md border border-axc-border">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-4">
          <div className="flex flex-col gap-1">
            <FieldLabel required>Company Name</FieldLabel>
            <input
              value={form.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
              className={errors.companyName ? errorInputClass : inputClass}
              placeholder="Enter name"
            />
            <FieldError message={errors.companyName} />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel required>Industry</FieldLabel>
            <input
              value={form.industry}
              onChange={(e) => updateField("industry", e.target.value)}
              className={errors.industry ? errorInputClass : inputClass}
              placeholder="Enter industry"
            />
            <FieldError message={errors.industry} />
          </div>

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
            <FieldLabel required>Phone Number</FieldLabel>
            <input
              value={form.phoneNumber}
              onChange={(e) => updateField("phoneNumber", e.target.value)}
              className={errors.phoneNumber ? errorInputClass : inputClass}
              placeholder="Enter value"
            />
            <FieldError message={errors.phoneNumber} />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Website URL</FieldLabel>
            <input
              value={form.websiteUrl}
              onChange={(e) => updateField("websiteUrl", e.target.value)}
              className={inputClass}
              placeholder="Enter URL"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Country</FieldLabel>
            <input
              value={form.country}
              onChange={(e) => updateField("country", e.target.value)}
              className={inputClass}
              placeholder="Enter country"
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-4">
          <div className="flex flex-col gap-1">
            <FieldLabel>City</FieldLabel>
            <input
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              className={inputClass}
              placeholder="Enter city"
            />
          </div>
          <div className="flex flex-col gap-1">
            <FieldLabel>State / Province</FieldLabel>
            <input
              value={form.stateProvince}
              onChange={(e) => updateField("stateProvince", e.target.value)}
              className={inputClass}
              placeholder="Enter state"
            />
          </div>
          <div className="flex flex-col gap-1">
            <FieldLabel>ZIP / Postal Code</FieldLabel>
            <input
              value={form.zipPostalCode}
              onChange={(e) => updateField("zipPostalCode", e.target.value)}
              className={inputClass}
              placeholder="Enter code"
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