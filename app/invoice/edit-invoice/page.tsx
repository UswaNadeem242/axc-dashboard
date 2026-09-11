"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

import { SingleCustomerSearchPanel } from "../create-invoice/components/singlecustomersearch";
import {
  SingleCustomerInvoiceDetails,
  AwbTableSection as SingleAwbTableSection,
} from "../create-invoice/components/singlecustomerinvoice";

import { MultipleCustomerSearchPanel } from "../create-invoice/components/multiplecustomersearch";
import {
  MultipleCustomerInvoiceDetails,
  AwbTableSection as MultipleCustomerAwbTableSection,
} from "../create-invoice/components/multiplecustomerinvoice";

import { MultipleAwbSearchPanel } from "../create-invoice/components/multipleawbsearch";
import {
  MultipleawbDetails,
  AwbTableSection as MultipleAwbTableSection,
} from "../create-invoice/components/multipleawbinvoice";

import {
  SingleAwbInvoiceRow,
  SingleInvoiceFormState,
  SingleInvoiceSearchState,
  MultipleAwbInvoiceRow,
  MultipleInvoiceFormState,
  MultipleInvoiceSearchState,
  awbMultipleRow,
  MultipleAwbFormState,
  MultipleAwbSearchState,
  ToastState,
} from "../create-invoice/components/invoicestate";
import Button from "@/app/src/common/button";

type InvoiceType = "single-customer" | "multiple-customer" | "multiple-awb";
const VALID_TYPES: InvoiceType[] = [
  "single-customer",
  "multiple-customer",
  "multiple-awb",
];

const INVOICE_LIST_ROUTE = "/invoice/all-invoices";
const STORAGE_KEYS: Record<InvoiceType, string> = {
  "single-customer": "invoice_entries_single",
  "multiple-customer": "invoice_entries_multiple_customer",
  "multiple-awb": "invoice_entries_multiple_awb",
};
const todayStr = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
})();

