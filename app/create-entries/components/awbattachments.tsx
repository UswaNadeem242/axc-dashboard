"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Eye,
  Download,
  Trash2,
  X,
  FileText,
  FileSpreadsheet,
  Sparkles,
} from "lucide-react";
import { PanelHeader } from "./form";
import ExcelIcon from "@/public/icon/excel";
import PdfIcon from "@/public/icon/pdf";

export type FileKind = "pdf" | "excel" | "any";

export interface UploadField {
  key: string;
  label: string;
  kind: FileKind;
  description?: string;
}

export interface AwbAttachmentsTabProps {
  awbTrackingNo?: string;
  fields?: UploadField[];
  showToast?: (message: string, type?: "success" | "info") => void;
  onSave?: (files: Record<string, File | null>) => void;
}

export const ATTACHMENT_FIELDS: UploadField[] = [
  { key: "ewayBillCopy", label: "Eway/Declaration Bill Copy", kind: "pdf" },
  { key: "shippingBill", label: "Shipping Bill", kind: "pdf" },
  { key: "codInvoice", label: "COD Invoice", kind: "pdf" },
  { key: "packingList", label: "Packing List", kind: "pdf" },
  { key: "lut", label: "LUT", kind: "pdf" },
  { key: "dangerousGood", label: "Dangerous Good (Attach PDF Only)", kind: "pdf" },
  { key: "excelManifest", label: "Excel Manifest / Data", kind: "excel" },
  { key: "invoiceCopy", label: "Invoice Copy (PDF)", kind: "pdf" },
  { key: "customsDeclaration", label: "Customs Declaration (PDF)", kind: "pdf" },
  { key: "vendorBill", label: "Vendor Billing Sheet (Excel/PDF)", kind: "excel" },
];

