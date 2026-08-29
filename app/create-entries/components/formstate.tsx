export interface AwbFormState {
  awbNumber: string;
  editAwbNumber: boolean;
  customer: string;
  company: string;
  editCompany: boolean;
  origin: string;
  originZone: string;
  destination: string;
  destinationZone: string;
  product: string;
  bookingDate: string;
  service: string;
  vendor: string;
  editVendor: boolean;
  masterCode: string;
  forwardingNumber: string;
  forwardingNumber2: string;
  referenceNumber: string;
  shipmentValue: string;
  shipmentCurrency: string;
  invoiceDate: string;
  invoiceNumber: string;
  editInvoice: boolean;
  content: string;
  contractId: string;
  rateContractCustomer: string;
  rateContractVendor: string;
  cftContractCustomer: string;
  cftContractVendor: string;
  tatCustomer: string;
  tatVendor: string;
  originHub: string;
  editOriginHub: boolean;
  duty: string;

  shipperSaveToAddressBook: boolean;
  shipperSearchAddressBook: string;
  shipperCode: string;
  shipperUpdateAddressBook: boolean;
  shipperCompany: string;
  shipperPersonName: string;
  shipperAddress1: string;
  shipperAddress2: string;
  shipperAddress3: string;
  shipperZipCode: string;
  shipperCity: string;
  shipperState: string;
  shipperCountry: string;
  shipperPhone: string;
  shipperEmail: string;
  shipperKycType: string;
  shipperKycNumber: string;

  consigneeSaveToAddressBook: boolean;
  consigneeSearchAddressBook: string;
  consigneeCode: string;
  consigneeUpdateAddressBook: boolean;
  consigneeCompany: string;
  consigneePersonName: string;
  consigneeAddress1: string;
  consigneeAddress2: string;
  consigneeAddress3: string;
  consigneeZipCode: string;
  consigneeCity: string;
  consigneeState: string;
  consigneeCountry: string;
  consigneePhone: string;
  consigneeEmail: string;

  pcs: number;
  actualWeight: string;
  volumetricWeight: string;
  consignerWeight: string;
  addWeight: string;
  chargeableWeight: string;
  parcelType: string;
  boxNo: string;
  actualNo: string;
  parcelActualWt: string;
  parcelL: string;
  parcelB: string;
  parcelH: string;
  parcelVolumetricWt: string;
  parcelChargeableWt: string;
  parcelCtn: string;

  createShipmentInvoice: boolean;
  invoiceType: string;
  invoiceCurrency: string;
  incoterms: string;
  invoiceNote: string;
  invoiceDeclaration: string;
}
export type AwbFormErrors = Record<string, string>;
export interface InvoiceItem {
  id: number;
  boxNo: string;
  srNo: string;
  description: string;
  hsCode: string;
  unitType: string;
  quantity: string;
  unitWeight: string;
  igst: string;
  unitRates: string;
  amount: string;
}
export interface ToastState {
  message: string;
  type: "success" | "info";
}
export interface ChargeLine {
  checked: boolean;
  value: string;
  amount: string;
}
export function emptyCharge(): ChargeLine {
  return { checked: false, value: "", amount: "" };
}

export interface SalesBillingCharges {
  additionalHandling: ChargeLine;
  additionalHandlingCharge: ChargeLine;
  addressCorrectionFees: ChargeLine;
  ahsWeight: ChargeLine;
  brandCharges: ChargeLine;
  collectionCharges: ChargeLine;
  dasCharges: ChargeLine;
  ddpCadCharges: ChargeLine;
  deliveryAreaSurcharge: ChargeLine;
  deliveryAreaSurchargeExtended: ChargeLine;
  dropOffCharges: ChargeLine;
  eForm: ChargeLine;
  extraCharges: ChargeLine;
  oversized: ChargeLine;
  peakSurcharge: ChargeLine;
  pickupCharges: ChargeLine;
  remoteArea: ChargeLine;
  remoteAreaSurcharge: ChargeLine;
  residentialSurcharge: ChargeLine;
  residentialSurchargeManual: ChargeLine;
}
export type ChargeKey = keyof SalesBillingCharges;
export interface SalesBillingFormState {
  salesCurrency: string;
  vatType: string;
  vatApplicable: boolean;

  freight: string;
  editFreightAmount: boolean;
  freightPerKg: string;
  searchCharge: string;

  charges: SalesBillingCharges;

  totalOtherCharges: string;
  adjustmentAmount: string;

  fscPercent: string;
  editFscPercent: boolean;
  fsc: string;
  editFsc: boolean;

  discountPercent: string;
  discountAmount: string;
  totalDiscount: string;

