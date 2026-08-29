"use client";
import React from "react";
import { PanelHeader, FieldLabel, FieldError, inputClass, errorInputClass } from "../formfield";
import type { useBaggingForm } from "./baggingstate";

type BaggingFormState = ReturnType<typeof useBaggingForm>;
type BaggingPanelProps = Omit<BaggingFormState, "awbDetails">;

function StatBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-axc-navy text-white text-center py-1.5 flex-1">
      <div className="text-regular-medium capitalize tracking-wide">{label}</div>
      <div className="text-regular-medium font-bold">{value}</div>
    </div>
  );
}

function TotalBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="  bg-axc-red rounded text-center py-1.5 flex-1">
      <div className="text-regular-small text-white capitalize tracking-wide">{label}</div>
      <div className="text-regular-medium font-bold text-white">{value}</div>
    </div>
  );
}

function TableCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mt-2">
      <div className="bg-axc-navy rounded-tl-lg rounded-tr-lg text-white text-sm font-bold px-3 py-2 tracking-wide">
        {title}
      </div>
      <div className="border border-axc-border border-t-0 overflow-x-auto">{children}</div>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export default function BaggingPanel({
  form,
  updateField,
  errors,
  validateRunNumber,
  bagRow,
  updateBagRow,
  weightBagRow,
  updateWeightBagRow,
  awbSummary,
  bagSummary,
  partialAwbRows,
  handleSaveBag,
  handleSaveWeightBag,
  totals,
}: BaggingPanelProps) {
  const onSaveBag = () => {
    if (!validateRunNumber()) return;
    handleSaveBag();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col overflow-hidden">
        <PanelHeader title="Bagging" />
        <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <FieldLabel required>Run Number</FieldLabel>
            <input
              type="text"
              value={form.runNumber}
              onChange={(e) => updateField("runNumber", e.target.value)}
              className={errors.runNumber ? errorInputClass : inputClass}
              placeholder="Run Number"
            />
            <FieldError message={errors.runNumber} />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.parcelWiseBagging}
              onChange={(e) => updateField("parcelWiseBagging", e.target.checked)}
              className="cursor-pointer"
            />
            <span className="text-regular-small text-axc-dark-gray font-medium">Parcel Wise Bagging</span>
          </label>

          <TableCard
            title="Bag Entry"
            action={
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onSaveBag}
                  className="px-5 py-3 bg-axc-navy text-white rounded-lg text-regular-small  capitalize cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={onSaveBag}
                  className="px-5 py-3 bg-axc-red text-white rounded-lg text-regular-small  capitalize cursor-pointer"
                >
                  Save &amp; Lock
                </button>
              </div>
            }
          >
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-axc-border text-regular-medium text-axc-dark-gray  text-left">
                  <th className="py-2 px-2 border-r border-axc-border">Bag No.</th>
                  <th className="py-2 px-2 border-r border-axc-border">AWB No.</th>
                  {!form.parcelWiseBagging && <th className="py-2 px-2 border-r border-axc-border">PCS</th>}
                  <th className="py-2 px-2">Weight</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-axc-border last:border-b-0 hover:bg-gray-50/50">
                  <td className="border-r border-axc-border p-1 align-top">
                    <input
                      type="text"
                      value={bagRow.bagNo}
                      onChange={(e) => updateBagRow("bagNo", e.target.value)}
                      className={inputClass}
                      placeholder="Bag no."
                    />
                  </td>
                  <td className="border-r border-axc-border p-1 align-top">
                    <input
                      type="text"
                      value={bagRow.awbNo}
                      onChange={(e) => updateBagRow("awbNo", e.target.value)}
                      className={inputClass}
                      placeholder="AWB No."
                    />
                  </td>
                  {!form.parcelWiseBagging && (
                    <td className="border-r border-axc-border p-1 align-top">
                      <select
                        value={bagRow.pcs}
                        onChange={(e) => updateBagRow("pcs", e.target.value)}
                        className={`${inputClass} text-center`}
                      >
                        <option value="">SELECT...</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                    </td>
                  )}
                  <td className="p-1 align-top">
                    <input
                      type="text"
                      value={bagRow.weight}
                      onChange={(e) => updateBagRow("weight", e.target.value)}
                      className={`${inputClass} text-center`}
                      
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </TableCard>

          <TableCard
            title="Weight Bagging"
            action={
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveWeightBag}
                  className="px-5 py-3 bg-axc-navy text-white rounded-lg text-regular-small capitalize cursor-pointer"
                >
                  Save
                </button>
              </div>
            }
          >
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-axc-border text-regular-medium text-axc-dark-gray text-left">
                  <th className="py-2 px-2 border-r border-axc-border">Bag No.</th>
                  <th className="py-2 px-2 border-r border-axc-border">Bag Weight</th>
                  <th className="py-2 px-2">Weight</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-axc-border last:border-b-0 hover:bg-gray-50/50">
                  <td className="border-r border-axc-border p-1">
                    <input
                      type="text"
                      value={weightBagRow.bagNo}
                      onChange={(e) => updateWeightBagRow("bagNo", e.target.value)}
                      className={inputClass}
                      placeholder="Bag No."
                    />
                  </td>
                  <td className="border-r border-axc-border p-1">
                    <input
                      type="text"
                      value={weightBagRow.bagWeight}
                      onChange={(e) => updateWeightBagRow("bagWeight", e.target.value)}
                      className={`${inputClass} text-center`}
                      
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="text"
                      value={weightBagRow.weight}
                      onChange={(e) => updateWeightBagRow("weight", e.target.value)}
                      className={`${inputClass} text-center`}
                      
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </TableCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3 mt-2 text-xs">
            <div className="flex flex-col gap-1">
              <FieldLabel>Flight No</FieldLabel>
              <input
                type="text"
                value={form.flightNo}
                onChange={(e) => updateField("flightNo", e.target.value)}
                className={inputClass}
                placeholder="Flight No."
              />
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel>Manifest Date</FieldLabel>
              <input
                type="date"
                value={form.manifestDate}
                onChange={(e) => updateField("manifestDate", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel>Origin</FieldLabel>
              <input
                type="text"
                value={form.origin}
                onChange={(e) => updateField("origin", e.target.value)}
                className={inputClass}
                placeholder="Origin"
              />
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel>Destination</FieldLabel>
              <input
                type="text"
                value={form.destination}
                onChange={(e) => updateField("destination", e.target.value)}
                className={inputClass}
                placeholder="Destination"
              />
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel>Forwarder</FieldLabel>
              <input
                type="text"
                value={form.forwarder}
                onChange={(e) => updateField("forwarder", e.target.value)}
                className={inputClass}
                placeholder="Forwarder"
              />
            </div>
            <div className="flex flex-col gap-1">
              <FieldLabel>Master No</FieldLabel>
              <input
                type="text"
                value={form.masterNo}
                onChange={(e) => updateField("masterNo", e.target.value)}
                className={inputClass}
                placeholder="Master No."
              />
            </div>
          </div>

          <div className="flex gap-2 mt-1">
            <TotalBox label="Total Bag" value={totals.totalBag} />
            <TotalBox label="Total AWB" value={totals.totalAwb} />
            <TotalBox label="Total PCS" value={totals.totalPcs} />
            <TotalBox label="Total Weight" value={totals.totalWeight} />
            <TotalBox label="Total Bag Weight" value={totals.totalBagWeight} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden">
        <div className="flex">
          <StatBox label="Bag No." value={totals.totalBag} />
          <StatBox label="Total AWB" value={totals.totalAwb} />
          <StatBox label="Total PCS" value={totals.totalPcs} />
          <StatBox label="Total Weight" value={totals.totalWeight} />
        </div>
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-t border-axc-border text-regular-medium text-axc-dark-gray text-left">
              <th className="py-2 px-2 border-r border-axc-border">AWB No.</th>
              <th className="py-2 px-2 border-r border-axc-border">PCS</th>
              <th className="py-2 px-2">Weight</th>
            </tr>
          </thead>
          <tbody>
            {awbSummary.map((row) => (
              <tr key={row.id} className="border-b border-axc-border hover:bg-gray-50/50">
                <td className="py-2 px-2 border-r border-axc-border">{row.awbNo}</td>
                <td className="py-2 px-2 border-r border-axc-border">{row.pcs}</td>
                <td className="py-2 px-2">{row.weight}</td>
              </tr>
            ))}
            {awbSummary.length === 0 && (
              <tr>
                <td colSpan={3} className="py-4 px-2 text-center text-gray-400">
                  No AWB added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-axc-border text-regular-medium text-axc-dark-gray text-left">
              <th className="py-2 px-2 border-r border-axc-border">Bag No.</th>
              <th className="py-2 px-2 border-r border-axc-border">Total PCS</th>
              <th className="py-2 px-2 border-r border-axc-border">Total Weight</th>
              <th className="py-2 px-2">Bag Weight</th>
            </tr>
          </thead>
          <tbody>
            {bagSummary.map((row) => (
              <tr key={row.id} className="border-b border-axc-border hover:bg-gray-50/50">
                <td className="py-2 px-2 border-r border-axc-border">{row.bagNo}</td>
                <td className="py-2  px-2 border-r border-axc-border">{row.totalPcs}</td>
                <td className="py-2 px-2 border-r border-axc-border">{row.totalWeight}</td>
                <td className="py-2 px-2">{row.bagWeight}</td>
              </tr>
            ))}
            {bagSummary.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 px-2 text-center text-gray-400">
                  No bags added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden">
        <PanelHeader title="Partial Manifested AWB" />
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-axc-border text-regular-medium text-axc-dark-gray text-left">
              <th className="py-2 px-2 border-r border-axc-border">AWB Number</th>
              <th className="py-2 px-2 border-r border-axc-border">Split AWB</th>
              <th className="py-2 px-2 border-r border-axc-border">PC Number</th>
              <th className="py-2 px-2">Box Weight</th>
            </tr>
          </thead>
          <tbody>
            {partialAwbRows.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">
                  No records
                </td>
              </tr>
            )}
            {partialAwbRows.map((row) => (
              <tr key={row.id} className="border-b border-axc-border hover:bg-gray-50/50">
                <td className="py-2 px-2 border-r border-axc-border">{row.awbNumber}</td>
                <td className="py-2 px-2 border-r border-axc-border">{row.splitAwb}</td>
                <td className="py-2 px-2 border-r border-axc-border">{row.pcNumber}</td>
                <td className="py-2 px-2">{row.boxWeight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}