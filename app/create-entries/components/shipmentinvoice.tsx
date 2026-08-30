"use client";
import React from "react";
import CommonDropdown from "../../src/common/dropdown";
import { AwbFormState, InvoiceItem } from "./formstate";
import { Delete, Plus, Trash } from "lucide-react";
interface Props {
  form: AwbFormState;
  setForm: React.Dispatch<React.SetStateAction<AwbFormState>>;
  invoiceItems: InvoiceItem[];
  setInvoiceItems: React.Dispatch<React.SetStateAction<InvoiceItem[]>>;
  addInvoiceItem: () => void;
  removeInvoiceItem: (id: number) => void;
}
export default function ShipmentInvoiceSection({ form, setForm, invoiceItems, setInvoiceItems, addInvoiceItem, removeInvoiceItem }: Props) {
  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-axc-border bg-axc-navy text-white">
        <label className="flex items-center gap-2 text-sm font-bold  tracking-wider  cursor-pointer">
          <input type="checkbox" checked={form.createShipmentInvoice} onChange={(e) => setForm({ ...form, createShipmentInvoice: e.target.checked })} className="h-4 w-4 rounded border-axc-border text-blue-600 focus:ring-blue-500 cursor-pointer" />
          <span>Create Shipment Invoice?</span>
        </label>
      </div>
      {form.createShipmentInvoice && (
        <div className="flex flex-col gap-4 p-4 animate-in fade-in duration-200  text-gray-800">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <div className="flex items-center gap-4">
              <span className="text-axc-dark-gray font-semibold text-sm">Invoice Type</span>
              <div className="w-40">
                <CommonDropdown value={form.invoiceType} onChange={(val) => setForm({ ...form, invoiceType: val })} className=" !py-2 !px-2 border-axc-border" options={[{ value: "INVOICE", label: "INVOICE" }, { value: "PROFORMA", label: "PROFORMA" }]} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-axc-dark-gray text-sm">Currency</span>
              <div className="w-32">
                <CommonDropdown value={form.invoiceCurrency} onChange={(val) => setForm({ ...form, invoiceCurrency: val })} className="!py-2 !px-2 border-axc-border" options={[{ value: "USD", label: "USD" }, { value: "INR", label: "INR" }]} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-axc-dark-gray text-sm">Incoterms</span>
              <div className="w-48">
                <CommonDropdown value={form.incoterms} onChange={(val) => setForm({ ...form, incoterms: val })} className="!py-2 !px-2 border-axc-border" options={[{ value: "DDU", label: "DDU" }, { value: "DDP", label: "DDP" }]} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
            <div className="flex items-center gap-8 shrink-0">
              <span className="text-regular-medium text-axc-dark-gray">Note</span>
              <div className="w-48">
                <CommonDropdown value={form.invoiceNote} onChange={(val) => setForm({ ...form, invoiceNote: val })} className="!py-2 !px-2 border-axc-border" options={[{ value: "GIFT", label: "GIFT" }, { value: "SAMPLE", label: "SAMPLE" }, { value: "COMMERCIAL", label: "COMMERCIAL" }]} />
              </div>
            </div>
            <input type="text" value={form.invoiceDeclaration} onChange={(e) => setForm({ ...form, invoiceDeclaration: e.target.value })} className="w-full border border-axc-border rounded px-5 py-3 text-regular-medium bg-white focus:outline-none" />
          </div>

          <div className="mt-2">
            <div className="bg-axc-navy rounded-tl-lg rounded-tr-lg text-white text-regular-medium font-bold p-3  capitalize  tracking-wide">Shipment Invoice Items</div>
            <div className="border border-axc-border border-t-0 overflow-x-auto">
              <table className="w-full text-[11px] border-collapse min-w-[950px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-axc-border text-regular-medium text-axc-dark-gray text-left">
                    <th className="py-2 px-2 border-r border-axc-border ">Box#</th>
                    <th className="py-2 px-2 border-r border-axc-border ">Sr#</th>
                    <th className="py-2 px-2 border-r border-axc-border  w-1/5">Description</th>
                    <th className="py-2 px-2 border-r border-axc-border ">HS Code</th>
                    <th className="py-2 px-2 border-r border-axc-border ">Unit Type</th>
                    <th className="py-2 px-2 border-r border-axc-border ">Quantity</th>
                    <th className="py-2 px-2 border-r border-axc-border ">Unit Weight</th>
                    <th className="py-2 px-2 border-r border-axc-border ">IGST</th>
                    <th className="py-2 px-2 border-r border-axc-border ">Unit Rates</th>
                    <th className="py-2 px-2 border-r border-axc-border ">Amount</th>
                    <th className="py-2 px-2  text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.map((item, idx) => (
                    <tr key={item.id} className="border-b border-axc-border last:border-b-0 hover:bg-gray-50/50">
                      <td className="border-r border-axc-border p-1">
                        <CommonDropdown value={item.boxNo} onChange={(val) => { const updated = [...invoiceItems]; updated[idx].boxNo = val; setInvoiceItems(updated); }} className="w-full py-2 !px-1.5 border-axc-border" placeholder="Select..." options={[{ value: "1", label: "Box 1" }]} />
                      </td>
                      <td className="border-r border-axc-border p-1 text-center bg-gray-50 text-gray-600 font-medium">{item.srNo}</td>
                      <td className="border-r border-axc-border p-1">
                        <input type="text" placeholder="SEARCH HERE..." value={item.description} onChange={(e) => { const updated = [...invoiceItems]; updated[idx].description = e.target.value; setInvoiceItems(updated); }} className="w-full bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none shadow-none" />
                      </td>
                      <td className="border-r border-axc-border p-1">
                        <input type="text" value={item.hsCode} onChange={(e) => { const updated = [...invoiceItems]; updated[idx].hsCode = e.target.value; setInvoiceItems(updated); }} className="w-full bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none text-center" />
                      </td>
                      <td className="border-r border-axc-border p-1">
                        <CommonDropdown value={item.unitType} onChange={(val) => { const updated = [...invoiceItems]; updated[idx].unitType = val; setInvoiceItems(updated); }} className="w-full py-2 !px-1.5 border-axc-border" placeholder="Select..." options={[{ value: "PCS", label: "PCS" }, { value: "KGS", label: "KGS" }]} />
                      </td>
                      <td className="border-r border-axc-border p-1">
                        <input type="number" value={item.quantity} onChange={(e) => { const updated = [...invoiceItems]; updated[idx].quantity = e.target.value; updated[idx].amount = String(Number(e.target.value) * Number(updated[idx].unitRates || 0)); setInvoiceItems(updated); }} className="w-full bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none text-center" />
                      </td>
                      <td className="border-r border-axc-border p-1">
                        <input type="text" value={item.unitWeight} onChange={(e) => { const updated = [...invoiceItems]; updated[idx].unitWeight = e.target.value; setInvoiceItems(updated); }} className="w-full bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none text-center" />
                      </td>
                      <td className="border-r border-axc-border p-1">
                        <input type="text" value={item.igst} onChange={(e) => { const updated = [...invoiceItems]; updated[idx].igst = e.target.value; setInvoiceItems(updated); }} className="w-full bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none text-center" />
                      </td>
                      <td className="border-r border-axc-border p-1">
                        <input type="text" value={item.unitRates} onChange={(e) => { const updated = [...invoiceItems]; updated[idx].unitRates = e.target.value; updated[idx].amount = String(Number(item.quantity || 0) * Number(e.target.value)); setInvoiceItems(updated); }} className="w-full bg-white border border-axc-border rounded px-1.5 py-2 focus:outline-none text-center" />
                      </td>
                      <td className="border-r border-axc-border p-1">
                        <input type="text" readOnly value={item.amount} className="w-full bg-gray-50 border border-axc-border rounded px-1.5 py-2 text-center cursor-not-allowed text-axc-dark-gray font-medium" />
                      </td>
                      <td className="p-1 text-center">
                        <button type="button" onClick={() => removeInvoiceItem(item.id)}  className="inline-flex items-center justify-center rounded-md border border-axc-red/30  p-1.5 text-axc-red transition hover:bg-axc-red/10">
                          <Trash size={15} />

                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50/50 border-t border-axc-border">
                    <td colSpan={5} className="py-2 px-3 border-r border-axc-border"></td>
                    <td colSpan={2} className="py-2 px-2 border-r border-axc-border text-right font-bold text-black">
                      <div className="flex items-center justify-end gap-2 text-sm">
                        <span>TOTAL WEIGHT</span>
                        <input type="text" readOnly value={invoiceItems.reduce((acc, curr) => acc + Number(curr.unitWeight || 0) * Number(curr.quantity || 0), 0)} className="w-24 border outline-none border-axc-border bg-gray-100 rounded px-1.5 py-0.5 text-center font-bold text-gray-600" />
                      </div>
                    </td>
                    <td colSpan={2} className="py-2 px-2 border-r border-axc-border   text-right font-bold text-black">
                      <div className="flex items-center justify-end gap-2 text-sm">
                        <span>TOTAL AMOUNT</span>
                        <input type="text" readOnly value={invoiceItems.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)} className="w-24 border outline-none border-axc-border bg-gray-100 rounded px-1.5 py-0.5 text-center font-bold text-gray-600" />
                      </div>
                    </td>
                    <td colSpan={2} className="py-2 px-3"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3">

              <button type="button" onClick={addInvoiceItem} className="px-5 py-3 bg-axc-dark-yellow  text-white rounded-lg text-regular-medium transition capitalize cursor-pointer flex justify-center items-center "><Plus size={15} />Add Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}