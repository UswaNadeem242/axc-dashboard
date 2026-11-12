export interface CustomerEmailSettings {
  // 1. MIS EMAIL SETTING
  misReportHead: string;
  misEmailCycle: string;
  misEmailTime: string;
  misShipmentRange: string;
  misSendOnceIfDelivered: boolean;
  misDontSendIfAllDeliveredLastMonth: boolean;

  // 2. OUTSTANDING EMAIL SETTING
  outstandingEmailCycle: string;
  outstandingEmailTime: string;
  outstandingLedgerDateRange: string;
  outstandingSendIfNegative: boolean;
  outstandingSendIfPositive: boolean;
  outstandingSendIfZero: boolean;

  // 3. AGING LIMIT EMAIL SETTING
  agingEmailCycle: string;

  // 4. AGING LIMIT WHATSAPP SETTING
  agingWhatsappCycle: string;

  // 5. AWBWISE LEDGER EMAIL SETTING
  awbwiseEmailCycle: string;
  awbwiseEmailTime: string;
  awbwiseLedgerDateRange: string;

  // 6. INVENTORY EMAIL SETTING
  inventoryEmailCycle: string;
  inventoryEmailTime: string;
}

export const defaultCustomerEmailSettings: CustomerEmailSettings = {
  misReportHead: "",
  misEmailCycle: "MANUALLY",
  misEmailTime: "06 AM",
  misShipmentRange: "MONTHLY",
  misSendOnceIfDelivered: false,
  misDontSendIfAllDeliveredLastMonth: false,

  outstandingEmailCycle: "MANUALLY",
  outstandingEmailTime: "06 AM",
  outstandingLedgerDateRange: "LAST TWO MONTH",
  outstandingSendIfNegative: false,
  outstandingSendIfPositive: false,
  outstandingSendIfZero: false,

  agingEmailCycle: "MANUALLY",

  agingWhatsappCycle: "MANUALLY",

  awbwiseEmailCycle: "MANUALLY",
  awbwiseEmailTime: "06 AM",
  awbwiseLedgerDateRange: "LAST TWO MONTH",

  inventoryEmailCycle: "MANUALLY",
  inventoryEmailTime: "06 AM",
};

export const EMAIL_CYCLE_OPTIONS = [
  { value: "MANUALLY", label: "MANUALLY" },
  { value: "DAILY", label: "DAILY" },
  { value: "WEEKLY", label: "WEEKLY" },
  { value: "FORTNIGHTLY", label: "FORTNIGHTLY" },
  { value: "MONTHLY", label: "MONTHLY" },
];

export const EMAIL_TIME_OPTIONS = [
  { value: "12 AM", label: "12 AM" },
  { value: "01 AM", label: "01 AM" },
  { value: "02 AM", label: "02 AM" },
  { value: "03 AM", label: "03 AM" },
  { value: "04 AM", label: "04 AM" },
  { value: "05 AM", label: "05 AM" },
  { value: "06 AM", label: "06 AM" },
  { value: "07 AM", label: "07 AM" },
  { value: "08 AM", label: "08 AM" },
  { value: "09 AM", label: "09 AM" },
  { value: "10 AM", label: "10 AM" },
  { value: "11 AM", label: "11 AM" },
  { value: "12 PM", label: "12 PM" },
  { value: "01 PM", label: "01 PM" },
  { value: "02 PM", label: "02 PM" },
  { value: "03 PM", label: "03 PM" },
  { value: "04 PM", label: "04 PM" },
  { value: "05 PM", label: "05 PM" },
  { value: "06 PM", label: "06 PM" },
  { value: "07 PM", label: "07 PM" },
  { value: "08 PM", label: "08 PM" },
  { value: "09 PM", label: "09 PM" },
  { value: "10 PM", label: "10 PM" },
  { value: "11 PM", label: "11 PM" },
];

