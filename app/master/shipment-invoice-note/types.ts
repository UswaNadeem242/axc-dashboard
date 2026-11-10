import { MasterModuleConfig } from "../_shared/master-page-views";

export interface ShipmentInvoiceNoteEntry {
  id: string;
  srNo?: number;
  note: string;
  comment?: string;
  maxShipmentValue?: string | number;
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
  primaryKeyField: "note",
  statusCase: "UPPER",
  columns: [
    { key: "srNo", label: "SR.NO." },
    { key: "note", label: "Note", sortable: true },
    { key: "comment", label: "Comment", sortable: false },
    { key: "maxShipmentValue", label: "Max Shipment Value", sortable: false },
    { key: "createdAt", label: "Created Date", sortable: true },
    { key: "status", label: "Status", sortable: true, badge: "status" },
    { key: "action", label: "Action" },
  ],
  fields: [
    { key: "note", label: "Note", required: true, colSpan: 2, placeholder: "Enter Shipment Invoice Note (e.g. GIFT, SAMPLE)" },
    { key: "status", label: "Status", type: "status" },
    { key: "comment", label: "Comment", type: "textarea", colSpan: 2, placeholder: "Enter Declaration / Comment..." },
    { key: "maxShipmentValue", label: "Max Shipment Value", type: "number", placeholder: "Max Shipment Value" },
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
      id: "1",
      srNo: 1,
      note: "GIFT",
      comment: "UNSOLICITED GIFT SENT TO MY FRIENDS & FAMILY MEMBERS FOR THERE PERSONAL USE ONLY",
      status: "ACTIVE",
      createdAt: "21/10/2023 10:18 PM",
    },
    {
      id: "2",
      srNo: 2,
      note: "SAMPLE",
      comment: "FREE TRADE SAMPLES OF NO COMMERCIAL VALUE",
      status: "ACTIVE",
      createdAt: "21/10/2023 10:18 PM",
    },
    {
      id: "3",
      srNo: 3,
      note: "COMMERCIAL",
      comment: "I AM SELLING THESE ITEMS TO RECEIVER",
      status: "ACTIVE",
      createdAt: "09/01/2024 07:29 PM",
    },
  ],
};

