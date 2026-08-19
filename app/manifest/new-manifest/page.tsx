"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, User, FileText, X, Plus } from "lucide-react";
import {
  EditIconButton,
  FieldError,
  FieldLabel,
  FileUploadField,
  PanelHeader,
  inputClass,
  disabledInputClass,
} from "./component/formfield";
import { useManifestForm } from "./component/manifestform";
import { ManifestBagRow } from "./component/state";

type TabItem = { id: "entry" | "billing"; label: string; icon: React.ReactNode };

const tabs: TabItem[] = [
  { id: "entry", label: "Entry", icon: <User size={14} /> },
  { id: "billing", label: "Billing", icon: <FileText size={14} /> },
];

export default function ManifestPage() {
  const {
    form,
    updateField,
    toggleEdit,
    errors,
    tab,
    setTab,
    rows,
    updateRow,
    addRow,
    removeRow,
    selectAll,
    loading,
    toast,
    handleCreateManifest,
    handleSearchAwb,
    handleBagging,
  } = useManifestForm();

  return (
    <div className="flex flex-col gap-6 py-2">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 rounded-lg px-4 py-3 text-xs font-bold shadow-lg text-white animate-in fade-in slide-in-from-top-2 duration-200 ${
            toast.type === "success" ? "bg-[#0b733a]" : "bg-axc-navy"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/manifest/all-manifest"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-axc-border text-gray-600 hover:bg-gray-50 transition shadow-sm"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-axc-navy">Manifest Detail</h2>
            <p className="text-xs text-axc-gray font-medium">Create and manage manifest entries</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCreateManifest}
          disabled={loading}
          className="px-5 py-2 bg-axc-navy hover:bg-axc-navy/80 text-white rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-60"
        >
          {loading ? "CREATING…" : "CREATE MANIFEST"}
        </button>
      </div>

      <div className="sticky top-0 z-20 bg-white border border-axc-border rounded-[8px] px-5 pb-0 shadow-sm">
        <div className="flex gap-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative shrink-0 flex items-center gap-1.5 px-4 py-4 text-[16px] font-extrabold whitespace-nowrap transition-colors duration-150 ${
                tab === t.id ? "text-axc-dark-gray" : "text-gray-400 hover:text-axc-dark-gray"
              }`}
            >
              {t.icon}
              {t.label}
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t transition-all duration-200 ${
                  tab === t.id ? "bg-axc-navy opacity-100" : "opacity-0"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {tab === "entry" ? (
        <div className="flex flex-col gap-6 w-full">
          <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6 items-start w-full">
            
            <div className="bg-white border border-axc-border rounded-[8px] overflow-hidden shadow-sm">
              <PanelHeader title="MANIFEST SUMMARY" />
              <div className="flex flex-col gap-4 p-5">
                <div>
                  <FieldLabel>MANIFEST NO.</FieldLabel>
                  <input
                    disabled
                    value={form.manifestNo}
                    className={`${disabledInputClass} mt-1`}
                    placeholder="Auto-generated"
                  />
                </div>

                <div>
                  <FieldLabel>DATE</FieldLabel>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => updateField("date", e.target.value)}
                    className={`${inputClass} mt-1`}
                  />
                </div>

                <div>
                  <FieldLabel>TIME</FieldLabel>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => updateField("time", e.target.value)}
                    className={`${inputClass} mt-1`}
                  />
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <FieldLabel>ARRIVAL DATE</FieldLabel>
                    <input
                      type="date"
                      value={form.arrivalDate}
                      onChange={(e) => updateField("arrivalDate", e.target.value)}
                      className={`${inputClass} mt-1`}
                    />
                  </div>
                  <div className="flex-1">
                    <FieldLabel>ARRIVAL TIME</FieldLabel>
                    <input
                      type="time"
                      value={form.arrivalTime}
                      onChange={(e) => updateField("arrivalTime", e.target.value)}
                      className={`${inputClass} mt-1`}
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>NO. OF BAGS</FieldLabel>
                  <div className="flex gap-2 mt-1">
                    <input
                      disabled={!form.editNoOfBags}
                      value={form.noOfBags}
                      onChange={(e) => updateField("noOfBags", e.target.value)}
                      className={form.editNoOfBags ? inputClass : disabledInputClass}
                    />
                    <EditIconButton active={form.editNoOfBags} onToggle={() => toggleEdit("editNoOfBags")} />
                  </div>
                </div>

                <div>
                  <FieldLabel>TOTAL ACTUAL WT</FieldLabel>
                  <input disabled value={form.totalActualWt} className={`${disabledInputClass} mt-1`} />
                </div>
                <div>
                  <FieldLabel>TOTAL VOLUMETRIC WT</FieldLabel>
                  <input disabled value={form.totalVolumetricWt} className={`${disabledInputClass} mt-1`} />
                </div>
                <div>
                  <FieldLabel>TOTAL CHARGEABLE WT</FieldLabel>
                  <input disabled value={form.totalChargeableWt} className={`${disabledInputClass} mt-1`} />
                </div>
              </div>
            </div>

          
            <div className="bg-white border border-axc-border rounded-[8px] overflow-hidden shadow-sm">
              <PanelHeader title="MANIFEST INFORMATION" />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-4 p-5">
                <div>
                  <FieldLabel>FORWARDER</FieldLabel>
                  <div className="flex gap-2 mt-1">
                    <input disabled className={`${disabledInputClass} w-1/3`} />
                    <input
                      disabled={!form.editForwarder}
                      value={form.forwarder}
                      onChange={(e) => updateField("forwarder", e.target.value)}
                      className={form.editForwarder ? inputClass : disabledInputClass}
                    />
                    <EditIconButton active={form.editForwarder} onToggle={() => toggleEdit("editForwarder")} />
                  </div>
                </div>

                <div>
                  <FieldLabel>VENDOR</FieldLabel>
                  <div className="flex gap-2 mt-1">
                    <input disabled className={`${disabledInputClass} w-1/3`} />
                    <input
                      disabled={!form.editVendor}
                      value={form.vendor}
                      onChange={(e) => updateField("vendor", e.target.value)}
                      className={form.editVendor ? inputClass : disabledInputClass}
                    />
                    <EditIconButton active={form.editVendor} onToggle={() => toggleEdit("editVendor")} />
                  </div>
                </div>

                <div>
                  <FieldLabel>LINE HAUL VENDOR</FieldLabel>
                  <input
                    value={form.lineHaulVendor}
                    onChange={(e) => updateField("lineHaulVendor", e.target.value)}
                    className={`${inputClass} mt-1`}
                  />
                </div>

                <div>
                  <FieldLabel>MASTER NO.</FieldLabel>
                  <input
                    value={form.masterNo}
                    onChange={(e) => updateField("masterNo", e.target.value)}
                    className={`${inputClass} mt-1`}
                  />
                </div>

                <div>
                  <FieldLabel>MASTER EDI BAG NO</FieldLabel>
                  <input
                    value={form.masterEdiBagNo}
                    onChange={(e) => updateField("masterEdiBagNo", e.target.value)}
                    className={`${inputClass} mt-1`}
                  />
                </div>

                <div>
                  <FieldLabel>RUN NUMBER</FieldLabel>
                  <div className="flex gap-2 mt-1">
                    <input
                      disabled={!form.editRunNumber}
                      placeholder="Alphabet-Number"
                      value={form.runNumber}
                      onChange={(e) => updateField("runNumber", e.target.value)}
                      className={form.editRunNumber ? inputClass : disabledInputClass}
                    />
                    <EditIconButton active={form.editRunNumber} onToggle={() => toggleEdit("editRunNumber")} />
                  </div>
                </div>

                <div>
                  <FieldLabel>FLIGHT NO</FieldLabel>
                  <div className="flex gap-2 mt-1">
                    <select
                      disabled={!form.editFlightNo}
                      value={form.flightNo}
                      onChange={(e) => updateField("flightNo", e.target.value)}
                      className={form.editFlightNo ? inputClass : disabledInputClass}
                    >
                      <option value="">SELECT FLIGHT NO...</option>
                      <option value="AI-101">AI-101</option>
                      <option value="EK-501">EK-501</option>
                    </select>
                    <EditIconButton active={form.editFlightNo} onToggle={() => toggleEdit("editFlightNo")} />
                  </div>
                </div>

                <div>
                  <FieldLabel required>ORIGIN HUB</FieldLabel>
                  <select
                    value={form.originHub}
                    onChange={(e) => updateField("originHub", e.target.value)}
                    className={`${errors.originHub ? "border-red-400" : ""} ${inputClass} mt-1`}
                  >
                    <option value="">SELECT...</option>
                    <option value="DEL">DELHI</option>
                    <option value="BOM">MUMBAI</option>
                  </select>
                  <FieldError message={errors.originHub} />
                </div>

                <div>
                  <FieldLabel>DESTINATION HUB</FieldLabel>
                  <select
                    value={form.destinationHub}
                    onChange={(e) => updateField("destinationHub", e.target.value)}
                    className={`${inputClass} mt-1`}
                  >
                    <option value="">SELECT...</option>
                    <option value="JFK">NEW YORK</option>
                    <option value="LAX">LOS ANGELES</option>
                  </select>
                </div>

                <div className="md:col-span-2 xl:col-span-1">
                  <FieldLabel>EDI EXCEL FILE</FieldLabel>
                  <div className="mt-1">
                    <FileUploadField />
                  </div>
                  <p className="text-[10px] text-axc-red font-semibold mt-1">(UPLOAD EXCEL FILE ONLY)</p>
                </div>

                <div>
                  <FieldLabel>MAWB IMAGE</FieldLabel>
                  <div className="mt-1">
                    <FileUploadField multiple />
                  </div>
                </div>

                <div className="md:col-span-2 xl:col-span-3">
                  <FieldLabel>COMMENT</FieldLabel>
                  <textarea
                    rows={3}
                    value={form.comment}
                    onChange={(e) => updateField("comment", e.target.value)}
                    className={`${inputClass} mt-1 resize-none`}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 px-5 pb-5">
                <button
                  type="button"
                  onClick={handleSearchAwb}
                  className="bg-amber-800 text-white text-[12px] font-semibold px-4 py-2 rounded hover:brightness-110"
                >
                  SEARCH AWB
                </button>
                <button
                  type="button"
                  onClick={handleBagging}
                  className="bg-axc-green text-white text-[12px] font-semibold px-4 py-2 rounded hover:brightness-110"
                >
                  BAGGING
                </button>
              </div>
            </div>
          </div>

          {/* Bag table - own card, scrolls independently, tabs above stay fixed */}
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
                    <tr key={row.id} className="border-t border-gray-100">
                      <td className="px-2 py-1.5 text-center">
                        <input
                          type="checkbox"
                          checked={row.selected}
                          onChange={(e) => updateRow(row.id, "selected", e.target.checked)}
                          className="accent-green-600"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          value={row.bagNo}
                          onChange={(e) => updateRow(row.id, "bagNo", e.target.value)}
                          className={`${inputClass} py-1.5`}
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          value={row.ediBagNo}
                          onChange={(e) => updateRow(row.id, "ediBagNo", e.target.value)}
                          className={`${inputClass} py-1.5`}
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input disabled value={row.bagId} className={`${disabledInputClass} py-1.5`} />
                      </td>
                      <td className="px-2 py-1.5">
                        <select
                          value={row.trackBy}
                          onChange={(e) => updateRow(row.id, "trackBy", e.target.value as ManifestBagRow["trackBy"])}
                          className={`${inputClass} py-1.5`}
                        >
                          <option value="PARCEL NUMBER">PARCEL NUMBER</option>
                          <option value="AWB NUMBER">AWB NUMBER</option>
                        </select>
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          value={row.awbNo}
                          onChange={(e) => updateRow(row.id, "awbNo", e.target.value)}
                          className={`${inputClass} py-1.5`}
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          value={row.forwarderNo}
                          onChange={(e) => updateRow(row.id, "forwarderNo", e.target.value)}
                          className={`${inputClass} py-1.5`}
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input disabled value={row.bookingDate} className={`${disabledInputClass} py-1.5`} />
                      </td>
                      <td className="px-2 py-1.5">
                        <input disabled value={row.weight} className={`${disabledInputClass} py-1.5`} />
                      </td>
                      <td className="px-2 py-1.5">
                        <input disabled value={row.pcs} className={`${disabledInputClass} py-1.5`} />
                      </td>
                      <td className="px-2 py-1.5">
                        <input disabled value={row.destn} className={`${disabledInputClass} py-1.5`} />
                      </td>
                      <td className="px-2 py-1.5">
                        <input disabled value={row.service} className={`${disabledInputClass} py-1.5`} />
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
                        <input disabled value={row.actionDuty} className={`${disabledInputClass} py-1.5`} />
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
                <Plus size={14} /> ADD AWB
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-[8px] border border-axc-border bg-white p-12 text-center text-axc-dark-gray shadow-sm w-full">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billing</p>
          <p className="text-xs text-gray-400 font-medium">Billing details go here.</p>
        </div>
      )}
    </div>
  );
}