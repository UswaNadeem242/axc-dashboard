"use client";
import React from "react";
import CommonDropdown from "../../../src/common/dropdown";
import CommonTable from "../../../src/common/table";
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
    <div className="bg-white rounded-xl border border-axc-border shadow-sm overflow-hidden flex flex-col">
      <PanelHeader title="Invoice Details" />
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="flex flex-col gap-1">
          <FieldLabel required>Invoice No.</FieldLabel>
          <input
            type="text"
            value={form.invoiceNo}
            onChange={(e) => setForm((prev) => ({ ...prev, invoiceNo: e.target.value }))}
            className={inputClass}
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
            className="border-axc-border"
            placeholder="SELECT..."
            options={[{ value: "USD", label: "USD" }, { value: "INR", label: "INR" }]}
          />
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <FieldLabel>Note For Customer</FieldLabel>
          <textarea
            rows={2}
            value={form.noteForCustomer}
            onChange={(e) => setForm((prev) => ({ ...prev, noteForCustomer: e.target.value }))}
            className={`${inputClass} text-xs`}
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onCreateInvoice}
            disabled={loading}
            className="px-4 py-2 bg-axc-navy hover:bg-axc-navy/80 text-white rounded text-xs font-bold shadow-sm transition uppercase cursor-pointer disabled:opacity-60"
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

  const awbHeadings = [
    {
      label: "AWB Number",
      key: "awbNumber",
      render: (row: AwbInvoiceRow) => (
        <input
          type="text"
          placeholder="AWB NO..."
          value={row.awbNumber}
          onChange={(e) => updateAwbRow(row.id, "awbNumber", e.target.value)}
          className="w-full min-w-[120px] bg-white border border-axc-border rounded px-1.5 py-1 text-[11px] focus:outline-none"
        />
      ),
    },
    { label: "Booking Date", key: "bookingDate" },
    { label: "Forwarding Number", key: "forwardingNumber" },
    { label: "Destination", key: "destination" },
    { label: "Product", key: "product" },
    { label: "PCS", key: "pcs" },
    { label: "FSC", key: "fsc" },
    { label: "Chargeable Weight", key: "chargeableWeight" },
    { label: "Freight Amount", key: "freightAmount" },
    { label: "Grand Total", key: "grandTotal" },
    { label: "Action", key: "action" },
  ];

  return (
    <div className="bg-white rounded-xl border border-axc-border shadow-sm overflow-hidden flex flex-col">
      <div className="px-4 py-2 border-b border-axc-border text-[11px] font-bold text-gray-700">
        TOTAL NO. OF AWB: {awbRows.length}
      </div>

      <div className="p-4 flex flex-col gap-3">
        <CommonTable
          headings={awbHeadings}
          data={awbRows}
          rowKey="id"
          itemsPerPage={Math.max(awbRows.length, 1)}
          emptyMessage="No AWB added"
          renderActions={(row: AwbInvoiceRow) => (
            <button
              type="button"
              onClick={() => removeAwbRow(row.id)}
              className="inline-flex items-center gap-1 text-axc-red hover:text-red-800 font-bold text-[10px] cursor-pointer"
            >
              <span className="inline-block w-3.5 h-3.5 rounded-full border border-axc-red text-center leading-3 font-extrabold text-[9px] shrink-0">x</span>
              REMOVE
            </button>
          )}
        />

        {errors.awbRows && <span className="text-[10px] text-red-500 block">{errors.awbRows}</span>}

        {awbRows.length > 0 && (
          <div className="flex justify-end">
            <div className="flex items-center gap-2 text-[11px] font-bold text-gray-700">
              <span>GRAND TOTAL</span>
              <input
                type="text"
                readOnly
                value={totalGrandTotal}
                className="w-28 border border-axc-border bg-gray-100 rounded px-2 py-1 text-center font-bold text-gray-600"
              />
            </div>
          </div>
        )}

        <div>
          <button
            type="button"
            onClick={addAwbRow}
            className="px-3 py-2 bg-axc-yellow hover:bg-axc-yellow/80 text-white rounded text-xs font-bold shadow-sm transition uppercase cursor-pointer"
          >
            + ADD AWB
          </button>
        </div>
      </div>
    </div>
  );
}