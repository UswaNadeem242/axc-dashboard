"use client";
import React from "react";
import { RotateCcw, ArrowUp } from "lucide-react";
import { AwbFormErrors, AwbFormState } from "./formstate";
import { FieldError, FieldLabel, FileUploadField, PanelHeader, errorInputClass, inputClass } from "./form";
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
            <label className="flex items-center gap-1 text-xs text-white/90 cursor-pointer capitalize font-medium">
              <input type="checkbox" checked={form.consigneeSaveToAddressBook} onChange={(e) => setForm({ ...form, consigneeSaveToAddressBook: e.target.checked })} />  Save to address book?
            </label>
          </div>
        }
      />
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-2.5">
        <div className="flex flex-col gap-1 ">
          <FieldLabel>Search Address Book</FieldLabel>
          <input type="text" value={form.consigneeSearchAddressBook} onChange={(e) => setForm({ ...form, consigneeSearchAddressBook: e.target.value })} className={inputClass} placeholder="Search Address Book" />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Code</FieldLabel>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={form.consigneeCode}
                onChange={(e) => setForm({ ...form, consigneeCode: e.target.value })}
                className={`${inputClass} w-full pr-10`}
                placeholder="Code"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, consigneeUpdateAddressBook: !form.consigneeUpdateAddressBook })}
                  title={form.consigneeUpdateAddressBook ? "Address Book Update Enabled" : "Update Address Book"}
                  className={`flex items-center justify-center h-7 w-7 rounded transition cursor-pointer ${form.consigneeUpdateAddressBook
                    ? "bg-axc-navy text-white shadow-sm"
                    : "text-axc-gray hover:bg-gray-100 hover:text-axc-dark-gray"
                    }`}
                >
                  <ArrowUp size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Company</FieldLabel>
          <input type="text" value={form.consigneeCompany} onChange={(e) => setForm({ ...form, consigneeCompany: e.target.value })} className={inputClass} placeholder="Company" />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel required>Person Name</FieldLabel>
          <input type="text" value={form.consigneePersonName} onChange={(e) => setForm({ ...form, consigneePersonName: e.target.value })} className={errors.consigneePersonName ? errorInputClass : inputClass} placeholder="Person Name" />
          <FieldError message={errors.consigneePersonName} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Email Address</FieldLabel>
          <input type="email" value={form.consigneeEmail} onChange={(e) => setForm({ ...form, consigneeEmail: e.target.value })} className={inputClass} placeholder="Email Address" />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Post / Zip Code</FieldLabel>
          <div className="flex gap-2">
            <input type="number" value={form.consigneeZipCode} onChange={(e) => setForm({ ...form, consigneeZipCode: e.target.value })} className={`${inputClass} flex-1`} placeholder="Post / Zip Code" />
            {/* <button type="button" onClick={() => showToast(`Searching zip code: ${form.consigneeZipCode || "—"}`)} className="px-3 py-1 bg-axc-yellow hover:bg-axc-yellow/80 text-white rounded text-sm font-normal whitespace-nowrap shadow-none cursor-pointer">SEARCH</button> */}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>City</FieldLabel>
          <input type="text" value={form.consigneeCity} onChange={(e) => setForm({ ...form, consigneeCity: e.target.value })} className={inputClass} placeholder="City" />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel required>State / County</FieldLabel>
          <input type="text" value={form.consigneeState} onChange={(e) => setForm({ ...form, consigneeState: e.target.value })} className={errors.consigneeState ? errorInputClass : inputClass} placeholder="State / County" />
          <FieldError message={errors.consigneeState} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel required>Country</FieldLabel>
          <input type="text" value={form.consigneeCountry} onChange={(e) => setForm({ ...form, consigneeCountry: e.target.value })} className={errors.consigneeCountry ? errorInputClass : inputClass} placeholder="Country" />
          <FieldError message={errors.consigneeCountry} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Phone Number</FieldLabel>
          <input type="text" value={form.consigneePhone} onChange={(e) => setForm({ ...form, consigneePhone: e.target.value })} className={inputClass} placeholder="Phone Number" />
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2 xl:col-span-3">
          <FieldLabel required>Address 1</FieldLabel>
          <input type="text" value={form.consigneeAddress1} onChange={(e) => setForm({ ...form, consigneeAddress1: e.target.value })} className={errors.consigneeAddress1 ? errorInputClass : inputClass} placeholder="Address 1" />
          <FieldError message={errors.consigneeAddress1} />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2 xl:col-span-3">
          <FieldLabel>Address 2</FieldLabel>
          <input type="text" value={form.consigneeAddress2} onChange={(e) => setForm({ ...form, consigneeAddress2: e.target.value })} className={inputClass} placeholder="Address 2" />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2 xl:col-span-3">
          <FieldLabel>Address 3</FieldLabel>
          <input type="text" value={form.consigneeAddress3} onChange={(e) => setForm({ ...form, consigneeAddress3: e.target.value })} className={inputClass} placeholder="Address 3" />
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