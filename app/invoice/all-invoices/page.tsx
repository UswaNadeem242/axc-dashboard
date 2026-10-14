"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Mail,
  MessageCircle,
  FileText,
  FileSpreadsheet,
  Pencil,
  Trash2,
  PlusCircle,
  PlusCircleIcon,
  Eye,
  Printer,
} from "lucide-react";

import CommonTable from "../../src/common/table";
import {
  InvoiceHeading,
  InvoiceEntry,
  initialInvoiceData,
} from "../../src/constant";
import FilterSearch from "../../src/common/filtersearch";
import Button from "../../src/common/button";
import { showToast } from "../../src/common/toast";
import DeleteConfirmationDialog from "../../src/common/deleteConfirmation";
import Dropdown from "../../src/common/dropdown";

export default function AllInvoicePage() {
  const router = useRouter();

  const [data, setData] = useState<InvoiceEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<InvoiceEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const itemsPerPage = 10;
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("invoice_entries");
      if (stored) {
        try {
          const parsed: InvoiceEntry[] = JSON.parse(stored);
          setData(parsed);
          return;
        } catch (error) {
          console.error("Failed to load invoice data:", error);
        }
      }
      setData(initialInvoiceData);
      localStorage.setItem(
        "invoice_entries",
        JSON.stringify(initialInvoiceData),
      );
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && data.length > 0) {
      localStorage.setItem("invoice_entries", JSON.stringify(data));
    }
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

  const removeTag = (tagToRemove: string) => {
    setActiveTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const parseInvoiceRange = (input: string): { min: number; max: number } | null => {
    const clean = input.trim();
    const rangeMatch = clean.match(/^(?:run\s*)?(\d{1,15})\s*(?:-|–|—|\.\.|to)\s*(?:run\s*)?(\d{1,15})$/i);
    if (rangeMatch) {
      const num1 = Number(rangeMatch[1]);
      const num2 = Number(rangeMatch[2]);
      if (!isNaN(num1) && !isNaN(num2)) {
        return { min: Math.min(num1, num2), max: Math.max(num1, num2) };
      }
    }
    return null;
  };

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

  const matchRange = (item: InvoiceEntry, range: { min: number; max: number }): boolean => {
    if (item.srNo !== undefined && item.srNo >= range.min && item.srNo <= range.max) return true;
    const runMatch = item.invoiceNumber.match(/(?:run\s*|cb\s*)(\d+)/i);
    if (runMatch) {
      const runNum = Number(runMatch[1]);
      if (!isNaN(runNum) && runNum >= range.min && runNum <= range.max) return true;
    }
    const anyNumMatch = item.invoiceNumber.match(/(\d+)/);
    if (anyNumMatch) {
      const num = Number(anyNumMatch[1]);
      if (!isNaN(num) && num >= range.min && num <= range.max) return true;
    }
    const awbNum = Number(item.awbNumber || item.awbNo);
    if (!isNaN(awbNum) && awbNum >= range.min && awbNum <= range.max) return true;
    const total = parseFloat(String(item.grandTotal).replace(/[^0-9.]/g, ""));
    if (!isNaN(total) && total >= range.min && total <= range.max) return true;
    return false;
  };

  const normalizeInvoiceEntry = (item: InvoiceEntry): InvoiceEntry => {
    const sr = item.srNo || 1;
    const invNum = item.invoiceNumber || "";
    const dateParts = (item.invoiceDate || "").split(/[-/]/);
    const year = dateParts.length >= 3 ? dateParts[2].split(" ")[0] : "2026";

    const derivedCustomerCode = item.customerCode || (item.shipperCode && item.shipperCode.trim() !== "" ? item.shipperCode : `SKT-CUST-${100 + sr}`);
    const derivedShipperName = item.shipperName || item.customerName || "AXC COUNTER BOOKING";
    const derivedCompany = item.company || (
      invNum.includes("AXC") ? "AXC Express" :
      invNum.includes("DMS") ? "ELS Logistics" :
      invNum.includes("EASTERN") ? "FedEx Cargo" :
      invNum.includes("SWIFT") ? "TCS Express" :
      "AXC Express"
    );
    const derivedAwbNumber = item.awbNumber || item.awbNo || `3012${1350 + sr}`;
    const derivedEInvoiceStatus = item.eInvoiceStatus || (
      item.irn ? "Generated" :
      sr % 5 === 0 ? "Failed" :
      sr % 3 === 0 ? "Pending" :
      "Generated"
    );
    const derivedIrn = item.irn || (
      derivedEInvoiceStatus === "Generated" ? `IRN-2026-${9876500000 + sr}` : undefined
    );
    const derivedAck = item.acknowledgementNumber || (
      derivedIrn ? `ACK-120${1000 + sr}` : undefined
    );
    const derivedFailedSync = item.failedSync !== undefined ? item.failedSync : (
      sr % 6 === 0 ? "Failed Sync" : "Synced"
    );
    const derivedSyncStatus = item.syncStatus || (
      derivedFailedSync === "Failed Sync" ? "Failed Sync" : "Synced"
    );

    return {
      ...item,
      customerCode: derivedCustomerCode,
      shipperCode: item.shipperCode || derivedCustomerCode,
      shipperName: derivedShipperName,
      company: derivedCompany,
      awbNumber: derivedAwbNumber,
      awbNo: derivedAwbNumber,
      calendarYear: item.calendarYear || year,
      eInvoiceStatus: derivedEInvoiceStatus,
      irn: derivedIrn,
      acknowledgementNumber: derivedAck,
      failedSync: derivedFailedSync,
      syncStatus: derivedSyncStatus,
    };
  };

  const filterGroups = React.useMemo(() => {
    const custTypes = ["CORPORATE", "RETAIL", "SINGLE-CUSTOMER", "MULTIPLE-CUSTOMER", "MULTIPLE-AWB"];
    const custTypeOptions = custTypes.map((t) => ({ label: t, value: t }));

    const companies = ["AXC Express", "ELS Logistics", "FedEx Cargo", "TCS Express", "DHL Express"];
    const companyOptions = companies.map((c) => ({ label: c, value: c }));

    const createdByList = Array.from(new Set(data.map((d) => d.createdBy).filter(Boolean)));
    const createdByOptions = (createdByList.length > 0 ? createdByList : ["ACCOUNTS 5", "ACCOUNTS 4", "ACCOUNTS 2", "ADMIN"]).map((cb) => ({ label: cb, value: cb }));

    const eInvoiceOptions = [
      { label: "Generated", value: "Generated" },
      { label: "Pending", value: "Pending" },
      { label: "Failed", value: "Failed" },
    ];

    const syncOptions = [
      { label: "Failed Sync", value: "Failed Sync" },
      { label: "Synced", value: "Synced" },
      { label: "Pending Sync", value: "Pending Sync" },
    ];

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
        group: "Customer Type",
        options: custTypeOptions,
      },
      {
        group: "Company",
        options: companyOptions,
      },
      {
        group: "Created By",
        options: createdByOptions,
      },
      {
        group: "E-Invoice",
        options: eInvoiceOptions,
      },
      {
        group: "Sync Status",
        sameColumnAsPrevious: true,
        options: syncOptions,
      },
    ];
  }, [data]);

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

  const handleView = (row: InvoiceEntry) =>
    console.log("View Invoice:", row.invoiceNumber);
  const handleEmail = (row: InvoiceEntry) =>
    console.log("Email Invoice:", row.invoiceNumber);
  const handleWhatsapp = (row: InvoiceEntry) =>
    console.log("Whatsapp Invoice:", row.invoiceNumber);
  const handlePdf = (row: InvoiceEntry) =>
    console.log("View Invoice PDF:", row.invoiceNumber);
  const handleExcel = (row: InvoiceEntry) =>
    console.log("Export Invoice Excel:", row.invoiceNumber);

  const handleEdit = (row: InvoiceEntry) => {
    const type = row.customerType || "single-customer";
    router.push(`/invoice/edit-invoice?id=${row.invoiceNumber}&type=${type}`);
  };
  const handleDelete = (row: InvoiceEntry) => {
    setDeleteTarget(row);
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
  };
  const confirmDelete = () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    setData((prev) =>
      prev.filter((item) => item.invoiceNumber !== deleteTarget.invoiceNumber),
    );
    setSelectedIds((prev) =>
      prev.filter((id) => id !== deleteTarget.invoiceNumber),
    );
    showToast({ variant: "success", message: "Invoice deleted." });

    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const handleBulkDeleteConfirm = () => {
    const count = selectedIds.length;
    setData((previous) =>
      previous.filter((item) => !selectedIds.includes(item.invoiceNumber))
    );
    showToast({
      variant: "success",
      message: `${count} ${count === 1 ? "invoice" : "invoices"} deleted successfully`,
    });
    setSelectedIds([]);
    setBulkDeleteOpen(false);
  };

  const handleBulkExport = () => {
    const selectedRows = data.filter((item) =>
      selectedIds.includes(item.invoiceNumber)
    );
    if (selectedRows.length === 0) return;
    const headers = [
      "SR No",
      "Invoice Number",
      "Customer Name",
      "Customer Type",
      "Customer GST Number",
      "Invoice Date",
      "From Date",
      "Till Date",
      "Grand Total",
      "Shipper Code",
      "Created By",
      "Created Date",
      "Is Email Sent",
      "Email Date",
      "Email Sent Count",
    ];
    const csvContent = [
      headers.join(","),
      ...selectedRows.map((r, idx) =>
        [
          r.srNo ?? idx + 1,
          `"${r.invoiceNumber || ""}"`,
          `"${r.customerName || ""}"`,
          `"${r.customerType || ""}"`,
          `"${r.customerGstNumber || ""}"`,
          `"${r.invoiceDate || ""}"`,
          `"${r.fromDate || ""}"`,
          `"${r.tillDate || ""}"`,
          `"${r.grandTotal || ""}"`,
          `"${r.shipperCode || ""}"`,
          `"${r.createdBy || ""}"`,
          `"${r.createdDate || ""}"`,
          `"${r.isEmailSent || ""}"`,
          `"${r.emailDate || ""}"`,
          r.emailSentCount ?? 0,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoices_export_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast({
      variant: "success",
      message: `${selectedRows.length} ${selectedRows.length === 1 ? "invoice" : "invoices"} exported successfully`,
    });
  };

  const matchInvoiceItem = (item: InvoiceEntry, searchStr: string): boolean => {
    if (!searchStr) return true;
    const raw = searchStr.trim().toLowerCase();

    // 1. Invoice Range (e.g. "1 - 10", "RUN 01 - RUN 10", "1001 - 1050")
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
        checkPreset(item.createdDate) ||
        checkPreset(item.fromDate) ||
        checkPreset(item.tillDate)
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
            checkRange(item.createdDate) ||
            checkRange(item.fromDate) ||
            checkRange(item.tillDate)
          );
        }
      }
      return false;
    }

    // 4. Calendar Year (e.g. 2026, 2025, 2024)
    if (/^(?:19|20)\d{2}$/.test(raw)) {
      if (
        (item.invoiceDate && item.invoiceDate.includes(raw)) ||
        (item.createdDate && item.createdDate.includes(raw)) ||
        String(item.calendarYear || "").includes(raw)
      ) {
        return true;
      }
    }

    // 5. Failed Sync / Sync Status
    if (raw.includes("sync")) {
      const status = String(item.syncStatus || item.failedSync || "").toLowerCase();
      if (status.includes(raw) || (raw.includes("fail") && status.includes("fail"))) return true;
    }

    // 6. E-Invoice / IRN status
    if (
      raw.includes("invoice") ||
      raw.includes("irn") ||
      raw.includes("ack") ||
      raw === "generated" ||
      raw === "pending" ||
      raw === "failed"
    ) {
      const eStatus = String(item.eInvoiceStatus || "").toLowerCase();
      if (eStatus.includes(raw)) return true;
      if (item.irn && item.irn.toLowerCase().includes(raw)) return true;
      if (item.acknowledgementNumber && item.acknowledgementNumber.toLowerCase().includes(raw)) return true;
    }

    // 7. Check all 12 Invoice Fields:
    // 1. Customer Code
    // 2. Customer Type
    // 3. Created By
    // 4. Company
    // 5. Invoice Name
    // 6. AWB
    // 7. Shipper Name
    // 8. Created Date
    // 9. Calendar Type / Date
    // 10. Invoice Range
    // 11. E-Invoice
    // 12. Failed Sync
    const fields = [
      item.customerCode,
      item.shipperCode,
      item.customerGstNumber,
      item.customerType,
      item.createdBy,
      item.company,
      item.invoiceNumber,
      item.awbNumber,
      item.awbNo,
      item.customerName,
      item.shipperName,
      item.createdDate,
      item.invoiceDate,
      item.grandTotal,
      item.calendarYear,
      item.eInvoiceStatus,
      item.irn,
      item.acknowledgementNumber,
      item.syncStatus,
      String(item.failedSync),
      item.fromDate,
      item.tillDate,
    ];

    return fields.some((f) => f && String(f).toLowerCase().includes(raw));
  };

  const filteredData = data.map(normalizeInvoiceEntry).filter((item) => {
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
          matchesQuery = termsToUse.some((term) => matchInvoiceItem(item, term));
        }
      }
    }

    const matchesTags = activeTags.length === 0 || activeTags.every((tag) => matchInvoiceItem(item, tag));

    return matchesQuery && matchesTags;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeTags]);

  const searchSuggestions = React.useMemo(() => {
    const list: string[] = [];
    const normalized = data.map(normalizeInvoiceEntry);

    normalized.forEach((item) => {
      // 1. Customer Code
      if (item.customerCode) list.push(item.customerCode);
      if (item.shipperCode) list.push(item.shipperCode);

      // 2. Customer Type
      if (item.customerType) list.push(item.customerType);

      // 3. Created By
      if (item.createdBy) list.push(item.createdBy);

      // 4. Company
      if (item.company) list.push(item.company);

      // 5. Invoice Name / Number
      if (item.invoiceNumber) list.push(item.invoiceNumber);

      // 6. AWB
      if (item.awbNumber) list.push(item.awbNumber);
      if (item.awbNo) list.push(item.awbNo);

      // 7. Shipper Name / Customer Name
      if (item.shipperName) list.push(item.shipperName);
      if (item.customerName) list.push(item.customerName);

      // 8. Created Date & Invoice Date
      if (item.createdDate) list.push(item.createdDate);
      if (item.invoiceDate) list.push(item.invoiceDate);

      // 9. Calendar Year
      if (item.calendarYear) list.push(String(item.calendarYear));

      // 11. E-Invoice
      if (item.eInvoiceStatus) list.push(item.eInvoiceStatus);
      if (item.irn) list.push(item.irn);

      // 12. Failed Sync
      if (item.syncStatus) list.push(item.syncStatus);
    });

    const commonTypes = ["CORPORATE", "RETAIL", "SINGLE-CUSTOMER", "MULTIPLE-CUSTOMER", "MULTIPLE-AWB"];
    const commonCompanies = ["AXC Express", "ELS Logistics", "FedEx Cargo", "TCS Express", "DHL Express"];
    const commonYears = ["2026", "2025", "2024"];
    const commonSync = ["Failed Sync", "Synced", "Pending Sync"];
    const commonEInvoice = ["Generated", "Pending", "Failed"];

    return Array.from(
      new Set([
        ...list,
        ...commonTypes,
        ...commonCompanies,
        ...commonYears,
        ...commonSync,
        ...commonEInvoice,
      ])
    ).filter(Boolean);
  }, [data]);

  return (
    <div className="relative bg-white p-4 shadow-sm border border-axc-border rounded-lg w-full h-[calc(100vh-160px)] flex flex-col overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <FilterSearch
            groups={filterGroups}
            selectedOptions={activeTags}
            onOptionsChange={handleTagsChange}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            placeholder="Search invoices..."
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
          className="px-5 py-4 rounded-lg text-regular-small"
          label="New Invoice"
          href="/invoice/create-invoice"
          variant="primary"
          icon={PlusCircleIcon}
        />
      </div>

      {/* {activeTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-2 shrink-0">
          {activeTags.map((tag, idx) => {
            const colors = [
              "border-slate-200 bg-slate-50 text-slate-700",
              "border-axc-red/30 bg-axc-red/5 text-axc-red",
              "border-axc-yellow/30 bg-axc-yellow/5 text-axc-dark-yellow",
              "border-axc-green/30 bg-axc-green/5 text-axc-dark-green",
              "border-axc-sky/30 bg-axc-sky/5 text-axc-sky",
              "border-axc-blue/30 bg-axc-blue/5 text-axc-blue",
              "border-purple-200 bg-purple-50 text-purple-700",
              "border-pink-200 bg-pink-50 text-pink-700",
            ];
            const colorClass = colors[idx % colors.length];

            return (
              <span
                key={tag}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition ${colorClass}`}
              >
                {tag}
                <X
                  size={14}
                  className="cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={() => removeTag(tag)}
                />
              </span>
            );
          })}
        </div>
      )} */}

      <CommonTable
        headings={InvoiceHeading}
        data={filteredData}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
        itemsPerPage={itemsPerPage}
        selectable
        rowKey="invoiceNumber"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        renderActions={(row: InvoiceEntry) => (
          <div className="flex items-center gap-2">
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
              className="inline-flex items-center justify-center rounded-md border border-axc-dark-green/30  p-1.5 text-axc-dark-green transition cursor-pointer hover:bg-axc-dark-green/10"
              title="Edit"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(row)}
              className="inline-flex items-center justify-center rounded-md border border-axc-red-dark/30  p-1.5 text-axc-red-dark transition cursor-pointer hover:bg-axc-red-dark/10"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />

      <DeleteConfirmationDialog
        isOpen={deleteTarget !== null}
        itemName={deleteTarget?.invoiceNumber}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isLoading={isDeleting}
      />

      <DeleteConfirmationDialog
        isOpen={bulkDeleteOpen}
        itemName={`${selectedIds.length} ${selectedIds.length === 1 ? "invoice" : "invoices"}`}
        onConfirm={handleBulkDeleteConfirm}
        onCancel={() => setBulkDeleteOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
}
