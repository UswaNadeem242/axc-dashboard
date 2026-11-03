"use client";

import React, { useRef, useState, useEffect } from "react";
import { Upload, X, FileText, ExternalLink, ShieldCheck, Plus, Trash, FileSpreadsheet } from "lucide-react";
import { showToast } from "@/app/src/common/toast";
import CustomDatePicker from "@/app/src/common/datepicker";

export interface KycRowData {
  docNumber: string;
  name: string;
  page1: { name: string; size?: number; url?: string } | null;
}

export interface KycField {
  key: string;
  label: string;
}

export interface CustomerContractRow {
  id: number;
  effectiveFrom: string;
  effectiveTill: string;
  file: { name: string; size?: number; url?: string } | null;
}

export const CUSTOMER_FIELDS: KycField[] = [
  { key: "aadharNumber", label: "AADHAR NUMBER" },
  { key: "authorizationLetter", label: "AUTHORIZATION LETTER" },
  { key: "drivingLicence", label: "DRIVING LICENCE" },
  { key: "electricBill", label: "ELECTRIC BILL" },
  { key: "gstCertificate", label: "GST CERTIFICATE" },
  { key: "iecCertificate", label: "IEC CERTIFICATE" },
  { key: "lutNumber", label: "LUT NUMBER" },
  { key: "others", label: "OTHERS" },
  { key: "panCard", label: "PAN CARD (IF COMPANY, PLEASE PROVIDE COMPANY PAN CARD)" },
  { key: "passport", label: "PASSPORT" },
  { key: "telephoneBill", label: "TELEPHONE BILL" },
  { key: "vat", label: "VAT" },
  { key: "voterIdCard", label: "VOTER ID CARD" },
];

const EMPTY_ROW: KycRowData = {
  docNumber: "",
  name: "",
  page1: null,
};

const createEmptyContract = (id: number = 1): CustomerContractRow => ({
  id,
  effectiveFrom: "",
  effectiveTill: "",
  file: null,
});