export const REPORT_HEAD_OPTIONS = [
  { value: "", label: "SELECT..." },
  { value: "ALPHA REPORT", label: "ALPHA REPORT" },
  { value: "AWB", label: "AWB" },
  { value: "BUSINESS DETAIL REPORT", label: "BUSINESS DETAIL REPORT" },
  { value: "CHAREABLE WEIGHT", label: "CHAREABLE WEIGHT" },
  { value: "CHARGES REPORT", label: "CHARGES REPORT" },
  { value: "Custom Report", label: "Custom Report" },
  { value: "CUSTOMER SHEET", label: "CUSTOMER SHEET" },
  { value: "CUSTOMER WISE TRACKING NUMBERS", label: "CUSTOMER WISE TRACKING NUMBERS" },
  { value: "DAILY SALES REPORT", label: "DAILY SALES REPORT" },
  { value: "DESTINATION ZONE WEIGHT", label: "DESTINATION ZONE WEIGHT" },
  { value: "ESTIMATE FILE RUN REPORT", label: "ESTIMATE FILE RUN REPORT" },
  { value: "FLAT FILE", label: "FLAT FILE" },
  { value: "no of pcs", label: "no of pcs" },
  { value: "Run Estimated Amount", label: "Run Estimated Amount" },
  { value: "RUN REPORT", label: "RUN REPORT" },
  { value: "RUN REPORT 2", label: "RUN REPORT 2" },
  { value: "Sales and Purchase", label: "Sales and Purchase" },
  { value: "STATE WISE PCS WEIGHT", label: "STATE WISE PCS WEIGHT" },
  { value: "SUMMARY OF RECEIVEABLES", label: "SUMMARY OF RECEIVEABLES" },
];

export const SHIPMENT_RANGE_OPTIONS = [
  { value: "DAILY", label: "DAILY" },
  { value: "WEEKLY", label: "WEEKLY" },
  { value: "MONTHLY", label: "MONTHLY" },
  { value: "LAST 30 DAYS", label: "LAST 30 DAYS" },
  { value: "CUSTOM", label: "CUSTOM" },
];

export const LEDGER_DATE_RANGE_OPTIONS = [
  { value: "CURRENT MONTH", label: "CURRENT MONTH" },
  { value: "LAST ONE MONTH", label: "LAST ONE MONTH" },
  { value: "LAST TWO MONTH", label: "LAST TWO MONTH" },
  { value: "LAST THREE MONTH", label: "LAST THREE MONTH" },
  { value: "LAST SIX MONTH", label: "LAST SIX MONTH" },
  { value: "FINANCIAL YEAR", label: "FINANCIAL YEAR" },
];

export type PortalAction = "create" | "update" | "view" | "delete" | "history" | "export" | "import";

export type PortalModuleKey =
  | "awb"
  | "manifest"
  | "pickupRequest"
  | "invoice"
  | "reports"
  | "salesAccount"
  | "customerRateCalc";

export interface PortalModuleDef {
  key: PortalModuleKey;
  label: string;
  allowedActions: PortalAction[];
}

export const PORTAL_ACTIONS: { key: PortalAction; label: string }[] = [
  { key: "create", label: "Create" },
  { key: "update", label: "Update" },
  { key: "view", label: "View" },
  { key: "delete", label: "Delete" },
  { key: "history", label: "History" },
  { key: "export", label: "Export" },
  { key: "import", label: "Import" },
];

export const PORTAL_MODULES: PortalModuleDef[] = [
  { key: "awb", label: "AWB", allowedActions: ["create", "update", "view", "delete", "history", "export", "import"] },
  { key: "manifest", label: "Manifest", allowedActions: ["create", "update", "view", "delete", "history", "export", "import"] },
  { key: "pickupRequest", label: "Pickup  Request", allowedActions: ["create", "update", "view", "delete", "history", "export", "import"] },
  { key: "invoice", label: "Invoice", allowedActions: ["view", "export"] },
  { key: "reports", label: "Report", allowedActions: ["create", "update", "view", "delete", "history", "export", "import"] },
  { key: "salesAccount", label: "Sale Account", allowedActions: ["view", "export"] },
  { key: "customerRateCalc", label:"Customer Rate Calc", allowedActions: ["create", "update", "view", "delete", "history", "export", "import"] },
];

