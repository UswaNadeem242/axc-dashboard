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
  Landmark,
} from "lucide-react";
0
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
    hasDropdown: false,
    href: "/awb-entries",
    // subItems: [
    //   { label: "AWB Entries", id: "awb-entries", href: "/awb-entries" },
    //   { label: "Management System", id: "awb-management-system" },
    // ],
  },
  {
    label: "Manifest Management",
    icon: ClipboardCheck,
    id: "manifest",
    href: "/manifest",
    hasDropdown: false,
    //subItems: [
    //{ label: "All Manifest", id: "all-manifest", href: "/manifest/all-manifest" },
    // ],
  },
  {
    label: "Invoice & Billing",
    icon: CreditCard,
    id: "invoice",
    hasDropdown: false,
    href: "/invoice/all-invoices",
    //subItems: [

    // { label: "Invoices", id: "invoices", href: "/invoice/all-invoices" },
    // { label: "Billing System", id: "billing-system" },
    //],
  },
  {
    label: "Vendor Invoice",
    icon: CreditCard,
    id: "vendorinvoice",
    hasDropdown: false,
    href: "/vendorinvoice/all-vendorinvoices",

  },
  {
    label: "Accounts",
    icon: Landmark,
    id: "accounts",
    hasDropdown: true,
    subItems: [
      { label: "Credit & Debit Note", id: "credit-debit-notes", href: "/accounts" },
      { label: "Receipt", id: "receipts", href: "/accounts/receipt" },
      { label: "Bank Transfer", id: "bank-transfer", href: "/accounts/bank-transfer" },
    ],
  },
  // { label: "Rate Calculation", icon: Calculator, id: "rate-calculation" },
  // { label: "Vendor Reconciliation", icon: Repeat, id: "vendor-reconciliation" },
  // { label: "Accounts", icon: UserCircle2, id: "accounts" },
  // { label: "Users & Roles", icon: Users, id: "users-roles" },
  // { label: "Notifications", icon: Bell, id: "notifications" },
  // { label: "Support Tickets", icon: MessageSquare, id: "support-tickets" },
  // { label: "Reports & Analytics", icon: BarChart3, id: "reports-analytics" },

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

  // Search & Filter fields (supporting the 15 AWB filter categories)
  customerCode?: string;
  destinationHub?: string;
  bookingTime?: string;
  serviceCode?: string;
  shipperCity?: string;
  consigneeCity?: string;
  consigneeState?: string;
  company?: string;
  runNumber?: string;
  calendarYear?: string;
}

export const AwbEntryheading = [
  { label: "SR.NO.", key: "srNo" },
  { label: "SELECT AWB", key: "selectAwb" },
  { label: "AWB NUMBER", key: "awbNumber", sortable: true },
  { label: "BOOKING DATE", key: "bookingDate", sortable: true },
  { label: "FORWARDING NUMBER", key: "forwardingNumber", sortable: true },
  { label: "CUSTOMER", key: "customer", sortable: true },
  { label: "INVOICE RANGE MASTER CODE", key: "masterCode", sortable: true },
  { label: "PRODUCT", key: "product", sortable: true },
  { label: "PCS", key: "pcs" },
  { label: "SERVICE", key: "service", sortable: true },
  { label: "VENDOR", key: "vendor", sortable: true },
  { label: "ORIGIN", key: "origin", sortable: true },
  { label: "DESTINATION", key: "destination", sortable: true },
  { label: "CONSIGNEE", key: "consignee", sortable: true },
  { label: "SHIPPER", key: "shipper", sortable: true },
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
    customer: "ELS PAKISTAN",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "TCS COURIER - KARACHI",
    vendor: "TCS KARACHI HUB",
    origin: "PAKISTAN",
    destination: "UNITED STATES OF AMERICA",
    consignee: "HAMZA KHAN",
    shipper: "BILAL AHMED",
    status: "Arrived",
  },
  {
    srNo: 3,
    awbNumber: "30621342",
    bookingDate: "20/07/2026",
    forwardingNumber: "874599181710",
    customer: "ELS PAKISTAN",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "LEOPARDS - LAHORE",
    vendor: "LEOPARDS LAHORE HUB",
    origin: "PAKISTAN",
    destination: "UNITED KINGDOM",
    consignee: "USMAN TARIQ",
    shipper: "ZESHAN MALIK",
    status: "Arrived",
  },
  {
    srNo: 4,
    awbNumber: "30575099",
    bookingDate: "20/07/2026",
    forwardingNumber: "874599003859",
    customer: "SIALKOT SURGICAL",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "AIR CARGO - SIALKOT",
    vendor: "SIALKOT CARGO TERMINAL",
    origin: "PAKISTAN",
    destination: "GERMANY",
    consignee: "HEINRICH VOGEL",
    shipper: "TARIQ MEHMOOD",
    status: "Arrived",
  },
  {
    srNo: 5,
    awbNumber: "31151195",
    bookingDate: "20/07/2026",
    forwardingNumber: "874598955475",
    customer: "GULF TRADING",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "EMIRATES POST - DUBAI",
    vendor: "DUBAI CARGO HUB",
    origin: "UNITED ARAB EMIRATES",
    destination: "UNITED STATES OF AMERICA",
    consignee: "NIL PATEL",
    shipper: "MOHAMMED AL SHAMSI",
    status: "Arrived",
  },
  {
    srNo: 6,
    awbNumber: "30519927",
    bookingDate: "20/07/2026",
    forwardingNumber: "874598924947",
    customer: "MUMBAI FORWARDERS",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "BLUE DART - MUMBAI",
    vendor: "MUMBAI AIRPORT HUB",
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
    customer: "DELHI LOGISTICS",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "DTDC - DELHI",
    vendor: "DELHI CARGO HUB",
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
    customer: "AIR CANADA CARGO",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "AIR CANADA CARGO - TORONTO",
    vendor: "CANADA CARGO HUB",
    origin: "CANADA",
    destination: "UNITED STATES OF AMERICA",
    consignee: "EMILY JOHNSON",
    shipper: "MICHAEL SMITH",
    status: "Pending",
  },
  {
    srNo: 11,
    awbNumber: "31039485",
    bookingDate: "22/07/2026",
    forwardingNumber: "874598554433",
    customer: "FEDEX USA",
    masterCode: "GST",
    product: "DOX",
    pcs: 1,
    service: "FEDEX EXPRESS - NEW YORK JFK",
    vendor: "JFK AIR CARGO",
    origin: "UNITED STATES OF AMERICA",
    destination: "GERMANY",
    consignee: "HANS MULLER",
    shipper: "JOHN DOE",
    status: "On Time",
  },
  {
    srNo: 12,
    awbNumber: "31140596",
    bookingDate: "22/07/2026",
    forwardingNumber: "874598443322",
    customer: "BIMAN LOGISTICS",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 5,
    service: "BIMAN CARGO - DHAKA",
    vendor: "DHAKA CARGO TERMINAL",
    origin: "BANGLADESH",
    destination: "UNITED STATES OF AMERICA",
    consignee: "SARAH WILLIAMS",
    shipper: "KABIR HOSSAIN",
    status: "Arrived",
  },
  {
    srNo: 13,
    awbNumber: "31251607",
    bookingDate: "23/07/2026",
    forwardingNumber: "874598332211",
    customer: "HIMALAYAN CARGO",
    masterCode: "GST",
    product: "NONDOX",
    pcs: 3,
    service: "HIMALAYAN AIR - KATHMANDU",
    vendor: "KATHMANDU AIR CARGO",
    origin: "NEPAL",
    destination: "AUSTRALIA",
    consignee: "BRUCE WAYNE",
    shipper: "PASANG SHERPA",
    status: "Pending",
  },
  {
    srNo: 14,
    awbNumber: "31362718",
    bookingDate: "23/07/2026",
    forwardingNumber: "874598221100",
    customer: "TCS PAKISTAN",
    masterCode: "NONGST",
    product: "DOX",
    pcs: 1,
    service: "TCS EXPRESS - ISLAMABAD",
    vendor: "ISLAMABAD AIRPORT HUB",
    origin: "PAKISTAN",
    destination: "UNITED STATES OF AMERICA",
    consignee: "CLARK KENT",
    shipper: "ASADULLAH KHAN",
    status: "On Time",
  },
  {
    srNo: 15,
    awbNumber: "31473829",
    bookingDate: "24/07/2026",
    forwardingNumber: "874598110099",
    customer: "PAKISTAN POST",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 2,
    service: "SPEED POST - PESHAWAR",
    vendor: "PESHAWAR CARGO HUB",
    origin: "PAKISTAN",
    destination: "SINGAPORE",
    consignee: "LEE KUAN YEW",
    shipper: "FAISAL AFRIDI",
    status: "Arrived",
  },
  {
    srNo: 16,
    awbNumber: "31584930",
    bookingDate: "24/07/2026",
    forwardingNumber: "874598009988",
    customer: "BLUE DART",
    masterCode: "GST",
    product: "NONDOX",
    pcs: 1,
    service: "BLUE DART - DELHI",
    vendor: "DELHI LOGISTICS HUB",
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
    service: "FEDEX IP EX MUMBAI - INDIA",
    vendor: "MUMBAI CENTRAL HUB",
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
    customer: "FLY DUBAI",
    masterCode: "GST",
    product: "DOX",
    pcs: 2,
    service: "FLY DUBAI EXPRESS",
    vendor: "DUBAI INTERNATIONAL CARGO",
    origin: "UNITED ARAB EMIRATES",
    destination: "FRANCE",
    consignee: "JEAN DUPONT",
    shipper: "RASHID AL MAKTOUM",
    status: "Arrived",
  },
  {
    srNo: 19,
    awbNumber: "31918263",
    bookingDate: "26/07/2026",
    forwardingNumber: "874597776655",
    customer: "TCS PAKISTAN",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 4,
    service: "TCS KARACHI MAIN",
    vendor: "KARACHI SEAPORT HUB",
    origin: "PAKISTAN",
    destination: "UNITED ARAB EMIRATES",
    consignee: "MOHAMMED AL BALUSHI",
    shipper: "HAMZA FAROOQ",
    status: "On Time",
  },
  {
    srNo: 20,
    awbNumber: "32029374",
    bookingDate: "26/07/2026",
    forwardingNumber: "874597665544",
    customer: "DELHI CARGO",
    masterCode: "GST",
    product: "NONDOX",
    pcs: 1,
    service: "NEW DELHI AIR FREIGHT",
    vendor: "DELHI AIRPORT TERMINAL 3",
    origin: "INDIA",
    destination: "MALAYSIA",
    consignee: "CHIN KONG",
    shipper: "SURESH CHAWLA",
    status: "Pending",
  },
];

