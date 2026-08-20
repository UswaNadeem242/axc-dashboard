"use client";
import React from "react";
import { ChargeKey, SalesBillingFormState } from "./formstate";

const inputClass =
  "border border-gray-300 rounded-md px-3 py-2.5 outline-none w-full text-[13px] text-gray-700 placeholder:text-gray-400 focus:border-gray-400 transition";

function PanelHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="bg-axc-navy text-white text-[13px] font-semibold px-4 py-2.5 flex items-center justify-between gap-2 flex-wrap">
      <span>{title}</span>
      {right}
    </div>
  );
}

const CHARGE_ROWS: { key: ChargeKey; label: string }[] = [
  { key: "additionalHandling", label: "ADDITIONAL HANDLING" },
  { key: "additionalHandlingCharge", label: "ADDITIONAL HANDLING CHARGE WEIGHT" },
  { key: "addressCorrectionFees", label: "ADDRESS CORRECTION FEES" },
  { key: "ahsWeight", label: "AHS WEIGHT" },
  { key: "brandCharges", label: "BRAND CHARGES" },
  { key: "collectionCharges", label: "COLLECTION CHARGES" },
  { key: "dasCharges", label: "DAS CHARGES" },
  { key: "ddpCadCharges", label: "DDP CAD CHARGES" },
  { key: "deliveryAreaSurcharge", label: "DELIVERY AREA SURCHARGE" },
  { key: "deliveryAreaSurchargeExtended", label: "DELIVERY AREA SURCHARGE EXTENDED" },
  { key: "dropOffCharges", label: "DROP OFF CHARGES" },
  { key: "eForm", label: "E FORM" },
  { key: "extraCharges", label: "EXTRA CHARGES" },
  { key: "oversized", label: "OVERSIZED" },
  { key: "peakSurcharge", label: "PEAK SURCHARGE" },
  { key: "pickupCharges", label: "PICKUP CHARGES" },
  { key: "remoteArea", label: "REMOTE AREA" },
  { key: "remoteAreaSurcharge", label: "REMOTE AREA SURCHARGE" },
  { key: "residentialSurcharge", label: "RESIDENTIAL SURCHARGE" },
  { key: "residentialSurchargeManual", label: "RESIDENTIAL SURCHARGE" },
];

function ChargeCell({
  label, checked, value, amount, onToggle, onValueChange, onAmountChange,
}: {
  label: string; checked: boolean; value: string; amount: string;
  onToggle: () => void; onValueChange: (v: string) => void; onAmountChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 border border-gray-200 rounded-md p-2">
      <label className="flex items-center gap-1.5">
        <input type="checkbox" checked={checked} onChange={onToggle} className="h-3.5 w-3.5 accent-axc-navy shrink-0" />
        <span className={`text-[10.5px] font-semibold leading-tight ${checked ? "text-axc-navy" : "text-gray-500"}`}>
          {label}
        </span>
      </label>
      <div className="flex items-center gap-1.5">
        <input
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          disabled={!checked}
          placeholder="Value"
          className={`${inputClass} h-8 text-[12px] px-2 ${!checked ? "bg-gray-50" : ""}`}
        />
        {checked && (
          <input
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="Amount"
            className={`${inputClass} h-8 text-[12px] px-2`}
          />
        )}
      </div>
    </div>
  );
}

function BillingInputField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold text-gray-500">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} h-9 text-[12px]`} />
    </div>
  );
}

function BillingSummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold text-gray-500">{label}</span>
      <input value={value} readOnly className={`${inputClass} h-9 text-[12px] bg-gray-50 font-semibold`} />
    </div>
  );
}

function BillingToggleField({
  label, value, editable, onValueChange, onEditToggle, editLabel,
}: {
  label: string; value: string; editable: boolean;
  onValueChange: (v: string) => void; onEditToggle: (v: boolean) => void; editLabel: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold text-gray-500">{label}</span>
      <input
        value={value}
        disabled={!editable}
        onChange={(e) => onValueChange(e.target.value)}
        className={`${inputClass} h-9 text-[12px] ${!editable ? "bg-gray-50" : ""}`}
      />
      <label className="flex items-center gap-1.5 text-[10px] text-gray-500">
        <input type="checkbox" checked={editable} onChange={(e) => onEditToggle(e.target.checked)} className="h-3 w-3 accent-axc-navy" />
        {editLabel}
      </label>
    </div>
  );
}

const gridClass = "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3";