export interface WebPortalUserForm {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  reprintAwbLabel: boolean;
  hideLabelDoc: boolean;
  hideLabelPrint: boolean;
  permissions: Record<PortalModuleKey, Record<PortalAction, boolean>>;
}

export const defaultWebPortalUserForm: WebPortalUserForm = {
  name: "",
  email: "",
  password: "",
  isAdmin: false,
  reprintAwbLabel: false,
  hideLabelDoc: false,
  hideLabelPrint: false,
  permissions: {
    awb: { create: false, update: false, view: false, delete: false, history: false, export: false, import: false },
    manifest: { create: false, update: false, view: false, delete: false, history: false, export: false, import: false },
    pickupRequest: { create: false, update: false, view: false, delete: false, history: false, export: false, import: false },
    invoice: { create: false, update: false, view: false, delete: false, history: false, export: false, import: false },
    reports: { create: false, update: false, view: false, delete: false, history: false, export: false, import: false },
    salesAccount: { create: false, update: false, view: false, delete: false, history: false, export: false, import: false },
    customerRateCalc: { create: false, update: false, view: false, delete: false, history: false, export: false, import: false },
  },
};

export interface SmsNotificationsSettings {
  sendBookingSmsToCustomer: boolean;
  sendBookingSmsToShipper: boolean;
  sendBookingSmsToConsignee: boolean;
  sendDeliverySmsToCustomer: boolean;
  sendDeliverySmsToShipper: boolean;
  sendDeliverySmsToConsignee: boolean;
  sendPickUpRequestSmsToCustomer: boolean;
  sendPickUpRequestSmsToPickUp: boolean;
  sendPickUpRequestSmsToConsignee: boolean;
  sendPickUpSheetSmsToCustomer: boolean;
  sendPickUpSheetSmsToPickUp: boolean;
  sendPickUpSheetSmsToConsignee: boolean;
  sendOutstandingSmsToCustomer: boolean;
  sendInvoiceGenerationSmsToCustomer: boolean;
  sendOutForDeliverySmsToConsignee: boolean;
  sendOutForDeliverySmsToShipper: boolean;
}

export interface WhatsappNotificationsSettings {
  sendBookingWhatsappToCustomer: boolean;
  sendBookingWhatsappToShipper: boolean;
  sendBookingWhatsappToConsignee: boolean;
  sendDeliveryWhatsappToCustomer: boolean;
  sendDeliveryWhatsappToShipper: boolean;
  sendDeliveryWhatsappToConsignee: boolean;
  sendPickUpRequestWhatsappToCustomer: boolean;
  sendPickUpRequestWhatsappToPickUp: boolean;
  sendPickUpRequestWhatsappToConsignee: boolean;
  sendPickUpSheetWhatsappToCustomer: boolean;
  sendPickUpSheetWhatsappToPickUp: boolean;
  sendPickUpSheetWhatsappToConsignee: boolean;
  sendPickUpDoneWhatsappToCustomer: boolean;
  sendBalanceAmountWhatsappToShipper: boolean;
  sendPickUpDoneWhatsappToPickUp: boolean;
  sendPickUpDoneWhatsappToConsignee: boolean;
}

