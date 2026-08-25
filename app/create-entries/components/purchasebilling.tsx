"use client";
import React from "react";
import { PurchaseChargeKey, PurchaseBillingFormState } from "./formstate";

const inputClass =
  "border border-axc-border rounded-md px-3 py-2.5 outline-none w-full text-[13px] text-gray-700 placeholder:text-gray-400 focus:border-gray-400 transition";

function PanelHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="bg-axc-navy text-white text-[13px] font-semibold px-4 py-2.5 flex items-center justify-between gap-2 flex-wrap">
      <span>{title}</span>
      {right}
    </div>
  );
}

const CHARGE_ROWS: { key: PurchaseChargeKey; label: string }[] = [
  { key: "additionalHandling", label: "Additional Handling " },
  { key: "additionalHandlingCharge", label: "Additional Handling Charge Weight" },
  { key: "addressCorrectionFees", label: "Address Correction Fees" },
  { key: "ahsWeight", label: "AHS Weight" },
  { key: "brandCharges", label: "Brand Charges" },
  { key: "collectionCharges", label: "Collection Charges" },
  { key: "dasCharges", label: "DAS Charge" },
  { key: "ddpCadCharges", label: "DDP CAD Charge" },
  { key: "deliveryAreaSurcharge", label: "Delivery Area Surcharge" },
  { key: "deliveryAreaSurchargeExtended", label: "Delivery Area Surcharge Extended" },
  { key: "dropOffCharges", label: "Drop Off Charges" },
  { key: "eForm", label: "E FORM" },
  { key: "extraCharges", label: "Extra Charges" },
  { key: "oversized", label: "Oversized" },
  { key: "peakSurcharge", label: "Peak Surcharge" },
  { key: "pickupCharges", label: "Pickup Charges" },
  { key: "remoteArea", label: "REMOTE AREA" },
  { key: "remoteAreaSurcharge", label: "Remote Area Surcharge" },
  { key: "residentialSurcharge", label: "Residential Surcharge" },
  { key: "residentialSurchargeManual", label: "Residential Surcharge" },
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
        <span className={`text-xs  font-semibold leading-tight ${checked ? "text-axc-navy" : "text-axc-dark-gray"}`}>
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
      <span className="text-xs  font-semibold text-axc-dark-gray">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} h-9 text-[12px]`} />
    </div>
  );
}

function BillingSummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs  font-semibold text-axc-dark-gray">{label}</span>
      <input value={value} readOnly className={`${inputClass} h-9 text-xs bg-gray-50 font-semibold`} />
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
      <span className="text-xs  font-semibold text-axc-dark-gray">{label}</span>
      <input
        value={value}
        disabled={!editable}
        onChange={(e) => onValueChange(e.target.value)}
        className={`${inputClass} h-9 text-[12px] ${!editable ? "bg-gray-50" : ""}`}
      />
      <label className="flex items-center gap-1.5 text-xs text-axc-dark-gray">
        <input type="checkbox" checked={editable} onChange={(e) => onEditToggle(e.target.checked)} className="h-3 w-3 accent-axc-navy" />
        {editLabel}
      </label>
    </div>
  );
}

const gridClass = "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3";

export function PurchaseBillingPanel({
  billing, toggleCharge, updateCharge, onChange, totals,
}: {
  billing: PurchaseBillingFormState;
  toggleCharge: (key: PurchaseChargeKey) => void;
  updateCharge: (key: PurchaseChargeKey, field: "value" | "amount", val: string) => void;
  onChange: (patch: Partial<PurchaseBillingFormState>) => void;
  totals: {
    totalOtherCharges: string; totalDiscount: string; freightAfterDiscount: string;
    subtotal: string; taxableAmount: string; nonTaxableAmount: string;
    cgst: string; sgst: string; grandTotal: string;
  };
}) {
  return (
    <div className="rounded-lg border border-axc-border bg-white shadow-sm overflow-hidden">
      <PanelHeader
        title="Purchase Billing"
        right={
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium">COMPANY</span>
              <select
                value={billing.company}
                onChange={(e) => onChange({ company: e.target.value })}
                className="h-7 rounded-md text-[11px] cursor-pointer outline-none  px-2"
              >
                <option value="" className="text-axc-navy ">Select...</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium">CURRENCY</span>
              <select
                value={billing.purchaseCurrency}
                onChange={(e) => onChange({ purchaseCurrency: e.target.value })}
                className="h-7 rounded-md text-[11px] cursor-pointer outline-none  px-2"
              >
                <option value="" className="text-axc-navy ">Select...</option>
                <option value="USD" className="text-axc-navy ">USD</option>
                <option value="INR" className="text-axc-navy ">INR</option>
                <option value="EUR" className="text-axc-navy ">EUR</option>
                <option value="GBP" className="text-axc-navy ">GBP</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium">VAT TYPE</span>
              <select
                value={billing.vatType}
                onChange={(e) => onChange({ vatType: e.target.value })}
                className="h-7 rounded-md text-[11px] cursor-pointer outline-none  px-2"
              >
                <option value="GST" className="text-axc-navy ">GST</option>
                <option value="VAT" className="text-axc-navy ">VAT</option>
                <option value="NONE" className="text-axc-navy ">NONE</option>
              </select>
            </div>
            <label className="flex items-center gap-1.5 text-[11px] font-medium">
              <input type="checkbox" checked={billing.vatApplicable} onChange={(e) => onChange({ vatApplicable: e.target.checked })} className="h-3.5 w-3.5 accent-white" />
              VAT APPLICABLE
            </label>
            <label className="flex items-center gap-1.5 text-[11px] font-medium">
              <input type="checkbox" checked={billing.editVat} onChange={(e) => onChange({ editVat: e.target.checked })} className="h-3.5 w-3.5 accent-white" />
              EDIT
            </label>
          </div>
        }
      />

      <div className="p-4 space-y-4">
        <div className={gridClass}>
          <BillingToggleField
            label="Freight"
            value={billing.freight}
            editable={billing.editFreightAmount}
            onValueChange={(v) => onChange({ freight: v })}
            onEditToggle={(v) => onChange({ editFreightAmount: v })}
            editLabel="EDIT AMOUNT"
          />
          <div className="flex flex-col gap-1">
            <span className="text-xs  font-semibold text-axc-dark-gray">Freight Per Kg</span>
            <input value={billing.freightPerKg} readOnly className={`${inputClass} h-9 text-[12px] bg-gray-50`} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs  font-semibold text-axc-dark-gray">Search Charge</span>
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
          <BillingSummaryField label="Total Other Charges" value={totals.totalOtherCharges} />
          <BillingInputField label="Adjustment Amount" value={billing.adjustmentAmount} onChange={(v) => onChange({ adjustmentAmount: v })} />

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
          <BillingInputField label="Discount (In %)" value={billing.discountPercent} onChange={(v) => onChange({ discountPercent: v })} />
          <BillingInputField label="Discount Amount" value={billing.discountAmount} onChange={(v) => onChange({ discountAmount: v })} />
          <BillingSummaryField label="Total Discount" value={totals.totalDiscount} />

          <BillingSummaryField label="Freight After Discount" value={totals.freightAfterDiscount} />
          <BillingSummaryField label="Subtotal" value={totals.subtotal} />
          <BillingSummaryField label="Non Taxable Amount" value={totals.nonTaxableAmount} />

          <BillingSummaryField label="Taxable Amount" value={totals.taxableAmount} />
          <BillingInputField label="VAT %" value={billing.vatPercent} onChange={(v) => onChange({ vatPercent: v })} />

          <BillingToggleField
            label="CGST"
            value={totals.cgst}
            editable={billing.editCgst}
            onValueChange={(v) => onChange({ cgst: v })}
            onEditToggle={(v) => onChange({ editCgst: v })}
            editLabel="EDIT CGST"
          />
          <BillingToggleField
            label="SGST"
            value={totals.sgst}
            editable={billing.editSgst}
            onValueChange={(v) => onChange({ sgst: v })}
            onEditToggle={(v) => onChange({ editSgst: v })}
            editLabel="EDIT SGST"
          />
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