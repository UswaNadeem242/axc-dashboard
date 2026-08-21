"use client";
import React, { useState } from "react";
import CommonDropdown from "../../src/common/dropdown";
import { Check } from "lucide-react";
import VendorDetails from "./vendordetails";
import VendorInvoice from "./vendorinvoice";

export default function PurchaseBillingSection() {
  const [form, setForm] = useState<any>({});

  const handleInput = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const TickIcon = () => (
    <div className="w-4 h-4 flex items-center justify-center text-blue-500">
      <Check size={16} strokeWidth={3} />
    </div>
  );

  const CheckboxIcon = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-3.5 h-3.5 border-gray-400 rounded-sm"
    />
  );

  const renderField = (
    label: string,
    type: "none" | "checkbox" | "tick",
    inputType: "single" | "double" = "single"
  ) => {
    return (
      <div className="flex items-center py-1">
        <div className="w-[300px] shrink-0 flex items-center gap-2 text-[10px] font-bold text-gray-700 uppercase">
          {type === "checkbox" && <CheckboxIcon checked={!!form[`${label}_check`]} onChange={() => handleInput(`${label}_check`, !form[`${label}_check`])} />}
          {type === "tick" && <TickIcon />}
          {type === "none" && <div className="w-3.5" />}
          <span className="truncate">{label}</span>
        </div>
        <div className="flex items-center gap-2 w-full max-w-[400px]">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-sm px-2 py-1 text-[11px] focus:outline-none focus:border-blue-500 h-7 disabled:bg-gray-100"
            value={form[`${label}_1`] || ''}
            onChange={(e) => handleInput(`${label}_1`, e.target.value)}
          />
          {inputType === "double" && (
            <input
              type="text"
              className="w-16 border border-gray-300 rounded-sm px-2 py-1 text-[11px] focus:outline-none focus:border-blue-500 h-7 disabled:bg-gray-100"
              value={form[`${label}_2`] || ''}
              onChange={(e) => handleInput(`${label}_2`, e.target.value)}
            />
          )}
        </div>
      </div>
    );
  };

  const renderSummaryRow = (label: string, showEditCheck = false, rightAlign = true) => {
    return (
      <div className="flex items-center justify-end py-1">
        <div className="w-[180px] shrink-0 text-right pr-4 text-[10px] font-bold text-gray-700 uppercase">
          {label}
        </div>
        <div className="flex items-center gap-2 w-[220px]">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-sm px-2 py-1 text-[11px] bg-gray-100/50 focus:outline-none focus:border-blue-500 h-7"
            value={form[`${label}_val`] || '0'}
            onChange={(e) => handleInput(`${label}_val`, e.target.value)}
          />
          {showEditCheck && (
            <label className="flex items-center gap-1.5 shrink-0 text-[10px] uppercase text-gray-600 font-bold ml-2">
              <input type="checkbox" className="w-3.5 h-3.5 border-gray-400 rounded-sm" />
              <span>EDIT {label.replace(/TOTAL|GRAND/g, '').trim()}</span>
            </label>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-transparent animate-in fade-in duration-300 grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* 8-column section for Purchase Billing form */}
      <div className="xl:col-span-6">
        <div className="border border-gray-300 shadow-sm overflow-hidden flex flex-col p-4 bg-white rounded-xl min-h-[800px]">

          <h3 className="text-sm font-bold text-gray-700 mb-4 border-b border-gray-400 pb-2 uppercase tracking-wide">
            Purchase Billing
          </h3>

          <div className="flex flex-col max-w-4xl">
            {/* Top Section */}
            <div className="flex items-center py-1 mb-2">
              <div className="w-[120px] shrink-0 text-[10px] font-bold text-gray-700 uppercase">COMPANY</div>
              <div className="w-full max-w-[400px]">
                <CommonDropdown
                  value={form.company}
                  onChange={(v) => handleInput('company', v)}
                  options={[{ value: "1", label: "Company 1" }]}
                  placeholder="Select..."
                  className="w-full h-7 !py-0.5 text-[11px]"
                />
              </div>
            </div>
            <div className="flex items-center py-1 mb-2 gap-4">
              <div className="w-[120px] shrink-0 text-[10px] font-bold text-gray-700 uppercase">CURRENCY</div>
              <div className="w-[150px]">
                <CommonDropdown
                  value={form.currency}
                  onChange={(v) => handleInput('currency', v)}
                  options={[{ value: "USD", label: "USD" }]}
                  placeholder="Select..."
                  className="w-full h-7 !py-0.5 text-[11px]"
                />
              </div>
              <div className="text-[10px] font-bold text-gray-700 uppercase ml-2">VAT TYPE</div>
              <div className="w-[120px]">
                <CommonDropdown
                  value={form.vatType}
                  onChange={(v) => handleInput('vatType', v)}
                  options={[{ value: "GST", label: "GST" }]}
                  placeholder="GST"
                  className="w-full h-7 !py-0.5 text-[11px]"
                />
              </div>
              <div className="flex-1 flex justify-end">
                <label className="flex items-center gap-1.5 text-[10px] uppercase text-gray-600 font-bold">
                  <input type="checkbox" className="w-3.5 h-3.5 border-gray-400 rounded-sm" />
                  <span>EDIT</span>
                </label>
              </div>
            </div>

            <div className="flex items-center py-1 mb-2 pl-[136px]">
              <label className="flex items-center gap-1.5 text-[10px] uppercase text-gray-600 font-bold bg-gray-200 px-2 py-1 rounded-sm">
                <input type="checkbox" className="w-3.5 h-3.5 border-gray-400 rounded-sm bg-gray-300" />
                <span>VAT APPLICABLE</span>
              </label>
            </div>

            <div className="flex items-center py-1">
              <div className="w-[300px] shrink-0 flex items-center gap-2 text-[10px] font-bold text-gray-700 uppercase">
                <div className="w-3.5" />
                <span>FREIGHT</span>
              </div>
              <div className="flex items-center gap-2 w-full max-w-[400px]">
                <input type="text" className="w-[180px] border border-gray-300 rounded-sm px-2 py-1 text-[11px] bg-gray-100/50 focus:outline-none h-7" value="0" readOnly />
                <label className="flex items-center gap-1.5 text-[10px] uppercase text-gray-600 font-bold ml-2">
                  <input type="checkbox" className="w-3.5 h-3.5 border-gray-400 rounded-sm" />
                  <span>EDIT AMOUNT</span>
                </label>
              </div>
            </div>

            <div className="flex items-center py-1">
              <div className="w-[300px] shrink-0 flex items-center gap-2 text-[10px] font-bold text-gray-700 uppercase">
                <div className="w-3.5" />
                <span>FREIGHT PER KG</span>
              </div>
              <div className="flex items-center gap-2 w-full max-w-[400px]">
                <input type="text" className="flex-1 border border-gray-300 rounded-sm px-2 py-1 text-[11px] focus:outline-none h-7" />
              </div>
            </div>

            <div className="flex items-center py-1 mt-2 mb-2">
              <div className="w-[300px] shrink-0 text-right pr-4 text-[10px] font-bold text-gray-700 uppercase">
                SEARCH CHARGE
              </div>
              <div className="flex items-center gap-2 w-[180px]">
                <input type="text" className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[11px] focus:outline-none h-7" />
              </div>
            </div>

            {/* Charges List */}
            <div className="flex flex-col mt-2">
              {renderField("ADDITIONAL HANDLING", "checkbox")}
              {renderField("ADDITIONAL HANDLING CHARGE WEIGHT", "tick", "double")}
              {renderField("ADDRESS CORRECTION FEES", "checkbox")}
              {renderField("AHS WEIGHT", "checkbox")}
              {renderField("BRAND CHARGES", "checkbox")}
              {renderField("COLLECTION CHARGES", "checkbox")}
              {renderField("DAS CHARGES", "checkbox")}
              {renderField("DDP CAD CHARGES", "checkbox")}
              {renderField("DELIVERY AREA SURCHARGE", "tick", "double")}
              {renderField("DELIVERY AREA SURCHARGE EXTENDED", "tick", "double")}
              {renderField("DROP OFF CHARGES", "checkbox")}
              {renderField("E FORM", "checkbox")}
              {renderField("EXTRA CHARGES", "checkbox")}
              {renderField("OVERSIZED", "checkbox")}
              {renderField("PEAK SURCHARGE", "checkbox")}
              {renderField("PICKUP CHARGES", "checkbox")}
              {renderField("REMOTE AREA", "tick", "double")}
              {renderField("REMOTE AREA SURCHARGE", "tick", "double")}
              {renderField("RESIDENTIAL SURCHARGE", "tick", "double")}
              {renderField("RESIDENTIAL SURCHARGE", "checkbox")}
            </div>

            {/* Summary Section */}
            <div className="flex flex-col mt-4 max-w-[600px]">
              {renderSummaryRow("TOTAL OTHER CHARGES")}
              {renderSummaryRow("FSC %", true)}
              {renderSummaryRow("FSC", true)}
              {renderSummaryRow("DISCOUNT (IN %)")}
              {renderSummaryRow("DISCOUNT AMOUNT")}
              {renderSummaryRow("TOTAL DISCOUNT")}
              {renderSummaryRow("FREIGHT AFTER DISCOUNT")}
              {renderSummaryRow("SUBTOTAL")}
              {renderSummaryRow("NON TAXABLE AMOUNT")}
              {renderSummaryRow("TAXABLE AMOUNT")}
              {renderSummaryRow("VAT %")}
              {renderSummaryRow("CGST", true)}
              {renderSummaryRow("SGST", true)}
              {renderSummaryRow("GRAND TOTAL", true)}
            </div>
          </div>
        </div>
      </div>
      {/* 4-column section for Vendor Details & Invoice */}
      <div className="xl:col-span-6 flex flex-col gap-6">
        <VendorDetails />
        <VendorInvoice />
      </div>
    </div>
  );
}
