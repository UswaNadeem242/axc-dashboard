"use client";

import React from "react";
import {
  EditIconButton,
  FieldError,
  FieldLabel,
  FileUploadField,
  PanelHeader,
  inputClass,
  errorInputClass,
  disabledInputClass,
} from "./formfield";

export interface ManifestInformationData {
  forwarder: string;
  editForwarder: boolean;
  vendor: string;
  editVendor: boolean;
  lineHaulVendor: string;
  masterNo: string;
  masterEdiBagNo: string;
  runNumber: string;
  editRunNumber: boolean;
  flightNo: string;
  editFlightNo: boolean;
  originHub: string;
  destinationHub: string;
  comment: string;
}

interface ManifestInformationProps {
  form: ManifestInformationData;
  errors: { originHub?: string };
  updateField: (field: string, value: string) => void;
  toggleEdit: (field: string) => void;
  handleSearchAwb: () => void;
  handleBagging: () => void;
}

export default function ManifestInformation({
  form,
  errors,
  updateField,
  toggleEdit,
  handleSearchAwb,
  handleBagging,
}: ManifestInformationProps) {
  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col">
      <PanelHeader title="Manifest Information" />
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3 text-xs">
        <div className="flex flex-col gap-1">
          <FieldLabel>Forwarder</FieldLabel>
          <div className="relative">
            <input
              disabled={!form.editForwarder}
              value={form.forwarder}
              onChange={(e) => updateField("forwarder", e.target.value)}
              className={`${form.editForwarder ? inputClass : disabledInputClass} w-full pr-10`}
              placeholder="Forwarder"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              <EditIconButton active={form.editForwarder} onToggle={() => toggleEdit("editForwarder")} title="Edit Forwarder" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Vendor</FieldLabel>
          <div className="relative">
            <input
              disabled={!form.editVendor}
              value={form.vendor}
              onChange={(e) => updateField("vendor", e.target.value)}
              className={`${form.editVendor ? inputClass : disabledInputClass} w-full pr-10`}
              placeholder="Vendor"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              <EditIconButton active={form.editVendor} onToggle={() => toggleEdit("editVendor")} title="Edit Vendor" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Line Haul Vendor</FieldLabel>
          <input
            value={form.lineHaulVendor}
            onChange={(e) => updateField("lineHaulVendor", e.target.value)}
            className={`${inputClass} bg-gray-50`}
            placeholder="Line Haul Vendor"
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Master No.</FieldLabel>
          <input
            value={form.masterNo}
            onChange={(e) => updateField("masterNo", e.target.value)}
            className={`${inputClass} bg-gray-50`}
            placeholder="Master No."
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Master EDI Bag No</FieldLabel>
          <input
            value={form.masterEdiBagNo}
            onChange={(e) => updateField("masterEdiBagNo", e.target.value)}
            className={`${inputClass} bg-gray-50`}
            placeholder="Master EDI Bag No"
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Run Number</FieldLabel>
          <div className="relative">
            <input
              disabled={!form.editRunNumber}
              placeholder="Alphabet-Number"
              value={form.runNumber}
              onChange={(e) => updateField("runNumber", e.target.value)}
              className={`${form.editRunNumber ? inputClass : disabledInputClass} w-full pr-10`}
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              <EditIconButton active={form.editRunNumber} onToggle={() => toggleEdit("editRunNumber")} title="Edit Run Number" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Flight No</FieldLabel>
          <div className="relative">
            <select
              disabled={!form.editFlightNo}
              value={form.flightNo}
              onChange={(e) => updateField("flightNo", e.target.value)}
              className={`${form.editFlightNo ? inputClass : disabledInputClass} w-full pr-16 appearance-none`}
            >
              <option value="">Select Flight No...</option>
              <option value="AI-101">AI-101</option>
              <option value="EK-501">EK-501</option>
            </select>
            {/* custom dropdown arrow */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              <EditIconButton active={form.editFlightNo} onToggle={() => toggleEdit("editFlightNo")} title="Edit Flight No" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel required>Origin Hub</FieldLabel>
          <select
            value={form.originHub}
            onChange={(e) => updateField("originHub", e.target.value)}
            className={errors.originHub ? errorInputClass : inputClass}
          >
            <option value="">Select...</option>
            <option value="DEL">Delhi</option>
            <option value="BOM">Mumbai</option>
          </select>
          <FieldError message={errors.originHub} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Destination Hub</FieldLabel>
          <select
            value={form.destinationHub}
            onChange={(e) => updateField("destinationHub", e.target.value)}
            className={inputClass}
          >
            <option value="">Select...</option>
            <option value="JFK">New York</option>
            <option value="LAX">Los Angeles</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>EDI Excel File</FieldLabel>
          <FileUploadField />
          <p className="text-[10px] text-axc-red font-semibold mt-1 uppercase">(Upload excel file only)</p>
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>MAWB Image</FieldLabel>
          <FileUploadField multiple />
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2 xl:col-span-3">
          <FieldLabel>Comment</FieldLabel>
          <textarea
            rows={3}
            value={form.comment}
            onChange={(e) => updateField("comment", e.target.value)}
            className={`${inputClass} text-xs outline-none resize-none`}
            placeholder="Comment here"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 px-5 pb-5">
        <button
          type="button"
          onClick={handleSearchAwb}
          className="bg-axc-navy text-white text-[12px] font-semibold px-4 py-2 rounded cursor-pointer transition uppercase "
        >
          Search AWB
        </button>
        <button
          type="button"
          onClick={handleBagging}
          className="bg-axc-navy text-white text-[12px] font-semibold px-4 py-2 rounded cursor-pointer transition uppercase "
        >
          Bagging
        </button>
      </div>
    </div>
  );
}