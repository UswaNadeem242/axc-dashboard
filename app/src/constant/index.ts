import {
  BarChart3,
  Bell,
  Calculator,
  ClipboardCheck,
  CreditCard,
  FileText,
  Home,
  MessageSquare,
  Repeat,
  Settings,
  UserCircle2,
  Users,
  MapPin,
  Mail,
  Database,
  Ticket,
  CheckCircle2,
  PauseCircle,
  Clock,
  Search,
  DollarSign,
  Coins,
} from "lucide-react";

export interface SubMenuItem {
  label: string;
  id: string;
  href?: string;
}

export interface MenuItem {
  label: string;
  icon: typeof Home;
  id: string;
  href?: string;
  hasDropdown?: boolean;
  subItems?: SubMenuItem[];
}

export const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: Home, id: "dashboard", href: "/" },
  {
    label: "AWB Management",
    icon: FileText,
    id: "awb-management",
    hasDropdown: true,
    subItems: [
      { label: "AWB Entries", id: "awb-entries", href: "/awb-entries" },
      { label: "Management System", id: "awb-management-system" },
    ],
  },
  { label: "Manifest Management", icon: ClipboardCheck, id: "manifest" },
  {
    label: "Invoice & Billing",
    icon: CreditCard,
    id: "invoice",
    hasDropdown: true,
    subItems: [
      { label: "Invoices", id: "invoices" },
      { label: "Billing System", id: "billing-system" },
    ],
  },
  { label: "Tracking", icon: MapPin, id: "tracking" },
  { label: "Rate Calculation", icon: Calculator, id: "rate-calculation" },
  { label: "Vendor Reconciliation", icon: Repeat, id: "vendor-reconciliation" },
  { label: "Accounts", icon: UserCircle2, id: "accounts" },
  { label: "Users & Roles", icon: Users, id: "users-roles" },
  { label: "Notifications", icon: Bell, id: "notifications" },
  { label: "Support Tickets", icon: MessageSquare, id: "support-tickets" },
  { label: "Reports & Analytics", icon: BarChart3, id: "reports-analytics" },
];

export const statsCards = [
  {
    id: "Dashboard",
    label: "Dashboard",
    count: "8,942",
    trend: "12% increase from last month",
    isIncrease: true,
    icon: Users,
    iconBgColor: "bg-blue-50",
    iconTextColor: "text-axc-navy",
  },
  {
    id: "revenue",
    label: "Revenue (This Month)",
    count: "$129,580",
    trend: "8% increase from last month",
    isIncrease: true,
    icon: DollarSign,
    iconBgColor: "bg-red-50",
    iconTextColor: "text-red-600",
  },
  {
    id: "Tracking",
    label: "Tracking",
    count: "356",
    trend: "10% decrease from last month",
    isIncrease: false,
    icon: Database,
    iconBgColor: "bg-amber-50",
    iconTextColor: "text-amber-600",
  },
  {
    id: "conversion-rate",
    label: "Conversion Rate",
    count: "6.3%",
    trend: "2% increase from last month",
    isIncrease: true,
    icon: Coins,
    iconBgColor: "bg-blue-50",
    iconTextColor: "text-blue-600",
  },
];



interface Flight {
  flightNo: string;
  flightDate: string;
  manifestDate: string;
  customer: string;
  status: string;
  action?: string;
}


