"use client";
import React, { useMemo } from "react";
import CommonDropdown from "../../src/common/dropdown";
import { EditIconButton } from "./form";
import { ChargeKey, SalesBillingFormState } from "./formstate";

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD" },
  { value: "INR", label: "INR" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
];

const VAT_TYPE_OPTIONS = [
  { value: "GST", label: "GST" },
  { value: "VAT", label: "VAT" },
  { value: "NONE", label: "NONE" },
];

const inputClass =
  "border border-axc-border rounded-md px-3 py-2.5 outline-none w-full text-regular-samll text-axc-gray  placeholder:text-axc-gray placeholder:text-regular-samll  transition";

function PanelHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="bg-axc-navy/50 text-white p-4  rounded-tl-lg  rounded-tr-lg flex items-center justify-between gap-2">
      <h3> {title}</h3>
      {right}
    </div>
  );
}

const CHARGE_ROWS: { key: ChargeKey; label: string }[] = [
  { key: "additionalHandling", label: "Additional Handling" },
  { key: "additionalHandlingCharge", label: "Additional Handling Charge Weight" },
  { key: "addressCorrectionFees", label: "Address Correction Fees" },
  { key: "ahsWeight", label: "AHS Weight" },
  { key: "brandCharges", label: "Brand Charges" },
  { key: "collectionCharges", label: "Collection Charges" },
  { key: "dasCharges", label: "DAS Charges" },
  { key: "ddpCadCharges", label: "DDP CAD Charges" },
  { key: "deliveryAreaSurcharge", label: "Delivery Area Surcharge" },
  { key: "deliveryAreaSurchargeExtended", label: "Delivery Area Surcharge Extended" },
  { key: "dropOffCharges", label: "Drop Off Charges" },
  { key: "eForm", label: "E FORM" },
  { key: "extraCharges", label: "Extra Charges" },
  { key: "oversized", label: "Oversized" },
  { key: "peakSurcharge", label: "Peak Surcharge" },
  { key: "pickupCharges", label: "Pickup Charges" },
  { key: "remoteArea", label: "Remote Area" },
  { key: "remoteAreaSurcharge", label: "Remote Area Surcharge" },
  { key: "residentialSurcharge", label: "Residential Surcharge" },
  { key: "residentialSurchargeManual", label: "Residential Surcharge" },
];

function ChargeCell({
  label, checked, value, amount, onToggle, onValueChange, onAmountChange, placeholder,
}: {
  label: string; checked: boolean; value: string; amount: string;
  onToggle: () => void; onValueChange: (v: string) => void; onAmountChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 border border-gray-200 rounded-md p-2">
      <label className="flex items-center gap-1.5">
        <input type="checkbox" checked={checked} onChange={onToggle} className="h-3.5 w-3.5 accent-axc-navy shrink-0" />
        <span className={`text-regular-medium leading-tight ${checked ? "text-axc-navy" : "text-axc-dark-gray"}`}>
          {label}
        </span>
      </label>
      <div className="flex items-center gap-1.5">
        <input
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          disabled={!checked}
          placeholder={placeholder}
          className={`${inputClass} h-8 text-[12px] px-2 ${!checked ? "bg-gray-50 cursor-pointer" : ""}`}
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

function BillingInputField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void, placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-regular-medium capitalize text-axc-dark-gray">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} h-9 text-[12px]`} placeholder={placeholder} />
    </div>
  );
}

function BillingSummaryField({ label, value, placeholder }: { label: string; value: string; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-regular-medium text-axc-dark-gray">{label}</span>
      <input value={value} placeholder={placeholder} readOnly className={`${inputClass} h-9 text-xs bg-gray-50 font-semibold`} />
    </div>
  );
}

