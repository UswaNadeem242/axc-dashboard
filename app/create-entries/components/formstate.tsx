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
  boxNo: string;
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