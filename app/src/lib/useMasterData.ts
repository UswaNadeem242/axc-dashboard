"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "./api";

export interface MasterOption {
  value: string;
  label: string;
  code?: string;
  name?: string;
  customerCode?: string;
  raw?: any;
}

export interface MasterData {
  customers: MasterOption[];
  vendors: MasterOption[];
  branches: MasterOption[];
  hubs: MasterOption[];
  bags: MasterOption[];
  services: MasterOption[];
  products: MasterOption[];
  currencies: MasterOption[];
  countries: MasterOption[];
  states: MasterOption[];
  cities: MasterOption[];
  zones: MasterOption[];
  sectors: MasterOption[];
  chargeHeads: MasterOption[];
  awbStatuses: MasterOption[];
  shippers: MasterOption[];
  consignees: MasterOption[];
  companies: MasterOption[];
  customerContracts: any[];
  serviceContracts: any[];
  cftContracts: any[];
  rateModifiers: any[];
  shipmentInvoiceNotes: any[];
  docketLessItems: any[];
  invoiceRanges: any[];
  loading: boolean;
}

let cachedData: MasterData | null = null;
let fetchPromise: Promise<MasterData> | null = null;

function readLocalMaster(key: string): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mergeByKey(apiList: any[], localList: any[], keyFields: string[]): any[] {
  const seen = new Set<string>();
  const result: any[] = [];
  for (const item of [...apiList, ...localList]) {
    if (!item || typeof item !== "object") continue;
    const k = keyFields
      .map((f) => String(item[f] || "").trim().toUpperCase())
      .find(Boolean) || String(item.id || Math.random());
    if (!seen.has(k)) {
      seen.add(k);
      result.push(item);
    }
  }
  return result;
}

