export interface WhatsappVariableItem {
  id: string;
  variable: string;
  valueExtractor: string;
  isButton: boolean;
}

export interface AwbRelatedValue {
  token: string;
  label: string;
  sample: string;
}

export interface WhatsappMasterEntry {
  id: string;
  title: string;
  whatsappIdentifier: string;
  templateName: string;
  smsContent: string;
  variables: WhatsappVariableItem[];
  status: "ACTIVE" | "INACTIVE";
  createdAt?: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  group: string;
  options: FilterOption[];
}

export const WhatsappMasterHeadings = [
  { label: "SR.NO.", key: "srNo" },
  { label: "SELECT TEMPLATE", key: "selectTemplate" },
  { label: "TITLE", key: "title", sortable: true },
  { label: "WHATSAPP IDENTIFIER", key: "whatsappIdentifier", sortable: true },
  { label: "TEMPLATE NAME", key: "templateName", sortable: true },
  { label: "VARIABLES COUNT", key: "variablesCount", sortable: false },
  { label: "STATUS", key: "status", sortable: true },
  { label: "ACTION", key: "action" },
];

export const WHATSAPP_IDENTIFIER_OPTIONS = [
  { label: "Select Identifier...", value: "" },
  { label: "BOOKING CONFIRMATION", value: "BOOKING CONFIRMATION" },
  { label: "OUT FOR DELIVERY", value: "OUT FOR DELIVERY" },
  { label: "SHIPMENT DELIVERED", value: "SHIPMENT DELIVERED" },
  { label: "IN TRANSIT UPDATE", value: "IN TRANSIT UPDATE" },
  { label: "DELAY / EXCEPTION ALERT", value: "DELAY / EXCEPTION ALERT" },
  { label: "RETURN TO ORIGIN (RTO)", value: "RETURN TO ORIGIN (RTO)" },
  { label: "OTP VERIFICATION", value: "OTP VERIFICATION" },
  { label: "INVOICE DISPATCH", value: "INVOICE DISPATCH" },
];

export const AWB_RELATED_VALUES_LIST: AwbRelatedValue[] = [
  { token: "{{awb_number}}", label: "AWB Number", sample: "AXC10029384" },
  { token: "{{customer_name}}", label: "Customer / Consignee Name", sample: "John Doe" },
  { token: "{{customer_phone}}", label: "Customer Phone", sample: "+92 300 1234567" },
  { token: "{{customer_address}}", label: "Delivery Address", sample: "Suite 4B, Blue Area, Islamabad" },
  { token: "{{origin_hub}}", label: "Origin Hub", sample: "Karachi Central Hub" },
  { token: "{{destination_hub}}", label: "Destination Hub", sample: "Lahore North Hub" },
  { token: "{{current_hub}}", label: "Current Hub", sample: "Faisalabad Transit" },
  { token: "{{current_status}}", label: "Current Status", sample: "OUT FOR DELIVERY" },
  { token: "{{booking_date}}", label: "Booking Date", sample: "2026-07-20" },
  { token: "{{expected_delivery}}", label: "Expected Delivery Date", sample: "2026-07-22" },
  { token: "{{service_type}}", label: "Service Type", sample: "Express Cargo" },
  { token: "{{pieces}}", label: "Number of Pieces", sample: "2" },
  { token: "{{weight}}", label: "Actual / Chargeable Weight", sample: "3.5 Kg" },
  { token: "{{tracking_url}}", label: "Live Tracking Link", sample: "https://track.axc.com/AXC10029384" },
  { token: "{{support_phone}}", label: "AXC Support Hotline", sample: "0800-292-292" },
];

export const whatsappMasterFilterGroups: FilterGroup[] = [
  {
    group: "Status",
    options: [
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" },
    ],
  },
  {
    group: "Identifier",
    options: [
      { label: "Booking Confirmation", value: "BOOKING CONFIRMATION" },
      { label: "Out For Delivery", value: "OUT FOR DELIVERY" },
      { label: "Shipment Delivered", value: "SHIPMENT DELIVERED" },
      { label: "In Transit Update", value: "IN TRANSIT UPDATE" },
      { label: "OTP Verification", value: "OTP VERIFICATION" },
    ],
  },
];

export const initialWhatsappMasterData: WhatsappMasterEntry[] = [
  {
    id: "wa_master_1",
    title: "Booking Acknowledgment",
    whatsappIdentifier: "BOOKING CONFIRMATION",
    templateName: "axc_booking_confirmed_v2",
    smsContent: "Dear {{customer_name}}, your shipment has been booked under AWB {{awb_number}} from {{origin_hub}} to {{destination_hub}}. Track here: {{tracking_url}}",
    variables: [
      { id: "var_1", variable: "VAR1", valueExtractor: "{{customer_name}}", isButton: false },
      { id: "var_2", variable: "VAR2", valueExtractor: "{{awb_number}}", isButton: false },
      { id: "var_3", variable: "VAR3", valueExtractor: "{{origin_hub}}", isButton: false },
      { id: "var_4", variable: "VAR4", valueExtractor: "{{tracking_url}}", isButton: true },
    ],
    status: "ACTIVE",
    createdAt: "2026-07-20",
  },
  {
    id: "wa_master_2",
    title: "Out For Delivery Alert",
    whatsappIdentifier: "OUT FOR DELIVERY",
    templateName: "axc_ofd_alert_v1",
    smsContent: "Hello {{customer_name}}, your package {{awb_number}} is out for delivery today. Rider will deliver to {{customer_address}}.",
    variables: [
      { id: "var_1", variable: "VAR1", valueExtractor: "{{customer_name}}", isButton: false },
      { id: "var_2", variable: "VAR2", valueExtractor: "{{awb_number}}", isButton: false },
      { id: "var_3", variable: "VAR3", valueExtractor: "{{customer_address}}", isButton: false },
    ],
    status: "ACTIVE",
    createdAt: "2026-07-21",
  },
  {
    id: "wa_master_3",
    title: "Delivery Success Message",
    whatsappIdentifier: "SHIPMENT DELIVERED",
    templateName: "axc_delivered_feedback",
    smsContent: "Dear customer, AWB {{awb_number}} has been delivered. Thank you for choosing AXC Logistics. For support call {{support_phone}}.",
    variables: [
      { id: "var_1", variable: "VAR1", valueExtractor: "{{awb_number}}", isButton: false },
      { id: "var_2", variable: "VAR2", valueExtractor: "{{support_phone}}", isButton: false },
    ],
    status: "ACTIVE",
    createdAt: "2026-07-22",
  },
];

