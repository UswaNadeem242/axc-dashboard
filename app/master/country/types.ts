export interface CountryExchangeRate {
  id: string | number;
  rate: string;
  effectiveFrom: string;
  effectiveTill: string;
}

export interface CountryEntry {
  id: string;
  srNo?: number;
  name: string;
  code: string;
  dialCode: string;
  currencyCode: string;
  currencySymbol: string;
  currencyName: string;
  currencyFractionalUnit: string;
  status: "ACTIVE" | "INACTIVE";
  exchangeRates: CountryExchangeRate[];
  createdAt?: string;
}

export const CURRENCY_PRESETS: Record<
  string,
  { symbol: string; name: string; fractionalUnit: string }
> = {
  USD: { symbol: "$", name: "US DOLLAR", fractionalUnit: "Cent" },
  INR: { symbol: "₹", name: "INDIAN RUPEE", fractionalUnit: "Paisa" },
  AED: { symbol: "AED", name: "UAE DIRHAM", fractionalUnit: "Fils" },
  EUR: { symbol: "€", name: "EURO", fractionalUnit: "Cent" },
  GBP: { symbol: "£", name: "BRITISH POUND", fractionalUnit: "Penny" },
  CAD: { symbol: "CA$", name: "CANADIAN DOLLAR", fractionalUnit: "Cent" },
  AUD: { symbol: "A$", name: "AUSTRALIAN DOLLAR", fractionalUnit: "Cent" },
  SAR: { symbol: "SAR", name: "SAUDI RIYAL", fractionalUnit: "Halala" },
  SGD: { symbol: "S$", name: "SINGAPORE DOLLAR", fractionalUnit: "Cent" },
  JPY: { symbol: "¥", name: "JAPANESE YEN", fractionalUnit: "Sen" },
  CNY: { symbol: "¥", name: "CHINESE YUAN", fractionalUnit: "Fen" },
};

export const CURRENCY_CODE_OPTIONS = [
  { value: "", label: "SELECT.." },
  { value: "USD", label: "USD - US DOLLAR" },
  { value: "INR", label: "INR - INDIAN RUPEE" },
  { value: "AED", label: "AED - UAE DIRHAM" },
  { value: "EUR", label: "EUR - EURO" },
  { value: "GBP", label: "GBP - BRITISH POUND" },
  { value: "CAD", label: "CAD - CANADIAN DOLLAR" },
  { value: "AUD", label: "AUD - AUSTRALIAN DOLLAR" },
  { value: "SAR", label: "SAR - SAUDI RIYAL" },
  { value: "SGD", label: "SGD - SINGAPORE DOLLAR" },
  { value: "JPY", label: "JPY - JAPANESE YEN" },
  { value: "CNY", label: "CNY - CHINESE YUAN" },
];

export const initialCountryData: CountryEntry[] = [
  {
    id: "CTRY-001",
    srNo: 1,
    name: "UNITED STATES",
    code: "US",
    dialCode: "+1",
    currencyCode: "USD",
    currencySymbol: "$",
    currencyName: "US DOLLAR",
    currencyFractionalUnit: "Cent",
    status: "ACTIVE",
    exchangeRates: [
      {
        id: 1,
        rate: "83.50",
        effectiveFrom: "2026-01-01",
        effectiveTill: "2026-12-31",
      },
    ],
    createdAt: "01/11/2026, 10:00 AM",
  },
  {
    id: "CTRY-002",
    srNo: 2,
    name: "INDIA",
    code: "IN",
    dialCode: "+91",
    currencyCode: "INR",
    currencySymbol: "₹",
    currencyName: "INDIAN RUPEE",
    currencyFractionalUnit: "Paisa",
    status: "ACTIVE",
    exchangeRates: [
      {
        id: 1,
        rate: "1.00",
        effectiveFrom: "2026-01-01",
        effectiveTill: "2026-12-31",
      },
    ],
    createdAt: "02/11/2026, 11:30 AM",
  },
  {
    id: "CTRY-003",
    srNo: 3,
    name: "UNITED ARAB EMIRATES",
    code: "AE",
    dialCode: "+971",
    currencyCode: "AED",
    currencySymbol: "AED",
    currencyName: "UAE DIRHAM",
    currencyFractionalUnit: "Fils",
    status: "ACTIVE",
    exchangeRates: [
      {
        id: 1,
        rate: "22.75",
        effectiveFrom: "2026-01-01",
        effectiveTill: "2026-12-31",
      },
    ],
    createdAt: "03/11/2026, 02:15 PM",
  },
  {
    id: "CTRY-004",
    srNo: 4,
    name: "UNITED KINGDOM",
    code: "GB",
    dialCode: "+44",
    currencyCode: "GBP",
    currencySymbol: "£",
    currencyName: "BRITISH POUND",
    currencyFractionalUnit: "Penny",
    status: "ACTIVE",
    exchangeRates: [
      {
        id: 1,
        rate: "106.20",
        effectiveFrom: "2026-01-01",
        effectiveTill: "2026-12-31",
      },
    ],
    createdAt: "04/11/2026, 04:45 PM",
  },
  {
    id: "CTRY-005",
    srNo: 5,
    name: "CANADA",
    code: "CA",
    dialCode: "+1",
    currencyCode: "CAD",
    currencySymbol: "CA$",
    currencyName: "CANADIAN DOLLAR",
    currencyFractionalUnit: "Cent",
    status: "INACTIVE",
    exchangeRates: [
      {
        id: 1,
        rate: "61.30",
        effectiveFrom: "2026-01-01",
        effectiveTill: "2026-12-31",
      },
    ],
    createdAt: "05/11/2026, 09:20 AM",
  },
];

export const CountryHeadings = [
  { label: "SR.NO.", key: "srNo" },
  { label: "SELECT COUNTRY", key: "selectCountry" },
  { label: "COUNTRY NAME", key: "name", sortable: true },
  { label: "CODE", key: "code", sortable: true },
  { label: "DIAL CODE", key: "dialCode", sortable: true },
  { label: "CURRENCY CODE", key: "currencyCode", sortable: true },
  { label: "CURRENCY SYMBOL", key: "currencySymbol", sortable: true },
  { label: "STATUS", key: "status", sortable: true },
  { label: "ACTION", key: "action" },
];

export const countryFilterGroups = [
  {
    group: "Status",
    options: [
      { label: "ACTIVE", value: "ACTIVE" },
      { label: "INACTIVE", value: "INACTIVE" },
    ],
  },
  {
    group: "Currency",
    options: [
      { label: "USD", value: "USD" },
      { label: "INR", value: "INR" },
      { label: "AED", value: "AED" },
      { label: "EUR", value: "EUR" },
      { label: "GBP", value: "GBP" },
    ],
  },
];

