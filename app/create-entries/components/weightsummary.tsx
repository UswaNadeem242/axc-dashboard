"use client";
import React from "react";
import { AwbFormState } from "./formstate";

const inputClass =
  "border border-gray-300 rounded-md px-3 py-2.5 outline-none w-full text-[13px] text-gray-700 placeholder:text-gray-400 focus:border-gray-400 transition";

function PanelHeader({ title }: { title: string }) {
  return (
    <div className="bg-axc-navy text-white text-[13px] font-semibold px-4 py-2.5">
      {title}
    </div>
  );
}

export function AwbWeightSummary({ form }: { form: AwbFormState }) {
  const rows: { label: string; value: string }[] = [
    { label: "PCS", value: String(form.pcs) },
    { label: "ACTUAL WEIGHT", value: form.actualWeight },
    { label: "VOLUMETRIC WEIGHT", value: form.volumetricWeight },
    { label: "CONSIGNER WEIGHT", value: form.consignerWeight },
    { label: "ADD WEIGHT", value: form.addWeight },
    { label: "CHARGEABLE WEIGHT", value: form.chargeableWeight },
  ];
  return (
    <div className="rounded-2xl border border-axc-border bg-white shadow-sm overflow-hidden">
      <PanelHeader title="WEIGHT SUMMARY" />
      <div className="p-4 space-y-3">
        {rows.map((row) => (
          <div key={row.label}>
            <span className="block text-[11px] font-semibold text-gray-500 mb-1">{row.label}</span>
            <input value={row.value} readOnly className={`${inputClass} h-9 text-[12px] bg-gray-50`} />
          </div>
        ))}
      </div>
    </div>
  );
}