function formatBytes(bytes?: number) {
  if (!bytes || bytes <= 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
}

interface UploadingState {
  fileName: string;
  fileSize: number;
  uploaded: number;
  status: "uploading" | "done";
}

interface KycFileCellProps {
  label?: string;
  file: { name: string; size?: number; url?: string } | null;
  onChange: (file: { name: string; size?: number; url?: string } | null) => void;
}

function KycFileCell({ label = "Upload", file, onChange }: KycFileCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<UploadingState | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const simulateUpload = (pickedFile: File) => {
    const totalSize = pickedFile.size || 1024 * 500;
    const stepMs = 150;
    const stepSize = Math.max(totalSize / 14, 100 * 1024);

    setUploading({
      fileName: pickedFile.name,
      fileSize: totalSize,
      uploaded: 0,
      status: "uploading",
    });

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setUploading((prev) => {
        if (!prev) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return null;
        }
        const uploaded = Math.min(prev.uploaded + stepSize, totalSize);
        const isDone = uploaded >= totalSize;

        if (isDone) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => {
            onChange({
              name: pickedFile.name,
              size: pickedFile.size,
              url: URL.createObjectURL(pickedFile),
            });
            setUploading(null);
          }, 200);
        }

        return { ...prev, uploaded, status: isDone ? "done" : "uploading" };
      });
    }, stepMs);
  };

  const handleCancelUpload = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setUploading(null);
  };

  const isUploading = Boolean(uploading);
  const uploadPercent = uploading
    ? Math.min(100, Math.round((uploading.uploaded / uploading.fileSize) * 100))
    : 0;

  return (
    <div className="flex flex-col gap-1 w-full">
      {isUploading && uploading ? (
        <div className="border border-axc-border rounded-md px-2.5 py-1.5 flex items-center gap-2 bg-white shadow-2xs">
          <span className="p-1.5 rounded shrink-0 bg-gray-100 text-gray-500">
            <FileText size={13} />
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1.5">
              <p
                className="text-[11px] font-medium text-gray-700 truncate"
                title={uploading.fileName}
              >
                {uploading.fileName}
              </p>
              <button
                type="button"
                onClick={handleCancelUpload}
                className="text-red-500 hover:text-red-700 transition shrink-0 cursor-pointer p-0.5"
                title="Cancel upload"
              >
                <X size={12} />
              </button>
            </div>

            <p className="text-[9px] text-gray-400 mt-0.5">
              {formatBytes(uploading.uploaded)} of {formatBytes(uploading.fileSize)}
            </p>

            <div className="mt-1 flex items-center h-1 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full bg-axc-navy transition-all duration-150 ease-linear ${
                  uploading.status === "done" ? "rounded-full" : "rounded-l-full"
                }`}
                style={{ width: `${uploadPercent}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 border border-axc-border rounded-md px-2 py-1.5 bg-white shadow-2xs transition">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="shrink-0 flex items-center gap-1 border border-axc-border bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold cursor-pointer px-2.5 py-1 rounded transition"
            title={`Upload ${label}`}
          >
            <Upload size={13} />
            <span className="text-[11px]">{label}</span>
          </button>

          <span
            className="text-[11px] text-gray-500 truncate flex-1 min-w-0 ml-1"
            title={file ? file.name : "No file chosen"}
          >
            {file ? file.name : "No file chosen"}
          </span>

          {file && (
            <button
              type="button"
              onClick={() => onChange(null)}
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

      {file?.url && !isUploading && (
        <a
          href={file.url}
          target="_blank"
          rel="noreferrer"
          className="self-start inline-flex items-center gap-1 text-axc-navy hover:underline text-[11px] font-medium mt-0.5 transition"
        >
          <ExternalLink size={11} />
          View Uploaded File
        </a>
      )}
    </div>
  );
}

interface KycTabProps {
  customerId?: string;
  customerName?: string;
}

export default function KycTab({ customerId, customerName }: KycTabProps) {
  // KYC Documents Data
  const [data, setData] = useState<Record<string, KycRowData>>(() => {
    const initial: Record<string, KycRowData> = {};
    CUSTOMER_FIELDS.forEach((f) => {
      initial[f.key] = { ...EMPTY_ROW };
    });
    return initial;
  });

  // Customer Contracts Data
  const [contracts, setContracts] = useState<CustomerContractRow[]>([
    createEmptyContract(1),
  ]);

  const [saving, setSaving] = useState(false);

  // Load saved state from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storageKey = customerId ? `customer_kyc_${customerId}` : "customer_kyc_draft";
    const contractsKey = customerId ? `customer_contracts_${customerId}` : "customer_contracts_draft";

    const savedKyc = localStorage.getItem(storageKey);
    if (savedKyc) {
      try {
        const parsed = JSON.parse(savedKyc);
        if (parsed && typeof parsed === "object") {
          setData((prev) => ({ ...prev, ...parsed }));
        }
      } catch (err) {
        console.error("Failed to load KYC documents:", err);
      }
    }

    const savedContracts = localStorage.getItem(contractsKey);
    if (savedContracts) {
      try {
        const parsedContracts = JSON.parse(savedContracts);
        if (Array.isArray(parsedContracts) && parsedContracts.length > 0) {
          setContracts(parsedContracts);
        }
      } catch (err) {
        console.error("Failed to load customer contracts:", err);
      }
    }
  }, [customerId]);

  const updateRow = (key: string, patch: Partial<KycRowData>) => {
    setData((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || EMPTY_ROW),
        ...patch,
      },
    }));
  };

  // Contract Table Handlers
  const addContract = () => {
    setContracts((prev) => [
      ...prev,
      {
        id: Date.now(),
        effectiveFrom: "",
        effectiveTill: "",
        file: null,
      },
    ]);
    // showToast({ variant: "success", message: "Contract item added" });
  };

  const removeContract = (id: number) => {
    setContracts((prev) => {
      if (prev.length <= 1) {
        return [createEmptyContract(Date.now())];
      }
      return prev.filter((c) => c.id !== id);
    });
    // showToast({ variant: "success", message: "Contract item removed" });
  };

  const updateContract = (id: number, patch: Partial<CustomerContractRow>) => {
    setContracts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  };

  const handleSave = () => {
    setSaving(true);
    const storageKey = customerId ? `customer_kyc_${customerId}` : "customer_kyc_draft";
    const contractsKey = customerId ? `customer_contracts_${customerId}` : "customer_contracts_draft";

    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(data));
      localStorage.setItem(contractsKey, JSON.stringify(contracts));
    }

    setTimeout(() => {
      setSaving(false);
      showToast({
        variant: "success",
        message: "Customer KYC and Contract details saved successfully!",
      });
    }, 300);
  };

  const filledCount = CUSTOMER_FIELDS.filter((f) => {
    const row = data[f.key];
    return Boolean(row?.docNumber || row?.name || row?.page1);
  }).length;

  return (
    <div className="flex flex-col gap-6 w-full mt-4 pb-36">
      {/* ── SECTION 1: KYC Information (AWB Style) ── */}
      <div className="w-full bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col">
        {/* Section Header */}
        <div className="bg-axc-navy/60 border-b border-axc-border px-4 py-3.5 text-white rounded-tl-lg rounded-tr-lg flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {/* <ShieldCheck size={18} className="text-white" /> */}
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              KYC Information
            </h2>
            {customerName && (
              <span className="text-xs text-white/80 font-normal">
                ({customerName})
              </span>
            )}
          </div>
           
        </div>

        {/* Document Cards List */}
        <div className="p-4 flex flex-col gap-3">
          {CUSTOMER_FIELDS.map((field) => {
            const row = data[field.key] ?? EMPTY_ROW;
            const hasData = Boolean(row.docNumber || row.name || row.page1);

            return (
              <div
                key={field.key}
                className={`rounded-lg border p-3.5 flex flex-col gap-2.5 transition duration-150 ${
                  hasData
                    ? "border-axc-navy/40 bg-axc-navy/5 shadow-xs"
                    : "border-axc-border bg-white"
                }`}
              >
                {/* Top Label */}
                <div className="flex items-center justify-between">
                  <span className="text-regular-medium font-bold text-axc-dark-gray tracking-wide">
                    {field.label}
                  </span>
                  {hasData && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-300">
                      Filled
                    </span>
                  )}
                </div>

                {/* 3 Columns under the label */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  {/* Column 1: Document Number */}
                  <div className="md:col-span-3 flex flex-col gap-1">
                    <label className="text-xs font-medium text-axc-dark-gray tracking-wide">
                      Document Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Document Number"
                      value={row.docNumber}
                      onChange={(e) => updateRow(field.key, { docNumber: e.target.value })}
                      className="w-full border border-axc-border rounded-md px-3 py-1.5 text-regular-small bg-white focus:outline-none focus:ring-1 focus:ring-axc-navy placeholder:text-gray-400"
                    />
                  </div>

                  {/* Column 2: Name as per Document */}
                  <div className="md:col-span-3 flex flex-col gap-1">
                    <label className="text-xs font-medium text-axc-dark-gray tracking-wide">
                      Name As Per Document
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Name As Per Document"
                      value={row.name}
                      onChange={(e) => updateRow(field.key, { name: e.target.value })}
                      className="w-full border border-axc-border rounded-md px-3 py-1.5 text-regular-small bg-white focus:outline-none focus:ring-1 focus:ring-axc-navy placeholder:text-gray-400"
                    />
                  </div>

                  {/* Column 3: Upload File */}
                  <div className="md:col-span-6 flex flex-col gap-1">
                    <label className="text-xs font-medium text-axc-dark-gray tracking-wide">
                      Upload File
                    </label>
                    <div className="w-full">
                      <KycFileCell
                        label="Upload"
                        file={row.page1}
                        onChange={(f) => updateRow(field.key, { page1: f })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 2: Customer Contract (Data from Image 1, Design from Image 2) ── */}
      <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col">
        {/* Panel Header */}
        <div className="bg-axc-navy/60 rounded-t-lg text-white p-4 capitalize tracking-wide flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <FileSpreadsheet size={18} className="text-white" /> */}
            <h3 className="text-sm font-bold text-white tracking-wide">
              Customer Contract
            </h3>
          </div>
          {/* <button
            type="button"
            onClick={addContract}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-semibold rounded shadow-xs cursor-pointer transition"
          >
            <Plus size={14} />
            Add Item
          </button> */}
        </div>

        {/* Table Content */}
        <div className="p-4">
          <div className="border border-axc-border rounded-md">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-axc-navy/10 text-regular-medium text-axc-dark-gray text-left whitespace-nowrap">
                  <th className="py-2.5 px-3 border-r border-axc-border font-bold text-xs capitalize w-[30%]">
                    Effective From
                  </th>
                  <th className="py-2.5 px-3 border-r border-axc-border font-bold text-xs capitalize w-[30%]">
                    Effective Till
                  </th>
                  <th className="py-2.5 px-3 border-r border-axc-border font-bold text-xs capitalize w-[30%]">
                    File
                  </th>
                  <th className="py-2.5 px-2 text-center whitespace-nowrap font-bold text-xs capitalize w-[10%]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-axc-border last:border-b-0 hover:bg-gray-50/50"
                  >
                    {/* Column 1: Effective From */}
                    <td className="p-2 border-r border-axc-border align-middle relative z-30">
                      <CustomDatePicker
                        value={item.effectiveFrom}
                        onChange={(val) => updateContract(item.id, { effectiveFrom: val })}
                        placeholder="mm/dd/yyyy"
                        openDirection="down"
                        className="w-full"
                      />
                    </td>

                    {/* Column 2: Effective Till */}
                    <td className="p-2 border-r border-axc-border align-middle relative z-30">
                      <CustomDatePicker
                        value={item.effectiveTill}
                        onChange={(val) => updateContract(item.id, { effectiveTill: val })}
                        placeholder="mm/dd/yyyy"
                        openDirection="down"
                        className="w-full"
                      />
                    </td>

                    {/* Column 3: File Upload */}
                    <td className="p-2 border-r border-axc-border align-middle">
                      <KycFileCell
                        label="Choose Files"
                        file={item.file}
                        onChange={(f) => updateContract(item.id, { file: f })}
                      />
                    </td>

                    {/* Column 4: Action */}
                    <td className="p-2 text-center align-middle">
                      <button
                        type="button"
                        onClick={() => removeContract(item.id)}
                        className="inline-flex cursor-pointer items-center justify-center rounded-md border border-axc-red/30 p-1.5 text-axc-red transition hover:bg-axc-red/10"
                        title="Remove Contract Item"
                      >
                        <Trash size={15} />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Bottom Add Row */}
                <tr className="border-t border-axc-border bg-white">
                  <td colSpan={4} className="py-2.5 px-4">
                    <button
                      type="button"
                      onClick={addContract}
                      className="p-1 text-white rounded-full ring ring-axc-yellow transition capitalize cursor-pointer flex justify-center items-center hover:bg-axc-yellow/10"
                      title="Add Contract Item"
                    >
                      <Plus size={15} strokeWidth={3} className="text-axc-yellow" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Save Action Bar ── */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm"
        >
          {saving ? "Saving..." : "Save KYC & Contracts"}
        </button>
      </div>
    </div>
  );
}
