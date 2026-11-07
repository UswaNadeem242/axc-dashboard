export interface StateZoneMapping {
  id: string;
  zone: string;
  type: "BOTH" | "CUSTOMER" | "VENDOR";
  customer: string;
  service: string;
  vendor: string;
  effectiveFrom: string;
  effectiveTill: string;
  serviceType: "SERVICEABLE" | "NON-SERVICEABLE";
}

export interface StateEntry {
  id: string;
  name: string;
  code: string;
  portCode?: string;
  country: string;
  gstStateCode?: string;
  skynetState?: string;
  eWaybillMaxAmount?: string;
  intrastateMaxAmount?: string;
  interstateMaxAmount?: string;
  status: "ACTIVE" | "INACTIVE";
  zones: StateZoneMapping[];
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

export const StateHeadings = [
  { label: "SR.NO.", key: "sr", sortable: false },
  { label: "SELECT STATE", key: "select", sortable: false },
  { label: "NAME", key: "name", sortable: true },
  { label: "CODE", key: "code", sortable: true },
  { label: "PORT CODE", key: "portCode", sortable: true },
  { label: "COUNTRY", key: "country", sortable: true },
  { label: "GST STATE CODE", key: "gstStateCode", sortable: true },
  { label: "E-WAYBILL MAX", key: "eWaybillMaxAmount", sortable: true },
  { label: "STATUS", key: "status", sortable: true },
  { label: "ACTION", key: "action", sortable: false },
];

export const stateFilterGroups: FilterGroup[] = [
  {
    group: "Status",
    options: [
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" },
    ],
  },
  {
    group: "Country",
    options: [
      { label: "United States", value: "UNITED STATES" },
      { label: "India", value: "INDIA" },
      { label: "United Arab Emirates", value: "UNITED ARAB EMIRATES" },
      { label: "Canada", value: "CANADA" },
      { label: "United Kingdom", value: "UNITED KINGDOM" },
    ],
  },
];

export const COUNTRY_OPTIONS = [
  { label: "Select Country...", value: "" },
  { label: "UNITED STATES", value: "UNITED STATES" },
  { label: "INDIA", value: "INDIA" },
  { label: "UNITED ARAB EMIRATES", value: "UNITED ARAB EMIRATES" },
  { label: "CANADA", value: "CANADA" },
  { label: "UNITED KINGDOM", value: "UNITED KINGDOM" },
  { label: "AUSTRALIA", value: "AUSTRALIA" },
  { label: "GERMANY", value: "GERMANY" },
  { label: "SINGAPORE", value: "SINGAPORE" },
  { label: "SAUDI ARABIA", value: "SAUDI ARABIA" },
];

export const ZONE_OPTIONS = [
  { label: "Select Zone...", value: "" },
  { label: "ZONE 1", value: "ZONE 1" },
  { label: "ZONE 2", value: "ZONE 2" },
  { label: "ZONE 3", value: "ZONE 3" },
  { label: "ZONE 4", value: "ZONE 4" },
  { label: "ZONE A", value: "ZONE A" },
  { label: "ZONE B", value: "ZONE B" },
  { label: "DOMESTIC", value: "DOMESTIC" },
  { label: "INTERNATIONAL", value: "INTERNATIONAL" },
];

export const TYPE_OPTIONS = [
  { label: "BOTH", value: "BOTH" },
  { label: "CUSTOMER", value: "CUSTOMER" },
  { label: "VENDOR", value: "VENDOR" },
];

export const SERVICE_OPTIONS = [
  { label: "Select Service...", value: "" },
  { label: "ALL SERVICES", value: "ALL" },
  { label: "FEDEX", value: "FEDEX" },
  { label: "DHL", value: "DHL" },
  { label: "UPS", value: "UPS" },
  { label: "INXPRESS", value: "INXPRESS" },
  { label: "NORSK", value: "NORSK" },
  { label: "DSV", value: "DSV" },
];

export const VENDOR_OPTIONS = [
  { label: "Select Vendor...", value: "" },
  { label: "ALL VENDORS", value: "ALL" },
  { label: "AMERICAN XPRESS COURIER", value: "AMERICAN XPRESS COURIER" },
  { label: "AXC INC", value: "AXC INC" },
  { label: "DHL EXPRESS", value: "DHL EXPRESS" },
  { label: "FEDEX CORP", value: "FEDEX CORP" },
  { label: "UPS LOGISTICS", value: "UPS LOGISTICS" },
];

export const CUSTOMER_OPTIONS = [
  { label: "Select Customer...", value: "" },
  { label: "ALL CUSTOMERS", value: "ALL" },
  { label: "SKT-AL-01 - SKYNET AL AIN", value: "SKT-AL-01" },
  { label: "SKT-DXB-02 - SKYNET DUBAI", value: "SKT-DXB-02" },
  { label: "AXC-DEL-01 - AXC DELHI", value: "AXC-DEL-01" },
  { label: "AXC-MUM-02 - AXC MUMBAI", value: "AXC-MUM-02" },
];

export const SERVICE_TYPE_OPTIONS = [
  { label: "SERVICEABLE", value: "SERVICEABLE" },
  { label: "NON-SERVICEABLE", value: "NON-SERVICEABLE" },
];

export const initialStateData: StateEntry[] = [
  {
    id: "state_1",
    name: "CALIFORNIA",
    code: "CA",
    portCode: "USLAX",
    country: "UNITED STATES",
    gstStateCode: "06",
    skynetState: "CA-SKY",
    eWaybillMaxAmount: "50000",
    intrastateMaxAmount: "100000",
    interstateMaxAmount: "50000",
    status: "ACTIVE",
    createdAt: "2026-07-20",
    zones: [
      {
        id: "zone_map_1",
        zone: "ZONE 1",
        type: "BOTH",
        customer: "ALL",
        service: "FEDEX",
        vendor: "AMERICAN XPRESS COURIER",
        effectiveFrom: "2026-01-01",
        effectiveTill: "2026-12-31",
        serviceType: "SERVICEABLE",
      },
    ],
  },
  {
    id: "state_2",
    name: "TEXAS",
    code: "TX",
    portCode: "USDAL",
    country: "UNITED STATES",
    gstStateCode: "08",
    skynetState: "TX-SKY",
    eWaybillMaxAmount: "50000",
    intrastateMaxAmount: "100000",
    interstateMaxAmount: "50000",
    status: "ACTIVE",
    createdAt: "2026-07-21",
    zones: [
      {
        id: "zone_map_2",
        zone: "ZONE 2",
        type: "BOTH",
        customer: "ALL",
        service: "DHL",
        vendor: "AXC INC",
        effectiveFrom: "2026-01-01",
        effectiveTill: "2026-12-31",
        serviceType: "SERVICEABLE",
      },
    ],
  },
  {
    id: "state_3",
    name: "MAHARASHTRA",
    code: "MH",
    portCode: "INBOM",
    country: "INDIA",
    gstStateCode: "27",
    skynetState: "MH-SKY",
    eWaybillMaxAmount: "50000",
    intrastateMaxAmount: "100000",
    interstateMaxAmount: "50000",
    status: "ACTIVE",
    createdAt: "2026-07-22",
    zones: [
      {
        id: "zone_map_3",
        zone: "ZONE A",
        type: "BOTH",
        customer: "ALL",
        service: "UPS",
        vendor: "AMERICAN XPRESS COURIER",
        effectiveFrom: "2026-01-01",
        effectiveTill: "2026-12-31",
        serviceType: "SERVICEABLE",
      },
    ],
  },
  {
    id: "state_4",
    name: "DUBAI",
    code: "DXB",
    portCode: "AEDXB",
    country: "UNITED ARAB EMIRATES",
    gstStateCode: "-",
    skynetState: "DXB-SKY",
    eWaybillMaxAmount: "100000",
    intrastateMaxAmount: "200000",
    interstateMaxAmount: "100000",
    status: "ACTIVE",
    createdAt: "2026-07-23",
    zones: [
      {
        id: "zone_map_4",
        zone: "DOMESTIC",
        type: "BOTH",
        customer: "SKT-DXB-02",
        service: "FEDEX",
        vendor: "AXC INC",
        effectiveFrom: "2026-01-01",
        effectiveTill: "2026-12-31",
        serviceType: "SERVICEABLE",
      },
    ],
  },
];

