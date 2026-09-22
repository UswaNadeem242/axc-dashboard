"use client";
import React from "react";
import { Plus, Trash } from "lucide-react";
import CustomDatePicker from "../../../src/common/datepicker";
import Dropdown from "../../../src/common/dropdown"; 
import {
  AwbLessInvoiceFormState,
  AwbLessInvoiceItemRow,
} from "./invoicestate";
import { FieldLabel, PanelHeader, inputClass } from "./invoiceform";
import { showToast } from "../../../src/common/toast";

const addrTypeOptions = [
  { value: "Billing", label: "Billing" },
  { value: "Shipping", label: "Shipping" },
];
const billingCompanyOptions = [
  { value: "Company A", label: "Company A" },
  { value: "Company B", label: "Company B" },
];
const invoiceRangeOptions = [
  { value: "Range 1", label: "Range 1" },
  { value: "Range 2", label: "Range 2" },
];
const invoiceTypeOptions = [
  { value: "Tax Invoice", label: "Tax Invoice" },
  { value: "Proforma Invoice", label: "Proforma Invoice" },
];
const bankDetailsOptions = [
  { value: "Bank A", label: "Bank A" },
  { value: "Bank B", label: "Bank B" },
];
const descriptionOptions = [
  { value: "Freight Charges", label: "Freight Charges" },
  { value: "Handling Charges", label: "Handling Charges" },
  { value: "Documentation Charges", label: "Documentation Charges" },
  { value: "Other Charges", label: "Other Charges" },
];
const vatTypeOptions = [
  { value: "Standard", label: "Standard" },
  { value: "Zero Rated", label: "Zero Rated" },
  { value: "Exempt", label: "Exempt" },
];

interface AwbLessInvoiceDetailsProps {
  form: AwbLessInvoiceFormState;
  setForm: React.Dispatch<React.SetStateAction<AwbLessInvoiceFormState>>;
}