export const headings = [

  {
    label: "Flight No.",
    key: "flightNo",
    className: "font-bold text-gray-900"
  },

  {
    label: "Flight Date",
    key: "flightDate"
  },

  {
    label: "Manifest Date",
    key: "manifestDate"
  },

  {
    label: "Customer",
    key: "customer",
    className: "font-semibold text-gray-900"
  },

  {
    label: "MAWB No.",
    key: "mawb"
  },

  {
    label: "Bags",
    key: "bags",
    className: "font-bold"
  },

  {
    label: "Pieces",
    key: "pieces",
    className: "font-bold"
  },

  {
    label: "Origin",
    key: "origin"
  },

  {
    label: "Destination",
    key: "destination"
  },

  {
    label: "Arrival",
    key: "arrival"
  },

  {
    label: "Status",
    key: "status"
  },


  {
    label: "Action",
    key: "action"
  }

];
export const flightData = [
  {
    flightNo: "EK 512",
    flightDate: "18/05/2025",
    manifestDate: "18/05/2025",
    customer: "DHL Global Forwarding",
    mawb: "176-51234567",
    bags: 125,
    pieces: "1,250",
    origin: "DXB",
    destination: "DEL",
    arrival: "18/05/2025 14:30",
    status: "Arrived",
  },

  {
    flightNo: "QR 570",
    flightDate: "18/05/2025",
    manifestDate: "18/05/2025",
    customer: "Kuehne + Nagel",
    mawb: "157-98765432",
    bags: 98,
    pieces: "980",
    origin: "DOH",
    destination: "BOM",
    arrival: "18/05/2025 16:45",
    status: "Arrived",
  },

  {
    flightNo: "AI 131",
    flightDate: "18/05/2025",
    manifestDate: "18/05/2025",
    customer: "DB Schenker",
    mawb: "098-76543210",
    bags: 76,
    pieces: "760",
    origin: "DEL",
    destination: "LHR",
    arrival: "18/05/2025 20:10",
    status: "On Time",
  },

  {
    flightNo: "CX 695",
    flightDate: "19/05/2025",
    manifestDate: "19/05/2025",
    customer: "UPS Supply Chain",
    mawb: "160-24681357",
    bags: 110,
    pieces: "1,100",
    origin: "HKG",
    destination: "DEL",
    arrival: "19/05/2025 09:20",
    status: "Scheduled",
  },

  {
    flightNo: "SQ 402",
    flightDate: "19/05/2025",
    manifestDate: "19/05/2025",
    customer: "FedEx Express",
    mawb: "618-13579246",
    bags: 60,
    pieces: "600",
    origin: "SIN",
    destination: "BLR",
    arrival: "19/05/2025 11:50",
    status: "Scheduled",
  },
];




export interface SubMenuItem {
  label: string;
  id: string;
  href?: string;
}

export interface MenuItem {
  label: string;
  icon: typeof Home;
  id: string;
  href?: string;
  hasDropdown?: boolean;
  subItems?: SubMenuItem[];
}

export interface AwbEntry {
  srNo: number;
  awbNumber: string;
  bookingDate: string;
  forwardingNumber: string;
  customer: string;
  masterCode: string;
  product: string;
  pcs: number;
  service: string;
  vendor: string;
  origin: string;
  destination: string;
  consignee: string;
  shipper: string;
  status: string;
}

export const AwbEntryheading = [
  { label: "SR.NO.", key: "srNo" },
  { label: "SELECT AWB", key: "selectAwb" },
  { label: "AWB NUMBER", key: "awbNumber" },
  { label: "BOOKING DATE", key: "bookingDate" },
  { label: "FORWARDING", key: "forwardingNumber" },
  { label: "CUSTOMER", key: "customer" },
  { label: "INVOICE", key: "masterCode" },
  { label: "PRODUCT", key: "product" },
  { label: "PCS", key: "pcs" },
  { label: "SERVICE", key: "service" },
  { label: "VENDOR", key: "vendor" },
  { label: "ORIGIN", key: "origin" },
  { label: "DESTINATION", key: "destination" },
  { label: "CONSIGNEE", key: "consignee" },
  { label: "SHIPPER", key: "shipper" },
  { label: "ACTION", key: "action" },
];

