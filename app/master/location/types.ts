import { MasterModuleConfig } from "../_shared/master-page-views";

export interface LocationEntry {
  id: string;
  srNo?: number;
  code: string;
  name: string;
  pincode: string;
  city: string;
  district: string;
  state: string;
  stateCode: string;
  country: string;
  countryCode: string;
  hubCode: string;
  zoneCode: string;
  serviceable: boolean;
  odaLocation: boolean;
  codAvailable: boolean;
  prepaidAvailable: boolean;
  topayAvailable: boolean;
  odaCharge: number;
  transitDays: number;
  status: string;
}

export const locationModuleConfig: MasterModuleConfig<LocationEntry> = {
  title: "Locations",
  singularTitle: "Location",
  panelTitle: "Location / Pincode Information",
  endpoint: "/locations",
  storageKey: "master_locations",
  basePath: "/master/location",
  primaryKeyField: "name",
  secondaryKeyField: "pincode",
  statusCase: "TITLE",
  columns: [
    { key: "srNo", label: "SR.NO." },
    { key: "code", label: "Code", sortable: true, badge: "code" },
    { key: "name", label: "Location Name", sortable: true },
    { key: "pincode", label: "Pincode", sortable: true, badge: "mono" },
    { key: "city", label: "City", sortable: true },
    { key: "state", label: "State", sortable: true },
    { key: "country", label: "Country", sortable: true },
    { key: "hubCode", label: "Hub", badge: "blue" },
    { key: "zoneCode", label: "Zone", badge: "code" },
    { key: "serviceable", label: "Serviceable", badge: "boolean" },
    { key: "status", label: "Status", sortable: true, badge: "status" },
    { key: "action", label: "Action" },
  ],
  fields: [
    { key: "code", label: "Location Code", required: true, uppercase: true, mono: true, placeholder: "e.g. LOC-AMD-01" },
    { key: "name", label: "Location Name", required: true, placeholder: "Enter Area / Location Name" },
    { key: "pincode", label: "Pincode / ZIP", mono: true, placeholder: "e.g. 380009" },
    { key: "city", label: "City", placeholder: "Enter City" },
    { key: "district", label: "District", placeholder: "Enter District" },
    { key: "state", label: "State", placeholder: "Enter State" },
    { key: "stateCode", label: "State Code", uppercase: true, mono: true, placeholder: "e.g. GJ" },
    { key: "country", label: "Country", defaultValue: "INDIA", placeholder: "Enter Country" },
    { key: "countryCode", label: "Country Code", uppercase: true, mono: true, defaultValue: "IN", placeholder: "e.g. IN" },
    { key: "hubCode", label: "Hub Code", uppercase: true, mono: true, placeholder: "e.g. AMD" },
    { key: "zoneCode", label: "Zone Code", uppercase: true, mono: true, placeholder: "e.g. WEST" },
    { key: "odaCharge", label: "ODA Charge", type: "number", defaultValue: 0, placeholder: "0" },
    { key: "transitDays", label: "Transit Days", type: "number", defaultValue: 2, placeholder: "2" },
    { key: "serviceable", label: "Serviceable", type: "checkbox", defaultValue: true },
    { key: "odaLocation", label: "ODA Location", type: "checkbox", defaultValue: false },
    { key: "codAvailable", label: "COD Available", type: "checkbox", defaultValue: true },
    { key: "prepaidAvailable", label: "Prepaid Available", type: "checkbox", defaultValue: true },
    { key: "topayAvailable", label: "To-Pay Available", type: "checkbox", defaultValue: true },
    { key: "status", label: "Status", type: "status" },
  ],
  filterGroups: [
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
      id: "LOC-001",
      srNo: 1,
      code: "LOC-AMD-009",
      name: "NAVRANGPURA",
      pincode: "380009",
      city: "AHMEDABAD",
      district: "AHMEDABAD",
      state: "GUJARAT",
      stateCode: "GJ",
      country: "INDIA",
      countryCode: "IN",
      hubCode: "AMD",
      zoneCode: "WEST",
      serviceable: true,
      odaLocation: false,
      codAvailable: true,
      prepaidAvailable: true,
      topayAvailable: true,
      odaCharge: 0,
      transitDays: 1,
      status: "Active",
    },
    {
      id: "LOC-002",
      srNo: 2,
      code: "LOC-BOM-099",
      name: "ANDHERI EAST CARGO",
      pincode: "400099",
      city: "MUMBAI",
      district: "MUMBAI SUBURBAN",
      state: "MAHARASHTRA",
      stateCode: "MH",
      country: "INDIA",
      countryCode: "IN",
      hubCode: "BOM",
      zoneCode: "WEST",
      serviceable: true,
      odaLocation: false,
      codAvailable: true,
      prepaidAvailable: true,
      topayAvailable: true,
      odaCharge: 0,
      transitDays: 1,
      status: "Active",
    },
  ],
};

