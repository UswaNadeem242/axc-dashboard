"use client";

import React from "react";
import { Plus, X } from "lucide-react";
import {
  PanelHeader,
  inputClass,
  disabledInputClass,
} from "./formfield";
import { ManifestBagRow } from "./state";

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

      <div className="p-5 overflow-x-auto">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="w-8"></th>
              <th className="px-2 py-2 font-semibold">BAG NO.</th>
              <th className="px-2 py-2 font-semibold">EDI BAG NO.</th>
              <th className="px-2 py-2 font-semibold">BAG ID</th>
              <th className="px-2 py-2 font-semibold">TRACK BY</th>
              <th className="px-2 py-2 font-semibold">AWB NO.</th>
              <th className="px-2 py-2 font-semibold">FORWARDER NO.</th>
              <th className="px-2 py-2 font-semibold">BOOKING DATE</th>
              <th className="px-2 py-2 font-semibold">WEIGHT</th>
              <th className="px-2 py-2 font-semibold">PCS.</th>
              <th className="px-2 py-2 font-semibold">DESTN.</th>
              <th className="px-2 py-2 font-semibold">SERVICE</th>
              <th className="px-2 py-2 font-semibold">ACTION</th>
              <th className="px-2 py-2 font-semibold">DUTY</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row: ManifestBagRow) => (
              <tr
                key={row.id}
                className="border-t border-gray-100"
              >
                <td className="px-2 py-1.5 text-center">
                  <input
                    type="checkbox"
                    checked={row.selected}
                    onChange={(e) =>
                      updateRow(
                        row.id,
                        "selected",
                        e.target.checked
                      )
                    }
                    className="accent-green-600"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    value={row.bagNo}
                    onChange={(e) =>
                      updateRow(
                        row.id,
                        "bagNo",
                        e.target.value
                      )
                    }
                    className={`${inputClass} py-1.5`}
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    value={row.ediBagNo}
                    onChange={(e) =>
                      updateRow(
                        row.id,
                        "ediBagNo",
                        e.target.value
                      )
                    }
                    className={`${inputClass} py-1.5`}
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    disabled
                    value={row.bagId}
                    className={`${disabledInputClass} py-1.5`}
                  />
                </td>
                <td className="px-2 py-1.5">
                  <select
                    value={row.trackBy}
                    onChange={(e) =>
                      updateRow(
                        row.id,
                        "trackBy",
                        e.target.value as ManifestBagRow["trackBy"]
                      )
                    }
                    className={`${inputClass} py-1.5`}
                  >
                    <option value="PARCEL NUMBER">
                      PARCEL NUMBER
                    </option>

                    <option value="AWB NUMBER">
                      AWB NUMBER
                    </option>
                  </select>
                </td>
                <td className="px-2 py-1.5">
                  <input
                    value={row.awbNo}
                    onChange={(e) =>
                      updateRow(
                        row.id,
                        "awbNo",
                        e.target.value
                      )
                    }
                    className={`${inputClass} py-1.5`}
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    value={row.forwarderNo}
                    onChange={(e) =>
                      updateRow(
                        row.id,
                        "forwarderNo",
                        e.target.value
                      )
                    }
                    className={`${inputClass} py-1.5`}
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    disabled
                    value={row.bookingDate}
                    className={`${disabledInputClass} py-1.5`}
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    disabled
                    value={row.weight}
                    className={`${disabledInputClass} py-1.5`}
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    disabled
                    value={row.pcs}
                    className={`${disabledInputClass} py-1.5`}
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    disabled
                    value={row.destn}
                    className={`${disabledInputClass} py-1.5`}
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    disabled
                    value={row.service}
                    className={`${disabledInputClass} py-1.5`}
                  />
                </td>
                <td className="px-2 py-1.5 text-center">
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="h-6 w-6 rounded-full bg-axc-red text-white inline-flex items-center justify-center"
                    title="Remove"
                  >
                    <X size={12} />
                  </button>
                </td>
                <td className="px-2 py-1.5">
                  <input
                    disabled
                    value={row.actionDuty}
                    className={`${disabledInputClass} py-1.5`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          onClick={addRow}
          className="mt-3 bg-axc-green text-white text-[12px] font-semibold px-4 py-2 rounded inline-flex items-center gap-1 hover:brightness-110"
        >
          <Plus size={14} />
          ADD AWB
        </button>
      </div>
    </div>
  );
}