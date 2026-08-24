"use client";
import React, { useState } from "react";
import { AwbInvoiceRow, SingleInvoiceFormState, SingleInvoiceSearchState, ToastState } from "./invoicestate";
export const inputClass = "w-full border border-axc-border rounded px-2 py-1.5 text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500";

export const errorInputClass = "w-full border border-red-400 rounded px-2 py-1.5 text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-red-500";

export function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="font-bold text-gray-600 uppercase text-[11px]">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="text-[10px] text-red-500 mt-0.5">{message}</span>;
}

export function PanelHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="bg-axc-navy text-white px-4 py-2.5 flex items-center justify-between">
      <span className="text-xs font-bold uppercase tracking-wide">{title}</span>
      {right}
    </div>
  );
}

export function EditIconButton({ active, onToggle, title }: { active: boolean; onToggle: () => void; title?: string }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onToggle}
      className={`shrink-0 h-7 w-7 flex items-center justify-center rounded border text-[11px] font-bold transition ${
        active ? "bg-axc-navy text-white border-axc-navy" : "bg-white text-gray-500 border-axc-border hover:bg-gray-50"
      }`}
    >
      ✎
    </button>
  );
}
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
const todayStr = `${yyyy}-${mm}-${dd}`;

const emptySearch: SingleInvoiceSearchState = {
  customer: "",
  billingCompany: "",
  bankDetails: "",
  gstNumber: "",
  invoiceRange: "",
  fromDate: "",
  tillDate: "",
  service: "",
  vendor: "",
  product: "",
  runNumber: "",
};

const emptyForm: SingleInvoiceFormState = {
  invoiceNo: "",
  invoiceDate: todayStr,
  dueDate: todayStr,
  noteForCustomer: "",
  invoiceCurrency: "",
};

const emptyAwbRow = (id: number): AwbInvoiceRow => ({
  id,
  awbNumber: "",
  bookingDate: "",
  forwardingNumber: "",
  destination: "",
  product: "",
  pcs: "",
  fsc: "",
  chargeableWeight: "",
  freightAmount: "",
  grandTotal: "",
});

type SingleInvoiceErrorKey = keyof SingleInvoiceSearchState | "invoiceNo" | "awbRows";
type SingleInvoiceErrors = Partial<Record<SingleInvoiceErrorKey, string>>;

export function useSingleCustomerInvoiceForm() {
  const [search, setSearch] = useState<SingleInvoiceSearchState>(emptySearch);
  const [form, setForm] = useState<SingleInvoiceFormState>(emptyForm);
  const [awbRows, setAwbRows] = useState<AwbInvoiceRow[]>([]);
  const [errors, setErrors] = useState<SingleInvoiceErrors>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastState["type"] = "info") => {
    setToast({ message, type });
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 2600);
  };

  const updateSearchField = <K extends keyof SingleInvoiceSearchState>(key: K, value: SingleInvoiceSearchState[K]) => {
    setSearch((prev: SingleInvoiceSearchState) => ({ ...prev, [key]: value }));
  };

  const updateFormField = <K extends keyof SingleInvoiceFormState>(key: K, value: SingleInvoiceFormState[K]) => {
    setForm((prev: SingleInvoiceFormState) => ({ ...prev, [key]: value }));
  };
  const addAwbRow = () => {
    setAwbRows((prev) => [...prev, emptyAwbRow(Date.now())]);
    setErrors((prev) => ({ ...prev, awbRows: undefined }));
  };
  const updateAwbRow = <K extends keyof AwbInvoiceRow>(id: number, key: K, value: AwbInvoiceRow[K]) => {
    setAwbRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const updated = { ...row, [key]: value };
        if (key === "freightAmount") {
          updated.grandTotal = value as string;
        }
        return updated;
      })
    );
  };

  const removeAwbRow = (id: number) => {
    setAwbRows((prev: AwbInvoiceRow[]) => prev.filter((row) => row.id !== id));
  };

  const validateSearch = (): boolean => {
    const next: SingleInvoiceErrors = {};
    if (!search.customer?.trim()) next.customer = "Customer is required";
    if (!search.billingCompany?.trim()) next.billingCompany = "Billing Company is required";
    if (!search.gstNumber?.trim()) next.gstNumber = "GST Number is required";
    if (!search.invoiceRange?.trim()) next.invoiceRange = "Invoice Range is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSearch = () => {
    if (!validateSearch()) {
      showToast("Please fill all the required fields", "error");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Search completed");
    }, 700);
  };

  const handleCreateInvoice = () => {
    const next: SingleInvoiceErrors = {};
    if (!form.invoiceNo?.trim()) next.invoiceNo = "Invoice No. is required";
    if (awbRows.length === 0) next.awbRows = "Please add at least one AWB";
    setErrors((prev: SingleInvoiceErrors) => ({ ...prev, ...next }));

    if (Object.keys(next).length > 0) {
      showToast("Please fill all the required fields", "error");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Invoice created successfully!", "success");
    }, 700);
  };

  return {
    search,
    setSearch,
    updateSearchField,
    form,
    setForm,
    updateFormField,
    awbRows,
    setAwbRows,
    addAwbRow,
    updateAwbRow,
    removeAwbRow,
    errors,
    loading,
    toast,
    showToast,
    handleSearch,
    handleCreateInvoice,
  };
}