"use client";
import React from "react";
import {
  EditIconButton,
  FieldLabel,
  PanelHeader,
  inputClass,
  disabledInputClass,
} from "./formfield";
import { ManifestFormState } from "./state";

type ManifestSummaryFields = Pick<
  ManifestFormState,
  | "manifestNo"
  | "date"
  | "time"
  | "arrivalDate"
  | "arrivalTime"
  | "noOfBags"
  | "editNoOfBags"
  | "totalActualWt"
  | "totalVolumetricWt"
  | "totalChargeableWt"
>;

interface ManifestSummaryProps {
  form: ManifestSummaryFields;
  updateField: (field: keyof ManifestFormState, value: string) => void;
  toggleEdit: (field: keyof ManifestFormState) => void;
}

export default function ManifestSummary({ form, updateField, toggleEdit }: ManifestSummaryProps) {
  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col">
      <PanelHeader title="Manifest Summary" />
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3 text-xs">
        <div className="flex flex-col gap-1">
          <FieldLabel>Manifest No.</FieldLabel>
          <input disabled value={form.manifestNo} className={disabledInputClass} placeholder="Auto-generated" />

        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Date</FieldLabel>
          <input
            type="date"
            value={form.date}
            onChange={(e) => updateField("date", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Time</FieldLabel>
          <input
            type="time"
            value={form.time}
            onChange={(e) => updateField("time", e.target.value)}
            className={inputClass}
            placeholder="Time"
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Arrival Date</FieldLabel>
          <input
            type="date"
            value={form.arrivalDate}
            onChange={(e) => updateField("arrivalDate", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Arrival Time</FieldLabel>
          <input
            type="time"
            value={form.arrivalTime}
            onChange={(e) => updateField("arrivalTime", e.target.value)}
            className={inputClass}
            placeholder="Arrival time"
          />
        </div>

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
              <EditIconButton active={form.editNoOfBags} onToggle={() => toggleEdit("editNoOfBags")} title="Edit No. of Bags" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Total Actual Wt</FieldLabel>
          <input disabled value={form.totalActualWt} className={disabledInputClass} placeholder="Toatla Actual Wt" />
          
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Total Volumetric Wt</FieldLabel>
          <input disabled value={form.totalVolumetricWt} className={disabledInputClass} placeholder="Total Volumetric Wt"/>
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Total Chargeable Wt</FieldLabel>
          <input disabled value={form.totalChargeableWt} className={disabledInputClass} placeholder="Total Chargeable Wt" />
        </div>
      </div>
    </div>
  );
}