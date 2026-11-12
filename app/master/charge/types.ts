export interface ServiceChargeMapping {
  fedex?: string;
  dhl?: string;
  ups?: string;
  inxpress?: string;
  norsk?: string;
  dsv?: string;
  [key: string]: string | undefined;
}

export interface ChargeEntry {
  id: string;
  srNo: number;

  code?: string;
  name: string;
  sac: string;
  defaultRate?: number | string;

  // Checkbox Rules & Settings (from Reference Image 1)
  isVatApplicable: boolean;
  isFscApplicableSales: boolean;
  isFscApplicablePurchase: boolean;
  isManual: boolean;
  isCustomerOptional: boolean;
  isVendorOptional: boolean;
  isDefault: boolean;
  hideInInvoice: boolean;
  displayInAwbAppliesCharges: boolean;
  showInDutyInvoice: boolean;
  applyDrsAttemptCharge: boolean;

  rateType: string;
  status: "ACTIVE" | "INACTIVE";

  // Service Provider Mappings (from Reference Image 1)
  serviceMappings: ServiceChargeMapping;

  createdAt: string;
}

export const RATE_TYPE_OPTIONS = [
  { value: "Fixed", label: "Fixed" },
  { value: "Percentage", label: "Percentage" },
  { value: "Per Kg", label: "Per Kg" },
  { value: "Per Piece", label: "Per Piece" },
  { value: "Per Docket", label: "Per Docket" },
];

export const SERVICE_PROVIDERS = [
  { key: "fedex", label: "FEDEX" },
  { key: "dhl", label: "DHL" },
  { key: "ups", label: "UPS" },
  { key: "inxpress", label: "INXPRESS" },
  { key: "norsk", label: "NORSK" },
  { key: "dsv", label: "DSV" },
];

export const ChargeHeadings = [
  { label: "SR.NO.", key: "srNo", align: "left" as const },
  { label: "SELECT CHARGE", key: "selectCharge", align: "center" as const },
  { label: "CHARGE NAME", key: "name", sortable: true, align: "left" as const },
  { label: "SAC CODE", key: "sac", sortable: true, align: "center" as const },
  { label: "RATE TYPE", key: "rateType", sortable: true, align: "center" as const },
  { label: "VAT APPLICABLE", key: "isVatApplicable", sortable: true, align: "center" as const },
  { label: "FSC SALES", key: "isFscApplicableSales", sortable: true, align: "center" as const },
  { label: "MANUAL ENTRY", key: "isManual", sortable: true, align: "center" as const },
  { label: "STATUS", key: "status", sortable: true, align: "center" as const },
  { label: "ACTION", key: "action", align: "center" as const },
];

export const chargeFilterGroups = [
  {
    group: "Status",
    options: [
      { label: "ACTIVE", value: "ACTIVE" },
      { label: "INACTIVE", value: "INACTIVE" },
    ],
  },
  {
    group: "Rate Type",
    options: [
      { label: "Fixed", value: "Fixed" },
      { label: "Percentage", value: "Percentage" },
      { label: "Per Kg", value: "Per Kg" },
      { label: "Per Piece", value: "Per Piece" },
    ],
  },
  {
    group: "Tax & Rules",
    options: [
      { label: "VAT Applicable", value: "vat_applicable" },
      { label: "Manual Entry", value: "manual_entry" },
      { label: "FSC Sales", value: "fsc_sales" },
    ],
  },
];

