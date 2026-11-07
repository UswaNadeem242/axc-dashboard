export interface AwbStatusEntry {
  id: string;
  name: string;
  code: string;
  status: "ACTIVE" | "INACTIVE";
  addInInvoice: boolean;
  dontAddInInvoice: boolean;
  dontCalculateCharge: boolean;
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

export const AwbStatusHeadings = [
  { label: "SR.NO.", key: "srNo" },
  { label: "SELECT STATUS", key: "selectStatus" },
  { label: "NAME", key: "name", sortable: true },
  { label: "CODE", key: "code", sortable: true },
  { label: "INVOICE RULES", key: "invoiceRules", sortable: false },
  { label: "STATUS", key: "status", sortable: true },
  { label: "ACTION", key: "action" },
];

export const awbStatusFilterGroups: FilterGroup[] = [
  {
    group: "Status",
    options: [
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" },
    ],
  },
  {
    group: "Invoice Rules",
    options: [
      { label: "Add In Invoice", value: "addInInvoice" },
      { label: "Don't Add In Invoice", value: "dontAddInInvoice" },
      { label: "Don't Calculate Charge", value: "dontCalculateCharge" },
    ],
  },
];

export const initialAwbStatusData: AwbStatusEntry[] = [
  {
    id: "awb_status_1",
    name: "DELIVERED",
    code: "DLV",
    status: "ACTIVE",
    addInInvoice: true,
    dontAddInInvoice: false,
    dontCalculateCharge: false,
    createdAt: "2026-07-20",
  },
  {
    id: "awb_status_2",
    name: "OUT FOR DELIVERY",
    code: "OFD",
    status: "ACTIVE",
    addInInvoice: true,
    dontAddInInvoice: false,
    dontCalculateCharge: false,
    createdAt: "2026-07-21",
  },
  {
    id: "awb_status_3",
    name: "IN TRANSIT",
    code: "ITR",
    status: "ACTIVE",
    addInInvoice: true,
    dontAddInInvoice: false,
    dontCalculateCharge: false,
    createdAt: "2026-07-22",
  },
  {
    id: "awb_status_4",
    name: "RETURN TO ORIGIN (RTO)",
    code: "RTO",
    status: "ACTIVE",
    addInInvoice: false,
    dontAddInInvoice: false,
    dontCalculateCharge: true,
    createdAt: "2026-07-23",
  },
  {
    id: "awb_status_5",
    name: "CANCELLED",
    code: "CAN",
    status: "INACTIVE",
    addInInvoice: false,
    dontAddInInvoice: true,
    dontCalculateCharge: true,
    createdAt: "2026-07-24",
  },
  {
    id: "awb_status_6",
    name: "PICKED UP",
    code: "PUD",
    status: "ACTIVE",
    addInInvoice: true,
    dontAddInInvoice: false,
    dontCalculateCharge: false,
    createdAt: "2026-07-25",
  },
];