export interface EmailNotificationsSettings {
  sendPodEmail: boolean;
  sendBookingEmailPerAwb: boolean;
  sendBookingEmailDaily: boolean;
  sendBookingEmailDailyProductWise: boolean;
  sendWeightChangeEmailPerAwb: boolean;
  weightChangePerAwbType: string;
  sendWeightChangeEmailDaily: boolean;
  weightChangeDailyType: string;
  sendWeightChangeEmailTwiceDaily: boolean;
  weightChangeTwiceDailyType: string;
  sendOutstandingEmail: boolean;
  outstandingEmailType: string;
  sendAwbwiseLedgerEmail: boolean;
  sendInvoiceEmail: boolean;
  invoiceEmailType: string;
  sendReceiptEmail: boolean;
  sendAutoMisEmailCustomReport: boolean;
  sendBookingEmailToShipper: boolean;
  sendTrackingEmailToCustomer: boolean;
  sendBookingEmailWithAttachmentToShipper: boolean;
  bookingAttachmentType: string;
}

export interface AccountActivationSettings {
  sendAccountActivationEmail: boolean;
  sendAccountActivationLinkWhatsappAndEmail: boolean;
}

export interface AwbShipmentControlsSettings {
  sendNotificationsForShipmentHoldAndVoid: boolean;
  enableEditingOfAwbNumbers: boolean;
  calculateBillingBasedOnActualWeight: boolean;
  sendBookingWhatsappNotificationsToCustomers: boolean;
  sendLabelReprintWhatsappNotificationsToConsignees: boolean;
}

export interface BookingEmailsSettings {
  sendBookingEmailForEachAwb: boolean;
  sendDailyBookingSummaryEmail: boolean;
}

export interface DeliveryNotificationsSettings {
  sendDeliveryConfirmationEmailsToCustomers: boolean;
}

export interface WeightChangeNotificationsSettings {
  sendWeightChangeEmailForEachAwb: boolean;
  sendDailyWeightChangeSummaryEmail: boolean;
  sendWeightChangeEmailNotifications: boolean;
}

export interface InvoicePaymentAccountNotificationsSettings {
  sendInvoiceThroughWhatsappToCustomers: boolean;
  sendReceiptThroughWhatsappToCustomers: boolean;
  sendCreditLimitNotificationsThroughWhatsappToCustomers: boolean;
  sendOutstandingBalanceEmails: boolean;
  sendInvoiceEmails: boolean;
}

export interface CustomerNotificationSettings {
  accountActivation?: AccountActivationSettings;
  weightChangeNotifications?: WeightChangeNotificationsSettings;
  awbShipmentControls?: AwbShipmentControlsSettings;
  invoicePaymentAccountNotifications?: InvoicePaymentAccountNotificationsSettings;
  bookingEmails?: BookingEmailsSettings;
  deliveryNotifications?: DeliveryNotificationsSettings;
  sms?: SmsNotificationsSettings;
  whatsapp?: WhatsappNotificationsSettings;
  email?: EmailNotificationsSettings;
}

export const WEIGHT_CHANGE_TYPE_OPTIONS = [
  { value: "BOTH", label: "BOTH" },
  { value: "POSITIVE", label: "POSITIVE" },
  { value: "NEGATIVE", label: "NEGATIVE" },
];

export const OUTSTANDING_NOTIFICATION_EMAIL_OPTIONS = [
  { value: "", label: "Select..." },
  { value: "MONTHLY", label: "Monthly Statement" },
  { value: "WEEKLY", label: "Weekly Summary" },
  { value: "DAILY", label: "Daily Alert" },
  { value: "ON_DUE_DATE", label: "On Due Date" },
];

export const INVOICE_NOTIFICATION_EMAIL_OPTIONS = [
  { value: "", label: "Select..." },
  { value: "PDF", label: "PDF Format" },
  { value: "EXCEL", label: "Excel Format" },
  { value: "BOTH", label: "Both (PDF & Excel)" },
];

export const BOOKING_ATTACHMENT_OPTIONS = [
  { value: "", label: "Select..." },
  { value: "SHIPPING_LABEL", label: "Shipping Label" },
  { value: "INVOICE", label: "Invoice Document" },
  { value: "AWB_COPY", label: "AWB Copy" },
  { value: "ALL_DOCUMENTS", label: "All Documents" },
];

