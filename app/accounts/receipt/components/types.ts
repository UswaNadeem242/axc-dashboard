export type PaymentMode =
  | "CASH"
  | "CHEQUE"
  | "ONLINE"
  | "CREDIT"
  | "FOC"
  | "COD"
  | "TO_PAY"
  | "CARD"
  | "PREPAID"
  | "APPLE PAY"
  | "BANK_TRANSFER";
export type ReceiptStatus = "CLEARED" | "PENDING" | "BOUNCED" | "CANCELLED";

export interface ReceiptEntry {
  id: string;
  srNo?: number;
  receiptNumber: string;
  receiptDate: string;
  customerName: string;
  customerCode: string;
  paymentMode: PaymentMode;
  referenceNumber: string; // Cheque No, Transaction ID, UTR No
  bankName: string;
  againstDocType: "INVOICE" | "NOTE" | "ON_ACCOUNT";
  againstDocNumber: string; // e.g. INV-2026-081, CN-2026-001
  receivedAmount: number;
  deductionAmount: number; // TDS / Bank charge / WHT
  netAmount: number;
  currency: string;
  status: ReceiptStatus;
  createdBy: string;
  createdDate: string;
  remarks?: string;
  chequeDate?: string;
  company?: string;
  accountNumber?: string;
  particulars?: string;
  fileName?: string;
  includeInFutureInvoices?: boolean;
  includeInFutureDebitNote?: boolean;
  accountType?: string;
  gatewayType?: string;
  hub?: string;
  calendarYear?: string;
  customerYear?: string;
}

export interface ReceiptFormData {
  receiptNumber: string;
  receiptDate: string;
  customerName: string;
  customerCode: string;
  paymentMode: PaymentMode;
  referenceNumber: string;
  bankName: string;
  againstDocType: "INVOICE" | "NOTE" | "ON_ACCOUNT";
  againstDocNumber: string;
  receivedAmount: string | number;
  deductionAmount: string | number;
  netAmount: string | number;
  currency: string;
  status: ReceiptStatus;
  remarks: string;
  chequeDate?: string;
  company?: string;
  accountNumber?: string;
  particulars?: string;
  fileName?: string;
  includeInFutureInvoices?: boolean;
  includeInFutureDebitNote?: boolean;
  accountType?: string;
  gatewayType?: string;
  hub?: string;
  calendarYear?: string;
  customerYear?: string;
}

export const COMPANY_OPTIONS = [

  { value: "American Xpress Courier AXC Inc", label: "American Xpress Courier AXC Inc" },
  { value: "AXC Courier logistics - AXC Courier Logistics", label: "AXC Courier logistics - AXC Courier Logistics" },
];

export const ACCOUNT_OPTIONS = [
  { value: "Bank", label: "Bank" },
  { value: "Cash", label: "Cash" },
 
];

export const CUSTOMER_OPTIONS = [
  { value: "AURA LOGISTICS CB", code: "SKT-AL-01" },
  { value: "MASTER LEATHER CB", code: "SKT-ML-02" },
  { value: "STANDARD CARGO CB", code: "SKT-SC-01" },
  { value: "NA LOGISTICS CB", code: "SKT-NA-62" },
  { value: "XS COURIER CB", code: "SKT-XS-16" },
  { value: "AYAAN INTERNATIONAL", code: "SKT-AY-02" },
  { value: "CAPITAL COURIER CB", code: "SKT-CC-14" },
  { value: "SWIFTSHIP COURIER CB", code: "SKT-SS-58" },
  { value: "KUNHAR LOGISTIC CB", code: "SKT-KL-09" },
];

export const BANK_OPTIONS = [
  { value: "Meezan Bank - A/C 010239102", label: "Meezan Bank (Islamic) - 010239102" },
  { value: "Habib Bank Limited (HBL) - A/C 9940129", label: "HBL Corporate - 9940129" },
  { value: "Standard Chartered - A/C 8820194", label: "Standard Chartered Bank - 8820194" },
  { value: "Bank Alfalah - A/C 5510294", label: "Bank Alfalah - 5510294" },
  { value: "Cash in Hand (Counter)", label: "Cash in Hand (Counter)" },
];

