export interface AwbLessInvoiceEntry {
  id: string;
  name: string;
  sac?: string;
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

export const AwbLessInvoiceHeadings = [
  { label: "SR.NO.", key: "srNo" },
  { label: "SELECT ITEM", key: "selectItem" },
  { label: "ITEM NAME", key: "name", sortable: true },
  { label: "SAC CODE", key: "sac", sortable: true },
  { label: "STATUS", key: "status", sortable: true },
  { label: "ACTION", key: "action" },
];

export const awbLessInvoiceFilterGroups: FilterGroup[] = [
  {
    group: "Status",
    options: [
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" },
    ],
  },
];

export const initialAwbLessInvoiceData: AwbLessInvoiceEntry[] = [
  {
    id: "awb_less_1",
    name: "FREIGHT CHARGES",
    sac: "996511",
    status: "ACTIVE",
    createdAt: "2026-07-20",
  },
  {
    id: "awb_less_2",
    name: "DOCUMENTATION FEE",
    sac: "996512",
    status: "ACTIVE",
    createdAt: "2026-07-21",
  },
  {
    id: "awb_less_3",
    name: "CUSTOMS CLEARANCE CHARGE",
    sac: "996519",
    status: "ACTIVE",
    createdAt: "2026-07-22",
  },
  {
    id: "awb_less_4",
    name: "PACKAGING & HANDLING",
    sac: "996513",
    status: "ACTIVE",
    createdAt: "2026-07-23",
  },
  {
    id: "awb_less_5",
    name: "STORAGE & WAREHOUSING CHARGES",
    sac: "996729",
    status: "ACTIVE",
    createdAt: "2026-07-24",
  },
];

