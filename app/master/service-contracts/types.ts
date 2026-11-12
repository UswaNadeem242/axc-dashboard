import { MasterModuleConfig } from "../_shared/master-page-views";

export interface ServiceContractEntry {
  id: string;
  srNo?: number;
  contractCode: string;
  vendorCode: string;
  vendorName: string;
  serviceCode: string;
  productCode: string;
  originZone: string;
  destinationZone: string;
  originCountry: string;
  destinationCountry: string;
  calculationMethod: string;
  currencyCode: string;
  minCharge: number;
  fuelSurchargePct: number;
  effectiveFrom: string;
  effectiveTo: string;
  rateSlabs: any;
  remarks: string;
  status: string;
}

export const serviceContractModuleConfig: MasterModuleConfig<ServiceContractEntry> = {
  title: "Service Contracts",
  singularTitle: "Service Contract",
  panelTitle: "Service Contract Information",
  endpoint: "/service-contracts",
  storageKey: "master_service_contracts",
  basePath: "/master/service-contracts",
  primaryKeyField: "contractCode",
  secondaryKeyField: "vendorName",
  statusCase: "TITLE",
  columns: [
    { key: "srNo", label: "SR.NO." },
    { key: "contractCode", label: "Contract Code", sortable: true, badge: "code" },
    { key: "vendorName", label: "Vendor Name", sortable: true },
    { key: "serviceCode", label: "Service Code", sortable: true, badge: "blue" },
    { key: "productCode", label: "Product", badge: "code" },
    { key: "originCountry", label: "Origin", sortable: true },
    { key: "destinationCountry", label: "Destination", sortable: true },
    { key: "currencyCode", label: "Currency", badge: "mono" },
    { key: "minCharge", label: "Min Charge", badge: "mono" },
    { key: "effectiveFrom", label: "Effective From" },
    { key: "effectiveTo", label: "Effective To" },
    { key: "status", label: "Status", sortable: true, badge: "status" },
    { key: "action", label: "Action" },
  ],
  fields: [
    { key: "contractCode", label: "Contract Code", required: true, uppercase: true, mono: true, placeholder: "e.g. SC-2026-001" },
    { key: "vendorCode", label: "Vendor Code", required: true, uppercase: true, mono: true, placeholder: "e.g. VND-FEDEX" },
    { key: "vendorName", label: "Vendor Name", placeholder: "Enter Vendor Name" },
    { key: "serviceCode", label: "Service Code", required: true, uppercase: true, mono: true, placeholder: "e.g. FDX-IP-NY" },
    {
      key: "productCode",
      label: "Product Code",
      type: "select",
      defaultValue: "NONDOX",
      options: [
        { value: "DOX", label: "DOX" },
        { value: "NONDOX", label: "NONDOX" },
        { value: "COMMERCIAL", label: "COMMERCIAL" },
      ],
    },
    { key: "originZone", label: "Origin Zone", uppercase: true, placeholder: "e.g. ZONE-A" },
    { key: "destinationZone", label: "Destination Zone", uppercase: true, placeholder: "e.g. ZONE-US" },
    { key: "originCountry", label: "Origin Country", defaultValue: "INDIA", placeholder: "Enter Origin Country" },
    { key: "destinationCountry", label: "Destination Country", defaultValue: "UNITED STATES", placeholder: "Enter Destination Country" },
    {
      key: "calculationMethod",
      label: "Calculation Method",
      type: "select",
      defaultValue: "Per KG",
      options: [
        { value: "Per KG", label: "Per KG" },
        { value: "Slab Wise", label: "Slab Wise" },
        { value: "Flat Rate", label: "Flat Rate" },
      ],
    },
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
      ],
    },
    { key: "minCharge", label: "Min Charge", type: "number", defaultValue: 500, placeholder: "500" },
    { key: "fuelSurchargePct", label: "Fuel Surcharge (%)", type: "number", defaultValue: 18, placeholder: "18" },
    { key: "effectiveFrom", label: "Effective From", type: "date" },
    { key: "effectiveTo", label: "Effective To", type: "date" },
    { key: "status", label: "Status", type: "status" },
    { key: "rateSlabs", label: "Rate Slabs (JSON)", type: "json", colSpan: 3, placeholder: '[{"from":0.5,"to":5,"rate":1250}]' },
    { key: "remarks", label: "Remarks", type: "textarea", colSpan: 3, placeholder: "Enter Contract Remarks" },
  ],
  filterGroups: [
    {
      group: "Currency",
      options: [
        { value: "INR", label: "INR" },
        { value: "USD", label: "USD" },
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
      id: "SC-001",
      srNo: 1,
      contractCode: "SC-FDX-2026-01",
      vendorCode: "VND-FEDEX",
      vendorName: "FEDEX IP EX NEW YORK - INDIA",
      serviceCode: "FDX-IP-NY",
      productCode: "NONDOX",
      originZone: "ZONE-IN",
      destinationZone: "ZONE-US",
      originCountry: "INDIA",
      destinationCountry: "UNITED STATES",
      calculationMethod: "Slab Wise",
      currencyCode: "INR",
      minCharge: 850,
      fuelSurchargePct: 18.5,
      effectiveFrom: "2026-01-01",
      effectiveTo: "2026-12-31",
      rateSlabs: [{ from: 0.5, to: 10, rate: 850 }],
      remarks: "Annual vendor rate contract for US IP shipments",
      status: "Active",
    },
  ],
};

