"use client";
import React, { useMemo, useState, useEffect } from "react";
import { Trash2, Plus } from "lucide-react";
import CommonDropdown from "../../src/common/dropdown";
import { EditIconButton } from "./form";
import { PurchaseChargeKey, PurchaseBillingFormState } from "./formstate";
import CustomChargeModal from "./customchargemodal";

const inputClass =
  "border border-axc-border rounded-md px-3 py-2.5 outline-none w-full text-regular-small placeholder:text-regular-small text-axc-gray placeholder:text-axc-gray";

function PanelHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="bg-axc-navy/60 text-white p-4  rounded-tl-lg  rounded-tr-lg flex items-center justify-between gap-2">
      <h3>{title}</h3>
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
  { key: "remoteArea", label: "Remote  Area" },
  { key: "remoteAreaSurcharge", label: "Remote Area Surcharge" },
  { key: "residentialSurcharge", label: "Residential Surcharge" },
  { key: "residentialSurchargeManual", label: "Residential Surcharge" },
];

function ChargeCell({
  label, checked, value, amount, onToggle, onValueChange, onAmountChange, placeholder, onRemove, inputsCount = 2
}: {
  label: string; checked: boolean; value: string; amount: string;
  onToggle: () => void; onValueChange: (v: string) => void; onAmountChange: (v: string) => void; placeholder?: string; onRemove: () => void;
  inputsCount?: 1 | 2;
}) {
  return (
    <div className="flex flex-col gap-1.5 border border-gray-200 rounded-md p-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={checked} onChange={onToggle} className="h-3.5 w-3.5 accent-axc-navy shrink-0 cursor-pointer" />
          <span className={`text-regular-medium leading-tight ${checked ? "text-axc-navy" : "text-axc-dark-gray"}`}>
            {label}
          </span>
        </label>
        <button type="button" onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex items-center gap-1.5">
        {inputsCount === 2 && (
          <input
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            disabled={!checked}
            placeholder={placeholder}
            className={`${inputClass} h-8 text-[12px] px-2 ${!checked ? "bg-gray-50 cursor-not-allowed text-gray-400" : ""}`}
          />
        )}
        {(inputsCount === 1 || (inputsCount === 2 && checked)) && (
          <input
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            disabled={inputsCount === 1 && !checked}
            placeholder="Amount"
            className={`${inputClass} h-8 text-[12px] px-2 ${inputsCount === 1 && !checked ? "bg-gray-50 cursor-not-allowed text-gray-400" : ""}`}
          />
        )}
      </div>
    </div>
  );
}