export const defaultNotificationSettings: CustomerNotificationSettings = {
  accountActivation: {
    sendAccountActivationEmail: false,
    sendAccountActivationLinkWhatsappAndEmail: false,
  },
  weightChangeNotifications: {
    sendWeightChangeEmailForEachAwb: false,
    sendDailyWeightChangeSummaryEmail: false,
    sendWeightChangeEmailNotifications: false,
  },
  awbShipmentControls: {
    sendNotificationsForShipmentHoldAndVoid: false,
    enableEditingOfAwbNumbers: false,
    calculateBillingBasedOnActualWeight: false,
    sendBookingWhatsappNotificationsToCustomers: false,
    sendLabelReprintWhatsappNotificationsToConsignees: false,
  },
  invoicePaymentAccountNotifications: {
    sendInvoiceThroughWhatsappToCustomers: false,
    sendReceiptThroughWhatsappToCustomers: false,
    sendCreditLimitNotificationsThroughWhatsappToCustomers: false,
    sendOutstandingBalanceEmails: false,
    sendInvoiceEmails: false,
  },
  bookingEmails: {
    sendBookingEmailForEachAwb: false,
    sendDailyBookingSummaryEmail: false,
  },
  deliveryNotifications: {
    sendDeliveryConfirmationEmailsToCustomers: false,
  },
  sms: {
    sendBookingSmsToCustomer: false,
    sendBookingSmsToShipper: false,
    sendBookingSmsToConsignee: false,
    sendDeliverySmsToCustomer: false,
    sendDeliverySmsToShipper: false,
    sendDeliverySmsToConsignee: false,
    sendPickUpRequestSmsToCustomer: false,
    sendPickUpRequestSmsToPickUp: false,
    sendPickUpRequestSmsToConsignee: false,
    sendPickUpSheetSmsToCustomer: false,
    sendPickUpSheetSmsToPickUp: false,
    sendPickUpSheetSmsToConsignee: false,
    sendOutstandingSmsToCustomer: false,
    sendInvoiceGenerationSmsToCustomer: false,
    sendOutForDeliverySmsToConsignee: false,
    sendOutForDeliverySmsToShipper: false,
  },
  whatsapp: {
    sendBookingWhatsappToCustomer: false,
    sendBookingWhatsappToShipper: false,
    sendBookingWhatsappToConsignee: false,
    sendDeliveryWhatsappToCustomer: false,
    sendDeliveryWhatsappToShipper: false,
    sendDeliveryWhatsappToConsignee: false,
    sendPickUpRequestWhatsappToCustomer: false,
    sendPickUpRequestWhatsappToPickUp: false,
    sendPickUpRequestWhatsappToConsignee: false,
    sendPickUpSheetWhatsappToCustomer: false,
    sendPickUpSheetWhatsappToPickUp: false,
    sendPickUpSheetWhatsappToConsignee: false,
    sendPickUpDoneWhatsappToCustomer: false,
    sendBalanceAmountWhatsappToShipper: false,
    sendPickUpDoneWhatsappToPickUp: false,
    sendPickUpDoneWhatsappToConsignee: false,
  },
  email: {
    sendPodEmail: false,
    sendBookingEmailPerAwb: false,
    sendBookingEmailDaily: false,
    sendBookingEmailDailyProductWise: false,
    sendWeightChangeEmailPerAwb: false,
    weightChangePerAwbType: "BOTH",
    sendWeightChangeEmailDaily: false,
    weightChangeDailyType: "BOTH",
    sendWeightChangeEmailTwiceDaily: false,
    weightChangeTwiceDailyType: "BOTH",
    sendOutstandingEmail: false,
    outstandingEmailType: "",
    sendAwbwiseLedgerEmail: false,
    sendInvoiceEmail: false,
    invoiceEmailType: "",
    sendReceiptEmail: false,
    sendAutoMisEmailCustomReport: false,
    sendBookingEmailToShipper: false,
    sendTrackingEmailToCustomer: false,
    sendBookingEmailWithAttachmentToShipper: false,
    bookingAttachmentType: "",
  },
};

