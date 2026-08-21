"use client";

import React from "react";
import CommonDropdown from "../../src/common/dropdown";
import { AwbFormErrors, AwbFormState } from "./formstate";
import { EditIconButton, FieldError, FieldLabel, PanelHeader, errorInputClass, inputClass } from "./form";

interface Props {
  form: AwbFormState;
  setForm: React.Dispatch<React.SetStateAction<AwbFormState>>;
  errors: AwbFormErrors;
}

export default function AirWaybillInformation({ form, setForm, errors }: Props) {
  return (
    <div className="bg-white rounded-xl border border-axc-border shadow-sm overflow-hidden flex flex-col">
      <PanelHeader
        title="Air Waybill Information"
        right={<span className="bg-white/10 text-white text-[10px] px-2 py-0.5 rounded font-medium">BALANCE: WAIT...</span>}
      />
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3 text-xs">
        <div className="flex flex-col gap-1">
          <FieldLabel required>AWB Number</FieldLabel>
          <div className="flex items-center gap-2">
            <input
              type={form.editAwbNumber ? "text" : "password"}
              value={form.awbNumber}
              readOnly={!form.editAwbNumber}
              placeholder={!form.editAwbNumber ? "AUTO-GENERATED" : ""}
              onChange={(e) => setForm({ ...form, awbNumber: e.target.value })}
              className={`${errors.awbNumber ? errorInputClass : inputClass} flex-1 ${form.editAwbNumber ? "bg-white" : "bg-gray-50 text-gray-400 cursor-not-allowed"}`}
            />
            <EditIconButton active={form.editAwbNumber} onToggle={() => setForm({ ...form, editAwbNumber: !form.editAwbNumber })} title="Edit AWB Number" />
          </div>
          <FieldError message={errors.awbNumber} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel required>Customer</FieldLabel>
          <input type="text" value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} className={`${errors.customer ? errorInputClass : inputClass} bg-gray-50 focus:bg-white`} />
          <FieldError message={errors.customer} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Company</FieldLabel>
          <div className="flex items-center gap-2">
            <CommonDropdown value={form.company} onChange={(val) => setForm({ ...form, company: val })} className="flex-1 bg-gray-50 focus:bg-white border-axc-border" placeholder="SELECT COMPANY..." options={[{ value: "company1", label: "Company A" }, { value: "company2", label: "Company B" }]} />


            <EditIconButton active={form.editCompany} onToggle={() => setForm({ ...form, editCompany: !form.editCompany })} title="Edit Company" />

          </div>
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel required>Origin</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" placeholder="Origin" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} className={errors.origin ? errorInputClass : inputClass} />
            <input type="text" placeholder="ZONE" value={form.originZone} onChange={(e) => setForm({ ...form, originZone: e.target.value })} className={`${inputClass} bg-gray-50`} />
          </div>
          <FieldError message={errors.origin} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel required>Destination</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" placeholder="Destination" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className={errors.destination ? errorInputClass : inputClass} />
            <input type="text" placeholder="ZONE" value={form.destinationZone} onChange={(e) => setForm({ ...form, destinationZone: e.target.value })} className={`${inputClass} bg-gray-50`} />
          </div>
          <FieldError message={errors.destination} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel required>Product</FieldLabel>
          <CommonDropdown value={form.product} onChange={(val) => setForm({ ...form, product: val })} className="border-axc-border" options={[{ value: "NONDOX", label: "NONDOX" }, { value: "DOX", label: "DOX" }]} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel required>Booking Date</FieldLabel>
          <input type="date" value={form.bookingDate} onChange={(e) => setForm({ ...form, bookingDate: e.target.value })} className={inputClass} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel required>Service</FieldLabel>
          <CommonDropdown value={form.service} onChange={(val) => setForm({ ...form, service: val })} className="border-axc-border" options={[{ value: "FEDEX IP EX NEW YORK - INDIA", label: "FEDEX IP EX NEW YORK - INDIA" }, { value: "FEDEX IE EX", label: "FEDEX IE EX" }]} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Vendor</FieldLabel>
          <div className="flex items-center gap-2">
            <CommonDropdown value={form.vendor} onChange={(val) => setForm({ ...form, vendor: val })} className="flex-1 border-axc-border" options={[{ value: "FEDEX IP EX NEW YORK - INDIA 210588750", label: "FEDEX IP EX NEW YORK - INDIA 210588750" }]} />
            <EditIconButton active={form.editVendor} onToggle={() => setForm({ ...form, editVendor: !form.editVendor })} title="Edit Vendor" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Forwarding Number</FieldLabel>
          <input type="text" value={form.forwardingNumber} onChange={(e) => setForm({ ...form, forwardingNumber: e.target.value })} className={inputClass} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Forwarding Number 2</FieldLabel>
          <input type="text" value={form.forwardingNumber2} onChange={(e) => setForm({ ...form, forwardingNumber2: e.target.value })} className={inputClass} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Reference Number</FieldLabel>
          <input type="text" value={form.referenceNumber} onChange={(e) => setForm({ ...form, referenceNumber: e.target.value })} className={inputClass} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Shipment Value</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" placeholder="Value" value={form.shipmentValue} onChange={(e) => setForm({ ...form, shipmentValue: e.target.value })} className={inputClass} />
            <CommonDropdown className="border-axc-border" value={form.shipmentCurrency} onChange={(val) => setForm({ ...form, shipmentCurrency: val })} options={[{ value: "USD", label: "USD" }, { value: "INR", label: "INR" }]} />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Invoice Date</FieldLabel>
          <div className="flex items-center gap-2">
            <input type="date" value={form.invoiceDate} onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })} className={`${inputClass} flex-1`} />
            <EditIconButton active={form.editInvoice} onToggle={() => setForm({ ...form, editInvoice: !form.editInvoice })} title="Edit Invoice Date" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Invoice Number</FieldLabel>
          <input type="text" value={form.invoiceNumber} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })} className={inputClass} />
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2 xl:col-span-3">
          <label className="font-bold text-gray-600 uppercase">Content</label>
          <textarea rows={2} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className={`${inputClass} text-xs focus:ring-1 focus:ring-blue-500 outline-none`} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Contract ID</FieldLabel>
          <input type="text" value={form.contractId} onChange={(e) => setForm({ ...form, contractId: e.target.value })} className={inputClass} />
        </div>

        <div className="mt-2 border border-axc-border rounded-lg overflow-hidden sm:col-span-2 xl:col-span-3">
          <table className="w-full text-[10px] text-center border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-axc-border">
                <th className="py-1 border-r border-axc-border text-axc-dark-gray font-bold"></th>
                <th className="py-1 border-r border-axc-border text-axc-dark-gray font-bold">Customer</th>
                <th className="py-1 text-axc-dark-gray font-bold">Vendor</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-axc-border">
                <td className="py-1 px-2 border-r border-axc-border bg-gray-50 text-left font-bold text-gray-600">RATE CONTRACT</td>
                <td className="border-r border-axc-border"><input type="text" value={form.rateContractCustomer} onChange={(e) => setForm({ ...form, rateContractCustomer: e.target.value })} className="w-full border-none focus:outline-none text-center py-0.5" /></td>
                <td><input type="text" value={form.rateContractVendor} onChange={(e) => setForm({ ...form, rateContractVendor: e.target.value })} className="w-full border-none focus:outline-none text-center py-0.5" /></td>
              </tr>
              <tr className="border-b border-axc-border">
                <td className="py-1 px-2 border-r border-axc-border bg-gray-50 text-left font-bold text-gray-600">CFT CONTRACT</td>
                <td className="border-r border-axc-border"><input type="text" value={form.cftContractCustomer} onChange={(e) => setForm({ ...form, cftContractCustomer: e.target.value })} className="w-full border-none focus:outline-none text-center py-0.5" /></td>
                <td><input type="text" value={form.cftContractVendor} onChange={(e) => setForm({ ...form, cftContractVendor: e.target.value })} className="w-full border-none focus:outline-none text-center py-0.5" /></td>
              </tr>
              <tr>
                <td className="py-1 px-2 border-r border-axc-border bg-gray-50 text-left font-bold text-gray-600">TAT</td>
                <td className="border-r border-axc-border"><input type="text" value={form.tatCustomer} onChange={(e) => setForm({ ...form, tatCustomer: e.target.value })} className="w-full border-none focus:outline-none text-center py-0.5" /></td>
                <td><input type="text" value={form.tatVendor} onChange={(e) => setForm({ ...form, tatVendor: e.target.value })} className="w-full border-none focus:outline-none text-center py-0.5" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-1 mt-2">
          <FieldLabel>Origin Hub</FieldLabel>
          <div className="flex items-center gap-2">
            <CommonDropdown value={form.originHub} onChange={(val) => setForm({ ...form, originHub: val })} className="flex-1 border-axc-border" placeholder="SELECT..." options={[]} />
            <EditIconButton active={form.editOriginHub} onToggle={() => setForm({ ...form, editOriginHub: !form.editOriginHub })} title="Edit Origin Hub" />
          </div>
        </div>

        <div className="flex flex-col gap-1 mt-2">
          <FieldLabel>Duty</FieldLabel>
          <CommonDropdown value={form.duty} onChange={(val) => setForm({ ...form, duty: val })} className="border-axc-border" placeholder="SELECT..." options={[]} />
        </div>
      </div>
    </div>
  );
}