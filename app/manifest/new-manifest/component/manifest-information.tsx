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
import { Plus } from "lucide-react";

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
  const [originHubOptions, setOriginHubOptions] = React.useState([
    { value: "DEL", label: "Delhi" },
    { value: "BOM", label: "Mumbai" },
  ]);
  const [isCityModalOpen, setIsCityModalOpen] = React.useState(false);
  const [newCityName, setNewCityName] = React.useState("");

  const finalOriginHubOptions = React.useMemo(() => {
    return [
      ...originHubOptions,
      {
        value: "OTHER",
        label: (
          <div className="flex items-center gap-2">
            <Plus size={15} strokeWidth={3} className="text-axc-yellow" />
            <span>Add Custom Hub</span>
          </div>
        ),
      },
    ];
  }, [originHubOptions]);

  const handleAddCity = () => {
    if (newCityName.trim()) {
      const code = newCityName.trim().substring(0, 3).toUpperCase();
      const newOption = { value: code, label: newCityName.trim() };
      setOriginHubOptions([...originHubOptions, newOption]);
      updateField("originHub", code);
      setIsCityModalOpen(false);
      setNewCityName("");
      setNewCityName("");
    }
  };

  const [destHubOptions, setDestHubOptions] = React.useState([
    { value: "JFK", label: "New York" },
    { value: "LAX", label: "Los Angeles" },
  ]);
  const [isDestCityModalOpen, setIsDestCityModalOpen] = React.useState(false);
  const [newDestCityName, setNewDestCityName] = React.useState("");

  const finalDestHubOptions = React.useMemo(() => {
    return [
      ...destHubOptions,
      {
        value: "OTHER",
        label: (
          <div className="flex items-center gap-2">
            <Plus size={15} strokeWidth={3} className="text-axc-yellow" />
            <span>Add Custom Hub</span>
          </div>
        ),
      },
    ];
  }, [destHubOptions]);

  const handleAddDestCity = () => {
    if (newDestCityName.trim()) {
      const code = newDestCityName.trim().substring(0, 3).toUpperCase();
      const newOption = { value: code, label: newDestCityName.trim() };
      setDestHubOptions([...destHubOptions, newOption]);
      updateField("destinationHub", code);
      setIsDestCityModalOpen(false);
      setNewDestCityName("");
    }
  };
  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col">
      <PanelHeader title="Manifest Information" />
      <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-4 items-start">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <FieldLabel>Manifest No.</FieldLabel>
            <input
              disabled
              value={form.manifestNo}
              className={disabledInputClass}
              placeholder="Auto-generated"
            />
          </div>

          {/* 2. DATE */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Date</FieldLabel>
            <CustomDatePicker
              value={form.date}
              onChange={(val) => updateField("date", val)}
              placeholder="Select date"
            />
          </div>

          {/* 3. TIME */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Time</FieldLabel>
            <CustomTimePicker
              value={form.time}
              onChange={(val) => updateField("time", val)}
              placeholder="Select time"
            />
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
          {/* <div className="flex flex-col gap-1">
            <FieldLabel>Master EDI Bag No</FieldLabel>
            <input
              value={form.masterEdiBagNo}
              onChange={(e) => updateField("masterEdiBagNo", e.target.value)}
              className={inputClass}
              placeholder="Master EDI Bag No"
            />
          </div> */}

          {/* 6. TOTAL ACTUAL WT */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Total Actual Wt</FieldLabel>
            <input
              disabled
              value={form.totalActualWt}
              className={disabledInputClass}
              placeholder="Total Actual Wt"
            />
          </div>
        </div>

        {/* ================= COLUMN 2 ================= */}
        <div className="flex flex-col gap-3">
          {/* 1. FORWARDER */}
          {/* <div className="flex flex-col gap-1">
            <FieldLabel>Forwarder</FieldLabel>
            <input
              value={form.forwarderCode || ""}
              onChange={(e) => updateField("forwarderCode", e.target.value)}
              className={inputClass}
              placeholder="Forwarder"
            />
          </div>

         
          <div className="flex flex-col gap-1">
            <FieldLabel>Vendor</FieldLabel>
            <input
              value={form.vendorCode || ""}
              onChange={(e) => updateField("vendorCode", e.target.value)}
              className={inputClass}
              placeholder="Vendor"
            />
          </div> */}

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
              <Dropdown
                value={form.flightNo}
                onChange={(val) => updateField("flightNo", val)}
                disabled={!form.editFlightNo}
                placeholder="Select Flight No..."
                options={[
                  { value: "AI-101", label: "AI-101" },
                  { value: "EK-501", label: "EK-501" },
                ]}
                className="pr-10"
              />
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

          {/* 6. TOTAL VOLUMETRIC WT */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Total Volumetric Wt</FieldLabel>
            <input
              disabled
              value={form.totalVolumetricWt}
              className={disabledInputClass}
              placeholder="Total Volumetric Wt"
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
        </div>

        {/* ================= COLUMN 3 ================= */}
        <div className="flex flex-col gap-3">
          {/* 1. ORIGIN HUB * */}
          <div className="flex flex-col gap-1">
            <FieldLabel required>Origin Hub</FieldLabel>
            <Dropdown
              value={form.originHub}
              onChange={(val) => {
                if (val === "OTHER") {
                  setIsCityModalOpen(true);
                  return;
                }
                updateField("originHub", val);
              }}
              placeholder="SELECT..."
              options={finalOriginHubOptions}
              className={errors.originHub ? "border-red-400 bg-red-50/40" : ""}
            />
            <FieldError message={errors.originHub} />
          </div>

          {/* 2. DESTINATION HUB */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Destination Hub</FieldLabel>
            <Dropdown
              value={form.destinationHub}
              onChange={(val) => {
                if (val === "OTHER") {
                  setIsDestCityModalOpen(true);
                  return;
                }
                updateField("destinationHub", val);
              }}
              placeholder="SELECT..."
              options={finalDestHubOptions}
            />
          </div>

          {/* 3. LINE HAUL VENDOR */}
          {/* <div className="flex flex-col gap-1">
            <FieldLabel>Line Haul Vendor</FieldLabel>
            <input
              value={form.lineHaulVendor}
              onChange={(e) => updateField("lineHaulVendor", e.target.value)}
              className={inputClass}
              placeholder="Line Haul Vendor"
            />
          </div> */}

          {/* 4. ARRIVAL DATE */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Arrival Date</FieldLabel>
            <CustomDatePicker
              value={form.arrivalDate}
              onChange={(val) => updateField("arrivalDate", val)}
              placeholder="Select arrival date"
            />
          </div>

          {/* 5. ARRIVAL TIME */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Arrival Time</FieldLabel>
            <CustomTimePicker
              value={form.arrivalTime}
              onChange={(val) => updateField("arrivalTime", val)}
              placeholder="Select arrival time"
            />
          </div>


        </div>

        {/* 7. EDI EXCEL FILE (Full Width) */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <FieldLabel>EDI Excel File</FieldLabel>
            <span className="text-[10px] text-axc-red font-bold uppercase">
              (Upload excel file only)
            </span>
          </div>
          <FileUploadField
            acceptedMimeTypes={[
              "application/vnd.ms-excel",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "text/csv",
            ]}
            acceptedExtensions={[".xls", ".xlsx", ".csv"]}
            acceptedLabel="XLS, XLSX and CSV formats, up to 10MB"
          />
        </div>

        {/* 8. MAWB IMAGE (Full Width) */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-1">
          <FieldLabel>MAWB Image</FieldLabel>
          <FileUploadField
            multiple
            acceptedMimeTypes={["image/jpeg", "image/png", "application/pdf", "image/svg+xml"]}
            acceptedLabel="JPEG, PNG, PDF and SVG formats, up to 10MB"
          />
        </div>

        {/* COMMENT (Full Width) */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-1">
          <FieldLabel>Comment</FieldLabel>
          <textarea
            rows={6}
            value={form.comment}
            onChange={(e) => updateField("comment", e.target.value)}
            className={`${inputClass} w-full text-xs outline-none resize-none`}
            placeholder="Comment here"
          />
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3 px-6 pb-5 pt-2">
        <button
          type="button"
          onClick={handleSearchAwb}
          className="bg-axc-navy text-white text-regular-small px-5 py-4 rounded-lg cursor-pointer transition  "
        >
          Search AWB
        </button>
        <button
          type="button"
          onClick={handleBagging}
          className="bg-axc-navy text-white text-regular-small px-5 py-4 rounded-lg cursor-pointer transition "
        >
          Bagging
        </button>
      </div>

      {isCityModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[480px]  flex flex-col">
            <h3 className="text-xl font-semibold text-axc-navy mb-6">Add Origin Hub</h3>
            <input
              type="text"
              className={`${inputClass} py-3`}
              placeholder="Enter city name..."
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-auto pt-6">
              <button
                type="button"
                onClick={() => setIsCityModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCity}
                className="px-5 py-2.5 text-sm font-medium text-white bg-axc-navy rounded-md hover:bg-axc-navy/90 transition cursor-pointer"
              >
                Add City
              </button>
            </div>
          </div>
        </div>
      )}

      {isDestCityModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[480px] flex flex-col">
            <h3 className="text-xl font-semibold text-axc-navy mb-6">Add Destination Hub</h3>
            <input
              type="text"
              className={`${inputClass} py-3`}
              placeholder="Enter city name..."
              value={newDestCityName}
              onChange={(e) => setNewDestCityName(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-auto pt-6">
              <button
                type="button"
                onClick={() => setIsDestCityModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddDestCity}
                className="px-5 py-2.5 text-sm font-medium text-white bg-axc-navy rounded-md hover:bg-axc-navy/90 transition cursor-pointer"
              >
                Add Destination
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}