export interface CustomerEntry {
  id: string;
  srNo?: number;
  name: string;
  company: string;
  originHub: string;
  parentCustomer: string;
  originCode: string;
  email: string;
  address: string;
  currency: string;
  paymentType: string;
  creditLimit: string | number;
  userType?: string;
  operationsId?: string;
  billingId?: string;
  status?: string;
  createdAt?: string;
  hubs?: string[];
  kycData?: any;
  contracts?: any;
  emailSettings?: CustomerEmailSettings;
  email_settings?: CustomerEmailSettings;
  webPortal?: WebPortalUserForm;
  web_portal?: WebPortalUserForm;
  notificationsSettings?: CustomerNotificationSettings;
  notifications_settings?: CustomerNotificationSettings;
}

export const COMPANY_OPTIONS = [
  { value: "", label: "Select..." },
  {
    value: "AMERICAN XPRESS COURIER - AXC INC",
    label: "AMERICAN XPRESS COURIER - AXC INC",
  },
  {
    value: "AX COURIER LOGISTICS - AX COURIER LOGISTICS",
    label: "AX COURIER LOGISTICS - AX COURIER LOGISTICS",
  },
];

export const ORIGIN_HUB_OPTIONS = [
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

export const PARENT_CUSTOMER_OPTIONS = [
  { value: "None", label: "None" },
  { value: "AMAZON", label: "AMAZON" },
  { value: "FLIPKART", label: "FLIPKART" },
  { value: "GLOBAL-EXP", label: "GLOBAL-EXP" },
  { value: "VELOCITY", label: "VELOCITY" },
  { value: "DHL Global Forwarding", label: "DHL Global Forwarding" },
];

export const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD" },
  { value: "PKR", label: "PKR" },
  { value: "AED", label: "AED" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "INR", label: "INR" },
];

export const USER_TYPE_OPTIONS = [
  { value: "B2B", label: "B2B" },
  { value: "B2C", label: "B2C" },
];

export const PAYMENT_TYPE_OPTIONS = [
  { value: "Credit", label: "Credit" },
  { value: "Cash", label: "Cash" },
  { value: "Prepaid", label: "Prepaid" },
  { value: "COD", label: "COD" },
  { value: "Bank Transfer", label: "Bank Transfer" },
];

export const CustomerHeadings = [
  { label: "SR.NO.", key: "srNo" },
  { label: "Name", key: "name", sortable: true },
  { label: "Company", key: "company", sortable: true },
  { label: "Origin Hub", key: "originHub", sortable: true },
  { label: "Parent Customer", key: "parentCustomer", sortable: true },
  { label: "Origin Code", key: "originCode", sortable: true },
  { label: "Email ID", key: "email" },
  { label: "Address", key: "address" },
  { label: "Currency", key: "currency" },
  { label: "Payment Type", key: "paymentType", sortable: true },
  { label: "Credit Limit", key: "creditLimit", sortable: true },
  { label: "User Type", key: "userType", sortable: true },
  { label: "Action", key: "action" },
];

export const customerFilterGroups = [
  {
    group: "Company",
    options: COMPANY_OPTIONS.filter((c) => c.value !== ""),
  },
  {
    group: "Origin Hub",
    options: ORIGIN_HUB_OPTIONS,
  },
  {
    group: "Payment Type",
    options: PAYMENT_TYPE_OPTIONS,
  },
  {
    group: "Currency",
    options: CURRENCY_OPTIONS,
  },
];

