"use client";
import React from "react";
import CommonTable from "../../../src/common/table";
import { ManifestChargeRow } from "./state";

interface ManifestBillingProps {
  charges: ManifestChargeRow[];
  addCharge: () => void;
  updateCharge: <K extends keyof ManifestChargeRow>(
    id: number,
    key: K,
    value: ManifestChargeRow[K]
  ) => void;
  removeCharge: (id: number) => void;
}

const inputClass =
  "w-full h-8 px-2 rounded-md border border-axc-border text-xs text-axc-dark-gray focus:outline-none focus:ring-1 focus:ring-axc-navy";

export default function ManifestBilling({
  charges,
  addCharge,
  updateCharge,
  removeCharge,
}: ManifestBillingProps) {
  const textCell = (row: ManifestChargeRow, field: keyof ManifestChargeRow) => (
    <input
      className={inputClass}
      value={row[field]}
      onChange={(e) => updateCharge(row.id, field, e.target.value)}
    />
  );

  const headings = [
    { label: "Type", key: "type", truncate: false, render: (row: ManifestChargeRow) => textCell(row, "type") },
    { label: "Co-Loader", key: "coLoader", truncate: false, render: (row: ManifestChargeRow) => textCell(row, "coLoader") },
    { label: "Vendor", key: "vendor", truncate: false, render: (row: ManifestChargeRow) => textCell(row, "vendor") },
    { label: "Company", key: "company", truncate: false, render: (row: ManifestChargeRow) => textCell(row, "company") },
    { label: "Charge", key: "charge", truncate: false, render: (row: ManifestChargeRow) => textCell(row, "charge") },
    { label: "Amount", key: "amount", truncate: false, render: (row: ManifestChargeRow) => textCell(row, "amount") },
    { label: "Remark", key: "remark", truncate: false, render: (row: ManifestChargeRow) => textCell(row, "remark") },
    {
      label: "Action",
      key: "action",
      render: (row: ManifestChargeRow) => (
        <button
          type="button"
          onClick={() => removeCharge(row.id)}
          className="text-axc-red text-[11px] font-bold hover:underline"
        >
          ✕ REMOVE
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full pb-2">
      <CommonTable
        headings={headings}
        data={charges}
        rowKey="id"
        itemsPerPage={10}
        emptyMessage="No charges added"
      />

      <button
        type="button"
        onClick={addCharge}
        className="self-start flex items-center gap-1.5 px-4 py-2 bg-axc-dark-green hover:opacity-90 text-white rounded-md text-xs font-bold transition"
      >
        + ADD CHARGE
      </button>
    </div>
  );
}