"use client";

import React, { useRef } from "react";
import { PanelHeader } from "./form";
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
  onSave?: (data: { customer: KycState; shipper: KycState }) => void;
  existingCustomerFiles?: Record<string, KycExistingFiles>;
  existingShipperFiles?: Record<string, KycExistingFiles>;
}

const EMPTY_ROW: KycRowData = { docNumber: "", name: "", page1: null, page2: null };

const CUSTOMER_FIELDS: KycField[] = [
  { key: "aadharNumber", label: "Aadhar Number" },
  { key: "authorizationLetter", label: "Authorization Letter" },
  { key: "drivingLicence", label: "Driving Licence" },
  { key: "electricBill", label: "Electric Bill" },
  { key: "gstCertificate", label: "GST Certificate" },
  { key: "iecCertificate", label: "IEC Certificate" },
  { key: "lutNumber", label: "LUT Number" },
  { key: "others", label: "Others" },
  { key: "panCard", label: "PAN Card (If Company, Please Provide Company PAN Card)" },
  { key: "passport", label: "Passport" },
  { key: "telephoneBill", label: "Telephone Bill" },
  { key: "vat", label: "VAT" },
  { key: "voterIdCard", label: "Voter ID Card" },
];

const SHIPPER_FIELDS: KycField[] = [
  { key: "aadharNumber", label: "Aadhar Number" },
  { key: "authorizationLetter", label: "Authorization Letter" },
  { key: "drivingLicence", label: "Driving Licence" },
  { key: "eori", label: "EORI" },
  { key: "gstinDiplomats", label: "GSTIN (Diplomats)" },
  { key: "gstinGovt", label: "GSTIN (Govt.)" },
  { key: "gstinNormal", label: "GSTIN (Normal)" },
  { key: "iecCertificate", label: "IEC Certificate" },
  { key: "ncn", label: "NCN" },
  { key: "others", label: "Others" },
  { key: "panCard", label: "PAN Card (If Company, Please Provide Company PAN Card)" },
  { key: "passport", label: "Passport" },
  { key: "pnicNumber", label: "PNIC Number" },
  { key: "tanNumber", label: "TAN Number" },
  { key: "vat", label: "VAT" },
  { key: "voterIdCard", label: "Voter ID Card" },
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
  fields,
  values,
  existingFiles,
  onRowChange,
}: {
  title: string;
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
      label: "Document Type",
      key: "label",
      render: (row: KycTableRow) => (
        <span className="text-regular-medium text-axc-dark-gray">{row.label}</span>
      ),
    },
    {
      label: "Document Number",
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
      label: "Name As Per Document",
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
      label: "Upload Page 1",
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
      label: "Upload Page 2",
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
      {/* <PanelHeader title={title} /> */}
      <h1>
        {title}
      </h1>
      <div className="">
        {/* bg-white border border-axc-border rounded-lg p-4 */}
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
      className="bg-axc-navy hover:bg-axc-navy/80 text-white text-regular-medium capitalize  px-5 py-4 rounded-lg transition shadow-sm shrink-0"
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
}: AwbKycTabProps) {
  const [customer, setCustomer] = React.useState<KycState>({});
  const [shipper, setShipper] = React.useState<KycState>({});

  const updateCustomer = (key: string, patch: Partial<KycRowData>) => {
    setCustomer((prev) => ({ ...prev, [key]: { ...EMPTY_ROW, ...prev[key], ...patch } }));
  };

  const updateShipper = (key: string, patch: Partial<KycRowData>) => {
    setShipper((prev) => ({ ...prev, [key]: { ...EMPTY_ROW, ...prev[key], ...patch } }));
  };

  const handleSave = () => {
    onSave?.({ customer, shipper });
    showToast?.("KYC saved successfully!", "success");
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <KycSection
        title="Customer"
        fields={CUSTOMER_FIELDS}
        values={customer}
        existingFiles={existingCustomerFiles}
        onRowChange={updateCustomer}
      />

      <KycSection
        title="Shipper At Docket Level"
        fields={SHIPPER_FIELDS}
        values={shipper}
        existingFiles={existingShipperFiles}
        onRowChange={updateShipper}
      />

      <div className="flex justify-end">
        <SaveKycButton onClick={handleSave} />
      </div>
    </div>
  );
}