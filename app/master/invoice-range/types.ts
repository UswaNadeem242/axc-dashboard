export interface InvoiceRangeEntry {
  id: string;
  name: string;
  code: string;
  prefix?: string;
  startNumber?: string;
  endNumber?: string;
  currentNumber?: string;
  suffix?: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  group: string;
  options: FilterOption[];
}

export const InvoiceRangeHeadings = [
  { label: "SR.NO.", key: "srNo" },
  { label: "SELECT RANGE", key: "selectRange" },
  { label: "NAME", key: "name", sortable: true },
  { label: "CODE", key: "code", sortable: true },
  { label: "PREFIX", key: "prefix", sortable: true },
  { label: "START NUMBER", key: "startNumber", sortable: true },
  { label: "END NUMBER", key: "endNumber", sortable: true },
  { label: "SUFFIX", key: "suffix", sortable: true },
  { label: "STATUS", key: "status", sortable: true },
  { label: "ACTION", key: "action" },
];

export const invoiceRangeFilterGroups: FilterGroup[] = [
  {
    group: "Status",
    options: [
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" },
    ],
  },
];

export const initialInvoiceRangeData: InvoiceRangeEntry[] = [
  {
    id: "inv_range_1",
    name: "GENERAL INVOICE RANGE 2026",
    code: "INV-GEN-26",
    prefix: "INV-",
    startNumber: "10001",
    endNumber: "99999",
    suffix: "/2026",
    status: "ACTIVE",
    createdAt: "2026-07-20",
  },
  {
    id: "inv_range_2",
    name: "RETAIL SALES INVOICE RANGE",
    code: "INV-RET-26",
    prefix: "RET-",
    startNumber: "50001",
    endNumber: "80000",
    suffix: "-AXC",
    status: "ACTIVE",
    createdAt: "2026-07-21",
  },
  {
    id: "inv_range_3",
    name: "EXPORT INVOICE SERIES",
    code: "INV-EXP-26",
    prefix: "EXP-",
    startNumber: "1001",
    endNumber: "50000",
    suffix: "-DXB",
    status: "ACTIVE",
    createdAt: "2026-07-22",
  },
  {
    id: "inv_range_4",
    name: "CORPORATE CONTRACT INVOICES",
    code: "INV-CORP-26",
    prefix: "CRP-",
    startNumber: "200001",
    endNumber: "300000",
    suffix: "/UAE",
    status: "ACTIVE",
    createdAt: "2026-07-23",
  },
];

