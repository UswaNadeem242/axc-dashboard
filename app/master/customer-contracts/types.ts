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
}

export const CONTRACT_TYPE_OPTIONS = [
  { value: "Weight Wise", label: "Weight Wise" },
  { value: "Piece Wise", label: "Piece Wise" },
  { value: "Flat Rate", label: "Flat Rate" },
  { value: "Slab Wise", label: "Slab Wise" },
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
  { value: "FIXED", label: "FIXED" },
  { value: "PERCENTAGE", label: "PERCENTAGE" },
  { value: "DYNAMIC", label: "DYNAMIC" },
  { value: "TIERED", label: "TIERED" },
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