export interface ManifestEntry {
  srNo: number;
  manifestNo: string;
  vendor: string;
  vendorName: string;
  originHubCode: string;
  destinationHubName: string;
  destinationHubCode: string;
  forwarderCode: string;
  runNumber: string;
  masterEdiBagNo: string;
  manifestDate: string;
  vehicleNo: string;
  noOfBags: number;
  weight: string;

  // Search & Filter fields
  masterNo?: string;
  awbNo?: string;
  company?: string;
  status?: string;
  calendarYear?: string;
}

export const ManifestHeading = [
  { label: "SR.NO.", key: "srNo" },
  { label: "MANIFEST NO.", key: "manifestNo", sortable: true },
  { label: "VENDOR", key: "vendor" },
  { label: "VENDOR NAME", key: "vendorName", truncate: false },
  { label: "ORIGIN HUB CODE", key: "originHubCode", sortable: true },
  { label: "DESTINATION HUB NAME", key: "destinationHubName", truncate: false },
  { label: "DESTINATION HUB CODE", key: "destinationHubCode", sortable: true },
  { label: "FORWARDER CODE", key: "forwarderCode" },
  { label: "RUN NUMBER", key: "runNumber", truncate: false },
  { label: "MASTER EDI BAG NO", key: "masterEdiBagNo", truncate: false },
  { label: "MANIFEST DATE", key: "manifestDate", sortable: true },
  { label: "VEHICLE NO.", key: "vehicleNo" },
  { label: "NO. OF BAGS", key: "noOfBags" },
  { label: "WEIGHT", key: "weight" },
  { label: "ACTION", key: "action" },
];

export const initialManifestData: ManifestEntry[] = [
  {
    srNo: 1, manifestNo: "1363",
    vendor: "", vendorName: "",
    originHubCode: "SKT",
    destinationHubName: "JFK",
    destinationHubCode: "JFK",
    forwarderCode: "",
    runNumber: "AXC SIALKOT RUN 469",
    masterEdiBagNo: "",
    manifestDate: "19-08-2026",
    vehicleNo: "",
    noOfBags: 72,
    weight: "1411.6"
  },
  {
    srNo: 2,
    manifestNo: "1362",
    vendor: "",
    vendorName: "",
    originHubCode: "SKT",
    destinationHubName: "JFK",
    destinationHubCode: "JFK",
    forwarderCode: "",
    runNumber: "AXC SIALKOT RUN 468",
    masterEdiBagNo: "",
    manifestDate: "19-08-2026",
    vehicleNo: "", noOfBags: 102,
    weight: "1799.1"
  },
  {
    srNo: 3,
    manifestNo: "1361",
    vendor: "",
    vendorName: "",
    originHubCode: "BOM",
    destinationHubName: "MUMBAI",
    destinationHubCode: "BOM",
    forwarderCode: "",
    runNumber: "AXC16082601 RUN 744",
    masterEdiBagNo: "",
    manifestDate: "18-08-2026",
    vehicleNo: "",
    noOfBags: 66,
    weight: "2000.0"
  },
  {
    srNo: 4,
    manifestNo: "1360",
    vendor: "",
    vendorName: "",
    originHubCode: "BOM",
    destinationHubName: "MUMBAI",
    destinationHubCode: "BOM",
    forwarderCode: "",
    runNumber: "AXC17082601 RUN 743",
    masterEdiBagNo: "",
    manifestDate: "18-08-2026",
    vehicleNo: "",
    noOfBags: 79,
    weight: "2420.1"
  },
  {
    srNo: 5,
    manifestNo: "1359",
    vendor: "",
    vendorName: "",
    originHubCode: "SKT",
    destinationHubName: "JFK",
    destinationHubCode: "JFK",
    forwarderCode: "",
    runNumber: "AXC SIALKOT RUN 467",
    masterEdiBagNo: "",
    manifestDate: "17-08-2026",
    vehicleNo: "",
    noOfBags: 128,
    weight: "2456.1"
  },
  {
    srNo: 6,
    manifestNo: "1358",
    vendor: "",
    vendorName: "",
    originHubCode: "SKT",
    destinationHubName: "JFK",
    destinationHubCode: "JFK",
    forwarderCode: "",
    runNumber: "AXC SIALKOT RUN 466",
    masterEdiBagNo: "",
    manifestDate: "17-08-2026",
    vehicleNo: "",
    noOfBags: 124,
    weight: "2484.2"
  },
  {
    srNo: 7,
    manifestNo: "1357",
    vendor: "",
    vendorName: "",
    originHubCode: "SKT",
    destinationHubName: "JFK",
    destinationHubCode: "JFK",
    forwarderCode: "",
    runNumber: "AXC SIALKOT RUN 465",
    masterEdiBagNo: "",
    manifestDate: "16-08-2026",
    vehicleNo: "",
    noOfBags: 111,
    weight: "2481.3"
  },
  {
    srNo: 8,
    manifestNo: "1356",
    vendor: "",
    vendorName: "",
    originHubCode: "BOM",
    destinationHubName: "MUMBAI",
    destinationHubCode: "BOM",
    forwarderCode: "",
    runNumber: "AXC13082601 RUN 742",
    masterEdiBagNo: "",
    manifestDate: "16-08-2026",
    vehicleNo: "",
    noOfBags: 81,
    weight: "2391.0"
  },
  {
    srNo: 9,
    manifestNo: "1355",
    vendor: "",
    vendorName: "",
    originHubCode: "SKT",
    destinationHubName: "JFK",
    destinationHubCode: "JFK",
    forwarderCode: "",
    runNumber: "AXC SIALKOT RUN 464",
    masterEdiBagNo: "",
    manifestDate: "15-08-2026",
    vehicleNo: "",
    noOfBags: 78,
    weight: "1490.3"
  },
  {
    srNo: 10,
    manifestNo: "1354",
    vendor: "",
    vendorName: "",
    originHubCode: "SKT",
    destinationHubName: "JFK",
    destinationHubCode: "JFK",
    forwarderCode: "",
    runNumber: "AXC SIALKOT RUN 463",
    masterEdiBagNo: "",
    manifestDate: "15-08-2026",
    vehicleNo: "",
    noOfBags: 69,
    weight: "1348.8"
  },
  {
    srNo: 11,
    manifestNo: "1353",
    vendor: "",
    vendorName: "",
    originHubCode: "BOM",
    destinationHubName: "MUMBAI",
    destinationHubCode: "BOM",
    forwarderCode: "",
    runNumber: "AXC11082602 RUN 741",
    masterEdiBagNo: "125-1039 0553",
    manifestDate: "14-08-2026",
    vehicleNo: "",
    noOfBags: 78,
    weight: "2405.1"
  },
  {
    srNo: 12,
    manifestNo: "1352",
    vendor: "",
    vendorName: "",
    originHubCode: "SKT",
    destinationHubName: "JFK",
    destinationHubCode: "JFK",
    forwarderCode: "",
    runNumber: "AXC SIALKOT RUN 462",
    masterEdiBagNo: "",
    manifestDate: "14-08-2026",
    vehicleNo: "",
    noOfBags: 116,
    weight: "2471.3"
  },
  {
    srNo: 13,
    manifestNo: "1351",
    vendor: "",
    vendorName: "",
    originHubCode: "BOM",
    destinationHubName: "MUMBAI",
    destinationHubCode: "BOM",
    forwarderCode: "",
    runNumber: "AXC11082601 RUN 740",
    masterEdiBagNo: "",
    manifestDate: "13-08-2026",
    vehicleNo: "",
    noOfBags: 80,
    weight: "2386.3"
  },
  {
    srNo: 14,
    manifestNo: "1350",
    vendor: "",
    vendorName: "",
    originHubCode: "SKT",
    destinationHubName: "JFK",
    destinationHubCode: "JFK",
    forwarderCode: "",
    runNumber: "AXC SIALKOT RUN 461",
    masterEdiBagNo: "",
    manifestDate: "12-08-2026",
    vehicleNo: "",
    noOfBags: 112,
    weight: "2497.9"
  },
  {
    srNo: 15,
    manifestNo: "1349",
    vendor: "",
    vendorName: "",
    originHubCode: "SKT",
    destinationHubName: "JFK",
    destinationHubCode: "JFK",
    forwarderCode: "",
    runNumber: "AXC SIALKOT RUN 460",
    masterEdiBagNo: "", manifestDate: "12-08-2026",
    vehicleNo: "",
    noOfBags: 121,
    weight: "2506.3"
  },
  {
    srNo: 16,
    manifestNo: "1348",
    vendor: "",
    vendorName: "",
    originHubCode: "BOM",
    destinationHubName: "MUMBAI",
    destinationHubCode: "BOM",
    forwarderCode: "",
    runNumber: "AXC08082601 RUN 739",
    masterEdiBagNo: "",
    manifestDate: "11-08-2026",
    vehicleNo: "",
    noOfBags: 72,
    weight: "2219.5"
  },
  {
    srNo: 17,
    manifestNo: "1347",
    vendor: "",
    vendorName: "",
    originHubCode: "BOM",
    destinationHubName: "MUMBAI",
    destinationHubCode: "BOM",
    forwarderCode: "",
    runNumber: "AXC05082601 RUN 737",
    masterEdiBagNo: "",
    manifestDate: "10-08-2026",
    vehicleNo: "",
    noOfBags: 81,
    weight: "2492.1"
  },
  {
    srNo: 18,
    manifestNo: "1346",
    vendor: "",
    vendorName: "",
    originHubCode: "SKT",
    destinationHubName: "JFK",
    destinationHubCode: "JFK",
    forwarderCode: "",
    runNumber: "AXC SIALKOT RUN 459",
    masterEdiBagNo: "",
    manifestDate: "10-08-2026",
    vehicleNo: "",
    noOfBags: 119,
    weight: "2491.5"
  },
  {
    srNo: 19,
    manifestNo: "1345",
    vendor: "",
    vendorName: "",
    originHubCode: "SKT",
    destinationHubName: "JFK",
    destinationHubCode: "JFK",
    forwarderCode: "",
    runNumber: "AXC SIALKOT RUN 458",
    masterEdiBagNo: "",
    manifestDate: "10-08-2026",
    vehicleNo: "", noOfBags: 122,
    weight: "2491.3"
  },
  {
    srNo: 20,
    manifestNo: "1344",
    vendor: "",
    vendorName: "",
    originHubCode: "SKT",
    destinationHubName: "JFK",
    destinationHubCode: "JFK",
    forwarderCode: "",
    runNumber: "AXC SIALKOT RUN 457",
    masterEdiBagNo: "",
    manifestDate: "09-08-2026",
    vehicleNo: "",
    noOfBags: 79,
    weight: "1395.3"
  },
];

