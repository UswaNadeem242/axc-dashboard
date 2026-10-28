export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://axc.barakedge.com/api";

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
  // AWB Entries
  async getAwbs(params?: Record<string, any>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/awbs${qs}`);
  },
  async getAwb(id: string | number) {
    return request(`/awbs/${id}`);
  },
  async createAwb(data: any) {
    return request("/awbs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateAwb(id: string | number, data: any) {
    return request(`/awbs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteAwb(id: string | number) {
    return request(`/awbs/${id}`, {
      method: "DELETE",
    });
  },
  async bulkDeleteAwbs(ids: (string | number)[]) {
    return request("/awbs/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
    });
  },
  async addTrackingEvent(id: string | number, event: any) {
    return request(`/awbs/${id}/tracking`, {
      method: "POST",
      body: JSON.stringify(event),
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
    return request("/manifests/bulk-delete", {
      method: "POST",
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
    return request("/invoices/bulk-delete", {
      method: "POST",
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
    return request("/vendor-invoices/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
    });
  },
  getFedExLabelUrl(id: string | number) {
    return `${API_BASE}/awbs/${id}/fedex-label`;
  },
  getAwbInvoicePdfUrl(id: string | number) {
    return `${API_BASE}/awbs/${id}/invoice-pdf`;
  },
  getAwbInvoiceExcelUrl(id: string | number) {
    return `${API_BASE}/awbs/${id}/invoice-excel`;
  },
  getAwbDocumentUrl(id: string | number) {
    return `${API_BASE}/awbs/${id}/document-pdf`;
  },
  getShippersAccountsCopyUrl(id: string | number) {
    return `${API_BASE}/awbs/${id}/shippers-accounts-copy`;
  },
  getBoxLabelUrl(id: string | number) {
    return `${API_BASE}/awbs/${id}/box-label`;
  },
  getAddressLabelsUrl(id: string | number) {
    return `${API_BASE}/awbs/${id}/address-labels`;
  },
  getManifestPrintUrl(id: string | number) {
    return `${API_BASE}/manifests/${id}/print`;
  },
  getExportAirlineManifestUrl(id: string | number, format = "xlsx") {
    return `${API_BASE}/manifests/${id}/export-airline?format=${format}`;
  },
  getExportAnfManifestUrl(id: string | number, format = "xlsx") {
    return `${API_BASE}/manifests/${id}/export-anf?format=${format}`;
  },
  getExportTrackingUrl(id?: string | number, format = "xlsx") {
    return `${API_BASE}/${id ? `manifests/${id}/export-tracking` : "awbs/export-tracking"}?format=${format}`;
  },
  getExportPackingListUrl(id: string | number, format = "xlsx") {
    return `${API_BASE}/manifests/${id}/export-packinglist?format=${format}`;
  },
  getExportVendorReconciliationUrl(id: string | number) {
    return `${API_BASE}/vendor-invoices/${id}/export-reconciliation`;
  },

  // Users & Roles
  async getUsers() {
    return request("/users");
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
  async deleteUser(id: string | number) {
    return request(`/users/${id}`, {
      method: "DELETE",
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
  async deleteRole(id: string | number) {
    return request(`/roles/${id}`, {
      method: "DELETE",
    });
  },
  async getActivityLogs() {
    return request("/activity-logs");
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
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/masters/customers${qs}`);
  },
  async createCustomer(data: any) {
    return request("/masters/customers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateCustomer(id: string | number, data: any) {
    return request(`/masters/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteCustomer(id: string | number) {
    return request(`/masters/customers/${id}`, {
      method: "DELETE",
    });
  },
  async getVendors() {
    return request("/masters/vendors");
  },

  async createVendor(data: any) {
    return request("/masters/vendors", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateVendor(id: string | number, data: any) {
    return request(`/masters/vendors/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteVendor(id: string | number) {
    return request(`/masters/vendors/${id}`, { method: "DELETE" });
  },

  async getBranches() {
    return request("/masters/branches");
  },
  async createBranch(data: any) {
    return request("/masters/branches", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateBranch(id: string | number, data: any) {
    return request(`/masters/branches/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteBranch(id: string | number) {
    return request(`/masters/branches/${id}`, { method: "DELETE" });
  },

  async getHubs() {
    return request("/masters/hubs");
  },
  async createHub(data: any) {
    return request("/masters/hubs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateHub(id: string | number, data: any) {
    return request(`/masters/hubs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteHub(id: string | number) {
    return request(`/masters/hubs/${id}`, { method: "DELETE" });
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
    return request("/masters/services");
  },
  async createCarrierService(data: any) {
    return request("/masters/services", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateCarrierService(id: string | number, data: any) {
    return request(`/masters/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteCarrierService(id: string | number) {
    return request(`/masters/services/${id}`, { method: "DELETE" });
  },

  async getProducts() {
    return request("/masters/products");
  },
  async getCurrencies() {
    return request("/masters/currencies");
  },
  async createCurrency(data: any) {
    return request("/masters/currencies", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateCurrency(id: string | number, data: any) {
    return request(`/masters/currencies/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteCurrency(id: string | number) {
    return request(`/masters/currencies/${id}`, { method: "DELETE" });
  },

  // Countries
  async getCountries() {
    return request("/masters/countries");
  },
  async createCountry(data: any) {
    return request("/masters/countries", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateCountry(id: string | number, data: any) {
    return request(`/masters/countries/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteCountry(id: string | number) {
    return request(`/masters/countries/${id}`, { method: "DELETE" });
  },

  // Cities
  async getCities() {
    return request("/masters/cities");
  },
  async createCity(data: any) {
    return request("/masters/cities", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateCity(id: string | number, data: any) {
    return request(`/masters/cities/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteCity(id: string | number) {
    return request(`/masters/cities/${id}`, { method: "DELETE" });
  },

  // Zones
  async getZones() {
    return request("/masters/zones");
  },
  async createZone(data: any) {
    return request("/masters/zones", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateZone(id: string | number, data: any) {
    return request(`/masters/zones/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteZone(id: string | number) {
    return request(`/masters/zones/${id}`, { method: "DELETE" });
  },

  // Charges
  async getCharges() {
    return request("/masters/charges");
  },
  async createCharge(data: any) {
    return request("/masters/charges", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateCharge(id: string | number, data: any) {
    return request(`/masters/charges/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteCharge(id: string | number) {
    return request(`/masters/charges/${id}`, { method: "DELETE" });
  },

  // Statuses
  async getAwbStatuses() {
    return request("/masters/statuses");
  },
  async createAwbStatus(data: any) {
    return request("/masters/statuses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateAwbStatus(id: string | number, data: any) {
    return request(`/masters/statuses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteAwbStatus(id: string | number) {
    return request(`/masters/statuses/${id}`, { method: "DELETE" });
  },

  // Shippers
  async getShippers() {
    return request("/masters/shippers");
  },
  async createShipper(data: any) {
    return request("/masters/shippers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateShipper(id: string | number, data: any) {
    return request(`/masters/shippers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteShipper(id: string | number) {
    return request(`/masters/shippers/${id}`, { method: "DELETE" });
  },

  // Consignees
  async getConsignees() {
    return request("/masters/consignees");
  },
  async createConsignee(data: any) {
    return request("/masters/consignees", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async updateConsignee(id: string | number, data: any) {
    return request(`/masters/consignees/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  async deleteConsignee(id: string | number) {
    return request(`/masters/consignees/${id}`, { method: "DELETE" });
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


