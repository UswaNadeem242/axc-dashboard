import { MasterModuleConfig } from "../_shared/master-page-views";

export interface InvoiceServiceTypeEntry {
  id: string;
  srNo?: number;
  name: string;
  code: string;
  company: string;
  serviceType: string;
  sacNo: string;
  status: string;
  createdAt?: string;
}

export const invoiceServiceTypeModuleConfig: MasterModuleConfig<InvoiceServiceTypeEntry> = {
  title: "Invoice Service Types",
  singularTitle: "Invoice Service Type",
  panelTitle: "Invoice Service Type Information",
  endpoint: "/invoice-service-types",
  storageKey: "master_invoice_service_types",
  basePath: "/master/invoice-service-type",
  primaryKeyField: "name",
  secondaryKeyField: "code",
  statusCase: "UPPER",
  columns: [
    { key: "srNo", label: "SR.NO." },
    { key: "code", label: "Code", sortable: true, badge: "code" },
    { key: "name", label: "Name", sortable: true },
    { key: "company", label: "Company", sortable: true },
    { key: "serviceType", label: "Service Type", sortable: true, badge: "blue" },
    { key: "sacNo", label: "SAC No.", sortable: true, badge: "mono" },
    { key: "status", label: "Status", sortable: true, badge: "status" },
    { key: "action", label: "Action" },
  ],
  fields: [
    { key: "name", label: "Name", required: true, placeholder: "Enter Invoice Service Type Name" },
    { key: "code", label: "Code", required: true, uppercase: true, mono: true, placeholder: "e.g. COURIER-INT" },
    {
      key: "company",
      label: "Company",
      required: true,
      type: "select",
      defaultValue: "AMERICAN XPRESS COURIER - AXC INC",
      options: [
        { value: "AMERICAN XPRESS COURIER - AXC INC", label: "AMERICAN XPRESS COURIER - AXC INC" },
        { value: "AX COURIER LOGISTICS - AX COURIER LOGISTICS", label: "AX COURIER LOGISTICS - AX COURIER LOGISTICS" },
      ],
    },
    {
      key: "serviceType",
      label: "Service Type",
      required: true,
      type: "select",
      defaultValue: "COURIER SERVICE",
      options: [
        { value: "COURIER SERVICE", label: "COURIER SERVICE" },
        { value: "CARGO SERVICE", label: "CARGO SERVICE" },
        { value: "FREIGHT FORWARDING", label: "FREIGHT FORWARDING" },
        { value: "EXPRESS DELIVERY", label: "EXPRESS DELIVERY" },
      ],
    },
    { key: "sacNo", label: "SAC No.", required: true, uppercase: true, mono: true, defaultValue: "996812", placeholder: "e.g. 996812" },
    { key: "status", label: "Status", type: "status" },
  ],
  filterGroups: [
    {
      group: "Service Type",
      options: [
        { value: "COURIER SERVICE", label: "COURIER SERVICE" },
        { value: "CARGO SERVICE", label: "CARGO SERVICE" },
      ],
    },
    {
      group: "Status",
      options: [
        { value: "ACTIVE", label: "ACTIVE" },
        { value: "INACTIVE", label: "INACTIVE" },
      ],
    },
  ],
  initialData: [
    {
      id: "IST-001",
      srNo: 1,
      name: "INTERNATIONAL COURIER SERVICE",
      code: "INT-COURIER",
      company: "AMERICAN XPRESS COURIER - AXC INC",
      serviceType: "COURIER SERVICE",
      sacNo: "996812",
      status: "ACTIVE",
      createdAt: "10/10/2023 11:00 AM",
    },
    {
      id: "IST-002",
      srNo: 2,
      name: "AIR FREIGHT & CARGO",
      code: "AIR-CARGO",
      company: "AMERICAN XPRESS COURIER - AXC INC",
      serviceType: "CARGO SERVICE",
      sacNo: "996531",
      status: "ACTIVE",
      createdAt: "10/10/2023 11:05 AM",
    },
  ],
};