const DEFAULT_DATA: MasterData = {
  customers: [
    { value: "APEX-001", label: "APEX-001 - Apex Global Logistics", code: "APEX-001" },
    { value: "NOVA-002", label: "NOVA-002 - Nova Retail Exports", code: "NOVA-002" },
    { value: "WALKIN", label: "WALKIN - Walk-in Customer", code: "WALKIN" },
  ],
  vendors: [
    { value: "DHL", label: "DHL Express", code: "DHL" },
    { value: "FEDEX", label: "FedEx International", code: "FEDEX" },
    { value: "UPS", label: "UPS Worldwide", code: "UPS" },
    { value: "AXC", label: "AXC Express", code: "AXC" },
  ],
  branches: [
    { value: "LHE", label: "LHE - Lahore Main Branch", code: "LHE" },
    { value: "KHI", label: "KHI - Karachi South Hub", code: "KHI" },
    { value: "ISB", label: "ISB - Islamabad Express Center", code: "ISB" },
  ],
  hubs: [
    { value: "LHE", label: "LHE - Lahore Hub", code: "LHE" },
    { value: "KHI", label: "KHI - Karachi Hub", code: "KHI" },
    { value: "ISB", label: "ISB - Islamabad Hub", code: "ISB" },
    { value: "DXB", label: "DXB - Dubai Hub", code: "DXB" },
    { value: "LHR", label: "LHR - London Heathrow Hub", code: "LHR" },
    { value: "JFK", label: "JFK - New York JFK Hub", code: "JFK" },
  ],
  bags: [
    { value: "BAG-1001", label: "BAG-1001 (KHI)", code: "BAG-1001" },
    { value: "BAG-1002", label: "BAG-1002 (DXB)", code: "BAG-1002" },
  ],
  services: [
    { value: "EXPRESS", label: "Express Worldwide", code: "EXPRESS" },
    { value: "STANDARD", label: "Standard Economy", code: "STANDARD" },
    { value: "DOMESTIC", label: "Domestic Priority", code: "DOMESTIC" },
  ],
  products: [
    { value: "DOX", label: "DOX (Documents)", code: "DOX" },
    { value: "NONDOX", label: "NONDOX (Non-Documents / Parcel)", code: "NONDOX" },
  ],
  currencies: [
    { value: "PKR", label: "PKR - Pakistani Rupee", code: "PKR" },
    { value: "USD", label: "USD - US Dollar", code: "USD" },
    { value: "GBP", label: "GBP - British Pound", code: "GBP" },
    { value: "AED", label: "AED - UAE Dirham", code: "AED" },
    { value: "EUR", label: "EUR - Euro", code: "EUR" },
    { value: "INR", label: "INR - Indian Rupee", code: "INR" },
  ],
  countries: [
    { value: "Pakistan", label: "Pakistan (PK)", code: "PK" },
    { value: "United Arab Emirates", label: "United Arab Emirates (AE)", code: "AE" },
    { value: "United Kingdom", label: "United Kingdom (GB)", code: "GB" },
    { value: "United States", label: "United States (US)", code: "US" },
    { value: "Saudi Arabia", label: "Saudi Arabia (SA)", code: "SA" },
    { value: "Canada", label: "Canada (CA)", code: "CA" },
  ],
  states: [
    { value: "Punjab", label: "Punjab", code: "PB" },
    { value: "Sindh", label: "Sindh", code: "SD" },
    { value: "KPK", label: "KPK", code: "KP" },
    { value: "ICT", label: "Islamabad Capital Territory", code: "ICT" },
  ],
  cities: [
    { value: "Lahore", label: "Lahore (LHE)", code: "LHE" },
    { value: "Karachi", label: "Karachi (KHI)", code: "KHI" },
    { value: "Islamabad", label: "Islamabad (ISB)", code: "ISB" },
    { value: "Sialkot", label: "Sialkot (SKT)", code: "SKT" },
    { value: "Faisalabad", label: "Faisalabad (LYP)", code: "LYP" },
    { value: "Dubai", label: "Dubai (DXB)", code: "DXB" },
    { value: "London", label: "London (LON)", code: "LON" },
    { value: "New York", label: "New York (NYC)", code: "NYC" },
  ],
  zones: [
    { value: "ZONE-A", label: "Zone A (Domestic)", code: "ZONE-A" },
    { value: "ZONE-B", label: "Zone B (Middle East)", code: "ZONE-B" },
    { value: "ZONE-C", label: "Zone C (UK & Europe)", code: "ZONE-C" },
    { value: "ZONE-D", label: "Zone D (North America)", code: "ZONE-D" },
  ],
  sectors: [
    { value: "DOMESTIC", label: "Domestic", code: "DOMESTIC", name: "Domestic" },
    { value: "INTERNATIONAL", label: "International", code: "INTERNATIONAL", name: "International" },
  ],
  chargeHeads: [
    { value: "AWB FEE", label: "AWB Fee", code: "AWB_FEE" },
    { value: "FUEL SURCHARGE", label: "Fuel Surcharge", code: "FSC" },
    { value: "HANDLING CHARGE", label: "Handling Charge", code: "HANDLING" },
    { value: "CUSTOMS CLEARANCE", label: "Customs Clearance", code: "CUSTOMS" },
    { value: "REMOTE AREA SURCHARGE", label: "Remote Area Surcharge", code: "RAS" },
  ],
  awbStatuses: [
    { value: "OPEN", label: "OPEN - Open", code: "OPEN" },
    { value: "BOOKED", label: "BOOKED - Shipment Booked", code: "BOOKED" },
    { value: "IN_TRANSIT", label: "IN_TRANSIT - In Transit", code: "IN_TRANSIT" },
    { value: "OUT_FOR_DELIVERY", label: "OUT_FOR_DELIVERY - Out For Delivery", code: "OUT_FOR_DELIVERY" },
    { value: "DELIVERED", label: "DELIVERED - Delivered", code: "DELIVERED" },
    { value: "HOLD", label: "HOLD - On Hold", code: "HOLD" },
    { value: "RTO", label: "RTO - Return To Origin", code: "RTO" },
  ],
  shippers: [],
  consignees: [],
  companies: [{ value: "AXC", label: "AXC - AX Courier Logistics", code: "AXC" }],
  customerContracts: [],
  serviceContracts: [],
  cftContracts: [],
  rateModifiers: [],
  shipmentInvoiceNotes: [],
  docketLessItems: [],
  invoiceRanges: [],
  loading: false,
};

