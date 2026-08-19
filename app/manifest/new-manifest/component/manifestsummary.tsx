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
    <div className="bg-white border border-axc-border rounded-[8px] overflow-hidden shadow-sm w-full">
      <PanelHeader title="MANIFEST SUMMARY" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-x-6 gap-y-4 p-5">
        <div>
          <FieldLabel>MANIFEST NO.</FieldLabel>
          <input
            disabled
            value={form.manifestNo}
            className={`${disabledInputClass} mt-1`}
            placeholder="Auto-generated"
          />
        </div>

        <div>
          <FieldLabel>DATE</FieldLabel>
          <input
            type="date"
            value={form.date}
            onChange={(e) => updateField("date", e.target.value)}
            className={`${inputClass} mt-1`}
          />
        </div>

        <div>
          <FieldLabel>TIME</FieldLabel>
          <input
            type="time"
            value={form.time}
            onChange={(e) => updateField("time", e.target.value)}
            className={`${inputClass} mt-1`}
          />
        </div>

        <div>
          <FieldLabel>ARRIVAL DATE</FieldLabel>
          <input
            type="date"
            value={form.arrivalDate}
            onChange={(e) => updateField("arrivalDate", e.target.value)}
            className={`${inputClass} mt-1`}
          />
        </div>

        <div>
          <FieldLabel>ARRIVAL TIME</FieldLabel>
          <input
            type="time"
            value={form.arrivalTime}
            onChange={(e) => updateField("arrivalTime", e.target.value)}
            className={`${inputClass} mt-1`}
          />
        </div>

        <div>
          <FieldLabel>NO. OF BAGS</FieldLabel>
          <div className="flex gap-2 mt-1">
            <input
              disabled={!form.editNoOfBags}
              value={form.noOfBags}
              onChange={(e) => updateField("noOfBags", e.target.value)}
              className={form.editNoOfBags ? inputClass : disabledInputClass}
            />
            <EditIconButton active={form.editNoOfBags} onToggle={() => toggleEdit("editNoOfBags")} />
          </div>
        </div>

        <div>
          <FieldLabel>TOTAL ACTUAL WT</FieldLabel>
          <input disabled value={form.totalActualWt} className={`${disabledInputClass} mt-1`} />
        </div>
        <div>
          <FieldLabel>TOTAL VOLUMETRIC WT</FieldLabel>
          <input disabled value={form.totalVolumetricWt} className={`${disabledInputClass} mt-1`} />
        </div>
        <div>
          <FieldLabel>TOTAL CHARGEABLE WT</FieldLabel>
          <input disabled value={form.totalChargeableWt} className={`${disabledInputClass} mt-1`} />
        </div>
      </div>
    </div>
  );
}