export function SalesBillingPanel({
  billing, toggleCharge, updateCharge, onChange, totals,
}: {
  billing: SalesBillingFormState;
  toggleCharge: (key: ChargeKey) => void;
  updateCharge: (key: ChargeKey, field: "value" | "amount", val: string) => void;
  onChange: (patch: Partial<SalesBillingFormState>) => void;
  totals: {
    totalOtherCharges: string; totalDiscount: string; freightAfterDiscount: string;
    subtotal: string; taxableAmount: string; nonTaxableAmount: string; vat: string; grandTotal: string;
  };
}) {
  return (
    <div className="rounded-2xl border border-axc-border bg-white shadow-sm overflow-hidden">
      <PanelHeader
        title="SALES BILLING"
        right={
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium">CURRENCY</span>
              <select
                value={billing.salesCurrency}
                onChange={(e) => onChange({ salesCurrency: e.target.value })}
                className="h-7 rounded-md text-[11px] text-gray-700 px-2"
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium">VAT TYPE</span>
              <select
                value={billing.vatType}
                onChange={(e) => onChange({ vatType: e.target.value })}
                className="h-7 rounded-md text-[11px] text-gray-700 px-2"
              >
                <option value="GST">GST</option>
                <option value="VAT">VAT</option>
                <option value="NONE">NONE</option>
              </select>
            </div>
            <label className="flex items-center gap-1.5 text-[11px] font-medium">
              <input type="checkbox" checked={billing.vatApplicable} onChange={(e) => onChange({ vatApplicable: e.target.checked })} className="h-3.5 w-3.5 accent-white" />
              VAT APPLICABLE
            </label>
          </div>
        }
      />

      <div className="p-4 space-y-4">
        <div className={gridClass}>
          <BillingToggleField
            label="FREIGHT"
            value={billing.freight}
            editable={billing.editFreightAmount}
            onValueChange={(v) => onChange({ freight: v })}
            onEditToggle={(v) => onChange({ editFreightAmount: v })}
            editLabel="EDIT AMOUNT"
          />
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-gray-500">FREIGHT PER KG</span>
            <input value={billing.freightPerKg} readOnly className={`${inputClass} h-9 text-[12px] bg-gray-50`} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-gray-500">SEARCH CHARGE</span>
            <input
              value={billing.searchCharge}
              onChange={(e) => onChange({ searchCharge: e.target.value })}
              placeholder="Search charge..."
              className={`${inputClass} h-9 text-[12px]`}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 pt-1">
          {CHARGE_ROWS.map((row) => (
            <ChargeCell
              key={row.key}
              label={row.label}
              checked={billing.charges[row.key].checked}
              value={billing.charges[row.key].value}
              amount={billing.charges[row.key].amount}
              onToggle={() => toggleCharge(row.key)}
              onValueChange={(v) => updateCharge(row.key, "value", v)}
              onAmountChange={(v) => updateCharge(row.key, "amount", v)}
            />
          ))}
        </div>
        <div className={gridClass}>
          <BillingSummaryField label="TOTAL OTHER CHARGES" value={totals.totalOtherCharges} />
          <BillingInputField label="ADJUSTMENT AMOUNT" value={billing.adjustmentAmount} onChange={(v) => onChange({ adjustmentAmount: v })} />

          <BillingToggleField
            label="FSC %"
            value={billing.fscPercent}
            editable={billing.editFscPercent}
            onValueChange={(v) => onChange({ fscPercent: v })}
            onEditToggle={(v) => onChange({ editFscPercent: v })}
            editLabel="EDIT FSC %"
          />
          <BillingToggleField
            label="FSC"
            value={billing.fsc}
            editable={billing.editFsc}
            onValueChange={(v) => onChange({ fsc: v })}
            onEditToggle={(v) => onChange({ editFsc: v })}
            editLabel="EDIT FSC"
          />

          <BillingInputField label="DISCOUNT (IN %)" value={billing.discountPercent} onChange={(v) => onChange({ discountPercent: v })} />
          <BillingInputField label="DISCOUNT AMOUNT" value={billing.discountAmount} onChange={(v) => onChange({ discountAmount: v })} />
          <BillingSummaryField label="TOTAL DISCOUNT" value={totals.totalDiscount} />

          <BillingSummaryField label="FREIGHT AFTER DISCOUNT" value={totals.freightAfterDiscount} />
          <BillingSummaryField label="SUBTOTAL" value={totals.subtotal} />
          <BillingSummaryField label="NON TAXABLE AMOUNT" value={totals.nonTaxableAmount} />

          <BillingSummaryField label="TAXABLE AMOUNT" value={totals.taxableAmount} />
          <BillingInputField label="VAT %" value={billing.vatPercent} onChange={(v) => onChange({ vatPercent: v })} />
          <BillingSummaryField label="VAT" value={totals.vat} />
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
          <span className="text-[13px] font-bold w-[190px] shrink-0 text-gray-800">GRAND TOTAL</span>
          <input
            value={billing.editTotal ? billing.grandTotal : totals.grandTotal}
            disabled={!billing.editTotal}
            onChange={(e) => onChange({ grandTotal: e.target.value })}
            className={`${inputClass} h-9 text-[13px] font-bold max-w-[160px] ${!billing.editTotal ? "bg-gray-50" : ""}`}
          />
          <label className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <input type="checkbox" checked={billing.editTotal} onChange={(e) => onChange({ editTotal: e.target.checked })} className="h-3.5 w-3.5 accent-axc-navy" />
            EDIT TOTAL
          </label>
        </div>
      </div>
    </div>
  );
}