"use client";
import React from "react";
import { PaymentDetailsFormState } from "./formstate";
import { FileText, Mail } from "lucide-react";
import CustomDatePicker from "../../src/common/datepicker";

const inputClass =
  "border border-axc-border rounded-md px-3 py-2.5 outline-none w-full text-regular-small text-axc-gray placeholder:text-axc-gray transition";

function PanelHeader({ title }: { title: string }) {
  return (
    <div className="bg-axc-navy/60 text-white p-4  rounded-tl-lg  rounded-tr-lg flex items-center justify-between gap-2">
    <h3> {title}</h3> 
    </div>
  );
}

function Row({
  label, value, onChange, readOnly, type = "text", placeholder
}: { label: string; value: string; onChange?: (v: string) => void; readOnly?: boolean; type?: string; placeholder?: string }) {
  return (
    <div>
      <span className="block text-regular-medium text-axc-dark-gray mb-1">{label}</span>
      <input
        placeholder={placeholder}
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
    <div className="rounded-lg border border-axc-border bg-white shadow-sm flex flex-col">
      <PanelHeader title="Payment Details" />
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Row label="Paid amount" value={payment.paidAmount} onChange={(v) => onChange({ paidAmount: v })} placeholder="Paid amount" />
        <Row label="Balance amount" value={payment.balanceAmount} readOnly placeholder="Balance amount" />
        <div className="relative z-20">
          <span className="block text-regular-medium text-axc-dark-gray mb-1">Invoice Date</span>
          <CustomDatePicker
            value={payment.invoiceDate}
            onChange={(val) => onChange({ invoiceDate: val })}
            placeholder="Select Invoice Date"
          />
        </div>

        <div>
          <span className="block text-regular-medium text-axc-dark-gray mb-1">Invoice number</span>
          <div className="flex items-center gap-2">
            <input
              placeholder="0000000"
              value={payment.invoiceNumber}
              onChange={(e) => onChange({ invoiceNumber: e.target.value })}
              className={`${inputClass} h-9 text-sm`}
            />
            <button type="button" title="View invoice" className="h-9 w-9 shrink-0 flex items-center justify-center rounded bg-axc-navy text-white hover:bg-axc-navy/90 transition cursor-pointer">
              <FileText size={13} />
            </button>
            <button type="button" title="Email invoice" className="h-9 w-9 shrink-0 flex items-center justify-center rounded bg-axc-navy text-white hover:bg-axc-navy/90 transition cursor-pointer">
              <Mail size={13} />
            </button>
          </div>
        </div>

        <Row label="Invoice Remarks" value={payment.invoiceRemarks} onChange={(v) => onChange({ invoiceRemarks: v })} placeholder="Invoice Remarks" />
        <Row label="Past Invoice No" value={payment.pastInvoiceNo} onChange={(v) => onChange({ pastInvoiceNo: v })} placeholder="Past Invoice No" />
        <Row label="Credit/Debit Note" value={payment.creditDebitNote} onChange={(v) => onChange({ creditDebitNote: v })} placeholder="Credit/Debit Note" />
      </div>
    </div>
  );
}