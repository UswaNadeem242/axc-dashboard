import { MasterModuleConfig } from "../_shared/master-page-views";

export interface ReportMasterEntry {
  id: string;
  srNo?: number;
  reportType: string;
  name: string;
  slug: string;
  type: string;
  company: string;
  storedProcedure: string;
  timeDifferenceInDay: number;
  status: string;
  userIds: any;
  fields: any;
  createdAt?: string;
}

export const reportMasterModuleConfig: MasterModuleConfig<ReportMasterEntry> = {
  title: "Report Masters",
  singularTitle: "Report Master",
  panelTitle: "Report Master Information",
  endpoint: "/report-masters",
  storageKey: "master_reports",
  basePath: "/master/report-master",
  primaryKeyField: "name",
  secondaryKeyField: "slug",
  statusCase: "UPPER",
  columns: [
    { key: "srNo", label: "SR.NO." },
    { key: "name", label: "Report Name", sortable: true },
    { key: "slug", label: "Slug", sortable: true, badge: "code" },
    { key: "reportType", label: "Report Type", sortable: true, badge: "blue" },
    { key: "type", label: "Type", sortable: true },
    { key: "company", label: "Company", sortable: true },
    { key: "storedProcedure", label: "Stored Procedure", badge: "mono" },
    { key: "timeDifferenceInDay", label: "Days Limit", badge: "mono" },
    { key: "status", label: "Status", sortable: true, badge: "status" },
    { key: "action", label: "Action" },
  ],
  fields: [
    {
      key: "reportType",
      label: "Report Type",
      required: true,
      type: "select",
      defaultValue: "AWB REPORT",
      options: [
        { value: "AWB REPORT", label: "AWB REPORT" },
        { value: "INVOICE REPORT", label: "INVOICE REPORT" },
        { value: "MANIFEST REPORT", label: "MANIFEST REPORT" },
        { value: "ACCOUNTS REPORT", label: "ACCOUNTS REPORT" },
      ],
    },
    { key: "name", label: "Name", required: true, placeholder: "Enter Report Name" },
    { key: "slug", label: "Slug", required: true, mono: true, placeholder: "e.g. awb-sales-register" },
    {
      key: "type",
      label: "Type",
      required: true,
      type: "select",
      defaultValue: "CUSTOM",
      options: [
        { value: "CUSTOM", label: "CUSTOM" },
        { value: "STORED PROCEDURE", label: "STORED PROCEDURE" },
        { value: "SYSTEM", label: "SYSTEM" },
      ],
    },
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
    { key: "storedProcedure", label: "Stored Procedure", mono: true, placeholder: "e.g. sp_get_awb_sales_report" },
    { key: "timeDifferenceInDay", label: "Time Difference In Day", type: "number", defaultValue: 31, placeholder: "31" },
    { key: "status", label: "Status", type: "status" },
    { key: "userIds", label: "Users (IDs / JSON)", type: "json", colSpan: 3, placeholder: '["admin", "billing"]' },
    { key: "fields", label: "Report Fields (JSON)", type: "json", colSpan: 3, placeholder: '[{"fieldName":"awb_number","displayName":"AWB No","sequence":1}]' },
  ],
  filterGroups: [
    {
      group: "Report Type",
      options: [
        { value: "AWB REPORT", label: "AWB REPORT" },
        { value: "INVOICE REPORT", label: "INVOICE REPORT" },
        { value: "MANIFEST REPORT", label: "MANIFEST REPORT" },
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
      id: "RPT-001",
      srNo: 1,
      reportType: "AWB REPORT",
      name: "DAILY BOOKING & REVENUE REGISTER",
      slug: "daily-booking-revenue-register",
      type: "CUSTOM",
      company: "AMERICAN XPRESS COURIER - AXC INC",
      storedProcedure: "sp_daily_booking_register",
      timeDifferenceInDay: 31,
      status: "ACTIVE",
      userIds: ["admin"],
      fields: [
        { fieldName: "awb_no", displayName: "AWB NO", sequence: 1 },
        { fieldName: "booking_date", displayName: "BOOKING DATE", sequence: 2 },
      ],
      createdAt: "18/10/2023 05:10 PM",
    },
  ],
};

