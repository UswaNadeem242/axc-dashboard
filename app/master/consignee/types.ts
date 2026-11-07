export interface ConsigneeEntry {
  id: string;
  srNo: number;

  // Image 1: Input Fields
  customer: string;
  company: string;
  code: string;
  name: string;
  contactNo: string;
  email: string;
  dob: string;
  idProof1: string;
  idProof2: string;
  status: "ACTIVE" | "INACTIVE";

  // Address Details
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  dialCode: string;

  createdAt: string;
}

export const COUNTRY_OPTIONS = [
  { value: "INDIA", label: "INDIA" },
  { value: "UNITED STATES", label: "UNITED STATES" },
  { value: "UNITED ARAB EMIRATES", label: "UNITED ARAB EMIRATES" },
  { value: "UNITED KINGDOM", label: "UNITED KINGDOM" },
  { value: "GERMANY", label: "GERMANY" },
  { value: "AUSTRALIA", label: "AUSTRALIA" },
  { value: "SINGAPORE", label: "SINGAPORE" },
  { value: "CANADA", label: "CANADA" },
  { value: "SAUDI ARABIA", label: "SAUDI ARABIA" },
];

export const CUSTOMER_OPTIONS = [
  { value: "SKT-AL-01", label: "SKT-AL-01 (FINE TRADERS)" },
  { value: "AXC-DEL-04", label: "AXC-DEL-04 (GLOBAL LOGISTICS)" },
  { value: "CUST-901", label: "CUST-901 (APEX EXPRESS PVT LTD)" },
  { value: "CUST-412", label: "CUST-412 (BLUE SKY TRADING CO)" },
  { value: "CUST-108", label: "CUST-108 (ROYAL CARGO SYSTEM)" },
];

export const COMPANY_OPTIONS = [
  { value: "AMERICAN XPRESS COURIER - AXC INC", label: "AMERICAN XPRESS COURIER - AXC INC" },
  { value: "AXC WORLDWIDE LOGISTICS PVT LTD", label: "AXC WORLDWIDE LOGISTICS PVT LTD" },
  { value: "FINE TRADERS & LOGISTICS", label: "FINE TRADERS & LOGISTICS" },
  { value: "APEX GLOBAL FREIGHT SOLUTIONS", label: "APEX GLOBAL FREIGHT SOLUTIONS" },
];

export const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "ACTIVE" },
  { value: "INACTIVE", label: "INACTIVE" },
];

export const ConsigneeHeadings = [
  { label: "SR.NO.", key: "srNo" },
  { label: "SELECT CONSIGNEE", key: "selectConsignee" },
  { label: "CONSIGNEE CODE", key: "code", sortable: true },
  { label: "CONSIGNEE NAME", key: "name", sortable: true },
  { label: "COMPANY", key: "company", sortable: true },
  { label: "CUSTOMER", key: "customer", sortable: true },
  { label: "CONTACT NO", key: "contactNo", sortable: true },
  { label: "CITY", key: "city", sortable: true },
  { label: "STATE", key: "state", sortable: true },
  { label: "COUNTRY", key: "country", sortable: true },
  { label: "PINCODE", key: "pincode", sortable: true },
  { label: "STATUS", key: "status", sortable: true },
  { label: "ACTION", key: "action" },
];

export const consigneeFilterGroups = [
  {
    group: "Status",
    options: [
      { label: "ACTIVE", value: "ACTIVE" },
      { label: "INACTIVE", value: "INACTIVE" },
    ],
  },
  {
    group: "Country",
    options: [
      { label: "INDIA", value: "INDIA" },
      { label: "UNITED STATES", value: "UNITED STATES" },
      { label: "UNITED ARAB EMIRATES", value: "UNITED ARAB EMIRATES" },
      { label: "UNITED KINGDOM", value: "UNITED KINGDOM" },
    ],
  },
  {
    group: "Company",
    options: [
      { label: "AMERICAN XPRESS COURIER - AXC INC", value: "AMERICAN XPRESS COURIER - AXC INC" },
      { label: "AXC WORLDWIDE LOGISTICS PVT LTD", value: "AXC WORLDWIDE LOGISTICS PVT LTD" },
      { label: "FINE TRADERS & LOGISTICS", value: "FINE TRADERS & LOGISTICS" },
    ],
  },
];