function BillingToggleField({
  label, value, editable, onValueChange, onEditToggle, editLabel, placeholder
}: {
  label: string; value: string; editable: boolean;
  onValueChange: (v: string) => void; onEditToggle: (v: boolean) => void; editLabel: string; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-regular-medium text-axc-dark-gray">{label}</span>
      <div className="relative">
        <input
          value={value}
          disabled={!editable}
          onChange={(e) => onValueChange(e.target.value)}
          className={`${inputClass} h-9 text-[12px] pr-10 ${!editable ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-white"}`}
          placeholder={placeholder}
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2">
          <EditIconButton
            active={editable}
            onToggle={() => onEditToggle(!editable)}
            title={editLabel}
          />
        </div>
      </div>
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
    subtotal: string; taxableAmount: string; nonTaxableAmount: string; vat: string;
    cgst: string; sgst: string; grandTotal: string;
  };
}) {
  const filteredChargeRows = useMemo(() => {
    const q = (billing.searchCharge || "").toLowerCase().trim();
    if (!q) return CHARGE_ROWS;
    return CHARGE_ROWS.filter((row) => row.label.toLowerCase().includes(q));
  }, [billing.searchCharge]);

  return (
    <div className="rounded-lg  border border-axc-border bg-white shadow-sm overflow-hidden">
      <PanelHeader
        title="Sales Billing"
      />

      <div className="p-4 space-y-3">
        <div className={gridClass}>
          <div className="flex flex-col gap-1 w-full">
            <span className="text-regular-medium capitalize text-axc-dark-gray">Sales Currency</span>
            <div className="w-full">
              <CommonDropdown
                value={billing.salesCurrency}
                onChange={(val) => onChange({ salesCurrency: val })}
                options={CURRENCY_OPTIONS}
                placeholder="Select..."
                className="w-full !py-2 !px-3 !text-[12px] border-axc-border h-9"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <span className="text-regular-medium capitalize text-axc-dark-gray">VAT TYPE</span>
            <div className="w-full">
              <CommonDropdown
                value={billing.vatType}
                onChange={(val) => onChange({ vatType: val })}
                options={VAT_TYPE_OPTIONS}
                placeholder="Select..."
                className="w-full !py-2 !px-3 !text-[12px] border-axc-border h-9"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full pt-5">
            {/* <span className="text-regular-medium capitalize text-axc-dark-gray">VAT Applicable</span> */}
            <div className="flex items-center gap-3  justify-between border border-axc-border py-1 px-3 rounded-md">
              <label className={`flex items-center gap-1.5 text-xs font-medium ${!billing.editVat ? "text-gray-400 cursor-not-allowed" : billing.vatApplicable ? "text-axc-navy cursor-pointer" : "text-axc-dark-gray cursor-pointer"}`}>
                <input
                  type="checkbox"
                  disabled={!billing.editVat}
                  checked={billing.vatApplicable}
                  onChange={(e) => onChange({ vatApplicable: e.target.checked })}
                  className="h-3.5 w-3.5 accent-axc-navy disabled:opacity-50 disabled:cursor-not-allowed"
                />
                VAT Applicable
              </label>
              <EditIconButton
                active={billing.editVat ?? false}
                onToggle={() => onChange({ editVat: !billing.editVat })}
                title="Edit VAT"
              />
            </div>
          </div>
          <BillingToggleField
            label="Freight"
            value={billing.freight}
            editable={billing.editFreightAmount}
            onValueChange={(v) => onChange({ freight: v })}
            onEditToggle={(v) => onChange({ editFreightAmount: v })}
            editLabel="EDIT AMOUNT"
          />
          <div className="flex flex-col gap-1">
            <span className="text-regular-medium  capitalize text-axc-dark-gray">Freight per kg</span>
            <input value={billing.freightPerKg} readOnly className={`${inputClass} h-9 text-[12px] bg-gray-50`} placeholder="Freight per kg" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-regular-medium  text-axc-dark-gray">Search Charge</span>
            <input
              value={billing.searchCharge}
              onChange={(e) => onChange({ searchCharge: e.target.value })}
              placeholder="Search charge..."
              className={`${inputClass} h-9 text-[12px]`}
            />
          </div>
        </div>
        {filteredChargeRows.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 pt-1">
            {filteredChargeRows.map((row) => (
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
        )}
        <div className={gridClass}>
          <BillingSummaryField label="Total Other Charges" value={totals.totalOtherCharges} />
          <BillingInputField label="Adjustment Amount" value={billing.adjustmentAmount} onChange={(v) => onChange({ adjustmentAmount: v })} placeholder="Adjustment Amount" />

          <BillingToggleField
            label="FSC %"
            value={billing.fscPercent}
            editable={billing.editFscPercent}
            onValueChange={(v) => onChange({ fscPercent: v })}
            onEditToggle={(v) => onChange({ editFscPercent: v })}
            placeholder="FSC %"
            editLabel="EDIT FSC %"
          />
          <BillingToggleField
            placeholder="FSC"
            label="FSC"
            value={billing.fsc}
            editable={billing.editFsc}
            onValueChange={(v) => onChange({ fsc: v })}
            onEditToggle={(v) => onChange({ editFsc: v })}
            editLabel="EDIT FSC"
          />

          <BillingInputField label="Discount (in %)" value={billing.discountPercent} onChange={(v) => onChange({ discountPercent: v })} placeholder="Discount (in %)" />
          <BillingInputField label="Discount Amount" value={billing.discountAmount} onChange={(v) => onChange({ discountAmount: v })} placeholder="Discount Amount" />
          <BillingSummaryField label="Total Discount" value={totals.totalDiscount} />

          <BillingSummaryField label="Freight After Discount" value={totals.freightAfterDiscount} />
          <BillingSummaryField label="Subtotal" value={totals.subtotal} />
          <BillingSummaryField label="Non Taxable Amount" value={totals.nonTaxableAmount} />

          <BillingSummaryField label="Taxable Amount" value={totals.taxableAmount} />
          <BillingInputField label="VAT %" value={billing.vatPercent} onChange={(v) => onChange({ vatPercent: v })} />
          <BillingSummaryField label="CGST" value={totals.cgst} placeholder="CGST" />
          <BillingSummaryField label="SGST" value={totals.sgst} placeholder="SGST" />
        </div>
        <div className="flex flex-col  gap-1 pt-5 border-t border-gray-100">
          <span className="text-regular-bold text-axc-dark-gray">Grand Total</span>
          <div className="relative max-w-[300px] w-full">
            <input
              value={billing.editTotal ? billing.grandTotal : totals.grandTotal}
              disabled={!billing.editTotal}
              onChange={(e) => onChange({ grandTotal: e.target.value })}
              className={`${inputClass} h-9 text-regular-medium placeholder:text-regular-small placeholder:text-axc-gray pr-10 ${!billing.editTotal ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-white"}`}
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              <EditIconButton
                active={billing.editTotal}
                onToggle={() => onChange({ editTotal: !billing.editTotal })}
                title="EDIT TOTAL"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}