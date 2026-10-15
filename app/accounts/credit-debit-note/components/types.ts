export type NoteTypeKind = "CREDIT NOTE" | "DEBIT NOTE";
export type NoteCategory = "GENERAL" | "AGAINST";
export type AgainstDocType = "INVOICE" | "AWB";
export type NoteStatus = "Approved" | "Pending" | "Draft" | "Adjusted" | "Cancelled";

export interface CreditDebitLineItem {
  id: string;
  description: string;
  customerRefNo: string;
  awbNo: string;
  hsCode: string;
  invoiceNo: string;
  invoiceDate: string;
  chargWeight: string | number;
  newChgWeight: string | number;
  destCode: string;
  rate: string | number;
  fscPercent: string | number;
  fsc: string | number;
  vatType: string;
  taxPercent: string | number;
  total: string | number;
  remark: string;
}

export interface ChargeAdjustmentItem {
  id: string;
  description: string;
  originalAmount: number;
  revisedAmount: number;
  adjustmentAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export interface CreditDebitNoteFormData {
  // Column 1 fields (Manifest style)
  noteNumber: string;
  editNoteNumber: boolean;
  date: string;
  time: string;
  type: NoteTypeKind;
  noteTypeKind: NoteCategory;

  // Column 2 fields
  customer: string;
  customerCode: string;
  company: string;
  editCompany: boolean;
  againstType: AgainstDocType;
  againstNumber: string;

  // Column 3 fields
  originHub: string;
  destinationHub?: string;
  againstDocDate: string;
  originalAmount: string | number;
  adjustmentAmount: string | number;
  reason: string;
  remarks: string;

  // Financial & ledger values
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  roundOff?: string | number;
  currency: string;
  status: NoteStatus;
  items?: ChargeAdjustmentItem[];
  noteItems?: CreditDebitLineItem[];
  csvFile?: File | null;
  csvFileName?: string;
}

export const ORIGIN_HUB_OPTIONS = [
  { value: "DEL", label: "Delhi (DEL)" },
  { value: "BOM", label: "Mumbai (BOM)" },
  { value: "SKT", label: "Sialkot (SKT)" },
  { value: "LHE", label: "Lahore (LHE)" },
  { value: "KHI", label: "Karachi (KHI)" },
  { value: "DXB", label: "Dubai (DXB)" },
  { value: "LHR", label: "London Heathrow (LHR)" },
  { value: "JFK", label: "New York (JFK)" },
];

export const DEST_HUB_OPTIONS = [
  { value: "JFK", label: "New York (JFK)" },
  { value: "LHR", label: "London (LHR)" },
  { value: "DXB", label: "Dubai (DXB)" },
  { value: "FRA", label: "Frankfurt (FRA)" },
  { value: "YYZ", label: "Toronto (YYZ)" },
  { value: "SIN", label: "Singapore (SIN)" },
];

export const COMPANY_OPTIONS = [
  {
    value: "AMERICAN XPRESS COURIER - AXC INC",
    label: "AMERICAN XPRESS COURIER - AXC INC",
  },
  {
    value: "AX COURIER LOGISTICS - AX COURIER LOGISTICS",
    label: "AX COURIER LOGISTICS - AX COURIER LOGISTICS",
  },
];

export const CUSTOMER_OPTIONS = [
  { value: "AURA LOGISTICS CB", label: "AURA LOGISTICS CB", code: "SKT-AL-01" },
  { value: "MASTER LEATHER CB", label: "MASTER LEATHER CB", code: "SKT-ML-02" },
  { value: "STANDARD CARGO CB", label: "STANDARD CARGO CB", code: "SKT-SC-01" },
  { value: "NA LOGISTICS CB", label: "NA LOGISTICS CB", code: "SKT-NA-62" },
  { value: "XS COURIER CB", label: "XS COURIER CB", code: "SKT-XS-16" },
  { value: "AYAAN INTERNATIONAL", label: "AYAAN INTERNATIONAL", code: "SKT-AY-02" },
  { value: "SWIFTSHIP COURIER CB", label: "SWIFTSHIP COURIER CB", code: "SKT-SS-58" },
  { value: "KUNHAR LOGISTIC CB", label: "KUNHAR LOGISTIC CB", code: "SKT-KL-09" },
];

export const TYPE_OPTIONS = [
  { value: "CREDIT NOTE", label: "CREDIT NOTE" },
  { value: "DEBIT NOTE", label: "DEBIT NOTE" },
];

export const NOTE_TYPE_OPTIONS = [
  { value: "GENERAL", label: "GENERAL" },
  { value: "AGAINST", label: "AGAINST" },
];

export const AGAINST_OPTIONS = [
  { value: "INVOICE", label: "INVOICE" },
  { value: "AWB", label: "AWB" },
];

export const REASON_OPTIONS = [
  { value: "Rate Difference / Overbilling", label: "Rate Difference / Overbilling" },
  { value: "Weight Discrepancy (Volumetric Re-weight)", label: "Weight Discrepancy (Volumetric Re-weight)" },
  { value: "Fuel Surcharge Rebate / Adjustment", label: "Fuel Surcharge Rebate / Adjustment" },
  { value: "Service Delay / SLA Guarantee Compensation", label: "Service Delay / SLA Guarantee Compensation" },
  { value: "Damaged Package / Cargo Claim", label: "Damaged Package / Cargo Claim" },
  { value: "Customs Duty & Clearance Adjustment", label: "Customs Duty & Clearance Adjustment" },
  { value: "Volume Incentive / Rebate Discount", label: "Volume Incentive / Rebate Discount" },
  { value: "Address Correction / Re-routing Fee", label: "Address Correction / Re-routing Fee" },
  { value: "Remote Area / ODA Surcharge", label: "Remote Area / ODA Surcharge" },
  { value: "General Account Adjustment", label: "General Account Adjustment" },
];

export const VAT_TYPE_OPTIONS = [
  { value: "", label: "SELECT...", taxRate: 0 },
  { value: "STANDARD_18", label: "STANDARD (18%)", taxRate: 18 },
  { value: "STANDARD_5", label: "STANDARD (5%)", taxRate: 5 },
  { value: "ZERO_RATED", label: "ZERO RATED (0%)", taxRate: 0 },
  { value: "EXEMPT", label: "EXEMPT (0%)", taxRate: 0 },
  { value: "OUT_OF_SCOPE", label: "OUT OF SCOPE", taxRate: 0 },
];

export const createDefaultLineItem = (id?: string): CreditDebitLineItem => ({
  id: id || `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  description: "",
  customerRefNo: "",
  awbNo: "",
  hsCode: "",
  invoiceNo: "",
  invoiceDate: "",
  chargWeight: "",
  newChgWeight: "",
  destCode: "",
  rate: "",
  fscPercent: "",
  fsc: "",
  vatType: "",
  taxPercent: "",
  total: "",
  remark: "",
});

