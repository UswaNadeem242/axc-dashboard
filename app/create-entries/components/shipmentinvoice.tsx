"use client";
import React from "react";
import CommonDropdown from "../../src/common/dropdown";
import { AwbFormState, InvoiceItem } from "./formstate";
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
    <div className="bg-white rounded-xl border border-axc-border shadow-sm overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-axc-border">
        <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-800 cursor-pointer">
          <input type="checkbox" checked={form.createShipmentInvoice} onChange={(e) => setForm({ ...form, createShipmentInvoice: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span>Create Shipment Invoice?</span>
        </label>
      </div>
      {form.createShipmentInvoice && (
        <div className="flex flex-col gap-4 p-5 animate-in fade-in duration-200 text-xs font-sans text-gray-800">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold uppercase text-gray-600">Invoice Type</span>
              <CommonDropdown value={form.invoiceType} onChange={(val) => setForm({ ...form, invoiceType: val })} className="w-48 !py-1 !px-2 border-gray-300" options={[{ value: "INVOICE", label: "INVOICE" }, { value: "PROFORMA", label: "PROFORMA" }]} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold uppercase text-gray-600">Currency</span>
              <CommonDropdown value={form.invoiceCurrency} onChange={(val) => setForm({ ...form, invoiceCurrency: val })} className="w-32 !py-1 !px-2 border-gray-300" options={[{ value: "USD", label: "USD" }, { value: "INR", label: "INR" }]} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold uppercase text-gray-600">Incoterms</span>
              <CommonDropdown value={form.incoterms} onChange={(val) => setForm({ ...form, incoterms: val })} className="w-48 !py-1 !px-2 border-gray-300" options={[{ value: "DDU", label: "DDU" }, { value: "DDP", label: "DDP" }]} />
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-semibold uppercase text-gray-600">Note</span>
              <CommonDropdown value={form.invoiceNote} onChange={(val) => setForm({ ...form, invoiceNote: val })} className="w-48 !py-1 !px-2 border-gray-300" options={[{ value: "GIFT", label: "GIFT" }, { value: "SAMPLE", label: "SAMPLE" }, { value: "COMMERCIAL", label: "COMMERCIAL" }]} />
            </div>
            <input type="text" value={form.invoiceDeclaration} onChange={(e) => setForm({ ...form, invoiceDeclaration: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-1 text-[11px] bg-white focus:outline-none" />
          </div>

          <div className="mt-2">
            <div className="bg-axc-navy text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-wide">Shipment Invoice Items</div>
            <div className="border border-t-0 overflow-x-auto">
              <table className="w-full text-[11px] border-collapse min-w-[950px]">
                <thead>
                  <tr className="bg-gray-50 border-b text-[10px] text-axc-dark-gray font-bold uppercase text-left">
                    <th className="py-2 px-2 border-r font-bold">Box No.</th>
                    <th className="py-2 px-2 border-r font-bold">Sr. No.</th>
                    <th className="py-2 px-2 border-r font-bold w-1/4">Description</th>
                    <th className="py-2 px-2 border-r font-bold">HS Code</th>
                    <th className="py-2 px-2 border-r font-bold">Unit Type</th>
                    <th className="py-2 px-2 border-r font-bold">Quantity</th>
                    <th className="py-2 px-2 border-r font-bold">Unit Weight</th>
                    <th className="py-2 px-2 border-r font-bold">IGST</th>
                    <th className="py-2 px-2 border-r font-bold">Unit Rates</th>
                    <th className="py-2 px-2 border-r font-bold">Amount</th>
                    <th className="py-2 px-2 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.map((item, idx) => (
                    <tr key={item.id} className="border-b last:border-b-0 hover:bg-gray-50/50">
                      <td className="border-r p-1">
                        <CommonDropdown value={item.boxNo} onChange={(val) => { const updated = [...invoiceItems]; updated[idx].boxNo = val; setInvoiceItems(updated); }} className="w-full !py-0.5 !px-1.5 border-gray-300" placeholder="Select..." options={[{ value: "1", label: "Box 1" }]} />
                      </td>
                      <td className="border-r p-1 text-center bg-gray-50 text-gray-600 font-medium">{item.srNo}</td>
                      <td className="border-r p-1">
                        <input type="text" placeholder="SEARCH HERE..." value={item.description} onChange={(e) => { const updated = [...invoiceItems]; updated[idx].description = e.target.value; setInvoiceItems(updated); }} className="w-full bg-white border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none" />
                      </td>
                      <td className="border-r p-1">
                        <input type="text" value={item.hsCode} onChange={(e) => { const updated = [...invoiceItems]; updated[idx].hsCode = e.target.value; setInvoiceItems(updated); }} className="w-full bg-white border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none text-center" />
                      </td>
                      <td className="border-r p-1">
                        <CommonDropdown value={item.unitType} onChange={(val) => { const updated = [...invoiceItems]; updated[idx].unitType = val; setInvoiceItems(updated); }} className="w-full !py-0.5 !px-1.5 border-gray-300" placeholder="Select..." options={[{ value: "PCS", label: "PCS" }, { value: "KGS", label: "KGS" }]} />
                      </td>
                      <td className="border-r p-1">
                        <input type="number" value={item.quantity} onChange={(e) => { const updated = [...invoiceItems]; updated[idx].quantity = e.target.value; updated[idx].amount = String(Number(e.target.value) * Number(updated[idx].unitRates || 0)); setInvoiceItems(updated); }} className="w-full bg-white border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none text-center" />
                      </td>
                      <td className="border-r p-1">
                        <input type="text" value={item.unitWeight} onChange={(e) => { const updated = [...invoiceItems]; updated[idx].unitWeight = e.target.value; setInvoiceItems(updated); }} className="w-full bg-white border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none text-center" />
                      </td>
                      <td className="border-r p-1">
                        <input type="text" value={item.igst} onChange={(e) => { const updated = [...invoiceItems]; updated[idx].igst = e.target.value; setInvoiceItems(updated); }} className="w-full bg-white border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none text-center" />
                      </td>
                      <td className="border-r p-1">
                        <input type="text" value={item.unitRates} onChange={(e) => { const updated = [...invoiceItems]; updated[idx].unitRates = e.target.value; updated[idx].amount = String(Number(item.quantity || 0) * Number(e.target.value)); setInvoiceItems(updated); }} className="w-full bg-white border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none text-center" />
                      </td>
                      <td className="border-r p-1">
                        <input type="text" readOnly value={item.amount} className="w-full bg-gray-50 border border-axc-gray rounded px-1.5 py-0.5 text-center cursor-not-allowed text-axc-dark-gray font-medium" />
                      </td>
                      <td className="p-1 text-center">
                        <button type="button" onClick={() => removeInvoiceItem(item.id)} className="inline-flex items-center gap-1 text-axc-red hover:text-red-800 font-bold text-[10px]">
                          <span className="inline-block w-3.5 h-3.5 rounded-full border border-axc-red text-center leading-3 font-extrabold text-[9px] shrink-0">x</span>
                          REMOVE
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50/50 border-t">
                    <td colSpan={5} className="py-2 px-3 border-r"></td>
                    <td colSpan={2} className="py-2 px-2 border-r text-right font-bold text-gray-700">
                      <div className="flex items-center justify-end gap-2 text-[10px]">
                        <span>TOTAL WEIGHT</span>
                        <input type="text" readOnly value={invoiceItems.reduce((acc, curr) => acc + Number(curr.unitWeight || 0) * Number(curr.quantity || 0), 0)} className="w-24 border border-gray-300 bg-gray-100 rounded px-1.5 py-0.5 text-center font-bold text-gray-600" />
                      </div>
                    </td>
                    <td colSpan={2} className="py-2 px-2 border-r text-right font-bold text-gray-700">
                      <div className="flex items-center justify-end gap-2 text-[10px]">
                        <span>TOTAL AMOUNT</span>
                        <input type="text" readOnly value={invoiceItems.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)} className="w-24 border border-gray-300 bg-gray-100 rounded px-1.5 py-0.5 text-center font-bold text-gray-600" />
                      </div>
                    </td>
                    <td colSpan={2} className="py-2 px-3"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3">
              <button type="button" onClick={addInvoiceItem} className="px-3 py-2 bg-axc-yellow hover:bg-axc-yellow/80 text-white rounded text-xs font-bold shadow-sm transition uppercase">+ ADD ITEM</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}