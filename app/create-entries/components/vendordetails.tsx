"use client";
import React from "react";
import { VendorDetailsFormState, VendorWeightRow } from "./formstate";
import { Plus, Trash } from "lucide-react";

const inputClass =
  "border border-axc-border rounded-md px-3 py-2.5 outline-none w-full text-regular-small placeholder:text-regular-small text-axc-gray placeholder:text-axc-gray";

function PanelHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="bg-axc-navy text-white p-4  rounded-tl-lg  rounded-tr-lg flex items-center justify-between gap-2">
      <h3> {title}</h3>
      {right}
    </div>
  );
}

function Field({
  label, value, editable = true, onChange, placeholder,
}: { label: string; value: string; editable?: boolean; onChange?: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-regular-medium  text-axc-dark-gray   w-[150px] shrink-0">{label}</span>
      <input
        placeholder={placeholder}
        value={value}
        disabled={!editable}
        onChange={(e) => onChange?.(e.target.value)}
        className={`${inputClass} h-9 text-[12px] ${!editable ? "bg-gray-50" : ""}`}
      />
    </div>
  );
}

const gridClass = "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3";

export function VendorDetailsPanel({
  vendorDetails, onChange, onWeightRowChange, onAddWeightRow, onRemoveWeightRow,
}: {
  vendorDetails: VendorDetailsFormState;
  onChange: (patch: Partial<VendorDetailsFormState>) => void;
  onWeightRowChange: (id: string, field: keyof Omit<VendorWeightRow, "id">, val: string) => void;
  onAddWeightRow: () => void;
  onRemoveWeightRow: (id: string) => void;
}) {
  const editable = vendorDetails.editVendorDetails;

  const totalActualWt = vendorDetails.weightRows.reduce((acc, r) => acc + Number(r.actualWeight || 0), 0);
  const totalChargeableWt = vendorDetails.weightRows.reduce((acc, r) => acc + Number(r.chargeableWeight || 0), 0);

  return (
    <div className="rounded-lg border border-axc-border bg-white shadow-sm overflow-hidden">
      <PanelHeader
        title="Vendor Details"
        right={
          <label className="flex items-center gap-1.5 text-sm  font-semibold text-white">
            <input
              type="checkbox"
              checked={vendorDetails.editVendorDetails}
              onChange={(e) => onChange({ editVendorDetails: e.target.checked })}
              className="h-3.5 w-3.5 accent-white"
            />
            EDIT VENDOR DETAILS
          </label>
        }
      />

      <div className="p-4 space-y-3">
        <div className={gridClass}>
          <Field label="Product" value={vendorDetails.product} editable={editable} onChange={(v) => onChange({ product: v })} placeholder="Product" />
          <Field label="Service" value={vendorDetails.service} editable={editable} onChange={(v) => onChange({ service: v })} placeholder="Service" />
          <Field label="Vendor" value={vendorDetails.vendor} editable={editable} onChange={(v) => onChange({ vendor: v })} placeholder="Vendor" />
          <Field label="Origin Zone" value={vendorDetails.originZone} editable={editable} onChange={(v) => onChange({ originZone: v })} placeholder="Origin Zone" />
          <Field label="Destination Zone" value={vendorDetails.destinationZone} editable={editable} onChange={(v) => onChange({ destinationZone: v })} placeholder="Destination Zone" />
          <Field label="PCS" value={vendorDetails.pcs} editable={editable} onChange={(v) => onChange({ pcs: v })} placeholder="PCS" />
        </div>

        {/* Weight table — styled like Shipment Invoice Items */}
        <div className="mt-2">
          {/* <div className="bg-axc-navy text-white text-regular-medium rounded-tl-lg rounded-tr-lg  p-3 capitalize tracking-wide">
            Vendor Weight Details
          </div> */}
          <div className="border border-axc-border border-t-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-xs border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-gray-50 border-b border-axc-border text-regular-medium  text-axc-dark-gray font-bold uppercase text-left">
                  <th className="py-2 px-2 border-r border-axc-border font-semibold">Actual Wt.(Kg.)</th>
                  <th className="py-2 px-2 border-r border-axc-border font-semibold">L(cm)</th>
                  <th className="py-2 px-2 border-r border-axc-border font-semibold">B(cm)</th>
                  <th className="py-2 px-2 border-r border-axc-border font-semibold">H(cm)</th>
                  <th className="py-2 px-2 border-r border-axc-border font-semibold">Volumetric Wt.(Kg.)</th>
                  <th className="py-2 px-2 border-r border-axc-border font-semibold">Chargeable Wt.(Kg.)</th>
                  <th className="py-2 px-2 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {vendorDetails.weightRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-4 px-3 text-center text-gray-400 text-regular-semibold">
                      No weight rows added yet.
                    </td>
                  </tr>
                )}
                {vendorDetails.weightRows.map((row) => (
                  <tr key={row.id} className="border-b border-axc-border last:border-b-0 hover:bg-gray-50/50">
                    {(["actualWeight", "length", "breadth", "height", "volumetricWeight", "chargeableWeight"] as const).map((field) => (
                      <td key={field} className="border-r border-axc-border p-1">
                        <input
                          value={row[field]}
                          onChange={(e) => onWeightRowChange(row.id, field, e.target.value)}
                          className="w-full bg-white border border-axc-border rounded px-1.5 py-1 text-center focus:outline-none"
                        />
                      </td>
                    ))}
                    <td className="p-1 text-center">
                      <button
                        type="button"
                        onClick={() => onRemoveWeightRow(row.id)}
                        className="cursor-pointer inline-flex items-center justify-center rounded-md border border-axc-red-dark/30 p-1.5 text-axc-red-dark transition hover:bg-axc-red-dark/10"
                      >
                        <Trash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {vendorDetails.weightRows.length > 0 && (
                  <tr className="bg-gray-50/50 border-t border-axc-border">
                    <td className="py-2 px-2 border-r border-axc-border"></td>
                    <td colSpan={3} className="py-2 px-2 border-r border-axc-border text-right font-bold text-gray-700">
                      <div className="flex items-center justify-end gap-2 text-regular-medium text-black">
                        <span> Total Actual WT</span>
                        <input type="text" readOnly value={totalActualWt} className="w-20 border border-axc-border bg-gray-100 rounded px-1.5 py-0.5 text-center text-gray-600" />
                      </div>
                    </td>
                    <td colSpan={2} className="py-2 px-2 border-r border-axc-border text-right font-bold text-gray-700">
                      <div className="flex items-center justify-end gap-2 text-regular-medium text-black">
                        <span>Total Chargeable WT</span>
                        <input type="text" readOnly value={totalChargeableWt} className="w-20 border border-axc-border bg-gray-100 rounded px-1.5 py-0.5 text-center font-bold text-gray-600" />
                      </div>
                    </td>
                    <td className="py-2 px-3"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-3">
            <button
              type="button"
              onClick={onAddWeightRow}
              className="px-3 py-2 bg-axc-dark-yellow flex items-center justify-center gap-2 text-white rounded text-sm font-semibold shadow-sm transition uppercase cursor-pointer"
            >
              <Plus size={14} />
              ADD ROW
            </button>
          </div>
        </div>

        <Field label="Actual Weight" value={vendorDetails.actualWeight} editable={editable} onChange={(v) => onChange({ actualWeight: v })} placeholder="Actual Weight" />

        <div className={gridClass}>
          <div className="flex items-center gap-3">
            <span className="text-regular-medium text-axc-dark-gray w-[150px] shrink-0">CFT ID</span>
            <input
              placeholder="CFT ID"
              value={vendorDetails.cftId}
              disabled={!editable}
              onChange={(e) => onChange({ cftId: e.target.value })}
              className={`${inputClass} h-9 text-[12px] ${!editable ? "bg-gray-50" : ""}`}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-regular-medium text-axc-dark-gray w-[150px] shrink-0">CFT VALUE</span>
            <input
              placeholder="CFT VALUE"
              value={vendorDetails.cftValue}
              disabled={!editable}
              onChange={(e) => onChange({ cftValue: e.target.value })}
              className={`${inputClass} h-9 text-[12px] ${!editable ? "bg-gray-50" : ""}`}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-regular-medium text-axc-dark-gray w-[150px] shrink-0">Contact ID</span>
            <input
              placeholder="Contact ID"
              value={vendorDetails.vendorContractId}
              disabled={!editable}
              onChange={(e) => onChange({ vendorContractId: e.target.value })}
              className={`${inputClass} h-9 text-[12px] ${!editable ? "bg-gray-50" : ""}`}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-regular-medium text-axc-dark-gray w-[150px] shrink-0">TAT</span>
            <input
              placeholder="TAT"
              value={vendorDetails.tat}
              disabled={!editable}
              onChange={(e) => onChange({ tat: e.target.value })}
              className={`${inputClass} h-9 text-[12px] ${!editable ? "bg-gray-50" : ""}`}
            />
          </div>
          <Field label="Volum Weight" value={vendorDetails.volumeWeight} editable={editable} onChange={(v) => onChange({ volumeWeight: v })} placeholder="Volum Weight" />
          <div className="flex items-center gap-3">
            <span className="text-regular-medium text-axc-dark-gray w-[150px] shrink-0 ">Chargerable Weight</span>
            <input value={vendorDetails.chargeableWeight} readOnly className={`${inputClass} h-9 text-[12px] bg-gray-50 font-semibold`} placeholder="Chargerable Weight" />
          </div>
        </div>
      </div>
    </div>
  );
}