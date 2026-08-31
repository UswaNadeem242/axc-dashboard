"use client";

import React, { useRef } from "react";
import { Upload, X, ExternalLink } from "lucide-react";

interface KycField {
  key: string;
  label: string;
}

interface KycRowData {
  docNumber: string;
  name: string;
  page1: File | null;
  page2: File | null;
}

type KycState = Record<string, KycRowData>;

interface KycExistingFiles {
  page1?: string;
  page2?: string;
}

interface AwbKycTabProps {
  showToast?: (message: string, type?: "success" | "info") => void;
  onSave?: (data: { customer: KycState; shipper: KycState; shipperMaster: KycState }) => void;
  existingCustomerFiles?: Record<string, KycExistingFiles>;
  existingShipperFiles?: Record<string, KycExistingFiles>;
  existingShipperMasterFiles?: Record<string, KycExistingFiles>;
}

const EMPTY_ROW: KycRowData = { docNumber: "", name: "", page1: null, page2: null };

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

export const SHIPPER_DOCKET_FIELDS: KycField[] = [
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
  { key: "tanNumber", label: "TAN NUMBER" },
  { key: "vat", label: "VAT" },
  { key: "voterIdCard", label: "VOTER ID CARD" },
];

export const SHIPPER_MASTER_FIELDS: KycField[] = [
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
  { key: "tanNumber", label: "TAN NUMBER" },
  { key: "vat", label: "VAT" },
  { key: "voterIdCard", label: "VOTER ID CARD" },
];

function KycFileCell({
  label = "Upload",
  file,
  existingFileUrl,
  onChange,
}: {
  label?: string;
  file: File | null;
  existingFileUrl?: string;
  onChange: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-1 flex-1 min-w-0">
      <div className="flex items-center gap-1.5 border border-axc-border rounded-md px-2 py-1.5 bg-white shadow-2xs  transition">
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
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </div>
      {existingFileUrl && (
        <a
          href={existingFileUrl}
          target="_blank"
          rel="noreferrer"
          className="self-start inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded transition"
        >
          <ExternalLink size={10} />
          View File ({label})
        </a>
      )}
    </div>
  );
}

