"use client";
import React from "react";
import CommonDropdown from "../../src/common/dropdown";
import { AwbFormState, InvoiceItem } from "./formstate";
import { FieldLabel, inputClass } from "./form";
import { Plus, Trash } from "lucide-react";
import { showToast } from "../../src/common/toast";

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
  const handleRemoveInvoiceItem = (id: number) => {
    removeInvoiceItem(id);
    showToast({ variant: "success", message: "Invoice item removed successfully" });
  };

  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col">
      {form.createShipmentInvoice && (
        <div className="flex flex-col gap-4  animate-in fade-in duration-200 text-gray-800">
          <div className="">
            <div className="bg-axc-navy/60 rounded-tl-lg rounded-tr-lg text-white   p-4 capitalize tracking-wide">
              <h3>Shipment Invoice Items
              </h3>
            </div>
            <div className=" overflow-x-auto p-4">
              <div className="border border-axc-border rounded-md overflow-hidden">
                <table className="w-full text-sm min-w-[950px]">
                  <thead>
                    <tr className="bg-axc-navy/10 text-regular-medium text-axc-dark-gray text-left whitespace-nowrap">
                      <th className="py-2.5 px-3 border-r border-axc-border">Box#</th>
                      <th className="py-2.5 px-2 border-r border-axc-border">Sr#</th>
                      <th className="py-2.5 px-2 border-r border-axc-border w-1/5">Description</th>
                      <th className="py-2.5 px-2 border-r border-axc-border">HS Code</th>
                      <th className="py-2.5 px-2 border-r border-axc-border whitespace-nowrap min-w-[110px]">Unit Type</th>
                      <th className="py-2.5 px-2 border-r border-axc-border whitespace-nowrap">Quantity</th>
                      <th className="py-2.5 px-2 border-r border-axc-border whitespace-nowrap">Unit Weight</th>
                      <th className="py-2.5 px-2 border-r border-axc-border whitespace-nowrap">IGST</th>
                      <th className="py-2.5 px-2 border-r border-axc-border whitespace-nowrap">Unit Rates</th>
                      <th className="py-2.5 px-2 border-r border-axc-border whitespace-nowrap">Amount</th>
                      <th className="py-2.5 px-2 text-center whitespace-nowrap">Action</th>
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
                          options={Array.from({ length: 50 }, (_, i) => ({ value: String(i + 1), label: `Box ${i + 1}` }))}
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
                          onClick={() => handleRemoveInvoiceItem(item.id)}
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
        </div>
      )}
    </div>
  );
}