"use client";
import React from "react";
import { VendorInvoiceFormState } from "./formstate";

const inputClass =
  "border border-gray-300 rounded-md px-3 py-2.5 outline-none w-full text-[13px] text-gray-700 placeholder:text-gray-400 focus:border-gray-400 transition";

function PanelHeader({ title }: { title: string }) {
  return (
    <div className="bg-axc-navy text-white text-[13px] font-semibold px-4 py-2.5">
      {title}
    </div>
  );
}

function InvoiceRow({
  label, value, remarksLabel, remarksValue, onValueChange, onRemarksChange, readOnly = false,
}: {
  label: string; value: string; remarksLabel?: string; remarksValue?: string;
  onValueChange: (v: string) => void; onRemarksChange?: (v: string) => void; readOnly?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold text-gray-500">{label}</span>
        <input
          value={value}
          readOnly={readOnly}
          onChange={(e) => onValueChange(e.target.value)}
          className={`${inputClass} h-9 text-[12px] ${readOnly ? "bg-gray-50" : ""}`}
        />
      </div>
      {remarksLabel && (
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-gray-500">{remarksLabel}</span>
          <input
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
    <div className="rounded-2xl border border-axc-border bg-white shadow-sm overflow-hidden">
      <PanelHeader title="VENDOR INVOICE" />
      <div className="p-4 space-y-3">
        <InvoiceRow
          label="PAST VENDOR INVOICE"
          value={vendorInvoice.pastVendorInvoice}
          onValueChange={(v) => onChange({ pastVendorInvoice: v })}
        />
        <InvoiceRow
          label="VENDOR INVOICE 1"
          value={vendorInvoice.vendorInvoice1}
          remarksLabel="INVOICE REMARKS 1"
          remarksValue={vendorInvoice.invoiceRemarks1}
          onValueChange={(v) => onChange({ vendorInvoice1: v })}
          onRemarksChange={(v) => onChange({ invoiceRemarks1: v })}
        />
        <InvoiceRow
          label="VENDOR INVOICE 2"
          value={vendorInvoice.vendorInvoice2}
          remarksLabel="INVOICE REMARKS 2"
          remarksValue={vendorInvoice.invoiceRemarks2}
          onValueChange={(v) => onChange({ vendorInvoice2: v })}
          onRemarksChange={(v) => onChange({ invoiceRemarks2: v })}
        />
        <InvoiceRow
          label="VENDOR INVOICE 3"
          value={vendorInvoice.vendorInvoice3}
          remarksLabel="INVOICE REMARKS 3"
          remarksValue={vendorInvoice.invoiceRemarks3}
          onValueChange={(v) => onChange({ vendorInvoice3: v })}
          onRemarksChange={(v) => onChange({ invoiceRemarks3: v })}
        />
        <InvoiceRow
          label="VENDOR INVOICE 4"
          value={vendorInvoice.vendorInvoice4}
          remarksLabel="INVOICE REMARKS 4"
          remarksValue={vendorInvoice.invoiceRemarks4}
          onValueChange={(v) => onChange({ vendorInvoice4: v })}
          onRemarksChange={(v) => onChange({ invoiceRemarks4: v })}
        />
      </div>
    </div>
  );
}