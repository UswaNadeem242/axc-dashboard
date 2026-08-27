"use client";
import React from "react";
import { VendorInvoiceFormState } from "./formstate";

const inputClass =
  "border border-axc-border rounded-md px-3 py-2.5 outline-none w-full text-regular-medium text-axc-dark-gray placeholder:text-[12px] placeholder:text-axc-gray transition";

import { PanelHeader } from "./form";

function InvoiceRow({
  label, value, remarksLabel, remarksValue, onValueChange, onRemarksChange, readOnly = false, placeholder = "", remarksPlaceholder = ""
}: {
  label: string; value: string; remarksLabel?: string; remarksValue?: string;
  onValueChange: (v: string) => void; onRemarksChange?: (v: string) => void; readOnly?: boolean; placeholder?: string; remarksPlaceholder?: string;
}) {
  return (
    <div className={`grid grid-cols-1 ${remarksLabel ? "sm:grid-cols-2" : ""} gap-3 items-end`}>
      <div className="flex flex-col gap-1">
        <span className="text-regular-medium text-axc-dark-gray">{label}</span>
        <input
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          onChange={(e) => onValueChange(e.target.value)}
          className={`${inputClass} h-9 text-[12px] ${readOnly ? "bg-gray-50" : ""}`}
        />
      </div>
      {remarksLabel && (
        <div className="flex flex-col gap-1">
          <span className="text-regular-medium text-axc-dark-gray">{remarksLabel}</span>
          <input
            placeholder={remarksPlaceholder}
            value={remarksValue ?? ""}
            onChange={(e) => onRemarksChange?.(e.target.value)}
            className={`${inputClass} h-9 text-[12px]`}
          />
        </div>
      )}
    </div>
  );
}

export function VendorInvoicePanel({
  vendorInvoice, onChange,
}: {
  vendorInvoice: VendorInvoiceFormState;
  onChange: (patch: Partial<VendorInvoiceFormState>) => void;
}) {
  return (
    <div className="rounded-lg border border-axc-border bg-white shadow-sm overflow-hidden">
      <PanelHeader title="Vendor Invoice" />
      <div className="p-4 space-y-3">
        <InvoiceRow
          placeholder="Past Vendor Invoice"
          label="Past Vendor Invoice"
          value={vendorInvoice.pastVendorInvoice}
          onValueChange={(v) => onChange({ pastVendorInvoice: v })}
        />
        <InvoiceRow
          placeholder="Vendor Invoice 1"
          label="Vendor Invoice 1"
          value={vendorInvoice.vendorInvoice1}
          remarksLabel="Invoice Remarks 1"
          remarksValue={vendorInvoice.invoiceRemarks1}
          onValueChange={(v) => onChange({ vendorInvoice1: v })}
          onRemarksChange={(v) => onChange({ invoiceRemarks1: v })}
        />
        <InvoiceRow
          placeholder="Vendor Invoice 2"
          label="Vendor Invoice 2"
          value={vendorInvoice.vendorInvoice2}
          remarksLabel="Invoice Remarks 2"
          remarksValue={vendorInvoice.invoiceRemarks2}
          onValueChange={(v) => onChange({ vendorInvoice2: v })}
          onRemarksChange={(v) => onChange({ invoiceRemarks2: v })}
        />
        <InvoiceRow
          placeholder="Vendor Invoice 3"
          label="Vendor Invoice 3"
          value={vendorInvoice.vendorInvoice3}
          remarksLabel="Invoice Remarks 3"
          remarksValue={vendorInvoice.invoiceRemarks3}
          onValueChange={(v) => onChange({ vendorInvoice3: v })}
          onRemarksChange={(v) => onChange({ invoiceRemarks3: v })}
        />
        <InvoiceRow
          placeholder="Vendor Invoice 4"
          label="Vendor Invoice 4"
          value={vendorInvoice.vendorInvoice4}
          remarksLabel="Invoice Remarks 4"
          remarksValue={vendorInvoice.invoiceRemarks4}
          onValueChange={(v) => onChange({ vendorInvoice4: v })}
          onRemarksChange={(v) => onChange({ invoiceRemarks4: v })}
        />
      </div>
    </div>
  );
}