export interface CustomerContractEntry {
  id: string;
  createdAt: string;

  // Left column fields
  customer: string;
  customerCode?: string;
  service: string;
  serviceCode?: string;
  product: string;
  productCode?: string;
  airline: string;
  airlineCode?: string;
  flight: string;
  flightCode?: string;
  vendor: string;
  vendorCode?: string;
  destinationZone: string;
  destinationZoneCode?: string;
  destination: string;
  destinationCode?: string;
  destinationCity: string;
  destinationCityCode?: string;
  destinationState: string;
  destinationStateCode?: string;
  destinationHub: string;
  contractType: string;
  incoterm: string;
  status: "ACTIVE" | "INACTIVE";

  // Right column fields
  originZone: string;
  origin: string;
  originCode?: string;
  originCity: string;
  originCityCode?: string;
  originState: string;
  originStateCode?: string;
  originHub: string;
  effectiveFrom: string;
  effectiveTo: string;
  remarks: string;
  notes: string;
  calculationMethod: string;
  tat: string;
  minimumFreight: string;
  rateItems?: ContractRateItem[];
}

export interface ContractRateItem {
  id: number;
  srNo: number;
  onAddition: string;
  lowerWtBox: string;
  upperWtBox: string;
  rate: string;
}

export const CONTRACT_TYPE_OPTIONS = [
  { value: "Weight Wise", label: "Weight Wise" },
  { value: "Box Wise", label: "Box Wise" },
];

export const INCOTERM_OPTIONS = [
  { value: "", label: "SELECT INCOTERM.." },
  { value: "EXW", label: "EXW - Ex Works" },
  { value: "FOB", label: "FOB - Free on Board" },
  { value: "CIF", label: "CIF - Cost, Insurance & Freight" },
  { value: "DDP", label: "DDP - Delivered Duty Paid" },
  { value: "DAP", label: "DAP - Delivered at Place" },
  { value: "FCA", label: "FCA - Free Carrier" },
];

export const CALCULATION_METHOD_OPTIONS = [
  { value: "Fixed", label: "Fixed" },
  { value: "Slabwise", label: "Slab wise" },
];

