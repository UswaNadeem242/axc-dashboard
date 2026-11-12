export interface KycDocumentEntry {
  docNumber: string;
  name: string;
  page1?: string;
  page2?: string;
}

export interface ShipperEntry {
  id: string;
  srNo: number;

  // Profile Fields (from Reference Image)
  code: string;
  name: string;
  customer: string;
  accountCode: string;
  company: string;
  contactNo: string;
  email: string;
  pincode: string;
  dob: string;
  gstinType: string;
  gstinNo: string;
  gstinType2: string;
  gstinNo2: string;

  // Files & Attachments (from Reference Image)
  page1File: string;
  page2File: string;
  shipperImage: string;
  uploadSignature: string;

  // Status
  status: "ACTIVE" | "INACTIVE";

  // Address Details (from Reference Image)
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  state: string;
  country: string;
  dialCode: string;

  // Optional KYC Documents Map
  kycDocuments?: Record<string, KycDocumentEntry>;

  createdAt: string;
}

export const GSTIN_TYPE_OPTIONS = [
  { value: "REGULAR", label: "REGULAR" },
  { value: "COMPOSITION", label: "COMPOSITION" },
  { value: "CONSUMER", label: "CONSUMER" },
  { value: "UNREGISTERED", label: "UNREGISTERED" },
  { value: "OVERSEAS", label: "OVERSEAS" },
  { value: "GOVERNMENT", label: "GOVERNMENT" },
  { value: "DIPLOMAT", label: "DIPLOMAT" },
  { value: "SEZ DEVELOPER", label: "SEZ DEVELOPER" },
  { value: "SEZ UNIT", label: "SEZ UNIT" },
];

export const COUNTRY_OPTIONS = [
  { value: "INDIA", label: "INDIA" },
  { value: "UNITED STATES", label: "UNITED STATES" },
  { value: "UNITED ARAB EMIRATES", label: "UNITED ARAB EMIRATES" },
  { value: "UNITED KINGDOM", label: "UNITED KINGDOM" },
  { value: "GERMANY", label: "GERMANY" },
  { value: "AUSTRALIA", label: "AUSTRALIA" },
  { value: "SINGAPORE", label: "SINGAPORE" },
  { value: "SAUDI ARABIA", label: "SAUDI ARABIA" },
  { value: "CANADA", label: "CANADA" },
  { value: "CHINA", label: "CHINA" },
  { value: "JAPAN", label: "JAPAN" },
  { value: "FRANCE", label: "FRANCE" },
];

export const CUSTOMER_OPTIONS = [
  { value: "APEX GLOBAL LOGISTICS", label: "APEX GLOBAL LOGISTICS (CUST-101)" },
  { value: "DHL FORWARDING", label: "DHL FORWARDING (CUST-102)" },
  { value: "FEDEX EXPRESS", label: "FEDEX EXPRESS (CUST-103)" },
  { value: "BLUE DART EXPRESS", label: "BLUE DART EXPRESS (CUST-104)" },
  { value: "DELHIVERY LIMITED", label: "DELHIVERY LIMITED (CUST-105)" },
];

export const initialShipperData: ShipperEntry[] = [
  {
    id: "SHP-1001",
    srNo: 1,
    code: "SHP001",
    name: "RAJESH SHARMA",
    customer: "APEX GLOBAL LOGISTICS",
    accountCode: "ACC-9921",
    company: "SHARMA EXPORTS PVT LTD",
    contactNo: "+91 98765 43210",
    email: "rajesh@sharmaexports.com",
    pincode: "110037",
    dob: "05/14/1985",
    gstinType: "REGULAR",
    gstinNo: "07AAAAA0000A1Z5",
    gstinType2: "COMPOSITION",
    gstinNo2: "",
    page1File: "gst_doc_p1.pdf",
    page2File: "gst_doc_p2.pdf",
    shipperImage: "shipper_photo.png",
    uploadSignature: "signature.png",
    status: "ACTIVE",
    addressLine1: "Plot No. 45, Sector 18",
    addressLine2: "Phase IV, Udyog Vihar",
    addressLine3: "Near Cyber Hub",
    city: "GURUGRAM",
    state: "HARYANA",
    country: "INDIA",
    dialCode: "+91",
    createdAt: "01/11/2026 10:30 AM",
  },
  {
    id: "SHP-1002",
    srNo: 2,
    code: "SHP002",
    name: "ANANYA VERMA",
    customer: "DHL FORWARDING",
    accountCode: "ACC-8832",
    company: "VERMA TEXTILES & APPAREL",
    contactNo: "+91 98111 22334",
    email: "ananya@vermatextiles.in",
    pincode: "400099",
    dob: "09/22/1990",
    gstinType: "REGULAR",
    gstinNo: "27BBBBB1111B2Z6",
    gstinType2: "",
    gstinNo2: "",
    page1File: "certificate.pdf",
    page2File: "",
    shipperImage: "ananya_profile.jpg",
    uploadSignature: "sign_verma.png",
    status: "ACTIVE",
    addressLine1: "Unit 302, Crystal Plaza",
    addressLine2: "Andheri-Kurla Road",
    addressLine3: "Opposite Metro Station",
    city: "MUMBAI",
    state: "MAHARASHTRA",
    country: "INDIA",
    dialCode: "+91",
    createdAt: "02/11/2026 02:15 PM",
  },
  {
    id: "SHP-1003",
    srNo: 3,
    code: "SHP003",
    name: "VIKRAM JOSHI",
    customer: "FEDEX EXPRESS",
    accountCode: "ACC-7744",
    company: "JOSHI PRECISION INSTRUMENTS",
    contactNo: "+91 97222 33445",
    email: "v.joshi@joshiprecision.com",
    pincode: "560001",
    dob: "11/08/1978",
    gstinType: "SEZ UNIT",
    gstinNo: "29CCCCC2222C3Z7",
    gstinType2: "",
    gstinNo2: "",
    page1File: "sez_approval.pdf",
    page2File: "",
    shipperImage: "",
    uploadSignature: "v_joshi_sig.png",
    status: "INACTIVE",
    addressLine1: "Tech Hub Building 4",
    addressLine2: "Whitefield Main Road",
    addressLine3: "EPIP Zone",
    city: "BENGALURU",
    state: "KARNATAKA",
    country: "INDIA",
    dialCode: "+91",
    createdAt: "03/11/2026 11:45 AM",
  },
];

export const ShipperHeadings = [
  { label: "SR.NO.", key: "srNo" },
  { label: "SELECT SHIPPER", key: "selectShipper" },
  { label: "SHIPPER CODE", key: "code", sortable: true },
  { label: "SHIPPER NAME", key: "name", sortable: true },
  { label: "COMPANY", key: "company", sortable: true },
  { label: "CUSTOMER", key: "customer", sortable: true },
  { label: "ACCOUNT CODE", key: "accountCode", sortable: true },
  { label: "CONTACT NO", key: "contactNo", sortable: true },
  { label: "CITY", key: "city", sortable: true },
  { label: "STATE", key: "state", sortable: true },
  { label: "COUNTRY", key: "country", sortable: true },
  // { label: "GSTIN NO", key: "gstinNo", sortable: true },
  { label: "STATUS", key: "status", sortable: true },
  { label: "ACTION", key: "action" },
];

export const shipperFilterGroups = [
  {
    group: "Status",
    options: [
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" },
    ],
  },
  {
    group: "GSTIN Type",
    options: GSTIN_TYPE_OPTIONS,
  },
  {
    group: "Country",
    options: COUNTRY_OPTIONS.slice(0, 5),
  },
];

