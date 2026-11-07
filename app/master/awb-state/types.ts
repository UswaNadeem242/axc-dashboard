export interface AwbStateEntry {
  id: string;
  stateName: string;
  eventDateTime: string;
  eventLocation: string;
  descriptions: string[];
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

export const AwbStateHeadings = [
  { label: "SR.NO.", key: "srNo" },
  { label: "SELECT STATE", key: "selectState" },
  { label: "STATE NAME", key: "stateName", sortable: true },
  { label: "EVENT DATE & TIME", key: "eventDateTime", sortable: true },
  { label: "EVENT LOCATION", key: "eventLocation", sortable: true },
  { label: "DESCRIPTIONS", key: "descriptions", sortable: false },
  { label: "STATUS", key: "status", sortable: true },
  { label: "ACTION", key: "action" },
];

export const awbStateFilterGroups: FilterGroup[] = [
  {
    group: "Status",
    options: [
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" },
    ],
  },
  {
    group: "State Name",
    options: [
      { label: "Picked Up", value: "PICKED UP" },
      { label: "In Transit", value: "IN TRANSIT" },
      { label: "Arrived At Hub", value: "ARRIVED AT HUB" },
      { label: "Out For Delivery", value: "OUT FOR DELIVERY" },
      { label: "Delivered", value: "DELIVERED" },
      { label: "Held At Customs", value: "HELD AT CUSTOMS" },
    ],
  },
];

export const STATE_NAME_OPTIONS = [
  { label: "Select State Name...", value: "" },
  { label: "PICKED UP", value: "PICKED UP" },
  { label: "IN TRANSIT", value: "IN TRANSIT" },
  { label: "ARRIVED AT HUB", value: "ARRIVED AT HUB" },
  { label: "DEPARTED FROM HUB", value: "DEPARTED FROM HUB" },
  { label: "OUT FOR DELIVERY", value: "OUT FOR DELIVERY" },
  { label: "DELIVERED", value: "DELIVERED" },
  { label: "FAILED DELIVERY ATTEMPT", value: "FAILED DELIVERY ATTEMPT" },
  { label: "HELD AT CUSTOMS", value: "HELD AT CUSTOMS" },
  { label: "RETURN TO ORIGIN (RTO)", value: "RETURN TO ORIGIN (RTO)" },
  { label: "CANCELLED", value: "CANCELLED" },
];

export const EVENT_DATETIME_OPTIONS = [
  { label: "Select Event Date & Time...", value: "" },
  { label: "CURRENT DATE & TIME", value: "CURRENT DATE & TIME" },
  { label: "SYSTEM DATE & TIME", value: "SYSTEM DATE & TIME" },
  { label: "BOOKING DATE & TIME", value: "BOOKING DATE & TIME" },
  { label: "CUSTOM EVENT DATE & TIME", value: "CUSTOM EVENT DATE & TIME" },
];

export const EVENT_LOCATION_OPTIONS = [
  { label: "Select Event Location...", value: "" },
  { label: "ORIGIN HUB", value: "ORIGIN HUB" },
  { label: "DESTINATION HUB", value: "DESTINATION HUB" },
  { label: "CURRENT HUB", value: "CURRENT HUB" },
  { label: "TRANSIT HUB", value: "TRANSIT HUB" },
  { label: "DELIVERY LOCATION", value: "DELIVERY LOCATION" },
];

export const initialAwbStateData: AwbStateEntry[] = [
  {
    id: "awb_state_1",
    stateName: "PICKED UP",
    eventDateTime: "CURRENT DATE & TIME",
    eventLocation: "ORIGIN HUB",
    descriptions: [
      "Shipment has been picked up from shipper premises.",
      "Package received and weighed at collection center.",
    ],
    status: "ACTIVE",
    createdAt: "2026-07-20",
  },
  {
    id: "awb_state_2",
    stateName: "IN TRANSIT",
    eventDateTime: "SYSTEM DATE & TIME",
    eventLocation: "TRANSIT HUB",
    descriptions: [
      "Shipment in transit to destination hub.",
      "Bagged and forwarded on flight cargo manifest.",
    ],
    status: "ACTIVE",
    createdAt: "2026-07-21",
  },
  {
    id: "awb_state_3",
    stateName: "ARRIVED AT HUB",
    eventDateTime: "CURRENT DATE & TIME",
    eventLocation: "DESTINATION HUB",
    descriptions: [
      "Shipment arrived at destination facility and debagged for sorting.",
    ],
    status: "ACTIVE",
    createdAt: "2026-07-22",
  },
  {
    id: "awb_state_4",
    stateName: "OUT FOR DELIVERY",
    eventDateTime: "CURRENT DATE & TIME",
    eventLocation: "CURRENT HUB",
    descriptions: [
      "Shipment out for delivery with courier rider.",
    ],
    status: "ACTIVE",
    createdAt: "2026-07-23",
  },
  {
    id: "awb_state_5",
    stateName: "DELIVERED",
    eventDateTime: "CURRENT DATE & TIME",
    eventLocation: "DELIVERY LOCATION",
    descriptions: [
      "Shipment delivered successfully to consignee. Proof of delivery received.",
    ],
    status: "ACTIVE",
    createdAt: "2026-07-24",
  },
];

