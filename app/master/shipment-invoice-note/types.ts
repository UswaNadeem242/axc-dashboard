import { MasterModuleConfig } from "../_shared/master-page-views";

export interface ShipmentInvoiceNoteEntry {
  id: string;
  srNo?: number;
  title: string;
  notes: string;
  status: string;
  createdAt?: string;
}

export const shipmentInvoiceNoteModuleConfig: MasterModuleConfig<ShipmentInvoiceNoteEntry> = {
  title: "Shipment Invoice Notes",
  singularTitle: "Shipment Invoice Note",
  panelTitle: "Shipment Invoice Note Information",
  endpoint: "/shipment-invoice-notes",
  storageKey: "master_shipment_invoice_notes",
  basePath: "/master/shipment-invoice-note",
  primaryKeyField: "title",
  statusCase: "UPPER",
  columns: [
    { key: "srNo", label: "SR.NO." },
    { key: "title", label: "Title", sortable: true },
    { key: "notes", label: "Notes", sortable: false },
    { key: "createdAt", label: "Created Date", sortable: true },
    { key: "status", label: "Status", sortable: true, badge: "status" },
    { key: "action", label: "Action" },
  ],
  fields: [
    { key: "title", label: "Title", required: true, colSpan: 2, placeholder: "Enter Note Title" },
    { key: "status", label: "Status", type: "status" },
    { key: "notes", label: "Notes", required: true, type: "textarea", colSpan: 3, placeholder: "Enter Shipment Invoice Note Text..." },
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
      id: "SIN-001",
      srNo: 1,
      title: "CUSTOMS CLEARANCE DISCLAIMER",
      notes: "Destination customs duty, taxes, and clearance charges if applicable are payable by the consignee.",
      status: "ACTIVE",
      createdAt: "12/10/2023 09:30 AM",
    },
    {
      id: "SIN-002",
      srNo: 2,
      title: "FRAGILE / LIQUID ITEMS NOTE",
      notes: "Carrier is not liable for breakage or leakage of fragile or liquid items booked at shipper's risk.",
      status: "ACTIVE",
      createdAt: "14/10/2023 04:20 PM",
    },
  ],
};