export interface InvoiceEntry {
  srNo: number;
  invoiceNumber: string;
  customerName: string;
  customerType: string;
  customerGstNumber?: string;
  invoiceDate: string;
  fromDate?: string;
  tillDate?: string;
  grandTotal: string;
  shipperCode: string;
  createdBy: string;
  createdDate: string;
  isEmailSent: string;
  emailDate?: string;
  emailSentCount: number;
  invoiceAgingDays?: string | number;
  irn?: string;
  acknowledgementNumber?: string;

  // Search & Filter fields
  customerCode?: string;
  company?: string;
  awbNo?: string;
  awbNumber?: string;
  shipperName?: string;
  calendarYear?: string;
  eInvoiceStatus?: string;
  syncStatus?: string;
  failedSync?: string | boolean;
}

export const InvoiceHeading = [
  { label: "SR.NO.", key: "srNo" },
  { label: "INVOICE NUMBER", key: "invoiceNumber", sortable: true, truncate: false },
  { label: "CUSTOMER NAME", key: "customerName", truncate: false },
  { label: "CUSTOMER TYPE", key: "customerType", sortable: true },
  { label: "CUSTOMER GST NUMBER", key: "customerGstNumber" },
  { label: "INVOICE DATE", key: "invoiceDate", sortable: true },
  { label: "FROM DATE", key: "fromDate", sortable: true },
  { label: "TILL DATE", key: "tillDate", sortable: true },
  { label: "GRAND TOTAL", key: "grandTotal", sortable: true, className: "font-bold" },
  { label: "SHIPPER CODE", key: "shipperCode" },
  { label: "CREATED BY", key: "createdBy", sortable: true },
  { label: "CREATED DATE", key: "createdDate", sortable: true },
  { label: "IS EMAIL SENT", key: "isEmailSent" },
  { label: "EMAIL DATE", key: "emailDate", sortable: true },
  { label: "EMAIL SENT COUNT", key: "emailSentCount", sortable: true },
  { label: "INVOICE AGING DAYS", key: "invoiceAgingDays" },
  { label: "IRN", key: "irn" },
  { label: "ACKNOWLEDGEMENT NUMBER", key: "acknowledgementNumber" },
  { label: "ACTION", key: "action" },
];