export function AwbLessInvoiceDetails({
  form,
  setForm,
}: AwbLessInvoiceDetailsProps) {
  const updateForm = <K extends keyof AwbLessInvoiceFormState>(
    key: K,
    value: AwbLessInvoiceFormState[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col w-full">
      <PanelHeader title="Add AWB Less Invoice" />
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="flex flex-col gap-1">
          <FieldLabel required>Invoice Number</FieldLabel>
          <input
            type="text"
            placeholder="Invoice Number"
            value={form.invoiceNumber}
            onChange={(e) => updateForm("invoiceNumber", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel required>Customer</FieldLabel>
          <input
            type="text"
            placeholder="Customer"
            value={form.customer}
            onChange={(e) => updateForm("customer", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Addr. Type</FieldLabel>
          <Dropdown
            options={addrTypeOptions}
            value={form.addrType}
            onChange={(val) => updateForm("addrType", val)}
            placeholder="Select..."
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>From Date</FieldLabel>
          <CustomDatePicker
            value={form.fromDate}
            onChange={(val) => updateForm("fromDate", val)}
            placeholder="Select From Date"
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Till Date</FieldLabel>
          <CustomDatePicker
            value={form.tillDate}
            onChange={(val) => updateForm("tillDate", val)}
            placeholder="Select Till Date"
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel required>Billing Company</FieldLabel>
          <Dropdown
            options={billingCompanyOptions}
            value={form.billingCompany}
            onChange={(val) => updateForm("billingCompany", val)}
            placeholder="Select..."
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel required>Invoice Range Master</FieldLabel>
          <Dropdown
            options={invoiceRangeOptions}
            value={form.invoiceRangeMaster}
            onChange={(val) => updateForm("invoiceRangeMaster", val)}
            placeholder="Select..."
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Invoice Type</FieldLabel>
          <Dropdown
            options={invoiceTypeOptions}
            value={form.invoiceType}
            onChange={(val) => updateForm("invoiceType", val)}
            placeholder="Select..."
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Run No</FieldLabel>
          <input
            type="text"
            value={form.runNo}
            onChange={(e) => updateForm("runNo", e.target.value)}
            className={inputClass}
            placeholder="Run number"
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Sub Agent</FieldLabel>
          <input
            type="text"
            value={form.subAgent}
            onChange={(e) => updateForm("subAgent", e.target.value)}
            className={inputClass}
            placeholder="Sub agent"
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>IRN</FieldLabel>
          <input
            type="text"
            value={form.irn}
            onChange={(e) => updateForm("irn", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Goods Description</FieldLabel>
          <input
            type="text"
            value={form.goodsDescription}
            onChange={(e) => updateForm("goodsDescription", e.target.value)}
            className={inputClass}
            placeholder="Goods description"
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Job No</FieldLabel>
          <input
            type="text"
            value={form.jobNo}
            onChange={(e) => updateForm("jobNo", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Bank Details</FieldLabel>
          <Dropdown
            options={bankDetailsOptions}
            value={form.bankDetails}
            onChange={(val) => updateForm("bankDetails", val)}
            placeholder="Select..."
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>POD</FieldLabel>
          <input
            type="text"
            value={form.pod}
            onChange={(e) => updateForm("pod", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>POL</FieldLabel>
          <input
            type="text"
            value={form.pol}
            onChange={(e) => updateForm("pol", e.target.value)}
            className={inputClass}
            placeholder="Port of Loading"
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel required>Invoice Date</FieldLabel>
          <CustomDatePicker
            value={form.invoiceDate}
            onChange={(val) => updateForm("invoiceDate", val)}
            placeholder="Select Invoice Date"
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Due Date</FieldLabel>
          <CustomDatePicker
            value={form.dueDate}
            onChange={(val) => updateForm("dueDate", val)}
            placeholder="Select Due Date"
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>AWB No.</FieldLabel>
          <input
            placeholder="AWB No."
            type="text"
            value={form.awbNo}
            onChange={(e) => updateForm("awbNo", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>MAWB No.</FieldLabel>
          <input
           placeholder="MAWB No."
            type="text"
            value={form.mawbNo}
            onChange={(e) => updateForm("mawbNo", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Port Of Departure</FieldLabel>
          <input
          placeholder="Port of Departure"
            type="text"
            value={form.portOfDeparture}
            onChange={(e) => updateForm("portOfDeparture", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Port Of Arrival</FieldLabel>
          <input
          placeholder="Port of Arrival"
            type="text"
            value={form.portOfArrival}
            onChange={(e) => updateForm("portOfArrival", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Gross Weight</FieldLabel>
          <input
            type="text"
            value={form.grossWeight}
            onChange={(e) => updateForm("grossWeight", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Packages</FieldLabel>
          <input
          placeholder="Packages"
            type="text"
            value={form.packages}
            onChange={(e) => updateForm("packages", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Airline</FieldLabel>
          <input
            type="text"
            value={form.airline}
            onChange={(e) => updateForm("airline", e.target.value)}
            className={inputClass}
            placeholder="Airline"
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Shipper Name</FieldLabel>
          <input
            type="text"
            value={form.shipperName}
            onChange={(e) => updateForm("shipperName", e.target.value)}
            className={inputClass}
            placeholder="Shipper namee"
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Vehical No.</FieldLabel>
          <input
            type="text"
            value={form.vehicalNo}
            onChange={(e) => updateForm("vehicalNo", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Vehical Wt.</FieldLabel>
          <input
            type="text"
            value={form.vehicalWt}
            onChange={(e) => updateForm("vehicalWt", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Challan No.</FieldLabel>
          <input
            type="text"
            value={form.challanNo}
            onChange={(e) => updateForm("challanNo", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>PDF Type</FieldLabel>
          <div className="flex items-center gap-4 h-full pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.pdfTypeAir}
                onChange={(e) => updateForm("pdfTypeAir", e.target.checked)}
              />
              Air
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.pdfTypeCargo}
                onChange={(e) => updateForm("pdfTypeCargo", e.target.checked)}
              />
              Cargo
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-1 md:col-span-3">
          <FieldLabel>Note For Customer</FieldLabel>
          <textarea
            value={form.noteForCustomer}
            onChange={(e) => updateForm("noteForCustomer", e.target.value)}
            className={`${inputClass} min-h-[70px] resize-y`}
            placeholder="Note for customers"
          />
        </div>
      </div>
    </div>
  );
}

interface AwbLessInvoiceItemsSectionProps {
  form: AwbLessInvoiceFormState;
  setForm: React.Dispatch<React.SetStateAction<AwbLessInvoiceFormState>>;
  items: AwbLessInvoiceItemRow[];
  addItemRow: () => void;
  updateItemRow: <K extends keyof AwbLessInvoiceItemRow>(
    id: number,
    key: K,
    value: AwbLessInvoiceItemRow[K],
  ) => void;
  removeItemRow: (id: number) => void;
}

export function AwbLessInvoiceItemsSection({
  form,
  setForm,
  items,
  addItemRow,
  updateItemRow,
  removeItemRow,
}: AwbLessInvoiceItemsSectionProps) {
  const itemsTotal = items.reduce(
    (acc, row) => acc + (Number(row.total) || 0),
    0,
  );
  const roundOffValue = Number(form.roundOff) || 0;
  const grandTotal = itemsTotal + roundOffValue;

  const handleRemoveItemRow = (id: number) => {
    removeItemRow(id);
    showToast({ variant: "success", message: "Item removed successfully" });
  };

  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col w-full">
      <PanelHeader title="Item Details" />
      <div className="flex flex-col gap-3 p-4 text-xs">
        <div className="border border-axc-border rounded-lg overflow-x-auto">
          <table className="w-full text-[11px] border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-axc-navy/10 border-b border-axc-border text-regular-medium text-axc-dark-gray text-left">
                <th className="py-2.5 px-2 border-r border-axc-border">
                  Description
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border">SAC</th>
                <th className="py-2.5 px-2 border-r border-axc-border">Rate</th>
                <th className="py-2.5 px-2 border-r border-axc-border">PCS</th>
                <th className="py-2.5 px-2 border-r border-axc-border">
                  Amount
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border">
                  VAT Type
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border">
                  Tax %
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border">
                  Total
                </th>
                <th className="py-2.5 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-6 text-gray-400">
                    No item added
                  </td>
                </tr>
              )}
              {items.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-axc-border last:border-b-0 hover:bg-gray-50/50"
                >
                  <td className="border-r border-axc-border p-1">
                    <div className="flex flex-col gap-1 min-w-[170px]">
                      {row.isCustomDescription ? (
                        <input
                          type="text"
                          placeholder="Description"
                          value={row.description}
                          onChange={(e) =>
                            updateItemRow(row.id, "description", e.target.value)
                          }
                          className="w-full bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none"
                        />
                      ) : (
                        <Dropdown
                          options={descriptionOptions}
                          value={row.description}
                          onChange={(val) =>
                            updateItemRow(row.id, "description", val)
                          }
                          placeholder="Select..."
                        />
                      )}
                      <label className="flex items-center gap-1 text-regular-small text-axc-dark-gray whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={row.isCustomDescription}
                          onChange={(e) =>
                            updateItemRow(
                              row.id,
                              "isCustomDescription",
                              e.target.checked,
                            )
                          }
                        />
                        Is custom description?
                      </label>
                    </div>
                  </td>
                  <td className="border-r border-axc-border p-1 text-center">
                    <input
                      type="text"
                      value={row.sac}
                      onChange={(e) =>
                        updateItemRow(row.id, "sac", e.target.value)
                      }
                      className="w-full min-w-[90px] bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none"
                    />
                  </td>
                  <td className="border-r border-axc-border p-1 text-center">
                    <input
                      type="text"
                      value={row.rate}
                      onChange={(e) =>
                        updateItemRow(row.id, "rate", e.target.value)
                      }
                      className="w-full min-w-[90px] bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none"
                    />
                  </td>
                  <td className="border-r border-axc-border p-1 text-center">
                    <input
                      type="text"
                      value={row.pcs}
                      onChange={(e) =>
                        updateItemRow(row.id, "pcs", e.target.value)
                      }
                      className="w-full min-w-[80px] bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none"
                    />
                  </td>
                  <td className="border-r border-axc-border p-1 text-center">
                    <input
                      type="text"
                      value={row.amount}
                      onChange={(e) =>
                        updateItemRow(row.id, "amount", e.target.value)
                      }
                      className="w-full min-w-[100px] bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none"
                    />
                  </td>
                  <td className="border-r border-axc-border p-1 text-center">
                    <div className="min-w-[130px]">
                      <Dropdown
                        options={vatTypeOptions}
                        value={row.vatType}
                        onChange={(val) =>
                          updateItemRow(row.id, "vatType", val)
                        }
                        placeholder="Select..."
                      />
                    </div>
                  </td>
                  <td className="border-r border-axc-border p-1 text-center">
                    <input
                      type="text"
                      value={row.taxPercent}
                      onChange={(e) =>
                        updateItemRow(row.id, "taxPercent", e.target.value)
                      }
                      className="w-full min-w-[80px] bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none"
                    />
                  </td>
                  <td className="border-r border-axc-border p-1 text-center">
                    <input
                      type="text"
                      readOnly
                      value={row.total}
                      className="w-full min-w-[90px] bg-gray-100 border border-axc-border rounded px-1.5 py-2 focus:outline-none text-gray-600 font-medium"
                    />
                  </td>
                  <td className="p-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItemRow(row.id)}
                      title="Remove item"
                      className="inline-flex items-center justify-center cursor-pointer rounded-md border border-axc-red/30 p-1.5 text-axc-red transition hover:bg-axc-red/10"
                    >
                      <Trash size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length > 0 && (
                <tr className="bg-gray-50/50 border-t border-axc-border">
                  <td
                    colSpan={7}
                    className="py-2 px-3 border-r border-axc-border"
                  ></td>
                  <td
                    colSpan={1}
                    className="py-2 px-2 border-r border-axc-border text-right font-bold text-black"
                  >
                    <div className="flex items-center justify-around gap-2 text-sm">
                      <span>Grand Total</span>
                      <input
                        type="text"
                        readOnly
                        value={grandTotal}
                        className="w-24 border outline-none border-axc-border bg-gray-100 rounded px-1.5 py-2.5 text-center font-bold text-gray-600"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-3"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={addItemRow}
            className="p-1 text-white rounded-full ring ring-axc-yellow transition capitalize cursor-pointer flex justify-center items-center hover:bg-axc-yellow/10"
            title="Add Item"
          >
            <Plus size={15} strokeWidth={3} className="text-axc-yellow" />
          </button>

          <div className="flex items-center gap-3"></div>
        </div>
      </div>
    </div>
  );
}