export function calculateContractRateLocal(contract: any, weight: number, boxes = 1): {
  contractNumber: string;
  tat: string;
  finalFreight: number;
  freightPerKg: number;
  minimumFreight: number;
} {
  if (!contract) {
    return { contractNumber: "", tat: "", finalFreight: 0, freightPerKg: 0, minimumFreight: 0 };
  }
  const wt = Math.max(0.5, Number(weight) || 0.5);
  const method = String(contract.calculation_method || contract.calculationMethod || "FIXED").toUpperCase();
  const minFreight = Number(contract.minimum_freight ?? contract.minimumFreight ?? 0) || 0;
  const items: any[] = Array.isArray(contract.items)
    ? contract.items
    : Array.isArray(contract.slabs)
    ? contract.slabs
    : [];

  let calculatedRate = 0;
  let ratePerKg = 0;

  if (items.length > 0) {
    let matched = items.find((it) => {
      const lower = Number(it.lower_wt ?? it.lowerWt ?? 0);
      const upper = Number(it.upper_wt ?? it.upperWt ?? 0);
      return wt >= lower && (wt <= upper || upper <= 0);
    });
    if (matched) {
      const baseRate = Number(matched.rate ?? 0);
      if (method === "PER_KG") {
        calculatedRate = baseRate * wt;
        ratePerKg = baseRate;
      } else {
        calculatedRate = baseRate;
        ratePerKg = wt > 0 ? Number((baseRate / wt).toFixed(2)) : 0;
      }
    } else {
      const last = items[items.length - 1];
      const upper = Number(last.upper_wt ?? last.upperWt ?? 0);
      const baseRate = Number(last.rate ?? 0);
      const onAddition = Number(last.on_addition ?? last.onAddition ?? 0);
      if (wt > upper) {
        calculatedRate = method === "PER_KG" ? wt * baseRate : baseRate + (wt - upper) * onAddition;
        ratePerKg = method === "PER_KG" ? baseRate : onAddition;
      }
    }
  } else {
    const flatRate = Number(contract.rate ?? contract.baseRate ?? 0);
    if (flatRate > 0) {
      calculatedRate = method === "PER_KG" ? flatRate * wt : flatRate;
      ratePerKg = flatRate;
    }
  }

  const finalFreight = Math.max(calculatedRate, minFreight);
  return {
    contractNumber: String(contract.contract_number || contract.contractNumber || contract.code || `CNT-${contract.id || 1}`),
    tat: String(contract.tat || ""),
    finalFreight: Number(finalFreight.toFixed(2)),
    freightPerKg: Number(ratePerKg.toFixed(2)),
    minimumFreight: Number(minFreight.toFixed(2)),
  };
}