export const initialData: AwbEntry[] = [
  {
    srNo: 1,
    awbNumber: "30128763",
    bookingDate: "20/07/2026",
    forwardingNumber: "874600062650",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "UNITED STATES OF AMERICA",
    consignee: "RAJBHIHAI PATEL",
    shipper: "MEHULBHAI BALDEVBHAI RAVAL",
    status: "Arrived",
  },
  {
    srNo: 2,
    awbNumber: "30593993",
    bookingDate: "20/07/2026",
    forwardingNumber: "874599310837",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "UNITED STATES OF AMERICA",
    consignee: "UTSAV VAGHANI",
    shipper: "VAGHANI KRISHNABEN SHAILESHBHAI",
    status: "Arrived",
  },
  {
    srNo: 3,
    awbNumber: "30621342",
    bookingDate: "20/07/2026",
    forwardingNumber: "874599181710",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "UNITED STATES OF AMERICA",
    consignee: "SRIRAM IYER",
    shipper: "SRIRAM IYER",
    status: "Arrived",
  },
  {
    srNo: 4,
    awbNumber: "30575099",
    bookingDate: "20/07/2026",
    forwardingNumber: "874599003859",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "UNITED STATES OF AMERICA",
    consignee: "KIRANMAYI VEMURI",
    shipper: "SAVANI HIRAL NILESHBHAI",
    status: "Arrived",
  },
  {
    srNo: 5,
    awbNumber: "31151195",
    bookingDate: "20/07/2026",
    forwardingNumber: "874598955475",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "UNITED STATES OF AMERICA",
    consignee: "NIL PATEL",
    shipper: "PATEL ATUL",
    status: "Arrived",
  },
  {
    srNo: 6,
    awbNumber: "30519927",
    bookingDate: "20/07/2026",
    forwardingNumber: "874598924947",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "UNITED STATES OF AMERICA",
    consignee: "SAIPRIYA KARNE",
    shipper: "JASANI NITINBHAI RADHUBHAI",
    status: "Arrived",
  },
  {
    srNo: 7,
    awbNumber: "30168756",
    bookingDate: "20/07/2026",
    forwardingNumber: "874598888781",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "UNITED STATES OF AMERICA",
    consignee: "VIJAYKUMAR K DAVE",
    shipper: "AMIBEN KRISHNAKANT DAVE",
    status: "On Time",
  },
   {
    srNo: 8,
    awbNumber: "30168756",
    bookingDate: "20/07/2026",
    forwardingNumber: "874598888781",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "UNITED STATES OF AMERICA",
    consignee: "VIJAYKUMAR K DAVE",
    shipper: "AMIBEN KRISHNAKANT DAVE",
    status: "On Time",
  },
  {
    srNo: 9,
    awbNumber: "30819284",
    bookingDate: "21/07/2026",
    forwardingNumber: "874598776655",
    customer: "DHL EXPRESS",
    masterCode: "GST",
    product: "DOX",
    pcs: 2,
    service: "DHL EXPRESS WORLDWIDE",
    vendor: "DHL EXPRESS LOCAL",
    origin: "INDIA",
    destination: "UNITED KINGDOM",
    consignee: "JOHN SMITH",
    shipper: "RAJESH SHARMA",
    status: "Arrived",
  },
  {
    srNo: 10,
    awbNumber: "30928374",
    bookingDate: "21/07/2026",
    forwardingNumber: "874598665544",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "CANADA",
    consignee: "EMILY JOHNSON",
    shipper: "AMIT PATEL",
    status: "Pending",
  },
  {
    srNo: 11,
    awbNumber: "31039485",
    bookingDate: "22/07/2026",
    forwardingNumber: "874598554433",
    customer: "FEDEX COURIER",
    masterCode: "GST",
    product: "DOX",
    pcs: 1,
    service: "FEDEX ENVELOPE",
    vendor: "FEDEX NEW DELHI",
    origin: "INDIA",
    destination: "GERMANY",
    consignee: "HANS MULLER",
    shipper: "VIJAY SHAH",
    status: "On Time",
  },
  {
    srNo: 12,
    awbNumber: "31140596",
    bookingDate: "22/07/2026",
    forwardingNumber: "874598443322",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 5,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "UNITED STATES OF AMERICA",
    consignee: "SARAH WILLIAMS",
    shipper: "DEVENDRA PANCHAL",
    status: "Arrived",
  },
  {
    srNo: 13,
    awbNumber: "31251607",
    bookingDate: "23/07/2026",
    forwardingNumber: "874598332211",
    customer: "UPS COURIER",
    masterCode: "GST",
    product: "NONDOX",
    pcs: 3,
    service: "UPS SAVER",
    vendor: "UPS MUMBAI HUB",
    origin: "INDIA",
    destination: "AUSTRALIA",
    consignee: "BRUCE WAYNE",
    shipper: "ALFRED PENNYWORTH",
    status: "Pending",
  },
  {
    srNo: 14,
    awbNumber: "31362718",
    bookingDate: "23/07/2026",
    forwardingNumber: "874598221100",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "DOX",
    pcs: 1,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "UNITED STATES OF AMERICA",
    consignee: "CLARK KENT",
    shipper: "MARTHA KENT",
    status: "On Time",
  },
  {
    srNo: 15,
    awbNumber: "31473829",
    bookingDate: "24/07/2026",
    forwardingNumber: "874598110099",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 2,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "SINGAPORE",
    consignee: "LEE KUAN YEW",
    shipper: "CHANDRAKANT SHARMA",
    status: "Arrived",
  },
  {
    srNo: 16,
    awbNumber: "31584930",
    bookingDate: "24/07/2026",
    forwardingNumber: "874598009988",
    customer: "DHL EXPRESS",
    masterCode: "GST",
    product: "NONDOX",
    pcs: 1,
    service: "DHL EXPRESS WORLDWIDE",
    vendor: "DHL EXPRESS LOCAL",
    origin: "INDIA",
    destination: "JAPAN",
    consignee: "TARO YAMADA",
    shipper: "KAPIL DEV",
    status: "On Time",
  },
  {
    srNo: 17,
    awbNumber: "31696041",
    bookingDate: "25/07/2026",
    forwardingNumber: "874597998877",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "UNITED STATES OF AMERICA",
    consignee: "DAVID BROWN",
    shipper: "SANDIP PATEL",
    status: "Pending",
  },
  {
    srNo: 18,
    awbNumber: "31807152",
    bookingDate: "25/07/2026",
    forwardingNumber: "874597887766",
    customer: "FEDEX COURIER",
    masterCode: "GST",
    product: "DOX",
    pcs: 2,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "FRANCE",
    consignee: "JEAN DUPONT",
    shipper: "SURESH MEHTA",
    status: "Arrived",
  },
  {
    srNo: 19,
    awbNumber: "31918263",
    bookingDate: "26/07/2026",
    forwardingNumber: "874597776655",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 4,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "UNITED ARAB EMIRATES",
    consignee: "MOHAMMED AL BALUSHI",
    shipper: "RAMESH BHAI",
    status: "On Time",
  },
  {
    srNo: 20,
    awbNumber: "32029374",
    bookingDate: "26/07/2026",
    forwardingNumber: "874597665544",
    customer: "UPS COURIER",
    masterCode: "GST",
    product: "NONDOX",
    pcs: 1,
    service: "UPS SAVER",
    vendor: "UPS MUMBAI HUB",
    origin: "INDIA",
    destination: "MALAYSIA",
    consignee: "CHIN KONG",
    shipper: "SURESH CHAWLA",
    status: "Pending",
  },
];




