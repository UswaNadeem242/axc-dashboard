"use client";
import React from "react";
import { RotateCcw } from "lucide-react";
import { AwbFormErrors, AwbFormState } from "./formstate";
import { FieldError, FieldLabel, PanelHeader, errorInputClass, inputClass } from "./form";
interface Props {
  form: AwbFormState;
  setForm: React.Dispatch<React.SetStateAction<AwbFormState>>;
  errors: AwbFormErrors;
  onReset: () => void;
  showToast: (message: string, type?: "success" | "info") => void;
}
export default function ConsigneeToForm({ form, setForm, errors, onReset, showToast }: Props) {
  return (
    <div className="bg-white rounded-xl border border-axc-border shadow-sm overflow-hidden flex flex-col">
      <PanelHeader
        title="Consignee / Receiver / To"
        right={
          <div className="flex items-center gap-3">
            <button type="button" onClick={onReset} className="text-white/70 hover:text-white transition cursor-pointer" title="Reset Consignee Form">
              <RotateCcw size={14} />
            </button>
            <label className="flex items-center gap-1 text-[10px] text-white/90 cursor-pointer normal-case font-medium">
              <input type="checkbox" checked={form.consigneeSaveToAddressBook} onChange={(e) => setForm({ ...form, consigneeSaveToAddressBook: e.target.checked })} /> SAVE?
            </label>
          </div>
        }
      />
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-2.5 text-xs">
        <div className="flex flex-col gap-1 sm:col-span-2 xl:col-span-3">
          <FieldLabel>Search Address Book</FieldLabel>
          <input type="text" value={form.consigneeSearchAddressBook} onChange={(e) => setForm({ ...form, consigneeSearchAddressBook: e.target.value })} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Code</FieldLabel>
          <div className="flex items-center gap-2">
            <input type="text" value={form.consigneeCode} onChange={(e) => setForm({ ...form, consigneeCode: e.target.value })} className={`${inputClass} flex-1`} />
            <label className="flex items-center gap-1.5 text-[10px] text-axc-dark-gray cursor-pointer whitespace-nowrap">
              <input type="checkbox" checked={form.consigneeUpdateAddressBook} onChange={(e) => setForm({ ...form, consigneeUpdateAddressBook: e.target.checked })} className="w-4 h-4" /> UPDATE?
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Company</FieldLabel>
          <input type="text" value={form.consigneeCompany} onChange={(e) => setForm({ ...form, consigneeCompany: e.target.value })} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel required>Person Name</FieldLabel>
          <input type="text" value={form.consigneePersonName} onChange={(e) => setForm({ ...form, consigneePersonName: e.target.value })} className={errors.consigneePersonName ? errorInputClass : inputClass} />
          <FieldError message={errors.consigneePersonName} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel required>Address 1</FieldLabel>
          <input type="text" value={form.consigneeAddress1} onChange={(e) => setForm({ ...form, consigneeAddress1: e.target.value })} className={errors.consigneeAddress1 ? errorInputClass : inputClass} />
          <FieldError message={errors.consigneeAddress1} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Address 2</FieldLabel>
          <input type="text" value={form.consigneeAddress2} onChange={(e) => setForm({ ...form, consigneeAddress2: e.target.value })} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Address 3</FieldLabel>
          <input type="text" value={form.consigneeAddress3} onChange={(e) => setForm({ ...form, consigneeAddress3: e.target.value })} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Post / Zip Code</FieldLabel>
          <div className="flex gap-2">
            <input type="number" value={form.consigneeZipCode} onChange={(e) => setForm({ ...form, consigneeZipCode: e.target.value })} className={`${inputClass} flex-1`} />
            {/* <button type="button" onClick={() => showToast(`Searching zip code: ${form.consigneeZipCode || "—"}`)} className="px-3 py-1 bg-axc-yellow hover:bg-axc-yellow/80 text-white rounded text-sm font-normal whitespace-nowrap shadow-none cursor-pointer">SEARCH</button> */}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>City</FieldLabel>
          <input type="text" value={form.consigneeCity} onChange={(e) => setForm({ ...form, consigneeCity: e.target.value })} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel required>State / County</FieldLabel>
          <input type="text" value={form.consigneeState} onChange={(e) => setForm({ ...form, consigneeState: e.target.value })} className={errors.consigneeState ? errorInputClass : inputClass} />
          <FieldError message={errors.consigneeState} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel required>Country</FieldLabel>
          <input type="text" value={form.consigneeCountry} onChange={(e) => setForm({ ...form, consigneeCountry: e.target.value })} className={errors.consigneeCountry ? errorInputClass : inputClass} />
          <FieldError message={errors.consigneeCountry} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Phone Number</FieldLabel>
          <input type="text" value={form.consigneePhone} onChange={(e) => setForm({ ...form, consigneePhone: e.target.value })} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Email Address</FieldLabel>
          <input type="email" value={form.consigneeEmail} onChange={(e) => setForm({ ...form, consigneeEmail: e.target.value })} className={inputClass} />
        </div>
      </div>
    </div>
  );
}