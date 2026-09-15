"use client";
import React, { useState } from "react";
import { Pencil } from "lucide-react";
import {
  SingleAwbInvoiceRow,
  SingleInvoiceFormState,
  SingleInvoiceSearchState,
  MultipleAwbInvoiceRow,
  MultipleInvoiceFormState,
  MultipleInvoiceSearchState,
  ToastState,
  MultipleAwbSearchState,
  MultipleAwbFormState,
  awbMultipleRow,
} from "./invoicestate";

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

export function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  const label =
    typeof children === "string" ? toSentenceCase(children) : children;
  return (
    <label className="text-regular-medium text-axc-dark-gray  ">
      {label} {required && <span className="text-axc-red ml-0.5">*</span>}
    </label>
  );
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
      <span className="px-2 py-1 bg-gray-100 rounded text-regular-small text-gray-600 shrink-0">
        Choose File
      </span>
      <span
        className={`truncate ${fileName ? "text-gray-700 font-medium" : "text-gray-400"}`}
      >
        {fileName || placeholder}
      </span>
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

export function PanelHeader({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="bg-axc-navy/60 text-white p-4 flex  rounded-tl-lg rounded-tr-lg capitalize items-center justify-between gap-2">
      <h2>{toSentenceCase(title)}</h2>
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
        active
          ? "bg-axc-navy text-white"
          : "bg-transparent text-axc-grey hover:bg-gray-100 cursor pointer"
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

const emptyAwbRow = (id: number): SingleAwbInvoiceRow => ({
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

export function useSingleCustomerInvoiceForm() {
  const [search, setSearch] = useState<SingleInvoiceSearchState>(emptySearch);
  const [form, setForm] = useState<SingleInvoiceFormState>(emptyForm);
  const [awbRows, setAwbRows] = useState<SingleAwbInvoiceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastState["type"] = "info") => {
    setToast({ message, type });
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 2600);
  };

  const updateSearchField = <K extends keyof SingleInvoiceSearchState>(
    key: K,
    value: SingleInvoiceSearchState[K],
  ) => {
    setSearch((prev: SingleInvoiceSearchState) => ({ ...prev, [key]: value }));
  };

  const updateFormField = <K extends keyof SingleInvoiceFormState>(
    key: K,
    value: SingleInvoiceFormState[K],
  ) => {
    setForm((prev: SingleInvoiceFormState) => ({ ...prev, [key]: value }));
  };

  const addAwbRow = () => {
    setAwbRows((prev) => [...prev, emptyAwbRow(Date.now())]);
  };

  const updateAwbRow = <K extends keyof SingleAwbInvoiceRow>(
    id: number,
    key: K,
    value: SingleAwbInvoiceRow[K],
  ) => {
    setAwbRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const updated = { ...row, [key]: value };
        if (key === "freightAmount") {
          updated.grandTotal = value as string;
        }
        return updated;
      }),
    );
  };

  const removeAwbRow = (id: number) => {
    setAwbRows((prev: SingleAwbInvoiceRow[]) =>
      prev.filter((row) => row.id !== id),
    );
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Search completed");
    }, 700);
  };

  const handleCreateInvoice = () => {
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
    loading,
    toast,
    showToast,
    handleSearch,
    handleCreateInvoice,
  };
}
const emptyMultipleSearch: MultipleInvoiceSearchState = {
  billingCompany: "",
  bankDetails: "",
  invoiceRange: "",
  fromDate: "",
  tillDate: "",
  service: "",
  vendor: "",
  product: "",
};

const emptyMultipleForm: MultipleInvoiceFormState = {
  invoiceDate: todayStr,
  dueDate: todayStr,
  noteForCustomer: "",
};

const emptyMultipleAwbRow = (id: number): MultipleAwbInvoiceRow => ({
  id,
  customerName: "",
  customerCode: "",
  awbCount: "",
  chargeableWeight: "",
  freightAmount: "",
  freightZeroAwb: "",
  vat: "",
  grandTotal: "",
});
function computeMultipleGrandTotal(row: MultipleAwbInvoiceRow): string {
  const freight = parseFloat(row.freightAmount) || 0;
  const freightZero = parseFloat(row.freightZeroAwb) || 0;
  const vat = parseFloat(row.vat) || 0;
  const total = freight + freightZero + vat;
  return total ? String(total) : "";
}

