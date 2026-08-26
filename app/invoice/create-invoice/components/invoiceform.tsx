"use client";
import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { AwbInvoiceRow, SingleInvoiceFormState, SingleInvoiceSearchState, ToastState } from "./invoicestate";

export const inputClass =
  "border border-axc-border rounded-md px-3 py-2.5 outline-none w-full text-regular-small text-axc-gray placeholder:text-axc-gray  transition cursor-pointer placeholder:text-regular-small";

export const errorInputClass =
  "border border-red-400 rounded-md px-3 py-2.5 outline-none w-full text-regular-small text-axc-gray placeholder:text-axc-gray bg-red-50/40 focus:border-red-400 transition cursor-pointer placeholder:text-regular-small";

export const disabledInputClass =
  "border border-axc-border rounded-md px-3 py-2.5 outline-none w-full text-regular-small text-axc-gray placeholder:text-axc-gray bg-gray-50 cursor-not-allowed transition placeholder:text-regular-small";

export function toSentenceCase(text: string): string {
  if (!text) return text;
  const lower = text.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  const label = typeof children === "string" ? toSentenceCase(children) : children;
  return (
    <label className="text-regular-medium text-axc-dark-gray  ">
      {label} {required && <span className="text-axc-red ml-0.5">*</span>}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[10px] text-axc-red font-semibold mt-1">{message}</p>;
}

export function FileUploadField({
  onFileChange,
  placeholder = "No file chosen",
  multiple = false,
}: {
  onFileChange?: (file: File | null) => void;
  placeholder?: string;
  multiple?: boolean;
}) {
  const [fileName, setFileName] = useState("");
  return (
    <label className="flex items-center gap-2 border border-axc-border rounded-md px-2 py-2.5 text-[11px] text-gray-500 bg-white cursor-pointer hover:bg-gray-50 transition">
      <span className="px-2 py-1 bg-gray-100 rounded text-regular-small text-gray-600 shrink-0">Choose File</span>
      <span className={`truncate ${fileName ? "text-gray-700 font-medium" : "text-gray-400"}`}>{fileName || placeholder}</span>
      <input
        type="file"
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0] || null;
          setFileName(f ? f.name : "");
          onFileChange?.(f);
        }}
      />
    </label>
  );
}

export function PanelHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="bg-axc-navy text-white text-sm font-semibold px-4 py-2.5 flex items-center justify-between gap-2">
      <span>{toSentenceCase(title)}</span>
      {right}
    </div>
  );
}

export function EditIconButton({
  active,
  onToggle,
  title = "Edit",
}: {
  active: boolean;
  onToggle: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={title}
      aria-pressed={active}
      className={`flex items-center justify-center h-7 w-7 shrink-0 rounded transition cursor-pointer ${
        active ? "bg-axc-navy text-white" : "bg-transparent text-axc-grey hover:bg-gray-100 cursor pointer"
      }`}
    >
      <Pencil size={13} />
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