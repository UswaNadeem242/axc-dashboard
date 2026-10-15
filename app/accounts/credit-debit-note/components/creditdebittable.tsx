"use client";

import React from "react";
import { PlusCircle, XCircle, Plus, PlusCircleIcon, Trash } from "lucide-react";
import { CreditDebitLineItem, VAT_TYPE_OPTIONS } from "./types";
import { PanelHeader } from "@/app/create-entries/components/form";

interface CreditDebitItemsTableProps {
  items: CreditDebitLineItem[];
  onUpdateItem: (
    index: number,
    field: keyof CreditDebitLineItem,
    value: any
  ) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  grandTotal: number | string;
  roundOff?: number | string;
}

export default function CreditDebitItemsTable({
  items,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
  grandTotal,
  roundOff,
}: CreditDebitItemsTableProps) {
  const numericGrandTotal = parseFloat(String(grandTotal)) || 0;
  const computedRoundOff =
    roundOff !== undefined && roundOff !== ""
      ? String(roundOff)
      : (Math.round(numericGrandTotal) - numericGrandTotal).toFixed(2);

  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-xs overflow-hidden  flex flex-col">
      {/* Panel Header matching AWB style */}
      <PanelHeader
        title="Note Items & Charge Details"
      />

      <div className="p-4 flex flex-col gap-3">
        {/* Responsive Table Scroll Container with hidden scrollbar */}
        <div className="border border-axc-border rounded-md overflow-x-auto bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
          <table className="w-full text-xs min-w-[1720px] border-collapse">
            <thead>
              <tr className="bg-axc-navy/10 text-axc-dark-gray text-left whitespace-nowrap border-b border-axc-border font-bold text-regular-medium capitalize tracking-tight">
                <th className="py-2.5 px-2.5 border-r border-axc-border w-[220px]">
                  Description
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border w-[140px]">
                  Customer Ref No
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border w-[130px]">
                  AWB No
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border w-[90px] text-center">
                  HS Code
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border w-[130px]">
                  Invoice No
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border w-[120px] text-center">
                  Invoice Date
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border w-[100px] text-right">
                  Charg. Weight
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border w-[100px] text-right">
                  New Charg. Weight
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border w-[90px] text-center">
                  Dest. Code
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border w-[90px] text-right">
                  Rate
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border w-[75px] text-right">
                  FSC %
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border w-[85px] text-right">
                  FSC
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border w-[140px]">
                  VAT Type
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border w-[85px] text-right">
                  Tax %
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border w-[110px] text-right">
                  Total
                </th>
                <th className="py-2.5 px-2 border-r border-axc-border w-[140px]">
                  Remark
                </th>
                <th className="py-2.5 px-2 text-center w-[100px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-axc-border">
              {items.map((item, idx) => (
                <tr
                  key={item.id || idx}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* 1. DESCRIPTION */}
                  <td className="p-1.5 border-r border-axc-border">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        onUpdateItem(idx, "description", e.target.value)
                      }
                      placeholder="Item description"
                      className="w-full bg-white border border-axc-border rounded px-2 py-1.5 text-xs text-gray-800 outline-none focus:border-axc-navy"
                    />
                  </td>

                  {/* 2. CUSTOMER REF NO */}
                  <td className="p-1.5 border-r border-axc-border">
                    <input
                      type="text"
                      value={item.customerRefNo}
                      onChange={(e) =>
                        onUpdateItem(idx, "customerRefNo", e.target.value)
                      }
                      placeholder="Cust Ref No"
                      className="w-full bg-white border border-axc-border rounded px-2 py-1.5 text-xs text-gray-800 outline-none focus:border-axc-navy"
                    />
                  </td>

                  {/* 3. AWB NO */}
                  <td className="p-1.5 border-r border-axc-border">
                    <input
                      type="text"
                      value={item.awbNo}
                      onChange={(e) =>
                        onUpdateItem(idx, "awbNo", e.target.value)
                      }
                      placeholder="AWB No"
                      className="w-full bg-white border border-axc-border rounded px-2 py-1.5 text-xs text-gray-800 outline-none focus:border-axc-navy font-mono"
                    />
                  </td>

                  {/* 4. HS CODE */}
                  <td className="p-1.5 border-r border-axc-border">
                    <input
                      type="text"
                      value={item.hsCode}
                      onChange={(e) =>
                        onUpdateItem(idx, "hsCode", e.target.value)
                      }
                      placeholder="HS Code"
                      className="w-full bg-white border border-axc-border rounded px-2 py-1.5 text-xs text-gray-800 outline-none focus:border-axc-navy text-center font-mono"
                    />
                  </td>

                  {/* 5. INVOICE NO */}
                  <td className="p-1.5 border-r border-axc-border">
                    <input
                      type="text"
                      value={item.invoiceNo}
                      onChange={(e) =>
                        onUpdateItem(idx, "invoiceNo", e.target.value)
                      }
                      placeholder="Inv No"
                      className="w-full bg-white border border-axc-border rounded px-2 py-1.5 text-xs text-gray-800 outline-none focus:border-axc-navy font-mono"
                    />
                  </td>

                  {/* 6. INVOICE DATE */}
                  <td className="p-1.5 border-r border-axc-border">
                    <input
                      type="text"
                      value={item.invoiceDate}
                      onChange={(e) =>
                        onUpdateItem(idx, "invoiceDate", e.target.value)
                      }
                      placeholder="DD/MM/YYYY"
                      className="w-full bg-white border border-axc-border rounded px-2 py-1.5 text-xs text-gray-800 outline-none focus:border-axc-navy text-center"
                    />
                  </td>

                  {/* 7. CHARG. WEIGHT */}
                  <td className="p-1.5 border-r border-axc-border">
                    <input
                      type="number"
                      step="0.01"
                      value={item.chargWeight}
                      onChange={(e) =>
                        onUpdateItem(idx, "chargWeight", e.target.value)
                      }
                      placeholder="0.00"
                      className="w-full bg-white border border-axc-border rounded px-2 py-1.5 text-xs text-gray-800 outline-none focus:border-axc-navy text-right font-mono"
                    />
                  </td>

                  {/* 8. NEW CHG. WEIGHT */}
                  <td className="p-1.5 border-r border-axc-border">
                    <input
                      type="number"
                      step="0.01"
                      value={item.newChgWeight}
                      onChange={(e) =>
                        onUpdateItem(idx, "newChgWeight", e.target.value)
                      }
                      placeholder="0.00"
                      className="w-full bg-white border border-axc-border rounded px-2 py-1.5 text-xs text-gray-800 outline-none focus:border-axc-navy text-right font-mono"
                    />
                  </td>

                  {/* 9. DEST. CODE */}
                  <td className="p-1.5 border-r border-axc-border">
                    <input
                      type="text"
                      value={item.destCode}
                      onChange={(e) =>
                        onUpdateItem(idx, "destCode", e.target.value)
                      }
                      placeholder="DEST"
                      className="w-full bg-white border border-axc-border rounded px-2 py-1.5 text-xs text-gray-800 outline-none focus:border-axc-navy text-center font-mono uppercase"
                    />
                  </td>

                  {/* 10. RATE */}
                  <td className="p-1.5 border-r border-axc-border">
                    <input
                      type="number"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) =>
                        onUpdateItem(idx, "rate", e.target.value)
                      }
                      placeholder="0.00"
                      className="w-full bg-white border border-axc-border rounded px-2 py-1.5 text-xs text-gray-800 outline-none focus:border-axc-navy text-right font-mono"
                    />
                  </td>

                  {/* 11. FSC % */}
                  <td className="p-1.5 border-r border-axc-border">
                    <input
                      type="number"
                      step="0.1"
                      value={item.fscPercent}
                      onChange={(e) =>
                        onUpdateItem(idx, "fscPercent", e.target.value)
                      }
                      placeholder="0%"
                      className="w-full bg-white border border-axc-border rounded px-1.5 py-1.5 text-xs text-gray-800 outline-none focus:border-axc-navy text-right font-mono"
                    />
                  </td>

                  {/* 12. FSC */}
                  <td className="p-1.5 border-r border-axc-border">
                    <input
                      type="number"
                      step="0.01"
                      value={item.fsc}
                      onChange={(e) =>
                        onUpdateItem(idx, "fsc", e.target.value)
                      }
                      placeholder="0.00"
                      className="w-full bg-white border border-axc-border rounded px-1.5 py-1.5 text-xs text-gray-800 outline-none focus:border-axc-navy text-right font-mono"
                    />
                  </td>

                  {/* 13. VAT TYPE */}
                  <td className="p-1.5 border-r border-axc-border">
                    <select
                      value={item.vatType}
                      onChange={(e) =>
                        onUpdateItem(idx, "vatType", e.target.value)
                      }
                      className={`w-full rounded border px-2 py-1.5 text-xs outline-none cursor-pointer transition ${!item.vatType
                        ? "border-[#FFCDD2] bg-[#FFEBEE]/80 text-[#D32F2F] font-semibold"
                        : "border-axc-border bg-white text-gray-800"
                        }`}
                    >
                      {VAT_TYPE_OPTIONS.map((v) => (
                        <option
                          key={v.value}
                          value={v.value}
                          className="text-gray-800 bg-white"
                        >
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* 14. TAX % */}
                  <td className="p-1.5 border-r border-axc-border">
                    <input
                      type="number"
                      step="0.1"
                      value={item.taxPercent}
                      onChange={(e) =>
                        onUpdateItem(idx, "taxPercent", e.target.value)
                      }
                      placeholder="0"
                      className={`w-full rounded border px-1.5 py-1.5 text-xs outline-none text-right font-mono transition ${!item.taxPercent || item.taxPercent === "0"
                        ? "border-[#FFCDD2] bg-[#FFEBEE]/60 text-gray-800"
                        : "border-axc-border bg-white text-gray-800 font-semibold"
                        }`}
                    />
                  </td>

                  {/* 15. TOTAL */}
                  <td className="p-1.5 border-r border-axc-border">
                    <input
                      type="text"
                      readOnly
                      value={item.total}
                      className="w-full rounded border border-axc-border bg-[#F8FAFC] px-2 py-1.5 text-xs text-right font-mono font-bold text-axc-navy outline-none"
                    />
                  </td>

                  {/* 16. REMARK */}
                  <td className="p-1.5 border-r border-axc-border">
                    <textarea
                      rows={1}
                      value={item.remark}
                      onChange={(e) =>
                        onUpdateItem(idx, "remark", e.target.value)
                      }
                      placeholder="Optional remarks"
                      className="w-full bg-white border border-axc-border rounded px-2 py-1 text-xs text-gray-800 outline-none focus:border-axc-navy resize-none min-h-[30px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    />
                  </td>

                  {/* 17. ACTION */}
                  <td className="p-1.5 text-center">
                     
                    <button
                      type="button"
                      onClick={() => onRemoveItem(idx)}
                      className="inline-flex cursor-pointer items-center justify-center rounded-md border border-axc-red/30 p-1.5 text-axc-red transition hover:bg-axc-red/10"
                    >
                      <Trash size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Totals Row matching user's screenshot */}
            <tfoot>
              <tr className="border-t border-axc-border bg-[#FAFAFA]">
                <td colSpan={10} className="p-2.5 border-r border-axc-border"></td>
                <td colSpan={7} className="p-2.5">
                  <div className="flex flex-wrap items-center justify-end gap-3 text-xs">
                    <span className="font-bold text-gray-700 uppercase tracking-tight text-[11px]">
                      GRAND TOTAL
                    </span>
                    <input
                      type="text"
                      readOnly
                      value={numericGrandTotal.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      className="w-36 bg-white border border-axc-border rounded px-2.5 py-1.5 text-right font-mono font-bold text-axc-navy text-xs outline-none shadow-2xs"
                    />

                    <span className="font-bold text-gray-700 uppercase tracking-tight text-[11px] ml-3">
                      ROUND OFF
                    </span>
                    <input
                      type="text"
                      readOnly
                      value={computedRoundOff}
                      className="w-28 bg-white border border-axc-border rounded px-2.5 py-1.5 text-right font-mono text-gray-700 text-xs outline-none shadow-2xs"
                    />
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Bottom Bar with [+ ADD ITEM] Green Button */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={onAddItem}
            className="p-1 text-white rounded-full ring ring-axc-yellow transition capitalize cursor-pointer flex justify-center items-center hover:bg-axc-yellow/10"
            title="Add Item"
          >
            <Plus size={15} strokeWidth={3} className="text-axc-yellow" />
          </button>
          {/* <button
            type="button"
            onClick={onAddItem}
            className="bg-[#5B9A42] hover:bg-[#4E882E] active:scale-[0.98] text-white font-bold text-xs px-4 py-2 rounded flex items-center gap-1.5 transition-all shadow-xs cursor-pointer select-none"
          >
            <PlusCircle size={15} />
            ADD ITEM
          </button> */}
        </div>
      </div>
    </div>
  );
}