  freightAfterDiscount: string;
  subtotal: string;
  nonTaxableAmount: string;
  taxableAmount: string;
  vatPercent: string;
  vat: string;
  grandTotal: string;
  editTotal: boolean;
}
export interface PaymentDetailsFormState {
  paidAmount: string;
  balanceAmount: string;
  invoiceDate: string;
  invoiceNumber: string;
  invoiceRemarks: string;
  pastInvoiceNo: string;
  creditDebitNote: string;
}
export interface InvoiceRemarksFormState {
  invoiceRemarks1: string;
  invoiceRemarks2: string;
  invoiceRemarks3: string;
  invoiceRemarks4: string;
}
export interface RefundDetailsFormState {
  refundAmount: string;
  refundDate: string;
  refundReason: string;
  refundRemarks: string;
}
export interface PurchaseBillingCharges {
  additionalHandling: ChargeLine;
  additionalHandlingCharge: ChargeLine;
  addressCorrectionFees: ChargeLine;
  ahsWeight: ChargeLine;
  brandCharges: ChargeLine;
  collectionCharges: ChargeLine;
  dasCharges: ChargeLine;
  ddpCadCharges: ChargeLine;
  deliveryAreaSurcharge: ChargeLine;
  deliveryAreaSurchargeExtended: ChargeLine;
  dropOffCharges: ChargeLine;
  eForm: ChargeLine;
  extraCharges: ChargeLine;
  oversized: ChargeLine;
  peakSurcharge: ChargeLine;
  pickupCharges: ChargeLine;
  remoteArea: ChargeLine;
  remoteAreaSurcharge: ChargeLine;
  residentialSurcharge: ChargeLine;
  residentialSurchargeManual: ChargeLine;
}
export type PurchaseChargeKey = keyof PurchaseBillingCharges;
export function emptyPurchaseCharges(): PurchaseBillingCharges {
  return {
    additionalHandling: emptyCharge(),
    additionalHandlingCharge: emptyCharge(),
    addressCorrectionFees: emptyCharge(),
    ahsWeight: emptyCharge(),
    brandCharges: emptyCharge(),
    collectionCharges: emptyCharge(),
    dasCharges: emptyCharge(),
    ddpCadCharges: emptyCharge(),
    deliveryAreaSurcharge: emptyCharge(),
    deliveryAreaSurchargeExtended: emptyCharge(),
    dropOffCharges: emptyCharge(),
    eForm: emptyCharge(),
    extraCharges: emptyCharge(),
    oversized: emptyCharge(),
    peakSurcharge: emptyCharge(),
    pickupCharges: emptyCharge(),
    remoteArea: emptyCharge(),
    remoteAreaSurcharge: emptyCharge(),
    residentialSurcharge: emptyCharge(),
    residentialSurchargeManual: emptyCharge(),
  };
}

export interface PurchaseBillingFormState {
  company: string;
  purchaseCurrency: string;
  vatType: string;
  vatApplicable: boolean;
  editVat: boolean;

  freight: string;
  editFreightAmount: boolean;
  freightPerKg: string;
  searchCharge: string;

  charges: PurchaseBillingCharges;

  totalOtherCharges: string;
  adjustmentAmount: string;

  fscPercent: string;
  editFscPercent: boolean;
  fsc: string;
  editFsc: boolean;

  discountPercent: string;
  discountAmount: string;
  totalDiscount: string;

  freightAfterDiscount: string;
  subtotal: string;
  nonTaxableAmount: string;
  taxableAmount: string;
  vatPercent: string;

  cgst: string;
  editCgst: boolean;
  sgst: string;
  editSgst: boolean;

  grandTotal: string;
  editTotal: boolean;
}

export function defaultPurchaseBilling(): PurchaseBillingFormState {
  return {
    company: "",
    purchaseCurrency: "",
    vatType: "GST",
    vatApplicable: false,
    editVat: false,
    freight: "0",
    editFreightAmount: false,
    freightPerKg: "",
    searchCharge: "",
    charges: emptyPurchaseCharges(),
    totalOtherCharges: "0",
    adjustmentAmount: "",
    fscPercent: "",
    editFscPercent: false,
    fsc: "0",
    editFsc: false,
    discountPercent: "",
    discountAmount: "",
    totalDiscount: "0",
    freightAfterDiscount: "0",
    subtotal: "0",
    nonTaxableAmount: "0",
    taxableAmount: "0",
    vatPercent: "0",
    cgst: "0",
    editCgst: false,
    sgst: "0",
    editSgst: false,
    grandTotal: "0",
    editTotal: false,
  };
}
export interface VendorWeightRow {
  id: string;
  actualWeight: string;
  length: string;
  breadth: string;
  height: string;
  volumetricWeight: string;
  chargeableWeight: string;
}
export interface VendorDetailsFormState {
  editVendorDetails: boolean;
  product: string;
  service: string;
  vendor: string;
  originZone: string;
  destinationZone: string;
  pcs: string;

