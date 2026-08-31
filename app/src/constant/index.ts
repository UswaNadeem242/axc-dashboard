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
  // { label: "Tracking", icon: MapPin, id: "tracking" },
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
  { srNo: 1, manifestNo: "1363",
    vendor: "", vendorName: "",
    originHubCode: "SKT", 
    destinationHubName: "JFK", 
    destinationHubCode: "JFK",
    forwarderCode: "",
    runNumber:  "AXC SIALKOT RUN 469", 
    masterEdiBagNo: "", 
    manifestDate: "19-08-2026", 
    vehicleNo: "", 
    noOfBags: 72, 
    weight: "1411.6" },
  { srNo: 2, 
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
    weight: "1799.1" },
  { srNo: 3, 
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
    weight: "2000.0" },
  { srNo: 4, 
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
    weight: "2420.1" },
  { srNo: 5, 
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
    weight: "2456.1" },
  { srNo: 6, 
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
    weight: "2484.2" },
  { srNo: 7, 
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
    weight: "2481.3" },
  { srNo: 8, 
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
    weight: "2391.0" },
  { srNo: 9, 
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
    weight: "1490.3" },
  { srNo: 10, 
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
    weight: "1348.8" },
  { srNo: 11, 
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
    weight: "2405.1" },
  { srNo: 12, 
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
    weight: "2471.3" },
  { srNo: 13, 
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
     weight: "2386.3" },
  { srNo: 14, 
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
    weight: "2497.9" },
  { srNo: 15, 
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
    weight: "2506.3" },
  { srNo: 16, 
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
    weight: "2219.5" },
  { srNo: 17, 
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
    weight: "2492.1" },
  { srNo: 18, 
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
    weight: "2491.5" },
  { srNo: 19, 
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
    weight: "2491.3" },
  { srNo: 20, 
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
    weight: "1395.3" },
];

export interface InvoiceEntry {
  srNo: number;
  invoiceNumber: string;
  customerName: string;
  customerType: string;
  invoiceDate: string;
  grandTotal: string;
  shipperCode: string;
  createdBy: string;
  createdDate: string;
  isEmailSent: string;
  emailSentCount: number;
}

export const InvoiceHeading = [
  { label: "SR.NO.", key: "srNo" },
  { label: "INVOICE NUMBER", key: "invoiceNumber", sortable: true, truncate: false },
  { label: "CUSTOMER NAME", key: "customerName", truncate: false },
  { label: "CUSTOMER TYPE", key: "customerType" },
  { label: "INVOICE DATE", key: "invoiceDate", sortable: true },
  { label: "GRAND TOTAL", key: "grandTotal", className: "font-bold" },
  { label: "SHIPPER CODE", key: "shipperCode" },
  { label: "CREATED BY", key: "createdBy" },
  { label: "CREATED DATE", key: "createdDate", sortable: true },
  { label: "IS EMAIL SENT", key: "isEmailSent" },
  { label: "EMAIL SENT COUNT", key: "emailSentCount" },
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

export const awbFilterOptions = [
  { label: "Select", value: "" },
  ...awbFilterCategories.flatMap((cat) => cat.options),
];