export function useMultipleCustomerInvoiceForm() {
  const [search, setSearch] =
    useState<MultipleInvoiceSearchState>(emptyMultipleSearch);
  const [form, setForm] = useState<MultipleInvoiceFormState>(emptyMultipleForm);
  const [awbRows, setAwbRows] = useState<MultipleAwbInvoiceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastState["type"] = "info") => {
    setToast({ message, type });
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 2600);
  };

  const updateSearchField = <K extends keyof MultipleInvoiceSearchState>(
    key: K,
    value: MultipleInvoiceSearchState[K],
  ) => {
    setSearch((prev: MultipleInvoiceSearchState) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateFormField = <K extends keyof MultipleInvoiceFormState>(
    key: K,
    value: MultipleInvoiceFormState[K],
  ) => {
    setForm((prev: MultipleInvoiceFormState) => ({ ...prev, [key]: value }));
  };

  const addAwbRow = () => {
    setAwbRows((prev) => [...prev, emptyMultipleAwbRow(Date.now())]);
  };

  const updateAwbRow = <K extends keyof MultipleAwbInvoiceRow>(
    id: number,
    key: K,
    value: MultipleAwbInvoiceRow[K],
  ) => {
    setAwbRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const updated = { ...row, [key]: value };
        if (
          key === "freightAmount" ||
          key === "freightZeroAwb" ||
          key === "vat"
        ) {
          updated.grandTotal = computeMultipleGrandTotal(updated);
        }
        return updated;
      }),
    );
  };

  const removeAwbRow = (id: number) => {
    setAwbRows((prev: MultipleAwbInvoiceRow[]) =>
      prev.filter((row) => row.id !== id),
    );
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Search completed");
    }, 700);
  };

  const handleCreateInvoice = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Invoices created successfully!", "success");
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
    loading,
    toast,
    showToast,
    handleSearch,
    handleCreateInvoice,
  };
}

const emptyAwbSearch: MultipleAwbSearchState = {
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
  awbNo: "",
};

const emptyAwbForm: MultipleAwbFormState = {
  invoiceDate: todayStr,
  dueDate: todayStr,
};

const emptyAwbShipperRow = (id: number): awbMultipleRow => ({
  id,
  shipperName: "",
  shipperCode: "",
  awbCount: "",
  chargeableWeight: "",
  freightAmount: "",
  freightZeroAwb: "",
  vat: "",
  grandTotal: "",
});

function computeAwbGrandTotal(row: awbMultipleRow): string {
  const freight = parseFloat(row.freightAmount) || 0;
  const freightZero = parseFloat(row.freightZeroAwb) || 0;
  const vat = parseFloat(row.vat) || 0;
  const total = freight + freightZero + vat;
  return total ? String(total) : "";
}

export function useAwbInvoiceForm() {
  const [search, setSearch] = useState<MultipleAwbSearchState>(emptyAwbSearch);
  const [form, setForm] = useState<MultipleAwbFormState>(emptyAwbForm);
  const [awbRows, setAwbRows] = useState<awbMultipleRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastState["type"] = "info") => {
    setToast({ message, type });
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 2600);
  };

  const updateSearchField = <K extends keyof MultipleAwbSearchState>(
    key: K,
    value: MultipleAwbSearchState[K],
  ) => {
    setSearch((prev: MultipleAwbSearchState) => ({ ...prev, [key]: value }));
  };

  const updateFormField = <K extends keyof MultipleAwbFormState>(
    key: K,
    value: MultipleAwbFormState[K],
  ) => {
    setForm((prev: MultipleAwbFormState) => ({ ...prev, [key]: value }));
  };

  const addAwbRow = () => {
    setAwbRows((prev) => [...prev, emptyAwbShipperRow(Date.now())]);
  };

  const updateAwbRow = <K extends keyof awbMultipleRow>(
    id: number,
    key: K,
    value: awbMultipleRow[K],
  ) => {
    setAwbRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const updated = { ...row, [key]: value };
        if (
          key === "freightAmount" ||
          key === "freightZeroAwb" ||
          key === "vat"
        ) {
          updated.grandTotal = computeAwbGrandTotal(updated);
        }
        return updated;
      }),
    );
  };

  const removeAwbRow = (id: number) => {
    setAwbRows((prev: awbMultipleRow[]) => prev.filter((row) => row.id !== id));
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Search completed");
    }, 700);
  };

  const handleCreateInvoice = () => {
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
    loading,
    toast,
    showToast,
    handleSearch,
    handleCreateInvoice,
  };
}