export const ticket = [
  {
    title: "Open Tickets",
    count: "18",
    icon: Ticket,
    bgClass: "bg-red-50/50",
    borderClass: "border-red-100/30",
    iconBg: "bg-axc-red",
    textColor: "text-red-500",
    linkSize: "text-sm",
  },
  {
    title: "Resolved Tickets",
    count: "32",
    icon: CheckCircle2,
    bgClass: "bg-blue-50/50",
    borderClass: "border-blue-100/30",
    iconBg: "bg-axc-navy",
    textColor: "text-blue-600",
    linkSize: "text-[10px]",
  },
  {
    title: "On Hold Tickets",
    count: "07",
    icon: PauseCircle,
    bgClass: "bg-amber-50/50",
    borderClass: "border-amber-100/30",
    iconBg: "bg-amber-500",
    textColor: "text-amber-600",
    linkSize: "text-[10px]",
  },
  {
    title: "Ongoing Tickets",
    count: "14",
    icon: Clock,
    bgClass: "bg-sky-50/50",
    borderClass: "border-sky-100/30",
    iconBg: "bg-axc-dark-green",
    textColor: "text-sky-600",
    linkSize: "text-[10px]",
  },
];

export const quickActions = [
  {
    title: "New AWB Entry",
    subtitle: "Create Air Waybill",
    icon: FileText,
    bgClass: "bg-blue-50/40 hover:bg-blue-50",
    borderClass: "border-blue-100/30",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    arrowColor: "text-blue-500",
  },
  {
    title: "Create Manifest",
    subtitle: "Add New Manifest",
    icon: ClipboardCheck,
    bgClass: "bg-red-50/40 hover:bg-red-50",
    borderClass: "border-red-100/30",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    arrowColor: "text-red-500",
  },
  {
    title: "Sales Invoice",
    subtitle: "Create Invoice",
    icon: CreditCard,
    bgClass: "bg-amber-50/40 hover:bg-amber-50",
    borderClass: "border-amber-100/30",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    arrowColor: "text-amber-500",
  },
  {
    title: "Tracking Search",
    subtitle: "Track Shipments",
    icon: Search,
    bgClass: "bg-blue-50/40 hover:bg-blue-50",
    borderClass: "border-blue-100/30",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    arrowColor: "text-blue-500",
  },
  {
    title: "Rate Calculator",
    subtitle: "Calculate Rates",
    icon: Calculator,
    bgClass: "bg-red-50/40 hover:bg-red-50",
    borderClass: "border-red-100/30",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    arrowColor: "text-red-500",
  },
  {
    title: "Vendor Reconcile",
    subtitle: "Reconcile Now",
    icon: Repeat,
    bgClass: "bg-amber-50/40 hover:bg-amber-50",
    borderClass: "border-amber-100/30",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    arrowColor: "text-amber-500",
  },
];