export async function loadAllMasterData(force = false): Promise<MasterData> {
  if (cachedData && !force) return cachedData;
  if (fetchPromise && !force) return fetchPromise;

  fetchPromise = (async () => {
    let d: any = {};
    try {
      const res = await api.getMasterDropdowns();
      d = res?.data || res || {};
    } catch {
      d = {};
    }

    const rawCustomers = mergeByKey(d.customers || [], readLocalMaster("master_customers"), ["customer_code", "origin_code", "code", "name"]);
    const rawVendors = mergeByKey(d.vendors || [], readLocalMaster("master_vendors"), ["code", "name"]);
    const rawHubs = mergeByKey(d.hubs || d.branches || [], readLocalMaster("master_hubs"), ["code", "name"]);
    const rawServices = mergeByKey(d.services || [], readLocalMaster("master_services"), ["code", "name"]);
    const rawProducts = mergeByKey(d.products || [], readLocalMaster("master_products"), ["code", "name"]);
    const rawCurrencies = mergeByKey(d.currencies || [], readLocalMaster("master_currencies"), ["code", "name"]);
    const rawCountries = mergeByKey(d.countries || [], readLocalMaster("master_countries"), ["code", "name"]);
    const rawStates = mergeByKey(d.states || [], readLocalMaster("master_states"), ["code", "name"]);
    const rawCities = mergeByKey(d.cities || [], readLocalMaster("master_cities"), ["code", "name"]);
    const rawZones = mergeByKey(d.zones || [], readLocalMaster("master_zones"), ["code", "name"]);
    const rawChargeHeads = mergeByKey(d.chargeHeads || d.charges || [], readLocalMaster("master_charge_masters"), ["code", "name"]);
    const rawAwbStatuses = mergeByKey(d.awbStatuses || [], readLocalMaster("master_awb_statuses"), ["code", "name"]);
    const rawShippers = mergeByKey(d.shippers || [], readLocalMaster("master_shippers"), ["code", "name"]);
    const rawConsignees = mergeByKey(d.consignees || [], readLocalMaster("master_consignees"), ["code", "name"]);
    const rawCompanies = mergeByKey(d.companies || [], readLocalMaster("master_companies"), ["code", "name"]);

    const customerContracts = mergeByKey(d.customerContracts || [], readLocalMaster("master_customer_contracts"), ["contract_number", "contractNumber", "id"]);
    const serviceContracts = mergeByKey(d.serviceContracts || [], readLocalMaster("master_service_contracts"), ["contract_number", "contractNumber", "id"]);
    const cftContracts = mergeByKey(d.cftContracts || [], readLocalMaster("master_cft_contracts"), ["contract_number", "contractNumber", "id"]);
    const rateModifiers = mergeByKey(d.rateModifiers || [], readLocalMaster("master_rate_modifiers"), ["id", "charge_master_name"]);
    const shipmentInvoiceNotes = mergeByKey(d.shipmentInvoiceNotes || [], readLocalMaster("master_shipment_invoice_notes"), ["id", "title", "note"]);
    const docketLessItems = mergeByKey(d.docketLessItems || [], readLocalMaster("master_docket_less_invoice_items"), ["id", "description"]);
    const invoiceRanges = mergeByKey(d.invoiceRanges || [], readLocalMaster("master_invoice_ranges"), ["id", "prefix"]);

    const mapCustomer = (c: any): MasterOption => {
      const code = c.customer_code || c.origin_code || c.originCode || c.code || c.name;
      const name = c.company_name || c.company || c.name || code;
      return {
        value: code,
        label: `${code} - ${c.name || name}`,
        code,
        name: c.name || name,
        customerCode: code,
        raw: {
          ...c,
          customer_code: code,
          company_name: c.company_name || c.company || c.name,
          credit_limit: c.credit_limit ?? c.creditLimit ?? 50000,
        },
      };
    };

    const mapParty = (s: any): MasterOption => {
      const code = s.code || s.name;
      const normalized = {
        ...s,
        code,
        name: s.name || s.contactPerson || "",
        company_name: s.company_name || s.company || s.name || "",
        address_line1: s.address_line1 || s.address_line_1 || s.addressLine1 || s.address || "",
        address_line2: s.address_line2 || s.address_line_2 || s.addressLine2 || "",
        address_line3: s.address_line3 || s.address_line_3 || s.addressLine3 || "",
        zip_code: s.zip_code || s.pincode || s.zipCode || "",
        city: s.city || "",
        state: s.state || "",
        country: s.country || "",
        phone: s.phone || s.contact_no || s.contactNo || s.telephone || "",
        email: s.email || "",
        kyc_type: s.kyc_type || s.gstin_type || s.gstinType || "",
        kyc_number: s.kyc_number || s.gstin_no || s.gstinNo || "",
      };
      return {
        value: code,
        label: `${code} - ${normalized.name}${normalized.city ? ` (${normalized.city})` : ""}`,
        code,
        name: normalized.name,
        raw: normalized,
      };
    };

    const hubOptions =
      rawHubs.length > 0
        ? rawHubs.map((h: any) => ({
            value: h.code || h.name,
            label: `${h.code || h.name} - ${h.name || h.cityName || h.code}`,
            code: h.code || h.name,
            name: h.name || h.cityName || h.code,
            raw: h,
          }))
        : DEFAULT_DATA.hubs;

    cachedData = {
      customers: rawCustomers.length > 0 ? rawCustomers.map(mapCustomer) : DEFAULT_DATA.customers,
      vendors:
        rawVendors.length > 0
          ? rawVendors.map((v: any) => ({
              value: v.code || v.name,
              label: v.name || v.code,
              code: v.code || v.name,
              raw: v,
            }))
          : DEFAULT_DATA.vendors,
      branches: hubOptions,
      hubs: hubOptions,
      bags:
        Array.isArray(d.bags) && d.bags.length > 0
          ? d.bags.map((b: any) => ({
              value: b.bag_no || b.code,
              label: `${b.bag_no || b.code} (${b.destination_hub || "ANY"})`,
              code: b.bag_no || b.code,
              raw: b,
            }))
          : DEFAULT_DATA.bags,
      services:
        rawServices.length > 0
          ? rawServices.map((s: any) => ({
              value: s.code || s.name,
              label: s.name || s.code,
              code: s.code || s.name,
              name: s.name || s.code,
              raw: s,
            }))
          : DEFAULT_DATA.services,
      products:
        rawProducts.length > 0
          ? rawProducts.map((p: any) => ({
              value: p.code || p.name,
              label: `${p.code || p.name}${p.name && p.name !== p.code ? ` (${p.name})` : ""}`,
              code: p.code || p.name,
              raw: p,
            }))
          : DEFAULT_DATA.products,
      currencies:
        rawCurrencies.length > 0
          ? rawCurrencies.map((c: any) => ({
              value: c.code || c.name,
              label: `${c.code || c.name} - ${c.name || c.code}`,
              code: c.code || c.name,
              raw: c,
            }))
          : DEFAULT_DATA.currencies,
      countries:
        rawCountries.length > 0
          ? rawCountries.map((c: any) => ({
              value: c.name || c.code,
              label: `${c.name || c.code}${c.code ? ` (${c.code})` : ""}`,
              code: c.code || c.name,
              raw: c,
            }))
          : DEFAULT_DATA.countries,
      states:
        rawStates.length > 0
          ? rawStates.map((s: any) => ({
              value: s.name || s.code,
              label: `${s.name || s.code}${s.code ? ` (${s.code})` : ""}`,
              code: s.code || s.name,
              raw: s,
            }))
          : DEFAULT_DATA.states,
      cities:
        rawCities.length > 0
          ? rawCities.map((c: any) => ({
              value: c.name || c.code,
              label: `${c.name || c.code}${c.code ? ` (${c.code})` : ""}`,
              code: c.code || c.name,
              raw: c,
            }))
          : DEFAULT_DATA.cities,
      zones:
        rawZones.length > 0
          ? rawZones.map((z: any) => ({
              value: z.code || z.name,
              label: `${z.code || z.name}${z.name && z.name !== z.code ? ` - ${z.name}` : ""}`,
              code: z.code || z.name,
              name: z.name || z.code,
              raw: z,
            }))
          : DEFAULT_DATA.zones,
      sectors:
        rawZones.length > 0
          ? rawZones.map((z: any) => ({
              value: z.code || z.name,
              label: `${z.code || z.name}${z.name && z.name !== z.code ? ` - ${z.name}` : ""}`,
              code: z.code || z.name,
              name: z.name || z.code,
              raw: z,
            }))
          : DEFAULT_DATA.sectors,
      chargeHeads:
        rawChargeHeads.length > 0
          ? rawChargeHeads.map((c: any) => ({
              value: c.name || c.code,
              label: c.name || c.code,
              code: c.code || c.name,
              raw: c,
            }))
          : DEFAULT_DATA.chargeHeads,
      awbStatuses:
        rawAwbStatuses.length > 0
          ? rawAwbStatuses.map((s: any) => ({
              value: s.code || s.name,
              label: `${s.code || s.name} - ${s.name || s.code}`,
              code: s.code || s.name,
              raw: s,
            }))
          : DEFAULT_DATA.awbStatuses,
      shippers: rawShippers.map(mapParty),
      consignees: rawConsignees.map(mapParty),
      companies:
        rawCompanies.length > 0
          ? rawCompanies.map((c: any) => ({
              value: c.code || c.name,
              label: `${c.code || c.name} - ${c.name || c.code}`,
              code: c.code || c.name,
              raw: c,
            }))
          : DEFAULT_DATA.companies,
      customerContracts,
      serviceContracts,
      cftContracts,
      rateModifiers,
      shipmentInvoiceNotes,
      docketLessItems,
      invoiceRanges,
      loading: false,
    };

    return cachedData;
  })();

  return fetchPromise;
}

export function invalidateMasterDataCache() {
  cachedData = null;
  fetchPromise = null;
}

export function useMasterData() {
  const [data, setData] = useState<MasterData>(cachedData || { ...DEFAULT_DATA, loading: true });

  const refresh = useCallback(async () => {
    const res = await loadAllMasterData(true);
    setData(res);
  }, []);

  useEffect(() => {
    let mounted = true;
    loadAllMasterData().then((res) => {
      if (mounted) setData(res);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { ...data, refresh };
}
