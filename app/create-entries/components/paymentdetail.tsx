"use client";
import React from "react";
import { PaymentDetailsFormState } from "./formstate";
import { FileText, Mail } from "lucide-react";

const inputClass =
  "border border-gray-300 rounded-md px-3 py-2.5 outline-none w-full text-[13px] text-gray-700 placeholder:text-gray-400 focus:border-gray-400 transition";

function PanelHeader({ title }: { title: string }) {
  return (
    <div className="bg-axc-navy text-white text-[13px] font-semibold px-4 py-2.5">
      {title}
    </div>
  );
}

function Row({
  label, value, onChange, readOnly, type = "text",
}: { label: string; value: string; onChange?: (v: string) => void; readOnly?: boolean; type?: string }) {
  return (
    <div>
      <span className="block text-[11px] font-semibold text-gray-500 mb-1">{label}</span>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={`${inputClass} h-9 text-[12px] ${readOnly ? "bg-gray-50" : ""}`}
      />
    </div>
  );
}

export function PaymentDetailsPanel({
  payment, onChange,
}: { payment: PaymentDetailsFormState; onChange: (patch: Partial<PaymentDetailsFormState>) => void }) {
  return (
    <div className="rounded-2xl border border-axc-border bg-white shadow-sm overflow-hidden">
      <PanelHeader title="PAYMENT DETAILS" />
      <div className="p-4 space-y-3">
        <Row label="PAID AMOUNT" value={payment.paidAmount} onChange={(v) => onChange({ paidAmount: v })} />
        <Row label="BALANCE AMOUNT" value={payment.balanceAmount} readOnly />
        <Row label="INVOICE DATE" value={payment.invoiceDate} type="date" onChange={(v) => onChange({ invoiceDate: v })} />

        <div>
          <span className="block text-[11px] font-semibold text-gray-500 mb-1">INVOICE NUMBER</span>
          <div className="flex items-center gap-2">
            <input
              value={payment.invoiceNumber}
              onChange={(e) => onChange({ invoiceNumber: e.target.value })}
              className={`${inputClass} h-9 text-[12px]`}
            />
            <button type="button" title="View invoice" className="h-9 w-9 shrink-0 flex items-center justify-center rounded bg-axc-navy text-white">
              <FileText size={13} />
            </button>
            <button type="button" title="Email invoice" className="h-9 w-9 shrink-0 flex items-center justify-center rounded bg-axc-navy text-white">
              <Mail size={13} />
            </button>
          </div>
        </div>

        <Row label="INVOICE REMARKS" value={payment.invoiceRemarks} onChange={(v) => onChange({ invoiceRemarks: v })} />
        <Row label="PAST INVOICE NO." value={payment.pastInvoiceNo} onChange={(v) => onChange({ pastInvoiceNo: v })} />
        <Row label="CREDIT/DEBIT NOTE" value={payment.creditDebitNote} onChange={(v) => onChange({ creditDebitNote: v })} />
      </div>
    </div>
  );
}