const emptySingleSearch: SingleInvoiceSearchState = {
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
const emptySingleForm: SingleInvoiceFormState = {
  invoiceNo: "",
  invoiceDate: todayStr,
  dueDate: todayStr,
  noteForCustomer: "",
  invoiceCurrency: "",
};
const emptySingleAwbRow = (id: number): SingleAwbInvoiceRow => ({
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

const emptyMultipleCustomerSearch: MultipleInvoiceSearchState = {
  billingCompany: "",
  bankDetails: "",
  invoiceRange: "",
  fromDate: "",
  tillDate: "",
  service: "",
  vendor: "",
  product: "",
};
const emptyMultipleCustomerForm: MultipleInvoiceFormState = {
  invoiceDate: todayStr,
  dueDate: todayStr,
  noteForCustomer: "",
};
const emptyMultipleCustomerRow = (id: number): MultipleAwbInvoiceRow => ({
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
const emptyMultipleAwbForm: MultipleAwbFormState = {
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

interface SingleInvoiceEntry extends SingleInvoiceFormState {
  awbRows: SingleAwbInvoiceRow[];
}
interface MultipleCustomerInvoiceEntry extends MultipleInvoiceFormState {
  invoiceNo: string;
  awbRows: MultipleAwbInvoiceRow[];
}
interface MultipleAwbInvoiceEntry extends MultipleAwbFormState {
  invoiceNo: string;
  awbRows: awbMultipleRow[];
}

function EditInvoiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("id") || searchParams.get("invoiceNo") || "";
  const rawType = searchParams.get("type");
  const tab: InvoiceType = VALID_TYPES.includes(rawType as InvoiceType)
    ? (rawType as InvoiceType)
    : "single-customer";

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [singleSearch, setSingleSearch] = useState<SingleInvoiceSearchState>(emptySingleSearch);
  const [singleForm, setSingleForm] = useState<SingleInvoiceFormState>({
    ...emptySingleForm,
    invoiceNo: invoiceId,
  });
  const [singleAwbRows, setSingleAwbRows] = useState<SingleAwbInvoiceRow[]>([
    emptySingleAwbRow(1),
  ]);
  const [singleErrors, setSingleErrors] = useState<
    Partial<Record<keyof SingleInvoiceFormState | "awbRows", string>>
  >({});
  const [mcSearch, setMcSearch] = useState<MultipleInvoiceSearchState>(emptyMultipleCustomerSearch);
  const [mcForm, setMcForm] = useState<MultipleInvoiceFormState>(emptyMultipleCustomerForm);
  const [mcAwbRows, setMcAwbRows] = useState<MultipleAwbInvoiceRow[]>([
    emptyMultipleCustomerRow(1),
  ]);
  const [mcErrors, setMcErrors] = useState<{ awbRows?: string }>({});
  const [maSearch, setMaSearch] = useState<MultipleAwbSearchState>(emptyAwbSearch);
  const [maForm, setMaForm] = useState<MultipleAwbFormState>(emptyMultipleAwbForm);
  const [maAwbRows, setMaAwbRows] = useState<awbMultipleRow[]>([
    emptyAwbShipperRow(1),
  ]);

  const showToast = (message: string, type: ToastState["type"] = "info") => {
    setToast({ message, type });
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 2600);
  };
  useEffect(() => {
    if (!invoiceId || typeof window === "undefined") return;

    const key = STORAGE_KEYS[tab];
    const stored = localStorage.getItem(key);
    let entries: any[] = [];
    if (stored) {
      try {
        entries = JSON.parse(stored);
      } catch (err) {
        console.error(`Failed to parse ${key}:`, err);
      }
    }

    const matched = entries.find(
      (item) => String(item.invoiceNo) === String(invoiceId),
    );
    if (!matched) return;

    if (tab === "single-customer") {
      const m = matched as SingleInvoiceEntry;
      setSingleForm((prev) => ({ ...prev, ...m, invoiceNo: m.invoiceNo || invoiceId }));
      if (m.awbRows?.length) setSingleAwbRows(m.awbRows);
    } else if (tab === "multiple-customer") {
      const m = matched as MultipleCustomerInvoiceEntry;
      setMcForm((prev) => ({ ...prev, ...m }));
      if (m.awbRows?.length) setMcAwbRows(m.awbRows);
    } else if (tab === "multiple-awb") {
      const m = matched as MultipleAwbInvoiceEntry;
      setMaForm((prev) => ({ ...prev, ...m }));
      if (m.awbRows?.length) setMaAwbRows(m.awbRows);
    }
  }, [invoiceId, tab]);
  const handleSingleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Search completed");
    }, 500);
  };
  const addSingleAwbRow = () =>
    setSingleAwbRows((prev) => [...prev, emptySingleAwbRow(Date.now())]);
  const updateSingleAwbRow = <K extends keyof SingleAwbInvoiceRow>(
    id: number,
    key: K,
    value: SingleAwbInvoiceRow[K],
  ) =>
    setSingleAwbRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const updated = { ...row, [key]: value };
        if (key === "freightAmount") updated.grandTotal = value as string;
        return updated;
      }),
    );
  const removeSingleAwbRow = (id: number) =>
    setSingleAwbRows((prev) => prev.filter((r) => r.id !== id));
  const handleMcSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Search completed");
    }, 500);
  };
  const computeMcGrandTotal = (row: MultipleAwbInvoiceRow) => {
    const total =
      (parseFloat(row.freightAmount) || 0) +
      (parseFloat(row.freightZeroAwb) || 0) +
      (parseFloat(row.vat) || 0);
    return total ? String(total) : "";
  };
  const addMcAwbRow = () =>
    setMcAwbRows((prev) => [...prev, emptyMultipleCustomerRow(Date.now())]);
  const updateMcAwbRow = <K extends keyof MultipleAwbInvoiceRow>(
    id: number,
    key: K,
    value: MultipleAwbInvoiceRow[K],
  ) =>
    setMcAwbRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const updated = { ...row, [key]: value };
        if (["freightAmount", "freightZeroAwb", "vat"].includes(key as string)) {
          updated.grandTotal = computeMcGrandTotal(updated);
        }
        return updated;
      }),
    );
  const removeMcAwbRow = (id: number) =>
    setMcAwbRows((prev) => prev.filter((r) => r.id !== id));
  const handleMaSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Search completed");
    }, 500);
  };
  const computeMaGrandTotal = (row: awbMultipleRow) => {
    const total =
      (parseFloat(row.freightAmount) || 0) +
      (parseFloat(row.freightZeroAwb) || 0) +
      (parseFloat(row.vat) || 0);
    return total ? String(total) : "";
  };
  const addMaAwbRow = () =>
    setMaAwbRows((prev) => [...prev, emptyAwbShipperRow(Date.now())]);
  const updateMaAwbRow = <K extends keyof awbMultipleRow>(
    id: number,
    key: K,
    value: awbMultipleRow[K],
  ) =>
    setMaAwbRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const updated = { ...row, [key]: value };
        if (["freightAmount", "freightZeroAwb", "vat"].includes(key as string)) {
          updated.grandTotal = computeMaGrandTotal(updated);
        }
        return updated;
      }),
    );
  const removeMaAwbRow = (id: number) =>
    setMaAwbRows((prev) => prev.filter((r) => r.id !== id));
  const handleSaveUpdate = () => {
    if (tab === "single-customer" && !singleForm.invoiceNo?.trim()) {
      setSingleErrors({ invoiceNo: "Invoice No. is required" });
      showToast("Please fill all the required fields");
      return;
    }

    setLoading(true);

    if (typeof window !== "undefined") {
      try {
        const key = STORAGE_KEYS[tab];
        const stored = localStorage.getItem(key);
        let list: any[] = stored ? JSON.parse(stored) : [];

        let entry: any;
        if (tab === "single-customer") {
          entry = { ...singleForm, awbRows: singleAwbRows };
        } else if (tab === "multiple-customer") {
          entry = { ...mcForm, invoiceNo: invoiceId, awbRows: mcAwbRows };
        } else {
          entry = { ...maForm, invoiceNo: invoiceId, awbRows: maAwbRows };
        }

        const exists = list.some(
          (item) => String(item.invoiceNo) === String(invoiceId),
        );
        const updatedList = exists
          ? list.map((item) =>
              String(item.invoiceNo) === String(invoiceId)
                ? { ...item, ...entry }
                : item,
            )
          : [...list, entry];

        localStorage.setItem(key, JSON.stringify(updatedList));
        const flatStored = localStorage.getItem("invoice_entries");
        let flatList: any[] = flatStored ? JSON.parse(flatStored) : [];
        flatList = flatList.map((item) =>
          String(item.invoiceNumber) === String(invoiceId)
            ? { ...item, ...entry, invoiceNumber: invoiceId }
            : item,
        );
        localStorage.setItem("invoice_entries", JSON.stringify(flatList));
      } catch (err) {
        console.error("Failed to update invoice in localStorage:", err);
      }
    }

    setTimeout(() => {
      setLoading(false);
      showToast("Invoice updated successfully!", "success");
      setTimeout(() => router.push(INVOICE_LIST_ROUTE), 800);
    }, 500);
  };

  const handleBack = () => router.push(INVOICE_LIST_ROUTE);

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 rounded-lg px-4 py-3 text-xs font-bold shadow-lg text-white animate-in fade-in slide-in-from-top-2 duration-200 ${
            toast.type === "success" ? "bg-axc-dark-green" : "bg-axc-navy"
          }`}
        >
          {toast.message}
        </div>
      )}
      <div className="flex items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-lg border border-axc-border shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="p-1.5 rounded-md hover:bg-gray-100 text-axc-dark-gray transition cursor-pointer"
            title="Back to All Invoices"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-regular-bold text-axc-dark-gray">
              Edit Invoice {invoiceId ? `#${invoiceId}` : ""}
            </h1>
            <p className="text-[12px] text-axc-gray">
              Update invoice details and AWB records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button label="Cancel" onClick={handleBack} variant="outline" />
          <Button
            label={loading ? "Saving..." : "Save Changes"}
            onClick={handleSaveUpdate}
            variant="primary"
            icon={Save}
            disabled={loading}
          />
        </div>
      </div>

      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tab === "single-customer" && (
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-stretch w-full pb-2">
              <div className="lg:col-span-3 w-full flex flex-col">
                <SingleCustomerInvoiceDetails
                  form={singleForm}
                  setForm={setSingleForm}
                  errors={singleErrors}
                  onCreateInvoice={handleSaveUpdate}
                  loading={loading}
                />
              </div>
              <div className="w-full lg:col-span-9 flex flex-col">
                <SingleCustomerSearchPanel
                  search={singleSearch}
                  setSearch={setSingleSearch}
                  onSearch={handleSingleSearch}
                />
              </div>
              <div className="w-full lg:col-span-12">
                <SingleAwbTableSection
                  awbRows={singleAwbRows}
                  addAwbRow={addSingleAwbRow}
                  updateAwbRow={updateSingleAwbRow}
                  removeAwbRow={removeSingleAwbRow}
                  errors={{ awbRows: singleErrors.awbRows }}
                />
              </div>
            </div>
          )}

          {tab === "multiple-customer" && (
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-stretch w-full pb-2">
              <div className="lg:col-span-3 w-full flex flex-col">
                <MultipleCustomerInvoiceDetails
                  form={mcForm}
                  setForm={setMcForm}
                  onCreateInvoice={handleSaveUpdate}
                  loading={loading}
                />
              </div>
              <div className="w-full lg:col-span-9 flex flex-col">
                <MultipleCustomerSearchPanel
                  search={mcSearch}
                  setSearch={setMcSearch}
                  onSearch={handleMcSearch}
                />
              </div>
              <div className="w-full lg:col-span-12">
                <MultipleCustomerAwbTableSection
                  awbRows={mcAwbRows}
                  addAwbRow={addMcAwbRow}
                  updateAwbRow={updateMcAwbRow}
                  removeAwbRow={removeMcAwbRow}
                  errors={mcErrors}
                />
              </div>
            </div>
          )}

          {tab === "multiple-awb" && (
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-stretch w-full pb-2">
              <div className="lg:col-span-3 w-full flex flex-col">
                <MultipleawbDetails
                  form={maForm}
                  setForm={setMaForm}
                  onCreateInvoice={handleSaveUpdate}
                  loading={loading}
                />
              </div>
              <div className="w-full lg:col-span-9 flex flex-col">
                <MultipleAwbSearchPanel
                  search={maSearch}
                  setSearch={setMaSearch}
                  onSearch={handleMaSearch}
                />
              </div>
              <div className="w-full lg:col-span-12">
                <MultipleAwbTableSection
                  awbRows={maAwbRows}
                  addAwbRow={addMaAwbRow}
                  updateAwbRow={updateMaAwbRow}
                  removeAwbRow={removeMaAwbRow}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EditInvoicePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full w-full bg-white p-6 rounded-lg">
          <p className="text-sm text-axc-gray animate-pulse">
            Loading Invoice details...
          </p>
        </div>
      }
    >
      <EditInvoiceContent />
    </Suspense>
  );
}