function KycSection({
  title,
  subtitle,
  fields,
  values,
  existingFiles,
  onRowChange,
}: {
  title: string;
  subtitle?: string;
  fields: KycField[];
  values: KycState;
  existingFiles?: Record<string, KycExistingFiles>;
  onRowChange: (key: string, patch: Partial<KycRowData>) => void;
}) {
  return (
    <div className="w-full bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col">
      {/* Section Header */}
      <div className="bg-axc-navy/60 border-b border-axc-border px-4 py-5 white  flex items-center justify-between flex-wrap gap-
        text-white p-4  rounded-tl-lg  rounded-tr-lg   gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-regular-bold text-white capitalize tracking-wide">
            {title}
          </h2>
          {subtitle && (
            <span className="text-regular-small text-red-600 font-semibold uppercase">
              {subtitle}
            </span>
          )}
        </div>
        <span className="text-[12px] text-axc-gray font-medium">
          {fields.length} Documents
        </span>
      </div>

      {/* Document Items List */}
      <div className="p-4 flex flex-col gap-3">
        {fields.map((field) => {
          const row = values[field.key] ?? EMPTY_ROW;
          const existing = existingFiles?.[field.key];
          const hasData = Boolean(row.docNumber || row.name || row.page1 || row.page2 || existing?.page1 || existing?.page2);

          return (
            <div
              key={field.key}
              className={`rounded-lg border p-3.5 flex flex-col gap-2.5 transition duration-150 ${hasData
                  ? "border-axc-navy/40 bg-axc-navy/5 shadow-xs"
                  : "border-axc-border bg-white "
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
                  <label className="text-regular-medium text-axc-dark-gray  tracking-wider">
                    Document Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Document Number"
                    value={row.docNumber}
                    onChange={(e) => onRowChange(field.key, { docNumber: e.target.value })}
                    className="w-full border border-axc-border rounded-md px-3 py-1.5 text-regular-small bg-white focus:outline-none focus:ring-1 focus:ring-axc-navy placeholder:text-gray-400"
                  />
                </div>

                {/* Column 2: Name as per Document */}
                <div className="md:col-span-3 flex flex-col gap-1">
                  <label className="text-regular-medium text-axc-dark-gray  tracking-wider">
                    Name As Per Document
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Name As Per Document"
                    value={row.name}
                    onChange={(e) => onRowChange(field.key, { name: e.target.value })}
                    className="w-full border border-axc-border rounded-md px-3 py-1.5 text-regular-small bg-white focus:outline-none focus:ring-1 focus:ring-axc-navy placeholder:text-gray-400"
                  />
                </div>

                {/* Column 3: Upload Files */}
                <div className="md:col-span-6 flex flex-col gap-1">
                  <label className="text-regular-medium text-axc-dark-gray tracking-wider">
                    Upload File
                  </label>
                  <div className="w-full">
                    <KycFileCell
                      label="Upload"
                      file={row.page1}
                      existingFileUrl={existing?.page1}
                      onChange={(f) => onRowChange(field.key, { page1: f })}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SaveKycButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-axc-navy hover:bg-axc-navy/80 text-white text-regular-medium capitalize px-6 py-3 rounded-lg transition shadow-sm shrink-0 cursor-pointer font-semibold"
    >
      Save KYC
    </button>
  );
}

export function AwbKycTab({
  showToast,
  onSave,
  existingCustomerFiles,
  existingShipperFiles,
  existingShipperMasterFiles,
}: AwbKycTabProps) {
  const [customer, setCustomer] = React.useState<KycState>({});
  const [shipper, setShipper] = React.useState<KycState>({});
  const [shipperMaster, setShipperMaster] = React.useState<KycState>({});

  const updateCustomer = (key: string, patch: Partial<KycRowData>) => {
    setCustomer((prev) => ({ ...prev, [key]: { ...EMPTY_ROW, ...prev[key], ...patch } }));
  };

  const updateShipper = (key: string, patch: Partial<KycRowData>) => {
    setShipper((prev) => ({ ...prev, [key]: { ...EMPTY_ROW, ...prev[key], ...patch } }));
  };

  const updateShipperMaster = (key: string, patch: Partial<KycRowData>) => {
    setShipperMaster((prev) => ({ ...prev, [key]: { ...EMPTY_ROW, ...prev[key], ...patch } }));
  };

  const handleSave = () => {
    onSave?.({ customer, shipper, shipperMaster });
    showToast?.("KYC saved successfully!", "success");
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Section 1: Customer */}
      <KycSection
        title="I. CUSTOMER"
        subtitle="(Document uploaded here are save in shipper master)"
        fields={CUSTOMER_FIELDS}
        values={customer}
        existingFiles={existingCustomerFiles}
        onRowChange={updateCustomer}
      />

      {/* Section 2: Shipper At Docket Level */}
      <KycSection
        title="II. SHIPPER AT DOCKET LEVEL"
        subtitle="(Document uploaded here are save in shipper master)"
        fields={SHIPPER_DOCKET_FIELDS}
        values={shipper}
        existingFiles={existingShipperFiles}
        onRowChange={updateShipper}
      />

      {/* Section 3: Shipper (Document Uploaded Here Are Save In Shipper Master) */}
      <KycSection
        title="III. SHIPPER"
        subtitle="(DOCUMENT UPLOADED HERE ARE SAVE IN SHIPPER MASTER)"
        fields={SHIPPER_MASTER_FIELDS}
        values={shipperMaster}
        existingFiles={existingShipperMasterFiles}
        onRowChange={updateShipperMaster}
      />

      <div className="flex justify-end pt-2 pb-4">
        <SaveKycButton onClick={handleSave} />
      </div>
    </div>
  );
}