"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import CommonDropdown from "../../src/common/dropdown";
import CustomDatePicker from "../../src/common/datepicker";
import { showToast } from "../../src/common/toast";
import {
  VendorOptions,
  BillingCompanyOptions,
  CurrencyOptions,
  VendorSearchByOptions,
  VendorInvoiceSample,
} from "../../src/constant";

interface VendorImportFormState {
  vendor: string;
  referenceName: string;
  invoiceNo: string;
  invoiceDate: string;
  fromDate: string;
  tillDate: string;
  billingCompany: string;
  currency: string;
  searchBy: string[];
  csvFile: File | null;
}

type FormErrors = Partial<Record<keyof VendorImportFormState, string>>;
const LABELS: Record<keyof VendorImportFormState, string> = {
  vendor: "Vendor",
  referenceName: "Reference name",
  invoiceNo: "Invoice no.",
  invoiceDate: "Invoice date",
  fromDate: "From date",
  tillDate: "Till date",
  billingCompany: "Billing company",
  currency: "Currency",
  searchBy: "Search by",
  csvFile: "CSV file",
};

const REQUIRED_KEYS: (keyof VendorImportFormState)[] = [
  "vendor",
  "invoiceNo",
  "fromDate",
  "tillDate",
  "billingCompany",
  "currency",
  "csvFile",
];

const vendorDropdownOptions = VendorOptions.map((v) => ({
  value: v.code,
  label: v.name,
}));

const emptyForm: VendorImportFormState = {
  vendor: "",
  referenceName: "",
  invoiceNo: "",
  invoiceDate: "",
  fromDate: "",
  tillDate: "",
  billingCompany: BillingCompanyOptions[0]?.value ?? "",
  currency: CurrencyOptions[0]?.value ?? "",
  searchBy: [],
  csvFile: null,
};
const inputClass =
  "border border-axc-border rounded-md px-3 py-2.5 outline-none w-full text-regular-small text-axc-gray placeholder:text-axc-gray transition cursor-pointer placeholder:text-regular-small";

const errorInputClass =
  "border border-red-400 rounded-md px-3 py-2.5 outline-none w-full text-regular-small text-axc-gray placeholder:text-axc-gray bg-red-50/40 focus:border-red-400 transition cursor-pointer placeholder:text-regular-small";

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="text-regular-medium text-axc-dark-gray">
      {children} {required && <span className="text-axc-red ml-0.5">*</span>}
    </label>
  );
}

function PanelHeader({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="bg-axc-navy/60 text-white p-4 flex rounded-tl-lg rounded-tr-lg items-center justify-between gap-2">
      <h3>{title}</h3>
      {right}
    </div>
  );
}

