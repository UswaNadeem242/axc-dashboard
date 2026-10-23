"use client";

import React, { useState, useEffect } from "react";
import { X, Receipt, Check, AlertCircle } from "lucide-react";
import {
  ReceiptEntry,
  ReceiptFormData,
  CUSTOMER_OPTIONS,
  BANK_OPTIONS,
  PAYMENT_MODE_OPTIONS,
  RECEIPT_STATUS_OPTIONS,
  AGAINST_DOC_TYPE_OPTIONS,
} from "./types";
import CustomDatePicker from "@/app/src/common/datepicker";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ReceiptFormData, isEdit: boolean) => void;
  initialData?: ReceiptEntry | null;
}

export default function ReceiptModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ReceiptModalProps) {
  const isEdit = Boolean(initialData);

  const getTodayFormatted = () => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [form, setForm] = useState<ReceiptFormData>({
    receiptNumber: `RCP-2026-${Math.floor(100 + Math.random() * 900)}`,
    receiptDate: getTodayFormatted(),
    customerName: CUSTOMER_OPTIONS[0].value,
    customerCode: CUSTOMER_OPTIONS[0].code,
    paymentMode: "BANK_TRANSFER",
    referenceNumber: "",
    bankName: BANK_OPTIONS[0].value,
    againstDocType: "INVOICE",
    againstDocNumber: "",
    receivedAmount: "",
    deductionAmount: "0",
    netAmount: "0",
    currency: "PKR",
    status: "CLEARED",
    remarks: "",
  });

  const [editReceiptNo, setEditReceiptNo] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        receiptNumber: initialData.receiptNumber,
        receiptDate: initialData.receiptDate,
        customerName: initialData.customerName,
        customerCode: initialData.customerCode,
        paymentMode: initialData.paymentMode,
        referenceNumber: initialData.referenceNumber,
        bankName: initialData.bankName,
        againstDocType: initialData.againstDocType,
        againstDocNumber: initialData.againstDocNumber,
        receivedAmount: initialData.receivedAmount,
        deductionAmount: initialData.deductionAmount,
        netAmount: initialData.netAmount,
        currency: initialData.currency || "PKR",
        status: initialData.status,
        remarks: initialData.remarks || "",
        chequeDate: initialData.chequeDate || "",
      });
      setEditReceiptNo(true);
    } else {
      setForm({
        receiptNumber: `RCP-2026-${Math.floor(100 + Math.random() * 900)}`,
        receiptDate: getTodayFormatted(),
        customerName: CUSTOMER_OPTIONS[0].value,
        customerCode: CUSTOMER_OPTIONS[0].code,
        paymentMode: "BANK_TRANSFER",
        referenceNumber: "",
        bankName: BANK_OPTIONS[0].value,
        againstDocType: "INVOICE",
        againstDocNumber: "",
        receivedAmount: "",
        deductionAmount: "0",
        netAmount: "0",
        currency: "PKR",
        status: "CLEARED",
        remarks: "",
      });
      setEditReceiptNo(false);
    }
    setErrorMsg("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleCustomerChange = (custName: string) => {
    const matched = CUSTOMER_OPTIONS.find((c) => c.value === custName);
    setForm((prev) => ({
      ...prev,
      customerName: custName,
      customerCode: matched?.code || "",
    }));
  };

  const handleAmountChange = (field: "receivedAmount" | "deductionAmount", val: string) => {
    setForm((prev) => {
      const received = field === "receivedAmount" ? parseFloat(val) || 0 : parseFloat(String(prev.receivedAmount)) || 0;
      const deduction = field === "deductionAmount" ? parseFloat(val) || 0 : parseFloat(String(prev.deductionAmount)) || 0;
      const net = Math.max(0, received - deduction);

      return {
        ...prev,
        [field]: val,
        netAmount: net.toFixed(2),
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.receiptNumber.trim()) {
      setErrorMsg("Please provide a valid Receipt Number.");
      return;
    }
    if (!form.customerName.trim()) {
      setErrorMsg("Please select a customer.");
      return;
    }
    const rAmt = parseFloat(String(form.receivedAmount));
    if (isNaN(rAmt) || rAmt <= 0) {
      setErrorMsg("Please enter a valid Received Amount.");
      return;
    }

    onSave(form, isEdit);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-axc-navy text-white">
              <Receipt size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-axc-dark-gray">
                {isEdit ? `Edit Receipt: ${initialData?.receiptNumber}` : "New Money Receipt"}
              </h3>
              <p className="text-xs text-gray-500">
                Record customer payments, wire transfers, and collections
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Receipt Number & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  Receipt Number *
                </label>
                <button
                  type="button"
                  onClick={() => setEditReceiptNo(!editReceiptNo)}
                  className="text-[10px] text-axc-navy font-semibold hover:underline cursor-pointer"
                >
                  {editReceiptNo ? "Lock" : "Edit"}
                </button>
              </div>
              <input
                type="text"
                disabled={!editReceiptNo}
                value={form.receiptNumber}
                onChange={(e) => setForm({ ...form, receiptNumber: e.target.value })}
                className={`w-full rounded-lg border px-3 py-2 text-xs font-mono font-bold ${
                  editReceiptNo
                    ? "border-blue-400 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    : "border-gray-200 bg-gray-50 text-gray-700 cursor-not-allowed"
                }`}
                placeholder="e.g. RCP-2026-001"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Receipt Date *
              </label>
              <CustomDatePicker
                value={form.receiptDate}
                onChange={(dateStr) => setForm({ ...form, receiptDate: dateStr })}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Status *
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {RECEIPT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Customer Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Customer Name *
              </label>
              <select
                value={form.customerName}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-800 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {CUSTOMER_OPTIONS.map((cust) => (
                  <option key={cust.code} value={cust.value}>
                    {cust.value} ({cust.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Customer Code
              </label>
              <input
                type="text"
                readOnly
                value={form.customerCode}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-mono font-semibold text-axc-navy cursor-not-allowed"
              />
            </div>
          </div>

          {/* Section 3: Payment Mode, Reference & Bank */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Payment Mode *
              </label>
              <select
                value={form.paymentMode}
                onChange={(e) => setForm({ ...form, paymentMode: e.target.value as any })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {PAYMENT_MODE_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Reference / Txn / Cheque No
              </label>
              <input
                type="text"
                value={form.referenceNumber}
                onChange={(e) => setForm({ ...form, referenceNumber: e.target.value })}
                placeholder="e.g. UTR-998812 / CHQ-10492"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Deposited Bank Account *
              </label>
              <select
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-800 bg-white focus:outline-none focus:border-blue-500 cursor-pointer truncate"
              >
                {BANK_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 4: Against Document */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Against Document Type
              </label>
              <select
                value={form.againstDocType}
                onChange={(e) => setForm({ ...form, againstDocType: e.target.value as any })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-800 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {AGAINST_DOC_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Against Document / Invoice No
              </label>
              <input
                type="text"
                value={form.againstDocNumber}
                onChange={(e) => setForm({ ...form, againstDocNumber: e.target.value })}
                placeholder="e.g. INV-2026-081 or RUN 07"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono text-gray-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Section 5: Financial Breakdown */}
          <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-200 space-y-3">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Payment & Deduction Amounts
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Received Amount (PKR) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.receivedAmount}
                  onChange={(e) => handleAmountChange("receivedAmount", e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  TDS / Bank Deductions (PKR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.deductionAmount}
                  onChange={(e) => handleAmountChange("deductionAmount", e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-mono text-gray-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Net Amount Credited (PKR)
                </label>
                <input
                  type="text"
                  readOnly
                  value={Number(form.netAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  className="w-full rounded-lg border border-emerald-300 bg-emerald-50/50 px-3 py-2 text-xs font-mono font-extrabold text-emerald-800 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Remarks */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Remarks & Accounting Notes
            </label>
            <textarea
              rows={2}
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              placeholder="e.g. Settlement for Run 07 corporate invoice..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-axc-navy text-xs font-semibold text-white hover:bg-axc-navy/90 transition shadow-sm cursor-pointer"
            >
              {isEdit ? "Update Receipt" : "Save Receipt"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
