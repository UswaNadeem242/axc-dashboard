"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "./api";

export interface MasterOption {
  value: string;
  label: string;
  [key: string]: any;
}

export interface MasterDropdownsState {
  branches: MasterOption[];
  companies: MasterOption[];
  customers: MasterOption[];
  hubs: MasterOption[];
  vendors: MasterOption[];
  services: MasterOption[];
  products: MasterOption[];
  sectors: MasterOption[];
  currencies: MasterOption[];
  bags: MasterOption[];
  countries: MasterOption[];
  states: MasterOption[];
  cities: MasterOption[];
  zones: MasterOption[];
  chargeHeads: MasterOption[];
  awbStatuses: MasterOption[];
  shippers: MasterOption[];
  consignees: MasterOption[];
  loading: boolean;
  error: string | null;
}

const DEFAULT_BRANCHES: MasterOption[] = [
  { value: "MUMBAI", label: "Mumbai Station Branch" },
  { value: "DELHI", label: "Delhi Regional Branch" },
  { value: "KARACHI", label: "Karachi Cargo Terminal" },
  { value: "LAHORE", label: "Lahore Central Station" },
  { value: "NEW YORK", label: "New York JFK Hub Office" },
  { value: "LONDON", label: "London Heathrow Branch" },
  { value: "DUBAI", label: "Dubai Airport Freezone Branch" },
];

const DEFAULT_COMPANIES: MasterOption[] = [
  { value: "AXC-INC", label: "AXC INC - AMERICAN XPRESS COURIER" },
  { value: "AXC", label: "AXC" },
  { value: "AXC-PK", label: "AXC LOGISTICS PVT LTD" },
];

const DEFAULT_CUSTOMERS: MasterOption[] = [
  { value: "AMAZON", label: "AMAZON - AMAZON FULFILLMENT SERVICES", customerCode: "AMAZON" },
  { value: "FLIPKART", label: "FLIPKART - FLIPKART LOGISTICS INDIA", customerCode: "FLIPKART" },
  { value: "GLOBAL-EXP", label: "GLOBAL-EXP - GLOBAL EXPORTS LTD", customerCode: "GLOBAL-EXP" },
  { value: "VELOCITY", label: "VELOCITY - VELOCITY EXPRESS", customerCode: "VELOCITY" },
];

const DEFAULT_HUBS: MasterOption[] = [
  { value: "DEL", label: "DEL - DELHI INDIRA GANDHI CARGO HUB" },
  { value: "BOM", label: "BOM - MUMBAI CHHATRAPATI SHIVAJI HUB" },
  { value: "KHI", label: "KHI - KARACHI JINNAH INTL CARGO COMPLEX" },
  { value: "LHE", label: "LHE - LAHORE ALLAMA IQBAL CARGO HUB" },
  { value: "DXB", label: "DXB - DUBAI CARGO VILLAGE HUB" },
  { value: "JFK", label: "JFK - NEW YORK JFK AIR CARGO CENTER" },
  { value: "LHR", label: "LHR - LONDON HEATHROW WORLD CARGO CENTRE" },
  { value: "ORD", label: "ORD - CHICAGO O HARE AIR CARGO STATION" },
];

const DEFAULT_VENDORS: MasterOption[] = [
  { value: "FEDEX", label: "FEDEX EXPRESS", code: "FEDEX" },
  { value: "DHL", label: "DHL EXPRESS WORLDWIDE", code: "DHL" },
  { value: "UPS", label: "UPS WORLDWIDE", code: "UPS" },
  { value: "VELOCITY", label: "VELOCITY EXPRESS", code: "VELOCITY" },
  { value: "EMIRATES", label: "EMIRATES SKYCARGO (MAWB 176)", code: "EMIRATES" },
  { value: "SPEEDEX", label: "SPEEDEX LOGISTICS", code: "SPEEDEX" },
  { value: "V001", label: "Vendor One", code: "V001" },
  { value: "V002", label: "Vendor Two", code: "V002" },
  { value: "V003", label: "Vendor Three", code: "V003" },
];

