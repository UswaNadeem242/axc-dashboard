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

export interface AwbInvoiceRow {
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

export interface ToastState {
  message: string;
  type: "success" | "info" | "error";
}