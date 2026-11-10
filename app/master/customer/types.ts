export interface CustomerEntry {
  id: string;
  srNo?: number;
  name: string;
  company: string;
  originHub: string;
  parentCustomer: string;
  originCode: string;
  email: string;
  address: string;
  currency: string;
  paymentType: string;
  creditLimit: string | number;
  userType?: string;
  operationsId?: string;
  billingId?: string;
  status?: string;
  createdAt?: string;
}

export const COMPANY_OPTIONS = [
  { value: "", label: "Select..." },
  {
    value: "AMERICAN XPRESS COURIER - AXC INC",
    label: "AMERICAN XPRESS COURIER - AXC INC",
  },
  {
    value: "AX COURIER LOGISTICS - AX COURIER LOGISTICS",
    label: "AX COURIER LOGISTICS - AX COURIER LOGISTICS",
  },
];

export const ORIGIN_HUB_OPTIONS = [
  { value: "CANADA", label: "CANADA" },
  { value: "DELHI", label: "DELHI" },
  { value: "DHAKA", label: "DHAKA" },
  { value: "DUBAI", label: "DUBAI" },
  { value: "ISLAMABAD", label: "ISLAMABAD" },
  { value: "JFK", label: "JFK" },
  { value: "KATHMANDU", label: "KATHMANDU" },
  { value: "LAHORE", label: "LAHORE" },
  { value: "MUMBAI", label: "MUMBAI" },
  { value: "PESHAWAR", label: "PESHAWAR" },
  { value: "SIALKOT", label: "SIALKOT" },
];

export const PARENT_CUSTOMER_OPTIONS = [
  { value: "None", label: "None" },
  { value: "AMAZON", label: "AMAZON" },
  { value: "FLIPKART", label: "FLIPKART" },
  { value: "GLOBAL-EXP", label: "GLOBAL-EXP" },
  { value: "VELOCITY", label: "VELOCITY" },
  { value: "DHL Global Forwarding", label: "DHL Global Forwarding" },
];

export const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD" },
  { value: "PKR", label: "PKR" },
  { value: "AED", label: "AED" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "INR", label: "INR" },
];

export const USER_TYPE_OPTIONS = [
  { value: "B2B", label: "B2B" },
  { value: "B2C", label: "B2C" },
];

export const PAYMENT_TYPE_OPTIONS = [
  { value: "Credit", label: "Credit" },
  { value: "Cash", label: "Cash" },
  { value: "Prepaid", label: "Prepaid" },
  { value: "COD", label: "COD" },
  { value: "Bank Transfer", label: "Bank Transfer" },
];

export const CustomerHeadings = [
  { label: "SR.NO.", key: "srNo" },
  { label: "Name", key: "name", sortable: true },
  { label: "Company", key: "company", sortable: true },
  { label: "Origin Hub", key: "originHub", sortable: true },
  { label: "Parent Customer", key: "parentCustomer", sortable: true },
  { label: "Origin Code", key: "originCode", sortable: true },
  { label: "Email ID", key: "email" },
  { label: "Address", key: "address" },
  { label: "Currency", key: "currency" },
  { label: "Payment Type", key: "paymentType", sortable: true },
  { label: "Credit Limit", key: "creditLimit", sortable: true },
  { label: "User Type", key: "userType", sortable: true },
  { label: "Action", key: "action" },
];

export const customerFilterGroups = [
  {
    group: "Company",
    options: COMPANY_OPTIONS.filter((c) => c.value !== ""),
  },
  {
    group: "Origin Hub",
    options: ORIGIN_HUB_OPTIONS,
  },
  {
    group: "Payment Type",
    options: PAYMENT_TYPE_OPTIONS,
  },
  {
    group: "Currency",
    options: CURRENCY_OPTIONS,
  },
];

