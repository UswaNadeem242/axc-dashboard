export interface CurrencyEntry {
  id: string;
  srNo: number;
  name: string;
  code: string;
  symbol?: string;
  exchangeRate?: number | string;
  fractionalUnit: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

export const initialCurrencyData: CurrencyEntry[] = [
  {
    id: "CURR-001",
    srNo: 1,
    code: "PKR",
    name: "Rupee",
    fractionalUnit: "Paisa",
    status: "ACTIVE",
    createdAt: "21/10/2023 10:18 PM",
  },
  {
    id: "CURR-002",
    srNo: 2,
    code: "BDT",
    name: "Taka",
    fractionalUnit: "Poisha",
    status: "INACTIVE",
    createdAt: "21/10/2023 10:18 PM",
  },
  {
    id: "CURR-003",
    srNo: 3,
    code: "ZMW",
    name: "Kwacha",
    fractionalUnit: "Ngwee",
    status: "INACTIVE",
    createdAt: "21/10/2023 10:18 PM",
  },
  {
    id: "CURR-004",
    srNo: 4,
    code: "BWP",
    name: "Pula",
    fractionalUnit: "Thebe",
    status: "ACTIVE",
    createdAt: "21/10/2023 10:18 PM",
  },
  {
    id: "CURR-005",
    srNo: 5,
    code: "BAM",
    name: "Mark",
    fractionalUnit: "Fening",
    status: "ACTIVE",
    createdAt: "21/10/2023 10:18 PM",
  },
  {
    id: "CURR-006",
    srNo: 6,
    code: "USD",
    name: "US Dollar",
    fractionalUnit: "Cent",
    status: "ACTIVE",
    createdAt: "22/10/2023 09:30 AM",
  },
  {
    id: "CURR-007",
    srNo: 7,
    code: "EUR",
    name: "Euro",
    fractionalUnit: "Cent",
    status: "ACTIVE",
    createdAt: "22/10/2023 11:15 AM",
  },
  {
    id: "CURR-008",
    srNo: 8,
    code: "GBP",
    name: "British Pound",
    fractionalUnit: "Penny",
    status: "ACTIVE",
    createdAt: "23/10/2023 02:45 PM",
  },
  {
    id: "CURR-009",
    srNo: 9,
    code: "AED",
    name: "UAE Dirham",
    fractionalUnit: "Fils",
    status: "ACTIVE",
    createdAt: "24/10/2023 04:20 PM",
  },
  {
    id: "CURR-010",
    srNo: 10,
    code: "SAR",
    name: "Saudi Riyal",
    fractionalUnit: "Halala",
    status: "ACTIVE",
    createdAt: "25/10/2023 01:10 PM",
  },
];

export const CurrencyHeadings = [
  { label: "Sr. No", key: "srNo", sortable: true },
  { label: "Code", key: "code", sortable: true },
  { label: "Name", key: "name", sortable: true },
  { label: "Fractional Unit", key: "fractionalUnit", sortable: true },
  { label: "Status", key: "status", sortable: true },
  { label: "Created Date", key: "createdAt", sortable: true },
  { label: "Action", key: "action", sortable: false, align: "center" as const },
];

export const currencyFilterGroups = [
  {
    group: "Status",
    options: [
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" },
    ],
  },
  {
    group: "Common Currencies",
    options: [
      { label: "PKR", value: "PKR" },
      { label: "USD", value: "USD" },
      { label: "EUR", value: "EUR" },
      { label: "GBP", value: "GBP" },
      { label: "AED", value: "AED" },
    ],
  },
];
