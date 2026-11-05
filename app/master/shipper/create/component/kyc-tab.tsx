"use client";

import React, { useRef, useState, useEffect } from "react";
import { Upload, X, FileText, CheckCircle, Save, ArrowLeft } from "lucide-react";

export interface KycRowItem {
  docNumber: string;
  name: string;
  page1: string;
  page2: string;
}

export interface KycTabProps {
  kycRows: Record<string, KycRowItem>;
  setKycRows: React.Dispatch<React.SetStateAction<Record<string, KycRowItem>>>;
  onSave?: () => void;
  onCancel?: () => void;
  loading?: boolean;
}

export const SHIPPER_KYC_DOCUMENTS = [
  { key: "aadharNumber", label: "AADHAR NUMBER" },
  { key: "authorizationLetter", label: "AUTHORIZATION LETTER" },
  { key: "drivingLicence", label: "DRIVING LICENCE" },
  { key: "eori", label: "EORI" },
  { key: "gstinDiplomats", label: "GSTIN (DIPLOMATS)" },
  { key: "gstinGovt", label: "GSTIN (GOVT.)" },
  { key: "gstinNormal", label: "GSTIN (NORMAL)" },
  { key: "iecCertificate", label: "IEC CERTIFICATE" },
  { key: "ncn", label: "NCN" },
  { key: "others", label: "OTHERS" },
  { key: "panCard", label: "PAN CARD (IF COMPANY, PLEASE PROVIDE COMPANY PAN CARD)" },
  { key: "passport", label: "PASSPORT" },
  { key: "pnicNumber", label: "PNIC NUMBER" },
  { key: "signature", label: "SIGNATURE" },
  { key: "tanNumber", label: "TAN NUMBER" },
  { key: "vat", label: "VAT" },
  { key: "voterIdCard", label: "VOTER ID CARD" },
];

