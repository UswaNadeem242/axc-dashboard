"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { showToast } from "@/app/src/common/toast";
import CustomDatePicker from "@/app/src/common/datepicker";
import CommonDropdown from "@/app/src/common/dropdown";
import {
  FieldLabel,
  PanelHeader,
  EditIconButton,
  FieldError,
  FileUploadField,
  inputClass,
  errorInputClass,
  disabledInputClass,
} from "@/app/create-entries/components/form";
import {
  ReceiptEntry,
  CUSTOMER_OPTIONS,
  COMPANY_OPTIONS,
  ACCOUNT_OPTIONS,
  PAYMENT_MODE_OPTIONS,
  PaymentMode,
  initialReceiptData,
} from "../components/types";

interface FormState {
  receiptNumber: string;
  editReceiptNumber: boolean;
  customer: string;
  customerCode: string;
  company: string;
  editCompany: boolean;
  accountNumber: string;
  amount: string;
  paymentType: string;
  date: string;
  particulars: string;
  fileName: string;
  includeInFutureInvoices: boolean;
  includeInFutureDebitNote: boolean;
}

interface FormErrors {
  receiptNumber?: string;
  customer?: string;
  customerCode?: string;
  company?: string;
  accountNumber?: string;
  amount?: string;
  date?: string;
  particulars?: string;
}

function AddReceiptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEdit = Boolean(editId);

  const getTodayFormatted = () => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const generateReceiptNo = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `RCP-2026-${randomNum}`;
  };

  const [form, setForm] = useState<FormState>({
    receiptNumber: generateReceiptNo(),
    editReceiptNumber: false,
    customer: "",
    customerCode: "",
    company: COMPANY_OPTIONS[0]?.value || "",
    editCompany: false,
    accountNumber: "",
    amount: "",
    paymentType: "",
    date: getTodayFormatted(),
    particulars: "",
    fileName: "",
    includeInFutureInvoices: false,
    includeInFutureDebitNote: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing receipt if in edit mode
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (editId) {
      try {
        const stored = localStorage.getItem("account_receipt_entries");
        const list: ReceiptEntry[] = stored ? JSON.parse(stored) : initialReceiptData;
        const target = list.find(
          (item) => item.receiptNumber.toLowerCase() === editId.toLowerCase()
        );

        if (target) {
          setForm({
            receiptNumber: target.receiptNumber,
            editReceiptNumber: true,
            customer: target.customerName || "",
            customerCode: target.customerCode || "",
            company: target.company || "AXC",
            editCompany: false,
            accountNumber: target.accountNumber || target.bankName || "",
            amount: target.receivedAmount ? String(target.receivedAmount) : "",
            paymentType: target.paymentMode || "",
            date: target.receiptDate || getTodayFormatted(),
            particulars: target.particulars || target.remarks || "",
            fileName: target.fileName || "",
            includeInFutureInvoices: Boolean(target.includeInFutureInvoices),
            includeInFutureDebitNote: Boolean(target.includeInFutureDebitNote),
          });
        }
      } catch (err) {
        console.error("Error loading receipt for edit", err);
      }
    }
  }, [editId]);

  // Sync Customer and Code
  const handleCustomerChange = (customerName: string) => {
    const matched = CUSTOMER_OPTIONS.find((c) => c.value === customerName);
    setForm((prev) => ({
      ...prev,
      customer: customerName,
      customerCode: matched ? matched.code : prev.customerCode,
    }));
    if (errors.customer) setErrors((prev) => ({ ...prev, customer: undefined }));
    if (errors.customerCode) setErrors((prev) => ({ ...prev, customerCode: undefined }));
  };

  const handleCustomerCodeChange = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const matched = CUSTOMER_OPTIONS.find((c) => c.code.toUpperCase() === trimmed);
    setForm((prev) => ({
      ...prev,
      customerCode: code,
      customer: matched ? matched.value : prev.customer,
    }));
    if (errors.customer) setErrors((prev) => ({ ...prev, customer: undefined }));
    if (errors.customerCode) setErrors((prev) => ({ ...prev, customerCode: undefined }));
  };

  // Validation
  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!form.receiptNumber.trim()) {
      errs.receiptNumber = "Receipt Number is required";
    }
    if (!form.customer.trim()) {
      errs.customer = "Customer is required";
    }
    if (!form.company.trim()) {
      errs.company = "Company is required";
    }
    if (!form.accountNumber.trim()) {
      errs.accountNumber = "Account Number is required";
    }
    const amt = parseFloat(form.amount);
    if (!form.amount.trim() || isNaN(amt) || amt <= 0) {
      errs.amount = "Valid amount is required";
    }
    if (!form.date.trim()) {
      errs.date = "Date is required";
    }
    if (!form.particulars.trim()) {
      errs.particulars = "Particulars are required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save / Update Handler
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validate()) {
      showToast({ variant: "error", message: "Please fill in all required fields." });
      return;
    }

    setIsSubmitting(true);

    try {
      const stored = localStorage.getItem("account_receipt_entries");
      const currentList: ReceiptEntry[] = stored ? JSON.parse(stored) : initialReceiptData;
      const rAmt = parseFloat(form.amount) || 0;

      const matchedAccount = ACCOUNT_OPTIONS.find((a) => a.value === form.accountNumber);
      const bankName = matchedAccount ? matchedAccount.label : form.accountNumber;
      const derivedAccountType =
        form.accountNumber.toLowerCase().includes("cash") || form.paymentType === "CASH"
          ? "CASH A/C"
          : form.accountNumber.toLowerCase().includes("saving")
          ? "SAVING A/C"
          : form.accountNumber.toLowerCase().includes("od")
          ? "OD A/C"
          : form.accountNumber.toLowerCase().includes("cc")
          ? "CC A/C"
          : "CURRENT A/C";
      const derivedGatewayType =
        form.paymentType === "ONLINE" || form.paymentType === "APPLE PAY"
          ? "Online Gateway"
          : form.paymentType === "CASH"
          ? "Counter Cash"
          : form.paymentType === "CHEQUE"
          ? "Cheque Clearing"
          : form.paymentType === "CARD"
          ? "POS Terminal"
          : "Bank Wire";

      const codeUpper = form.customerCode.toUpperCase();
      const derivedHub = codeUpper.startsWith("SKT")
        ? "SIALKOT"
        : codeUpper.startsWith("LHE")
        ? "LAHORE"
        : codeUpper.startsWith("KHI")
        ? "KARACHI"
        : codeUpper.startsWith("ISB")
        ? "ISLAMABAD"
        : codeUpper.startsWith("DEL")
        ? "DELHI"
        : codeUpper.startsWith("BOM") || codeUpper.startsWith("MUM")
        ? "MUMBAI"
        : "SIALKOT";

      const derivedYear = form.date ? String(new Date(form.date).getFullYear() || "2026") : "2026";

      if (isEdit && editId) {
        // Update existing entry
        const updatedList = currentList.map((item) => {
          if (item.receiptNumber.toLowerCase() === editId.toLowerCase()) {
            return {
              ...item,
              receiptNumber: form.receiptNumber.trim(),
              receiptDate: form.date,
              customerName: form.customer.trim(),
              customerCode: form.customerCode.trim(),
              company: form.company,
              accountNumber: form.accountNumber,
              bankName: bankName,
              accountType: derivedAccountType,
              gatewayType: derivedGatewayType,
              hub: derivedHub,
              calendarYear: derivedYear,
              customerYear: derivedYear,
              receivedAmount: rAmt,
              netAmount: rAmt,
              paymentMode: (form.paymentType as PaymentMode) || item.paymentMode || "BANK_TRANSFER",
              particulars: form.particulars.trim(),
              remarks: form.particulars.trim(),
              fileName: form.fileName,
              includeInFutureInvoices: form.includeInFutureInvoices,
              includeInFutureDebitNote: form.includeInFutureDebitNote,
            };
          }
          return item;
        });

        localStorage.setItem("account_receipt_entries", JSON.stringify(updatedList));
        showToast({
          variant: "success",
          message: `Receipt ${form.receiptNumber} updated successfully!`,
        });
      } else {
        // Add new receipt entry
        const newEntry: ReceiptEntry = {
          id: `rcp-${Date.now()}`,
          srNo: currentList.length + 1,
          receiptNumber: form.receiptNumber.trim(),
          receiptDate: form.date,
          customerName: form.customer.trim(),
          customerCode: form.customerCode.trim(),
          company: form.company,
          accountNumber: form.accountNumber,
          bankName: bankName,
          accountType: derivedAccountType,
          gatewayType: derivedGatewayType,
          hub: derivedHub,
          calendarYear: derivedYear,
          customerYear: derivedYear,
          paymentMode: (form.paymentType as PaymentMode) || "BANK_TRANSFER",
          referenceNumber: form.receiptNumber.trim(),
          againstDocType: "INVOICE",
          againstDocNumber: "",
          receivedAmount: rAmt,
          deductionAmount: 0,
          netAmount: rAmt,
          currency: "PKR",
          status: "CLEARED",
          createdBy: "ACCOUNTS 5",
          createdDate: `${form.date} 12:00 PM`,
          particulars: form.particulars.trim(),
          remarks: form.particulars.trim(),
          fileName: form.fileName,
          includeInFutureInvoices: form.includeInFutureInvoices,
          includeInFutureDebitNote: form.includeInFutureDebitNote,
        };

        const updatedList = [newEntry, ...currentList];
        localStorage.setItem("account_receipt_entries", JSON.stringify(updatedList));
        showToast({
          variant: "success",
          message: `Receipt ${newEntry.receiptNumber} created successfully!`,
        });
      }

      router.push("/accounts/receipt");
    } catch (err) {
      console.error("Failed to save receipt", err);
      showToast({ variant: "error", message: "Failed to save receipt. Please try again." });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Scrollable Form Body */}
        <div className="flex-1 min-h-0 overflow-y-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            {/* Main Panel matching AWB Design */}
            <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col">
              <PanelHeader
                title={isEdit ? "Receipt Information (Edit)" : "Receipt Information"}
                // right={
                //   <span className="text-white text-xs px-2.5 py-1 rounded font-medium bg-white/20">
                //     STATUS: ACTIVE
                //   </span>
                // }
              />

              {/* 3-Column Grid matching Air Waybill Information UI */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3">
                {/* 1. Receipt No. (matching Awb Number with EditIconButton) */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Receipt No.</FieldLabel>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.receiptNumber}
                      readOnly={!form.editReceiptNumber}
                      placeholder={!form.editReceiptNumber ? "AUTO-GENERATED" : "Receipt Number"}
                      onChange={(e) => {
                        setForm({ ...form, receiptNumber: e.target.value });
                        if (errors.receiptNumber) setErrors({ ...errors, receiptNumber: undefined });
                      }}
                      className={`${
                        errors.receiptNumber ? errorInputClass : inputClass
                      } w-full pr-10 text-regular-small ${
                        form.editReceiptNumber ? "bg-white" : "bg-gray-50 text-gray-500 cursor-not-allowed"
                      }`}
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2">
                      <EditIconButton
                        active={form.editReceiptNumber}
                        onToggle={() =>
                          setForm({ ...form, editReceiptNumber: !form.editReceiptNumber })
                        }
                        title="Edit Receipt Number"
                      />
                    </div>
                  </div>
                  <FieldError message={errors.receiptNumber} />
                </div>

                {/* 2. Customer */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Customer</FieldLabel>
                  <CommonDropdown
                    value={form.customer}
                    onChange={handleCustomerChange}
                    className="border-axc-border"
                    placeholder="Select Customer..."
                    options={CUSTOMER_OPTIONS.map((c) => ({
                      value: c.value,
                      label: `${c.value} (${c.code})`,
                    }))}
                  />
                  <FieldError message={errors.customer} />
                </div>

                {/* 3. Customer Code */}
                {/* <div className="flex flex-col gap-1">
                  <FieldLabel required>Customer Code</FieldLabel>
                  <input
                    type="text"
                    value={form.customerCode}
                    onChange={(e) => handleCustomerCodeChange(e.target.value)}
                    className={errors.customerCode ? errorInputClass : inputClass}
                    placeholder="Customer Code"
                  />
                  <FieldError message={errors.customerCode} />
                </div> */}

                {/* 4. Company (matching Company in screenshot with EditIconButton) */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Company</FieldLabel>
                  {/* <div className="relative"> */}
                    <CommonDropdown
                      value={form.company}
                      onChange={(val) => {
                        setForm({ ...form, company: val });
                        if (errors.company) setErrors({ ...errors, company: undefined });
                      }}
                      className="border-axc-border"
                      placeholder="Select Company..."
                      options={COMPANY_OPTIONS}
                    />
                    {/* <div className="absolute right-1 top-1/2 -translate-y-1/2">
                      <EditIconButton
                        active={form.editCompany}
                        onToggle={() => setForm({ ...form, editCompany: !form.editCompany })}
                        title="Edit Company"
                      />
                    </div> */}
                  {/* </div> */}
                  <FieldError message={errors.company} />
                </div>

                {/* 5. Account No. */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Account No.</FieldLabel>
                  <CommonDropdown
                    value={form.accountNumber}
                    onChange={(val) => {
                      setForm({ ...form, accountNumber: val });
                      if (errors.accountNumber) setErrors({ ...errors, accountNumber: undefined });
                    }}
                    className="border-axc-border"
                    placeholder="Select Account..."
                    options={ACCOUNT_OPTIONS}
                  />
                  <FieldError message={errors.accountNumber} />
                </div>

                {/* 6. Amount */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Amount</FieldLabel>
                  <input
                    type="number"
                    step="any"
                    value={form.amount}
                    onChange={(e) => {
                      setForm({ ...form, amount: e.target.value });
                      if (errors.amount) setErrors({ ...errors, amount: undefined });
                    }}
                    className={errors.amount ? errorInputClass : inputClass}
                    placeholder="0.00"
                  />
                  <FieldError message={errors.amount} />
                </div>

                {/* 7. Payment Type */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Payment Type</FieldLabel>
                  <CommonDropdown
                    value={form.paymentType}
                    onChange={(val) => setForm({ ...form, paymentType: val })}
                    className="border-axc-border"
                    placeholder="SELECT..."
                    options={PAYMENT_MODE_OPTIONS}
                  />
                </div>

                {/* 8. Date (matching Booking Date with CustomDatePicker) */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Date</FieldLabel>
                  <CustomDatePicker
                    value={form.date}
                    onChange={(val) => {
                      setForm({ ...form, date: val });
                      if (errors.date) setErrors({ ...errors, date: undefined });
                    }}
                    placeholder="Select Date"
                  />
                  <FieldError message={errors.date} />
                </div>

                {/* Spacer to align grid neatly on 3 columns */}
                {/* <div className="hidden xl:block" /> */}

                {/* 9. Particulars (Full width across all 3 columns, matching 'Content' in screenshot) */}
                <div className="flex flex-col gap-1 sm:col-span-2 xl:col-span-2">
                  <FieldLabel required>Particulars</FieldLabel>
                  <input
                    type="text"
                    value={form.particulars}
                    onChange={(e) => {
                      setForm({ ...form, particulars: e.target.value });
                      if (errors.particulars) setErrors({ ...errors, particulars: undefined });
                    }}
                    className={errors.particulars ? errorInputClass : inputClass}
                    placeholder="Enter receipt particulars or description here"
                  />
                  <FieldError message={errors.particulars} />
                </div>

                {/* 10. File (Full width across all 3 columns) */}
                <div className="flex flex-col gap-1 sm:col-span-2 xl:col-span-3">
                  <FieldLabel>File</FieldLabel>
                  <FileUploadField
                    onFileChange={(file) => setForm({ ...form, fileName: file ? file.name : "" })}
                    placeholder="Drop your file here or browse"
                    acceptedLabel="JPEG, PNG, PDF formats, up to 10MB"
                  />
                </div>

                {/* 11. Checkboxes (Full width across all 3 columns) */}
                <div className="flex flex-wrap items-center gap-6 sm:col-span-2 xl:col-span-3 pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-axc-dark-gray uppercase tracking-wide cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.includeInFutureInvoices}
                      onChange={(e) =>
                        setForm({ ...form, includeInFutureInvoices: e.target.checked })
                      }
                      className="w-4 h-4 accent-axc-navy cursor-pointer"
                    />
                    INCLUDE IT IN FUTURE INVOICES
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-axc-dark-gray uppercase tracking-wide cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.includeInFutureDebitNote}
                      onChange={(e) =>
                        setForm({ ...form, includeInFutureDebitNote: e.target.checked })
                      }
                      className="w-4 h-4 accent-axc-navy cursor-pointer"
                    />
                    INCLUDE IT IN FUTURE DEBIT NOTE
                  </label>
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons: BACK & Save matching reference image */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <div className="flex items-center gap-3">
                

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AddReceiptPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-gray-500 animate-pulse">
          Loading Receipt Form...
        </div>
      }
    >
      <AddReceiptContent />
    </Suspense>
  );
}