function Field({
  name,
  required,
  error,
  children,
}: {
  name: keyof VendorImportFormState;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <FieldLabel required={required}>{LABELS[name]}</FieldLabel>
      {children}
      {error && <span className="text-[10px] text-red-500">{error}</span>}
    </div>
  );
}
export default function VendorInvoiceImportPage() {
  const router = useRouter();

  const [form, setForm] = useState<VendorImportFormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof VendorImportFormState>(
    key: K,
    value: VendorImportFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    REQUIRED_KEYS.forEach((key) => {
      if (!form[key]) e[key] = `${LABELS[key]} is required`;
    });
    if (!e.tillDate && form.fromDate && form.tillDate < form.fromDate) {
      e.tillDate = `${LABELS.tillDate} cannot be before ${LABELS.fromDate.toLowerCase()}`;
    }
    return e;
  };

  const handleImport = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      showToast({ variant: "error", message: "Please fix the highlighted fields." });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast({ variant: "success", message: "Vendor invoice imported." });
      setForm(emptyForm);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 700);
  };

  const handleDownloadSample = () => {
    const blob = new Blob([VendorInvoiceSample.content], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = VendorInvoiceSample.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const cls = (key: keyof VendorImportFormState) =>
    errors[key] ? errorInputClass : inputClass;

  const dropdownCls = (key: keyof VendorImportFormState) =>
    errors[key] ? "w-full border-red-400" : "w-full border-axc-border";

  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col w-full">
      <PanelHeader
        title="Import Vendor Invoice "
      /*right={
          <button
            type="button"
            onClick={handleDownloadSample}
            className="flex items-center gap-2 px-3 py-2 bg-white text-axc-navy rounded text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <Download size={14} />
            Download Sample CSV File
          </button>
        }*/
      />

      <div className="p-4 flex flex-col gap-3 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field name="vendor" required error={errors.vendor}>
            <CommonDropdown
              value={form.vendor}
              onChange={(val) => updateField("vendor", val)}
              className={dropdownCls("vendor")}
              placeholder="Search here"
              options={vendorDropdownOptions}
            />
          </Field>

          <Field name="referenceName">
            <input
              type="text"
              value={form.referenceName}
              onChange={(e) => updateField("referenceName", e.target.value)}
              className={cls("referenceName")}
              placeholder={LABELS.referenceName}
            />
          </Field>

          <Field name="invoiceNo" required error={errors.invoiceNo}>
            <input
              type="text"
              value={form.invoiceNo}
              onChange={(e) => updateField("invoiceNo", e.target.value)}
              className={cls("invoiceNo")}
              placeholder={LABELS.invoiceNo}
            />
          </Field>

          <Field name="invoiceDate">
            <CustomDatePicker
              value={form.invoiceDate}
              onChange={(val) => updateField("invoiceDate", val)}
              placeholder={`Select ${LABELS.invoiceDate}`}
            />
          </Field>

          <Field name="fromDate" required error={errors.fromDate}>
            <CustomDatePicker
              value={form.fromDate}
              onChange={(val) => updateField("fromDate", val)}
              placeholder={`Select ${LABELS.fromDate}`}
            />
          </Field>

          <Field name="tillDate" required error={errors.tillDate}>
            <CustomDatePicker
              value={form.tillDate}
              onChange={(val) => updateField("tillDate", val)}
              placeholder={`Select ${LABELS.tillDate}`}
            />
          </Field>

          <Field name="billingCompany" required error={errors.billingCompany}>
            <CommonDropdown
              value={form.billingCompany}
              onChange={(val) => updateField("billingCompany", val)}
              className={dropdownCls("billingCompany")}
              placeholder="SELECT..."
              options={BillingCompanyOptions}
            />
          </Field>

          <Field name="currency" required error={errors.currency}>
            <CommonDropdown
              value={form.currency}
              onChange={(val) => updateField("currency", val)}
              className={dropdownCls("currency")}
              placeholder="SELECT..."
              options={CurrencyOptions}
            />
          </Field>

          <Field name="searchBy">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-2.5">
              {VendorSearchByOptions.map((o) => {
                const checked = form.searchBy.includes(o.value);
                return (
                  <label
                    key={o.value}
                    className="flex items-center gap-2 text-regular-small text-axc-gray cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="searchBy"
                      value={o.value}
                      checked={checked}
                      onChange={() =>
                        updateField(
                          "searchBy",
                          checked
                            ? form.searchBy.filter((v) => v !== o.value)
                            : [...form.searchBy, o.value],
                        )
                      }
                      className="accent-axc-navy cursor-pointer"
                    />
                    {o.label}
                  </label>
                );
              })}
            </div>
          </Field>

          <Field name="csvFile" required error={errors.csvFile}>
            <label
              className={`flex items-center gap-2 border rounded-md px-2 py-2.5 text-[11px] text-gray-500 bg-white cursor-pointer hover:bg-gray-50 transition ${
                errors.csvFile ? "border-red-400" : "border-axc-border"
              }`}
            >
              <span className="px-2 py-1 bg-gray-100 rounded text-regular-small text-gray-600 shrink-0">
                Choose File
              </span>
              <span
                className={`truncate ${form.csvFile ? "text-gray-700 font-medium" : "text-gray-400"}`}
              >
                {form.csvFile ? form.csvFile.name : "No file chosen"}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) =>
                  updateField("csvFile", e.target.files?.[0] || null)
                }
              />
            </label>
          </Field>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleImport}
            disabled={loading}
            className="px-5 py-3 bg-axc-navy text-white rounded text-xs font-bold shadow-sm transition cursor-pointer disabled:opacity-60"
          >
            {loading ? "Importing..." : "Import"}
          </button>
        </div>
      </div>
    </div>
  );
}