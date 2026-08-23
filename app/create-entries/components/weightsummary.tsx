"use client";
import React from "react";
import { AwbFormState } from "./formstate";

const inputClass =
  "border border-axc-border rounded-md px-3 py-2.5 outline-none w-full text-[13px] text-gray-700 placeholder:text-gray-400  ouline-none  focus:outline-none transition";

import { PanelHeader } from "./form";

export function AwbWeightSummary({ form }: { form: AwbFormState }) {
  const rows: { label: string; value: string }[] = [
    { label: "PCS", value: String(form.pcs) },
    { label: "Actual weight", value: form.actualWeight },
    { label: "Volumetric weight", value: form.volumetricWeight },
    { label: "Consigner weight", value: form.consignerWeight },
    { label: "Add weight", value: form.addWeight },
    { label: "Chargeable weight", value: form.chargeableWeight },
  ];
  return (
    <div className="rounded-lg border border-axc-border bg-white shadow-sm overflow-hidden">
      <PanelHeader title="WEIGHT SUMMARY" />
      <div className="p-4 space-y-3">
        {rows.map((row) => (
          <div key={row.label}>
            <span className="block text-xs font-medium  capitalize text-axc-dark-gray mb-1">{row.label}</span>
            <input value={row.value} readOnly className={`${inputClass} h-9 text-[12px] bg-gray-50`} />
          </div>
        ))}
      </div>
    </div>
  );
}