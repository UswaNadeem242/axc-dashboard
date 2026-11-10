import { MasterModuleConfig } from "../_shared/master-page-views";

export interface CompanyAddressEntry {
  id: string;
  srNo?: number;
  companyId: string | number;
  branchName: string;
  branchCode: string;
  gstNo: string;
  contactPerson: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  stateCode: string;
  country: string;
  pincode: string;
  isHeadOffice: boolean;
  status: string;
}

export const companyAddressModuleConfig: MasterModuleConfig<CompanyAddressEntry> = {
  title: "Company Addresses",
  singularTitle: "Company Address",
  panelTitle: "Company Address Information",
  endpoint: "/company-addresses",
  storageKey: "master_company_addresses",
  basePath: "/master/company-address",
  primaryKeyField: "branchName",
  secondaryKeyField: "branchCode",
  statusCase: "TITLE",
  columns: [
    { key: "srNo", label: "SR.NO." },
    { key: "branchCode", label: "Branch Code", sortable: true, badge: "code" },
    { key: "branchName", label: "Branch Name", sortable: true },
    { key: "gstNo", label: "GST No.", badge: "mono" },
    { key: "contactPerson", label: "Contact Person", sortable: true },
    { key: "phone", label: "Phone", badge: "mono" },
    { key: "city", label: "City", sortable: true },
    { key: "state", label: "State", sortable: true },
    { key: "isHeadOffice", label: "Head Office", badge: "boolean" },
    { key: "status", label: "Status", sortable: true, badge: "status" },
    { key: "action", label: "Action" },
  ],
  fields: [
    { key: "branchCode", label: "Branch Code", required: true, uppercase: true, mono: true, placeholder: "e.g. BR-AMD" },
    { key: "branchName", label: "Branch Name", required: true, placeholder: "Enter Branch Name" },
    { key: "companyId", label: "Company ID", type: "number", defaultValue: 1, placeholder: "1" },
    { key: "gstNo", label: "GST No.", uppercase: true, mono: true, placeholder: "Enter Branch GST No." },
    { key: "contactPerson", label: "Contact Person", placeholder: "Enter Contact Person" },
    { key: "phone", label: "Phone", mono: true, placeholder: "Enter Phone Number" },
    { key: "email", label: "Email", type: "email", placeholder: "Enter Branch Email" },
    { key: "city", label: "City", placeholder: "Enter City" },
    { key: "state", label: "State", placeholder: "Enter State" },
    { key: "stateCode", label: "State Code", uppercase: true, mono: true, placeholder: "e.g. 24" },
    { key: "country", label: "Country", defaultValue: "INDIA", placeholder: "Enter Country" },
    { key: "pincode", label: "Pincode", mono: true, placeholder: "Enter Pincode" },
    { key: "isHeadOffice", label: "Is Head Office", type: "checkbox" },
    { key: "status", label: "Status", type: "status" },
    { key: "addressLine1", label: "Address Line 1", required: true, colSpan: 3, placeholder: "Enter Address Line 1" },
    { key: "addressLine2", label: "Address Line 2", colSpan: 3, placeholder: "Enter Address Line 2" },
  ],
  filterGroups: [
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
      id: "CAD-001",
      srNo: 1,
      companyId: 1,
      branchName: "Ahmedabad Head Office",
      branchCode: "BR-AMD",
      gstNo: "24AAACA1122B1Z5",
      contactPerson: "Mehul Patel",
      phone: "+91 79 2658 1122",
      email: "amd@axccourier.com",
      addressLine1: "Corporate House, Navrangpura",
      addressLine2: "Ahmedabad",
      city: "AHMEDABAD",
      state: "GUJARAT",
      stateCode: "24",
      country: "INDIA",
      pincode: "380009",
      isHeadOffice: true,
      status: "Active",
    },
    {
      id: "CAD-002",
      srNo: 2,
      companyId: 1,
      branchName: "Mumbai Airport Branch",
      branchCode: "BR-BOM",
      gstNo: "27AAACA1122B1Z9",
      contactPerson: "Suresh Nair",
      phone: "+91 22 2834 5566",
      email: "bom@axccourier.com",
      addressLine1: "Sahar Cargo Road, Andheri East",
      addressLine2: "Mumbai",
      city: "MUMBAI",
      state: "MAHARASHTRA",
      stateCode: "27",
      country: "INDIA",
      pincode: "400099",
      isHeadOffice: false,
      status: "Active",
    },
  ],
};

