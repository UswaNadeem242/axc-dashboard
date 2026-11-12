import { MasterModuleConfig } from "../_shared/master-page-views";

export interface ProductEntry {
  id: string;
  srNo?: number;
  code: string;
  name: string;
  productType: string;
  description: string;
  defaultVolDivisor: number;
  isTaxable: boolean;
  taxPercentage: number;
  sacCode: string;
  status: string;
}

export const productModuleConfig: MasterModuleConfig<ProductEntry> = {
  title: "Products",
  singularTitle: "Product",
  panelTitle: "Product Information",
  endpoint: "/products",
  storageKey: "master_products",
  basePath: "/master/product",
  primaryKeyField: "name",
  secondaryKeyField: "code",
  statusCase: "TITLE",
  columns: [
    { key: "srNo", label: "SR.NO." },
    { key: "code", label: "Code", sortable: true, badge: "code" },
    { key: "name", label: "Product Name", sortable: true },
    { key: "productType", label: "Product Type", sortable: true, badge: "blue" },
    { key: "defaultVolDivisor", label: "Vol. Divisor", badge: "mono" },
    { key: "isTaxable", label: "Taxable", badge: "boolean" },
    { key: "taxPercentage", label: "Tax %", badge: "mono" },
    { key: "sacCode", label: "SAC Code", badge: "mono" },
    { key: "status", label: "Status", sortable: true, badge: "status" },
    { key: "action", label: "Action" },
  ],
  fields: [
    { key: "code", label: "Product Code", required: true, uppercase: true, mono: true, placeholder: "e.g. NONDOX" },
    { key: "name", label: "Product Name", required: true, placeholder: "Enter Product Name" },
    {
      key: "productType",
      label: "Product Type",
      type: "select",
      defaultValue: "Non-Document",
      options: [
        { value: "Document", label: "Document" },
        { value: "Non-Document", label: "Non-Document" },
        { value: "Commercial", label: "Commercial" },
        { value: "Medicine", label: "Medicine" },
        { value: "Excess Baggage", label: "Excess Baggage" },
      ],
    },
    { key: "defaultVolDivisor", label: "Default Volumetric Divisor", type: "number", defaultValue: 5000, placeholder: "5000" },
    { key: "taxPercentage", label: "Tax Percentage (%)", type: "number", defaultValue: 18, placeholder: "18" },
    { key: "sacCode", label: "SAC Code", uppercase: true, mono: true, defaultValue: "996812", placeholder: "e.g. 996812" },
    { key: "isTaxable", label: "Is Taxable", type: "checkbox", defaultValue: true },
    { key: "status", label: "Status", type: "status" },
    { key: "description", label: "Description", type: "textarea", colSpan: 3, placeholder: "Enter Product Description" },
  ],
  filterGroups: [
    {
      group: "Product Type",
      options: [
        { value: "Document", label: "Document" },
        { value: "Non-Document", label: "Non-Document" },
        { value: "Commercial", label: "Commercial" },
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
      id: "PRD-001",
      srNo: 1,
      code: "DOX",
      name: "DOCUMENT EXPRESS",
      productType: "Document",
      description: "International and Domestic Document Shipments",
      defaultVolDivisor: 5000,
      isTaxable: true,
      taxPercentage: 18,
      sacCode: "996812",
      status: "Active",
    },
    {
      id: "PRD-002",
      srNo: 2,
      code: "NONDOX",
      name: "NON-DOCUMENT PARCEL",
      productType: "Non-Document",
      description: "International Non-Document Parcels & Samples",
      defaultVolDivisor: 5000,
      isTaxable: true,
      taxPercentage: 18,
      sacCode: "996812",
      status: "Active",
    },
  ],
};