const ACCEPT_BY_KIND: Record<FileKind, string> = {
  pdf: ".pdf,application/pdf",
  excel: ".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",
  any: ".pdf,.xlsx,.xls,.csv",
};

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function createSamplePdfFile(name: string, sizeMultiplier = 1): File {
  const pdfHeader = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 140 >>\nstream\nBT /F1 18 Tf 50 720 Td (${name}) Tj ET\nBT /F1 12 Tf 50 690 Td (Sample AWB Attached Document - AXC Logistics Dashboard) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \n0000000281 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n450\n%%EOF\n` + " ".repeat(sizeMultiplier * 1024 * 35);
  const blob = new Blob([pdfHeader], { type: "application/pdf" });
  return new File([blob], name, { type: "application/pdf" });
}

export function createSampleExcelFile(name: string, sizeMultiplier = 1): File {
  const csvContent = "AWB No,Shipper,Consignee,Pieces,Weight (KG),Status\nAXC-10029,Alpha Traders,Gulf Logistics,4,28.5,In Transit\nAXC-10030,Apex Global,FastForward LLC,12,145.0,Delivered\n" + "X".repeat(sizeMultiplier * 1024 * 20);
  const blob = new Blob([csvContent], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  return new File([blob], name, {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export function getDefaultSampleAttachments(): Record<string, File> {
  return {
    ewayBillCopy: createSamplePdfFile("Eway_Declaration_Bill_Copy.pdf", 3),
    shippingBill: createSamplePdfFile("Shipping_Bill_AXC_2026.pdf", 4),
    codInvoice: createSamplePdfFile("COD_Invoice_Receipt.pdf", 2),
    packingList: createSamplePdfFile("Packing_List_Items.pdf", 2),
    lut: createSamplePdfFile("LUT_Authorization_Certificate.pdf", 1),
    dangerousGood: createSamplePdfFile("Dangerous_Goods_Declaration_DGD.pdf", 3),
    excelManifest: createSampleExcelFile("Manifest_Shipment_Data.xlsx", 5),
    invoiceCopy: createSamplePdfFile("Commercial_Invoice_Copy.pdf", 3),
    customsDeclaration: createSamplePdfFile("Customs_Export_Declaration.pdf", 4),
    vendorBill: createSampleExcelFile("Vendor_Billing_Sheet_Q3.xlsx", 6),
  };
}

function detectFileType(file: File): "pdf" | "excel" {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  if (
    type.includes("sheet") ||
    type.includes("excel") ||
    type.includes("csv") ||
    name.endsWith(".xlsx") ||
    name.endsWith(".xls") ||
    name.endsWith(".csv")
  ) {
    return "excel";
  }
  return "pdf";
}
function PdfIllustration({ className = "w-16 h-20" }: { className?: string }) {
  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <PdfIcon />
    </div>
  );
}

function ExcelIllustration({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <ExcelIcon />
    </div>
  );
}
interface AttachmentCardProps {
  field: UploadField;
  file: File | null;
  error?: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  onPreview: (file: File) => void;
}

interface UploadingItem {
  file: File;
  uploaded: number;
  status: "uploading" | "done";
}

function AttachmentCard({
  field,
  file,
  error,
  onUpload,
  onRemove,
  onPreview,
}: AttachmentCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingItem, setUploadingItem] = useState<UploadingItem | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function simulateUpload(pickedFile: File) {
    const totalSize = pickedFile.size || 1;
    const stepMs = 200;
    const stepSize = Math.max(totalSize / 18, 80 * 1024);

    setUploadingItem({ file: pickedFile, uploaded: 0, status: "uploading" });

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setUploadingItem((prev) => {
        if (!prev) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return prev;
        }
        const uploaded = Math.min(prev.uploaded + stepSize, totalSize);
        const isDone = uploaded >= totalSize;

        if (isDone) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => {
            onUpload(pickedFile);
            setUploadingItem(null);
          }, 300);
        }

        return { ...prev, uploaded, status: isDone ? "done" : "uploading" };
      });
    }, stepMs);
  }

  function handleCancelUpload() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setUploadingItem(null);
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      simulateUpload(dropped);
    }
  };

  const handleDownload = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const fileType = file ? detectFileType(file) : null;

  const isUploading = !!uploadingItem;
  const uploadPercent = uploadingItem
    ? Math.min(100, Math.round((uploadingItem.uploaded / (uploadingItem.file.size || 1)) * 100))
    : 0;

  return (
    <div
      className={`relative bg-white rounded-md border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${error
        ? "border- ring-1 ring-red-300"
        : file
          ? "border-gray-200"
          : isDragging
            ? "border-axc-navy ring-2 ring-axc-navy/20 bg-blue-50/20"
            : "border-gray-200"
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="px-3.5 pt-3 pb-1 flex items-center justify-between gap-1 border-b border-gray-50">
        <span
          className="text-regular-medium font-bold text-axc-dark-gray truncate capitalize"
          title={field.label}
        >
          {field.label}
        </span>
        <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 shrink-0">
          {field.kind}
        </span>
      </div>
      <div className="p-3.5 flex flex-col items-center justify-center flex-1 min-h-[140px]">
        {isUploading ? (
          <div className="w-full border border-axc-border rounded-md px-2.5 py-2 flex items-center gap-2 bg-white">
            <span className="p-1.5 rounded shrink-0 bg-gray-100 text-gray-500">
              <FileText size={13} />
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1.5">
                <p className="text-[11px] font-medium text-gray-700 truncate" title={uploadingItem.file.name}>
                  {uploadingItem.file.name}
                </p>
                <button
                  type="button"
                  onClick={handleCancelUpload}
                  className="text-axc-red hover:text-axc-red transition shrink-0 cursor-pointer"
                  title="Cancel upload"
                >
                  <X size={12} />
                </button>
              </div>

              <p className="text-[9px] text-gray-400 mt-0.5">
                {formatBytes(uploadingItem.uploaded)} of {formatBytes(uploadingItem.file.size)}
              </p>

              <div className="mt-1 flex items-center h-1 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full bg-axc-blue transition-all duration-200 ease-linear ${
                    uploadingItem.status === "done" ? "rounded-full" : "rounded-l-full"
                  }`}
                  style={{ width: `${uploadPercent}%` }}
                />
              </div>
            </div>
          </div>
        ) : file ? (
          <div className="w-full flex flex-col items-center gap-2">
            <div className="w-full h-24 bg-gray-50/70 border border-gray-100 rounded-lg flex items-center justify-center p-2 overflow-hidden">
              {fileType === "pdf" ? (
                <PdfIllustration className="w-14 h-16" />
              ) : (
                <ExcelIllustration className="w-14 h-14" />
              )}
            </div>
            <div className="w-full px-0.5 mt-1">
              <p
                className="text-regular-medium text-axc-dark-gray truncate leading-tight"
                title={file.name}
              >
                {file.name}
              </p>
              <p className="text-xs text-axc-gray mt-0.5">
                {formatBytes(file.size)}
              </p>
            </div>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            className="w-full h-28 border-2 border-dashed border-gray-200 hover:border-axc-navy/60 bg-gray-50/50 hover:bg-blue-50/30 rounded-lg flex flex-col items-center justify-center gap-1.5 cursor-pointer transition p-2 group"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-axc-navy group-hover:border-axc-navy/30 transition shadow-2xs">
              <UploadCloud size={16} />
            </div>
            <span className="text-[11px] font-bold text-gray-600 group-hover:text-axc-navy transition">
              Choose File
            </span>
            <span className="text-[9px] text-gray-400">or drag & drop</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_BY_KIND[field.kind]}
          className="hidden"
          onChange={(e) => {
            const picked = e.target.files?.[0];
            if (picked) simulateUpload(picked);
            e.target.value = "";
          }}
        />
        {error && (
          <div className="w-full mt-2 flex items-center gap-1 text-[10px] font-bold text-red-500">
            <AlertCircle size={12} className="shrink-0" />
            <span className="truncate">{error}</span>
          </div>
        )}
      </div>
      {!isUploading && (
        <div className="px-3.5 py-2.5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          {file ? (
            <div className="flex items-center gap-1.5 w-full justify-between">
  
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onPreview(file)}
                  title="Preview File"
                  className="w-6 h-6 rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-600 flex items-center justify-center transition cursor-pointer"
                >
                  <Eye size={12} />
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  title="Download File"
                  className="w-6 h-6 rounded border border-red-300 bg-red-50 hover:bg-red-100 text-axc-red flex items-center justify-center transition cursor-pointer"
                >
                  <Download size={12} />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  title="Replace File"
                  className="text-regular-small text-axc-navy hover:underline px-1 cursor-pointer"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={onRemove}
                  title="Remove File"
                  className="w-6 h-6 rounded text-axc-red hover:bg-red-50 flex items-center justify-center transition cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full text-center text-regular-small text-axc-navy hover:text-axc-navy/80 transition cursor-pointer py-0.5"
            >
              Upload {field.kind.toUpperCase()}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface PreviewModalProps {
  file: File | null;
  onClose: () => void;
}

function FilePreviewModal({ file, onClose }: PreviewModalProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!file || !objectUrl) return null;

  const fileType = detectFileType(file);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
        <div className="px-6 py-4 bg-axc-navy text-white flex items-center justify-between">
          <div className="flex items-center gap-3 truncate">
            <span className="font-bold text-sm truncate">{file.name}</span>
            <span className="text-xs text-white/70">({formatBytes(file.size)})</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={objectUrl}
              download={file.name}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1.5 text-xs font-semibold px-3"
            >
              <Download size={14} /> Download
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-auto flex-1 flex items-center justify-center bg-gray-50 min-h-[400px]">
          {fileType === "pdf" ? (
            <iframe
              src={objectUrl}
              title={file.name}
              className="w-full h-[65vh] rounded-lg border border-gray-200 shadow-sm"
            />
          ) : (
            <div className="text-center p-8 flex flex-col items-center gap-4 bg-white rounded-xl border border-gray-200 shadow-sm max-w-md">
              <ExcelIllustration className="w-20 h-20" />
              <div>
                <h4 className="text-sm font-bold text-gray-800">{file.name}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Excel spreadsheet preview. You can download the file to open in Microsoft Excel.
                </p>
              </div>
              <a
                href={objectUrl}
                download={file.name}
                className="px-5 py-2.5 bg-axc-navy text-white text-xs font-bold rounded-lg transition hover:bg-axc-navy/90 flex items-center gap-2 shadow-sm"
              >
                <Download size={14} /> Download Excel File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export function AwbAttachmentsTab({
  fields = ATTACHMENT_FIELDS,
  showToast,
  onSave,
}: AwbAttachmentsTabProps) {
  const [files, setFiles] = useState<Record<string, File | null>>(() => getDefaultSampleAttachments());
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [activeFilter, setActiveFilter] = useState<"all" | "pdf" | "excel" | "uploaded">("all");
  const [savedVisible, setSavedVisible] = useState(false);

  const handleUpload = (field: UploadField, file: File) => {
    const ext = file.name.toLowerCase();
    if (field.kind === "pdf" && !file.type.includes("pdf") && !ext.endsWith(".pdf")) {
      setErrors((prev) => ({ ...prev, [field.key]: "Only PDF files are allowed" }));
      return;
    }
    if (
      field.kind === "excel" &&
      !file.type.includes("sheet") &&
      !file.type.includes("excel") &&
      !file.type.includes("csv") &&
      !ext.match(/\.(xlsx|xls|csv)$/i)
    ) {
      setErrors((prev) => ({ ...prev, [field.key]: "Only Excel files (.xlsx, .xls, .csv) are allowed" }));
      return;
    }

    setErrors((prev) => ({ ...prev, [field.key]: null }));
    setFiles((prev) => ({ ...prev, [field.key]: file }));
  };

  const handleRemove = (key: string) => {
    setFiles((prev) => ({ ...prev, [key]: null }));
    setErrors((prev) => ({ ...prev, [key]: null }));
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

  const filteredFields = useMemo(() => {
    return fields.filter((f) => {
      if (activeFilter === "pdf") return f.kind === "pdf";
      if (activeFilter === "excel") return f.kind === "excel";
      if (activeFilter === "uploaded") return !!files[f.key];
      return true;
    });
  }, [fields, activeFilter, files]);

  const totalUploadedCount = useMemo(() => {
    return Object.values(files).filter(Boolean).length;
  }, [files]);

  return (
    <div className="w-full flex flex-col gap-6">
      <PanelHeader title="Attachments & Documents" />
      {savedVisible && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={16} />
          Attachments saved successfully!
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {filteredFields.map((field) => (
          <AttachmentCard
            key={field.key}
            field={field}
            file={files[field.key] ?? null}
            error={errors[field.key]}
            onUpload={(f) => handleUpload(field, f)}
            onRemove={() => handleRemove(field.key)}
            onPreview={(f) => {
              const url = URL.createObjectURL(f);
              window.open(url, "_blank", "noopener,noreferrer");
              setTimeout(() => URL.revokeObjectURL(url), 10000);
            }}
          />
        ))}
      </div>
      <div className="flex justify-end gap-3 bg-white">
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm"
        >
          Save Attachment
        </button>
      </div>
    </div>
  );
}