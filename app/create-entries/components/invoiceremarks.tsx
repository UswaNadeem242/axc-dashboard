"use client";
import React from "react";
import { InvoiceRemarksFormState, RefundDetailsFormState } from "./formstate";
import CustomDatePicker from "../../src/common/datepicker";
import { PanelHeader } from "./form";

const inputClass =
  "border border-axc-border rounded-md px-3 py-2.5 outline-none w-full  text-regular-small  text-axc-gray  placeholder:text-axc-gray placeholder:text-regular-small   outline-none    transition";

export function InvoiceRemarksPanel({
  remarks, onChange,
}: { remarks: InvoiceRemarksFormState; onChange: (patch: Partial<InvoiceRemarksFormState>) => void }) {
  const rows: { label: string; key: keyof InvoiceRemarksFormState }[] = [
    { label: "Invoice Remarks", key: "invoiceRemarks1" },
    { label: "Invoice Remarks 2", key: "invoiceRemarks2" },
    { label: "Invoice Remarks 3", key: "invoiceRemarks3" },
    { label: "Invoice Remarks 4", key: "invoiceRemarks4" },
  ];
  return (
    <div className="rounded-lg border border-axc-border bg-white shadow-sm overflow-hidden">
      <PanelHeader title="Invoice Remarks" />
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rows.map((row) => (
          <div key={row.key}>
            <span className="block text-regular-medium text-axc-dark-gray mb-1">{row.label}</span>
            <input
              placeholder={row.label}
              value={remarks[row.key]}
              onChange={(e) => onChange({ [row.key]: e.target.value } as Partial<InvoiceRemarksFormState>)}
              className={`${inputClass} h-9 text-[12px]`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RefundDetailsPanel({
  refund, onChange,
}: { refund: RefundDetailsFormState; onChange: (patch: Partial<RefundDetailsFormState>) => void }) {
  return (
    <div className="rounded-lg border border-axc-border bg-white shadow-sm flex flex-col">
      <PanelHeader title="Refund Details" />
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <span className="block text-regular-medium text-axc-dark-gray  mb-1">Refund Amount</span>
          <input value={refund.refundAmount} onChange={(e) => onChange({ refundAmount: e.target.value })} className={`${inputClass} h-9 text-[12px]`} placeholder="Refund Amount
"/>
        </div>
        <div className="relative z-20">
          <span className="block text-regular-medium text-axc-dark-gray  mb-1">Refund Date</span>
          <CustomDatePicker
            value={refund.refundDate}
            onChange={(val) => onChange({ refundDate: val })}
            placeholder="Select Refund Date"
          />
        </div>
        <div>
          <span className="block text-regular-medium text-axc-dark-gray  mb-1">Refund Reason</span>
          <input value={refund.refundReason} onChange={(e) => onChange({ refundReason: e.target.value })} className={`${inputClass} h-9 text-[12px]`} placeholder="Refund Reason" />
        </div>
        <div>
          <span className="block text-regular-medium text-axc-dark-gray  mb-1">Refund Remarks</span>
          <input value={refund.refundRemarks} onChange={(e) => onChange({ refundRemarks: e.target.value })} className={`${inputClass} h-9 text-[12px]`} placeholder="Refund Remarks" />
        </div>
      </div>
    </div>
  );
}