export const initialChargeData: ChargeEntry[] = [
  {
    id: "CHG-001",
    srNo: 1,
    name: "FUEL SURCHARGE",
    sac: "996812",
    isVatApplicable: true,
    isFscApplicableSales: true,
    isFscApplicablePurchase: true,
    isManual: false,
    isCustomerOptional: false,
    isVendorOptional: false,
    isDefault: true,
    hideInInvoice: false,
    displayInAwbAppliesCharges: true,
    showInDutyInvoice: false,
    applyDrsAttemptCharge: false,
    rateType: "Percentage",
    status: "ACTIVE",
    serviceMappings: {
      fedex: "FUEL SURCHARGE",
      dhl: "FSC",
      ups: "FUEL SURCHARGE",
      inxpress: "FSC CHARGE",
      norsk: "FSC",
      dsv: "FUEL ADJ",
    },
    createdAt: "05/11/2026, 10:30 AM",
  },
  {
    id: "CHG-002",
    srNo: 2,
    name: "REMOTE AREA DELIVERY CHARGE",
    sac: "996813",
    isVatApplicable: true,
    isFscApplicableSales: true,
    isFscApplicablePurchase: false,
    isManual: false,
    isCustomerOptional: true,
    isVendorOptional: true,
    isDefault: false,
    hideInInvoice: false,
    displayInAwbAppliesCharges: true,
    showInDutyInvoice: false,
    applyDrsAttemptCharge: false,
    rateType: "Per Kg",
    status: "ACTIVE",
    serviceMappings: {
      fedex: "OUT OF DELIVERY AREA",
      dhl: "REMOTE AREA DELIVERY",
      ups: "EXTENDED AREA SURCHARGE",
      inxpress: "REMOTE AREA",
      norsk: "RAD CHARGE",
      dsv: "OUT OF AREA",
    },
    createdAt: "04/11/2026, 02:15 PM",
  },
  {
    id: "CHG-003",
    srNo: 3,
    name: "CUSTOMS CLEARANCE FEE",
    sac: "996819",
    isVatApplicable: true,
    isFscApplicableSales: false,
    isFscApplicablePurchase: false,
    isManual: true,
    isCustomerOptional: true,
    isVendorOptional: false,
    isDefault: false,
    hideInInvoice: false,
    displayInAwbAppliesCharges: true,
    showInDutyInvoice: true,
    applyDrsAttemptCharge: false,
    rateType: "Fixed",
    status: "ACTIVE",
    serviceMappings: {
      fedex: "CUSTOMS FORMALITIES",
      dhl: "BONDED STORAGE / ENTRY",
      ups: "BROKERAGE CLEARANCE",
      inxpress: "CUSTOMS ADMIN",
      norsk: "CLEARANCE FEE",
      dsv: "FORMAL ENTRY FEE",
    },
    createdAt: "03/11/2026, 11:45 AM",
  },
  {
    id: "CHG-004",
    srNo: 4,
    name: "OVERSIZE & OVERWEIGHT FEE",
    sac: "996812",
    isVatApplicable: true,
    isFscApplicableSales: true,
    isFscApplicablePurchase: true,
    isManual: false,
    isCustomerOptional: false,
    isVendorOptional: false,
    isDefault: false,
    hideInInvoice: false,
    displayInAwbAppliesCharges: true,
    showInDutyInvoice: false,
    applyDrsAttemptCharge: false,
    rateType: "Fixed",
    status: "ACTIVE",
    serviceMappings: {
      fedex: "OVERSIZE PIECE",
      dhl: "OVERWEIGHT PIECE",
      ups: "LARGE PACKAGE SURCHARGE",
      inxpress: "OVERSIZE FEE",
      norsk: "OOG SURCHARGE",
      dsv: "OVER DIMENSION",
    },
    createdAt: "02/11/2026, 04:00 PM",
  },
  {
    id: "CHG-005",
    srNo: 5,
    name: "DUTY RE-DISBURSEMENT CHARGE",
    sac: "996819",
    isVatApplicable: false,
    isFscApplicableSales: false,
    isFscApplicablePurchase: false,
    isManual: true,
    isCustomerOptional: true,
    isVendorOptional: false,
    isDefault: false,
    hideInInvoice: true,
    displayInAwbAppliesCharges: false,
    showInDutyInvoice: true,
    applyDrsAttemptCharge: false,
    rateType: "Fixed",
    status: "INACTIVE",
    serviceMappings: {
      fedex: "DISBURSEMENT FEE",
      dhl: "ADVANCE PAYMENT",
      ups: "DISBURSEMENT CHARGE",
      inxpress: "ADMIN FEE",
      norsk: "DUTY ADMIN",
      dsv: "DISBURSEMENT",
    },
    createdAt: "01/11/2026, 09:20 AM",
  },
];

