"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { showToast } from "@/app/src/common/toast";
import CustomDatePicker from "@/app/src/common/datepicker";
import CommonDropdown from "@/app/src/common/dropdown";
import {
  FieldLabel,
  PanelHeader,
  FieldError,
  FileUploadField,
  inputClass,
  errorInputClass,
} from "@/app/create-entries/components/form";
import {
  BankTransferEntry,
  COMPANY_OPTIONS,
  BANK_ACCOUNT_OPTIONS,
  SEND_TO_ACCOUNT_OPTIONS,
  initialBankTransferData,
} from "../components/types";

interface FormState {
  transferNumber: string;
  company: string;
  accountNumber: string; // From Account
  amount: string;
  sendToAccount: string; // To Account
  date: string;
  particulars: string;
  fileName: string;
}

interface FormErrors {
  company?: string;
  accountNumber?: string;
  amount?: string;
  sendToAccount?: string;
  date?: string;
  particulars?: string;
}

function AddBankTransferContent() {
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

  const generateTransferNo = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `TRF-2026-${randomNum}`;
  };

  const [form, setForm] = useState<FormState>({
    transferNumber: generateTransferNo(),
    company: COMPANY_OPTIONS[0]?.value || "",
    accountNumber: "",
    amount: "",
    sendToAccount: "",
    date: getTodayFormatted(),
    particulars: "",
    fileName: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing transfer if in edit mode
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (editId) {
      try {
        const stored = localStorage.getItem("account_bank_transfer_entries");
        const list: BankTransferEntry[] = stored ? JSON.parse(stored) : initialBankTransferData;
        const target = list.find(
          (item) => item.transferNumber.toLowerCase() === editId.toLowerCase()
        );

        if (target) {
          const normalizeAccount = (val?: string) => {
            if (!val) return "";
            if (val.toLowerCase().includes("cash")) return "CASH (CASH)";
            return "BANK (BANK)";
          };

          setForm({
            transferNumber: target.transferNumber,
            company: target.company || "",
            accountNumber: normalizeAccount(target.fromAccount),
            amount: target.amount ? String(target.amount) : "",
            sendToAccount: normalizeAccount(target.toAccount),
            date: target.transferDate || getTodayFormatted(),
            particulars: target.particulars || "",
            fileName: target.fileName || "",
          });
        }
      } catch (err) {
        console.error("Error loading bank transfer for edit", err);
      }
    }
  }, [editId]);

  // Validation
  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!form.company.trim()) {
      errs.company = "Company is required";
    }
    if (!form.accountNumber.trim()) {
      errs.accountNumber = "Account No. is required";
    }
    const amt = parseFloat(form.amount);
    if (!form.amount.trim() || isNaN(amt) || amt <= 0) {
      errs.amount = "Valid amount is required";
    }
    if (!form.sendToAccount.trim()) {
      errs.sendToAccount = "Send To Account is required";
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

  // Submit Handler
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validate()) {
      showToast({ variant: "error", message: "Please fill in all required fields." });
      return;
    }

    setIsSubmitting(true);

    try {
      const stored = localStorage.getItem("account_bank_transfer_entries");
      const currentList: BankTransferEntry[] = stored ? JSON.parse(stored) : initialBankTransferData;
      const transferAmt = parseFloat(form.amount) || 0;

      if (isEdit && editId) {
        // Update existing entry
        const updatedList = currentList.map((item) => {
          if (item.transferNumber.toLowerCase() === editId.toLowerCase()) {
            return {
              ...item,
              company: form.company,
              fromAccount: form.accountNumber,
              toAccount: form.sendToAccount,
              amount: transferAmt,
              transferDate: form.date,
              particulars: form.particulars.trim(),
              fileName: form.fileName,
            };
          }
          return item;
        });

        localStorage.setItem("account_bank_transfer_entries", JSON.stringify(updatedList));
        showToast({
          variant: "success",
          message: `Bank Transfer ${form.transferNumber} updated successfully!`,
        });
      } else {
        // Create new bank transfer entry
        const newEntry: BankTransferEntry = {
          id: `trf-${Date.now()}`,
          srNo: currentList.length + 1,
          transferNumber: form.transferNumber,
          transferDate: form.date,
          company: form.company,
          fromAccount: form.accountNumber,
          toAccount: form.sendToAccount,
          amount: transferAmt,
          particulars: form.particulars.trim(),
          fileName: form.fileName,
          status: "COMPLETED",
          referenceNumber: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
          createdBy: "ACCOUNTS",
          createdDate: `${form.date} 12:00 PM`,
        };

        const updatedList = [newEntry, ...currentList];
        localStorage.setItem("account_bank_transfer_entries", JSON.stringify(updatedList));
        showToast({
          variant: "success",
          message: `Bank Transfer ${newEntry.transferNumber} created successfully!`,
        });
      }

      router.push("/accounts/bank-transfer");
    } catch (err) {
      console.error("Failed to save bank transfer", err);
      showToast({ variant: "error", message: "Failed to save transfer. Please try again." });
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
                title={isEdit ? "Bank Transfer Information (Edit)" : "Bank Transfer Information"}
              />

              {/* Grid matching AWB Entry Design */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3.5">
                {/* 1. COMPANY * */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Company</FieldLabel>
                  <CommonDropdown
                    value={form.company}
                    onChange={(val) => {
                      setForm({ ...form, company: val });
                      if (errors.company) setErrors({ ...errors, company: undefined });
                    }}
                    className="border-axc-border"
                    placeholder="SELECT..."
                    options={COMPANY_OPTIONS}
                  />
                  <FieldError message={errors.company} />
                </div>

                {/* 2. ACCOUNT NO. * */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Account No.</FieldLabel>
                  <CommonDropdown
                    value={form.accountNumber}
                    onChange={(val) => {
                      setForm({ ...form, accountNumber: val });
                      if (errors.accountNumber) setErrors({ ...errors, accountNumber: undefined });
                    }}
                    className="border-axc-border"
                    placeholder="SELECT..."
                    options={BANK_ACCOUNT_OPTIONS}
                  />
                  <FieldError message={errors.accountNumber} />
                </div>

                {/* 3. AMOUNT * */}
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

                {/* 4. SEND TO ACCOUNT * */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Send To Account</FieldLabel>
                  <CommonDropdown
                    value={form.sendToAccount}
                    onChange={(val) => {
                      setForm({ ...form, sendToAccount: val });
                      if (errors.sendToAccount) setErrors({ ...errors, sendToAccount: undefined });
                    }}
                    className="border-axc-border"
                    placeholder="SELECT..."
                    options={SEND_TO_ACCOUNT_OPTIONS}
                  />
                  <FieldError message={errors.sendToAccount} />
                </div>

                {/* 5. DATE * */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Date</FieldLabel>
                  <CustomDatePicker
                    value={form.date}
                    onChange={(val) => {
                      setForm({ ...form, date: val });
                      if (errors.date) setErrors({ ...errors, date: undefined });
                    }}
                    placeholder="mm/dd/yyyy"
                  />
                  <FieldError message={errors.date} />
                </div>

                {/* 6. PARTICULARS * (Spans across remaining columns) */}
                <div className="flex flex-col gap-1 sm:col-span-2 xl:col-span-1">
                  <FieldLabel required>Particulars</FieldLabel>
                  <input
                    type="text"
                    value={form.particulars}
                    onChange={(e) => {
                      setForm({ ...form, particulars: e.target.value });
                      if (errors.particulars) setErrors({ ...errors, particulars: undefined });
                    }}
                    className={errors.particulars ? errorInputClass : inputClass}
                    placeholder="Enter transfer particulars or reason here"
                  />
                  <FieldError message={errors.particulars} />
                </div>

                {/* 7. FILE (Full width across all columns) */}
                <div className="flex flex-col gap-1 sm:col-span-2 xl:col-span-3">
                  <FieldLabel>File</FieldLabel>
                  <FileUploadField
                    onFileChange={(file) => setForm({ ...form, fileName: file ? file.name : "" })}
                    placeholder="Drop transaction voucher here or browse"
                    acceptedLabel="JPEG, PNG, PDF formats, up to 10MB"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar matching reference image (BACK & Save buttons) */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/accounts/bank-transfer")}
                className="px-6 py-2.5 rounded-md border border-gray-300 bg-gray-500 hover:bg-gray-600 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-sm"
              >
                BACK
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : isEdit ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AddBankTransferPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-gray-500 animate-pulse">
          Loading Bank Transfer Form...
        </div>
      }
    >
      <AddBankTransferContent />
    </Suspense>
  );
}
