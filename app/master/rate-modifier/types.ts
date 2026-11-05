export interface RateModifierEntry {
  id: string;
  srNo: number;

  // The 10 Charge & Billing Fields
  charge: string;
  billingType: string;
  insuranceType: string;
  paymentMethod: string;
  fixedAmount: string;
  minAmount: string;
  percentageOnFreight: string;
  percentageOnShipmentValue: string;
  percentageOnFreightAndFsc: string;
  dispatchType: string;

  // Weight, Value & Dimension Limit Fields
  minChargeableWeight: string;
  maxChargeableWeight: string;
  minActualWeight: string;
  maxActualWeight: string;
  minVolumeWeight: string;
  maxVolumeWeight: string;
  minNoOfBoxes: string;
  maxNoOfBoxes: string;
  minDimension: string;
  maxDimension: string;
  minPerBoxActualWeight: string;
  maxPerBoxActualWeight: string;
  minPerBoxVolumetricWeight: string;
  maxPerBoxVolumetricWeight: string;
  minPerBoxChargeableWeight: string;
  maxPerBoxChargeableWeight: string;
  minShipmentValue: string;
  maxShipmentValue: string;

  // Flight
  flightNumber: string;

  // Entities & Routing Fields
  customer: string;
  product: string;
  service: string;
  vendor: string;
  destinationLocation: string;
  originLocation: string;
  destinationZone: string;
  originZone: string;
  destinationHub: string;
  originHub: string;

  // States, Cities, Pincodes & Content (from Reference Image)
  destinationState: string;
  originState: string;
  destinationCity: string;
  originCity: string;
  destinationPincode: string;
  originPincode: string;
  docketContent: string;

  // Validity & Rate Calculation (from Reference Image)
  effectiveFrom: string;
  effectiveTo: string;
  ratePer: string;
  minDimensionPerPcs: boolean;
  maxDimensionPerPcs: boolean;

  // Special Conditions & Surcharges (from Reference Image)
  grith: boolean;
  slabWiseRate: boolean;
  isDryIce: boolean;
  isCsbIvShipment: boolean;
  isCsbVShipment: boolean;
  isCommercialShipment: boolean;
  isOriginOda: boolean;
  isDestinationOda: boolean;
  isOriginOda2: boolean;
  isDestinationOda2: boolean;

  // Grith Dimensions & High Value (from Reference Image)
  grith2ndSideMinDimension: string;
  grith2ndSideMaxDimension: string;
  highValueChargeOn: string;
  highValueAmount: string;

  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

export const CHARGE_OPTIONS = [
  { value: "FUEL SURCHARGE (FSC)", label: "FUEL SURCHARGE (FSC)" },
  { value: "SECURITY SURCHARGE", label: "SECURITY SURCHARGE" },
  { value: "CUSTOMS CLEARANCE CHARGE", label: "CUSTOMS CLEARANCE CHARGE" },
  { value: "DOCUMENTATION CHARGE", label: "DOCUMENTATION CHARGE" },
  { value: "HANDLING FEE", label: "HANDLING FEE" },
  { value: "REMOTE AREA SURCHARGE", label: "REMOTE AREA SURCHARGE" },
  { value: "OVERWEIGHT SURCHARGE", label: "OVERWEIGHT SURCHARGE" },
  { value: "OVERSIZE SURCHARGE", label: "OVERSIZE SURCHARGE" },
  { value: "DUTY HANDLING CHARGE", label: "DUTY HANDLING CHARGE" },
  { value: "INSURANCE CHARGE", label: "INSURANCE CHARGE" },
];

export const BILLING_TYPE_OPTIONS = [
  { value: "PREPAID", label: "PREPAID" },
  { value: "POSTPAID", label: "POSTPAID" },
  { value: "FREIGHT COLLECT", label: "FREIGHT COLLECT" },
  { value: "THIRD PARTY", label: "THIRD PARTY" },
];

export const INSURANCE_TYPE_OPTIONS = [
  { value: "NONE", label: "NONE" },
  { value: "STANDARD INSURANCE", label: "STANDARD INSURANCE" },
  { value: "COMPREHENSIVE INSURANCE", label: "COMPREHENSIVE INSURANCE" },
  { value: "DECLARED VALUE INSURANCE", label: "DECLARED VALUE INSURANCE" },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: "CASH", label: "CASH" },
  { value: "CREDIT", label: "CREDIT" },
  { value: "BANK TRANSFER", label: "BANK TRANSFER" },
  { value: "ONLINE / CARD", label: "ONLINE / CARD" },
  { value: "CHEQUE", label: "CHEQUE" },
];

export const DISPATCH_TYPE_OPTIONS = [
  { value: "AIR FREIGHT", label: "AIR FREIGHT" },
  { value: "EXPRESS COURIER", label: "EXPRESS COURIER" },
  { value: "ROAD TRANSPORT", label: "ROAD TRANSPORT" },
  { value: "SEA FREIGHT", label: "SEA FREIGHT" },
];

