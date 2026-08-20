"use client";
import React from "react";
import {
  EditIconButton,
  FieldError,
  FieldLabel,
  FileUploadField,
  PanelHeader,
  inputClass,
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
    <div className="bg-white border border-axc-border rounded-[8px] overflow-hidden shadow-sm w-full">
      <PanelHeader title="MANIFEST INFORMATION" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 p-5">
        <div>
          <FieldLabel>FORWARDER</FieldLabel>
          <div className="flex gap-2 mt-1">
            <input disabled className={`${disabledInputClass} w-1/3`} />
            <input
              disabled={!form.editForwarder}
              value={form.forwarder}
              onChange={(e) => updateField("forwarder", e.target.value)}
              className={form.editForwarder ? inputClass : disabledInputClass}
            />
            <EditIconButton active={form.editForwarder} onToggle={() => toggleEdit("editForwarder")} />
          </div>
        </div>

        <div>
          <FieldLabel>VENDOR</FieldLabel>
          <div className="flex gap-2 mt-1">
            <input disabled className={`${disabledInputClass} w-1/3`} />
            <input
              disabled={!form.editVendor}
              value={form.vendor}
              onChange={(e) => updateField("vendor", e.target.value)}
              className={form.editVendor ? inputClass : disabledInputClass}
            />
            <EditIconButton active={form.editVendor} onToggle={() => toggleEdit("editVendor")} />
          </div>
        </div>

        <div>
          <FieldLabel>LINE HAUL VENDOR</FieldLabel>
          <input
            value={form.lineHaulVendor}
            onChange={(e) => updateField("lineHaulVendor", e.target.value)}
            className={`${inputClass} mt-1`}
          />
        </div>

        <div>
          <FieldLabel>MASTER NO.</FieldLabel>
          <input
            value={form.masterNo}
            onChange={(e) => updateField("masterNo", e.target.value)}
            className={`${inputClass} mt-1`}
          />
        </div>

        <div>
          <FieldLabel>MASTER EDI BAG NO</FieldLabel>
          <input
            value={form.masterEdiBagNo}
            onChange={(e) => updateField("masterEdiBagNo", e.target.value)}
            className={`${inputClass} mt-1`}
          />
        </div>

        <div>
          <FieldLabel>RUN NUMBER</FieldLabel>
          <div className="flex gap-2 mt-1">
            <input
              disabled={!form.editRunNumber}
              placeholder="Alphabet-Number"
              value={form.runNumber}
              onChange={(e) => updateField("runNumber", e.target.value)}
              className={form.editRunNumber ? inputClass : disabledInputClass}
            />
            <EditIconButton active={form.editRunNumber} onToggle={() => toggleEdit("editRunNumber")} />
          </div>
        </div>

        <div>
          <FieldLabel>FLIGHT NO</FieldLabel>
          <div className="flex gap-2 mt-1">
            <select
              disabled={!form.editFlightNo}
              value={form.flightNo}
              onChange={(e) => updateField("flightNo", e.target.value)}
              className={form.editFlightNo ? inputClass : disabledInputClass}
            >
              <option value="">SELECT FLIGHT NO...</option>
              <option value="AI-101">AI-101</option>
              <option value="EK-501">EK-501</option>
            </select>
            <EditIconButton active={form.editFlightNo} onToggle={() => toggleEdit("editFlightNo")} />
          </div>
        </div>

        <div>
          <FieldLabel required>ORIGIN HUB</FieldLabel>
          <select
            value={form.originHub}
            onChange={(e) => updateField("originHub", e.target.value)}
            className={`${errors.originHub ? "border-red-400" : ""} ${inputClass} mt-1`}
          >
            <option value="">SELECT...</option>
            <option value="DEL">DELHI</option>
            <option value="BOM">MUMBAI</option>
          </select>
          <FieldError message={errors.originHub} />
        </div>

        <div>
          <FieldLabel>DESTINATION HUB</FieldLabel>
          <select
            value={form.destinationHub}
            onChange={(e) => updateField("destinationHub", e.target.value)}
            className={`${inputClass} mt-1`}
          >
            <option value="">SELECT...</option>
            <option value="JFK">NEW YORK</option>
            <option value="LAX">LOS ANGELES</option>
          </select>
        </div>

        <div>
          <FieldLabel>EDI EXCEL FILE</FieldLabel>
          <div className="mt-1">
            <FileUploadField />
          </div>
          <p className="text-[10px] text-axc-red font-semibold mt-1">(UPLOAD EXCEL FILE ONLY)</p>
        </div>

        <div>
          <FieldLabel>MAWB IMAGE</FieldLabel>
          <div className="mt-1">
            <FileUploadField multiple />
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-4">
          <FieldLabel>COMMENT</FieldLabel>
          <textarea
            rows={3}
            value={form.comment}
            onChange={(e) => updateField("comment", e.target.value)}
            className={`${inputClass} mt-1 resize-none`}
          />
        </div>
      </div>

      <div className="flex gap-3 px-5 pb-5">
        <button
          type="button"
          onClick={handleSearchAwb}
          className="bg-amber-800 text-white text-[12px] font-semibold px-4 py-2 rounded hover:brightness-110"
        >
          SEARCH AWB
        </button>
        <button
          type="button"
          onClick={handleBagging}
          className="bg-axc-green text-white text-[12px] font-semibold px-4 py-2 rounded hover:brightness-110"
        >
          BAGGING
        </button>
      </div>
    </div>
  );
}