"use client";
import React from "react";
import { RotateCcw } from "lucide-react";
import { AwbFormErrors, AwbFormState } from "./formstate";
import { FieldError, FieldLabel, FileUploadField, PanelHeader, errorInputClass, inputClass } from "./form";
import CommonDropdown from "../../src/common/dropdown";
import { useMasterData } from "../../src/lib/useMasterData";

interface Props {
  form: AwbFormState;
  setForm: React.Dispatch<React.SetStateAction<AwbFormState>>;
  errors?: AwbFormErrors;
  onReset: () => void;
  showToast: (message: string, type?: "success" | "info") => void;
}

export default function ShipperFromForm({ form, setForm, errors, onReset, showToast }: Props) {
  const { shippers, countries, states, cities } = useMasterData();

  const handleSelectShipper = (val: string) => {
    const selected = shippers.find((s) => s.value === val || s.label === val);
    if (selected && selected.raw) {
      const sh = selected.raw;
      setForm((prev) => ({
        ...prev,
        shipperCompany: sh.company_name || val,
        shipperPersonName: sh.contact_name || prev.shipperPersonName,
        shipperEmail: sh.email || prev.shipperEmail,
        shipperPhone: sh.phone || prev.shipperPhone,
        shipperCity: sh.city || prev.shipperCity,
        shipperCountry: sh.country || prev.shipperCountry,
        shipperAddress1: sh.address_line1 || prev.shipperAddress1,
        shipperZipCode: sh.postal_code || prev.shipperZipCode,
      }));
    } else {
      setForm((prev) => ({ ...prev, shipperCompany: val }));
    }
  };

  const handleCityChange = (cityVal: string) => {
    const found = cities.find((c) => c.value?.toLowerCase() === cityVal.toLowerCase() || c.name?.toLowerCase() === cityVal.toLowerCase());
    setForm((prev) => ({
      ...prev,
      shipperCity: cityVal,
      shipperCountry: found?.raw?.country?.name || found?.raw?.country?.code || prev.shipperCountry,
    }));
  };

  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col">
      <PanelHeader
        title="Shipper / Consignor / From"
        right={
          <div className="flex items-center gap-3">
            <button type="button" onClick={onReset} className="text-white/70 hover:text-white transition cursor-pointer" title="Reset Shipper Form">
              <RotateCcw size={14} />
            </button>
            <label className="flex items-center gap-1 text-xs text-white/90 cursor-pointer capitalize font-medium">
              <input type="checkbox" checked={form.shipperSaveToAddressBook} onChange={(e) => setForm({ ...form, shipperSaveToAddressBook: e.target.checked })} />  Save to address book?
            </label>
          </div>
        }
      />
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-2.5 ">
        <div className="flex flex-col gap-1 sm:col-span-2 xl:col-span-3">
          <FieldLabel>Select Registered Shipper (Master Data)</FieldLabel>
          <CommonDropdown
            value={form.shipperCompany}
            onChange={handleSelectShipper}
            className="border-axc-border"
            options={shippers}
            placeholder="Select Registered Shipper from Master Database..."
          />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Code</FieldLabel>
          <div className="flex items-center gap-2">
            <input type="text" value={form.shipperCode} onChange={(e) => setForm({ ...form, shipperCode: e.target.value })} className={`${inputClass} flex-1`} placeholder="Code" />
            <label className="flex items-center gap-1.5 text-[10px] text-axc-dark-gray cursor-pointer whitespace-nowrap">
              <input type="checkbox" checked={form.shipperUpdateAddressBook} onChange={(e) => setForm({ ...form, shipperUpdateAddressBook: e.target.checked })} className="w-4 h-4" /> UPDATE?
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Company</FieldLabel>
          <input type="text" value={form.shipperCompany} onChange={(e) => setForm({ ...form, shipperCompany: e.target.value })} className={inputClass} placeholder="Company" />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Person Name</FieldLabel>
          <input type="text" value={form.shipperPersonName} onChange={(e) => setForm({ ...form, shipperPersonName: e.target.value })} className={inputClass} placeholder="Person Name" />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Email Address</FieldLabel>
          <input type="email" value={form.shipperEmail} onChange={(e) => setForm({ ...form, shipperEmail: e.target.value })} className={inputClass} placeholder="Email" />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Phone Number</FieldLabel>
          <input type="text" value={form.shipperPhone} onChange={(e) => setForm({ ...form, shipperPhone: e.target.value })} className={inputClass} placeholder="Phone" />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>Post / Zip Code</FieldLabel>
          <div className="flex gap-2">
            <input type="number" value={form.shipperZipCode} onChange={(e) => setForm({ ...form, shipperZipCode: e.target.value })} className={`${inputClass} flex-1`} placeholder="Post Code" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>City (Master List)</FieldLabel>
          <input
            list="shipper-cities-datalist"
            type="text"
            value={form.shipperCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className={inputClass}
            placeholder="Select from Master Cities or type..."
          />
          <datalist id="shipper-cities-datalist">
            {cities.map((ct) => (
              <option key={ct.value} value={ct.value}>{ct.label}</option>
            ))}
          </datalist>
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel required>State / County</FieldLabel>
          <input
            list="shipper-states-datalist"
            type="text"
            value={form.shipperState}
            onChange={(e) => setForm({ ...form, shipperState: e.target.value })}
            className={errors?.shipperState ? errorInputClass : inputClass}
            placeholder="Select State or type..."
          />
          <datalist id="shipper-states-datalist">
            {states.map((st) => (
              <option key={st.value} value={st.value}>{st.label}</option>
            ))}
          </datalist>
          <FieldError message={errors?.shipperState} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel required>Country (Master List)</FieldLabel>
          <input
            list="shipper-countries-datalist"
            type="text"
            value={form.shipperCountry}
            onChange={(e) => setForm({ ...form, shipperCountry: e.target.value })}
            className={errors?.shipperCountry ? errorInputClass : inputClass}
            placeholder="Select Country..."
          />
          <datalist id="shipper-countries-datalist">
            {countries.map((c) => (
              <option key={c.value} value={c.name || c.value}>{c.label}</option>
            ))}
          </datalist>
          <FieldError message={errors?.shipperCountry} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>KYC Type</FieldLabel>
          <CommonDropdown value={form.shipperKycType} onChange={(val) => setForm({ ...form, shipperKycType: val })} className="border-axc-border" placeholder="SELECT..." options={[{ value: "IEC", label: "IEC" }, { value: "GST", label: "GST" }, { value: "PAN", label: "PAN" }]} />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel>KYC Number</FieldLabel>
          <input type="text" value={form.shipperKycNumber} onChange={(e) => setForm({ ...form, shipperKycNumber: e.target.value })} className={inputClass} placeholder="KYC Number" />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2 xl:col-span-3">
          <FieldLabel required>Address 1</FieldLabel>
          <input
            type="text"
            value={form.shipperAddress1}
            onChange={(e) => setForm({ ...form, shipperAddress1: e.target.value })}
            className={errors?.shipperAddress1 ? errorInputClass : inputClass}
            placeholder="Address 1"
          />
          <FieldError message={errors?.shipperAddress1} />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2 xl:col-span-3">
          <FieldLabel>Address 2</FieldLabel>
          <input type="text" value={form.shipperAddress2} onChange={(e) => setForm({ ...form, shipperAddress2: e.target.value })} className={inputClass} placeholder="Address 2" />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2 xl:col-span-3">
          <FieldLabel>Address 3</FieldLabel>
          <input type="text" value={form.shipperAddress3} onChange={(e) => setForm({ ...form, shipperAddress3: e.target.value })} className={inputClass} placeholder="Address 3" />
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