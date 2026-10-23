export type BankTransferStatus = "COMPLETED" | "PENDING" | "FAILED";

export interface BankTransferEntry {
  id: string;
  srNo?: number;
  transferNumber: string;
  transferDate: string; // YYYY-MM-DD or DD/MM/YYYY
  company: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  particulars: string;
  fileName?: string;
  status: BankTransferStatus;
  referenceNumber?: string;
  createdBy: string;
  createdDate: string;
}

export interface BankTransferFormData {
  transferNumber: string;
  company: string;
  accountNumber: string; // from account
  amount: string | number;
  sendToAccount: string; // to account
  date: string;
  particulars: string;
  fileName?: string;
}

export const COMPANY_OPTIONS = [
  { value: "American Xpress Courier AXC Inc", label: "American Xpress Courier AXC Inc" },
  { value: "AXC Courier logistics - AXC Courier Logistics", label: "AXC Courier logistics - AXC Courier Logistics" },
];

export const ACCOUNT_DROPDOWN_OPTIONS = [
  { value: "BANK (BANK)", label: "BANK (BANK)" },
  { value: "CASH (CASH)", label: "CASH (CASH)" },
];

export const BANK_ACCOUNT_OPTIONS = ACCOUNT_DROPDOWN_OPTIONS;

export const SEND_TO_ACCOUNT_OPTIONS = ACCOUNT_DROPDOWN_OPTIONS;

export const BANK_TRANSFER_STATUS_OPTIONS: { value: BankTransferStatus; label: string }[] = [
  { value: "COMPLETED", label: "Completed" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
];

export const BankTransferHeading = [
  { label: "SR.NO.", key: "srNo" },
  { label: "SELECT", key: "selectTransfer" },
  { label: "TRANSFER NO", key: "transferNumber", sortable: true, truncate: false },
  { label: "DATE", key: "transferDate", sortable: true },
  { label: "COMPANY", key: "company", sortable: true },
  { label: "FROM ACCOUNT", key: "fromAccount", sortable: true, truncate: false },
  { label: "SEND TO ACCOUNT", key: "toAccount", sortable: true, truncate: false },
  { label: "AMOUNT", key: "amount", sortable: true, className: "font-bold text-axc-navy" },
  { label: "PARTICULARS", key: "particulars", sortable: true },
  { label: "STATUS", key: "status", sortable: true },
  { label: "ACTION", key: "action" },
];

export const PARTICULARS_FILTER_OPTIONS = [
  { label: "Liquidity Transfer", value: "Liquidity Transfer" },
  { label: "Customs Duty Clearance", value: "Customs Duty" },
  { label: "Cash Deposit", value: "Cash Deposit" },
  { label: "Reserve Allocation", value: "Reserve Allocation" },
  { label: "Ground Handling", value: "Ground Handling" },
];

export const ACCOUNT_NUMBER_FILTER_OPTIONS = [
  { label: "BANK (BANK)", value: "BANK (BANK)" },
  { label: "CASH (CASH)", value: "CASH (CASH)" },
];

export const DATE_RANGE_FILTER_OPTIONS = [
  { label: "Today", value: "Today" },
  { label: "Yesterday", value: "Yesterday" },
  { label: "Last 7 days", value: "Last 7 days" },
  { label: "Custom", value: "Custom" },
];

export const CALENDAR_YEAR_FILTER_OPTIONS = [
  { label: "2026", value: "2026" },
  { label: "2025", value: "2025" },
  { label: "2024", value: "2024" },
  { label: "2023", value: "2023" },
  { label: "Custom Year", value: "Custom Year" },
];

export const LINK_ACCOUNT_FILTER_OPTIONS = [
  { label: "BANK (BANK)", value: "Link: BANK (BANK)" },
  { label: "CASH (CASH)", value: "Link: CASH (CASH)" },
];

export const bankTransferFilterGroups = [
  {
    group: "Account Number",
    options: ACCOUNT_NUMBER_FILTER_OPTIONS,
  },
  {
    group: "Date Range",
    options: DATE_RANGE_FILTER_OPTIONS,
  },
  {
    group: "Calendar Year",
    options: CALENDAR_YEAR_FILTER_OPTIONS,
  },
  {
    group: "Link Account",
    options: LINK_ACCOUNT_FILTER_OPTIONS,
  },
];

export const initialBankTransferData: BankTransferEntry[] = [
  {
    id: "trf-1",
    srNo: 1,
    transferNumber: "TRF-2026-001",
    transferDate: "20/10/2026",
    company: "American Xpress Courier AXC Inc",
    fromAccount: "BANK (BANK)",
    toAccount: "BANK (BANK)",
    amount: 150000,
    particulars: "Inter-bank internal liquidity transfer for weekly salary dispersal",
    status: "COMPLETED",
    referenceNumber: "IBTR-881203",
    createdBy: "FINANCE 1",
    createdDate: "20/10/2026 10:15 AM",
  },
  {
    id: "trf-2",
    srNo: 2,
    transferNumber: "TRF-2026-002",
    transferDate: "18/10/2026",
    company: "AXC Courier logistics - AXC Courier Logistics",
    fromAccount: "BANK (BANK)",
    toAccount: "BANK (BANK)",
    amount: 85000,
    particulars: "Transfer for vendor customs duty clearance",
    status: "COMPLETED",
    referenceNumber: "UTR-994102",
    createdBy: "ACCOUNTS 2",
    createdDate: "18/10/2026 02:40 PM",
  },
  {
    id: "trf-3",
    srNo: 3,
    transferNumber: "TRF-2026-003",
    transferDate: "17/10/2026",
    company: "American Xpress Courier AXC Inc",
    fromAccount: "CASH (CASH)",
    toAccount: "BANK (BANK)",
    amount: 45000,
    particulars: "Daily counter cash deposit into main operating account",
    status: "COMPLETED",
    referenceNumber: "DEP-441209",
    createdBy: "CASHIER 1",
    createdDate: "17/10/2026 05:30 PM",
  },
  {
    id: "trf-4",
    srNo: 4,
    transferNumber: "TRF-2026-004",
    transferDate: "15/10/2026",
    company: "American Xpress Courier AXC Inc",
    fromAccount: "BANK (BANK)",
    toAccount: "CASH (CASH)",
    amount: 120000,
    particulars: "Fund reserve allocation for fuel credit settlement",
    status: "PENDING",
    referenceNumber: "RTGS-002149",
    createdBy: "ACCOUNTS 5",
    createdDate: "15/10/2026 11:20 AM",
  },
  {
    id: "trf-5",
    srNo: 5,
    transferNumber: "TRF-2026-005",
    transferDate: "12/10/2026",
    company: "AXC Courier logistics - AXC Courier Logistics",
    fromAccount: "BANK (BANK)",
    toAccount: "BANK (BANK)",
    amount: 30000,
    particulars: "Emergency airport ground handling charges transfer",
    status: "FAILED",
    referenceNumber: "REV-991204",
    createdBy: "OPERATIONS 3",
    createdDate: "12/10/2026 04:10 PM",
  },
];
