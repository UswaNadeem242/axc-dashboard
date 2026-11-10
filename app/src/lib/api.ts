export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function normalizeMasterRecord<T = any>(raw: any): T {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw;
  const out: Record<string, any> = { ...raw };

  for (const [key, val] of Object.entries(raw)) {
    const camel = toCamelCase(key);
    if (!(camel in out)) {
      out[camel] = val;
    }
    const snake = toSnakeCase(key);
    if (!(snake in out)) {
      out[snake] = val;
    }
  }

  // Normalize status ('ACTIVE' | 'INACTIVE') <-> is_active / isActive
  if (typeof out.status === "string" && (out.status.toUpperCase() === "ACTIVE" || out.status.toUpperCase() === "INACTIVE")) {
    out.status = out.status.toUpperCase();
    out.isActive = out.status === "ACTIVE";
    out.is_active = out.status === "ACTIVE";
  } else if (typeof out.isActive === "boolean") {
    out.status = out.isActive ? "ACTIVE" : "INACTIVE";
    out.is_active = out.isActive;
  } else if (typeof out.is_active === "boolean") {
    out.status = out.is_active ? "ACTIVE" : "INACTIVE";
    out.isActive = out.is_active;
  } else if (!out.status) {
    out.status = "ACTIVE";
    out.isActive = true;
    out.is_active = true;
  }

  // Normalize createdAt / updatedAt strings
  if (!out.createdAt && out.created_at) {
    out.createdAt = String(out.created_at);
  }
  if (!out.updatedAt && out.updated_at) {
    out.updatedAt = String(out.updated_at);
  }

  // Common field aliases across Master modules
  if (out.dialing_code !== undefined && out.dialingCode === undefined) out.dialingCode = String(out.dialing_code ?? "");
  if (out.state_name !== undefined && out.state === undefined) out.state = out.state_name;
  if (out.stateName !== undefined && out.state === undefined) out.state = out.stateName;
  if (out.country_name !== undefined && out.country === undefined) out.country = out.country_name;
  if (out.countryName !== undefined && out.country === undefined) out.country = out.countryName;
  if (out.city_name !== undefined && out.city === undefined) out.city = out.city_name;
  if (out.cityName !== undefined && out.city === undefined) out.city = out.cityName;
  if (out.hub_name !== undefined && out.hub === undefined) out.hub = out.hub_name;
  if (out.hubName !== undefined && out.hub === undefined) out.hub = out.hubName;
  if (out.service_name !== undefined && out.service === undefined) out.service = out.service_name;
  if (out.serviceName !== undefined && out.service === undefined) out.service = out.serviceName;
  if (out.vendor_name !== undefined && out.vendor === undefined) out.vendor = out.vendor_name;
  if (out.vendorName !== undefined && out.vendor === undefined) out.vendor = out.vendorName;
  if (out.customer_name !== undefined && out.customer === undefined) out.customer = out.customer_name;
  if (out.customerName !== undefined && out.customer === undefined) out.customer = out.customerName;
  if (out.origin_name !== undefined && out.origin === undefined) out.origin = out.origin_name;
  if (out.originName !== undefined && out.origin === undefined) out.origin = out.originName;
  if (out.zone_matrix !== undefined && out.zones === undefined) out.zones = out.zone_matrix;
  if (out.zoneMatrix !== undefined && out.zones === undefined) out.zones = out.zoneMatrix;
  if (out.Countries !== undefined && out.countries === undefined) out.countries = out.Countries;
  if (out.States !== undefined && out.states === undefined) out.states = out.States;
  if (out.Cities !== undefined && out.cities === undefined) out.cities = out.Cities;

  return out as T;
}