export const RATE_PER_OPTIONS = [
  { value: "PER KG", label: "PER KG" },
  { value: "PER SHIPMENT", label: "PER SHIPMENT" },
  { value: "PER BOX", label: "PER BOX" },
  { value: "PERCENTAGE", label: "PERCENTAGE" },
  { value: "FIXED", label: "FIXED" },
];

export const HIGH_VALUE_CHARGE_ON_OPTIONS = [
  { value: "PERCENTAGE", label: "PERCENTAGE" },
  { value: "FIXED AMOUNT", label: "FIXED AMOUNT" },
  { value: "SHIPMENT VALUE", label: "SHIPMENT VALUE" },
  { value: "FREIGHT AMOUNT", label: "FREIGHT AMOUNT" },
  { value: "INVOICE VALUE", label: "INVOICE VALUE" },
];

export const initialRateModifierData: RateModifierEntry[] = [
  {
    id: "RM-101",
    srNo: 1,
    charge: "FUEL SURCHARGE (FSC)",
    billingType: "PREPAID",
    insuranceType: "NONE",
    paymentMethod: "CREDIT",
    fixedAmount: "25.00",
    minAmount: "10.00",
    percentageOnFreight: "15%",
    percentageOnShipmentValue: "0%",
    percentageOnFreightAndFsc: "15%",
    dispatchType: "AIR FREIGHT",
    minChargeableWeight: "1.0",
    maxChargeableWeight: "500.0",
    minActualWeight: "1.0",
    maxActualWeight: "500.0",
    minVolumeWeight: "1.0",
    maxVolumeWeight: "500.0",
    minNoOfBoxes: "1",
    maxNoOfBoxes: "50",
    minDimension: "10x10x10",
    maxDimension: "120x80x80",
    minPerBoxActualWeight: "0.5",
    maxPerBoxActualWeight: "35.0",
    minPerBoxVolumetricWeight: "0.5",
    maxPerBoxVolumetricWeight: "35.0",
    minPerBoxChargeableWeight: "0.5",
    maxPerBoxChargeableWeight: "35.0",
    minShipmentValue: "100.00",
    maxShipmentValue: "10000.00",
    flightNumber: "EK-204",
    customer: "APEX GLOBAL LOGISTICS",
    product: "INTERNATIONAL PARCEL",
    service: "EXPRESS WORLDWIDE",
    vendor: "EMIRATES AIRLINE",
    destinationLocation: "LONDON (LHR)",
    originLocation: "NEW DELHI (DEL)",
    destinationZone: "ZONE-UK",
    originZone: "ZONE-IN",
    destinationHub: "LHR",
    originHub: "DEL",
    destinationState: "GREATER LONDON",
    originState: "DELHI",
    destinationCity: "LONDON",
    originCity: "NEW DELHI",
    destinationPincode: "TW6 1AP",
    originPincode: "110037",
    docketContent: "DOCUMENTS & COMMERCIAL SAMPLES",
    effectiveFrom: "10/01/2023",
    effectiveTo: "12/31/2024",
    ratePer: "PER KG",
    minDimensionPerPcs: false,
    maxDimensionPerPcs: true,
    grith: false,
    slabWiseRate: true,
    isDryIce: false,
    isCsbIvShipment: true,
    isCsbVShipment: false,
    isCommercialShipment: true,
    isOriginOda: false,
    isDestinationOda: false,
    isOriginOda2: false,
    isDestinationOda2: false,
    grith2ndSideMinDimension: "15",
    grith2ndSideMaxDimension: "120",
    highValueChargeOn: "PERCENTAGE",
    highValueAmount: "2.5",
    status: "ACTIVE",
    createdAt: "22/10/2023 11:30 AM",
  },
  {
    id: "RM-102",
    srNo: 2,
    charge: "SECURITY SURCHARGE",
    billingType: "PREPAID",
    insuranceType: "STANDARD INSURANCE",
    paymentMethod: "CREDIT",
    fixedAmount: "15.00",
    minAmount: "5.00",
    percentageOnFreight: "5%",
    percentageOnShipmentValue: "0%",
    percentageOnFreightAndFsc: "5%",
    dispatchType: "EXPRESS COURIER",
    minChargeableWeight: "0.5",
    maxChargeableWeight: "200.0",
    minActualWeight: "0.5",
    maxActualWeight: "200.0",
    minVolumeWeight: "0.5",
    maxVolumeWeight: "200.0",
    minNoOfBoxes: "1",
    maxNoOfBoxes: "20",
    minDimension: "5x5x5",
    maxDimension: "100x60x60",
    minPerBoxActualWeight: "0.5",
    maxPerBoxActualWeight: "30.0",
    minPerBoxVolumetricWeight: "0.5",
    maxPerBoxVolumetricWeight: "30.0",
    minPerBoxChargeableWeight: "0.5",
    maxPerBoxChargeableWeight: "30.0",
    minShipmentValue: "50.00",
    maxShipmentValue: "5000.00",
    flightNumber: "QR-108",
    customer: "DHL FORWARDING",
    product: "COURIER STANDARD",
    service: "PRIORITY EXPRESS",
    vendor: "QATAR AIRWAYS",
    destinationLocation: "DOHA (DOH)",
    originLocation: "MUMBAI (BOM)",
    destinationZone: "ZONE-ME",
    originZone: "ZONE-IN",
    destinationHub: "DOH",
    originHub: "BOM",
    destinationState: "AD DAWAHA",
    originState: "MAHARASHTRA",
    destinationCity: "DOHA",
    originCity: "MUMBAI",
    destinationPincode: "12345",
    originPincode: "400099",
    docketContent: "GENERAL CARGO",
    effectiveFrom: "11/01/2023",
    effectiveTo: "11/30/2024",
    ratePer: "PER SHIPMENT",
    minDimensionPerPcs: false,
    maxDimensionPerPcs: false,
    grith: false,
    slabWiseRate: false,
    isDryIce: false,
    isCsbIvShipment: false,
    isCsbVShipment: false,
    isCommercialShipment: false,
    isOriginOda: true,
    isDestinationOda: true,
    isOriginOda2: false,
    isDestinationOda2: false,
    grith2ndSideMinDimension: "",
    grith2ndSideMaxDimension: "",
    highValueChargeOn: "FIXED AMOUNT",
    highValueAmount: "50.00",
    status: "ACTIVE",
    createdAt: "23/10/2023 03:15 PM",
  },
  {
    id: "RM-103",
    srNo: 3,
    charge: "CUSTOMS CLEARANCE CHARGE",
    billingType: "POSTPAID",
    insuranceType: "COMPREHENSIVE INSURANCE",
    paymentMethod: "BANK TRANSFER",
    fixedAmount: "45.00",
    minAmount: "20.00",
    percentageOnFreight: "0%",
    percentageOnShipmentValue: "2.5%",
    percentageOnFreightAndFsc: "0%",
    dispatchType: "AIR FREIGHT",
    minChargeableWeight: "5.0",
    maxChargeableWeight: "1000.0",
    minActualWeight: "5.0",
    maxActualWeight: "1000.0",
    minVolumeWeight: "5.0",
    maxVolumeWeight: "1000.0",
    minNoOfBoxes: "1",
    maxNoOfBoxes: "100",
    minDimension: "20x20x20",
    maxDimension: "150x100x100",
    minPerBoxActualWeight: "1.0",
    maxPerBoxActualWeight: "50.0",
    minPerBoxVolumetricWeight: "1.0",
    maxPerBoxVolumetricWeight: "50.0",
    minPerBoxChargeableWeight: "1.0",
    maxPerBoxChargeableWeight: "50.0",
    minShipmentValue: "500.00",
    maxShipmentValue: "50000.00",
    flightNumber: "TK-714",
    customer: "FEDEX EXPRESS",
    product: "HEAVY CARGO",
    service: "STANDARD FREIGHT",
    vendor: "TURKISH AIRLINES",
    destinationLocation: "ISTANBUL (IST)",
    originLocation: "DUBAI (DXB)",
    destinationZone: "ZONE-EU",
    originZone: "ZONE-UAE",
    destinationHub: "IST",
    originHub: "DXB",
    destinationState: "ISTANBUL",
    originState: "DUBAI",
    destinationCity: "ISTANBUL",
    originCity: "DUBAI",
    destinationPincode: "34283",
    originPincode: "00000",
    docketContent: "TEXTILES & SPARES",
    effectiveFrom: "12/01/2023",
    effectiveTo: "12/31/2024",
    ratePer: "PER KG",
    minDimensionPerPcs: true,
    maxDimensionPerPcs: true,
    grith: true,
    slabWiseRate: false,
    isDryIce: true,
    isCsbIvShipment: false,
    isCsbVShipment: false,
    isCommercialShipment: true,
    isOriginOda: false,
    isDestinationOda: false,
    isOriginOda2: true,
    isDestinationOda2: true,
    grith2ndSideMinDimension: "25",
    grith2ndSideMaxDimension: "150",
    highValueChargeOn: "INVOICE VALUE",
    highValueAmount: "100.00",
    status: "INACTIVE",
    createdAt: "24/10/2023 09:45 AM",
  },
];

export const RateModifierHeadings = [
  { label: "Sr. No", key: "srNo", sortable: true },
  { label: "Charge", key: "charge", sortable: true },
  { label: "Billing Type", key: "billingType", sortable: true },
  { label: "Customer", key: "customer", sortable: true },
  { label: "Vendor", key: "vendor", sortable: true },
  { label: "Origin", key: "originHub", sortable: true },
  { label: "Destination", key: "destinationHub", sortable: true },
  { label: "Fixed Amount", key: "fixedAmount", sortable: true },
  { label: "% on Freight", key: "percentageOnFreight", sortable: true },
  { label: "Effective Period", key: "effectivePeriod", sortable: false },
  { label: "Status", key: "status", sortable: true },
  { label: "Action", key: "action", sortable: false, align: "center" as const },
];

export const rateModifierFilterGroups = [
  {
    group: "Billing Type",
    options: BILLING_TYPE_OPTIONS,
  },
  {
    group: "Dispatch Type",
    options: DISPATCH_TYPE_OPTIONS,
  },
  {
    group: "Status",
    options: [
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" },
    ],
  },
];
