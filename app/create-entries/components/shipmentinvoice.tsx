"use client";
import React from "react";
import CommonDropdown from "../../src/common/dropdown";
import { AwbFormState, InvoiceItem } from "./formstate";
import { FieldLabel, inputClass } from "./form";
import { Plus, Trash } from "lucide-react";

interface Props {
  form: AwbFormState;
  setForm: React.Dispatch<React.SetStateAction<AwbFormState>>;
  invoiceItems: InvoiceItem[];
  setInvoiceItems: React.Dispatch<React.SetStateAction<InvoiceItem[]>>;
  addInvoiceItem: () => void;
  removeInvoiceItem: (id: number) => void;
}

export default function ShipmentInvoiceSection({
  form,
  setForm,
  invoiceItems,
  setInvoiceItems,
  addInvoiceItem,
  removeInvoiceItem,
}: Props) {
  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col">
      <div className="text-white bg-axc-navy/60 p-4 rounded-tl-lg rounded-tr-lg flex items-center justify-between gap-2">
        <label className="flex items-center gap-2 text-sm font-bold tracking-wider cursor-pointer">
          <input
            type="checkbox"
            checked={form.createShipmentInvoice}
            onChange={(e) =>
              setForm({ ...form, createShipmentInvoice: e.target.checked })
            }
            className="h-4 w-4 rounded border-axc-border text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span>Create Shipment Invoice?</span>
        </label>
      </div>

      {form.createShipmentInvoice && (
        <div className="flex flex-col gap-4 p-4 animate-in fade-in duration-200 text-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3">
            <div className="flex flex-col gap-1">
              <FieldLabel>Invoice Type</FieldLabel>
              <CommonDropdown
                value={form.invoiceType}
                onChange={(val) => setForm({ ...form, invoiceType: val })}
                className="border-axc-border"
                options={[
                  { value: "INVOICE", label: "INVOICE" },
                  { value: "PROFORMA", label: "PROFORMA" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-1">
              <FieldLabel>Currency</FieldLabel>
              <CommonDropdown
                value={form.invoiceCurrency}
                onChange={(val) => setForm({ ...form, invoiceCurrency: val })}
                className="border-axc-border"
                options={[
                  { value: "USD", label: "USD" },
                  { value: "INR", label: "INR" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-1">
              <FieldLabel>Incoterms</FieldLabel>
              <CommonDropdown
                value={form.incoterms}
                onChange={(val) => setForm({ ...form, incoterms: val })}
                className="border-axc-border"
                options={[
                  { value: "DDU", label: "DDU" },
                  { value: "DDP", label: "DDP" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-1">
              <FieldLabel>Note</FieldLabel>
              <CommonDropdown
                value={form.invoiceNote}
                onChange={(val) => setForm({ ...form, invoiceNote: val })}
                className="border-axc-border"
                options={[
                  { value: "GIFT", label: "GIFT" },
                  { value: "SAMPLE", label: "SAMPLE" },
                  { value: "COMMERCIAL", label: "COMMERCIAL" },
                ]}
              />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-1 xl:col-span-2">
              <FieldLabel>Declaration</FieldLabel>
              <input
                type="text"
                value={form.invoiceDeclaration}
                onChange={(e) =>
                  setForm({ ...form, invoiceDeclaration: e.target.value })
                }
                className={inputClass}
                placeholder="Declaration"
              />
            </div>
          </div>

          <div className="mt-2">
            <div className="bg-axc-navy/60 rounded-tl-lg rounded-tr-lg text-white text-regular-medium font-bold p-4 capitalize tracking-wide">
              Shipment Invoice Items
            </div>
            <div className="border border-axc-border border-t-0 overflow-x-auto p-4">
              <table className="w-full text-sm border-collapse min-w-[950px] border border-axc-border rounded-md p-4">
                <thead>
                  <tr className="bg-axc-navy/10 text-regular-medium text-axc-dark-gray text-left whitespace-nowrap">
                    <th className="py-2.5 px-3 border-r border-axc-border rounded-tl-md">Box#</th>
                    <th className="py-2.5 px-2 border-r border-axc-border">Sr#</th>
                    <th className="py-2.5 px-2 border-r border-axc-border w-1/5">Description</th>
                    <th className="py-2.5 px-2 border-r border-axc-border">HS Code</th>
                    <th className="py-2.5 px-2 border-r border-axc-border whitespace-nowrap min-w-[110px]">Unit Type</th>
                    <th className="py-2.5 px-2 border-r border-axc-border whitespace-nowrap">Quantity</th>
                    <th className="py-2.5 px-2 border-r border-axc-border whitespace-nowrap">Unit Weight</th>
                    <th className="py-2.5 px-2 border-r border-axc-border whitespace-nowrap">IGST</th>
                    <th className="py-2.5 px-2 border-r border-axc-border whitespace-nowrap">Unit Rates</th>
                    <th className="py-2.5 px-2 border-r border-axc-border whitespace-nowrap">Amount</th>
                    <th className="py-2.5 px-2 text-center rounded-tr-md whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.map((item, idx) => (
                    <tr key={item.id} className="border-b border-axc-border last:border-b-0 hover:bg-gray-50/50">
                      <td className="p-1 pl-3 min-w-[100px]">
                        <CommonDropdown
                          value={item.boxNo}
                          onChange={(val) => {
                            const updated = [...invoiceItems];
                            updated[idx].boxNo = val;
                            setInvoiceItems(updated);
                          }}
                          className="w-full py-2 !px-1.5 border-axc-border"
                          placeholder="Select..."
                          options={[{ value: "1", label: "Box 1" }]}
                        />
                      </td>
                      <td className="text-center bg-gray-50 text-gray-600 font-medium">{item.srNo}</td>
                      <td className="p-1">
                        <input
                          type="text"
                          placeholder="SEARCH HERE..."
                          value={item.description}
                          onChange={(e) => {
                            const updated = [...invoiceItems];
                            updated[idx].description = e.target.value;
                            setInvoiceItems(updated);
                          }}
                          className="w-full bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none shadow-none"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={item.hsCode}
                          onChange={(e) => {
                            const updated = [...invoiceItems];
                            updated[idx].hsCode = e.target.value;
                            setInvoiceItems(updated);
                          }}
                          className="w-28 bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none text-center"
                        />
                      </td>
                      <td className="p-1 min-w-[110px]">
                        <CommonDropdown
                          value={item.unitType}
                          onChange={(val) => {
                            const updated = [...invoiceItems];
                            updated[idx].unitType = val;
                            setInvoiceItems(updated);
                          }}
                          className="w-full py-2 !px-1.5 border-axc-border"
                          placeholder="Select..."
                          options={[
                            { value: "PCS", label: "PCS" },
                            { value: "KGS", label: "KGS" },
                          ]}
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const updated = [...invoiceItems];
                            updated[idx].quantity = e.target.value;
                            updated[idx].amount = String(
                              Number(e.target.value) * Number(updated[idx].unitRates || 0)
                            );
                            setInvoiceItems(updated);
                          }}
                          className="w-28 bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none text-center"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={item.unitWeight}
                          onChange={(e) => {
                            const updated = [...invoiceItems];
                            updated[idx].unitWeight = e.target.value;
                            setInvoiceItems(updated);
                          }}
                          className="w-full bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none text-center"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={item.igst}
                          onChange={(e) => {
                            const updated = [...invoiceItems];
                            updated[idx].igst = e.target.value;
                            setInvoiceItems(updated);
                          }}
                          className="w-full bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none text-center"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={item.unitRates}
                          onChange={(e) => {
                            const updated = [...invoiceItems];
                            updated[idx].unitRates = e.target.value;
                            updated[idx].amount = String(
                              Number(item.quantity || 0) * Number(e.target.value)
                            );
                            setInvoiceItems(updated);
                          }}
                          className="w-full bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none text-center"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          readOnly
                          value={item.amount}
                          className="w-full bg-gray-50 border border-axc-border rounded px-1.5 py-2 text-center cursor-not-allowed text-axc-dark-gray font-medium"
                        />
                      </td>
                      <td className="p-1 text-center">
                        <button
                          type="button"
                          onClick={() => removeInvoiceItem(item.id)}
                          className="inline-flex cursor-pointer items-center justify-center rounded-md border border-axc-red/30 p-1.5 text-axc-red transition hover:bg-axc-red/10"
                        >
                          <Trash size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-axc-border">
                    <td colSpan={5} className="py-2.5 px-4">
                      <div>
                        <button
                          type="button"
                          onClick={addInvoiceItem}
                          className="p-1 text-white rounded-full ring ring-axc-yellow transition capitalize cursor-pointer flex justify-center items-center hover:bg-axc-yellow/10"
                          title="Add Item"
                        >
                          <Plus size={15} strokeWidth={3} className="text-axc-yellow" />
                        </button>
                      </div>
                    </td>
                    <td colSpan={2} className="py-2 px-2 text-right font-bold text-black">
                      <div className="flex items-center justify-around gap-2 text-sm">
                        <span>TOTAL WEIGHT</span>
                        <input
                          type="text"
                          readOnly
                          value={invoiceItems.reduce(
                            (acc, curr) => acc + Number(curr.unitWeight || 0) * Number(curr.quantity || 0),
                            0
                          )}
                          className="w-24 border outline-none border-axc-border bg-gray-100 rounded px-1.5 py-2.5 text-center font-bold text-gray-600"
                        />
                      </div>
                    </td>
                    <td colSpan={2} className="py-2 px-2 text-right font-bold text-black">
                      <div className="flex items-center justify-end gap-5 text-sm">
                        <span>TOTAL AMOUNT</span>
                        <input
                          type="text"
                          readOnly
                          value={invoiceItems.reduce(
                            (acc, curr) => acc + Number(curr.amount || 0),
                            0
                          )}
                          className="w-24 border outline-none border-axc-border bg-gray-100 rounded px-1.5 py-2.5 text-center font-bold text-gray-600"
                        />
                      </div>
                    </td>
                    <td colSpan={2} className="py-2 px-3"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}