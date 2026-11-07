export interface ZoneEntry {
  id: string;
  srNo?: number;
  code: string;
  name?: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: string;
}

export const initialZoneData: ZoneEntry[] = [
  {
    id: "ZN-001",
    srNo: 1,
    code: "ZONE-1",
    name: "NORTH AMERICA (USA & CANADA)",
    status: "ACTIVE",
    createdAt: "01/11/2026, 10:00 AM",
  },
  {
    id: "ZN-002",
    srNo: 2,
    code: "ZONE-2",
    name: "UNITED KINGDOM & EUROPE",
    status: "ACTIVE",
    createdAt: "02/11/2026, 11:30 AM",
  },
  {
    id: "ZN-003",
    srNo: 3,
    code: "ZONE-3",
    name: "MIDDLE EAST & GULF REGION",
    status: "ACTIVE",
    createdAt: "03/11/2026, 02:15 PM",
  },
  {
    id: "ZN-004",
    srNo: 4,
    code: "ZONE-4",
    name: "ASIA PACIFIC & AUSTRALIA",
    status: "ACTIVE",
    createdAt: "04/11/2026, 04:45 PM",
  },
  {
    id: "ZN-005",
    srNo: 5,
    code: "ZONE-5",
    name: "REST OF THE WORLD",
    status: "INACTIVE",
    createdAt: "05/11/2026, 09:20 AM",
  },
];

export const ZoneHeadings = [
  { label: "SR.NO.", key: "srNo" },
  { label: "SELECT ZONE", key: "selectZone" },
  { label: "ZONE CODE", key: "code", sortable: true },
  { label: "ZONE NAME", key: "name", sortable: true },
  { label: "STATUS", key: "status", sortable: true },
  { label: "CREATED AT", key: "createdAt", sortable: true },
  { label: "ACTION", key: "action" },
];

export const zoneFilterGroups = [
  {
    group: "Status",
    options: [
      { label: "ACTIVE", value: "ACTIVE" },
      { label: "INACTIVE", value: "INACTIVE" },
    ],
  },
];
