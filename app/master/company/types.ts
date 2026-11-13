import { MasterModuleConfig } from "../_shared/master-page-views";

export interface CompanyEntry {
  id: string;
  srNo?: number;
  code: string;
  name: string;
  shortName: string;
  gstNo: string;
  panNo: string;
  cinNo: string;
  tanNo: string;
  iecCode: string;
  lutNo: string;
  msmeNo: string;
  email: string;
  phone: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  currencyCode: string;
  invoicePrefix: string;
  awbPrefix: string;
  bankName: string;
  bankBranch: string;
  accountName: string;
  accountNo: string;
  ifscCode: string;
  swiftCode: string;
  termsAndConditions: string;
  status: string;
}

export const companyModuleConfig: MasterModuleConfig<CompanyEntry> = {
  title: "Companies",
  singularTitle: "Company",
  panelTitle: "Company Information",
  endpoint: "/companies",
  storageKey: "master_companies",
  basePath: "/master/company",
  primaryKeyField: "name",
  secondaryKeyField: "code",
  statusCase: "TITLE",
  columns: [
    { key: "srNo", label: "SR.NO." },
    { key: "code", label: "Code", sortable: true, badge: "code" },
    { key: "name", label: "Company Name", sortable: true },
    { key: "pincode", label: "pin Code", sortable: true },
    { key: "gstNumber", label: "GST No.", badge: "mono" },
    { key: "email", label: "Email" },
    { key: "contactNo", label: "Contact", badge: "mono" },
    { key: "city", label: "City", sortable: true },
    { key: "country", label: "Country", sortable: true },
    { key: "currency", label: "Currency", badge: "code" },
    { key: "status", label: "Status", sortable: true, badge: "status" },
    { key: "action", label: "Action" },
  ],
  fields: [
    { key: "code", label: "Company Code", required: true, uppercase: true, mono: true, placeholder: "e.g. AXC-INC" },
    { key: "name", label: "Company Name", required: true, placeholder: "Enter Company Name" },
    { key: "shortName", label: "Short Name", uppercase: true, placeholder: "e.g. AXC" },
    { key: "gstNo", label: "GST No.", uppercase: true, mono: true, placeholder: "Enter GST No." },
    { key: "panNo", label: "PAN No.", uppercase: true, mono: true, placeholder: "Enter PAN No." },
    { key: "cinNo", label: "CIN No.", uppercase: true, mono: true, placeholder: "Enter CIN No." },
    { key: "tanNo", label: "TAN No.", uppercase: true, mono: true, placeholder: "Enter TAN No." },
    { key: "iecCode", label: "IEC Code", uppercase: true, mono: true, placeholder: "Enter IEC Code" },
    { key: "lutNo", label: "LUT No.", uppercase: true, mono: true, placeholder: "Enter LUT No." },
    { key: "msmeNo", label: "MSME No.", uppercase: true, mono: true, placeholder: "Enter MSME No." },
    { key: "email", label: "Email", type: "email", placeholder: "Enter Email Address" },
    { key: "phone", label: "Phone", mono: true, placeholder: "Enter Phone Number" },
    { key: "website", label: "Website", placeholder: "https://www.axc.com" },
    { key: "city", label: "City", placeholder: "Enter City" },
    { key: "state", label: "State", placeholder: "Enter State" },
    { key: "country", label: "Country", defaultValue: "INDIA", placeholder: "Enter Country" },
    { key: "pincode", label: "Pincode", mono: true, placeholder: "Enter Pincode" },
    {
      key: "currencyCode",
      label: "Currency Code",
      type: "select",
      defaultValue: "INR",
      options: [
        { value: "INR", label: "INR" },
        { value: "USD", label: "USD" },
        { value: "AED", label: "AED" },
        { value: "EUR", label: "EUR" },
        { value: "GBP", label: "GBP" },
        { value: "PKR", label: "PKR" },
      ],
    },
    { key: "invoicePrefix", label: "Invoice Prefix", uppercase: true, mono: true, placeholder: "e.g. AXC/INV/" },
    { key: "awbPrefix", label: "AWB Prefix", uppercase: true, mono: true, placeholder: "e.g. 301" },
    { key: "bankName", label: "Bank Name", placeholder: "Enter Bank Name" },
    { key: "bankBranch", label: "Bank Branch", placeholder: "Enter Bank Branch" },
    { key: "accountName", label: "Account Name", placeholder: "Enter Account Holder Name" },
    { key: "accountNo", label: "Account No.", mono: true, placeholder: "Enter Account No." },
    { key: "ifscCode", label: "IFSC Code", uppercase: true, mono: true, placeholder: "Enter IFSC Code" },
    { key: "swiftCode", label: "SWIFT Code", uppercase: true, mono: true, placeholder: "Enter SWIFT Code" },
    { key: "status", label: "Status", type: "status" },
    { key: "addressLine1", label: "Address Line 1", colSpan: 3, placeholder: "Enter Address Line 1" },
    { key: "addressLine2", label: "Address Line 2", colSpan: 3, placeholder: "Enter Address Line 2" },
    { key: "termsAndConditions", label: "Terms & Conditions", type: "textarea", colSpan: 3, placeholder: "Enter Invoice Terms & Conditions" },
  ],
  filterGroups: [
    {
      group: "Currency",
      options: [
        { value: "INR", label: "INR" },
        { value: "USD", label: "USD" },
        { value: "AED", label: "AED" },
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
      id: "CMP-001",
      srNo: 1,
      code: "AXC-INC",
      name: "AMERICAN XPRESS COURIER - AXC INC",
      shortName: "AXC INC",
      gstNo: "24AAACA1122B1Z5",
      panNo: "AAACA1122B",
      cinNo: "U63090GJ2020PTC112233",
      tanNo: "AHMA11223C",
      iecCode: "0819011223",
      lutNo: "AD240423011223A",
      msmeNo: "UDYAM-GJ-01-0011223",
      email: "info@axccourier.com",
      phone: "+91 79 2658 1122",
      website: "https://www.axccourier.com",
      addressLine1: "Corporate House, Navrangpura",
      addressLine2: "Near Mithakhali Six Roads",
      city: "AHMEDABAD",
      state: "GUJARAT",
      country: "INDIA",
      pincode: "380009",
      currencyCode: "INR",
      invoicePrefix: "AXC/",
      awbPrefix: "301",
      bankName: "HDFC Bank",
      bankBranch: "Navrangpura, Ahmedabad",
      accountName: "AMERICAN XPRESS COURIER INC",
      accountNo: "50200055667788",
      ifscCode: "HDFC0000006",
      swiftCode: "HDFCINBBAHM",
      termsAndConditions: "All disputes subject to Ahmedabad jurisdiction.",
      status: "Active",
    },
  ],
};

