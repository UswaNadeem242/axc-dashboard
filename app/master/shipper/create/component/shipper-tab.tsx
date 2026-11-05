"use client";

import React from "react";
import { Save } from "lucide-react";
import CommonDropdown from "@/app/src/common/dropdown";
import CustomDatePicker from "@/app/src/common/datepicker";
import {
  PanelHeader,
  FieldLabel,
  FieldError,
  EditIconButton,
  FileUploadField,
  inputClass,
  errorInputClass,
} from "@/app/create-entries/components/form";
import {
  GSTIN_TYPE_OPTIONS,
  COUNTRY_OPTIONS,
  CUSTOMER_OPTIONS,
} from "../../types";

export interface ShipperTabProps {
  form: {
    code: string;
    name: string;
    customer: string;
    accountCode: string;
    company: string;
    contactNo: string;
    email: string;
    pincode: string;
    dob: string;
    gstinType: string;
    gstinNo: string;
    gstinType2: string;
    gstinNo2: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    city: string;
    state: string;
    country: string;
    dialCode: string;
    page1File: string;
    page2File: string;
    shipperImage: string;
    uploadSignature: string;
    status: "ACTIVE" | "INACTIVE";
    editCode: boolean;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  loading: boolean;
  isEdit: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ShipperTab({
  form,
  setForm,
  errors,
  setErrors,
  loading,
  isEdit,
  onCancel,
  onSubmit,
}: ShipperTabProps) {
  const handleFileUpload = (
    field: "page1File" | "page2File" | "shipperImage" | "uploadSignature",
    file: File | null
  ) => {
    if (file) {
      setForm((prev: any) => ({ ...prev, [field]: file.name }));
    } else {
      setForm((prev: any) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 w-full pb-4">
      {/* ══════════════ MAIN SHIPPER CARD ══════════════ */}
      <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col w-full">
        {/* Purple-Navy Header Banner */}
        <PanelHeader
          title="Shipper Information"
          
        />

        {/* 3 Columns per Row Grid */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3.5">
          {/* Row 1: Code, Name, Company */}
          <div className="flex flex-col gap-1">
            <FieldLabel required>Shipper Code</FieldLabel>
            <div className="relative">
              <input
                type="text"
                value={form.code}
                readOnly={!form.editCode}
                placeholder={!form.editCode ? "AUTO-GENERATED" : ""}
                onChange={(e) => {
                  setForm((prev: any) => ({ ...prev, code: e.target.value.toUpperCase() }));
                  if (errors.code) setErrors((prev) => ({ ...prev, code: "" }));
                }}
                className={`${errors.code ? errorInputClass : inputClass} w-full pr-10 text-regular-small ${
                  form.editCode ? "bg-white" : "bg-gray-50 text-gray-500 cursor-not-allowed"
                }`}
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <EditIconButton
                  active={form.editCode}
                  onToggle={() => setForm((prev: any) => ({ ...prev, editCode: !prev.editCode }))}
                  title="Edit Shipper Code"
                />
              </div>
            </div>
            <FieldError message={errors.code} />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel required>Shipper Name</FieldLabel>
            <input
              type="text"
              placeholder="Enter Shipper Name..."
              value={form.name}
              onChange={(e) => {
                setForm((prev: any) => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={errors.name ? errorInputClass : inputClass}
            />
            <FieldError message={errors.name} />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel required>Company</FieldLabel>
            <input
              type="text"
              placeholder="Select / Enter Company..."
              value={form.company}
              onChange={(e) => {
                setForm((prev: any) => ({ ...prev, company: e.target.value }));
                if (errors.company) setErrors((prev) => ({ ...prev, company: "" }));
              }}
              className={errors.company ? errorInputClass : inputClass}
            />
            <FieldError message={errors.company} />
          </div>

          {/* Row 2: Customer, Customer Code, Contact No */}
          <div className="flex flex-col gap-1">
            <FieldLabel required>Customer</FieldLabel>
            <CommonDropdown
              placeholder="Select Customer..."
              value={form.customer}
              onChange={(val) => {
                setForm((prev: any) => ({ ...prev, customer: val }));
                if (errors.customer) setErrors((prev) => ({ ...prev, customer: "" }));
              }}
              options={CUSTOMER_OPTIONS}
              className={errors.customer ? "border-red-400" : "border-axc-border"}
            />
            <FieldError message={errors.customer} />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Customer Code</FieldLabel>
            <input
              type="text"
              placeholder="Customer Code"
              value={form.accountCode}
              onChange={(e) => setForm((prev: any) => ({ ...prev, accountCode: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Contact No.</FieldLabel>
            <input
              type="tel"
              placeholder="e.g. +91 98765 43210"
              value={form.contactNo}
              onChange={(e) => setForm((prev: any) => ({ ...prev, contactNo: e.target.value }))}
              className={inputClass}
            />
          </div>

          {/* Row 3: Email ID, Date of Birth, Pincode */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Email ID</FieldLabel>
            <input
              type="email"
              placeholder="Enter Email ID..."
              value={form.email}
              onChange={(e) => setForm((prev: any) => ({ ...prev, email: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1 relative z-30">
            <FieldLabel>Date of Birth</FieldLabel>
            <CustomDatePicker
              value={form.dob}
              onChange={(val) => setForm((prev: any) => ({ ...prev, dob: val }))}
              placeholder="Select Date..."
              openDirection="auto"
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Pincode</FieldLabel>
            <input
              type="text"
              placeholder="Enter Pincode..."
              value={form.pincode}
              onChange={(e) => setForm((prev: any) => ({ ...prev, pincode: e.target.value }))}
              className={inputClass}
            />
          </div>

          {/* Row 4: GSTIN Type, GSTIN No, GSTIN Type 2 */}
          <div className="flex flex-col gap-1">
            <FieldLabel>GSTIN Type</FieldLabel>
            <CommonDropdown
              placeholder="Select GSTIN Type..."
              value={form.gstinType}
              onChange={(val) => setForm((prev: any) => ({ ...prev, gstinType: val }))}
              options={GSTIN_TYPE_OPTIONS}
              className="border-axc-border"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>GSTIN No.</FieldLabel>
            <input
              type="text"
              placeholder="Enter GSTIN Number..."
              value={form.gstinNo}
              onChange={(e) => setForm((prev: any) => ({ ...prev, gstinNo: e.target.value.toUpperCase() }))}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>GSTIN Type 2</FieldLabel>
            <CommonDropdown
              placeholder="Select GSTIN Type 2..."
              value={form.gstinType2}
              onChange={(val) => setForm((prev: any) => ({ ...prev, gstinType2: val }))}
              options={GSTIN_TYPE_OPTIONS}
              className="border-axc-border"
            />
          </div>

          {/* Row 5: GSTIN No 2, City, State */}
          <div className="flex flex-col gap-1">
            <FieldLabel>GSTIN No. 2</FieldLabel>
            <input
              type="text"
              placeholder="Enter Secondary GSTIN..."
              value={form.gstinNo2}
              onChange={(e) => setForm((prev: any) => ({ ...prev, gstinNo2: e.target.value.toUpperCase() }))}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel required>City</FieldLabel>
            <input
              type="text"
              placeholder="Enter City..."
              value={form.city}
              onChange={(e) => {
                setForm((prev: any) => ({ ...prev, city: e.target.value }));
                if (errors.city) setErrors((prev) => ({ ...prev, city: "" }));
              }}
              className={errors.city ? errorInputClass : inputClass}
            />
            <FieldError message={errors.city} />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel required>State</FieldLabel>
            <input
              type="text"
              placeholder="Enter State..."
              value={form.state}
              onChange={(e) => {
                setForm((prev: any) => ({ ...prev, state: e.target.value }));
                if (errors.state) setErrors((prev) => ({ ...prev, state: "" }));
              }}
              className={errors.state ? errorInputClass : inputClass}
            />
            <FieldError message={errors.state} />
          </div>

          {/* Row 6: Country, Dial Code, Status */}
          <div className="flex flex-col gap-1">
            <FieldLabel required>Country</FieldLabel>
            <CommonDropdown
              placeholder="Select Country..."
              value={form.country}
              onChange={(val) => {
                setForm((prev: any) => ({ ...prev, country: val }));
                if (errors.country) setErrors((prev) => ({ ...prev, country: "" }));
              }}
              options={COUNTRY_OPTIONS}
              className={errors.country ? "border-red-400" : "border-axc-border"}
            />
            <FieldError message={errors.country} />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Dial Code</FieldLabel>
            <input
              type="tel"
              placeholder="e.g. +91"
              value={form.dialCode}
              onChange={(e) => setForm((prev: any) => ({ ...prev, dialCode: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Status</FieldLabel>
            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="status"
                  value="ACTIVE"
                  checked={form.status === "ACTIVE"}
                  onChange={() => setForm((prev: any) => ({ ...prev, status: "ACTIVE" }))}
                  className="w-4 h-4 accent-axc-navy cursor-pointer"
                />
                <span className="text-regular-small ">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="status"
                  value="INACTIVE"
                  checked={form.status === "INACTIVE"}
                  onChange={() => setForm((prev: any) => ({ ...prev, status: "INACTIVE" }))}
                  className="w-4 h-4 accent-axc-navy cursor-pointer"
                />
                <span className="text-regular-small">Inactive</span>
              </label>
            </div>
          </div>

          {/* Single-line Full-Width Document Uploads */}
          <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3 w-full">
            <FieldLabel>Page 1 Document</FieldLabel>
            <FileUploadField
              placeholder="No file chosen"
              onFileChange={(file) => handleFileUpload("page1File", file)}
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3 w-full">
            <FieldLabel>Page 2 Document</FieldLabel>
            <FileUploadField
              placeholder="No file chosen"
              onFileChange={(file) => handleFileUpload("page2File", file)}
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3 w-full">
            <FieldLabel>Shipper Image</FieldLabel>
            <FileUploadField
              placeholder="No file chosen"
              acceptedMimeTypes={["image/jpeg", "image/png", "image/webp"]}
              acceptedLabel="JPEG, PNG, WEBP formats, up to 10MB"
              onFileChange={(file) => handleFileUpload("shipperImage", file)}
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3 w-full">
            <FieldLabel>Upload Signature</FieldLabel>
            <FileUploadField
              placeholder="No file chosen"
              acceptedMimeTypes={["image/jpeg", "image/png", "image/svg+xml"]}
              acceptedLabel="JPEG, PNG and SVG formats, up to 10MB"
              onFileChange={(file) => handleFileUpload("uploadSignature", file)}
            />
          </div>

          {/* Full-Width Address Lines */}
          <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3 pt-1">
            <FieldLabel required>Address Line 1</FieldLabel>
            <textarea
              rows={2}
              placeholder="Address line 1 here..."
              value={form.addressLine1}
              onChange={(e) => {
                setForm((prev: any) => ({ ...prev, addressLine1: e.target.value }));
                if (errors.addressLine1) setErrors((prev) => ({ ...prev, addressLine1: "" }));
              }}
              className={`${
                errors.addressLine1 ? errorInputClass : inputClass
              } w-full text-regular-small resize-y`}
            />
            <FieldError message={errors.addressLine1} />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3">
            <FieldLabel>Address Line 2</FieldLabel>
            <textarea
              rows={2}
              placeholder="Address line 2 here..."
              value={form.addressLine2}
              onChange={(e) => setForm((prev: any) => ({ ...prev, addressLine2: e.target.value }))}
              className={`${inputClass} w-full text-regular-small resize-y`}
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3">
            <FieldLabel>Address Line 3</FieldLabel>
            <textarea
              rows={2}
              placeholder="Address line 3 here..."
              value={form.addressLine3}
              onChange={(e) => setForm((prev: any) => ({ ...prev, addressLine3: e.target.value }))}
              className={`${inputClass} w-full text-regular-small resize-y`}
            />
          </div>
        </div>
      </div>

      {/* ══════════════ ACTION BUTTONS ══════════════ */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-4 border border-axc-border bg-white text-axc-dark-gray rounded-lg text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm"
        >
          
          {loading ? "Saving..." : isEdit ? "Update Shipper" : "Create Shipper"}
        </button>
      </div>
    </form>
  );
}

