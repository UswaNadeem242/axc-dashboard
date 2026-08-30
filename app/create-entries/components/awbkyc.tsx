"use client";

import React, { useRef } from "react";
import CommonTable from "../../src/common/table";
import { Upload } from "lucide-react";

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

/* ------------------------------------------------------------------ */
/*  Row shape fed into CommonTable                                     */
/* ------------------------------------------------------------------ */

interface KycTableRow {
  key: string;
  label: string;
  docNumber: string;
  name: string;
  page1: File | null;
  page2: File | null;
  existingFiles?: KycExistingFiles;
}

function KycFileCell({
  file,
  existingFileUrl,
  onChange,
}: {
  file: File | null;
  existingFileUrl?: string;
  onChange: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-1.5 min-w-[160px]">
      <div className="flex items-center gap-2 border border-axc-border rounded-md px-2 py-1.5 bg-white">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="shrink-0 border border-axc-border bg-axc-light-bg hover:bg-axc-border/30 text-axc-dark-gray text-regular-medium cursor-pointer px-3 py-1.5 rounded-md transition"
        >
          <Upload size={14} />
        </button>
        <span className="text-[11px] text-axc-gray truncate">
          {file ? file.name : "No file chosen"}
        </span>
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
          className="self-start bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-1 rounded-md transition"
        >
          View File
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
  const tableData: KycTableRow[] = fields.map((f) => {
    const row = values[f.key] ?? EMPTY_ROW;
    return {
      key: f.key,
      label: f.label,
      docNumber: row.docNumber,
      name: row.name,
      page1: row.page1,
      page2: row.page2,
      existingFiles: existingFiles?.[f.key],
    };
  });

  const headings = [
    {
      label: "DOCUMENT TYPE",
      key: "label",
      render: (row: KycTableRow) => (
        <span className="text-regular-medium text-axc-dark-gray font-semibold">{row.label}</span>
      ),
    },
    {
      label: "DOCUMENT NUMBER",
      key: "docNumber",
      render: (row: KycTableRow) => (
        <input
          type="text"
          value={row.docNumber}
          onChange={(e) => onRowChange(row.key, { docNumber: e.target.value })}
          className="w-full min-w-[130px] border border-axc-border rounded-md px-2 py-1.5 text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-axc-navy"
        />
      ),
    },
    {
      label: "NAME AS PER DOCUMENT",
      key: "name",
      render: (row: KycTableRow) => (
        <input
          type="text"
          value={row.name}
          onChange={(e) => onRowChange(row.key, { name: e.target.value })}
          className="w-full min-w-[130px] border border-axc-border rounded-md px-2 py-1.5 text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-axc-navy"
        />
      ),
    },
    {
      label: "UPLOAD PAGE 1",
      key: "page1",
      render: (row: KycTableRow) => (
        <KycFileCell
          file={row.page1}
          existingFileUrl={row.existingFiles?.page1}
          onChange={(f) => onRowChange(row.key, { page1: f })}
        />
      ),
    },
    {
      label: "UPLOAD PAGE 2",
      key: "page2",
      render: (row: KycTableRow) => (
        <KycFileCell
          file={row.page2}
          existingFileUrl={row.existingFiles?.page2}
          onChange={(f) => onRowChange(row.key, { page2: f })}
        />
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <h2 className="text-regular-bold text-axc-dark-gray uppercase tracking-wide">
          {title}
        </h2>
        {subtitle && (
          <span className="text-regular-medium text-red-600 font-semibold uppercase">
            {subtitle}
          </span>
        )}
      </div>
      <div>
        <CommonTable
          headings={headings}
          data={tableData}
          rowKey="key"
          hidePagination={true}
          itemsPerPage={fields.length}
        />
      </div>
    </div>
  );
}

function SaveKycButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-axc-navy hover:bg-axc-navy/80 text-white text-regular-medium capitalize px-5 py-4 rounded-lg transition shadow-sm shrink-0 cursor-pointer"
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
    <div className="w-full flex flex-col gap-8">
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

      <div className="flex justify-end">
        <SaveKycButton onClick={handleSave} />
      </div>
    </div>
  );
}