function formatBytes(bytes: number) {
  if (bytes <= 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
}

interface UploadingItem {
  file: File;
  uploaded: number;
  status: "uploading" | "done";
}

function KycUploadCell({
  label = "Upload",
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (fileName: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadingItem, setUploadingItem] = useState<UploadingItem | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function simulateUpload(pickedFile: File) {
    const totalSize = pickedFile.size || 1;
    const stepMs = 150;
    const stepSize = Math.max(totalSize / 14, 80 * 1024);

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
            onChange(pickedFile.name);
            setUploadingItem(null);
          }, 250);
        }

        return { ...prev, uploaded, status: isDone ? "done" : "uploading" };
      });
    }, stepMs);
  }

  function handleCancelUpload() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setUploadingItem(null);
  }

  const isUploading = !!uploadingItem;
  const uploadPercent = uploadingItem
    ? Math.min(100, Math.round((uploadingItem.uploaded / (uploadingItem.file.size || 1)) * 100))
    : 0;

  return (
    <div className="flex flex-col gap-1 flex-1 min-w-0">
      {isUploading ? (
        <div className="border border-axc-border rounded-md px-2.5 py-1.5 flex items-center gap-2 bg-white shadow-2xs">
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
                className="text-axc-red hover:text-red-700 transition shrink-0 cursor-pointer"
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
      ) : (
        <div className="flex items-center gap-1.5 border border-axc-border rounded-md px-2 py-1.5 bg-white shadow-2xs hover:border-gray-300 transition">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="shrink-0 flex items-center gap-1 border border-axc-border bg-axc-light-bg hover:bg-axc-border/40 text-axc-dark-gray text-regular-small cursor-pointer px-2.5 py-1 rounded transition"
            title={`Upload ${label}`}
          >
            <Upload size={13} />
            <span className="text-[11px] font-semibold">{label}</span>
          </button>

          <span
            className="text-[11px] text-axc-gray truncate flex-1 min-w-0"
            title={value || "No file chosen"}
          >
            {value || "No file chosen"}
          </span>

          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-gray-400 hover:text-red-500 cursor-pointer p-0.5"
              title="Remove file"
            >
              <X size={13} />
            </button>
          )}

          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const picked = e.target.files?.[0];
              if (picked) simulateUpload(picked);
              e.target.value = "";
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function KycTab({
  kycRows,
  setKycRows,
  onSave,
  onCancel,
  loading = false,
}: KycTabProps) {
  const updateRow = (key: string, patch: Partial<KycRowItem>) => {
    setKycRows((prev) => {
      const current = prev[key] || {
        docNumber: "",
        name: "",
        page1: "",
        page2: "",
      };
      return {
        ...prev,
        [key]: {
          ...current,
          ...patch,
        },
      };
    });
  };

  const filledCount = SHIPPER_KYC_DOCUMENTS.filter((doc) => {
    const row = kycRows[doc.key];
    return Boolean(row?.docNumber || row?.name || row?.page1 || row?.page2);
  }).length;

  return (
    <div className="w-full flex flex-col gap-6 pb-6">
      {/* ══════════════ SHIPPER KYC SECTION CARD ══════════════ */}
      <div className="w-full bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col">
        {/* Banner Header: Image 2 Style */}
        <div className="bg-axc-navy/60 border-b border-axc-border px-4 py-3.5 text-white flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-regular-bold text-white uppercase tracking-wide">
             SHIPPER
            </h2>
           
          </div>
          {/* <span className="text-[12px] text-white/90 font-medium bg-white/10 px-2.5 py-0.5 rounded-full">
            {SHIPPER_KYC_DOCUMENTS.length} Documents
          </span> */}
        </div>

        {/* Document Items List */}
        <div className="p-4 flex flex-col gap-3">
          {SHIPPER_KYC_DOCUMENTS.map((doc) => {
            const row = kycRows[doc.key] || {
              docNumber: "",
              name: "",
              page1: "",
              page2: "",
            };
            const isFilled = Boolean(row.docNumber || row.name || row.page1 || row.page2);

            return (
              <div
                key={doc.key}
                className={`rounded-lg border p-3.5 flex flex-col gap-2.5 transition duration-150 ${
                  isFilled
                    ? "border-axc-navy/40 bg-axc-navy/5 shadow-xs"
                    : "border-axc-border bg-white hover:border-gray-300"
                }`}
              >
                {/* Document Title Header */}
                <div className="flex items-center justify-between">
                  <span className="text-regular-medium font-bold text-axc-dark-gray tracking-wide">
                    {doc.label}
                  </span>
                  {isFilled && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle size={10} />
                      Filled
                    </span>
                  )}
                </div>

                {/* Grid row: 4 fields on md screens */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  {/* Field 1: Document Number */}
                  <div className="md:col-span-3 flex flex-col gap-1">
                    <label className="text-regular-medium text-axc-dark-gray tracking-wider">
                      Document Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Document Number"
                      value={row.docNumber}
                      onChange={(e) => updateRow(doc.key, { docNumber: e.target.value })}
                      className="w-full border border-axc-border rounded-md px-3 py-1.5 text-regular-small bg-white focus:outline-none focus:ring-1 focus:ring-axc-navy placeholder:text-gray-400"
                    />
                  </div>

                  {/* Field 2: Name as per Document */}
                  <div className="md:col-span-3 flex flex-col gap-1">
                    <label className="text-regular-medium text-axc-dark-gray tracking-wider">
                      Name As Per Document
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Name As Per Document"
                      value={row.name}
                      onChange={(e) => updateRow(doc.key, { name: e.target.value })}
                      className="w-full border border-axc-border rounded-md px-3 py-1.5 text-regular-small bg-white focus:outline-none focus:ring-1 focus:ring-axc-navy placeholder:text-gray-400"
                    />
                  </div>

                  {/* Field 3: Upload Page 1 */}
                  <div className="md:col-span-6  flex flex-col gap-1">
                    <label className="text-regular-medium text-axc-dark-gray tracking-wider">
                      Upload Page 1
                    </label>
                    <KycUploadCell
                      label="Upload"
                      value={row.page1}
                      onChange={(fileName) => updateRow(doc.key, { page1: fileName })}
                    />
                  </div>

                  {/* Field 4: Upload Page 2 */}
                  
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-2">
        

        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-4 border border-axc-border bg-white text-axc-dark-gray rounded-lg text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
            >
              
              Cancel
            </button>
          )}

          {onSave && (
            <button
              type="button"
              disabled={loading}
              onClick={onSave}
              className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm"
            >
               
              {loading ? "Saving..." : "Save Shipper"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
