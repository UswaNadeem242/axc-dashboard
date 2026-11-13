import { MasterModuleConfig } from "../_shared/master-page-views";

export interface VendorEntry {
  id: string;
  srNo?: number;
  code: string;
  name: string;
  vendorType: string;
  company: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstNo: string;
  panNo: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  paymentTerms: string;
  creditDays: number;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  apiTrackUrl: string;
  status: string;
}

export const vendorModuleConfig: MasterModuleConfig<VendorEntry> = {
  title: "Vendors",
  singularTitle: "Vendor",
  panelTitle: "Vendor Information",
  endpoint: "/vendors",
  storageKey: "master_vendors",
  basePath: "/master/vendor",
  primaryKeyField: "name",
  secondaryKeyField: "code",
  statusCase: "TITLE",
  columns: [
    { key: "srNo", label: "SR.NO." },
    { key: "code", label: "Code", sortable: true, badge: "code" },
    { key: "name", label: "Vendor Name", sortable: true },
    { key: "vendorType", label: "Vendor Type", sortable: true, badge: "blue" },
    { key: "company", label: "Company", sortable: true },
    // { key: "contactPerson", label: "Contact Person", sortable: true },
    // { key: "phone", label: "Phone", badge: "mono" },
    // { key: "city", label: "City", sortable: true },
    // { key: "country", label: "Country", sortable: true },
    // { key: "paymentTerms", label: "Payment Terms", sortable: true },
    { key: "status", label: "Status", sortable: true, badge: "status" },
    { key: "action", label: "Action" },
  ],
  fields: [
    { key: "code", label: "Vendor Code", required: true, uppercase: true, mono: true, placeholder: "e.g. VND-DHL" },
    { key: "name", label: "Vendor Name", required: true, placeholder: "Enter Vendor Name" },
    {
      key: "vendorType",
      label: "Vendor Type",
      type: "select",
      defaultValue: "Courier",
      options: [
        { value: "Courier", label: "Courier" },
        { value: "Airline", label: "Airline" },
        { value: "Co-Loader", label: "Co-Loader" },
        { value: "Surface", label: "Surface" },
        { value: "Last Mile", label: "Last Mile" },
      ],
    },
    {
      key: "company",
      label: "Company",
      type: "select",
      defaultValue: "AMERICAN XPRESS COURIER - AXC INC",
      options: [
        { value: "AMERICAN XPRESS COURIER - AXC INC", label: "AMERICAN XPRESS COURIER - AXC INC" },
        { value: "AX COURIER LOGISTICS - AX COURIER LOGISTICS", label: "AX COURIER LOGISTICS - AX COURIER LOGISTICS" },
      ],
    },
    { key: "contactPerson", label: "Contact Person", placeholder: "Enter Contact Person" },
    { key: "phone", label: "Phone", mono: true, placeholder: "Enter Phone Number" },
    { key: "email", label: "Email", type: "email", placeholder: "Enter Email Address" },
    { key: "gstNo", label: "GST No.", uppercase: true, mono: true, placeholder: "Enter GST No." },
    { key: "panNo", label: "PAN No.", uppercase: true, mono: true, placeholder: "Enter PAN No." },
    { key: "city", label: "City", placeholder: "Enter City" },
    { key: "state", label: "State", placeholder: "Enter State" },
    { key: "country", label: "Country", defaultValue: "INDIA", placeholder: "Enter Country" },
    { key: "pincode", label: "Pincode", mono: true, placeholder: "Enter Pincode" },
    {
      key: "paymentTerms",
      label: "Payment Terms",
      type: "select",
      defaultValue: "Net 30",
      options: [
        { value: "Advance", label: "Advance" },
        { value: "Net 15", label: "Net 15" },
        { value: "Net 30", label: "Net 30" },
        { value: "Net 45", label: "Net 45" },
        { value: "Net 60", label: "Net 60" },
      ],
    },
    { key: "creditDays", label: "Credit Days", type: "number", defaultValue: 30, placeholder: "30" },
    { key: "bankName", label: "Bank Name", placeholder: "Enter Bank Name" },
    { key: "accountNo", label: "Account No.", mono: true, placeholder: "Enter Account Number" },
    { key: "ifscCode", label: "IFSC / SWIFT Code", uppercase: true, mono: true, placeholder: "Enter IFSC / SWIFT" },
    { key: "apiTrackUrl", label: "API Tracking URL", colSpan: 2, placeholder: "https://track.vendor.com/..." },
    { key: "status", label: "Status", type: "status" },
    { key: "address", label: "Address", type: "textarea", colSpan: 3, placeholder: "Enter Complete Vendor Address" },
  ],
  filterGroups: [
    {
      group: "Vendor Type",
      options: [
        { value: "Courier", label: "Courier" },
        { value: "Airline", label: "Airline" },
        { value: "Co-Loader", label: "Co-Loader" },
        { value: "Surface", label: "Surface" },
      ],
    },
    {
      group: "Status",
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
  ],
  initialData: [
    {
      id: "VND-001",
      srNo: 1,
      code: "VND-FEDEX",
      name: "FEDEX IP EX NEW YORK - INDIA",
      vendorType: "Courier",
      company: "AMERICAN XPRESS COURIER - AXC INC",
      contactPerson: "Rajesh Menon",
      phone: "+91 9820112233",
      email: "billing@fedex.com",
      gstNo: "27AAACF1234F1Z5",
      panNo: "AAACF1234F",
      address: "Cargo Complex, Sahar Airport Road, Andheri East",
      city: "MUMBAI",
      state: "MAHARASHTRA",
      country: "INDIA",
      pincode: "400099",
      paymentTerms: "Net 30",
      creditDays: 30,
      bankName: "HDFC Bank",
      accountNo: "50200012345678",
      ifscCode: "HDFC0000240",
      apiTrackUrl: "https://www.fedex.com/fedextrack/?trknbr=",
      status: "Active",
    },
    {
      id: "VND-002",
      srNo: 2,
      code: "VND-DHL",
      name: "DHL EXPRESS WORLDWIDE",
      vendorType: "Courier",
      company: "AMERICAN XPRESS COURIER - AXC INC",
      contactPerson: "Vikram Singh",
      phone: "+91 9811223344",
      email: "accounts@dhl.com",
      gstNo: "07AAACD5678G1Z2",
      panNo: "AAACD5678G",
      address: "IGI Airport Cargo Terminal, New Delhi",
      city: "NEW DELHI",
      state: "DELHI",
      country: "INDIA",
      pincode: "110037",
      paymentTerms: "Net 15",
      creditDays: 15,
      bankName: "ICICI Bank",
      accountNo: "000705012345",
      ifscCode: "ICIC0000007",
      apiTrackUrl: "https://www.dhl.com/in-en/home/tracking.html?tracking-id=",
      status: "Active",
    },
  ],
};

