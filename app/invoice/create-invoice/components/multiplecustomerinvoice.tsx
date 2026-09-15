"use client";
import React from "react";
import { Plus, Trash } from "lucide-react";
import CommonDropdown from "../../../src/common/dropdown";
import CustomDatePicker from "../../../src/common/datepicker";
import {
  MultipleAwbInvoiceRow,
  MultipleInvoiceFormState,
  MultipleInvoiceSearchState,
} from "./invoicestate";
import { FieldLabel, PanelHeader, inputClass } from "./invoiceform";

interface InvoiceDetailsProps {
  form: MultipleInvoiceFormState;
  setForm: React.Dispatch<React.SetStateAction<MultipleInvoiceFormState>>;
  errors?: Partial<
    Record<keyof MultipleInvoiceSearchState | "invoiceNo" | "awbRows", string>
  >;
  onCreateInvoice: () => void;
  loading?: boolean;
}

export function MultipleCustomerInvoiceDetails({
  form,
  setForm,
  errors = {},
  onCreateInvoice,
  loading,
}: InvoiceDetailsProps) {
  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col h-full">
      <PanelHeader title="Invoice Details" />
      <div className="p-4 flex flex-col justify-between flex-1 gap-3 text-xs">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex flex-col gap-1">
            <FieldLabel>Invoice Date</FieldLabel>
            <CustomDatePicker
              value={form.invoiceDate}
              onChange={(val) =>
                setForm((prev) => ({ ...prev, invoiceDate: val }))
              }
              placeholder="Select Invoice Date"
            />
          </div>
          <div className="flex flex-col gap-1">
            <FieldLabel>Due Date</FieldLabel>
            <CustomDatePicker
              value={form.dueDate}
              onChange={(val) => setForm((prev) => ({ ...prev, dueDate: val }))}
              placeholder="Select Due Date"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Note For Customer</FieldLabel>
            <textarea
              value={form.noteForCustomer}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  noteForCustomer: e.target.value,
                }))
              }
              className={`${inputClass} min-h-[100px] resize-y`}
              placeholder="Note"
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface AwbTableSectionProps {
  awbRows: MultipleAwbInvoiceRow[];
  addAwbRow: () => void;
  updateAwbRow: <K extends keyof MultipleAwbInvoiceRow>(
    id: number,
    key: K,
    value: MultipleAwbInvoiceRow[K],
  ) => void;
  removeAwbRow: (id: number) => void;
  errors?: { awbRows?: string };
}

export function AwbTableSection({
  awbRows,
  addAwbRow,
  updateAwbRow,
  removeAwbRow,
  errors = {},
}: AwbTableSectionProps) {
  const totalGrandTotal = awbRows.reduce(
    (acc, row) => acc + Number(row.grandTotal || 0),
    0,
  );

  const cellText = (value: unknown) =>
    value === null || value === undefined ? "" : String(value);

  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col">
      <PanelHeader
        title="AWB Details"
        right={
          <span className="text-white text-xs px-2 py-0.5 rounded font-medium">
            TOTAL NO. OF AWB: {awbRows.length}
          </span>
        }
      />

      <div className="flex flex-col gap-3 p-4 text-xs">
        <div className="border border-axc-border rounded-lg overflow-x-auto">
          <table className="w-full text-[11px] border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-axc-navy/10 border-b border-axc-border text-regular-medium text-axc-dark-gray  text-left">
                <th className="py-2.5 px-2 border-r border-axc-border">Sr.No.</th>
                <th className="py-2.5 px-2 border-r border-axc-border">
                  Customer Name
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border">
                  Customer Code
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border">
                  AWB Count
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border">
                  Chargeable Weight
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border">
                  Freight Amount
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border">
                  Freight Zero AWB
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border">VAT</th>
                <th className="py-2.5 px-2">Grand Total</th>
                <th className="py-2.5 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {awbRows.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-6 text-gray-400">
                    No Customer added
                  </td>
                </tr>
              )}
              {awbRows.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b border-axc-border last:border-b-0 hover:bg-gray-50/50"
                >
                  <td className="border-r border-axc-border p-1 text-center">
                    {index + 1}
                  </td>
                  <td className="border-r border-axc-border p-1 text-center">
                    <input
                      type="text"
                      placeholder="Customer Name"
                      value={row.customerName}
                      onChange={(e) =>
                        updateAwbRow(row.id, "customerName", e.target.value)
                      }
                      className="w-full min-w-[120px] bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none"
                    />
                  </td>
                  <td className="border-r border-axc-border p-1 text-center">
                    <input
                      type="text"
                      placeholder="Cstomer Code"
                      value={row.customerCode}
                      onChange={(e) =>
                        updateAwbRow(row.id, "customerCode", e.target.value)
                      }
                      className="w-full min-w-[120px] bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none"
                    />
                  </td>
                  <td className="border-r border-axc-border p-1 text-center">
                    <input
                      type="text"
                      value={row.awbCount}
                      onChange={(e) =>
                        updateAwbRow(row.id, "awbCount", e.target.value)
                      }
                      className="w-full min-w-[120px] bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none"
                    />
                  </td>
                  <td className="border-r border-axc-border p-1 text-center">
                    <input
                      type="text"
                      value={row.chargeableWeight}
                      onChange={(e) =>
                        updateAwbRow(row.id, "chargeableWeight", e.target.value)
                      }
                      className="w-full min-w-[120px] bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none"
                    />
                  </td>
                  <td className="border-r border-axc-border p-1 text-center">
                    <input
                      type="text"
                      value={row.freightAmount}
                      onChange={(e) =>
                        updateAwbRow(row.id, "freightAmount", e.target.value)
                      }
                      className="w-full min-w-[120px] bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none"
                    />
                  </td>
                  <td className="border-r border-axc-border p-1 text-center">
                    <input
                      type="text"
                      value={row.freightZeroAwb}
                      onChange={(e) =>
                        updateAwbRow(row.id, "freightZeroAwb", e.target.value)
                      }
                      className="w-full min-w-[120px] bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none"
                    />
                  </td>
                  <td className="border-r border-axc-border p-1 text-center">
                    <input
                      type="text"
                      value={row.vat}
                      onChange={(e) =>
                        updateAwbRow(row.id, "vat", e.target.value)
                      }
                      className="w-full min-w-[120px] bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none"
                    />
                  </td>
                  <td className="p-1 text-center">
                    <input
                      type="text"
                      value={row.grandTotal}
                      onChange={(e) =>
                        updateAwbRow(row.id, "grandTotal", e.target.value)
                      }
                      className="w-full min-w-[120px] bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none"
                    />
                  </td>
                  <td className="p-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeAwbRow(row.id)}
                      title="Remove customer"
                      className="inline-flex items-center justify-center cursor-pointer rounded-md border border-axc-red/30 p-1.5 text-axc-red transition hover:bg-axc-red/10"
                    >
                      <Trash size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {awbRows.length > 0 && (
                <tr className="bg-gray-50/50 border-t border-axc-border">
                  <td
                    colSpan={8}
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
                        value={totalGrandTotal}
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

        {errors.awbRows && (
          <span className="text-[10px] text-red-500 block">
            {errors.awbRows}
          </span>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={addAwbRow}
            className="p-1 text-white rounded-full ring ring-axc-yellow transition capitalize cursor-pointer flex justify-center items-center hover:bg-axc-yellow/10"
            title="Add Customer"
          >
            <Plus size={15} strokeWidth={3} className="text-axc-yellow" />
          </button>
        </div>
      </div>
    </div>
  );
}
