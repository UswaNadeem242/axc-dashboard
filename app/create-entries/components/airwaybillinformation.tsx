"use client";

import React from "react";
import CommonDropdown from "../../src/common/dropdown";
import CustomDatePicker from "../../src/common/datepicker";
import { AwbFormErrors, AwbFormState } from "./formstate";
import { EditIconButton, FieldError, FieldLabel, PanelHeader, errorInputClass, inputClass } from "./form";
import { useMasterData } from "../../src/lib/useMasterData";

interface Props {
  form: AwbFormState;
  setForm: React.Dispatch<React.SetStateAction<AwbFormState>>;
  errors: AwbFormErrors;
}

export default function AirWaybillInformation({ form, setForm, errors }: Props) {
  const {
    branches,
    companies,
    customers,
    hubs,
    vendors,
    services,
    products,
    sectors,
    currencies,
  } = useMasterData();

  const handleCustomerChange = (val: string) => {
    const selected = customers.find((c) => c.value === val);
    setForm((prev) => ({
      ...prev,
      customer: val,
      customerCode: selected?.customerCode || prev.customerCode,
    }));
  };

  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col">
      <PanelHeader
        title="Air Waybill Information"
        right={<span className=" text-white text-xs px-2 py-0.5 rounded font-medium">BALANCE: WAIT...</span>}
      />
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3">
        <div className="flex flex-col gap-1">
          <FieldLabel required>AWB Number</FieldLabel>
          <div className="relative">
            <input
              type={form.editAwbNumber ? "text" : "password"}
              value={form.awbNumber}
              readOnly={!form.editAwbNumber}
              placeholder={!form.editAwbNumber ? "AUTO-GENERATED " : ""}
              onChange={(e) => setForm({ ...form, awbNumber: e.target.value })}
              className={`${errors.awbNumber ? errorInputClass : inputClass} w-full pr-10 text-regular-small ${form.editAwbNumber ? "bg-white" : "bg-gray-50 text-gray-400 cursor-not-allowed"}`}
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              <EditIconButton active={form.editAwbNumber} onToggle={() => setForm({ ...form, editAwbNumber: !form.editAwbNumber })} title="Edit AWB Number" />
            </div>
          </div>
          <FieldError message={errors.awbNumber} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel required>Branch</FieldLabel>
          <CommonDropdown
            value={form.branch}
            onChange={(val) => setForm({ ...form, branch: val })}
            className={errors.branch ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
            options={branches}
            placeholder="Select Branch..."
          />
          <FieldError message={errors.branch} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel required>Company</FieldLabel>
          <div className="relative">
            <CommonDropdown
              value={form.company}
              onChange={(val) => setForm({ ...form, company: val })}
              className={`w-full pr-10 ${errors.company ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}`}
              options={companies}
              placeholder="Select Company..."
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              <EditIconButton active={form.editCompany} onToggle={() => setForm({ ...form, editCompany: !form.editCompany })} title="Edit Company" />
            </div>
          </div>
          <FieldError message={errors.company} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel required>Customer</FieldLabel>
          <CommonDropdown
            value={form.customer}
            onChange={handleCustomerChange}
            className={errors.customer ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
            options={customers}
            placeholder="Select Customer..."
          />
          <FieldError message={errors.customer} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel required>Customer Code</FieldLabel>
          <input
            type="text"
            value={form.customerCode}
            onChange={(e) => setForm({ ...form, customerCode: e.target.value })}
            className={errors.customerCode ? errorInputClass : inputClass}
            placeholder="Customer Code"
          />
          <FieldError message={errors.customerCode} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel required>Sector</FieldLabel>
          <CommonDropdown
            value={form.sector}
            onChange={(val) => setForm({ ...form, sector: val })}
            className={errors.sector ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
            options={sectors}
            placeholder="Select Sector..."
          />
          <FieldError message={errors.sector} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel required>Origin Hub</FieldLabel>
          <CommonDropdown
            value={form.originHub}
            onChange={(val) => setForm({ ...form, originHub: val })}
            className={errors.originHub ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
            options={hubs}
            placeholder="Select Origin Hub..."
          />
          <FieldError message={errors.originHub} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel required>Destination Hub</FieldLabel>
          <CommonDropdown
            value={form.destinationHub}
            onChange={(val) => setForm({ ...form, destinationHub: val })}
            className={errors.destinationHub ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
            options={hubs}
            placeholder="Select Destination Hub..."
          />
          <FieldError message={errors.destinationHub} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel required>Product</FieldLabel>
          <CommonDropdown
            value={form.product}
            onChange={(val) => setForm({ ...form, product: val })}
            className={errors.product ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
            options={products}
            placeholder="Select Product..."
          />
          <FieldError message={errors.product} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel required>Booking Date</FieldLabel>
          <CustomDatePicker
            value={form.bookingDate}
            onChange={(val) => setForm({ ...form, bookingDate: val })}
            placeholder="Select Booking Date"
            className={errors.bookingDate ? "!border-red-400 !bg-red-50/40" : ""}
          />
          <FieldError message={errors.bookingDate} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel required>Service</FieldLabel>
          <CommonDropdown
            value={form.service}
            onChange={(val) => setForm({ ...form, service: val })}
            className={errors.service ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
            options={services}
            placeholder="Select Service..."
          />
          <FieldError message={errors.service} />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Vendor</FieldLabel>
          <div className="relative">
            <CommonDropdown value={form.vendor} onChange={(val) => setForm({ ...form, vendor: val })} className="w-full border-axc-border pr-10" options={vendors} placeholder="Select Vendor..." />
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              <EditIconButton active={form.editVendor} onToggle={() => setForm({ ...form, editVendor: !form.editVendor })} title="Edit Vendor" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Forwarding Number</FieldLabel>
          <input type="text" value={form.forwardingNumber} onChange={(e) => setForm({ ...form, forwardingNumber: e.target.value })} className={inputClass} placeholder="Forwarding Number" />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Forwarding Number 2</FieldLabel>
          <input type="text" value={form.forwardingNumber2} onChange={(e) => setForm({ ...form, forwardingNumber2: e.target.value })} className={inputClass} placeholder="Forwarding Number" />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Reference Number</FieldLabel>
          <input type="text" value={form.referenceNumber} onChange={(e) => setForm({ ...form, referenceNumber: e.target.value })} className={inputClass} placeholder="Reference Number" />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Shipment Value</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" placeholder="Value" value={form.shipmentValue} onChange={(e) => setForm({ ...form, shipmentValue: e.target.value })} className={inputClass} />
            <CommonDropdown className="border-axc-border" value={form.shipmentCurrency} onChange={(val) => setForm({ ...form, shipmentCurrency: val })} options={currencies} placeholder="Currency" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Invoice Date</FieldLabel>
          <CustomDatePicker
            value={form.invoiceDate}
            onChange={(val) => setForm({ ...form, invoiceDate: val })}
            placeholder="Select Invoice Date"
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Invoice Number</FieldLabel>
          <div className="relative">
            <input
              type="text"
              value={form.invoiceNumber}
              readOnly={!form.editInvoice}
              onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
              className={`${inputClass} w-full pr-10 text-regular-small ${form.editInvoice ? "bg-white" : "bg-gray-100 text-axc-dark-gray cursor-not-allowed"}`}
              placeholder="Invoice Number"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              <EditIconButton
                active={form.editInvoice}
                onToggle={() => setForm({ ...form, editInvoice: !form.editInvoice })}
                title="Edit Invoice Number"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2 xl:col-span-3">
          <label className="text-regular-medium text-axc-dark-gray">Content</label>
          <textarea rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className={`${inputClass} focus:outline-none border-axc-border border`} placeholder="Content here" />
        </div>

        <div className="flex flex-col  sm:col-span-2 xl:col-span-3 border border-axc-border rounded-md">
          <PanelHeader title="Contract ID" />
          <div className="p-4">
            <div className="border border-axc-border rounded-lg overflow-hidden bg-white ">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-axc-navy/10 border-b border-axc-border">
                  <th className="w-1/3 py-3 border-r border-axc-border text-sm font-medium text-axc-dark-gray"></th>
                  <th className="w-1/3 py-3 border-r border-axc-border text-sm font-medium text-axc-dark-gray">Customer</th>
                  <th className="w-1/3 py-3 text-sm font-medium text-axc-dark-gray">Vendor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-axc-border">
                <tr>
                  <td className="py-2.5 px-4 border-r border-axc-border text-regular-small text-axc-dark-gray text-left">Rate Contract</td>
                  <td className="border-r border-axc-border px-2">
                    <input
                      type="text"
                      value={form.rateContractCustomer}
                      onChange={(e) => setForm({ ...form, rateContractCustomer: e.target.value })}
                      className="w-full border-none focus:outline-none text-center py-1 text-regular-small bg-transparent"
                    />
                  </td>
                  <td className="px-2">
                    <input
                      type="text"
                      value={form.rateContractVendor}
                      onChange={(e) => setForm({ ...form, rateContractVendor: e.target.value })}
                      className="w-full border-none focus:outline-none text-center py-1 text-regular-small bg-transparent"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 border-r border-axc-border text-regular-small text-axc-dark-gray text-left">CFT Contract</td>
                  <td className="border-r border-axc-border px-2">
                    <input
                      type="text"
                      value={form.cftContractCustomer}
                      onChange={(e) => setForm({ ...form, cftContractCustomer: e.target.value })}
                      className="w-full border-none focus:outline-none text-center py-1 text-regular-small bg-transparent"
                    />
                  </td>
                  <td className="px-2">
                    <input
                      type="text"
                      value={form.cftContractVendor}
                      onChange={(e) => setForm({ ...form, cftContractVendor: e.target.value })}
                      className="w-full border-none focus:outline-none text-center py-1 text-regular-small bg-transparent"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 border-r border-axc-border text-regular-small text-axc-dark-gray text-left">TAT</td>
                  <td className="border-r border-axc-border px-2">
                    <input
                      type="text"
                      value={form.tatCustomer}
                      onChange={(e) => setForm({ ...form, tatCustomer: e.target.value })}
                      className="w-full border-none focus:outline-none text-center py-1 text-regular-small bg-transparent"
                    />
                  </td>
                  <td className="px-2">
                    <input
                      type="text"
                      value={form.tatVendor}
                      onChange={(e) => setForm({ ...form, tatVendor: e.target.value })}
                      className="w-full border-none focus:outline-none text-center py-1 text-regular-small bg-transparent"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          </div>
          
          
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:col-span-2 xl:col-span-3 mt-2">
          <div className="flex flex-col gap-1">
            <FieldLabel>Origin Hub</FieldLabel>
            <div className="relative">
              <CommonDropdown
                value={form.originHub}
                onChange={(val) => setForm({ ...form, originHub: val })}
                className="w-full border-axc-border pr-10"
                placeholder="SELECT ORIGIN HUB..."
                options={hubs}
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <EditIconButton active={form.editOriginHub} onToggle={() => setForm({ ...form, editOriginHub: !form.editOriginHub })} title="Edit Origin Hub" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Duty</FieldLabel>
            <CommonDropdown
              value={form.duty}
              onChange={(val) => setForm({ ...form, duty: val })}
              className="w-full border-axc-border"
              placeholder="SELECT DUTY..."
              options={[
                { value: "Shipper", label: "Shipper" },
                { value: "Receiver", label: "Receiver" },

              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}