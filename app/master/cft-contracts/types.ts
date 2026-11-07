export interface CftContractEntry {
  id: string;
  srNo?: number;
  billingType: string;
  customer: string;
  service: string;
  vendor: string;
  product: string;
  effectiveFrom: string;
  effectiveTo: string;
  cftValue: string;
  cftMultiplier: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: string;
}

export const BILLING_TYPE_OPTIONS = [
  { value: "BOTH", label: "BOTH" },
  { value: "SALE", label: "SALE" },
  { value: "PURCHASE", label: "PURCHASE" },
];

export const CUSTOMER_OPTIONS = [
  { value: "", label: "SEARCH HERE..." },
  { value: "SKT-AL-01", label: "SKT-AL-01 - AMERICAN XPRESS" },
  { value: "FINE-TRADERS", label: "FINE-TRADERS - FINE TRADERS LLC" },
  { value: "APEX-02", label: "APEX-02 - APEX LOGISTICS" },
  { value: "METRO-EX", label: "METRO-EX - METRO EXPRESS" },
  { value: "GLOBAL-CARGO", label: "GLOBAL-CARGO - GLOBAL FREIGHT" },
];

export const SERVICE_OPTIONS = [
  { value: "", label: "SEARCH HERE..." },
  { value: "FEDEX", label: "FEDEX" },
  { value: "DHL", label: "DHL" },
  { value: "UPS", label: "UPS" },
  { value: "INXPRESS", label: "INXPRESS" },
  { value: "NORSK", label: "NORSK" },
  { value: "DSV", label: "DSV" },
  { value: "AIR CARGO", label: "AIR CARGO" },
];

export const VENDOR_OPTIONS = [
  { value: "", label: "SEARCH HERE..." },
  { value: "AMERICAN XPRESS COURIER - AXC INC", label: "AMERICAN XPRESS COURIER - AXC INC" },
  { value: "DHL EXPRESS VENDOR", label: "DHL EXPRESS VENDOR" },
  { value: "FEDEX LOGISTICS VENDOR", label: "FEDEX LOGISTICS VENDOR" },
  { value: "UPS SUPPLY CHAIN", label: "UPS SUPPLY CHAIN" },
];

export const PRODUCT_OPTIONS = [
  { value: "", label: "SEARCH HERE..." },
  { value: "NONDOX", label: "NONDOX" },
  { value: "DOX", label: "DOX" },
  { value: "CARGO", label: "CARGO" },
  { value: "PARCEL", label: "PARCEL" },
  { value: "COMMERCIAL", label: "COMMERCIAL" },
];

export const initialCftContractData: CftContractEntry[] = [
  {
    id: "CFT-2026-001",
    srNo: 1,
    billingType: "BOTH",
    customer: "SKT-AL-01",
    service: "FEDEX",
    vendor: "AMERICAN XPRESS COURIER - AXC INC",
    product: "NONDOX",
    effectiveFrom: "2026-01-01",
    effectiveTo: "2026-12-31",
    cftValue: "1728",
    cftMultiplier: "1.00",
    status: "ACTIVE",
    createdAt: "01/01/2026, 10:30 AM",
  },
  {
    id: "CFT-2026-002",
    srNo: 2,
    billingType: "SALE",
    customer: "FINE-TRADERS",
    service: "DHL",
    vendor: "DHL EXPRESS VENDOR",
    product: "DOX",
    effectiveFrom: "2026-02-15",
    effectiveTo: "2026-11-30",
    cftValue: "1728",
    cftMultiplier: "5000",
    status: "ACTIVE",
    createdAt: "15/02/2026, 02:15 PM",
  },
  {
    id: "CFT-2026-003",
    srNo: 3,
    billingType: "PURCHASE",
    customer: "APEX-02",
    service: "UPS",
    vendor: "UPS SUPPLY CHAIN",
    product: "CARGO",
    effectiveFrom: "2026-03-01",
    effectiveTo: "2026-12-31",
    cftValue: "2000",
    cftMultiplier: "4000",
    status: "INACTIVE",
    createdAt: "01/03/2026, 11:45 AM",
  },
];

export const CftContractHeadings = [
  { label: "SR.NO.", key: "srNo" },
  { label: "SELECT CONTRACT", key: "selectContract" },
  { label: "BILLING TYPE", key: "billingType", sortable: true },
  { label: "CUSTOMER", key: "customer", sortable: true },
  { label: "SERVICE", key: "service", sortable: true },
  { label: "VENDOR", key: "vendor", sortable: true },
  { label: "PRODUCT", key: "product", sortable: true },
  { label: "EFFECTIVE FROM", key: "effectiveFrom", sortable: true },
  { label: "EFFECTIVE TO", key: "effectiveTo", sortable: true },
  { label: "CFT VALUE", key: "cftValue", sortable: true },
  { label: "CFT MULTIPLIER", key: "cftMultiplier", sortable: true },
  { label: "STATUS", key: "status", sortable: true },
  { label: "ACTION", key: "action" },
];

export const cftContractFilterGroups = [
  {
    group: "Billing Type",
    options: [
      { label: "BOTH", value: "BOTH" },
      { label: "SALE", value: "SALE" },
      { label: "PURCHASE", value: "PURCHASE" },
    ],
  },
  {
    group: "Status",
    options: [
      { label: "ACTIVE", value: "ACTIVE" },
      { label: "INACTIVE", value: "INACTIVE" },
    ],
  },
  {
    group: "Service",
    options: [
      { label: "FEDEX", value: "FEDEX" },
      { label: "DHL", value: "DHL" },
      { label: "UPS", value: "UPS" },
    ],
  },
];