export const PAYMENT_MODE_OPTIONS: { value: PaymentMode; label: string }[] = [
  { value: "CASH", label: "CASH" },
  { value: "CHEQUE", label: "CHEQUE" },
  { value: "ONLINE", label: "ONLINE" },
  { value: "CREDIT", label: "CREDIT" },
  { value: "FOC", label: "FOC" },
  { value: "COD", label: "COD" },
  { value: "TO_PAY", label: "TO_PAY" },
  { value: "CARD", label: "CARD" },
  { value: "PREPAID", label: "PREPAID" },
  { value: "APPLE PAY", label: "APPLE PAY" },
];

export const RECEIPT_STATUS_OPTIONS: { value: ReceiptStatus; label: string }[] = [
  { value: "CLEARED", label: "Cleared" },
  { value: "PENDING", label: "Pending" },
  { value: "BOUNCED", label: "Bounced" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const AGAINST_DOC_TYPE_OPTIONS = [
  { value: "INVOICE", label: "Against Invoice" },
  { value: "NOTE", label: "Against Credit / Debit Note" },
  { value: "ON_ACCOUNT", label: "On Account / Advance" },
];

export const ReceiptHeading = [
  { label: "SR.NO.", key: "srNo" },
  { label: "SELECT", key: "selectReceipt" },
  { label: "RECEIPT NO", key: "receiptNumber", sortable: true, truncate: false },
  { label: "RECEIPT DATE", key: "receiptDate", sortable: true },
  { label: "CUSTOMER CODE", key: "customerCode", sortable: true, truncate: false },
  { label: "CUSTOMER NAME", key: "customerName", sortable: true, truncate: false },
  { label: "PAYMENT MODE", key: "paymentMode", sortable: true, truncate: false },
  { label: "REF / TXN NO", key: "referenceNumber", sortable: true, truncate: false },
  { label: "DEPOSITED BANK", key: "bankName", sortable: true, truncate: false },
  { label: "AGAINST DOC", key: "againstDocNumber", sortable: true, truncate: false },
  { label: "RECEIVED AMOUNT", key: "receivedAmount", sortable: true, className: "font-semibold" },
  { label: "NET AMOUNT", key: "netAmount", sortable: true, className: "font-bold text-axc-navy" },
  { label: "STATUS", key: "status", sortable: true },
  { label: "CREATED BY", key: "createdBy", sortable: true },
  { label: "ACTION", key: "action" },
];

export const GATEWAY_TYPE_OPTIONS = [
  { label: "Online Gateway", value: "Online Gateway" },
  { label: "Bank Wire / UTR", value: "Bank Wire" },
  { label: "POS Terminal", value: "POS Terminal" },
  { label: "Counter Cash", value: "Counter Cash" },
  { label: "Cheque Clearing", value: "Cheque Clearing" },
];

export const HUB_OPTIONS = [
  { label: "MUMBAI", value: "MUMBAI" },
  { label: "DELHI", value: "DELHI" },
  { label: "KARACHI", value: "KARACHI" },
  { label: "LAHORE", value: "LAHORE" },
  { label: "SIALKOT", value: "SIALKOT" },
  { label: "ISLAMABAD", value: "ISLAMABAD" },
];

export const CALENDAR_YEAR_OPTIONS = [
  { label: "2026", value: "2026" },
  { label: "2025", value: "2025" },
  { label: "2024", value: "2024" },
  { label: "2023", value: "2023" },
  { label: "Custom Year", value: "Custom Year" },
];

export const ACCOUNT_TYPE_OPTIONS = [
  { label: "SAVING A/C", value: "SAVING A/C" },
  { label: "CURRENT A/C", value: "CURRENT A/C" },
  { label: "OD A/C", value: "OD A/C" },
  { label: "CC A/C", value: "CC A/C" },
  { label: "CASH A/C", value: "CASH A/C" },
];

export const receiptFilterGroups = [
  {
    group: "Payment Type",
    options: PAYMENT_MODE_OPTIONS,
  },
  {
    group: "Gateway Type",
    options: GATEWAY_TYPE_OPTIONS,
  },
  {
    group: "Account Type",
    options: ACCOUNT_TYPE_OPTIONS,
  },
  {
    group: "Hub",
    options: HUB_OPTIONS,
  },
  {
    group: "Payment Date",
    options: [
      { label: "Today", value: "today" },
      { label: "Yesterday", value: "yesterday" },
      { label: "Last 7 Days", value: "last 7 days" },
      { label: "This Month", value: "this_month" },
      { label: "Custom", value: "Custom" },
    ],
  },
  {
    group: "Calendar Year",
    options: CALENDAR_YEAR_OPTIONS,
  },
];

export const initialReceiptData: ReceiptEntry[] = [
  {
    id: "rcp-1",
    srNo: 1,
    receiptNumber: "RCP-2026-001",
    receiptDate: "15/10/2026",
    customerName: "AURA LOGISTICS CB",
    customerCode: "SKT-AL-01",
    paymentMode: "ONLINE",
    referenceNumber: "UTR-8821903",
    bankName: "Meezan Bank - A/C 010239102",
    againstDocType: "INVOICE",
    againstDocNumber: "AURA LOGISTICS CB RUN 07",
    receivedAmount: 45000,
    deductionAmount: 500,
    netAmount: 44500,
    currency: "PKR",
    status: "CLEARED",
    createdBy: "ACCOUNTS 5",
    createdDate: "15/10/2026 11:20 AM",
    particulars: "Freight settlement for October shipments",
    accountType: "CURRENT A/C",
    gatewayType: "Online Gateway",
    hub: "SIALKOT",
    calendarYear: "2026",
    customerYear: "2026",
    remarks: "Received full payment for Run 07 settlement via online wire.",
  },
  {
    id: "rcp-2",
    srNo: 2,
    receiptNumber: "RCP-2026-002",
    receiptDate: "14/10/2026",
    customerName: "MASTER LEATHER CB",
    customerCode: "SKT-ML-02",
    paymentMode: "CHEQUE",
    referenceNumber: "CHQ-991204",
    chequeDate: "14/10/2026",
    bankName: "Habib Bank Limited (HBL) - A/C 9940129",
    againstDocType: "INVOICE",
    againstDocNumber: "INV-2026-081",
    receivedAmount: 28500,
    deductionAmount: 0,
    netAmount: 28500,
    currency: "PKR",
    status: "PENDING",
    createdBy: "ACCOUNTS 4",
    createdDate: "14/10/2026 03:15 PM",
    particulars: "Crossed cheque against invoice INV-2026-081",
    accountType: "SAVING A/C",
    gatewayType: "Cheque Clearing",
    hub: "SIALKOT",
    calendarYear: "2026",
    customerYear: "2026",
    remarks: "Crossed cheque deposited into HBL Sialkot branch, awaiting clearing.",
  },
  {
    id: "rcp-3",
    srNo: 3,
    receiptNumber: "RCP-2026-003",
    receiptDate: "13/10/2026",
    customerName: "STANDARD CARGO CB",
    customerCode: "SKT-SC-01",
    paymentMode: "CASH",
    referenceNumber: "CSH-COUNTER-09",
    bankName: "Cash in Hand (Counter)",
    againstDocType: "ON_ACCOUNT",
    againstDocNumber: "ADVANCE DEPOSIT",
    receivedAmount: 12000,
    deductionAmount: 0,
    netAmount: 12000,
    currency: "PKR",
    status: "CLEARED",
    createdBy: "ACCOUNTS 2",
    createdDate: "13/10/2026 04:40 PM",
    particulars: "Counter cash advance deposit",
    accountType: "CASH A/C",
    gatewayType: "Counter Cash",
    hub: "LAHORE",
    calendarYear: "2026",
    customerYear: "2026",
    remarks: "Counter cash collection received for upcoming export booking.",
  },
  {
    id: "rcp-4",
    srNo: 4,
    receiptNumber: "RCP-2026-004",
    receiptDate: "12/10/2026",
    customerName: "NA LOGISTICS CB",
    customerCode: "SKT-NA-62",
    paymentMode: "ONLINE",
    referenceNumber: "TXN-SCB-4410",
    bankName: "Standard Chartered - A/C 8820194",
    againstDocType: "INVOICE",
    againstDocNumber: "NA LOGISTICS CB RUN 62",
    receivedAmount: 150000,
    deductionAmount: 1500,
    netAmount: 148500,
    currency: "PKR",
    status: "CLEARED",
    createdBy: "ACCOUNTS 5",
    createdDate: "12/10/2026 01:10 PM",
    particulars: "Inter-bank corporate wire transfer",
    accountType: "CURRENT A/C",
    gatewayType: "Bank Wire",
    hub: "KARACHI",
    calendarYear: "2026",
    customerYear: "2026",
    remarks: "WHT 1% deducted as per corporate withholding certificate.",
  },
  {
    id: "rcp-5",
    srNo: 5,
    receiptNumber: "RCP-2026-005",
    receiptDate: "11/10/2026",
    customerName: "XS COURIER CB",
    customerCode: "SKT-XS-16",
    paymentMode: "CHEQUE",
    referenceNumber: "CHQ-441209",
    chequeDate: "10/10/2026",
    bankName: "Bank Alfalah - A/C 5510294",
    againstDocType: "INVOICE",
    againstDocNumber: "INV-2026-092",
    receivedAmount: 35400,
    deductionAmount: 0,
    netAmount: 35400,
    currency: "PKR",
    status: "BOUNCED",
    createdBy: "ACCOUNTS 1",
    createdDate: "11/10/2026 10:25 AM",
    particulars: "Clearing settlement against invoice INV-2026-092",
    accountType: "OD A/C",
    gatewayType: "Cheque Clearing",
    hub: "SIALKOT",
    calendarYear: "2026",
    customerYear: "2026",
    remarks: "Cheque returned by clearing house due to signature mismatch. Re-issue requested.",
  },
  {
    id: "rcp-6",
    srNo: 6,
    receiptNumber: "RCP-2026-006",
    receiptDate: "10/10/2026",
    customerName: "AYAAN INTERNATIONAL",
    customerCode: "SKT-AY-02",
    paymentMode: "CARD",
    referenceNumber: "RAAST-8812904",
    bankName: "Meezan Bank - A/C 010239102",
    againstDocType: "INVOICE",
    againstDocNumber: "AYAAN INTERNATIONAL CB RUN 02",
    receivedAmount: 68000,
    deductionAmount: 0,
    netAmount: 68000,
    currency: "PKR",
    status: "CLEARED",
    createdBy: "ACCOUNTS 3",
    createdDate: "10/10/2026 02:50 PM",
    particulars: "Card swipe on counter POS terminal",
    accountType: "SAVING A/C",
    gatewayType: "POS Terminal",
    hub: "ISLAMABAD",
    calendarYear: "2026",
    customerYear: "2026",
    remarks: "Instant settlement via Raast corporate portal.",
  },
  {
    id: "rcp-7",
    srNo: 7,
    receiptNumber: "RCP-2026-007",
    receiptDate: "09/10/2026",
    customerName: "CAPITAL COURIER CB",
    customerCode: "SKT-CC-14",
    paymentMode: "APPLE PAY",
    referenceNumber: "HBL-TR-99124",
    bankName: "Habib Bank Limited (HBL) - A/C 9940129",
    againstDocType: "INVOICE",
    againstDocNumber: "CAPITAL COURIER CB RUN 14",
    receivedAmount: 22400,
    deductionAmount: 224,
    netAmount: 22176,
    currency: "PKR",
    status: "CLEARED",
    createdBy: "ACCOUNTS 5",
    createdDate: "09/10/2026 11:45 AM",
    particulars: "Apple Pay digital gateway receipt",
    accountType: "CURRENT A/C",
    gatewayType: "Online Gateway",
    hub: "DELHI",
    calendarYear: "2026",
    customerYear: "2026",
    remarks: "Net payment credited after standard banking transfer fee.",
  },
  {
    id: "rcp-8",
    srNo: 8,
    receiptNumber: "RCP-2026-008",
    receiptDate: "08/10/2026",
    customerName: "SWIFTSHIP COURIER CB",
    customerCode: "SKT-SS-58",
    paymentMode: "CHEQUE",
    referenceNumber: "CHQ-882190",
    chequeDate: "08/10/2026",
    bankName: "Meezan Bank - A/C 010239102",
    againstDocType: "NOTE",
    againstDocNumber: "DN-2026-011",
    receivedAmount: 19800,
    deductionAmount: 0,
    netAmount: 19800,
    currency: "PKR",
    status: "PENDING",
    createdBy: "ACCOUNTS 4",
    createdDate: "08/10/2026 04:15 PM",
    particulars: "Debit note settlement DN-2026-011",
    accountType: "CC A/C",
    gatewayType: "Cheque Clearing",
    hub: "MUMBAI",
    calendarYear: "2026",
    customerYear: "2026",
    remarks: "Under clearing in Meezan Bank principal branch.",
  },
  {
    id: "rcp-9",
    srNo: 9,
    receiptNumber: "RCP-2026-009",
    receiptDate: "07/10/2026",
    customerName: "KUNHAR LOGISTIC CB",
    customerCode: "SKT-KL-09",
    paymentMode: "CREDIT",
    referenceNumber: "SCB-WIRE-7719",
    bankName: "Standard Chartered - A/C 8820194",
    againstDocType: "INVOICE",
    againstDocNumber: "KUNHAR LOGISTIC CB RUN 09",
    receivedAmount: 85000,
    deductionAmount: 850,
    netAmount: 84150,
    currency: "PKR",
    status: "CLEARED",
    createdBy: "ACCOUNTS 1",
    createdDate: "07/10/2026 09:30 AM",
    particulars: "Credit account adjustment Run 09",
    accountType: "OD A/C",
    gatewayType: "Bank Wire",
    hub: "LAHORE",
    calendarYear: "2026",
    customerYear: "2026",
    remarks: "Settlement of carton delivery charges.",
  },
  {
    id: "rcp-10",
    srNo: 10,
    receiptNumber: "RCP-2026-010",
    receiptDate: "06/10/2026",
    customerName: "AURA LOGISTICS CB",
    customerCode: "SKT-AL-01",
    paymentMode: "PREPAID",
    referenceNumber: "HBL-WIRE-1002",
    bankName: "Habib Bank Limited (HBL) - A/C 9940129",
    againstDocType: "NOTE",
    againstDocNumber: "CN-2026-001",
    receivedAmount: 30550,
    deductionAmount: 0,
    netAmount: 30550,
    currency: "PKR",
    status: "CLEARED",
    createdBy: "ACCOUNTS 5",
    createdDate: "06/10/2026 05:00 PM",
    particulars: "Prepaid parcel balance recharge",
    accountType: "CASH A/C",
    gatewayType: "Online Gateway",
    hub: "SIALKOT",
    calendarYear: "2026",
    customerYear: "2026",
    remarks: "Final reconciliation balance settled.",
  },
];