export const initialInvoiceData: InvoiceEntry[] = [
  { srNo: 1, invoiceNumber: "AURA LOGISTICS CB RUN 07", customerName: "AXC COUNTER BOOKING", customerType: "CORPORATE", invoiceDate: "22/08/2026", grandTotal: "30550", shipperCode: "SKT", createdBy: "ACCOUNTS 5", createdDate: "22/08/2026 11:20 PM", isEmailSent: "FALSE", emailSentCount: 0 },
  { srNo: 2, invoiceNumber: "MASTER LEATHER CB RUN 02", customerName: "AXC COUNTER BOOKING", customerType: "CORPORATE", invoiceDate: "22/08/2026", grandTotal: "10420", shipperCode: "SKT SHIPPER", createdBy: "ACCOUNTS 4", createdDate: "22/08/2026 11:14 PM", isEmailSent: "FALSE", emailSentCount: 0 },
  { srNo: 3, invoiceNumber: "STANDARD CARGO CB RUN 01", customerName: "AXC COUNTER BOOKING", customerType: "CORPORATE", invoiceDate: "22/08/2026", grandTotal: "8830", shipperCode: "SKT", createdBy: "ACCOUNTS 4", createdDate: "22/08/2026 11:11 PM", isEmailSent: "FALSE", emailSentCount: 0 },
  { srNo: 4, invoiceNumber: "NA LOGISTICS CB RUN 62", customerName: "AXC COUNTER BOOKING", customerType: "CORPORATE", invoiceDate: "22/08/2026", grandTotal: "159380", shipperCode: "SKT", createdBy: "ACCOUNTS 5", createdDate: "22/08/2026 11:04 PM", isEmailSent: "FALSE", emailSentCount: 0 },
  { srNo: 5, invoiceNumber: "DMS EXPRESS CB SKT RUN 163", customerName: "DMS COUNTER BOOKING", customerType: "CORPORATE", invoiceDate: "22/08/2026", grandTotal: "10250", shipperCode: "", createdBy: "ACCOUNTS 5", createdDate: "22/08/2026 10:49 PM", isEmailSent: "FALSE", emailSentCount: 0 },
  { srNo: 6, invoiceNumber: "XS COURIER CB RUN 16", customerName: "AXC COUNTER BOOKING", customerType: "CORPORATE", invoiceDate: "22/08/2026", grandTotal: "96520", shipperCode: "SKT", createdBy: "ACCOUNTS 5", createdDate: "22/08/2026 10:46 PM", isEmailSent: "FALSE", emailSentCount: 0 },
  { srNo: 7, invoiceNumber: "AYAAN INTERNATIONAL CB RUN 02", customerName: "AXC COUNTER BOOKING", customerType: "CORPORATE", invoiceDate: "22/08/2026", grandTotal: "71330", shipperCode: "SKT SHIPPER", createdBy: "ACCOUNTS 5", createdDate: "22/08/2026 10:45 PM", isEmailSent: "FALSE", emailSentCount: 0 },
  { srNo: 8, invoiceNumber: "CAPITAL COURIER CB RUN 14", customerName: "AXC COUNTER BOOKING", customerType: "CORPORATE", invoiceDate: "22/08/2026", grandTotal: "42300", shipperCode: "SKT", createdBy: "ACCOUNTS 5", createdDate: "22/08/2026 10:19 PM", isEmailSent: "FALSE", emailSentCount: 0 },
  { srNo: 9, invoiceNumber: "SWIFTSHIP COURIER CB 58", customerName: "AXC COUNTER BOOKING", customerType: "CORPORATE", invoiceDate: "22/08/2026", grandTotal: "40800", shipperCode: "SKT", createdBy: "ACCOUNTS 5", createdDate: "22/08/2026 10:14 PM", isEmailSent: "FALSE", emailSentCount: 0 },
  { srNo: 10, invoiceNumber: "KUNHAR LOGISTIC CB RUN 09", customerName: "AXC COUNTER BOOKING", customerType: "CORPORATE", invoiceDate: "22/08/2026", grandTotal: "126950", shipperCode: "SKT", createdBy: "ACCOUNTS 5", createdDate: "22/08/2026 09:50 PM", isEmailSent: "FALSE", emailSentCount: 0 },
  { srNo: 11, invoiceNumber: "FINE COURIER CB RUN 89", customerName: "AXC COUNTER BOOKING", customerType: "CORPORATE", invoiceDate: "22/08/2026", grandTotal: "112960", shipperCode: "SKT", createdBy: "ACCOUNTS 5", createdDate: "22/08/2026 09:35 PM", isEmailSent: "FALSE", emailSentCount: 0 },
  { srNo: 12, invoiceNumber: "M&U COURIER CB RUN 35", customerName: "AXC COUNTER BOOKING", customerType: "CORPORATE", invoiceDate: "22/08/2026", grandTotal: "23380", shipperCode: "SKT", createdBy: "ACCOUNTS 5", createdDate: "22/08/2026 09:32 PM", isEmailSent: "FALSE", emailSentCount: 0 },
  { srNo: 13, invoiceNumber: "SKY SHIP COURIER CB RUN 63", customerName: "AXC COUNTER BOOKING", customerType: "CORPORATE", invoiceDate: "22/08/2026", grandTotal: "13130", shipperCode: "SKT", createdBy: "ACCOUNTS 5", createdDate: "22/08/2026 09:31 PM", isEmailSent: "FALSE", emailSentCount: 0 },
  { srNo: 14, invoiceNumber: "ONLY TRACK CB RUN 17", customerName: "AXC COUNTER BOOKING", customerType: "CORPORATE", invoiceDate: "22/08/2026", grandTotal: "269110", shipperCode: "SKT", createdBy: "ACCOUNTS 5", createdDate: "22/08/2026 09:22 PM", isEmailSent: "FALSE", emailSentCount: 0 },
  { srNo: 15, invoiceNumber: "NA LOGISTICS CB RUN 61", customerName: "AXC COUNTER BOOKING", customerType: "CORPORATE", invoiceDate: "22/08/2026", grandTotal: "297180", shipperCode: "SKT", createdBy: "ACCOUNTS 5", createdDate: "22/08/2026 09:08 PM", isEmailSent: "FALSE", emailSentCount: 0 },
  { srNo: 16, invoiceNumber: "SUPERWAYS COURIER CB RUN 07", customerName: "AXC COUNTER BOOKING", customerType: "CORPORATE", invoiceDate: "22/08/2026", grandTotal: "7350", shipperCode: "SKT", createdBy: "ACCOUNTS 5", createdDate: "22/08/2026 08:07 PM", isEmailSent: "FALSE", emailSentCount: 0 },
  { srNo: 17, invoiceNumber: "AXC SKT-C-RUN 472", customerName: "AXC SKT", customerType: "CORPORATE", invoiceDate: "22/08/2026", grandTotal: "586.95", shipperCode: "", createdBy: "ACCOUNTS 2", createdDate: "22/08/2026 07:03 PM", isEmailSent: "FALSE", emailSentCount: 0 },
  { srNo: 18, invoiceNumber: "AXC SKT-C-RUN 471", customerName: "AXC SKT", customerType: "CORPORATE", invoiceDate: "22/08/2026", grandTotal: "789.85", shipperCode: "", createdBy: "ACCOUNTS 2", createdDate: "22/08/2026 07:02 PM", isEmailSent: "FALSE", emailSentCount: 0 },
  { srNo: 19, invoiceNumber: "SKY SHIP COURIER CB RUN 62", customerName: "AXC COUNTER BOOKING", customerType: "CORPORATE", invoiceDate: "22/08/2026", grandTotal: "322430", shipperCode: "SKT", createdBy: "ACCOUNTS 5", createdDate: "22/08/2026 05:36 AM", isEmailSent: "FALSE", emailSentCount: 0 },
  { srNo: 20, invoiceNumber: "EASTERN FREIGHT RUN 129", customerName: "EASTERN FREIGHT & LOGISTICS", customerType: "CORPORATE", invoiceDate: "22/08/2026", grandTotal: "819443", shipperCode: "", createdBy: "ACCOUNTS 4", createdDate: "22/08/2026 03:51 AM", isEmailSent: "FALSE", emailSentCount: 0 },
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
export interface VendorInvoiceEntry {
  srNo: number;
  vendor: string;
  invoiceNumber: string;
  invoiceDate: string;
  missingAwbCount: number;
  createdDate: string;

  // Search & Filter fields
  referenceNo?: string;
  referenceName?: string;
  invoiceNo?: string;
  fromDate?: string;
  tillDate?: string;
  billingCompany?: string;
  currency?: string;
  currencyType?: string;
  importStatus?: string;
  calendarYear?: string;
}

export const VendorInvoiceHeading = [
  { label: "SR.NO.", key: "srNo" },
  { label: "VENDOR", key: "vendor" },
  { label: "INVOICE NUMBER", key: "invoiceNumber", sortable: true, truncate: false },
  { label: "INVOICE DATE", key: "invoiceDate", sortable: true },
  { label: "MISSING AWB COUNT", key: "missingAwbCount" },
  { label: "CREATED DATE", key: "createdDate", sortable: true },
  { label: "ACTION", key: "action" },
];

export const VendorInvoiceData: VendorInvoiceEntry[] = [
  {
    srNo: 1,
    vendor: "FEDEX",
    invoiceNumber: "609341850",
    invoiceDate: "",
    missingAwbCount: 31,
    createdDate: "06/06/2024 06:32 PM",
  },
  {
    srNo: 2,
    vendor: "FEDEX",
    invoiceNumber: "609341851",
    invoiceDate: "05/06/2024",
    missingAwbCount: 12,
    createdDate: "07/06/2024 10:15 AM",
  },
  {
    srNo: 3,
    vendor: "DHL",
    invoiceNumber: "DHL20240612",
    invoiceDate: "08/06/2024",
    missingAwbCount: 0,
    createdDate: "08/06/2024 11:45 AM",
  },
  {
    srNo: 4,
    vendor: "UPS",
    invoiceNumber: "UPS55821903",
    invoiceDate: "10/06/2024",
    missingAwbCount: 7,
    createdDate: "10/06/2024 02:20 PM",
  },
  {
    srNo: 5,
    vendor: "FEDEX",
    invoiceNumber: "609341902",
    invoiceDate: "12/06/2024",
    missingAwbCount: 45,
    createdDate: "12/06/2024 04:05 PM",
  },
  {
    srNo: 6,
    vendor: "ARAMEX",
    invoiceNumber: "ARX778120",
    invoiceDate: "15/06/2024",
    missingAwbCount: 3,
    createdDate: "15/06/2024 09:30 AM",
  },
  {
    srNo: 7,
    vendor: "DHL",
    invoiceNumber: "DHL20240625",
    invoiceDate: "20/06/2024",
    missingAwbCount: 19,
    createdDate: "21/06/2024 12:10 PM",
  },
  {
    srNo: 8,
    vendor: "UPS",
    invoiceNumber: "UPS55822417",
    invoiceDate: "24/06/2024",
    missingAwbCount: 0,
    createdDate: "24/06/2024 05:50 PM",
  },
  {
    srNo: 9,
    vendor: "FEDEX",
    invoiceNumber: "609342133",
    invoiceDate: "28/06/2024",
    missingAwbCount: 26,
    createdDate: "29/06/2024 10:40 AM",
  },
  {
    srNo: 10,
    vendor: "TNT",
    invoiceNumber: "TNT90314455",
    invoiceDate: "01/07/2024",
    missingAwbCount: 8,
    createdDate: "01/07/2024 03:25 PM",
  },
];

export interface SelectOption {
  label: string;
  value: string;
}

export interface VendorOption {
  code: string;
  name: string;
}

export const VendorOptions: VendorOption[] = [
  { code: "V001", name: "Vendor One" },
  { code: "V002", name: "Vendor Two" },
  { code: "V003", name: "Vendor Three" },
];

export const BillingCompanyOptions: SelectOption[] = [
  {
    label: "AXC INC - AMERICAN XPRESS COURIER",
    value: "AXC INC - AMERICAN XPRESS COURIER",
  },
];

export const CurrencyOptions: SelectOption[] = [
  { label: "PKR", value: "PKR" },
  { label: "USD", value: "USD" },
  { label: "AED", value: "AED" },
  { label: "EUR", value: "EUR" },
  { label: "GBP", value: "GBP" },
];

export const VendorSearchByOptions: SelectOption[] = [
  { label: "AWB 1", value: "awb1" },
  { label: "AWB 2", value: "awb2" },
  { label: "Parcel No.", value: "parcelNo" },
  { label: "Ref No.", value: "refNo" },
];

export const VendorInvoiceSample = {
  fileName: "vendor_invoice_sample.csv",
  content:
    "awb_number,forwarding_number,parcel_no,ref_no,weight,amount\n" +
    "AWB123456,FWD123456,PCL001,REF001,1.5,100\n",
};


export const timeFilterOptions = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
  { label: "Select Date", value: "date" },
  { label: "Select Day", value: "day" },
];