export const HUB_OPTIONS = [
  { value: "", label: "SELECT.." },
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

export const CustomerContractsHeadings = [
  { label: "SR.NO.", key: "srNo" },
  { label: "ID", key: "id", sortable: true },
  { label: "Customer", key: "customer", sortable: true },
  { label: "Service", key: "service", sortable: true },
  { label: "Product", key: "product", sortable: true },
  { label: "Origin Hub", key: "originHub", sortable: true },
  { label: "Contract Type", key: "contractType", sortable: true },
  { label: "Calculation Method", key: "calculationMethod", sortable: true },
  { label: "Effective From", key: "effectiveFrom", sortable: true },
  { label: "Effective To", key: "effectiveTo", sortable: true },
  { label: "Status", key: "status", sortable: true },
  { label: "Action", key: "action" },
];

export const customerContractFilterGroups = [
  {
    group: "Contract Type",
    options: CONTRACT_TYPE_OPTIONS,
  },
  {
    group: "Calculation Method",
    options: CALCULATION_METHOD_OPTIONS,
  },
  {
    group: "Origin Hub",
    options: HUB_OPTIONS.filter((h) => h.value !== ""),
  },
  {
    group: "Status",
    options: [
      { value: "ACTIVE", label: "ACTIVE" },
      { value: "INACTIVE", label: "INACTIVE" },
    ],
  },
];

export const initialCustomerContractsData: CustomerContractEntry[] = [
  {
    id: "CC-101",
    createdAt: "2026-08-15",
    customer: "Amazon Fulfillment Services",
    customerCode: "AMZ-01",
    service: "FEDEX IP EX NEW YORK - INDIA",
    serviceCode: "SRV-01",
    product: "NONDOX",
    productCode: "PRD-01",
    airline: "EMIRATES",
    airlineCode: "EK",
    flight: "EK 512",
    flightCode: "EK512",
    vendor: "FEDEX IP EX NEW YORK",
    vendorCode: "VND-01",
    destinationZone: "ZONE 1",
    destination: "UNITED STATES OF AMERICA",
    destinationCity: "NEW YORK",
    destinationState: "NY",
    destinationHub: "JFK",
    contractType: "Weight Wise",
    incoterm: "DDP",
    status: "ACTIVE",
    originZone: "ZONE A",
    origin: "INDIA",
    originCity: "DELHI",
    originState: "DELHI",
    originHub: "DELHI",
    effectiveFrom: "08/15/2026",
    effectiveTo: "08/15/2027",
    remarks: "Standard corporate agreement",
    notes: "Priority processing required",
    calculationMethod: "Fixed",
    tat: "3-5 Days",
    minimumFreight: "500",
    rateItems: [
      { id: 1, srNo: 1, onAddition: "BASE", lowerWtBox: "0.5", upperWtBox: "5.0", rate: "120" },
      { id: 2, srNo: 2, onAddition: "ADDITIONAL", lowerWtBox: "5.1", upperWtBox: "20.0", rate: "95" },
    ],
  },
  {
    id: "CC-102",
    createdAt: "2026-08-20",
    customer: "Velocity Express Logistics",
    customerCode: "VEL-02",
    service: "TCS COURIER - KARACHI",
    serviceCode: "SRV-02",
    product: "DOX",
    productCode: "PRD-02",
    airline: "QATAR AIRWAYS",
    airlineCode: "QR",
    flight: "QR 570",
    flightCode: "QR570",
    vendor: "TCS KARACHI HUB",
    vendorCode: "VND-02",
    destinationZone: "ZONE 2",
    destination: "UNITED KINGDOM",
    destinationCity: "LONDON",
    destinationState: "GREATER LONDON",
    destinationHub: "DUBAI",
    contractType: "Weight Wise",
    incoterm: "FOB",
    status: "ACTIVE",
    originZone: "ZONE B",
    origin: "PAKISTAN",
    originCity: "LAHORE",
    originState: "PUNJAB",
    originHub: "LAHORE",
    effectiveFrom: "08/20/2026",
    effectiveTo: "08/20/2027",
    remarks: "Express document delivery",
    notes: "Direct handover at airport",
    calculationMethod: "Fixed",
    tat: "2-4 Days",
    minimumFreight: "350",
    rateItems: [
      { id: 1, srNo: 1, onAddition: "BASE", lowerWtBox: "0.1", upperWtBox: "2.0", rate: "80" },
    ],
  },
  {
    id: "CC-103",
    createdAt: "2026-08-25",
    customer: "Global Exports International",
    customerCode: "GEI-03",
    service: "AIR CARGO - SIALKOT",
    serviceCode: "SRV-03",
    product: "NONDOX",
    productCode: "PRD-03",
    airline: "AIR CANADA CARGO",
    airlineCode: "AC",
    flight: "AC 042",
    flightCode: "AC042",
    vendor: "SIALKOT CARGO TERMINAL",
    vendorCode: "VND-03",
    destinationZone: "ZONE 3",
    destination: "CANADA",
    destinationCity: "TORONTO",
    destinationState: "ONTARIO",
    destinationHub: "CANADA",
    contractType: "Box Wise",
    incoterm: "CIF",
    status: "ACTIVE",
    originZone: "ZONE C",
    origin: "PAKISTAN",
    originCity: "SIALKOT",
    originState: "PUNJAB",
    originHub: "SIALKOT",
    effectiveFrom: "08/25/2026",
    effectiveTo: "08/25/2027",
    remarks: "Surgical goods shipment contract",
    notes: "Temperature control not required",
    calculationMethod: "Slabwise",
    tat: "5-7 Days",
    minimumFreight: "1200",
    rateItems: [
      { id: 1, srNo: 1, onAddition: "PER BOX", lowerWtBox: "10.0", upperWtBox: "30.0", rate: "250" },
    ],
  },
];