export const initialCustomerData: CustomerEntry[] = [
  {
    id: "CUST-101",
    srNo: 1,
    name: "Amazon Fulfillment Services",
    company: "AMERICAN XPRESS COURIER - AXC INC",
    originHub: "DEL",
    parentCustomer: "AMAZON",
    originCode: "DEL-CUST-101",
    email: "billing@amazon.in",
    address: "Block 4, Ambience Island, NH-8, Gurgaon, Haryana 122002",
    currency: "INR",
    paymentType: "Credit",
    creditLimit: "500000",
    status: "Active",
    createdAt: "2026-08-15",
  },
  {
    id: "CUST-102",
    srNo: 2,
    name: "Velocity Express Logistics",
    company: "AX COURIER LOGISTICS - AX COURIER LOGISTICS",
    originHub: "LHE",
    parentCustomer: "VELOCITY",
    originCode: "LHE-CUST-102",
    email: "operations@velocity.com.pk",
    address: "Plot 12, Main Boulevard, Gulberg III, Lahore, Pakistan",
    currency: "PKR",
    paymentType: "Credit",
    creditLimit: "250000",
    status: "Active",
    createdAt: "2026-08-18",
  },
  {
    id: "CUST-103",
    srNo: 3,
    name: "Global Exports International",
    company: "AX COURIER LOGISTICS - AX COURIER LOGISTICS",
    originHub: "KHI",
    parentCustomer: "GLOBAL-EXP",
    originCode: "KHI-CUST-103",
    email: "accounts@globalexports.pk",
    address: "Suite 402, Trade Tower, I.I. Chundrigar Road, Karachi, Pakistan",
    currency: "USD",
    paymentType: "Prepaid",
    creditLimit: "100000",
    status: "Active",
    createdAt: "2026-08-20",
  },
  {
    id: "CUST-104",
    srNo: 4,
    name: "Al-Futtaim Freight & Trade",
    company: "AMERICAN XPRESS COURIER - AXC INC",
    originHub: "DXB",
    parentCustomer: "None",
    originCode: "DXB-CUST-104",
    email: "cargo@alfuttaim.ae",
    address: "DAFZA Cargo Village Building 3, Dubai Airport Freezone, Dubai, UAE",
    currency: "AED",
    paymentType: "Credit",
    creditLimit: "750000",
    status: "Active",
    createdAt: "2026-08-22",
  },
  {
    id: "CUST-105",
    srNo: 5,
    name: "Flipkart Logistics India Pvt Ltd",
    company: "AMERICAN XPRESS COURIER - AXC INC",
    originHub: "BOM",
    parentCustomer: "FLIPKART",
    originCode: "BOM-CUST-105",
    email: "vendorpay@flipkart.com",
    address: "Buildings Alyssa, Begonia & Clover, Embassy Tech Village, Mumbai",
    currency: "INR",
    paymentType: "Credit",
    creditLimit: "1000000",
    status: "Active",
    createdAt: "2026-08-25",
  },
  {
    id: "CUST-106",
    srNo: 6,
    name: "Trans-Atlantic Express Inc",
    company: "AMERICAN XPRESS COURIER - AXC INC",
    originHub: "JFK",
    parentCustomer: "None",
    originCode: "JFK-CUST-106",
    email: "dispatch@transatlantic-us.com",
    address: "Cargo Building 75, JFK International Airport, Jamaica, NY 11430",
    currency: "USD",
    paymentType: "Bank Transfer",
    creditLimit: "300000",
    status: "Active",
    createdAt: "2026-09-02",
  },
  {
    id: "CUST-107",
    srNo: 7,
    name: "Crown Worldwide Logistics UK",
    company: "AX COURIER LOGISTICS - AX COURIER LOGISTICS",
    originHub: "LHR",
    parentCustomer: "None",
    originCode: "LHR-CUST-107",
    email: "accounts@crownworldwide.co.uk",
    address: "Unit 3, Scylla Road, Heathrow Airport, Hounslow, TW6 3FE",
    currency: "GBP",
    paymentType: "Credit",
    creditLimit: "450000",
    status: "Active",
    createdAt: "2026-09-10",
  },
];