export const years = [
  { label: "2024", value: 2024 },
  { label: "2025", value: 2025 },
  { label: "2026", value: 2026 },
  { label: "2027", value: 2027 },
];

export const months = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

export const days = [
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
  { label: "Sunday", value: "Sunday" },
];

export interface Order {
  id: string;
  date: string;
  type: "B2B" | "B2C";
  status: string;
  amount?: string;
}

export interface Product {
  id: string;
  name: string;
  type: "B2B" | "B2C";
  growth: string;
  price?: string;
}

export interface Analytics {
  id: string;
  metric: string;
  growth: string;
  status: string;
}

export const orderColumns = [
  { key: "id", label: "Order ID" },
  { key: "date", label: "Date" },
  { key: "type", label: "Type" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action", align: "center" as const },
];

export const productColumns = [
  { key: "id", label: "Product ID" },
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "price", label: "Price" },
  { key: "growth", label: "Growth" },
];

export const analyticsColumns = [
  { key: "metric", label: "Metric" },
  { key: "growth", label: "Growth" },
  { key: "status", label: "Status" },
];

export const typeOptions = [
  { label: "All", value: "All" },
  { label: "B2B", value: "B2B" },
  { label: "B2C", value: "B2C" },
];

export const statusOptions = [
  { label: "All", value: "All" },
  { label: "Pending", value: "Pending" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

export const tabs = [
  { id: "recent", label: "Recent Orders", icon: FileText },
  { id: "top", label: "Top Products", icon: BarChart3 },
  { id: "analytics", label: "Analytics", icon: Database },
];

export const orders: Order[] = [
  { id: "#ORD-001", date: "2026-08-17", type: "B2B", status: "Completed", amount: "$1,200.00" },
  { id: "#ORD-002", date: "2026-08-16", type: "B2C", status: "Pending", amount: "$150.00" },
  { id: "#ORD-003", date: "2026-08-15", type: "B2B", status: "Completed", amount: "$2,400.00" },
  { id: "#ORD-004", date: "2026-08-15", type: "B2C", status: "Cancelled", amount: "$45.00" }
];

export const products: Product[] = [
  { id: "PROD-1", name: "Premium Plan", type: "B2B", growth: "+15%", price: "$299.00" },
  { id: "PROD-2", name: "Basic Plan", type: "B2C", growth: "+5%", price: "$29.00" },
  { id: "PROD-3", name: "Enterprise Plan", type: "B2B", growth: "+22%", price: "$999.00" }
];

export const analytics: Analytics[] = [
  { id: "A1", metric: "Conversion Rate", growth: "+2.4%", status: "Good" },
  { id: "A2", metric: "Bounce Rate", growth: "-1.2%", status: "Good" },
  { id: "A3", metric: "Active Users", growth: "+12%", status: "Excellent" }
];

export interface FilterGroupOption {
  group: string;
  sameColumnAsPrevious?: boolean;
  options: { label: string; value: string }[];
}

export const awbFilterCategories: FilterGroupOption[] = [
  {
    group: "AWB & Identification",
    options: [
      { label: "AWB Number", value: "awbNumber" },
      { label: "AWB Range", value: "awbRange" },
      { label: "Forwarding Number", value: "forwardingNumber" },
      { label: "Forwarding Number 2", value: "forwardingNumber2" },
      { label: "Reference Number", value: "referenceNumber" },
      { label: "Reference Name", value: "referenceName" },
      { label: "FedEx Reference Number", value: "fedexReference" },
      { label: "USPS Number", value: "uspsNumber" },
      { label: "Bag Number", value: "bagNumber" },
      { label: "Run Number", value: "runNumber" },
      { label: "Runsheet No", value: "runsheetNo" },
      { label: "Parcel Number", value: "parcelNumber" },
      { label: "ID", value: "id" },
    ],
  },
  {
    group: "Customer & Accounts",
    options: [
      { label: "Customer Code", value: "customerCode" },
      { label: "Customer Name", value: "customer" },
      { label: "Parent Customer Code", value: "parentCustomerCode" },
      { label: "Customer Type", value: "customerType" },
      { label: "Vendor Code", value: "vendorCode" },
      { label: "Vendor Name", value: "vendor" },
      { label: "Forwarder Code", value: "forwarderCode" },
      { label: "Created By Email", value: "createdByEmail" },
    ],
  },
  {
    group: "Origin & Destination",
    options: [
      { label: "Origin Code", value: "originCode" },
      { label: "Origin Hub Code", value: "originHubCode" },
      { label: "Origin", value: "origin" },
      { label: "Destination Code", value: "destinationCode" },
      { label: "Destination City", value: "destinationCity" },
      { label: "Destination Hub Code", value: "destinationHubCode" },
      { label: "Destination", value: "destination" },
    ],
  },
  {
    group: "Shipper Details",
    options: [
      { label: "Shipper Code", value: "shipperCode" },
      { label: "Shipper Name", value: "shipper" },
      { label: "Shipper Company Name", value: "shipperCompanyName" },
      { label: "Shipper City", value: "shipperCity" },
      { label: "Shipper State", value: "shipperState" },
      { label: "Shipper Contact", value: "shipperContact" },
      { label: "Shipper Pincode", value: "shipperPincode" },
    ],
  },
  {
    group: "Consignee Details",
    options: [
      { label: "Consignee Code", value: "consigneeCode" },
      { label: "Consignee Name", value: "consignee" },
      { label: "Consignee Company Name", value: "consigneeCompanyName" },
      { label: "Consignee Contact", value: "consigneeContact" },
      { label: "Consignee State", value: "consigneeState" },
      { label: "Consignee Pincode", value: "consigneePincode" },
    ],
  },
  {
    group: "Dates & Timelines",
    options: [
      { label: "Booking Date", value: "bookingDate" },
      { label: "Booking Time", value: "bookingTime" },
      { label: "Created Date", value: "createdDate" },
      { label: "Inscan Date", value: "inscanDate" },
      { label: "Inscan & Incoming Inscan Date", value: "incomingInscanDate" },
      { label: "Manifest Date", value: "manifestDate" },
      { label: "Invoice Date", value: "invoiceDate" },
      { label: "Void Date", value: "voidDate" },
    ],
  },
  {
    group: "Shipment, Service & Status",
    options: [
      { label: "AWB State", value: "awbState" },
      { label: "AWB Status", value: "status" },
      { label: "Mode", value: "mode" },
      { label: "Service Code", value: "serviceCode" },
      { label: "Service Type", value: "serviceType" },
      { label: "Shipment Type", value: "shipmentType" },
      { label: "Dispatch Type", value: "dispatchType" },
      { label: "Product Code", value: "productCode" },
      { label: "Product", value: "product" },
      { label: "Content", value: "content" },
      { label: "Insurance Type", value: "insuranceType" },
      { label: "Company", value: "company" },
      { label: "Print By Company", value: "printByCompany" },
      { label: "Calendar Year", value: "calendarYear" },
      { label: "Invoice Created", value: "invoiceCreated" },
      { label: "Invoice Number", value: "invoiceNumber" },
      { label: "Weight Range", value: "weightRange" },
      { label: "Freight Range", value: "freightRange" },
      { label: "Remarks", value: "remarks" },
      { label: "Instructions", value: "instructions" },
      { label: "Show Un-Inscanned AWBs", value: "showUninscanned" },
    ],
  },
];

export const awbFilterGroups: FilterGroupOption[] = [
  {
    group: "By Date",
    options: [
      { label: "Today", value: "Today" },
      { label: "Yesterday", value: "Yesterday" },
      { label: "Last 7 days", value: "Last 7 days" },
      { label: "Custom", value: "Custom" },
    ],
  },
  {
    group: "Origin Hub",
    options: [
      { label: "CANADA", value: "CANADA" },
      { label: "DELHI", value: "DELHI" },
      { label: "DHAKA", value: "DHAKA" },
      { label: "DUBAI", value: "DUBAI" },
      { label: "ISLAMABAD", value: "ISLAMABAD" },
      { label: "JFK", value: "JFK" },
      { label: "KARACHI", value: "KARACHI" },
      { label: "KATHMANDU", value: "KATHMANDU" },
      { label: "LAHORE", value: "LAHORE" },
      { label: "MUMBAI", value: "MUMBAI" },
      { label: "PESHAWAR", value: "PESHAWAR" },
      { label: "SIALKOT", value: "SIALKOT" },
    ],
  },
  {
    group: "AWB State",
    options: [
      { label: "ENTRY", value: "ENTRY" },
      { label: "PICK UP SCAN", value: "PICK UP SCAN" },
      { label: "IN SCAN", value: "IN SCAN" },
      { label: "MANIFEST", value: "MANIFEST" },
      { label: "IN-COMING MANIFEST", value: "IN-COMING MANIFEST" },
      { label: "REMANIFEST", value: "REMANIFEST" },
      { label: "DRS", value: "DRS" },
      { label: "UNDELIVERED", value: "UNDELIVERED" },
      { label: "REDRS", value: "REDRS" },
      { label: "DELIVERED", value: "DELIVERED" },
      { label: "MISSPLACED", value: "MISSPLACED" },
      { label: "RTO", value: "RTO" },
      { label: "CANCELLED", value: "CANCELLED" },
      { label: "INTRANSIT", value: "INTRANSIT" },
      { label: "TRANSFER MANIFEST", value: "TRANSFER MANIFEST" },
      { label: "INCOMING TRANSFER MANIFEST", value: "INCOMING TRANSFER MANIFEST" },
      { label: "UNDELIVERED/INTRANSIT-RTO", value: "UNDELIVERED/INTRANSIT-RTO" },
      { label: "UNDELIVERED/RESCHEDULE", value: "UNDELIVERED/RESCHEDULE" },
      { label: "RTO/TO SHIPPER", value: "RTO/TO SHIPPER" },
    ],
  },
  {
    group: "AWB STATUS",
    options: [
      { label: "OPEN", value: "OPEN" },
      { label: "LOCKED", value: "LOCKED" },
      { label: "VOID", value: "VOID" },
      { label: "HOLD", value: "HOLD" },
      { label: "RTO", value: "RTO" },
    ],
  },
  {
    group: "Destination Hub",
    options: [
      { label: "CANADA", value: "CANADA" },
      { label: "DELHI", value: "DELHI" },
      { label: "DUBAI", value: "DUBAI" },
      { label: "FRANKFURT", value: "FRANKFURT" },
      { label: "ISLAMABAD", value: "ISLAMABAD" },
      { label: "JFK / NEW YORK", value: "UNITED STATES OF AMERICA" },
      { label: "KARACHI", value: "KARACHI" },
      { label: "LAHORE", value: "LAHORE" },
      { label: "LONDON", value: "UNITED KINGDOM" },
      { label: "MUMBAI", value: "MUMBAI" },
      { label: "SINGAPORE", value: "SINGAPORE" },
    ],
  },
  {
    group: "Company",
    options: [
      { label: "AXC Express", value: "AXC Express" },
      { label: "ELS Logistics", value: "ELS Logistics" },
      { label: "FedEx Cargo", value: "FedEx Cargo" },
      { label: "TCS Express", value: "TCS Express" },
      { label: "DHL Express", value: "DHL Express" },
    ],
  },
  {
    group: "Calendar Year",
    sameColumnAsPrevious: true,
    options: [
      { label: "2026", value: "2026" },
      { label: "2025", value: "2025" },
      { label: "2024", value: "2024" },
    ],
  },
  {
    group: "SHIPMENT TYPE",
    options: [
      { label: "CSB-V", value: "CSB-V" },
      { label: "COMMERCIAL", value: "COMMERCIAL" },
    ],
  },
  {
    group: "SERVICE TYPE",
    sameColumnAsPrevious: true,
    options: [
      { label: "INTERNATIONAL", value: "INTERNATIONAL" },
      { label: "DOMESTIC", value: "DOMESTIC" },
    ],
  },
];

export const awbFilterOptions = [
  { label: "SKT - Sialkot", value: "SKT" },
  { label: "BOM - Mumbai", value: "BOM" },
  { label: "DEL - Delhi", value: "DEL" },
  { label: "DXB - Dubai", value: "DXB" },
  { label: "KHI - Karachi", value: "KHI" },
  { label: "LHE - Lahore", value: "LHE" },
  { label: "ISB - Islamabad", value: "ISB" },
  { label: "JFK - New York", value: "JFK" },
  { label: "LHR - London", value: "LHR" },
  { label: "SIN - Singapore", value: "SIN" },
  { label: "HKG - Hong Kong", value: "HKG" },
];

export const HUB_COUNTRY_MAP: Record<string, { country: string; aliases: string[] }> = {
  karachi: {
    country: "PAKISTAN",
    aliases: ["pakistan", "karachi", "khi", "pk"],
  },
  lahore: {
    country: "PAKISTAN",
    aliases: ["pakistan", "lahore", "lhe", "pk"],
  },
  islamabad: {
    country: "PAKISTAN",
    aliases: ["pakistan", "islamabad", "isb", "pk"],
  },
  peshawar: {
    country: "PAKISTAN",
    aliases: ["pakistan", "peshawar", "pew", "pk"],
  },
  sialkot: {
    country: "PAKISTAN",
    aliases: ["pakistan", "sialkot", "skt", "pk"],
  },
  delhi: {
    country: "INDIA",
    aliases: ["india", "delhi", "new delhi", "del", "in"],
  },
  mumbai: {
    country: "INDIA",
    aliases: ["india", "mumbai", "bom", "in"],
  },
  dubai: {
    country: "UNITED ARAB EMIRATES",
    aliases: ["united arab emirates", "uae", "dubai", "dxb", "emirates"],
  },
  canada: {
    country: "CANADA",
    aliases: ["canada", "can", "yyz", "toronto", "vancouver"],
  },
  jfk: {
    country: "UNITED STATES OF AMERICA",
    aliases: ["united states of america", "united states", "usa", "us", "new york", "jfk"],
  },
  dhaka: {
    country: "BANGLADESH",
    aliases: ["bangladesh", "dhaka", "dac", "bd"],
  },
  kathmandu: {
    country: "NEPAL",
    aliases: ["nepal", "kathmandu", "ktm", "np"],
  },
};

export interface ManifestChargeRow {
  id: number;
  type: string;
  coLoader: string;
  vendor: string;
  company: string;
  charge: string;
  amount: string;
  remark: string;
}

export interface AccountItem {
  id: string;
  description: string;
  originalAmount: number;
  revisedAmount: number;
  adjustmentAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export interface AccountEntry {
  srNo?: number;
  noteNumber: string;
  noteType: "Credit Note" | "Debit Note";
  partyType: "Customer" | "Vendor";
  partyName: string;
  partyCode?: string;
  customerCode?: string;
  partyGstin?: string;
  partyEmail?: string;
  partyPhone?: string;
  noteDate: string;
  dueDate?: string;
  refDocType: "Invoice" | "AWB" | "Manifest" | "Direct";
  refDocNumber: string;
  awbNumber?: string;
  forwardingNumber?: string;
  refDocDate?: string;
  originalAmount: number;
  taxableAmount: number;
  taxAmount: number;
  grandTotal: number;
  currency?: string;
  reason: string;
  status: "Approved" | "Pending" | "Draft" | "Adjusted" | "Cancelled";
  eInvoiceStatus?: "SYNCED" | "NOT_SYNCED" | "CANCELED";
  branch?: string;
  company?: string;
  createdBy: string;
  createdDate: string;
  remarks?: string;
  items?: AccountItem[];
}

export const AccountHeading = [
  { label: "SR.NO.", key: "srNo" },
  { label: "SELECT NOTE", key: "selectNote" },
  { label: "NOTE NUMBER", key: "noteNumber", sortable: true, truncate: false },
  { label: "TYPE", key: "noteType", sortable: true, truncate: false },
  { label: "NOTE DATE", key: "noteDate", sortable: true },
  { label: "CUSTOMER CODE", key: "customerCode", sortable: true, truncate: false },
  { label: "CUSTOMER / VENDOR", key: "partyName", sortable: true, truncate: false },
  { label: "AWB NUMBER", key: "awbNumber", sortable: true, truncate: false },
  { label: "REF DOC NO", key: "refDocNumber", sortable: true, truncate: false },
  { label: "ORIGINAL AMOUNT", key: "originalAmount", sortable: true },
  { label: "ADJUSTMENT TOTAL", key: "grandTotal", sortable: true, className: "font-bold" },
  { label: "REASON", key: "reason", sortable: true, truncate: false },
  { label: "E-INVOICE", key: "eInvoiceStatus", sortable: true },
  { label: "STATUS", key: "status", sortable: true },
  { label: "CREATED BY", key: "createdBy", sortable: true },
  { label: "ACTION", key: "action" },
];

export const initialAccountData: AccountEntry[] = [
  {
    srNo: 1,
    noteNumber: "CN-2026-001",
    noteType: "Credit Note",
    partyType: "Customer",
    partyName: "AURA LOGISTICS CB",
    partyCode: "SKT-AL-01",
    customerCode: "SKT-AL-01",
    partyGstin: "03AAACA1234A1Z5",
    partyEmail: "billing@auralogistics.com",
    partyPhone: "+92 300 1234567",
    noteDate: "14/10/2026",
    dueDate: "28/10/2026",
    refDocType: "Invoice",
    refDocNumber: "AURA LOGISTICS CB RUN 07",
    awbNumber: "AWB-7821901",
    forwardingNumber: "FWD-90112",
    refDocDate: "22/08/2026",
    originalAmount: 30550,
    taxableAmount: 2500,
    taxAmount: 450,
    grandTotal: 2950,
    currency: "PKR",
    reason: "Rate Difference / Overbilling",
    status: "Approved",
    eInvoiceStatus: "SYNCED",
    branch: "Sialkot Hub",
    createdBy: "ACCOUNTS 5",
    createdDate: "14/10/2026 04:30 PM",
    remarks: "Agreed special corporate discount rate applied after invoice review.",
    items: [
      {
        id: "1",
        description: "Weight & Rate Differential Adjustment",
        originalAmount: 30550,
        revisedAmount: 28050,
        adjustmentAmount: 2500,
        taxRate: 18,
        taxAmount: 450,
        total: 2950,
      },
    ],
  },
  {
    srNo: 2,
    noteNumber: "DN-2026-002",
    noteType: "Debit Note",
    partyType: "Customer",
    partyName: "MASTER LEATHER CB",
    partyCode: "SKT-ML-02",
    customerCode: "SKT-ML-02",
    partyGstin: "03AAACM5678B1Z2",
    partyEmail: "accounts@masterleather.com",
    partyPhone: "+92 321 9876543",
    noteDate: "13/10/2026",
    dueDate: "27/10/2026",
    refDocType: "AWB",
    refDocNumber: "30128763",
    awbNumber: "30128763",
    forwardingNumber: "FWD-76342",
    refDocDate: "20/07/2026",
    originalAmount: 10420,
    taxableAmount: 1800,
    taxAmount: 324,
    grandTotal: 2124,
    currency: "PKR",
    reason: "Weight Discrepancy (Volumetric Re-weight)",
    status: "Approved",
    eInvoiceStatus: "NOT_SYNCED",
    branch: "Sialkot Hub",
    createdBy: "ACCOUNTS 4",
    createdDate: "13/10/2026 11:15 AM",
    remarks: "Actual volumetric weight 4.5kg verified vs billed 2.5kg.",
    items: [
      {
        id: "1",
        description: "Volumetric Weight Differential (+2.0 KG)",
        originalAmount: 10420,
        revisedAmount: 12220,
        adjustmentAmount: 1800,
        taxRate: 18,
        taxAmount: 324,
        total: 2124,
      },
    ],
  },
  {
    srNo: 3,
    noteNumber: "CN-2026-003",
    noteType: "Credit Note",
    partyType: "Vendor",
    partyName: "FEDEX IP EX NEW YORK",
    partyCode: "VND-FDX-09",
    customerCode: "VND-FDX-09",
    partyGstin: "99FEDEX9999Z0",
    partyEmail: "claims.apac@fedex.com",
    partyPhone: "+1 800 463 3339",
    noteDate: "12/10/2026",
    dueDate: "26/10/2026",
    refDocType: "Invoice",
    refDocNumber: "FDX-210588750",
    awbNumber: "AWB-4412980",
    forwardingNumber: "FWD-44129",
    refDocDate: "05/09/2026",
    originalAmount: 85200,
    taxableAmount: 5400,
    taxAmount: 972,
    grandTotal: 6372,
    currency: "PKR",
    reason: "Fuel Surcharge Rebate",
    status: "Adjusted",
    eInvoiceStatus: "SYNCED",
    branch: "Karachi Hub",
    createdBy: "ACCOUNTS 2",
    createdDate: "12/10/2026 02:40 PM",
    remarks: "Monthly fuel index recalculation approved by vendor manager.",
    items: [
      {
        id: "1",
        description: "Fuel Surcharge Monthly Index Credit (Q3)",
        originalAmount: 85200,
        revisedAmount: 79800,
        adjustmentAmount: 5400,
        taxRate: 18,
        taxAmount: 972,
        total: 6372,
      },
    ],
  },
  {
    srNo: 4,
    noteNumber: "CN-2026-004",
    noteType: "Credit Note",
    partyType: "Customer",
    partyName: "STANDARD CARGO CB",
    partyCode: "SKT-SC-01",
    customerCode: "SKT-SC-01",
    partyGstin: "03AAACS3344C1Z9",
    partyEmail: "finance@standardcargo.pk",
    partyPhone: "+92 333 4455667",
    noteDate: "11/10/2026",
    dueDate: "25/10/2026",
    refDocType: "Invoice",
    refDocNumber: "STANDARD CARGO CB RUN 01",
    awbNumber: "AWB-6623910",
    forwardingNumber: "FWD-66239",
    refDocDate: "22/08/2026",
    originalAmount: 8830,
    taxableAmount: 1200,
    taxAmount: 216,
    grandTotal: 1416,
    currency: "PKR",
    reason: "Service Delay Compensation",
    status: "Approved",
    eInvoiceStatus: "CANCELED",
    branch: "Lahore Hub",
    createdBy: "ACCOUNTS 4",
    createdDate: "11/10/2026 05:10 PM",
    remarks: "SLA delivery threshold exceeded by 48 hours for London shipment.",
    items: [
      {
        id: "1",
        description: "Express Service Guarantee SLA Penalty Credit",
        originalAmount: 8830,
        revisedAmount: 7630,
        adjustmentAmount: 1200,
        taxRate: 18,
        taxAmount: 216,
        total: 1416,
      },
    ],
  },
  {
    srNo: 5,
    noteNumber: "DN-2026-005",
    noteType: "Debit Note",
    partyType: "Vendor",
    partyName: "DHL EXPRESS GLOBAL",
    partyCode: "VND-DHL-01",
    customerCode: "VND-DHL-01",
    partyGstin: "07AAACD1122D1Z4",
    partyEmail: "invoicing.me@dhl.com",
    partyPhone: "+971 4 299 5555",
    noteDate: "10/10/2026",
    dueDate: "24/10/2026",
    refDocType: "Manifest",
    refDocNumber: "MNF-2026-8841",
    awbNumber: "AWB-1192834",
    forwardingNumber: "FWD-11928",
    refDocDate: "15/09/2026",
    originalAmount: 159380,
    taxableAmount: 8200,
    taxAmount: 1476,
    grandTotal: 9676,
    currency: "PKR",
    reason: "Customs Duty & Clearance Adjustment",
    status: "Pending",
    eInvoiceStatus: "NOT_SYNCED",
    branch: "Dubai Hub",
    createdBy: "ACCOUNTS 5",
    createdDate: "10/10/2026 09:20 AM",
    remarks: "Supplementary customs fee assessed at destination gateway.",
    items: [
      {
        id: "1",
        description: "Customs Examination & Clearance Duty Supplementary Charge",
        originalAmount: 159380,
        revisedAmount: 167580,
        adjustmentAmount: 8200,
        taxRate: 18,
        taxAmount: 1476,
        total: 9676,
      },
    ],
  },
  {
    srNo: 6,
    noteNumber: "CN-2026-006",
    noteType: "Credit Note",
    partyType: "Customer",
    partyName: "NA LOGISTICS CB",
    partyCode: "SKT-NA-62",
    customerCode: "SKT-NA-62",
    partyGstin: "03AAACN9988N1Z1",
    partyEmail: "ops@nalogistics.com",
    partyPhone: "+92 301 5566778",
    noteDate: "09/10/2026",
    dueDate: "23/10/2026",
    refDocType: "Invoice",
    refDocNumber: "NA LOGISTICS CB RUN 62",
    awbNumber: "AWB-8837192",
    forwardingNumber: "FWD-88371",
    refDocDate: "22/08/2026",
    originalAmount: 159380,
    taxableAmount: 14500,
    taxAmount: 2610,
    grandTotal: 17110,
    currency: "PKR",
    reason: "Volume Rebate Discount",
    status: "Approved",
    eInvoiceStatus: "SYNCED",
    branch: "Sialkot Hub",
    createdBy: "ACCOUNTS 5",
    createdDate: "09/10/2026 01:15 PM",
    remarks: "Quarterly target milestone volume discount achieved (1500+ AWBs).",
    items: [
      {
        id: "1",
        description: "Tier 1 Quarterly Volume Rebate Incentive",
        originalAmount: 159380,
        revisedAmount: 144880,
        adjustmentAmount: 14500,
        taxRate: 18,
        taxAmount: 2610,
        total: 17110,
      },
    ],
  },
  {
    srNo: 7,
    noteNumber: "DN-2026-007",
    noteType: "Debit Note",
    partyType: "Customer",
    partyName: "XS COURIER CB",
    partyCode: "SKT-XS-16",
    customerCode: "SKT-XS-16",
    partyGstin: "03AAACX5566X1Z8",
    partyEmail: "accounts@xscourier.com",
    partyPhone: "+92 345 6677889",
    noteDate: "08/10/2026",
    dueDate: "22/10/2026",
    refDocType: "AWB",
    refDocNumber: "30128769",
    awbNumber: "30128769",
    forwardingNumber: "FWD-30128",
    refDocDate: "18/07/2026",
    originalAmount: 96520,
    taxableAmount: 4200,
    taxAmount: 756,
    grandTotal: 4956,
    currency: "PKR",
    reason: "Remote Area / Delivery Surcharge",
    status: "Pending",
    eInvoiceStatus: "SYNCED",
    branch: "Peshawar Hub",
    createdBy: "ACCOUNTS 1",
    createdDate: "08/10/2026 03:50 PM",
    remarks: "Out of Delivery Area (ODA) surcharge levied by forwarder.",
    items: [
      {
        id: "1",
        description: "ODA Extended Delivery Postal Code Surcharge",
        originalAmount: 96520,
        revisedAmount: 100720,
        adjustmentAmount: 4200,
        taxRate: 18,
        taxAmount: 756,
        total: 4956,
      },
    ],
  },
  {
    srNo: 8,
    noteNumber: "CN-2026-008",
    noteType: "Credit Note",
    partyType: "Customer",
    partyName: "AYAAN INTERNATIONAL",
    partyCode: "SKT-AY-02",
    customerCode: "SKT-AY-02",
    partyGstin: "03AAACA7788A1Z3",
    partyEmail: "shipments@ayaanintl.com",
    partyPhone: "+92 300 7788990",
    noteDate: "07/10/2026",
    dueDate: "21/10/2026",
    refDocType: "Invoice",
    refDocNumber: "AYAAN INTERNATIONAL CB RUN 02",
    awbNumber: "AWB-5529103",
    forwardingNumber: "FWD-55291",
    refDocDate: "22/08/2026",
    originalAmount: 71330,
    taxableAmount: 3500,
    taxAmount: 630,
    grandTotal: 4130,
    currency: "PKR",
    reason: "Damaged Package Claim",
    status: "Approved",
    eInvoiceStatus: "NOT_SYNCED",
    branch: "Sialkot Hub",
    createdBy: "ACCOUNTS 3",
    createdDate: "07/10/2026 10:05 AM",
    remarks: "Settlement for box outer crush damage verified via POD inspection.",
    items: [
      {
        id: "1",
        description: "Damage Claim Reimbursement (Claim Ref: CLM-8891)",
        originalAmount: 71330,
        revisedAmount: 67830,
        adjustmentAmount: 3500,
        taxRate: 18,
        taxAmount: 630,
        total: 4130,
      },
    ],
  },
  {
    srNo: 9,
    noteNumber: "DN-2026-009",
    noteType: "Debit Note",
    partyType: "Customer",
    partyName: "CAPITAL COURIER CB",
    partyCode: "SKT-CC-14",
    customerCode: "SKT-CC-14",
    partyGstin: "03AAACC1133C1Z7",
    partyEmail: "capital@courier.pk",
    partyPhone: "+92 322 3344556",
    noteDate: "06/10/2026",
    dueDate: "20/10/2026",
    refDocType: "Invoice",
    refDocNumber: "CAPITAL COURIER CB RUN 14",
    awbNumber: "AWB-3391827",
    forwardingNumber: "FWD-33918",
    refDocDate: "22/08/2026",
    originalAmount: 42300,
    taxableAmount: 2100,
    taxAmount: 378,
    grandTotal: 2478,
    currency: "PKR",
    reason: "Address Correction Surcharge",
    status: "Draft",
    eInvoiceStatus: "CANCELED",
    branch: "Islamabad Hub",
    createdBy: "ACCOUNTS 5",
    createdDate: "06/10/2026 06:12 PM",
    remarks: "Consignee address correction fee billed by DHL destination depot.",
    items: [
      {
        id: "1",
        description: "Consignee Postal Routing Correction Fee",
        originalAmount: 42300,
        revisedAmount: 44400,
        adjustmentAmount: 2100,
        taxRate: 18,
        taxAmount: 378,
        total: 2478,
      },
    ],
  },
  {
    srNo: 10,
    noteNumber: "CN-2026-010",
    noteType: "Credit Note",
    partyType: "Vendor",
    partyName: "EMIRATES SKYCARGO",
    partyCode: "VND-EK-05",
    customerCode: "VND-EK-05",
    partyGstin: "99EKCARGO123",
    partyEmail: "skycargo.billing@emirates.com",
    partyPhone: "+971 4 707 1111",
    noteDate: "05/10/2026",
    dueDate: "19/10/2026",
    refDocType: "Direct",
    refDocNumber: "DIR-EK-9921",
    awbNumber: "AWB-2281934",
    forwardingNumber: "FWD-22819",
    refDocDate: "01/10/2026",
    originalAmount: 420000,
    taxableAmount: 22000,
    taxAmount: 3960,
    grandTotal: 25960,
    currency: "PKR",
    reason: "Offloaded Cargo Credit Refund",
    status: "Adjusted",
    eInvoiceStatus: "SYNCED",
    branch: "Dubai Hub",
    createdBy: "ACCOUNTS 2",
    createdDate: "05/10/2026 12:30 PM",
    remarks: "Offloaded freight credit note issued by airline carrier.",
    items: [
      {
        id: "1",
        description: "Flight EK-621 Offloaded Net Cargo Weight Credit",
        originalAmount: 420000,
        revisedAmount: 398000,
        adjustmentAmount: 22000,
        taxRate: 18,
        taxAmount: 3960,
        total: 25960,
      },
    ],
  },
  {
    srNo: 11,
    noteNumber: "DN-2026-011",
    noteType: "Debit Note",
    partyType: "Customer",
    partyName: "SWIFTSHIP COURIER CB",
    partyCode: "SKT-SS-58",
    customerCode: "SKT-SS-58",
    partyGstin: "03AAACS8899S1Z4",
    partyEmail: "swift@courier.com",
    partyPhone: "+92 312 4455667",
    noteDate: "04/10/2026",
    dueDate: "18/10/2026",
    refDocType: "AWB",
    refDocNumber: "30128775",
    awbNumber: "30128775",
    forwardingNumber: "FWD-30129",
    refDocDate: "20/07/2026",
    originalAmount: 40800,
    taxableAmount: 1950,
    taxAmount: 351,
    grandTotal: 2301,
    currency: "PKR",
    reason: "Additional Fuel Adjustment",
    status: "Approved",
    eInvoiceStatus: "SYNCED",
    branch: "Karachi Hub",
    createdBy: "ACCOUNTS 4",
    createdDate: "04/10/2026 02:22 PM",
    remarks: "Mid-month airline fuel escalation recovery.",
    items: [
      {
        id: "1",
        description: "Fuel Surcharge Differential Recovery",
        originalAmount: 40800,
        revisedAmount: 42750,
        adjustmentAmount: 1950,
        taxRate: 18,
        taxAmount: 351,
        total: 2301,
      },
    ],
  },
  {
    srNo: 12,
    noteNumber: "CN-2026-012",
    noteType: "Credit Note",
    partyType: "Customer",
    partyName: "KUNHAR LOGISTIC CB",
    partyCode: "SKT-KL-09",
    customerCode: "SKT-KL-09",
    partyGstin: "03AAACK4455K1Z6",
    partyEmail: "billing@kunhar.com",
    partyPhone: "+92 300 9988776",
    noteDate: "03/10/2026",
    dueDate: "17/10/2026",
    refDocType: "Invoice",
    refDocNumber: "KUNHAR LOGISTIC CB RUN 09",
    awbNumber: "AWB-9912045",
    forwardingNumber: "FWD-99120",
    refDocDate: "22/08/2026",
    originalAmount: 126950,
    taxableAmount: 6000,
    taxAmount: 1080,
    grandTotal: 7080,
    currency: "PKR",
    reason: "Billing Discrepancy",
    status: "Draft",
    eInvoiceStatus: "NOT_SYNCED",
    branch: "Sialkot Hub",
    createdBy: "ACCOUNTS 1",
    createdDate: "03/10/2026 04:45 PM",
    remarks: "Double-counted carton packaging fee adjustment pending manager signature.",
    items: [
      {
        id: "1",
        description: "Special Packaging Material Correction",
        originalAmount: 126950,
        revisedAmount: 120950,
        adjustmentAmount: 6000,
        taxRate: 18,
        taxAmount: 1080,
        total: 7080,
      },
    ],
  },
];

export const accountFilterGroups = [
  {
    group: "Note Type",
    options: [
      { label: "Credit Note", value: "credit note" },
      { label: "Debit Note", value: "debit note" },
    ],
  },
  {
    group: "E-Invoice Status",
    options: [
      { label: "SYNCED", value: "SYNCED" },
      { label: "NOT_SYNCED", value: "NOT_SYNCED" },
      { label: "CANCELED", value: "CANCELED" },
    ],
  },
  {
    group: "Date Range",
    options: [
      { label: "Today", value: "today" },
      { label: "Yesterday", value: "yesterday" },
      { label: "Last 7 Days", value: "last 7 days" },
      { label: "Custom", value: "Custom" },
    ],
  },
];
