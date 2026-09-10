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

export interface ToastState {
  message: string;
  type: "success" | "info" | "error";
}
