export interface HubEntry {
  id: string;
  name: string;
  code: string;
  type?: string;
  contractHead?: string;
  contactNo?: string;
  email?: string;
  address?: string;
  airportCode?: string;
  airportName?: string;
  stateCode?: string;
  country?: string;
  company?: string;
  hubTrackingName?: string;
  cashRangeFrom?: string;
  cashRangeTo?: string;
  otherRangeFrom?: string;
  otherRangeTo?: string;
  isDestinationHub?: boolean;
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

export const HubHeadings = [
  { label: "SR.NO.", key: "srNo" },
  { label: "SELECT HUB", key: "selectHub" },
  { label: "HUB NAME", key: "name", sortable: true },
  { label: "CODE", key: "code", sortable: true },
  { label: "TYPE", key: "type", sortable: true },
  { label: "AIRPORT CODE", key: "airportCode", sortable: true },
  { label: "AIRPORT NAME", key: "airportName", sortable: true },
  { label: "STATE CODE", key: "stateCode", sortable: true },
  { label: "COUNTRY", key: "country", sortable: true },
  { label: "COMPANY", key: "company", sortable: true },
  { label: "STATUS", key: "status", sortable: true },
  { label: "ACTION", key: "action" },
];

export const hubFilterGroups: FilterGroup[] = [
  {
    group: "Status",
    options: [
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" },
    ],
  },
  {
    group: "Type",
    options: [
      { label: "Both", value: "BOTH" },
      { label: "Origin", value: "ORIGIN" },
      { label: "Destination", value: "DESTINATION" },
      { label: "Transit", value: "TRANSIT" },
    ],
  },
  {
    group: "Country",
    options: [
      { label: "United Arab Emirates", value: "UNITED ARAB EMIRATES" },
      { label: "United States", value: "UNITED STATES" },
      { label: "India", value: "INDIA" },
      { label: "United Kingdom", value: "UNITED KINGDOM" },
    ],
  },
];

export const HUB_TYPE_OPTIONS = [
  { label: "Select Type...", value: "" },
  { label: "BOTH", value: "BOTH" },
  { label: "ORIGIN", value: "ORIGIN" },
  { label: "DESTINATION", value: "DESTINATION" },
  { label: "TRANSIT", value: "TRANSIT" },
];

export const CONTRACT_HEAD_OPTIONS = [
  { label: "Select Contract Head...", value: "" },
  { label: "HEAD OFFICE", value: "HEAD OFFICE" },
  { label: "REGIONAL OFFICE", value: "REGIONAL OFFICE" },
  { label: "BRANCH", value: "BRANCH" },
];

export const COMPANY_OPTIONS = [
  { label: "Select Company...", value: "" },
  {
    label: "AMERICAN XPRESS COURIER - AXC INC",
    value: "AMERICAN XPRESS COURIER - AXC INC",
  },
  { label: "AXC LOGISTICS LLC", value: "AXC LOGISTICS LLC" },
  { label: "GLOBAL EXPRESS LTD", value: "GLOBAL EXPRESS LTD" },
];

export const COUNTRY_OPTIONS = [
  { label: "Select Country...", value: "" },
  { label: "UNITED ARAB EMIRATES", value: "UNITED ARAB EMIRATES" },
  { label: "UNITED STATES", value: "UNITED STATES" },
  { label: "INDIA", value: "INDIA" },
  { label: "UNITED KINGDOM", value: "UNITED KINGDOM" },
  { label: "CANADA", value: "CANADA" },
  { label: "SINGAPORE", value: "SINGAPORE" },
  { label: "GERMANY", value: "GERMANY" },
  { label: "SAUDI ARABIA", value: "SAUDI ARABIA" },
];

export const initialHubData: HubEntry[] = [
  {
    id: "hub_1",
    name: "DUBAI MAIN HUB",
    code: "DXB-HUB",
    type: "BOTH",
    contractHead: "HEAD OFFICE",
    contactNo: "+971 4 282 1234",
    email: "hub.dxb@axc.com",
    address: "Cargo Village, Building B, Dubai Airport Freezone",
    airportCode: "DXB",
    airportName: "Dubai International Airport",
    stateCode: "DXB",
    country: "UNITED ARAB EMIRATES",
    company: "AMERICAN XPRESS COURIER - AXC INC",
    hubTrackingName: "DXB-MAIN-SCAN",
    cashRangeFrom: "0",
    cashRangeTo: "50000",
    otherRangeFrom: "0",
    otherRangeTo: "100000",
    isDestinationHub: true,
    status: "ACTIVE",
    createdAt: "2026-07-20",
  },
  {
    id: "hub_2",
    name: "NEW YORK JFK HUB",
    code: "JFK-HUB",
    type: "BOTH",
    contractHead: "HEAD OFFICE",
    contactNo: "+1 718 555 0199",
    email: "hub.jfk@axc.com",
    address: "Building 151, JFK International Airport, Jamaica, NY",
    airportCode: "JFK",
    airportName: "John F. Kennedy International Airport",
    stateCode: "NY",
    country: "UNITED STATES",
    company: "AMERICAN XPRESS COURIER - AXC INC",
    hubTrackingName: "JFK-SORT-01",
    cashRangeFrom: "0",
    cashRangeTo: "50000",
    otherRangeFrom: "0",
    otherRangeTo: "100000",
    isDestinationHub: true,
    status: "ACTIVE",
    createdAt: "2026-07-21",
  },
  {
    id: "hub_3",
    name: "MUMBAI BOM HUB",
    code: "BOM-HUB",
    type: "BOTH",
    contractHead: "REGIONAL OFFICE",
    contactNo: "+91 22 6123 4567",
    email: "hub.bom@axc.com",
    address: "Air Cargo Complex, Sahar Road, Andheri East, Mumbai",
    airportCode: "BOM",
    airportName: "Chhatrapati Shivaji Maharaj International Airport",
    stateCode: "MH",
    country: "INDIA",
    company: "AMERICAN XPRESS COURIER - AXC INC",
    hubTrackingName: "BOM-AIR-SCAN",
    cashRangeFrom: "0",
    cashRangeTo: "100000",
    otherRangeFrom: "0",
    otherRangeTo: "200000",
    isDestinationHub: true,
    status: "ACTIVE",
    createdAt: "2026-07-22",
  },
  {
    id: "hub_4",
    name: "LONDON HEATHROW HUB",
    code: "LHR-HUB",
    type: "DESTINATION",
    contractHead: "BRANCH",
    contactNo: "+44 20 8759 1234",
    email: "hub.lhr@axc.com",
    address: "World Cargo Centre, Heathrow Airport, Hounslow",
    airportCode: "LHR",
    airportName: "Heathrow Airport",
    stateCode: "LDN",
    country: "UNITED KINGDOM",
    company: "AMERICAN XPRESS COURIER - AXC INC",
    hubTrackingName: "LHR-IMPORT-01",
    cashRangeFrom: "0",
    cashRangeTo: "30000",
    otherRangeFrom: "0",
    otherRangeTo: "75000",
    isDestinationHub: true,
    status: "ACTIVE",
    createdAt: "2026-07-23",
  },
];