function BillingInputField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
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
      <input value={value} readOnly className={`${inputClass} h-9 text-xs bg-gray-50 font-semibold`} placeholder={placeholder} />
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
          placeholder={placeholder}
          value={value}
          disabled={!editable}
          onChange={(e) => onValueChange(e.target.value)}
          className={`${inputClass} h-9 text-[12px] pr-10 ${!editable ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-white"}`}
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
    cgst?: string; sgst?: string; grandTotal: string;
  };
}) {
  const [visibleCharges, setVisibleCharges] = useState<Set<PurchaseChargeKey>>(new Set());
  const [visibleDynamicCharges, setVisibleDynamicCharges] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownKey, setDropdownKey] = useState(0);

  useEffect(() => {
    setVisibleDynamicCharges(prev => {
      const next = new Set(prev);
      if (billing.dynamicCharges) {
        Object.keys(billing.dynamicCharges).forEach(key => {
          if (billing.dynamicCharges![key]?.checked) {
            next.add(key);
          }
        });
      }
      return next;
    });
  }, [billing.dynamicCharges]);

  useEffect(() => {
    setVisibleCharges(prev => {
      const next = new Set(prev);
      CHARGE_ROWS.forEach(row => {
        if (billing.charges[row.key]?.checked) {
          next.add(row.key);
        }
      });
      return next;
    });
  }, [billing.charges]);

  const handleRemoveCharge = (key: PurchaseChargeKey) => {
    if (billing.charges[key]?.checked) {
      toggleCharge(key);
    }
    updateCharge(key, "value", "");
    updateCharge(key, "amount", "");
    setVisibleCharges(prev => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const handleRemoveDynamicCharge = (key: string) => {
    if (billing.dynamicCharges && billing.dynamicCharges[key]?.checked) {
      onChange({
        dynamicCharges: {
          ...billing.dynamicCharges,
          [key]: { ...billing.dynamicCharges[key], checked: false }
        }
      });
    }
    setVisibleDynamicCharges(prev => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const availableChargeOptions = useMemo(() => {
    const options: { value: string; label: React.ReactNode }[] = CHARGE_ROWS
      .map((row) => ({ value: row.key, label: row.label }));
    
    if (billing.dynamicCharges) {
      Object.keys(billing.dynamicCharges).forEach(key => {
        options.push({ value: key, label: billing.dynamicCharges![key].label });
      });
    }
    
    options.push({ 
      value: "OTHER", 
      label: (
        <div className="flex items-center gap-2">
          <Plus size={15} strokeWidth={3} className="text-axc-yellow" />
          <span>Add Custom Charge</span>
        </div>
      ) 
    });
    return options;
  }, [visibleCharges, visibleDynamicCharges, billing.dynamicCharges]);

  const activeChargeRows = useMemo(() => {
    return CHARGE_ROWS.filter((row) => visibleCharges.has(row.key));
  }, [visibleCharges]);

  return (
    <div className="rounded-lg border border-axc-border bg-white shadow-sm overflow-hidden">
      <PanelHeader
        title="Purchase Billing"
      />

      <div className="p-4 space-y-3">
        {/* Row 1: Company, Currency, and Vat Type (3 in one row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3">
          <div className="flex flex-col gap-1 w-full">
            <span className="text-regular-medium text-axc-dark-gray">Company</span>
            <select
              disabled
              value={billing.company}
              onChange={(e) => onChange({ company: e.target.value })}
              className={`${inputClass} h-9 text-[12px] bg-gray-50 cursor-not-allowed text-gray-500 w-full`}
            >
              <option value="">{billing.company || "Select..."}</option>
              <option value="AXC">AXC</option>
              <option value="company1">Company A</option>
              <option value="company2">Company B</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <span className="text-regular-medium text-axc-dark-gray">Currency</span>
            <select
              disabled
              value={billing.purchaseCurrency}
              onChange={(e) => onChange({ purchaseCurrency: e.target.value })}
              className={`${inputClass} h-9 text-[12px] bg-gray-50 cursor-not-allowed text-gray-500 w-full`}
            >
              <option value="">{billing.purchaseCurrency || "Select..."}</option>
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <span className="text-regular-medium text-axc-dark-gray">Vat Type</span>
            <select
              disabled
              value={billing.vatType}
              onChange={(e) => onChange({ vatType: e.target.value })}
              className={`${inputClass} h-9 text-[12px] bg-gray-50 cursor-not-allowed text-gray-500 w-full`}
            >
              <option value="GST">GST</option>
            </select>
          </div>


          <div className="flex items-center gap-2.5 justify-between border border-axc-border px-3 py-1 rounded-md sm:col-span-2 xl:col-span-3">
            <label className={`flex items-center gap-1.5 text-regular-medium ${!billing.editVat ? "text-gray-400 cursor-not-allowed" : billing.vatApplicable ? "text-axc-navy cursor-pointer" : "text-axc-dark-gray cursor-pointer"}`}>
              <input
                type="checkbox"
                disabled={!billing.editVat}
                checked={billing.vatApplicable}
                onChange={(e) => onChange({ vatApplicable: e.target.checked })}
                className="h-3.5 w-3.5 accent-axc-navy disabled:opacity-50 disabled:cursor-not-allowed"
              />
              Vat Applicable
            </label>

            <EditIconButton
              active={billing.editVat}
              onToggle={() => onChange({ editVat: !billing.editVat })}
              title="Edit VAT"
            />
          </div>
        </div>
        <div className={gridClass}>
          <BillingToggleField
            placeholder="Freight"
            label="Freight"
            value={billing.freight}
            editable={billing.editFreightAmount}
            onValueChange={(v) => onChange({ freight: v })}
            onEditToggle={(v) => onChange({ editFreightAmount: v })}
            editLabel="EDIT AMOUNT"
          />
          <div className="flex flex-col gap-1">
            <span className="text-regular-medium text-axc-dark-gray">Freight Per Kg</span>
            <input value={billing.freightPerKg} readOnly className={`${inputClass} h-9 text-sm bg-gray-50`} placeholder="Freight Per Kg" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-regular-medium text-axc-dark-gray">Add Charge</span>
            <CommonDropdown
              key={dropdownKey}
              value={[...Array.from(visibleCharges), ...Array.from(visibleDynamicCharges)]}
              multiple
              onChange={(val: string[]) => {
                if (val.includes("OTHER")) {
                  setIsModalOpen(true);
                  setDropdownKey(prev => prev + 1);
                  return;
                }
                
                const newSet = new Set(val);
                
                const removedCharges = [...visibleCharges].filter(x => !newSet.has(x));
                const removedDynamicCharges = [...visibleDynamicCharges].filter(x => !newSet.has(x));
                
                const addedCharges = val.filter(x => CHARGE_ROWS.some(r => r.key === x) && !visibleCharges.has(x as PurchaseChargeKey));
                const addedDynamicCharges = val.filter(x => billing.dynamicCharges?.[x] && !visibleDynamicCharges.has(x));

                removedCharges.forEach(key => handleRemoveCharge(key as PurchaseChargeKey));
                removedDynamicCharges.forEach(key => handleRemoveDynamicCharge(key));

                addedCharges.forEach(key => {
                  const k = key as PurchaseChargeKey;
                  setVisibleCharges(prev => {
                    const next = new Set(prev);
                    next.add(k);
                    return next;
                  });
                  if (!billing.charges[k]?.checked) {
                    toggleCharge(k);
                  }
                });

                addedDynamicCharges.forEach(key => {
                  setVisibleDynamicCharges(prev => {
                    const next = new Set(prev);
                    next.add(key);
                    return next;
                  });
                  if (billing.dynamicCharges && !billing.dynamicCharges[key].checked) {
                    onChange({
                      dynamicCharges: {
                        ...billing.dynamicCharges,
                        [key]: { ...billing.dynamicCharges[key], checked: true }
                      }
                    });
                  }
                });
              }}
              options={availableChargeOptions}
              placeholder="Select a charge to add..."
              className="w-full !py-2 !px-3 !text-[12px] border-axc-border h-9"
            />
          </div>
        </div>

        {(activeChargeRows.length > 0 || visibleDynamicCharges.size > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 pt-1">
            {activeChargeRows.map((row) => (
              <ChargeCell
                key={row.key}
                label={row.label}
                checked={billing.charges[row.key].checked}
                value={billing.charges[row.key].value}
                amount={billing.charges[row.key].amount}
                onToggle={() => toggleCharge(row.key)}
                onValueChange={(v) => updateCharge(row.key, "value", v)}
                onAmountChange={(v) => updateCharge(row.key, "amount", v)}
                onRemove={() => handleRemoveCharge(row.key)}
              />
            ))}
            {Object.keys(billing.dynamicCharges || {}).filter(key => visibleDynamicCharges.has(key)).map((key) => {
              const charge = billing.dynamicCharges![key];
              return (
                <ChargeCell
                  key={key}
                  label={charge.label}
                  checked={charge.checked}
                  value={charge.value}
                  amount={charge.amount}
                  inputsCount={charge.inputsCount}
                  onToggle={() => {
                    onChange({
                      dynamicCharges: {
                        ...billing.dynamicCharges,
                        [key]: { ...charge, checked: !charge.checked }
                      }
                    });
                  }}
                  onValueChange={(v) => {
                    onChange({
                      dynamicCharges: {
                        ...billing.dynamicCharges,
                        [key]: { ...charge, value: v }
                      }
                    });
                  }}
                  onAmountChange={(v) => {
                    onChange({
                      dynamicCharges: {
                        ...billing.dynamicCharges,
                        [key]: { ...charge, amount: v }
                      }
                    });
                  }}
                  onRemove={() => handleRemoveDynamicCharge(key)}
                />
              );
            })}
          </div>
        )}

        <div className={gridClass}>
          <BillingSummaryField label="Total Other Charges" value={totals.totalOtherCharges} />
          <BillingInputField label="Adjustment Amount" value={billing.adjustmentAmount} onChange={(v) => onChange({ adjustmentAmount: v })} placeholder="Adjustment Amount" />

          <BillingToggleField
            placeholder="FSC %"
            label="FSC %"
            value={billing.fscPercent}
            editable={billing.editFscPercent}
            onValueChange={(v) => onChange({ fscPercent: v })}
            onEditToggle={(v) => onChange({ editFscPercent: v })}
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
          <BillingInputField label="Discount (In %)" value={billing.discountPercent} onChange={(v) => onChange({ discountPercent: v })} placeholder="Discount (In %)" />
          <BillingInputField label="Discount Amount" value={billing.discountAmount} onChange={(v) => onChange({ discountAmount: v })} placeholder="Discount Amount" />
          <BillingSummaryField label="Total Discount" value={totals.totalDiscount} />

          <BillingSummaryField label="Freight After Discount" value={totals.freightAfterDiscount} placeholder="Freight After Discount" />
          <BillingSummaryField label="Subtotal" value={totals.subtotal} placeholder="Subtotal" />
          <BillingSummaryField label="Non Taxable Amount" value={totals.nonTaxableAmount} placeholder="Non Taxable Amount" />

          <BillingSummaryField label="Taxable Amount" value={totals.taxableAmount} placeholder="Taxable Amount" />
          <BillingInputField label="VAT %" value={billing.vatPercent} onChange={(v) => onChange({ vatPercent: v })} placeholder="VAT %" />
        </div>

        <div className="flex flex-col gap-1 pt-5 border-t border-gray-100">
          <span className="text-regular-bold text-axc-dark-gray">Grand Total</span>
          <div className="relative max-w-[300px] w-full">
            <input
              value={billing.editTotal ? billing.grandTotal : totals.grandTotal}
              disabled={!billing.editTotal}
              onChange={(e) => onChange({ grandTotal: e.target.value })}
              className={`${inputClass} h-9 text-[13px] font-bold pr-10 ${!billing.editTotal ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-white"}`}
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
    
      <CustomChargeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(name, inputsCount) => {
          const key = `custom_${Date.now()}`;
          onChange({
            dynamicCharges: {
              ...(billing.dynamicCharges || {}),
              [key]: {
                label: name,
                inputsCount,
                checked: true,
                value: "",
                amount: ""
              }
            }
          });
          setVisibleDynamicCharges(prev => {
            const next = new Set(prev);
            next.add(key);
            return next;
          });
        }}
      />
    </div>
  );
}