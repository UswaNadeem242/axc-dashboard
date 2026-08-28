"use client";
import React from "react";
import { Plus, Trash } from "lucide-react";
import CommonDropdown from "../../../src/common/dropdown";
import { AwbInvoiceRow, SingleInvoiceFormState, SingleInvoiceSearchState } from "./invoicestate";
import { FieldLabel, PanelHeader, inputClass } from "./invoiceform";

interface InvoiceDetailsProps {
  form: SingleInvoiceFormState;
  setForm: React.Dispatch<React.SetStateAction<SingleInvoiceFormState>>;
  errors?: Partial<Record<keyof SingleInvoiceSearchState | "invoiceNo" | "awbRows", string>>;
  onCreateInvoice: () => void;
  loading?: boolean;
}

export function SingleCustomerInvoiceDetails({ form, setForm, errors = {}, onCreateInvoice, loading }: InvoiceDetailsProps) {
  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col">
      <PanelHeader title="Invoice Details" />
      <div className="p-5 flex flex-col gap-3 text-xs">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div className="flex flex-col gap-1">
            <FieldLabel required>Invoice No.</FieldLabel>
            <input
              type="text"
              value={form.invoiceNo}
              onChange={(e) => setForm((prev) => ({ ...prev, invoiceNo: e.target.value }))}
              className={inputClass}
              placeholder="Invoice No."
            />
            {errors.invoiceNo && <span className="text-[10px] text-red-500">{errors.invoiceNo}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Due Date</FieldLabel>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
              className={inputClass}
              
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Invoice Date</FieldLabel>
            <input
              type="date"
              value={form.invoiceDate}
              onChange={(e) => setForm((prev) => ({ ...prev, invoiceDate: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Invoice Currency</FieldLabel>
            <CommonDropdown
              value={form.invoiceCurrency}
              onChange={(val) => setForm((prev) => ({ ...prev, invoiceCurrency: val }))}
              className="w-full border-axc-border"
              placeholder="SELECT..."
              options={[{ value: "USD", label: "USD" }, { value: "INR", label: "INR" }]}
            />
          </div>

          <div className="flex flex-col gap-1 col-span-2">
            <FieldLabel>Note For Customer</FieldLabel>
            <textarea
              rows={2}
              value={form.noteForCustomer}
              onChange={(e) => setForm((prev) => ({ ...prev, noteForCustomer: e.target.value }))}
              className={`${inputClass} outline-none`}
              placeholder="Note"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCreateInvoice}
            disabled={loading}
            className="px-5 py-4 bg-axc-navy text-white rounded-lg text-regular-small shadow-sm transition uppercase cursor-pointer disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface AwbTableSectionProps {
  awbRows: AwbInvoiceRow[];
  addAwbRow: () => void;
  updateAwbRow: <K extends keyof AwbInvoiceRow>(id: number, key: K, value: AwbInvoiceRow[K]) => void;
  removeAwbRow: (id: number) => void;
  errors?: { awbRows?: string };
}

export function AwbTableSection({ awbRows, addAwbRow, updateAwbRow, removeAwbRow, errors = {} }: AwbTableSectionProps) {
  const totalGrandTotal = awbRows.reduce((acc, row) => acc + Number(row.grandTotal || 0), 0);

  const cellText = (value: unknown) => (value === null || value === undefined ? "" : String(value));

  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col">
      <PanelHeader
        title="AWB Details"
        right={<span className="text-white text-xs px-2 py-0.5 rounded font-medium">TOTAL NO. OF AWB: {awbRows.length}</span>}
      />

      <div className="flex flex-col gap-3 p-5 text-xs">
        <div className="border border-axc-border rounded-lg overflow-x-auto">
          <table className="w-full text-[11px] border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-gray-50 border-b border-axc-border text-regular-medium text-axc-dark-gray  text-left">
                <th className="py-2 px-2 border-r border-axc-border">AWB Number</th>
                <th className="py-2 px-2 border-r border-axc-border">Booking Date</th>
                <th className="py-2 px-2 border-r border-axc-border">Forwarding Number</th>
                <th className="py-2 px-2 border-r border-axc-border">Destination</th>
                <th className="py-2 px-2 border-r border-axc-border">Product</th>
                <th className="py-2 px-2 border-r border-axc-border">PCS</th>
                <th className="py-2 px-2 border-r border-axc-border">FSC</th>
                <th className="py-2 px-2 border-r border-axc-border">Chargeable Weight</th>
                <th className="py-2 px-2 border-r border-axc-border">Freight Amount</th>
                <th className="py-2 px-2 border-r border-axc-border">Grand Total</th>
                <th className="py-2 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {awbRows.length === 0 && (
                <tr>
                  <td colSpan={11} className="text-center py-6 text-gray-400">
                    No AWB added
                  </td>
                </tr>
              )}
              {awbRows.map((row) => (
                <tr key={row.id} className="border-b border-axc-border last:border-b-0 hover:bg-gray-50/50">
                  <td className="border-r border-axc-border p-1">
                    <input
                      type="text"
                      placeholder="AWB NO..."
                      value={row.awbNumber}
                      onChange={(e) => updateAwbRow(row.id, "awbNumber", e.target.value)}
                      className="w-full min-w-[120px] bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none"
                    />
                  </td>
                  <td className="border-r border-axc-border p-1 text-center">{cellText(row.bookingDate)}</td>
                  <td className="border-r border-axc-border p-1 text-center">{cellText(row.forwardingNumber)}</td>
                  <td className="border-r border-axc-border p-1 text-center">{cellText(row.destination)}</td>
                  <td className="border-r border-axc-border p-1 text-center">{cellText(row.product)}</td>
                  <td className="border-r border-axc-border p-1 text-center">{cellText(row.pcs)}</td>
                  <td className="border-r border-axc-border p-1 text-center">{cellText(row.fsc)}</td>
                  <td className="border-r border-axc-border p-1 text-center">{cellText(row.chargeableWeight)}</td>
                  <td className="border-r border-axc-border p-1 text-center">{cellText(row.freightAmount)}</td>
                  <td className="border-r border-axc-border p-1 text-center">{cellText(row.grandTotal)}</td>
                  <td className="p-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeAwbRow(row.id)}
                      title="Remove AWB"
                      className="inline-flex items-center justify-center text-axc-red cursor-pointer"
                    >
                      <Trash size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {awbRows.length > 0 && (
                <tr className="bg-gray-50/50 border-t border-axc-border">
                  <td colSpan={8} className="py-2 px-3 border-r border-axc-border"></td>
                  <td colSpan={2} className="py-2 px-2 border-r border-axc-border text-right font-bold text-black">
                    <div className="flex items-center justify-end gap-2 text-sm">
                      <span>Grand Total</span>
                      <input
                        type="text"
                        readOnly
                        value={totalGrandTotal}
                        className="w-24 border outline-none border-axc-border bg-gray-100 rounded px-1.5 py-0.5 text-center font-bold text-gray-600"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-3"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {errors.awbRows && <span className="text-[10px] text-red-500 block">{errors.awbRows}</span>}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={addAwbRow}
            className="px-3 py-2 bg-axc-navy text-white rounded-lg text-regular-small transition uppercase cursor-pointer flex items-center gap-1.5"
          >
            <Plus size={15} />
            Add AWB
          </button>
        </div>
      </div>
    </div>
  );
}