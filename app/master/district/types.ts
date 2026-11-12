import { MasterModuleConfig } from "../_shared/master-page-views";

export interface DistrictEntry {
  id: string;
  srNo?: number;
  name: string;
  code: string;
  state: string;
  stateCode: string;
  country: string;
  countryCode: string;
  status: string;
}

export const districtModuleConfig: MasterModuleConfig<DistrictEntry> = {
  title: "Districts",
  singularTitle: "District",
  panelTitle: "District Information",
  endpoint: "/districts",
  storageKey: "master_districts",
  basePath: "/master/district",
  primaryKeyField: "name",
  secondaryKeyField: "code",
  statusCase: "TITLE",
  columns: [
    { key: "srNo", label: "SR.NO." },
    { key: "code", label: "District Code", sortable: true, badge: "code" },
    { key: "name", label: "District Name", sortable: true },
    { key: "state", label: "State", sortable: true, badge: "blue" },
    { key: "stateCode", label: "State Code", badge: "mono" },
    { key: "country", label: "Country", sortable: true },
    { key: "countryCode", label: "Country Code", badge: "mono" },
    { key: "status", label: "Status", sortable: true, badge: "status" },
    { key: "action", label: "Action" },
  ],
  fields: [
    { key: "name", label: "District Name", required: true, placeholder: "Enter District Name" },
    { key: "code", label: "District Code", uppercase: true, mono: true, placeholder: "e.g. AMD" },
    { key: "state", label: "State", required: true, placeholder: "Enter State Name" },
    { key: "stateCode", label: "State Code", uppercase: true, mono: true, placeholder: "e.g. GJ" },
    { key: "country", label: "Country", required: true, defaultValue: "INDIA", placeholder: "Enter Country Name" },
    { key: "countryCode", label: "Country Code", uppercase: true, mono: true, defaultValue: "IN", placeholder: "e.g. IN" },
    { key: "status", label: "Status", type: "status" },
  ],
  filterGroups: [
    {
      group: "Country",
      options: [
        { value: "INDIA", label: "INDIA" },
        { value: "UNITED STATES", label: "UNITED STATES" },
        { value: "UNITED ARAB EMIRATES", label: "UNITED ARAB EMIRATES" },
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
      id: "DST-001",
      srNo: 1,
      name: "AHMEDABAD",
      code: "AMD",
      state: "GUJARAT",
      stateCode: "GJ",
      country: "INDIA",
      countryCode: "IN",
      status: "Active",
    },
    {
      id: "DST-002",
      srNo: 2,
      name: "SURAT",
      code: "STV",
      state: "GUJARAT",
      stateCode: "GJ",
      country: "INDIA",
      countryCode: "IN",
      status: "Active",
    },
    {
      id: "DST-003",
      srNo: 3,
      name: "MUMBAI SUBURBAN",
      code: "BOM",
      state: "MAHARASHTRA",
      stateCode: "MH",
      country: "INDIA",
      countryCode: "IN",
      status: "Active",
    },
  ],
};

