"use client";
import React from "react";
import { Trash2, Plus } from "lucide-react";
import CommonTable from "../../../src/common/table";
import Dropdown from "../../../src/common/dropdown";
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

const TYPE_OPTIONS = ["SALE", "PURCHASE"];
const CO_LOADER_OPTIONS = ["CO-LOADER 1", "CO-LOADER 2", "CO-LOADER 3"];
const VENDOR_OPTIONS = ["VENDOR 1", "VENDOR 2", "VENDOR 3"];
const COMPANY_OPTIONS = ["COMPANY 1", "COMPANY 2", "COMPANY 3"];
const CHARGE_OPTIONS = ["FREIGHT", "DOCUMENTATION", "CUSTOMS", "HANDLING", "INSURANCE", "OTHER"];

export default function ManifestBilling({
  charges,
  addCharge,
  updateCharge,
  removeCharge,
}: ManifestBillingProps) {
  const selectCell = (
    row: ManifestChargeRow,
    field: keyof ManifestChargeRow,
    options: string[],
    placeholder: string,
    minWidth = "min-w-[140px]"
  ) => {
    const formattedOptions = options.map((opt) => ({
      value: opt,
      label: opt,
    }));

    return (
      <div className={minWidth}>
        <Dropdown
          value={(row[field] as string) || ""}
          onChange={(val) => updateCharge(row.id, field, val)}
          options={formattedOptions}
          placeholder={placeholder}
          className="!py-1 !px-2 !text-xs !h-8"
        />
      </div>
    );
  };

  const textCell = (row: ManifestChargeRow, field: keyof ManifestChargeRow) => (
    <input
      className={inputClass}
      value={row[field]}
      onChange={(e) => updateCharge(row.id, field, e.target.value)}
    />
  );

  const textareaCell = (row: ManifestChargeRow, field: keyof ManifestChargeRow) => (
    <textarea
      className={`${inputClass} h-8 resize-y`}
      rows={1}
      value={row[field]}
      onChange={(e) => updateCharge(row.id, field, e.target.value)}
    />
  );

  const headings = [
    {
      label: "Type",
      key: "type",
      truncate: false,
      render: (row: ManifestChargeRow) =>
        selectCell(row, "type", TYPE_OPTIONS, "SELECT...", "min-w-[130px]"),
    },
    {
      label: "Co-Loader",
      key: "coLoader",
      truncate: false,
      render: (row: ManifestChargeRow) =>
        selectCell(row, "coLoader", CO_LOADER_OPTIONS, "SELECT CO-LOADER...", "min-w-[170px]"),
    },
    {
      label: "Vendor",
      key: "vendor",
      truncate: false,
      render: (row: ManifestChargeRow) =>
        selectCell(row, "vendor", VENDOR_OPTIONS, "SELECT VENDOR...", "min-w-[160px]"),
    },
    {
      label: "Company",
      key: "company",
      truncate: false,
      render: (row: ManifestChargeRow) =>
        selectCell(row, "company", COMPANY_OPTIONS, "SELECT...", "min-w-[140px]"),
    },
    {
      label: "Charge",
      key: "charge",
      truncate: false,
      render: (row: ManifestChargeRow) =>
        selectCell(row, "charge", CHARGE_OPTIONS, "SELECT...", "min-w-[140px]"),
    },
    { label: "Amount", key: "amount", truncate: false, render: (row: ManifestChargeRow) => textCell(row, "amount") },
    { label: "Remark", key: "remark", truncate: false, render: (row: ManifestChargeRow) => textareaCell(row, "remark") },
    {
      label: "Action",
      key: "action",
      render: (row: ManifestChargeRow) => (
        <button
          type="button"
          onClick={() => removeCharge(row.id)}
          className="text-axc-red hover:opacity-70 cursor-pointer"
          title="Remove"
        >
          <Trash2 size={16} />
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
        emptyMessage="No charges added"
        hidePagination
      />

      <button
        type="button"
        onClick={addCharge}
        className="self-end flex items-center gap-1.5 px-5 py-4 bg-axc-navy hover:opacity-90 text-white rounded-md text-regular-small transition cursor-pointer"
      >
        <Plus size={14} />
        ADD CHARGE
      </button>
    </div>
  );
}