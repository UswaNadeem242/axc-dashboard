"use client";

import React, { useState } from "react";
import { showToast } from "@/app/src/common/toast";
import { PanelHeader } from "@/app/create-entries/components/form";
import { ORIGIN_HUB_OPTIONS } from "../../types";

const ALL_HUBS = ORIGIN_HUB_OPTIONS.map((o) => o.value);

interface HubTabProps {
  selectedHubs?: string[];
  onChange?: (hubs: string[]) => void;
  onSave?: () => void;
  loading?: boolean;
}

export default function HubTab({
  selectedHubs: propHubs,
  onChange,
  onSave,
  loading = false,
}: HubTabProps = {}) {
  const [internalHubs, setInternalHubs] = useState<string[]>([]);
  const selectedHubs = propHubs !== undefined ? propHubs : internalHubs;

  const allSelected = selectedHubs.length > 0 && selectedHubs.length === ALL_HUBS.length;

  const toggleSelectAll = () => {
    const next = allSelected ? [] : [...ALL_HUBS];
    if (onChange) onChange(next);
    else setInternalHubs(next);
  };

  const toggleHub = (hub: string) => {
    const next = selectedHubs.includes(hub)
      ? selectedHubs.filter((h) => h !== hub)
      : [...selectedHubs, hub];
    if (onChange) onChange(next);
    else setInternalHubs(next);
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      showToast({ variant: "success", message: "Hub selection saved successfully!" });
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full mt-4 pb-6">
      {/* Hub Card with Top Panel Header */}
      <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col">
        <PanelHeader title="Hub information" />

        {/* Hub table */}
        <div className="overflow-x-auto">
          <table className="w-full text-regular-small">
            <tbody>
              {/* SELECT ALL row */}
              <tr className="border-b border-axc-border bg-gray-50/70">
                <td className="px-4 py-3 font-semibold text-axc-dark-gray uppercase tracking-wide text-xs">
                  SELECT ALL
                </td>
                <td className="px-4 py-3 text-right w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-axc-navy cursor-pointer"
                  />
                </td>
              </tr>

              {/* Individual hub rows */}
              {ALL_HUBS.map((hub, idx) => (
                <tr
                  key={hub}
                  className={`border-b border-axc-border last:border-b-0 transition-colors ${
                    idx % 2 === 0 ? "bg-white hover:bg-gray-50/50" : "bg-gray-50/40 hover:bg-gray-50/80"
                  }`}
                >
                  <td className="px-4 py-2.5 text-black text-regular-small">
                    {hub}
                  </td>
                  <td className="px-4 py-2.5 text-right w-12">
                    <input
                      type="checkbox"
                      checked={selectedHubs.includes(hub)}
                      onChange={() => toggleHub(hub)}
                      className="w-4 h-4 accent-axc-navy cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save button — bottom right */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm"

        >
          Save
        </button>
      </div>
    </div>
  );
}
