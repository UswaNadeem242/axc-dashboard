import { MasterModuleConfig } from "../_shared/master-page-views";

export interface ServiceEntry {
  id: string;
  srNo?: number;
  code: string;
  name: string;
  mode: string;
  serviceType: string;
  productCode: string;
  vendorCode: string;
  volumetricDivisor: number;
  minChargeableWeight: number;
  maxWeightAllowed: number;
  transitDays: string;
  isInternational: boolean;
  fuelSurchargePct: number;
  status: string;
}

export const serviceModuleConfig: MasterModuleConfig<ServiceEntry> = {
  title: "Services",
  singularTitle: "Service",
  panelTitle: "Service Information",
  endpoint: "/services",
  storageKey: "master_services",
  basePath: "/master/service",
  primaryKeyField: "name",
  secondaryKeyField: "code",
  statusCase: "TITLE",
  columns: [
    { key: "srNo", label: "SR.NO." },
    { key: "code", label: "Code", sortable: true, badge: "code" },
    { key: "name", label: "Service Name", sortable: true },
    { key: "mode", label: "Mode", sortable: true, badge: "blue" },
    { key: "serviceType", label: "Service Type", sortable: true },
    { key: "productCode", label: "Product Code", badge: "code" },
    { key: "vendorCode", label: "Vendor Code", badge: "mono" },
    { key: "volumetricDivisor", label: "Vol. Divisor", badge: "mono" },
    { key: "transitDays", label: "Transit Days" },
    { key: "isInternational", label: "International", badge: "boolean" },
    { key: "status", label: "Status", sortable: true, badge: "status" },
    { key: "action", label: "Action" },
  ],
  fields: [
    { key: "code", label: "Service Code", required: true, uppercase: true, mono: true, placeholder: "e.g. FDX-IP" },
    { key: "name", label: "Service Name", required: true, placeholder: "Enter Service Name" },
    {
      key: "mode",
      label: "Mode",
      type: "select",
      defaultValue: "Air",
      options: [
        { value: "Air", label: "Air" },
        { value: "Surface", label: "Surface" },
        { value: "Sea", label: "Sea" },
        { value: "Express", label: "Express" },
      ],
    },
    {
      key: "serviceType",
      label: "Service Type",
      type: "select",
      defaultValue: "International",
      options: [
        { value: "International", label: "International" },
        { value: "Domestic", label: "Domestic" },
        { value: "Priority", label: "Priority" },
        { value: "Economy", label: "Economy" },
      ],
    },
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
    { key: "vendorCode", label: "Vendor Code", uppercase: true, mono: true, placeholder: "e.g. VND-FEDEX" },
    { key: "volumetricDivisor", label: "Volumetric Divisor", type: "number", defaultValue: 5000, placeholder: "5000" },
    { key: "minChargeableWeight", label: "Min Chargeable Weight (KG)", type: "number", defaultValue: 0.5, placeholder: "0.5" },
    { key: "maxWeightAllowed", label: "Max Weight Allowed (KG)", type: "number", defaultValue: 1000, placeholder: "1000" },
    { key: "transitDays", label: "Transit Days", defaultValue: "3-5 Days", placeholder: "e.g. 3-5 Days" },
    { key: "fuelSurchargePct", label: "Fuel Surcharge (%)", type: "number", defaultValue: 18, placeholder: "18" },
    { key: "isInternational", label: "Is International", type: "checkbox", defaultValue: true },
    { key: "status", label: "Status", type: "status" },
  ],
  filterGroups: [
    {
      group: "Mode",
      options: [
        { value: "Air", label: "Air" },
        { value: "Surface", label: "Surface" },
        { value: "Express", label: "Express" },
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
      id: "SRV-001",
      srNo: 1,
      code: "FDX-IP-NY",
      name: "FEDEX IP EX NEW YORK - INDIA",
      mode: "Air",
      serviceType: "International",
      productCode: "NONDOX",
      vendorCode: "VND-FEDEX",
      volumetricDivisor: 5000,
      minChargeableWeight: 0.5,
      maxWeightAllowed: 999,
      transitDays: "3-5 Days",
      isInternational: true,
      fuelSurchargePct: 18.5,
      status: "Active",
    },
    {
      id: "SRV-002",
      srNo: 2,
      code: "DHL-EXP-WW",
      name: "DHL EXPRESS WORLDWIDE",
      mode: "Air",
      serviceType: "International",
      productCode: "DOX",
      vendorCode: "VND-DHL",
      volumetricDivisor: 5000,
      minChargeableWeight: 0.5,
      maxWeightAllowed: 1000,
      transitDays: "2-4 Days",
      isInternational: true,
      fuelSurchargePct: 20,
      status: "Active",
    },
  ],
};