export const initialCustomerData: CustomerEntry[] = [
  {
    id: "CUST-101",
    srNo: 1,
    name: "Amazon Fulfillment Services",
    company: "AMERICAN XPRESS COURIER - AXC INC",
    originHub: "DEL",
    parentCustomer: "AMAZON",
    originCode: "DEL-CUST-101",
    email: "billing@amazon.in",
    address: "Block 4, Ambience Island, NH-8, Gurgaon, Haryana 122002",
    currency: "INR",
    paymentType: "Credit",
    creditLimit: "500000",
    status: "Active",
    createdAt: "2026-08-15",
  },
  {
    id: "CUST-102",
    srNo: 2,
    name: "Velocity Express Logistics",
    company: "AX COURIER LOGISTICS - AX COURIER LOGISTICS",
    originHub: "LHE",
    parentCustomer: "VELOCITY",
    originCode: "LHE-CUST-102",
    email: "operations@velocity.com.pk",
    address: "Plot 12, Main Boulevard, Gulberg III, Lahore, Pakistan",
    currency: "PKR",
    paymentType: "Credit",
    creditLimit: "250000",
    status: "Active",
    createdAt: "2026-08-18",
  },
  {
    id: "CUST-103",
    srNo: 3,
    name: "Global Exports International",
    company: "AX COURIER LOGISTICS - AX COURIER LOGISTICS",
    originHub: "KHI",
    parentCustomer: "GLOBAL-EXP",
    originCode: "KHI-CUST-103",
    email: "accounts@globalexports.pk",
    address: "Suite 402, Trade Tower, I.I. Chundrigar Road, Karachi, Pakistan",
    currency: "USD",
    paymentType: "Prepaid",
    creditLimit: "100000",
    status: "Active",
    createdAt: "2026-08-20",
  },
  {
    id: "CUST-104",
    srNo: 4,
    name: "Al-Futtaim Freight & Trade",
    company: "AMERICAN XPRESS COURIER - AXC INC",
    originHub: "DXB",
    parentCustomer: "None",
    originCode: "DXB-CUST-104",
    email: "cargo@alfuttaim.ae",
    address: "DAFZA Cargo Village Building 3, Dubai Airport Freezone, Dubai, UAE",
    currency: "AED",
    paymentType: "Credit",
    creditLimit: "750000",
    status: "Active",
    createdAt: "2026-08-22",
  },
  {
    id: "CUST-105",
    srNo: 5,
    name: "Flipkart Logistics India Pvt Ltd",
    company: "AMERICAN XPRESS COURIER - AXC INC",
    originHub: "BOM",
    parentCustomer: "FLIPKART",
    originCode: "BOM-CUST-105",
    email: "vendorpay@flipkart.com",
    address: "Buildings Alyssa, Begonia & Clover, Embassy Tech Village, Mumbai",
    currency: "INR",
    paymentType: "Credit",
    creditLimit: "1000000",
    status: "Active",
    createdAt: "2026-08-25",
  },
  {
    id: "CUST-106",
    srNo: 6,
    name: "Trans-Atlantic Express Inc",
    company: "AMERICAN XPRESS COURIER - AXC INC",
    originHub: "JFK",
    parentCustomer: "None",
    originCode: "JFK-CUST-106",
    email: "dispatch@transatlantic-us.com",
    address: "Cargo Building 75, JFK International Airport, Jamaica, NY 11430",
    currency: "USD",
    paymentType: "Bank Transfer",
    creditLimit: "300000",
    status: "Active",
    createdAt: "2026-09-02",
  },
  {
    id: "CUST-107",
    srNo: 7,
    name: "Crown Worldwide Logistics UK",
    company: "AX COURIER LOGISTICS - AX COURIER LOGISTICS",
    originHub: "LHR",
    parentCustomer: "None",
    originCode: "LHR-CUST-107",
    email: "accounts@crownworldwide.co.uk",
    address: "Unit 3, Scylla Road, Heathrow Airport, Hounslow, TW6 3FE",
    currency: "GBP",
    paymentType: "Credit",
    creditLimit: "450000",
    status: "Active",
    createdAt: "2026-09-10",
  },
];