const DEFAULT_SERVICES: MasterOption[] = [
  { value: "FEDEX IP EX NEW YORK - INDIA", label: "FEDEX IP EX NEW YORK - INDIA" },
  { value: "FEDEX IE EX", label: "FEDEX IE EX" },
  { value: "DHL EXPRESS WORLDWIDE", label: "DHL EXPRESS WORLDWIDE" },
  { value: "UPS SAVER EXPRESS", label: "UPS SAVER EXPRESS" },
  { value: "AXC DIRECT LINE", label: "AXC DIRECT LINE" },
];

const DEFAULT_PRODUCTS: MasterOption[] = [
  { value: "NONDOX", label: "NONDOX" },
  { value: "DOX", label: "DOX" },
  { value: "SAMPLE", label: "SAMPLE" },
  { value: "CARGO", label: "CARGO" },
];

const DEFAULT_SECTORS: MasterOption[] = [
  { value: "INTERNATIONAL", label: "INTERNATIONAL" },
  { value: "DOMESTIC", label: "DOMESTIC" },
];

const DEFAULT_CURRENCIES: MasterOption[] = [
  { value: "USD", label: "USD ($)" },
  { value: "PKR", label: "PKR (Rs)" },
  { value: "AED", label: "AED (AED)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "INR", label: "INR (₹)" },
];

let cachedMasters: any = null;

export function useMasterData() {
  const [data, setData] = useState<MasterDropdownsState>({
    branches: cachedMasters?.branches ?? DEFAULT_BRANCHES,
    companies: cachedMasters?.companies ?? DEFAULT_COMPANIES,
    customers: cachedMasters?.customers ?? DEFAULT_CUSTOMERS,
    hubs: cachedMasters?.hubs ?? DEFAULT_HUBS,
    vendors: cachedMasters?.vendors ?? DEFAULT_VENDORS,
    services: cachedMasters?.services ?? DEFAULT_SERVICES,
    products: cachedMasters?.products ?? DEFAULT_PRODUCTS,
    sectors: cachedMasters?.sectors ?? DEFAULT_SECTORS,
    currencies: cachedMasters?.currencies ?? DEFAULT_CURRENCIES,
    bags: cachedMasters?.bags ?? [],
    countries: cachedMasters?.countries ?? [],
    states: cachedMasters?.states ?? [],
    cities: cachedMasters?.cities ?? [],
    zones: cachedMasters?.zones ?? [],
    chargeHeads: cachedMasters?.chargeHeads ?? [],
    awbStatuses: cachedMasters?.awbStatuses ?? [],
    shippers: cachedMasters?.shippers ?? [],
    consignees: cachedMasters?.consignees ?? [],
    loading: !cachedMasters,
    error: null,
  });

  const loadData = useCallback(async () => {
    try {
      const res = await api.getMasterDropdowns();
      if (res) {
        const branches = (res.branches || []).map((b: any) => ({
          value: b.code || b.name,
          label: b.name ? `${b.name} (${b.code || b.city || ''})`.trim() : b.code,
          raw: b,
        }));

        const companies = (res.companies || []).map((c: any) => ({
          value: c.code || c.name,
          label: c.name || c.code,
          raw: c,
        }));

        const customers = (res.customers || []).map((cust: any) => ({
          value: cust.customer_code || cust.company_name,
          label: `${cust.customer_code} - ${cust.company_name}`,
          customerCode: cust.customer_code,
          companyName: cust.company_name,
          creditLimit: cust.credit_limit,
          balance: cust.balance,
          raw: cust,
        }));

        const hubs = (res.hubs || []).map((h: any) => ({
          value: h.code,
          label: `${h.code} - ${h.name || h.city}`,
          raw: h,
        }));

        const vendors = (res.vendors || []).map((v: any) => ({
          value: v.code || v.name,
          label: `${v.code} - ${v.name}`,
          code: v.code,
          name: v.name,
          raw: v,
        }));

        const services = (res.services || []).map((s: any) => ({
          value: s.name || s.code,
          label: s.name,
          code: s.code,
          raw: s,
        }));

        const products = (res.products || []).map((p: any) => ({
          value: p.code,
          label: p.name || p.code,
          raw: p,
        }));

        const sectors = (res.sectors || []).map((sec: any) => ({
          value: sec.code,
          label: sec.name || sec.code,
          raw: sec,
        }));

        const currencies = (res.currencies || []).map((cur: any) => ({
          value: cur.code,
          label: `${cur.code} (${cur.symbol || '$'})`,
          symbol: cur.symbol,
          rate: cur.exchange_rate_to_usd,
          raw: cur,
        }));

        const bags = (res.bags || []).map((bg: any) => ({
          value: bg.bag_no,
          label: `${bg.bag_no} - ${bg.seal_number || 'No Seal'} (${bg.status})`,
          raw: bg,
        }));

        const countries = (res.countries || []).map((ct: any) => ({
          value: ct.code,
          label: `${ct.name} (${ct.code})`,
          code: ct.code,
          name: ct.name,
          raw: ct,
        }));

        const states = (res.states || []).map((st: any) => ({
          value: st.code || st.name,
          label: `${st.name} (${st.code || ''})`,
          raw: st,
        }));

        const cities = (res.cities || []).map((ct: any) => ({
          value: ct.name,
          label: ct.airport_code ? `${ct.name} (${ct.airport_code})` : ct.name,
          airportCode: ct.airport_code,
          raw: ct,
        }));

        const zones = (res.zones || []).map((z: any) => ({
          value: z.code,
          label: `${z.name} (${z.code})`,
          code: z.code,
          raw: z,
        }));

        const chargeHeads = (res.chargeHeads || []).map((ch: any) => ({
          value: ch.code,
          label: `${ch.name} (${ch.code})`,
          code: ch.code,
          name: ch.name,
          chargeType: ch.charge_type,
          raw: ch,
        }));

        const awbStatuses = (res.awbStatuses || []).map((st: any) => ({
          value: st.name,
          label: st.name,
          code: st.code,
          color: st.color_code,
          raw: st,
        }));

        const shippers = (res.shippers || []).map((sh: any) => ({
          value: sh.company_name,
          label: `${sh.company_name} - ${sh.contact_name || ''} (${sh.country || ''})`.trim(),
          contactName: sh.contact_name,
          phone: sh.phone,
          city: sh.city,
          country: sh.country,
          address: sh.address_line1,
          raw: sh,
        }));

        const consignees = (res.consignees || []).map((cs: any) => ({
          value: cs.company_name,
          label: `${cs.company_name} - ${cs.contact_name || ''} (${cs.country || ''})`.trim(),
          contactName: cs.contact_name,
          phone: cs.phone,
          city: cs.city,
          country: cs.country,
          address: cs.address_line1,
          raw: cs,
        }));

        const formatted = {
          branches: branches.length ? branches : DEFAULT_BRANCHES,
          companies: companies.length ? companies : DEFAULT_COMPANIES,
          customers: customers.length ? customers : DEFAULT_CUSTOMERS,
          hubs: hubs.length ? hubs : DEFAULT_HUBS,
          vendors: vendors.length ? vendors : DEFAULT_VENDORS,
          services: services.length ? services : DEFAULT_SERVICES,
          products: products.length ? products : DEFAULT_PRODUCTS,
          sectors: sectors.length ? sectors : DEFAULT_SECTORS,
          currencies: currencies.length ? currencies : DEFAULT_CURRENCIES,
          bags: bags,
          countries: countries,
          states: states,
          cities: cities,
          zones: zones,
          chargeHeads: chargeHeads,
          awbStatuses: awbStatuses,
          shippers: shippers,
          consignees: consignees,
          loading: false,
          error: null,
        };

        cachedMasters = formatted;
        setData(formatted);
      }
    } catch (err: any) {
      console.warn("Could not fetch master dropdowns, using offline defaults:", err);
      setData((prev) => ({ ...prev, loading: false, error: err?.message || "Failed to load master tables" }));
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    ...data,
    refresh: loadData,
  };
}