export const initialConsigneeData: ConsigneeEntry[] = [
  {
    id: "CSN-001",
    srNo: 1,
    customer: "SKT-AL-01",
    company: "AMERICAN XPRESS COURIER - AXC INC",
    code: "CSN101",
    name: "RAJBHIHAI PATEL",
    contactNo: "9876543210",
    email: "rajbhihai.patel@example.com",
    dob: "1988-06-15",
    idProof1: "id_passport_csn101.pdf",
    idProof2: "id_utility_csn101.pdf",
    status: "ACTIVE",
    addressLine1: "Flat 402, Shivalik High Street",
    addressLine2: "Near Judges Bungalow Road, Bodakdev",
    addressLine3: "Opp. Pakwan Dining Hall",
    city: "Ahmedabad",
    state: "Gujarat",
    country: "INDIA",
    pincode: "380054",
    dialCode: "+91",
    createdAt: "05/11/2026, 04:30 PM",
  },
  {
    id: "CSN-002",
    srNo: 2,
    customer: "AXC-DEL-04",
    company: "AXC WORLDWIDE LOGISTICS PVT LTD",
    code: "CSN102",
    name: "JOHN SMITH",
    contactNo: "4155552671",
    email: "john.smith@techlogix.com",
    dob: "1985-03-22",
    idProof1: "driving_licence_us.pdf",
    idProof2: "",
    status: "ACTIVE",
    addressLine1: "742 Evergreen Terrace",
    addressLine2: "Suite 300, Silicon District",
    addressLine3: "",
    city: "San Francisco",
    state: "California",
    country: "UNITED STATES",
    pincode: "94105",
    dialCode: "+1",
    createdAt: "04/11/2026, 11:20 AM",
  },
  {
    id: "CSN-003",
    srNo: 3,
    customer: "CUST-901",
    company: "FINE TRADERS & LOGISTICS",
    code: "CSN103",
    name: "MOHAMMED AL BALUSHI",
    contactNo: "501234567",
    email: "m.balushi@gulfexpress.ae",
    dob: "1990-11-10",
    idProof1: "emirates_id_scan.pdf",
    idProof2: "trade_license_ae.pdf",
    status: "ACTIVE",
    addressLine1: "Warehouse 14, Al Quoz Industrial 3",
    addressLine2: "Sheikh Zayed Road Exit 43",
    addressLine3: "PO Box 88321",
    city: "Dubai",
    state: "Dubai",
    country: "UNITED ARAB EMIRATES",
    pincode: "00000",
    dialCode: "+971",
    createdAt: "03/11/2026, 02:45 PM",
  },
  {
    id: "CSN-004",
    srNo: 4,
    customer: "CUST-412",
    company: "APEX GLOBAL FREIGHT SOLUTIONS",
    code: "CSN104",
    name: "EMILY JOHNSON",
    contactNo: "2079460912",
    email: "emily.j@apexretail.co.uk",
    dob: "1992-08-04",
    idProof1: "uk_passport_copy.pdf",
    idProof2: "",
    status: "INACTIVE",
    addressLine1: "Unit 8B, Canary Wharf Business Park",
    addressLine2: "Heron Quays",
    addressLine3: "",
    city: "London",
    state: "Greater London",
    country: "UNITED KINGDOM",
    pincode: "E14 4AB",
    dialCode: "+44",
    createdAt: "02/11/2026, 09:15 AM",
  },
  {
    id: "CSN-005",
    srNo: 5,
    customer: "SKT-AL-01",
    company: "AMERICAN XPRESS COURIER - AXC INC",
    code: "CSN105",
    name: "VIJAYKUMAR K DAVE",
    contactNo: "9825012345",
    email: "vkdave@daveenterprises.in",
    dob: "1978-12-01",
    idProof1: "aadhar_card_vkd.pdf",
    idProof2: "pan_card_vkd.pdf",
    status: "ACTIVE",
    addressLine1: "12, Dave Industrial Compound",
    addressLine2: "GIDC Vatva Phase 4",
    addressLine3: "Near Water Tank",
    city: "Ahmedabad",
    state: "Gujarat",
    country: "INDIA",
    pincode: "382445",
    dialCode: "+91",
    createdAt: "01/11/2026, 05:00 PM",
  },
];
