"use client";
import React from "react";
import { InvoiceRemarksFormState, RefundDetailsFormState } from "./formstate";

const inputClass =
  "border border-gray-300 rounded-md px-3 py-2.5 outline-none w-full text-[13px] text-gray-700 placeholder:text-gray-400 focus:border-gray-400 transition";

function PanelHeader({ title }: { title: string }) {
  return (
    <div className="bg-axc-navy text-white text-[13px] font-semibold px-4 py-2.5">
      {title}
    </div>
  );
}

export function InvoiceRemarksPanel({
  remarks, onChange,
}: { remarks: InvoiceRemarksFormState; onChange: (patch: Partial<InvoiceRemarksFormState>) => void }) {
  const rows: { label: string; key: keyof InvoiceRemarksFormState }[] = [
    { label: "INVOICE REMARKS", key: "invoiceRemarks1" },
    { label: "INVOICE REMARKS 2", key: "invoiceRemarks2" },
    { label: "INVOICE REMARKS 3", key: "invoiceRemarks3" },
    { label: "INVOICE REMARKS 4", key: "invoiceRemarks4" },
  ];
  return (
    <div className="rounded-2xl border border-axc-border bg-white shadow-sm overflow-hidden">
      <PanelHeader title="INVOICE REMARKS" />
      <div className="p-4 space-y-3">
        {rows.map((row) => (
          <div key={row.key}>
            <span className="block text-[11px] font-semibold text-gray-500 mb-1">{row.label}</span>
            <input
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
    <div className="rounded-2xl border border-axc-border bg-white shadow-sm overflow-hidden">
      <PanelHeader title="REFUND DETAILS" />
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <span className="block text-[11px] font-semibold text-gray-500 mb-1">REFUND AMOUNT</span>
          <input value={refund.refundAmount} onChange={(e) => onChange({ refundAmount: e.target.value })} className={`${inputClass} h-9 text-[12px]`} />
        </div>
        <div>
          <span className="block text-[11px] font-semibold text-gray-500 mb-1">REFUND DATE</span>
          <input type="date" value={refund.refundDate} onChange={(e) => onChange({ refundDate: e.target.value })} className={`${inputClass} h-9 text-[12px]`} />
        </div>
        <div>
          <span className="block text-[11px] font-semibold text-gray-500 mb-1">REFUND REASON</span>
          <input value={refund.refundReason} onChange={(e) => onChange({ refundReason: e.target.value })} className={`${inputClass} h-9 text-[12px]`} />
        </div>
        <div>
          <span className="block text-[11px] font-semibold text-gray-500 mb-1">REFUND REMARKS</span>
          <input value={refund.refundRemarks} onChange={(e) => onChange({ refundRemarks: e.target.value })} className={`${inputClass} h-9 text-[12px]`} />
        </div>
      </div>
    </div>
  );
}