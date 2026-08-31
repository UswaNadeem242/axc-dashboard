"use client";

import React from "react";
import { Plus, Trash } from "lucide-react";
import { PanelHeader, inputClass, disabledInputClass } from "./formfield";
import { ManifestBagRow } from "./state";
import Dropdown from "@/app/src/common/dropdown";

const TRACK_BY_OPTIONS = [
  { value: "PARCEL NUMBER", label: "Parcel Number" },
  { value: "AWB NUMBER", label: "AWB Number" },
];

interface BagDetailsProps {
  rows: ManifestBagRow[];
  updateRow: (id: number, field: keyof ManifestBagRow, value: any) => void;
  addRow: () => void;
  removeRow: (id: number) => void;
  selectAll: () => void;
}

export default function BagDetails({ rows, updateRow, addRow, removeRow, selectAll }: BagDetailsProps) {
  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-visible flex flex-col">
      <PanelHeader
        title="Bag Details"
        right={
          <button
            type="button"
            onClick={selectAll}
            className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-3 py-1.5 rounded transition cursor-pointer capitalize tracking-wide"
          >
            Select All
          </button>
        }
      />

      <div className="flex flex-col gap-3 p-4 text-xs">
        <div className="border border-axc-border rounded-lg overflow-x-auto">
          <table className="w-full text-[11px] border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-axc-navy/10 border-b border-axc-border text-regular-medium text-axc-dark-gray capitalize text-left">
                <th className="py-2 px-2  border-axc-border w-8"></th>
                <th className="py-2 px-2  border-axc-border">Bag No.</th>
                <th className="py-2 px-2  border-axc-border">EDI Bag No.</th>
                <th className="py-2 px-2  border-axc-border">Bag ID</th>
                <th className="py-2 px-2  border-axc-border">Track By</th>
                <th className="py-2 px-2  border-axc-border">AWB No.</th>
                <th className="py-2 px-2  border-axc-border">Forwarder No.</th>
                <th className="py-2 px-2  border-axc-border">Booking Date</th>
                <th className="py-2 px-2  border-axc-border">Weight</th>
                <th className="py-2 px-2  border-axc-border">Pcs.</th>
                <th className="py-2 px-2  border-axc-border">Destn.</th>
                <th className="py-2 px-2  border-axc-border">Service</th>
                <th className="py-2 px-2  border-axc-border">Duty</th>
                <th className="py-2 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={14} className="text-center py-6 text-gray-400">
                    No bags added
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-axc-border last:border-b-0 hover:bg-gray-50/50">
                  <td className="border-r border-axc-border p-1 text-center">
                    <input
                      type="checkbox"
                      checked={row.selected}
                      onChange={(e) => updateRow(row.id, "selected", e.target.checked)}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="border-r border-axc-border p-1">
                    <input
                      value={row.bagNo}
                      onChange={(e) => updateRow(row.id, "bagNo", e.target.value)}
                      className={`${inputClass} py-2 text-center`}
                    />
                  </td>
                  <td className="border-r border-axc-border p-1">
                    <input
                      value={row.ediBagNo}
                      onChange={(e) => updateRow(row.id, "ediBagNo", e.target.value)}
                      className={`${inputClass} py-2 text-center`}
                    />
                  </td>
                  <td className="border-r border-axc-border p-1">
                    <input disabled value={row.bagId} className={`${disabledInputClass} py-2 text-center`} />
                  </td>
                  <td className="border-r border-axc-border p-1 min-w-[140px]">
                    <Dropdown
                      value={row.trackBy}
                      onChange={(val) => updateRow(row.id, "trackBy", val as ManifestBagRow["trackBy"])}
                      options={TRACK_BY_OPTIONS}
                      className="!py-1 !px-2 !text-xs !h-8"
                    />
                  </td>
                  <td className="border-r border-axc-border p-1">
                    <input
                      value={row.awbNo}
                      onChange={(e) => updateRow(row.id, "awbNo", e.target.value)}
                      className={`${inputClass} py-2 text-center`}
                    />
                  </td>
                  <td className="border-r border-axc-border p-1">
                    <input
                      value={row.forwarderNo}
                      onChange={(e) => updateRow(row.id, "forwarderNo", e.target.value)}
                      className={`${inputClass} py-2 text-center`}
                    />
                  </td>
                  <td className="border-r border-axc-border p-1">
                    <input disabled value={row.bookingDate} className={`${disabledInputClass} py-2 text-center`} />
                  </td>
                  <td className="border-r border-axc-border p-1">
                    <input disabled value={row.weight} className={`${disabledInputClass} py-2 text-center`} />
                  </td>
                  <td className="border-r border-axc-border p-1">
                    <input disabled value={row.pcs} className={`${disabledInputClass} py-2 text-center`} />
                  </td>
                  <td className="border-r border-axc-border p-1">
                    <input disabled value={row.destn} className={`${disabledInputClass} py-2 text-center`} />
                  </td>
                  <td className="border-r border-axc-border p-1">
                    <input disabled value={row.service} className={`${disabledInputClass} py-2 text-center`} />
                  </td>
                  <td className="border-r border-axc-border p-1">
                    <input disabled value={row.actionDuty} className={`${disabledInputClass} py-2 text-center`} />
                  </td>
                  <td className="p-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      title="Remove"
                      className="inline-flex items-center justify-center cursor-pointer rounded-md border border-axc-red-dark/30  p-1.5 text-axc-red-dark transition hover:bg-axc-red-dark/10"
                    >
                      <Trash size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={addRow}
            className="px-5 py-3 bg-axc-navy text-white rounded-lg text-reular-small transition capitalize  cursor-pointer flex items-center gap-1.5"
          >
            <Plus size={15} />
            Add AWB
          </button>
        </div>
      </div>
    </div>
  );
}