"use client";

import React, { useRef, useState, useEffect } from "react";
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import { FieldLabel, PanelHeader } from "./form";
type FileKind = "pdf" | "image";

interface UploadField {
  key: string;
  label: string;
  kind: FileKind;
}

interface AwbAttachmentsTabProps {
  awbTrackingNo?: string;
  fields?: UploadField[];
  showToast?: (message: string, type?: "success" | "info") => void;
  onSave?: (files: Record<string, File | null>) => void;
}
const CARD_ONE_FIELDS: UploadField[] = [
  { key: "podImage", label: "POD Image", kind: "image" },
  { key: "signature", label: "Signature", kind: "image" },
  { key: "shipmentImages", label: "Shipment Images", kind: "image" },
  { key: "shipmentInvoiceImages", label: "Shipment Invoice Images", kind: "image" },
  { key: "customerAwbImage", label: "Customer AWB Image", kind: "image" },
  { key: "vendorAwbImage", label: "Vendor AWB Image", kind: "image" },
  { key: "vendorChallanImage", label: "Vendor Challan Image", kind: "image" },
];
const CARD_TWO_FIELDS: UploadField[] = [
  { key: "ewayBillCopy", label: "Eway/Declaration Bill Copy", kind: "pdf" },
  { key: "shippingBill", label: "Shipping Bill", kind: "pdf" },
  { key: "codInvoice", label: "COD Invoice", kind: "pdf" },
  { key: "packingList", label: "Packing List", kind: "pdf" },
  { key: "lut", label: "LUT", kind: "pdf" },
  { key: "dangerousGood", label: "Dangerous Good (Attach PDF Only)", kind: "pdf" },
];

const DEFAULT_FIELDS: UploadField[] = [...CARD_ONE_FIELDS, ...CARD_TWO_FIELDS];

const ACCEPT_BY_KIND: Record<FileKind, string> = {
  pdf: "application/pdf",
  image: "image/*",
};

const ERROR_BY_KIND: Record<FileKind, string> = {
  pdf: "Only PDF files are allowed.",
  image: "Only image files (JPG, PNG, etc.) are allowed.",
};

function isValidForKind(file: File, kind: FileKind) {
  if (kind === "pdf") {
    return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  }
  return file.type.startsWith("image/");
}
function UploadRow({
  label,
  kind,
  file,
  error,
  onChange,
}: {
  label: string;
  kind: FileKind;
  file: File | null;
  error: string | null;
  onChange: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePick = (picked: File | undefined | null) => {
    if (!picked) {
      onChange(null);
      return;
    }
    onChange(picked);
  };

  return (
    <div className="flex flex-col gap-2 min-w-0 w-full">
      <FieldLabel>{label}</FieldLabel>
      <div
        className={`flex items-center gap-2 border rounded-md px-3 py-2 bg-white w-full ${
          error ? "border-red-400" : "border-axc-border"
        }`}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="shrink-0 flex items-center gap-1.5 border border-axc-border bg-axc-light-bg hover:bg-axc-border/30 text-axc-dark-gray text-[11px] font-bold px-3 py-1.5 rounded-md transition"
        >
          <UploadCloud size={12} />
          Choose File
        </button>
        <span className="text-[11px] text-axc-gray truncate">
          {file ? file.name : "No file chosen"}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_BY_KIND[kind]}
          className="hidden"
          onChange={(e) => handlePick(e.target.files?.[0])}
        />
      </div>
      {error && (
        <span className="flex items-center gap-1 text-[10px] font-bold text-red-500">
          <AlertCircle size={11} />
          {error}
        </span>
      )}
    </div>
  );
}
function SavedToast({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white text-xs font-bold px-4 py-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2">
      <CheckCircle2 size={16} />
      Attachment saved successfully!
    </div>
  );
}
function AttachmentsCard({
  fields,
  files,
  errors,
  onFieldChange,
}: {
  fields: UploadField[];
  files: Record<string, File | null>;
  errors: Record<string, string | null>;
  onFieldChange: (field: UploadField, file: File | null) => void;
}) {
  return (
    <div className="col-span-12 lg:col-span-6 bg-white rounded-xl border border-axc-border shadow-sm p-6 flex flex-col gap-6">
      {fields.map((f) => (
        <UploadRow
          key={f.key}
          label={f.label}
          kind={f.kind}
          file={files[f.key] ?? null}
          error={errors[f.key] ?? null}
          onChange={(file) => onFieldChange(f, file)}
        />
      ))}
    </div>
  );
}
export function AwbAttachmentsTab({
  showToast,
  onSave,
}: AwbAttachmentsTabProps) {
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [savedVisible, setSavedVisible] = useState(false);

  const setFile = (field: UploadField, file: File | null) => {
    if (file && !isValidForKind(file, field.kind)) {
      setErrors((prev) => ({ ...prev, [field.key]: ERROR_BY_KIND[field.kind] }));
      setFiles((prev) => ({ ...prev, [field.key]: null }));
      return;
    }
    setErrors((prev) => ({ ...prev, [field.key]: null }));
    setFiles((prev) => ({ ...prev, [field.key]: file }));
  };

  const handleSave = () => {
    onSave?.(files);
    showToast?.("Attachments saved successfully!", "success");
    setSavedVisible(true);
  };

  useEffect(() => {
    if (!savedVisible) return;
    const t = setTimeout(() => setSavedVisible(false), 2500);
    return () => clearTimeout(t);
  }, [savedVisible]);

  return (
    <div className="w-full flex flex-col gap-6">
      <PanelHeader title="Attachments" />

      <SavedToast visible={savedVisible} />

      <div className="grid grid-cols-12 gap-8">
        <AttachmentsCard
          fields={CARD_ONE_FIELDS}
          files={files}
          errors={errors}
          onFieldChange={setFile}
        />
        <AttachmentsCard
          fields={CARD_TWO_FIELDS}
          files={files}
          errors={errors}
          onFieldChange={setFile}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="bg-axc-navy hover:bg-axc-navy/80 text-white text-xs font-bold uppercase px-5 py-2 rounded-lg transition shadow-sm"
        >
          Save Attachment
        </button>
      </div>
    </div>
  );
}