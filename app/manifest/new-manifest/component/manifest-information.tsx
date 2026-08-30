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
import { ManifestFormState, ManifestFormErrors } from "./state";
import CustomDatePicker from "@/app/src/common/datepicker";
import CustomTimePicker from "@/app/src/common/timepicker";
import Dropdown from "@/app/src/common/dropdown";

interface ManifestInformationProps {
  form: ManifestFormState;
  errors: ManifestFormErrors;
  updateField: (field: keyof ManifestFormState, value: string) => void;
  toggleEdit: (field: keyof ManifestFormState) => void;
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
    <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col">
      <PanelHeader title="Manifest Information" />
      <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-4 items-start">
        {/* ================= COLUMN 1 ================= */}
        <div className="flex flex-col gap-3 h-full">
          {/* 1. MANIFEST NO. */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Manifest No.</FieldLabel>
            <input
              disabled
              value={form.manifestNo}
              className={disabledInputClass}
              placeholder="Auto-generated"
            />
          </div>

          {/* 2. FORWARDER */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Forwarder</FieldLabel>
            <div className="flex gap-2">
              <input
                value={form.forwarderCode || ""}
                onChange={(e) => updateField("forwarderCode", e.target.value)}
                className={`${inputClass} w-2/5`}
                placeholder="Forwarder"
              />
              <input
                disabled
                value={form.forwarder}
                className={`${disabledInputClass} w-3/5`}
                placeholder="Forwarder Name"
              />
            </div>
          </div>

          {/* 3. VENDOR */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Vendor</FieldLabel>
            <div className="flex gap-2">
              <input
                value={form.vendorCode || ""}
                onChange={(e) => updateField("vendorCode", e.target.value)}
                className={`${inputClass} w-2/5`}
                placeholder="Vender"
              />
              <input
                disabled
                value={form.vendor}
                className={`${disabledInputClass} w-3/5`}
                placeholder="Vendor Name"
              />
            </div>
          </div>

          {/* 4. MASTER NO. */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Master No.</FieldLabel>
            <input
              value={form.masterNo}
              onChange={(e) => updateField("masterNo", e.target.value)}
              className={inputClass}
              placeholder="Master No."
            />
          </div>

          {/* 5. MASTER EDI BAG NO */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Master EDI Bag No</FieldLabel>
            <input
              value={form.masterEdiBagNo}
              onChange={(e) => updateField("masterEdiBagNo", e.target.value)}
              className={inputClass}
              placeholder="Master EDI Bag No"
            />
          </div>

          {/* 6. COMMENT */}
          <div className="flex flex-col gap-1 flex-1 min-h-[140px]">
            <FieldLabel>Comment</FieldLabel>
            <textarea
              value={form.comment}
              onChange={(e) => updateField("comment", e.target.value)}
              className={`${inputClass} flex-1 text-xs outline-none resize-none min-h-[120px]`}
              placeholder="Comment here"
            />
          </div>
        </div>

        {/* ================= COLUMN 2 ================= */}
        <div className="flex flex-col gap-3">
          {/* 1. DATE */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Date</FieldLabel>
            <CustomDatePicker
              value={form.date}
              onChange={(val) => updateField("date", val)}
              placeholder="Select date"
            />
          </div>

          {/* 2. TIME */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Time</FieldLabel>
            <CustomTimePicker
              value={form.time}
              onChange={(val) => updateField("time", val)}
              placeholder="Select time"
            />
          </div>

          {/* 3. RUN NUMBER */}
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
                <EditIconButton
                  active={form.editRunNumber}
                  onToggle={() => toggleEdit("editRunNumber")}
                  title="Edit Run Number"
                />
              </div>
            </div>
          </div>

          {/* 4. FLIGHT NO */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Flight No</FieldLabel>
            <div className="relative">
              <select
                disabled={!form.editFlightNo}
                value={form.flightNo}
                onChange={(e) => updateField("flightNo", e.target.value)}
                className={`${form.editFlightNo ? inputClass : disabledInputClass} w-full pr-16 appearance-none`}
              >
                <option value="">SELECT FLIGHT NO...</option>
                <option value="AI-101">AI-101</option>
                <option value="EK-501">EK-501</option>
              </select>
              <div className="absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <EditIconButton
                  active={form.editFlightNo}
                  onToggle={() => toggleEdit("editFlightNo")}
                  title="Edit Flight No"
                />
              </div>
            </div>
          </div>

          {/* 5. NO. OF BAGS */}
          <div className="flex flex-col gap-1">
            <FieldLabel>No. of Bags</FieldLabel>
            <div className="relative">
              <input
                disabled={!form.editNoOfBags}
                value={form.noOfBags}
                onChange={(e) => updateField("noOfBags", e.target.value)}
                className={`${form.editNoOfBags ? inputClass : disabledInputClass} w-full pr-10`}
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <EditIconButton
                  active={form.editNoOfBags}
                  onToggle={() => toggleEdit("editNoOfBags")}
                  title="Edit No. of Bags"
                />
              </div>
            </div>
          </div>

          {/* 6. ARRIVAL DATE */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Arrival Date</FieldLabel>
            <CustomDatePicker
              value={form.arrivalDate}
              onChange={(val) => updateField("arrivalDate", val)}
              placeholder="Select arrival date"
            />
          </div>

          {/* 7. ARRIVAL TIME */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Arrival Time</FieldLabel>
            <CustomTimePicker
              value={form.arrivalTime}
              onChange={(val) => updateField("arrivalTime", val)}
              placeholder="Select arrival time"
            />
          </div>
        </div>

        {/* ================= COLUMN 3 ================= */}
        <div className="flex flex-col gap-3">
          {/* 1. ORIGIN HUB * */}
          <div className="flex flex-col gap-1">
            <FieldLabel required>Origin Hub</FieldLabel>
            <Dropdown
              value={form.originHub}
              onChange={(val) => updateField("originHub", val)}
              placeholder="SELECT..."
              options={[
                { value: "DEL", label: "Delhi" },
                { value: "BOM", label: "Mumbai" },
              ]}
              className={errors.originHub ? "border-red-400 bg-red-50/40" : ""}
            />
            <FieldError message={errors.originHub} />
          </div>

          {/* 2. DESTINATION HUB */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Destination Hub</FieldLabel>
            <Dropdown
              value={form.destinationHub}
              onChange={(val) => updateField("destinationHub", val)}
              placeholder="SELECT..."
              options={[
                { value: "JFK", label: "New York" },
                { value: "LAX", label: "Los Angeles" },
              ]}
            />
          </div>

          {/* 3. LINE HAUL VENDOR */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Line Haul Vendor</FieldLabel>
            <input
              value={form.lineHaulVendor}
              onChange={(e) => updateField("lineHaulVendor", e.target.value)}
              className={inputClass}
              placeholder="Line Haul Vendor"
            />
          </div>



          {/* 6. TOTAL CHARGEABLE WT */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Total Chargeable Wt</FieldLabel>
            <input
              disabled
              value={form.totalChargeableWt}
              className={disabledInputClass}
              placeholder="Total Chargeable Wt"
            />
          </div>

          {/* 7. EDI EXCEL FILE */}
          <div className="flex flex-col gap-1">
            <FieldLabel>EDI Excel File</FieldLabel>
            <FileUploadField />
            <p className="text-[10px] text-axc-red font-bold mt-0.5 uppercase">
              (Upload excel file only)
            </p>
          </div>

          {/* 8. MAWB IMAGE */}
          <div className="flex flex-col gap-1">
            <FieldLabel>MAWB Image</FieldLabel>
            <FileUploadField multiple />
          </div>

          {/* 4. TOTAL ACTUAL WT */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Total Actual Wt</FieldLabel>
            <input
              disabled
              value={form.totalActualWt}
              className={disabledInputClass}
              placeholder="Total Actual Wt"
            />
          </div>

          {/* 5. TOTAL VOLUMETRIC WT */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Total Volumetric Wt</FieldLabel>
            <input
              disabled
              value={form.totalVolumetricWt}
              className={disabledInputClass}
              placeholder="Total Volumetric Wt"
            />
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3 px-6 pb-5 pt-2">
        <button
          type="button"
          onClick={handleSearchAwb}
          className="bg-axc-navy text-white text-regular-small px-5 py-4 rounded-lg cursor-pointer transition capitalize "
        >
          Search AWB
        </button>
        <button
          type="button"
          onClick={handleBagging}
          className="bg-axc-navy text-white text-regular-small px-5 py-4 rounded-lg cursor-pointer transition capitalize "
        >
          Bagging
        </button>
      </div>
    </div>
  );
}