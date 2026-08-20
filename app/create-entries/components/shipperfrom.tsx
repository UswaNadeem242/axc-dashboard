"use client";
import React from "react";
import { RotateCcw } from "lucide-react";
import { AwbFormErrors, AwbFormState } from "./formstate";
import { FieldError, FieldLabel, FileUploadField, PanelHeader, errorInputClass, inputClass } from "./form";
import CommonDropdown from "../../src/common/dropdown";
interface Props {
  form: AwbFormState;
  setForm: React.Dispatch<React.SetStateAction<AwbFormState>>;
  errors: AwbFormErrors;
  onReset: () => void;
  showToast: (message: string, type?: "success" | "info") => void;
}
export default function ShipperFromForm({ form, setForm, errors, onReset, showToast }: Props) {
  return (
    <div className="bg-white rounded-xl border border-axc-border shadow-sm overflow-hidden flex flex-col">
      <PanelHeader
        title="Shipper / Consignor / From"
        right={
          <div className="flex items-center gap-3">
            <button type="button" onClick={onReset} className="text-white/70 hover:text-white transition cursor-pointer" title="Reset Shipper Form">
              <RotateCcw size={14} />
            </button>
            <label className="flex items-center gap-1 text-[10px] text-white/90 cursor-pointer normal-case font-medium">
              <input type="checkbox" checked={form.shipperSaveToAddressBook} onChange={(e) => setForm({ ...form, shipperSaveToAddressBook: e.target.checked })} /> SAVE?
            </label>
          </div>
        }
      />
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-2.5 text-xs">
        <div className="flex flex-col gap-1 sm:col-span-2 xl:col-span-3">
          <FieldLabel>Search Address Book</FieldLabel>
          <input type="text" value={form.shipperSearchAddressBook} onChange={(e) => setForm({ ...form, shipperSearchAddressBook: e.target.value })} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Code</FieldLabel>
          <div className="flex items-center gap-2">
            <input type="text" value={form.shipperCode} onChange={(e) => setForm({ ...form, shipperCode: e.target.value })} className={`${inputClass} flex-1`} />
            <label className="flex items-center gap-1.5 text-[10px] text-axc-dark-gray cursor-pointer whitespace-nowrap">
              <input type="checkbox" checked={form.shipperUpdateAddressBook} onChange={(e) => setForm({ ...form, shipperUpdateAddressBook: e.target.checked })} className="w-4 h-4" /> UPDATE?
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Company</FieldLabel>
          <input type="text" value={form.shipperCompany} onChange={(e) => setForm({ ...form, shipperCompany: e.target.value })} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Person Name</FieldLabel>
          <input type="text" value={form.shipperPersonName} onChange={(e) => setForm({ ...form, shipperPersonName: e.target.value })} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel required>Address 1</FieldLabel>
          <input type="text" value={form.shipperAddress1} onChange={(e) => setForm({ ...form, shipperAddress1: e.target.value })} className={errors.shipperAddress1 ? errorInputClass : inputClass} />
          <FieldError message={errors.shipperAddress1} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Address 2</FieldLabel>
          <input type="text" value={form.shipperAddress2} onChange={(e) => setForm({ ...form, shipperAddress2: e.target.value })} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Address 3</FieldLabel>
          <input type="text" value={form.shipperAddress3} onChange={(e) => setForm({ ...form, shipperAddress3: e.target.value })} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Post / Zip Code</FieldLabel>
          <div className="flex gap-2">
            <input type="text" value={form.shipperZipCode} onChange={(e) => setForm({ ...form, shipperZipCode: e.target.value })} className={`${inputClass} flex-1`} />
            <button type="button" onClick={() => showToast(`Searching zip code: ${form.shipperZipCode || "—"}`)} className="px-3 py-1 bg-axc-yellow hover:bg-axc-yellow/80 text-white rounded text-sm font-normal whitespace-nowrap shadow-none cursor-pointer">SEARCH</button>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>City</FieldLabel>
          <input type="text" value={form.shipperCity} onChange={(e) => setForm({ ...form, shipperCity: e.target.value })} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel required>State / County</FieldLabel>
          <input type="text" value={form.shipperState} onChange={(e) => setForm({ ...form, shipperState: e.target.value })} className={errors.shipperState ? errorInputClass : inputClass} />
          <FieldError message={errors.shipperState} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel required>Country</FieldLabel>
          <input type="text" value={form.shipperCountry} onChange={(e) => setForm({ ...form, shipperCountry: e.target.value })} className={errors.shipperCountry ? errorInputClass : inputClass} />
          <FieldError message={errors.shipperCountry} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Phone Number</FieldLabel>
          <input type="text" value={form.shipperPhone} onChange={(e) => setForm({ ...form, shipperPhone: e.target.value })} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Email Address</FieldLabel>
          <input type="email" value={form.shipperEmail} onChange={(e) => setForm({ ...form, shipperEmail: e.target.value })} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>KYC Type</FieldLabel>
          <CommonDropdown value={form.shipperKycType} onChange={(val) => setForm({ ...form, shipperKycType: val })} className="border-axc-border" placeholder="SELECT..." options={[{ value: "IEC", label: "IEC" }, { value: "GST", label: "GST" }, { value: "PAN", label: "PAN" }]} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>KYC Number</FieldLabel>
          <input type="text" value={form.shipperKycNumber} onChange={(e) => setForm({ ...form, shipperKycNumber: e.target.value })} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2 xl:col-span-3">
          <FieldLabel>Upload KYC</FieldLabel>
          <FileUploadField
            placeholder="No file chosen"
            onFileChange={(file) => file && showToast(`KYC file uploaded: ${file.name}`)}
          />
        </div>
      </div>
    </div>
  );
}