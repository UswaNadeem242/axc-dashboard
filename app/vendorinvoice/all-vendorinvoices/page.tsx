"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PlusCircleIcon, Eye, Pencil, Trash2, FileText, Printer } from "lucide-react";
import CommonTable from "../../src/common/table";
import {
  VendorInvoiceHeading,
  VendorInvoiceEntry,
  VendorInvoiceData,
} from "../../src/constant";
import FilterSearch from "../../src/common/filtersearch";
import Button from "../../src/common/button";
import DeleteConfirmationDialog from "../../src/common/deleteConfirmation";
import Dropdown from "../../src/common/dropdown";
import { showToast } from "../../src/common/toast";

const STORAGE_KEY = "vendor_invoices";

export default function VendorInvoicePage() {
  const router = useRouter();

  const [data, setData] = useState<VendorInvoiceEntry[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<VendorInvoiceEntry | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const itemsPerPage = 10;

  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeTags]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setData(JSON.parse(stored));
          return;
        } catch (e) {
          console.error(e);
        }
      }
      setData(VendorInvoiceData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(VendorInvoiceData));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && data.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data]);

  const parseDateString = (str?: string): Date | null => {
    if (!str) return null;
    const clean = str.trim().split(" ")[0];
    const parts = clean.split(/[-/]/);
    if (parts.length !== 3) return null;
    let d: number, m: number, y: number;
    if (parts[0].length === 4) {
      [y, m, d] = parts.map(Number);
    } else {
      [d, m, y] = parts.map(Number);
    }
    if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
    const dt = new Date(y, m - 1, d);
    dt.setHours(0, 0, 0, 0);
    return isNaN(dt.getTime()) ? null : dt;
  };

  const parseInvoiceRange = (input: string): { min: number; max: number } | null => {
    const clean = input.trim();
    const rangeMatch = clean.match(
      /^(?:ref(?:-|\s*)?)?(\d{1,15})\s*(?:-|–|—|\.\.|to)\s*(?:ref(?:-|\s*)?)?(\d{1,15})$/i
    );
    if (rangeMatch) {
      const num1 = Number(rangeMatch[1]);
      const num2 = Number(rangeMatch[2]);
      if (!isNaN(num1) && !isNaN(num2)) {
        return { min: Math.min(num1, num2), max: Math.max(num1, num2) };
      }
    }
    return null;
  };

  const matchRange = (item: VendorInvoiceEntry, range: { min: number; max: number }): boolean => {
    if (item.srNo !== undefined && item.srNo >= range.min && item.srNo <= range.max) return true;

    const invMatch = (item.invoiceNumber || "").match(/(\d+)/);
    if (invMatch) {
      const num = Number(invMatch[1]);
      if (!isNaN(num) && num >= range.min && num <= range.max) return true;
    }

    const refMatch = (item.referenceNo || "").match(/(\d+)/);
    if (refMatch) {
      const num = Number(refMatch[1]);
      if (!isNaN(num) && num >= range.min && num <= range.max) return true;
    }

    return false;
  };

  const normalizeVendorInvoiceEntry = (item: VendorInvoiceEntry): VendorInvoiceEntry => {
    const sr = item.srNo || 1;
    const invNum = item.invoiceNumber || "";
    const dateStr = item.invoiceDate || item.createdDate || "05/06/2024";
    const dateParts = dateStr.split(" ")[0].split(/[-/]/);
    const year = dateParts.length >= 3 ? (dateParts[2].length === 4 ? dateParts[2] : dateParts[0].length === 4 ? dateParts[0] : "2024") : "2024";

    const derivedRefNo = item.referenceNo || item.referenceName || `REF-VINV-${1000 + sr}`;
    const derivedFromDate = item.fromDate || (dateParts.length >= 3 ? `01/${dateParts[1]}/${year}` : "01/06/2024");
    const derivedTillDate = item.tillDate || (dateParts.length >= 3 ? `30/${dateParts[1]}/${year}` : "30/06/2024");
    const derivedBillingCompany = item.billingCompany || (
      item.vendor === "FEDEX" ? "AXC INC - AMERICAN XPRESS COURIER" :
      item.vendor === "DHL" ? "ELS Logistics" :
      item.vendor === "UPS" ? "FedEx Cargo" :
      "AXC INC - AMERICAN XPRESS COURIER"
    );
    const derivedCurrency = item.currency || item.currencyType || (
      item.vendor === "FEDEX" ? "USD" :
      item.vendor === "DHL" ? "PKR" :
      item.vendor === "UPS" ? "AED" :
      item.vendor === "ARAMEX" ? "EUR" :
      "USD"
    );
    const derivedImportStatus = item.importStatus || (
      sr % 4 === 0 ? "CSV Upload" :
      sr % 3 === 0 ? "Manual" :
      "Imported"
    );

    return {
      ...item,
      invoiceNo: item.invoiceNo || invNum,
      referenceNo: derivedRefNo,
      referenceName: derivedRefNo,
      fromDate: derivedFromDate,
      tillDate: derivedTillDate,
      billingCompany: derivedBillingCompany,
      currency: derivedCurrency,
      currencyType: derivedCurrency,
      importStatus: derivedImportStatus,
      calendarYear: item.calendarYear || year,
    };
  };

  const filterGroups = useMemo(() => {
    const vendors = Array.from(new Set(data.map((d) => d.vendor).filter(Boolean)));
    const vendorOptions = (vendors.length > 0 ? vendors : ["FEDEX", "DHL", "UPS", "ARAMEX", "TNT"]).map((v) => ({
      label: v,
      value: v,
    }));

    const companies = [
      "AXC INC - AMERICAN XPRESS COURIER",
      "ELS Logistics",
      "FedEx Cargo",
      "TCS Express",
    ];
    const companyOptions = companies.map((c) => ({ label: c, value: c }));

    const currencies = ["PKR", "USD", "AED", "EUR", "GBP"];
    const currencyOptions = currencies.map((cur) => ({ label: cur, value: cur }));

    const importStatuses = ["Imported", "CSV Upload", "Manual"];
    const importOptions = importStatuses.map((s) => ({ label: s, value: s }));

    return [
      {
        group: "By Date",
        options: [
          { label: "Today", value: "Today" },
          { label: "Yesterday", value: "Yesterday" },
          { label: "Last 7 days", value: "Last 7 days" },
          { label: "Custom", value: "Custom" },
        ],
      },
      {
        group: "Calendar Year",
        sameColumnAsPrevious: true,
        options: [
          { label: "2026", value: "2026" },
          { label: "2025", value: "2025" },
          { label: "2024", value: "2024" },
        ],
      },
      {
        group: "Vendor",
        options: vendorOptions,
      },
      {
        group: "Billing Company",
        options: companyOptions,
      },
      {
        group: "Currency Type",
        options: currencyOptions,
      },
      {
        group: "Import",
        sameColumnAsPrevious: true,
        options: importOptions,
      },
    ];
  }, [data]);

  const handleSearchSubmit = (val: string) => {
    const values = val.split(",").map((v) => v.trim()).filter(Boolean);
    if (values.length > 0) {
      setActiveTags((prev) => {
        const newTags = values.filter((v) => !prev.includes(v));
        return [...prev, ...newTags];
      });
      setSearchQuery("");
    }
  };

  const handleTagsChange = (newTags: string[]) => {
    const addedTag = newTags.find((tag) => !activeTags.includes(tag));

    if (addedTag) {
      const group = filterGroups.find((g) => g.options.some((o) => o.value === addedTag));
      if (group && group.group === "By Date") {
        const groupValues = group.options.map((o) => o.value);
        const filteredTags = newTags.filter((tag) => tag === addedTag || !groupValues.includes(tag));
        setActiveTags(filteredTags);
        return;
      }
    }

    setActiveTags(newTags);
  };

  const matchVendorInvoiceItem = (item: VendorInvoiceEntry, searchStr: string): boolean => {
    if (!searchStr) return true;
    const raw = searchStr.trim().toLowerCase();

    // 1. Numeric Range (e.g. "609341850 - 609341860" or "1 - 10" or "REF 1001 - REF 1010")
    const range = parseInvoiceRange(raw);
    if (range) {
      if (matchRange(item, range)) return true;
    }

    if (raw === "custom") return true;

    // 2. Date Presets (Today, Yesterday, Last 7 days)
    if (raw === "today" || raw === "yesterday" || raw === "last 7 days") {
      const checkPreset = (dateStr?: string) => {
        const itemDate = parseDateString(dateStr);
        if (!itemDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);

        if (raw === "today") return itemDate.getTime() === today.getTime();
        if (raw === "yesterday") return itemDate.getTime() === yesterday.getTime();
        if (raw === "last 7 days") return itemDate >= last7Days && itemDate <= today;
        return false;
      };

      return (
        checkPreset(item.invoiceDate) ||
        checkPreset(item.fromDate) ||
        checkPreset(item.tillDate) ||
        checkPreset(item.createdDate)
      );
    }

    // 3. Custom Date Range "MMM dd, yyyy - MMM dd, yyyy"
    const dateRangeRegex = /^[a-z]{3} \d{1,2}, \d{4} - [a-z]{3} \d{1,2}, \d{4}$/i;
    if (dateRangeRegex.test(raw)) {
      const parts = raw.split(" - ");
      if (parts.length === 2) {
        const parseTagDate = (str: string) => {
          const dt = new Date(str);
          if (isNaN(dt.getTime())) return null;
          dt.setHours(0, 0, 0, 0);
          return dt;
        };

        const startDate = parseTagDate(parts[0]);
        const endDate = parseTagDate(parts[1]);

        if (startDate && endDate) {
          const checkRange = (dateStr?: string) => {
            const itemDate = parseDateString(dateStr);
            if (!itemDate) return false;
            return itemDate >= startDate && itemDate <= endDate;
          };

          return (
            checkRange(item.invoiceDate) ||
            checkRange(item.fromDate) ||
            checkRange(item.tillDate) ||
            checkRange(item.createdDate)
          );
        }
      }
      return false;
    }

    // 4. Calendar Year (e.g. 2026, 2025, 2024)
    if (/^(?:19|20)\d{2}$/.test(raw)) {
      if (
        (item.invoiceDate && item.invoiceDate.includes(raw)) ||
        (item.fromDate && item.fromDate.includes(raw)) ||
        (item.tillDate && item.tillDate.includes(raw)) ||
        (item.createdDate && item.createdDate.includes(raw)) ||
        String(item.calendarYear || "").includes(raw)
      ) {
        return true;
      }
    }

    // 5. Import status match
    if (raw.includes("import")) {
      const status = String(item.importStatus || "").toLowerCase();
      if (status.includes(raw) || status.includes("import")) return true;
    }

    // 6. Match all 9 Vendor fields:
    // 1. Vendor
    // 2. Reference No.
    // 3. Invoice No.
    // 4. Invoice Date
    // 5. From Date
    // 6. Till Date
    // 7. Billing Company
    // 8. Currency Type
    // 9. Import
    const fields = [
      item.vendor,
      item.referenceNo,
      item.referenceName,
      item.invoiceNumber,
      item.invoiceNo,
      item.invoiceDate,
      item.fromDate,
      item.tillDate,
      item.billingCompany,
      item.currency,
      item.currencyType,
      item.importStatus,
      item.createdDate,
      item.calendarYear,
      String(item.missingAwbCount ?? ""),
    ];

    return fields.some((f) => f && String(f).toLowerCase().includes(raw));
  };

  const filteredData = data.map(normalizeVendorInvoiceEntry).filter((item) => {
    const query = searchQuery.trim().toLowerCase();

    let matchesQuery = true;
    if (query) {
      if (query.endsWith(",")) {
        matchesQuery = true;
      } else {
        const range = parseInvoiceRange(query);
        if (range) {
          matchesQuery = matchRange(item, range);
        } else {
          const searchTerms = query.split(/[,]+/).map((q) => q.trim()).filter(Boolean);
          const termsToUse = searchTerms.length > 0 ? searchTerms : [query];
          matchesQuery = termsToUse.some((term) => matchVendorInvoiceItem(item, term));
        }
      }
    }

    const matchesTags = activeTags.length === 0 || activeTags.every((tag) => matchVendorInvoiceItem(item, tag));

    return matchesQuery && matchesTags;
  });

  const searchSuggestions = useMemo(() => {
    const list: string[] = [];
    const normalized = data.map(normalizeVendorInvoiceEntry);

    normalized.forEach((item) => {
      // 1. Vendor
      if (item.vendor) list.push(item.vendor);

      // 2. Reference No.
      if (item.referenceNo) list.push(item.referenceNo);

      // 3. Invoice No.
      if (item.invoiceNumber) list.push(item.invoiceNumber);

      // 4. Invoice Date
      if (item.invoiceDate) list.push(item.invoiceDate);

      // 5. From Date & 6. Till Date
      if (item.fromDate) list.push(item.fromDate);
      if (item.tillDate) list.push(item.tillDate);

      // 7. Billing Company
      if (item.billingCompany) list.push(item.billingCompany);

      // 8. Currency Type
      if (item.currency) list.push(item.currency);

      // 9. Import
      if (item.importStatus) list.push(item.importStatus);

      // Calendar Year
      if (item.calendarYear) list.push(String(item.calendarYear));
    });

    const commonVendors = ["FEDEX", "DHL", "UPS", "ARAMEX", "TNT"];
    const commonCompanies = [
      "AXC INC - AMERICAN XPRESS COURIER",
      "ELS Logistics",
      "FedEx Cargo",
      "TCS Express",
    ];
    const commonCurrencies = ["PKR", "USD", "AED", "EUR", "GBP"];
    const commonImport = ["Imported", "CSV Upload", "Manual"];
    const commonYears = ["2026", "2025", "2024"];

    return Array.from(
      new Set([
        ...list,
        ...commonVendors,
        ...commonCompanies,
        ...commonCurrencies,
        ...commonImport,
        ...commonYears,
      ])
    ).filter(Boolean);
  }, [data]);

  const handleDelete = (row: VendorInvoiceEntry) => {
    setDeleteTarget(row);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setData((prev) =>
      prev.filter((item) => item.invoiceNumber !== deleteTarget.invoiceNumber),
    );
    setSelectedIds((prev) =>
      prev.filter((id) => id !== deleteTarget.invoiceNumber),
    );
    setIsDeleting(false);
    setDeleteTarget(null);
    showToast({ variant: "success", message: "Vendor invoice deleted." });
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
  };

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const handleBulkDeleteConfirm = () => {
    const count = selectedIds.length;
    setData((previous) =>
      previous.filter((item) => !selectedIds.includes(item.invoiceNumber))
    );
    setSelectedIds([]);
    setBulkDeleteOpen(false);
    showToast({
      variant: "success",
      message: `${count} ${count === 1 ? "vendor invoice" : "vendor invoices"} deleted successfully`,
    });
  };

  const handleBulkExport = () => {
    const selectedRows = data.filter((item) =>
      selectedIds.includes(item.invoiceNumber)
    );
    if (selectedRows.length === 0) return;
    const headers = ["Sr No", "Vendor", "Invoice Number", "Invoice Date", "Missing AWB Count", "Created Date"];
    const csvContent = [
      headers.join(","),
      ...selectedRows.map((r, idx) =>
        [
          idx + 1,
          `"${r.vendor || ""}"`,
          `"${r.invoiceNumber || ""}"`,
          `"${r.invoiceDate || ""}"`,
          r.missingAwbCount ?? 0,
          `"${r.createdDate || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vendor_invoices_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast({
      variant: "success",
      message: `${selectedRows.length} ${selectedRows.length === 1 ? "vendor invoice" : "vendor invoices"} exported successfully`,
    });
  };

  const handleEdit = (row: VendorInvoiceEntry) =>
    router.push(`/import?edit=${row.invoiceNumber}`);
  const handleView = (row: VendorInvoiceEntry) =>
    router.push(`/vendorinvoice/view/${row.invoiceNumber}`);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const tableHeadings = VendorInvoiceHeading.map((h) => {
    if (h.key === "srNo") {
      return {
        ...h,
        render: (_row: VendorInvoiceEntry, idx?: number) => (
          <span className="font-medium text-axc-dark-gray">
            {idx !== undefined ? idx + 1 : _row.srNo}
          </span>
        ),
      };
    }
    return h;
  });

  return (
    <div className="relative bg-white p-4 rounded-lg w-full flex-1 flex flex-col min-h-0  shadow-sm border border-axc-border  overflow-x-hidden overflow-y-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-axc-gray/40 [&::-webkit-scrollbar-thumb]:rounded-lg">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          <FilterSearch
            groups={filterGroups}
            selectedOptions={activeTags}
            onOptionsChange={handleTagsChange}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            placeholder="Search vendor invoices..."
            searchSuggestions={searchSuggestions}
          />

          {selectedIds.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="flex items-center gap-2 rounded-md border border-axc-border px-3 py-2 text-[12px] font-medium text-axc-dark-gray hover:bg-gray-50 cursor-pointer transition-colors"
                title="Click to clear selection"
              >
                {selectedIds.length} Selected
              </button>

              <div className="[&_button]:cursor-pointer">
                <Dropdown
                  title="Actions"
                  items={[
                    { label: "Export", icon: <FileText className="h-4 w-4" />, onClick: handleBulkExport },
                    { label: "Print", icon: <Printer className="h-4 w-4" />, onClick: () => window.print() },
                    {
                      label: "Delete",
                      icon: <Trash2 className="h-4 w-4" />,
                      onClick: () => setBulkDeleteOpen(true),
                    },
                  ]}
                />
              </div>
            </>
          )}
        </div>
        <Button
          label="Import Vendor Invoice"
          href="/vendorinvoice/import"
          variant="primary"
          icon={PlusCircleIcon}
        />
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <CommonTable
          headings={tableHeadings}
          data={paginatedData}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          itemsPerPage={itemsPerPage}
          showScroll={true}
          selectable
          rowKey="invoiceNumber"
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          renderActions={(row: VendorInvoiceEntry) => (
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleView(row)}
                className="inline-flex items-center justify-center rounded-md border border-axc-navy/30 p-1.5 text-axc-navy transition hover:bg-axc-navy/10 cursor-pointer"
                title="View"
              >
                <Eye size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleEdit(row)}
                className="inline-flex items-center justify-center rounded-md border border-axc-dark-green/30 p-1.5 text-axc-dark-green transition hover:bg-axc-dark-green/10 cursor-pointer"
                title="Edit"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(row)}
                className="inline-flex items-center justify-center rounded-md border border-axc-red-dark/30 p-1.5 text-axc-red-dark transition hover:bg-axc-red-dark/10 cursor-pointer"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        />
      </div>

      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        itemName={deleteTarget?.invoiceNumber}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />

      <DeleteConfirmationDialog
        isOpen={bulkDeleteOpen}
        itemName={`${selectedIds.length} ${selectedIds.length === 1 ? "invoice" : "invoices"}`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}