  weightRows: VendorWeightRow[];
  actualWeight: string;

  cftId: string;
  cftValue: string;
  vendorContractId: string;
  tat: string;

  volumeWeight: string;
  chargeableWeight: string;
}
export function defaultVendorDetails(): VendorDetailsFormState {
  return {
    editVendorDetails: false,
    product: "",
    service: "",
    vendor: "",
    originZone: "",
    destinationZone: "",
    pcs: "",
    weightRows: [],
    actualWeight: "",
    cftId: "",
    cftValue: "1",
    vendorContractId: "",
    tat: "",
    volumeWeight: "",
    chargeableWeight: "0",
  };
}
export interface VendorInvoiceFormState {
  pastVendorInvoice: string;
  vendorInvoice1: string;
  invoiceRemarks1: string;
  vendorInvoice2: string;
  invoiceRemarks2: string;
  vendorInvoice3: string;
  invoiceRemarks3: string;
  vendorInvoice4: string;
  invoiceRemarks4: string;
}
export function defaultVendorInvoice(): VendorInvoiceFormState {
  return {
    pastVendorInvoice: "",
    vendorInvoice1: "",
    invoiceRemarks1: "",
    vendorInvoice2: "",
    invoiceRemarks2: "",
    vendorInvoice3: "",
    invoiceRemarks3: "",
    vendorInvoice4: "",
    invoiceRemarks4: "",
  };
}
export interface DeliveryFormState {
  forwardingNumber: string;
  forwardingNumber2: string;

  expectedDeliveryDateCustomer: string;
  expectedDeliveryDateVendor: string;
  actualTatCustomer: string;
  actualTatVendor: string;
  crossedEddDaysCustomer: string;
  crossedEddDaysVendor: string;

  expectedDate: string;
  editExpectedDate: boolean;
  expectedTime: string;

  deliveryDate: string;
  deliveryTime: string;

  apiCrossedEddDays: string;

  connectionDate: string;
  editConnectionDate: boolean;
  connectionTime: string;

  appointmentDate: string;
  appointmentTime: string;

  podUploadedDate: string;
  podUploadedTime: string;

  deliveryCost: string;
  receiverName: string;
  receiverMobile: string;
  receiverEmail: string;
  remarks: string;

  awbStatusCode: string;
  awbStatusName: string;
  reasonForStatus: string;

  codAmount: string;
  codAmountCollected: string;
  codAmountCollectedChecked: boolean;
  podHardCopy: boolean;

  totalPcs: number;
  totalPickupScanParcels: number;
  totalInscanParcels: number;
}
export function defaultDelivery(): DeliveryFormState {
  return {
    forwardingNumber: "",
    forwardingNumber2: "",
    expectedDeliveryDateCustomer: "",
    expectedDeliveryDateVendor: "",
    actualTatCustomer: "0",
    actualTatVendor: "0",
    crossedEddDaysCustomer: "",
    crossedEddDaysVendor: "",
    expectedDate: "",
    editExpectedDate: false,
    expectedTime: "",
    deliveryDate: "",
    deliveryTime: "",
    apiCrossedEddDays: "",
    connectionDate: "",
    editConnectionDate: false,
    connectionTime: "",
    appointmentDate: "",
    appointmentTime: "",
    podUploadedDate: "",
    podUploadedTime: "",
    deliveryCost: "",
    receiverName: "",
    receiverMobile: "",
    receiverEmail: "",
    remarks: "",
    awbStatusCode: "",
    awbStatusName: "",
    reasonForStatus: "",
    codAmount: "",
    codAmountCollected: "",
    codAmountCollectedChecked: false,
    podHardCopy: false,
    totalPcs: 0,
    totalPickupScanParcels: 0,
    totalInscanParcels: 0,
  };
}
export interface TrackingEvent {
  id: string;
  eventDateTime: string;
  eventDescription: string;
  eventLocation: string;
  eventType: "SYSTEM" | "MANUAL";
  eventState: string;
  eventRemark: string;
  createdDate: string;
  createdBy: string;
  isNew?: boolean;
  editable?: boolean;
}
export function emptyTrackingEvent(): TrackingEvent {
  return {
    id: crypto.randomUUID(),
    eventDateTime: "",
    eventDescription: "",
    eventLocation: "",
    eventType: "MANUAL",
    eventState: "",
    eventRemark: "",
    createdDate: "",
    createdBy: "",
    isNew: true,
    editable: true,
  };
}