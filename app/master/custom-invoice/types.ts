import { MasterModuleConfig } from "../_shared/master-page-views";

export interface CustomInvoiceEntry {
  id: string;
  srNo?: number;
  name: string;
  content: string;
  status: string;
  createdAt?: string;
}

export const customInvoiceModuleConfig: MasterModuleConfig<CustomInvoiceEntry> = {
  title: "Custom Invoices",
  singularTitle: "Custom Invoice",
  panelTitle: "Custom Invoice Template Information",
  endpoint: "/custom-invoices",
  storageKey: "master_custom_invoices",
  basePath: "/master/custom-invoice",
  primaryKeyField: "name",
  statusCase: "UPPER",
  columns: [
    { key: "srNo", label: "SR.NO." },
    { key: "name", label: "Template Name", sortable: true },
    { key: "content", label: "Template Content", sortable: false },
    { key: "createdAt", label: "Created Date", sortable: true },
    { key: "status", label: "Status", sortable: true, badge: "status" },
    { key: "action", label: "Action" },
  ],
  fields: [
    { key: "name", label: "Template Name", required: true, colSpan: 2, placeholder: "Enter Custom Invoice Template Name" },
    { key: "status", label: "Status", type: "status" },
    { key: "content", label: "Template Content / HTML", required: true, type: "textarea", colSpan: 3, placeholder: "Enter Custom Invoice Content / Declaration..." },
  ],
  filterGroups: [
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
      id: "CI-001",
      srNo: 1,
      name: "COMMERCIAL EXPORT INVOICE",
      content: "We hereby certify that the goods mentioned in this invoice are of Indian Origin and are exported for commercial use.",
      status: "ACTIVE",
      createdAt: "11/11/2023 10:30 AM",
    },
    {
      id: "CI-002",
      srNo: 2,
      name: "GIFT / PERSONAL EFFECTS INVOICE",
      content: "Unsolicited gift parcel for personal use only. No commercial value.",
      status: "ACTIVE",
      createdAt: "15/11/2023 02:15 PM",
    },
  ],
};

