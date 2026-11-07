export interface CityEntry {
  id: string;
  name: string;
  code: string;
  district: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  group: string;
  options: FilterOption[];
}

export const CityHeadings = [
  { label: "SR.NO.", key: "srNo" },
  { label: "SELECT CITY", key: "selectCity" },
  { label: "CITY NAME", key: "name", sortable: true },
  { label: "CODE", key: "code", sortable: true },
  { label: "DISTRICT", key: "district", sortable: true },
  { label: "STATUS", key: "status", sortable: true },
  { label: "ACTION", key: "action" },
];

export const cityFilterGroups: FilterGroup[] = [
  {
    group: "Status",
    options: [
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" },
    ],
  },
  {
    group: "District",
    options: [
      { label: "Dubai District", value: "DUBAI DISTRICT" },
      { label: "Los Angeles County", value: "LOS ANGELES COUNTY" },
      { label: "Mumbai Suburban", value: "MUMBAI SUBURBAN" },
      { label: "New York County", value: "NEW YORK COUNTY" },
      { label: "Greater London", value: "GREATER LONDON" },
    ],
  },
];

export const DISTRICT_OPTIONS = [
  { label: "Select District...", value: "" },
  { label: "DUBAI DISTRICT", value: "DUBAI DISTRICT" },
  { label: "LOS ANGELES COUNTY", value: "LOS ANGELES COUNTY" },
  { label: "MUMBAI SUBURBAN", value: "MUMBAI SUBURBAN" },
  { label: "NEW YORK COUNTY", value: "NEW YORK COUNTY" },
  { label: "GREATER LONDON", value: "GREATER LONDON" },
  { label: "DELHI NCR", value: "DELHI NCR" },
  { label: "COOK COUNTY", value: "COOK COUNTY" },
  { label: "HARRIS COUNTY", value: "HARRIS COUNTY" },
  { label: "TORONTO METRO", value: "TORONTO METRO" },
];

export const initialCityData: CityEntry[] = [
  {
    id: "city_1",
    name: "DUBAI",
    code: "DXB",
    district: "DUBAI DISTRICT",
    status: "ACTIVE",
    createdAt: "2026-07-20",
  },
  {
    id: "city_2",
    name: "LOS ANGELES",
    code: "LAX",
    district: "LOS ANGELES COUNTY",
    status: "ACTIVE",
    createdAt: "2026-07-21",
  },
  {
    id: "city_3",
    name: "MUMBAI",
    code: "BOM",
    district: "MUMBAI SUBURBAN",
    status: "ACTIVE",
    createdAt: "2026-07-22",
  },
  {
    id: "city_4",
    name: "NEW YORK",
    code: "NYC",
    district: "NEW YORK COUNTY",
    status: "ACTIVE",
    createdAt: "2026-07-23",
  },
  {
    id: "city_5",
    name: "LONDON",
    code: "LON",
    district: "GREATER LONDON",
    status: "ACTIVE",
    createdAt: "2026-07-24",
  },
];

