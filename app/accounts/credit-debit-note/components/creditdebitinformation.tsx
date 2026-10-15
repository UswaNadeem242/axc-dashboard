"use client";

import React, { useRef, useState } from "react";
import { Upload, FileText, X, AlertCircle, Download } from "lucide-react";
import {
  CreditDebitNoteFormData,
  ORIGIN_HUB_OPTIONS,
  COMPANY_OPTIONS,
  CUSTOMER_OPTIONS,
  TYPE_OPTIONS,
  NOTE_TYPE_OPTIONS,
  AGAINST_OPTIONS,
  REASON_OPTIONS,
} from "./types";
import {
  FieldLabel,
  PanelHeader,
  EditIconButton,
  inputClass,
  disabledInputClass,
} from "@/app/create-entries/components/form";
import CustomDatePicker from "@/app/src/common/datepicker";
import CustomTimePicker from "@/app/src/common/timepicker";
import Dropdown from "@/app/src/common/dropdown";

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

function FileUploadField({
  onFileChange,
  placeholder,
  acceptedMimeTypes = ["text/csv", "application/vnd.ms-excel"],
  acceptedExtensions = [".csv"],
  acceptedLabel = "CSV format only, up to 10MB",
  maxSizeBytes = 10 * 1024 * 1024,
  error = false,
}: {
  onFileChange?: (file: File | null) => void;
  placeholder?: string;
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

    setUploadingFiles(mapped.slice(0, 1));

    const accepted = mapped.filter((m) => m.status === "uploading");
    accepted.forEach((uf) => simulateUpload(uf.id, uf.file.size));

    const acceptedFiles = accepted.map((uf) => uf.file);
    onFileChange?.(acceptedFiles[0] ?? null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeFile(id: string) {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
    onFileChange?.(null);
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
        <span className="text-xs text-gray-400">
          {placeholder || "Drop your CSV file here or browse"}
        </span>
        <span className="text-[10px] text-gray-400">{acceptedLabel}</span>
        <input
          ref={inputRef}
          type="file"
          accept={[...acceptedMimeTypes, ...(acceptedExtensions ?? [])].join(",")}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {uploadingFiles.length > 0 && (
        <div className="flex flex-row flex-wrap gap-2">
          {uploadingFiles.map((uf) => {
            const percent =
              uf.status === "error"
                ? 0
                : Math.min(100, Math.round((uf.uploaded / uf.file.size) * 100));
            const done = uf.status === "done";
            const isError = uf.status === "error";

            return (
              <div
                key={uf.id}
                className={`border rounded-md px-2.5 py-2 flex items-center gap-2 w-full sm:w-[calc(50%-0.25rem)] lg:w-[calc(30.333%-0.34rem)] ${
                  isError ? "border-red-300 bg-red-50/40" : "border-axc-border bg-white shadow-2xs"
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
                    <p className="text-[11px] font-medium text-gray-700 truncate">
                      {uf.file.name}
                    </p>
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
                    <p className="text-[10px] text-axc-red font-medium mt-0.5 truncate">
                      {uf.errorMessage}
                    </p>
                  ) : (
                    <>
                      <p className="text-[9px] text-gray-400 mt-0.5">
                        {formatBytes(uf.uploaded)} of {formatBytes(uf.file.size)}
                      </p>
                      <div className="mt-1 flex items-center h-1 w-full overflow-hidden rounded-full bg-gray-100">
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

interface CreditDebitInformationProps {
  form: CreditDebitNoteFormData;
  updateField: (field: keyof CreditDebitNoteFormData, value: any) => void;
  toggleEdit: (field: "editNoteNumber" | "editCompany") => void;
  onCsvUploaded?: (file: File | null) => void;
  onDownloadSampleCsv?: () => void;
}

export default function CreditDebitInformation({
  form,
  updateField,
  toggleEdit,
  onCsvUploaded,
  onDownloadSampleCsv,
}: CreditDebitInformationProps) {
  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-xs flex flex-col relative z-20">
      <PanelHeader title="Credit / Debit Note Information" />

      {/* 3-Column Grid Layout matching Manifest Information UI */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-4 items-start">
        {/* ================= COLUMN 1 ================= */}
        <div className="flex flex-col gap-3">
          {/* 1. Note No. */}
          <div className="flex flex-col gap-1">
            <FieldLabel required>Note No.</FieldLabel>
            <div className="relative">
              <input
                disabled={!form.editNoteNumber}
                value={form.noteNumber}
                onChange={(e) => updateField("noteNumber", e.target.value)}
                placeholder="Auto-generated"
                className={`${form.editNoteNumber ? inputClass : disabledInputClass
                  } w-full pr-10 font-mono`}
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <EditIconButton
                  active={form.editNoteNumber}
                  onToggle={() => toggleEdit("editNoteNumber")}
                  title="Edit Note No."
                />
              </div>
            </div>
          </div>

          {/* 2. Customer Code */}
          <div className="flex flex-col gap-1">
            <FieldLabel>Customer </FieldLabel>
            <input
              value={form.customerCode}
              onChange={(e) => updateField("customerCode", e.target.value)}
              className={inputClass}
              placeholder="Customer Code"
            />
          </div>

        </div>

        {/* ================= COLUMN 2 ================= */}
        <div className="flex flex-col gap-3">
         
          {/* 2. Document Date */}
          <div className="flex flex-col gap-1">
            <FieldLabel required>Type</FieldLabel>
            <Dropdown
              value={form.type}
              onChange={(val) => updateField("type", val)}
              placeholder="Select Type..."
              options={TYPE_OPTIONS}
            />
          </div>


          {/* 3. Company */}
          <div className="flex flex-col gap-1">
            <FieldLabel required>Company</FieldLabel>
            <div className="relative">
              <Dropdown
                value={form.company}
                onChange={(val) => updateField("company", val)}
                disabled={!form.editCompany}
                placeholder="Select Company..."
                options={COMPANY_OPTIONS}
                className="pr-10"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <EditIconButton
                  active={form.editCompany}
                  onToggle={() => toggleEdit("editCompany")}
                  title="Edit Company"
                />
              </div>
            </div>
          </div>

          
        </div>

        {/* ================= COLUMN 3 ================= */}
        <div className="flex flex-col gap-3">
          
          {/* 5. Note Type (General / Against) */}
          <div className="flex flex-col gap-1">
            <FieldLabel required>Note Type</FieldLabel>
            <Dropdown
              value={form.noteTypeKind}
              onChange={(val) => updateField("noteTypeKind", val)}
              placeholder="Select Note Type..."
              options={NOTE_TYPE_OPTIONS}
            />
          </div>

          {/* 2. Date */}
          <div className="flex flex-col gap-1">
            <FieldLabel required>Date</FieldLabel>
            <CustomDatePicker
              value={form.date}
              onChange={(val) => updateField("date", val)}
              placeholder="Select date"
              align="right"
            />
          </div>
        </div>

        {/* CSV File Upload Section matching Vendor Invoice & Reference Image */}
        <div className="col-span-full flex flex-col gap-1.5 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <label className="text-regular-medium text-axc-dark-gray font-medium">
             File Upload  
            </label>
            {/* {onDownloadSampleCsv && (
              <button
                type="button"
                onClick={onDownloadSampleCsv}
                className="flex items-center gap-1.5 text-xs text-axc-navy font-semibold hover:underline cursor-pointer"
              >
                <Download size={13} />
                Download Sample CSV
              </button>
            )} */}
          </div>
          <FileUploadField
            placeholder="Drop your CSV file here or browse"
            acceptedMimeTypes={["text/csv", "application/vnd.ms-excel"]}
            acceptedExtensions={[".csv"]}
            acceptedLabel="CSV format only, up to 10MB"
            onFileChange={onCsvUploaded}
          />
        </div>
      </div>
    </div>
  );
}
