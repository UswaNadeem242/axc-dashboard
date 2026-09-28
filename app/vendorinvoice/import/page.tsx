"use client";
import React, { useRef, useState } from "react";
import { Download, Upload, FileText, X, AlertCircle } from "lucide-react";
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
interface UploadingFile {
  id: string;
  file: File;
  uploaded: number; 
  status: "uploading" | "done" | "error";
  errorMessage?: string;
}

function formatBytes(bytes: number) {
  if (bytes <= 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
}

const DEFAULT_ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "image/svg+xml",
];
const DEFAULT_ACCEPTED_LABEL = "JPEG, PNG, PDF and SVG formats, up to 10MB";
const DEFAULT_MAX_SIZE_BYTES = 10 * 1024 * 1024; 

function FileUploadField({
  onFileChange,
  onFilesChange,
  placeholder,
  multiple = false,
  acceptedMimeTypes = DEFAULT_ACCEPTED_MIME_TYPES,
  acceptedExtensions,
  acceptedLabel = DEFAULT_ACCEPTED_LABEL,
  maxSizeBytes = DEFAULT_MAX_SIZE_BYTES,
  error = false,
}: {
  onFileChange?: (file: File | null) => void;
  onFilesChange?: (files: File[]) => void;
  placeholder?: string;
  multiple?: boolean;
  acceptedMimeTypes?: string[];
  acceptedExtensions?: string[];
  acceptedLabel?: string;
  maxSizeBytes?: number;
  error?: boolean;
}) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function isAcceptedFile(file: File): { ok: boolean; message?: string } {
    if (file.size > maxSizeBytes) {
      return { ok: false, message: `File too large, max ${formatBytes(maxSizeBytes)}.` };
    }

    const mimeOk = acceptedMimeTypes.includes(file.type);
    const extOk = acceptedExtensions
      ? acceptedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext.toLowerCase()))
      : false;

    if (!mimeOk && !extOk) {
      return { ok: false, message: "Unsupported file, upload another." };
    }
    return { ok: true };
  }

  function simulateUpload(id: string, totalSize: number) {
    const stepMs = 200;
    const stepSize = Math.max(totalSize / 18, 80 * 1024);

    const interval = setInterval(() => {
      setUploadingFiles((prev) => {
        let finished = false;
        const next = prev.map((uf) => {
          if (uf.id !== id || uf.status !== "uploading") return uf;
          const uploaded = Math.min(uf.uploaded + stepSize, totalSize);
          if (uploaded >= totalSize) finished = true;
          return { ...uf, uploaded, status: uploaded >= totalSize ? "done" : "uploading" } as UploadingFile;
        });
        if (finished) clearInterval(interval);
        return next;
      });
    }, stepMs);
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const newFiles = Array.from(fileList);

    const mapped: UploadingFile[] = newFiles.map((file, i) => {
      const id = `${file.name}-${Date.now()}-${i}`;
      const check = isAcceptedFile(file);
      if (!check.ok) {
        return { id, file, uploaded: 0, status: "error", errorMessage: check.message };
      }
      return { id, file, uploaded: 0, status: "uploading" };
    });

    if (!multiple) {
      setUploadingFiles(mapped.slice(0, 1));
    } else {
      setUploadingFiles((prev) => [...prev, ...mapped]);
    }

    const accepted = mapped.filter((m) => m.status === "uploading");
    accepted.forEach((uf) => simulateUpload(uf.id, uf.file.size));

    const acceptedFiles = accepted.map((uf) => uf.file);
    if (!multiple) {
      onFileChange?.(acceptedFiles[0] ?? null);
    } else if (acceptedFiles.length > 0) {
      onFilesChange?.(acceptedFiles);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeFile(id: string) {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
    if (!multiple) onFileChange?.(null);
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-2 border border-dashed rounded-lg py-6 px-4 text-center cursor-pointer transition w-full ${
          error
            ? "border-red-400 bg-red-50/40"
            : "border-axc-border bg-white hover:bg-gray-50/70"
        }`}
      >
        <span className="p-2 bg-gray-100/90 rounded-md text-gray-600 flex items-center justify-center shrink-0">
          <Upload size={18} />
        </span>
        <span className="text-xs text-gray-400">{placeholder || "Drop your files here or browse"}</span>
        <span className="text-[10px] text-gray-400">{acceptedLabel}</span>
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={[...acceptedMimeTypes, ...(acceptedExtensions ?? [])].join(",")}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {uploadingFiles.length > 0 && (
        <div className="flex flex-row flex-wrap gap-2">
          {uploadingFiles.map((uf) => {
            const percent =
              uf.status === "error" ? 0 : Math.min(100, Math.round((uf.uploaded / uf.file.size) * 100));
            const done = uf.status === "done";
            const isError = uf.status === "error";

            return (
              <div
                key={uf.id}
                className={`border rounded-md px-2.5 py-2 flex items-center gap-2 w-[calc(50%-0.25rem)] sm:w-[calc(33.333%-0.34rem)] lg:w-[calc(20%-0.4rem)] ${
                  isError ? "border-red-300 bg-red-50/40" : "border-axc-border bg-white"
                }`}
              >
                <span
                  className={`p-1.5 rounded shrink-0 ${
                    isError ? "bg-red-100 text-axc-red" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {isError ? <AlertCircle size={13} /> : <FileText size={13} />}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <p className="text-[11px] font-medium text-gray-700 truncate">{uf.file.name}</p>
                    <button
                      type="button"
                      onClick={() => removeFile(uf.id)}
                      className="text-axc-red hover:text-axc-red transition shrink-0 cursor-pointer"
                      title="Remove file"
                    >
                      <X size={12} />
                    </button>
                  </div>

                  {isError ? (
                    <p className="text-[10px] text-axc-red font-medium mt-0.5 truncate">{uf.errorMessage}</p>
                  ) : (
                    <>
                      <p className="text-[9px] text-gray-400 mt-0.5">
                        {formatBytes(uf.uploaded)} of {formatBytes(uf.file.size)}
                      </p>
                      <div className="mt-1 flex items-center h-1 w-full overflow-hidden rounded-full">
                        <div
                          className={`h-full bg-axc-blue transition-all duration-200 ease-linear ${
                            done ? "rounded-full" : "rounded-l-full"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                        {!done && (
                          <div
                            className="h-full rounded-r-full bg-red-400 transition-all duration-200 ease-linear"
                            style={{ width: `${100 - percent}%` }}
                          />
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const inputClass =
  "border border-axc-border rounded-md px-3 py-2.5 outline-none w-full text-regular-small text-axc-gray placeholder:text-axc-gray transition cursor-pointer placeholder:text-regular-small";

const errorInputClass =
  "border border-red-400 rounded-md px-3 py-2.5 outline-none w-full text-regular-small text-axc-gray placeholder:text-axc-gray bg-red-50/40 focus:border-red-400 transition cursor-pointer placeholder:text-regular-small";

const actionBtnClass =
  "bg-axc-navy text-white text-regular-small px-5 py-4 rounded-lg cursor-pointer transition";

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

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="text-[10px] text-red-500">{message}</span>;
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
  className = "",
  children,
}: {
  name: keyof VendorImportFormState;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <FieldLabel required={required}>{LABELS[name]}</FieldLabel>
      {children}
      <FieldError message={error} />
    </div>
  );
}

export default function VendorInvoiceImportPage() {
  const [form, setForm] = useState<VendorImportFormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  // Import ke baad upload card reset karne ke liye
  const [uploadKey, setUploadKey] = useState(0);

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
      setUploadKey((k) => k + 1);
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
    errors[key] ? "border-red-400 bg-red-50/40" : "border-axc-border";

  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col">
      <PanelHeader title="Import Vendor Invoice" />

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3">
        <Field name="vendor" required error={errors.vendor}>
          <CommonDropdown
            value={form.vendor}
            onChange={(val) => updateField("vendor", val)}
            className={dropdownCls("vendor")}
            placeholder="SELECT..."
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

        <Field
          name="csvFile"
          required
          error={errors.csvFile}
          className="sm:col-span-2 xl:col-span-3"
        >
          <FileUploadField
            key={uploadKey}
            error={Boolean(errors.csvFile)}
            placeholder="Drop your CSV file here or browse"
            acceptedMimeTypes={["text/csv", "application/vnd.ms-excel"]}
            acceptedExtensions={[".csv"]}
            acceptedLabel="CSV format only, up to 10MB"
            onFileChange={(file) => updateField("csvFile", file)}
          />
        </Field>

        <div className="flex justify-end gap-3 pt-2 sm:col-span-2 xl:col-span-3">
          <button
            type="button"
            onClick={handleDownloadSample}
            className={`flex items-center gap-2 ${actionBtnClass}`}
          >
            <Download size={14} />
            Download Sample CSV File
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={loading}
            className={`${actionBtnClass} disabled:opacity-60`}
          >
            {loading ? "Importing..." : "Import"}
          </button>
        </div>
      </div>
    </div>
  );
}