"use client";

import React from "react";
import { Plus, X } from "lucide-react";
import {
  PanelHeader,
  inputClass,
  disabledInputClass,
} from "./formfield";
import { ManifestBagRow } from "./state";
import CommonTable from "../../../src/common/table";

interface BagDetailsProps {
  rows: ManifestBagRow[];

  updateRow: (
    id: number,
    field: keyof ManifestBagRow,
    value: any
  ) => void;

  addRow: () => void;

  removeRow: (id: number) => void;

  selectAll: () => void;
}

export default function BagDetails({
  rows,
  updateRow,
  addRow,
  removeRow,
  selectAll,
}: BagDetailsProps) {
  const headings = [
    {
      label: "",
      key: "selected",
      className: "w-8",
      render: (row: ManifestBagRow) => (
        <input
          type="checkbox"
          checked={row.selected}
          onChange={(e) => updateRow(row.id, "selected", e.target.checked)}
          className="accent-green-600"
        />
      ),
    },
    {
      label: "Bag No.",
      key: "bagNo",
      truncate: false,
      render: (row: ManifestBagRow) => (
        <input
          value={row.bagNo}
          onChange={(e) => updateRow(row.id, "bagNo", e.target.value)}
          className={`${inputClass} py-1.5`}
        />
      ),
    },
    {
      label: "EDI Bag No.",
      key: "ediBagNo",
      truncate: false,
      render: (row: ManifestBagRow) => (
        <input
          value={row.ediBagNo}
          onChange={(e) => updateRow(row.id, "ediBagNo", e.target.value)}
          className={`${inputClass} py-1.5`}
        />
      ),
    },
    {
      label: "Bag ID",
      key: "bagId",
      truncate: false,
      render: (row: ManifestBagRow) => (
        <input disabled value={row.bagId} className={`${disabledInputClass} py-1.5`} />
      ),
    },
    {
      label: "Track By",
      key: "trackBy",
      truncate: false,
      render: (row: ManifestBagRow) => (
        <select
          value={row.trackBy}
          onChange={(e) =>
            updateRow(row.id, "trackBy", e.target.value as ManifestBagRow["trackBy"])
          }
          className={`${inputClass} py-1.5`}
        >
          <option value="PARCEL NUMBER">PARCEL NUMBER</option>
          <option value="AWB NUMBER">AWB NUMBER</option>
        </select>
      ),
    },
    {
      label: "AWB No.",
      key: "awbNo",
      truncate: false,
      render: (row: ManifestBagRow) => (
        <input
          value={row.awbNo}
          onChange={(e) => updateRow(row.id, "awbNo", e.target.value)}
          className={`${inputClass} py-1.5`}
        />
      ),
    },
    {
      label: "Forwarder No.",
      key: "forwarderNo",
      truncate: false,
      render: (row: ManifestBagRow) => (
        <input
          value={row.forwarderNo}
          onChange={(e) => updateRow(row.id, "forwarderNo", e.target.value)}
          className={`${inputClass} py-1.5`}
        />
      ),
    },
    {
      label: "Booking Date",
      key: "bookingDate",
      truncate: false,
      render: (row: ManifestBagRow) => (
        <input disabled value={row.bookingDate} className={`${disabledInputClass} py-1.5`} />
      ),
    },
    {
      label: "Weight",
      key: "weight",
      truncate: false,
      render: (row: ManifestBagRow) => (
        <input disabled value={row.weight} className={`${disabledInputClass} py-1.5`} />
      ),
    },
    {
      label: "Pcs.",
      key: "pcs",
      truncate: false,
      render: (row: ManifestBagRow) => (
        <input disabled value={row.pcs} className={`${disabledInputClass} py-1.5`} />
      ),
    },
    {
      label: "Destn.",
      key: "destn",
      truncate: false,
      render: (row: ManifestBagRow) => (
        <input disabled value={row.destn} className={`${disabledInputClass} py-1.5`} />
      ),
    },
    {
      label: "Service",
      key: "service",
      truncate: false,
      render: (row: ManifestBagRow) => (
        <input disabled value={row.service} className={`${disabledInputClass} py-1.5`} />
      ),
    },
    {
      label: "Action",
      key: "action",
      render: (row: ManifestBagRow) => (
        <button
          type="button"
          onClick={() => removeRow(row.id)}
          className="h-6 w-6 rounded-full bg-axc-red text-white inline-flex items-center justify-center"
          title="Remove"
        >
          <X size={12} />
        </button>
      ),
    },
    {
      label: "Duty",
      key: "actionDuty",
      truncate: false,
      render: (row: ManifestBagRow) => (
        <input disabled value={row.actionDuty} className={`${disabledInputClass} py-1.5`} />
      ),
    },
  ];

  return (
    <div className="bg-white border border-axc-border rounded-[8px] overflow-hidden shadow-sm">
      <PanelHeader
        title="BAG DETAILS"
        right={
          <button
            type="button"
            onClick={selectAll}
            className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold px-3 py-1.5 rounded transition"
          >
            SELECT ALL
          </button>
        }
      />

      <div className="p-5">
        <CommonTable
          headings={headings}
          data={rows}
          rowKey="id"
          itemsPerPage={rows.length || 10}
          emptyMessage="No bags added"
        />

        <button
          type="button"
          onClick={addRow}
          className="mt-3 bg-axc-dark-green text-white text-[12px] font-semibold px-4 py-2 rounded inline-flex items-center gap-1 hover:brightness-110"
        >
          <Plus size={14} />
          ADD AWB
        </button>
      </div>
    </div>
  );
}