export function prepareMasterPayload(data: any): any {
  if (!data || typeof data !== "object" || data instanceof FormData || Array.isArray(data)) {
    return data;
  }
  const payload: Record<string, any> = { ...data };

  for (const [key, val] of Object.entries(data)) {
    const snake = toSnakeCase(key);
    if (!(snake in payload)) {
      payload[snake] = val;
    }
    const camel = toCamelCase(key);
    if (!(camel in payload)) {
      payload[camel] = val;
    }
  }

  if (typeof payload.status === "string") {
    const isAct = payload.status.toUpperCase() === "ACTIVE";
    payload.is_active = isAct;
    payload.isActive = isAct;
  } else if (typeof payload.isActive === "boolean") {
    payload.is_active = payload.isActive;
    payload.status = payload.isActive ? "ACTIVE" : "INACTIVE";
  } else if (typeof payload.is_active === "boolean") {
    payload.isActive = payload.is_active;
    payload.status = payload.is_active ? "ACTIVE" : "INACTIVE";
  }

  // Common field aliases expected by Laravel controllers
  if (payload.state !== undefined && payload.state_name === undefined) payload.state_name = payload.state;
  if (payload.country !== undefined && payload.country_name === undefined) payload.country_name = payload.country;
  if (payload.city !== undefined && payload.city_name === undefined) payload.city_name = payload.city;
  if (payload.hub !== undefined && payload.hub_name === undefined) payload.hub_name = payload.hub;
  if (payload.service !== undefined && payload.service_name === undefined) payload.service_name = payload.service;
  if (payload.vendor !== undefined && payload.vendor_name === undefined) payload.vendor_name = payload.vendor;
  if (payload.customer !== undefined && payload.customer_name === undefined) payload.customer_name = payload.customer;
  if (payload.origin !== undefined && payload.origin_name === undefined) payload.origin_name = payload.origin;
  if (payload.zones !== undefined && payload.zone_matrix === undefined) payload.zone_matrix = payload.zones;

  return payload;
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string>),
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson.message) errorMsg = errorJson.message;
      else if (errorJson.error) errorMsg = errorJson.error;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Generic Master CRUD Helpers (Bi-Directionally Normalized)
  async getMasterList<T = any>(endpoint: string, params?: Record<string, any>): Promise<T[]> {
    const cleanParams: Record<string, string> = { per_page: "200" };
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null && v !== "") {
          cleanParams[k] = String(v);
        }
      }
    }
    const qs = "?" + new URLSearchParams(cleanParams).toString();
    const res = await request<any>(`${endpoint}${qs}`);
    const list = Array.isArray(res)
      ? res
      : Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.data?.data)
      ? res.data.data
      : [];
    return list.map((item: any) => normalizeMasterRecord<T>(item));
  },

  async getMasterItem<T = any>(endpoint: string, id: string | number): Promise<T> {
    const res = await request<any>(`${endpoint}/${encodeURIComponent(String(id))}`);
    const item = res?.data && !Array.isArray(res.data) ? res.data : res;
    return normalizeMasterRecord<T>(item);
  },

  async createMasterItem<T = any>(endpoint: string, data: any): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(prepareMasterPayload(data));
    const res = await request<any>(endpoint, {
      method: "POST",
      body,
    });
    const item = res?.data && !Array.isArray(res.data) ? res.data : res;
    return normalizeMasterRecord<T>(item);
  },

  async updateMasterItem<T = any>(endpoint: string, id: string | number, data: any): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(prepareMasterPayload(data));
    const res = await request<any>(`${endpoint}/${encodeURIComponent(String(id))}`, {
      method: data instanceof FormData ? "POST" : "PUT",
      body,
    });
    const item = res?.data && !Array.isArray(res.data) ? res.data : res;
    return normalizeMasterRecord<T>(item);
  },

  async deleteMasterItem(endpoint: string, id: string | number) {
    return request(`${endpoint}/${encodeURIComponent(String(id))}`, {
      method: "DELETE",
    });
  },

  async bulkDeleteMasterItems(endpoint: string, ids: (string | number)[]) {
    try {
      return await request(`${endpoint}/bulk`, {
        method: "DELETE",
        body: JSON.stringify({ ids }),
      });
    } catch {
      return Promise.all(ids.map((id) => this.deleteMasterItem(endpoint, id)));
    }
  },

  // AWB Entries
  async getAwbs(params?: Record<string, any>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/awb-entries${qs}`);
  },
  async getAwb(id: string | number) {
    return request(`/awb-entries/${id}`);
  },
  async createAwb(data: any) {
    return request("/awb-entries", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateAwb(id: string | number, data: any) {
    return request(`/awb-entries/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteAwb(id: string | number) {
    return request(`/awb-entries/${id}`, {
      method: "DELETE",
    });
  },
  async bulkDeleteAwbs(ids: (string | number)[]) {
    return request("/awb-entries/bulk", {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });
  },
  async calculateAwbRates(payload: Record<string, any>) {
    return request("/awb-entries/calculate-rates", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async getAwbDelivery(awbNumber: string | number) {
    return request(`/awb-entries/${encodeURIComponent(String(awbNumber))}/delivery`);
  },
  async updateAwbDelivery(awbNumber: string | number, data: any) {
    return request(`/awb-entries/${encodeURIComponent(String(awbNumber))}/delivery`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async addTrackingEvent(id: string | number, event: any) {
    return request(`/awb-entries/${encodeURIComponent(String(id))}/tracking-events`, {
      method: "POST",
      body: JSON.stringify(event),
    });
  },
  async updateTrackingEvent(eventId: string | number, event: any) {
    return request(`/tracking-events/${encodeURIComponent(String(eventId))}`, {
      method: "PUT",
      body: JSON.stringify(event),
    });
  },
  async deleteTrackingEvent(eventId: string | number) {
    return request(`/tracking-events/${encodeURIComponent(String(eventId))}`, {
      method: "DELETE",
    });
  },
  async getAwbAttachments(awbNumber: string | number) {
    return request(`/awb-entries/${encodeURIComponent(String(awbNumber))}/attachments`);
  },
  async uploadAwbAttachment(awbNumber: string | number, formData: FormData) {
    return request(`/awb-entries/${encodeURIComponent(String(awbNumber))}/attachments`, {
      method: "POST",
      body: formData,
    });
  },
  async deleteAwbAttachment(attachmentId: string | number) {
    return request(`/awb-attachments/${encodeURIComponent(String(attachmentId))}`, {
      method: "DELETE",
    });
  },

  // Manifests
  async getManifests(params?: Record<string, any>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/manifests${qs}`);
  },
  async getManifest(id: string | number) {
    return request(`/manifests/${id}`);
  },
  async createManifest(data: any) {
    return request("/manifests", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateManifest(id: string | number, data: any) {
    return request(`/manifests/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteManifest(id: string | number) {
    return request(`/manifests/${id}`, {
      method: "DELETE",
    });
  },
  async bulkDeleteManifests(ids: (string | number)[]) {
    return request("/manifests/bulk", {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });
  },

  // Invoices
  async getInvoices(params?: Record<string, any>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/invoices${qs}`);
  },
  async getInvoice(id: string | number) {
    return request(`/invoices/${id}`);
  },
  async createInvoice(data: any) {
    return request("/invoices", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateInvoice(id: string | number, data: any) {
    return request(`/invoices/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteInvoice(id: string | number) {
    return request(`/invoices/${id}`, {
      method: "DELETE",
    });
  },
  async bulkDeleteInvoices(ids: (string | number)[]) {
    return request("/invoices/bulk", {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });
  },

  // Vendor Invoices
  async getVendorInvoices(params?: Record<string, any>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/vendor-invoices${qs}`);
  },
  async getVendorInvoice(id: string | number) {
    return request(`/vendor-invoices/${id}`);
  },
  async createVendorInvoice(data: any) {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    return request("/vendor-invoices", {
      method: "POST",
      body: isFormData ? data : JSON.stringify(data),
    });
  },
  async importVendorInvoices(records: any[]) {
    return request("/vendor-invoices/import", {
      method: "POST",
      body: JSON.stringify({ records }),
    });
  },
  async deleteVendorInvoice(id: string | number) {
    return request(`/vendor-invoices/${id}`, {
      method: "DELETE",
    });
  },
  async bulkDeleteVendorInvoices(ids: (string | number)[]) {
    return request("/vendor-invoices/bulk", {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });
  },
  getFedExLabelUrl(id: string | number) {
    return `${API_BASE}/awb-entries/${encodeURIComponent(String(id))}/print-label`;
  },
  getAwbPrintLabelUrl(id: string | number) {
    return `${API_BASE}/awb-entries/${encodeURIComponent(String(id))}/print-label`;
  },
  getAwbPrintInvoiceUrl(id: string | number) {
    return `${API_BASE}/awb-entries/${encodeURIComponent(String(id))}/print-invoice`;
  },
  getAwbInvoicePdfUrl(id: string | number) {
    return `${API_BASE}/awb-entries/${encodeURIComponent(String(id))}/print-invoice`;
  },
  getAwbInvoiceExcelUrl(id: string | number) {
    return `${API_BASE}/awb-entries/${encodeURIComponent(String(id))}/print-invoice`;
  },
  getAwbDocumentUrl(id: string | number) {
    return `${API_BASE}/awb-entries/${encodeURIComponent(String(id))}/print-invoice`;
  },
  getShippersAccountsCopyUrl(id: string | number) {
    return `${API_BASE}/awb-entries/${encodeURIComponent(String(id))}/print-label`;
  },
  getBoxLabelUrl(id: string | number) {
    return `${API_BASE}/awb-entries/${encodeURIComponent(String(id))}/print-label`;
  },
  getAddressLabelsUrl(id: string | number) {
    return `${API_BASE}/awb-entries/${encodeURIComponent(String(id))}/print-label`;
  },
  getManifestPrintUrl(id: string | number) {
    return `${API_BASE}/manifests/${encodeURIComponent(String(id))}/print`;
  },
  getExportAirlineManifestUrl(id: string | number, _format = "xlsx") {
    return `${API_BASE}/manifests/${encodeURIComponent(String(id))}/export-airline-manifest`;
  },
  getExportAnfManifestUrl(id: string | number, format = "xlsx") {
    return `${API_BASE}/manifests/${id}/export-anf?format=${format}`;
  },
  getExportTrackingUrl(id?: string | number, format = "xlsx") {
    return `${API_BASE}/${id ? `manifests/${id}/export-tracking` : "awb-entries/export-tracking"}?format=${format}`;
  },
  getExportPackingListUrl(id: string | number, format = "xlsx") {
    return `${API_BASE}/manifests/${id}/export-packinglist?format=${format}`;
  },
  getExportVendorReconciliationUrl(id: string | number) {
    return `${API_BASE}/vendor-invoices/${id}/export-reconciliation`;
  },

  // Users & Roles
  async getUsers(params?: Record<string, any>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/users${qs}`);
  },
  async createUser(data: any) {
    return request("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateUser(id: string | number, data: any) {
    return request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async toggleUserStatus(id: string | number) {
    return request(`/users/${id}/toggle-status`, {
      method: "PATCH",
    });
  },
  async deleteUser(id: string | number) {
    return request(`/users/${id}`, {
      method: "DELETE",
    });
  },
  async bulkDeleteUsers(ids: (string | number)[]) {
    return request("/users/bulk", {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });
  },
  async getRoles() {
    return request("/roles");
  },
  async createRole(data: any) {
    return request("/roles", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateRole(id: string | number, data: any) {
    return request(`/roles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async saveRolePermissions(id: string | number, permissions: any[]) {
    return request(`/roles/${id}/permissions`, {
      method: "PUT",
      body: JSON.stringify({ permissions }),
    });
  },
  async deleteRole(id: string | number) {
    return request(`/roles/${id}`, {
      method: "DELETE",
    });
  },
  async getActivityLogs(params?: Record<string, any>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/activity-logs${qs}`);
  },
  async createActivityLog(data: any) {
    return request("/activity-logs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async toggleActivityLogStatus(id: string | number) {
    return request(`/activity-logs/${id}/toggle-status`, {
      method: "PATCH",
    });
  },
  async deleteActivityLog(id: string | number) {
    return request(`/activity-logs/${id}`, {
      method: "DELETE",
    });
  },
  async bulkDeleteActivityLogs(ids: (string | number)[]) {
    return request("/activity-logs/bulk", {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });
  },

  // Dashboard & Flights
  async getDashboard() {
    return request("/dashboard");
  },
  async getFlights() {
    return request("/flights");
  },
  async createFlight(data: any) {
    return request("/flights", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Settings
  async getProfile() {
    return request("/settings/profile");
  },
  async updateProfile(data: any) {
    return request("/settings/profile", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async getOrganization() {
    return request("/settings/organization");
  },
  async updateOrganization(data: any) {
    return request("/settings/organization", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async getSecurity() {
    return request("/settings/security");
  },
  async updateSecurity(data: any) {
    return request("/settings/security", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async getNotifications() {
    return request("/settings/notifications");
  },
  async updateNotifications(data: any) {
    return request("/settings/notifications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async getBilling() {
    return request("/settings/billing");
  },
  async updateBilling(data: any) {
    return request("/settings/billing", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Courier APIs (DHL, FedEx, UPS, AXC)
  async getCouriers() {
    return request("/couriers");
  },
  async trackCourier(params: { tracking_number: string; carrier?: string }) {
    const qs = new URLSearchParams(params as any).toString();
    return request(`/courier/track?${qs}`, {
      method: "POST",
      body: JSON.stringify(params),
    });
  },
  async generateCourierNumber(carrier: string = "DHL") {
    return request("/courier/generate-number", {
      method: "POST",
      body: JSON.stringify({ carrier }),
    });
  },
  async syncAwbCourierTracking(id: string | number) {
    return request(`/courier/sync-awb/${id}`, {
      method: "POST",
    });
  },

  // Master Data & Dropdowns
  async getMasterDropdowns() {
    return request("/masters/dropdowns");
  },
  async getCustomers(params?: Record<string, any>) {
    return this.getMasterList("/customers", params);
  },
  async createCustomer(data: any) {
    return this.createMasterItem("/customers", data);
  },
  async updateCustomer(id: string | number, data: any) {
    return this.updateMasterItem("/customers", id, data);
  },
  async deleteCustomer(id: string | number) {
    return this.deleteMasterItem("/customers", id);
  },
  async getVendors() {
    return this.getMasterList("/vendors");
  },
  async createVendor(data: any) {
    return this.createMasterItem("/vendors", data);
  },
  async updateVendor(id: string | number, data: any) {
    return this.updateMasterItem("/vendors", id, data);
  },
  async deleteVendor(id: string | number) {
    return this.deleteMasterItem("/vendors", id);
  },

  async getBranches() {
    return this.getMasterList("/hubs");
  },
  async createBranch(data: any) {
    return this.createMasterItem("/hubs", data);
  },
  async updateBranch(id: string | number, data: any) {
    return this.updateMasterItem("/hubs", id, data);
  },
  async deleteBranch(id: string | number) {
    return this.deleteMasterItem("/hubs", id);
  },

  async getHubs() {
    return this.getMasterList("/hubs");
  },
  async createHub(data: any) {
    return this.createMasterItem("/hubs", data);
  },
  async updateHub(id: string | number, data: any) {
    return this.updateMasterItem("/hubs", id, data);
  },
  async deleteHub(id: string | number) {
    return this.deleteMasterItem("/hubs", id);
  },

  async getBags() {
    return request("/masters/bags");
  },
  async createBag(data: any) {
    return request("/masters/bags", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateBag(id: string | number, data: any) {
    return request(`/masters/bags/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteBag(id: string | number) {
    return request(`/masters/bags/${id}`, { method: "DELETE" });
  },

  async getCarrierServices() {
    return this.getMasterList("/services");
  },
  async createCarrierService(data: any) {
    return this.createMasterItem("/services", data);
  },
  async updateCarrierService(id: string | number, data: any) {
    return this.updateMasterItem("/services", id, data);
  },
  async deleteCarrierService(id: string | number) {
    return this.deleteMasterItem("/services", id);
  },

  async getProducts() {
    return this.getMasterList("/products");
  },
  async getCurrencies() {
    return this.getMasterList("/currencies");
  },
  async createCurrency(data: any) {
    return this.createMasterItem("/currencies", data);
  },
  async updateCurrency(id: string | number, data: any) {
    return this.updateMasterItem("/currencies", id, data);
  },
  async deleteCurrency(id: string | number) {
    return this.deleteMasterItem("/currencies", id);
  },

  // Countries
  async getCountries() {
    return this.getMasterList("/countries");
  },
  async createCountry(data: any) {
    return this.createMasterItem("/countries", data);
  },
  async updateCountry(id: string | number, data: any) {
    return this.updateMasterItem("/countries", id, data);
  },
  async deleteCountry(id: string | number) {
    return this.deleteMasterItem("/countries", id);
  },

  // Cities
  async getCities() {
    return this.getMasterList("/cities");
  },
  async createCity(data: any) {
    return this.createMasterItem("/cities", data);
  },
  async updateCity(id: string | number, data: any) {
    return this.updateMasterItem("/cities", id, data);
  },
  async deleteCity(id: string | number) {
    return this.deleteMasterItem("/cities", id);
  },

  // Zones
  async getZones() {
    return this.getMasterList("/zones");
  },
  async createZone(data: any) {
    return this.createMasterItem("/zones", data);
  },
  async updateZone(id: string | number, data: any) {
    return this.updateMasterItem("/zones", id, data);
  },
  async deleteZone(id: string | number) {
    return this.deleteMasterItem("/zones", id);
  },

  // Charges
  async getCharges() {
    return this.getMasterList("/charge-masters");
  },
  async createCharge(data: any) {
    return this.createMasterItem("/charge-masters", data);
  },
  async updateCharge(id: string | number, data: any) {
    return this.updateMasterItem("/charge-masters", id, data);
  },
  async deleteCharge(id: string | number) {
    return this.deleteMasterItem("/charge-masters", id);
  },

  // Statuses
  async getAwbStatuses() {
    return this.getMasterList("/awb-statuses");
  },
  async createAwbStatus(data: any) {
    return this.createMasterItem("/awb-statuses", data);
  },
  async updateAwbStatus(id: string | number, data: any) {
    return this.updateMasterItem("/awb-statuses", id, data);
  },
  async deleteAwbStatus(id: string | number) {
    return this.deleteMasterItem("/awb-statuses", id);
  },

  // Shippers
  async getShippers() {
    return this.getMasterList("/shippers");
  },
  async createShipper(data: any) {
    return this.createMasterItem("/shippers", data);
  },
  async updateShipper(id: string | number, data: any) {
    return this.updateMasterItem("/shippers", id, data);
  },
  async deleteShipper(id: string | number) {
    return this.deleteMasterItem("/shippers", id);
  },

  // Consignees
  async getConsignees() {
    return this.getMasterList("/consignees");
  },
  async createConsignee(data: any) {
    return this.createMasterItem("/consignees", data);
  },
  async updateConsignee(id: string | number, data: any) {
    return this.updateMasterItem("/consignees", id, data);
  },
  async deleteConsignee(id: string | number) {
    return this.deleteMasterItem("/consignees", id);
  },

  // Bulk Import & Templates for Excel/CSV
  async importMasterFile(type: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return request(`/masters/${type}/import`, {
      method: "POST",
      body: formData,
    });
  },
  getMasterTemplateUrl(type: string) {
    return `${API_BASE}/masters/${type}/template`;
  },
};
