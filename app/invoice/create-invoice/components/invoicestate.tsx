export interface SingleInvoiceSearchState {
  customer: string;
  billingCompany: string;
  bankDetails: string;
  gstNumber: string;
  invoiceRange: string;
  fromDate: string;
  tillDate: string;
  service: string;
  vendor: string;
  product: string;
  runNumber: string;
}

export interface SingleInvoiceFormState {
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  noteForCustomer: string;
  invoiceCurrency: string;
}

export interface SingleAwbInvoiceRow {
  id: number;
  awbNumber: string;
  bookingDate: string;
  forwardingNumber: string;
  destination: string;
  product: string;
  pcs: string;
  fsc: string;
  chargeableWeight: string;
  freightAmount: string;
  grandTotal: string;
}

export interface MultipleInvoiceSearchState {
  billingCompany: string;
  bankDetails: string;
  invoiceRange: string;
  fromDate: string;
  tillDate: string;
  service: string;
  vendor: string;
  product: string;
}

export interface MultipleInvoiceFormState {
  invoiceDate: string;
  dueDate: string;
  noteForCustomer: string;
}

export interface MultipleAwbInvoiceRow {
  id: number;
  customerName: string;
  customerCode: string;
  awbCount: string;
  chargeableWeight: string;
  freightAmount: string;
  freightZeroAwb: string;
  vat: string;
  grandTotal: string;
}
export interface MultipleAwbSearchState {
  customer: string;
  billingCompany: string;
  bankDetails: string;
  gstNumber: string;
  invoiceRange: string;
  fromDate: string;
  tillDate: string;
  service: string;
  vendor: string;
  product: string;
  awbNo: string;
}

export interface MultipleAwbFormState {
  invoiceDate: string;
  dueDate: string;
}

export interface awbMultipleRow {
  id: number;
  shipperName: string;
  shipperCode: string;
  awbCount: string;
  chargeableWeight: string;
  freightAmount: string;
  freightZeroAwb: string;
  vat: string;
  grandTotal: string;
}
export interface AwbLessInvoiceFormState {
  invoiceNumber: string;
  customer: string;
  addrType: string;
  fromDate: string;
  tillDate: string;
  billingCompany: string;
  invoiceRangeMaster: string;
  invoiceType: string;
  runNo: string;
  subAgent: string;
  irn: string;
  goodsDescription: string;
  jobNo: string;
  bankDetails: string;
  pod: string;
  pol: string;
  invoiceDate: string;
  dueDate: string;
  noteForCustomer: string;
  awbNo: string;
  mawbNo: string;
  portOfDeparture: string;
  portOfArrival: string;
  grossWeight: string;
  packages: string;
  airline: string;
  shipperName: string;
  vehicalNo: string;
  vehicalWt: string;
  challanNo: string;
  pdfTypeAir: boolean;
  pdfTypeCargo: boolean;
  roundOff: string;
}

export interface AwbLessInvoiceItemRow {
  id: number;
  description: string;
  isCustomDescription: boolean;
  sac: string;
  rate: string;
  pcs: string;
  amount: string;
  vatType: string;
  taxPercent: string;
  total: string;
}
export interface ToastState {
  message: string;
  type: "success" | "info" | "error";
}