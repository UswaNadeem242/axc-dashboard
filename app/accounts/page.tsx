"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  PlusCircleIcon,
  FileText,
  Pencil,
  Trash2,
  Printer,
} from "lucide-react";
import CommonTable from "../src/common/table";
import {
  AccountHeading,
  AccountEntry,
  initialAccountData,
  accountFilterGroups,
} from "../src/constant";
import FilterSearch from "../src/common/filtersearch";
import Button from "../src/common/button";
import DeleteConfirmationDialog from "../src/common/deleteConfirmation";
import Dropdown from "../src/common/dropdown";
import { showToast } from "../src/common/toast";

export default function AccountsPage() {
  const router = useRouter();

  const [data, setData] = useState<AccountEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const [deleteTarget, setDeleteTarget] = useState<AccountEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  // Search and Tag Handlers
  const handleSearchSubmit = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;

    if (!activeTags.includes(trimmed)) {
      setActiveTags((prev) => [...prev, trimmed]);
      setSearchQuery("");
    }
  };

  const handleTagsChange = (newTags: string[]) => {
    const addedTag = newTags.find((tag) => !activeTags.includes(tag));

    if (addedTag) {
      const group = accountFilterGroups.find((g) =>
        g.options.some((o) => o.value.toLowerCase() === addedTag.toLowerCase())
      );
      if (group) {
        const groupValues = group.options.map((o) => o.value.toLowerCase());
        const filteredTags = newTags.filter(
          (tag) =>
            tag.toLowerCase() === addedTag.toLowerCase() ||
            !groupValues.includes(tag.toLowerCase())
        );
        setActiveTags(filteredTags);
        return;
      }
    }

    setActiveTags(newTags);
  };

  const removeTag = (tagToRemove: string) => {
    setActiveTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  // Normalizer to guarantee customerCode, awbNumber, forwardingNumber, and eInvoiceStatus
  const normalizeAccountEntry = (entry: AccountEntry): AccountEntry => {
    const partyCode = entry.partyCode || "";
    const customerCode = entry.customerCode || partyCode || "";
    const isAwbDoc = entry.refDocType === "AWB";
    const awbNumber =
      entry.awbNumber ||
      (isAwbDoc ? entry.refDocNumber : "") ||
      (entry.items?.[0] as any)?.awbNo ||
      "";
    const forwardingNumber =
      entry.forwardingNumber ||
      (entry.items?.[0] as any)?.customerRefNo ||
      "";

    let eInvoiceStatus = entry.eInvoiceStatus;
    if (!eInvoiceStatus) {
      const idx = entry.srNo || 1;
      if (idx % 4 === 0) eInvoiceStatus = "CANCELED";
      else if (idx % 2 === 0) eInvoiceStatus = "NOT_SYNCED";
      else eInvoiceStatus = "SYNCED";
    }

    return {
      ...entry,
      customerCode,
      awbNumber,
      forwardingNumber,
      eInvoiceStatus,
    };
  };

  // LocalStorage Persistence
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("account_entries");
      if (stored) {
        try {
          const parsed: AccountEntry[] = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setData(parsed.map(normalizeAccountEntry));
            return;
          }
        } catch (e) {
          console.error("Failed to parse account_entries from localStorage", e);
        }
      }
      const initial = initialAccountData.map(normalizeAccountEntry);
      setData(initial);
      localStorage.setItem("account_entries", JSON.stringify(initial));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && data.length > 0) {
      localStorage.setItem("account_entries", JSON.stringify(data));
    }
  }, [data]);

  // Delete Handlers
  const handleDelete = (row: AccountEntry) => {
    setDeleteTarget(row);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setData((prev) => prev.filter((item) => item.noteNumber !== deleteTarget.noteNumber));
    setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.noteNumber));
    showToast({ variant: "success", message: `Note entry ${deleteTarget.noteNumber} deleted.` });
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
  };

  const handleBulkDeleteConfirm = () => {
    const count = selectedIds.length;
    setData((prev) => prev.filter((item) => !selectedIds.includes(item.noteNumber)));
    showToast({
      variant: "success",
      message: `${count} ${count === 1 ? "Note entry" : "Note entries"} deleted successfully`,
    });
    setSelectedIds([]);
    setBulkDeleteOpen(false);
  };

  // Bulk Export CSV
  const handleBulkExport = () => {
    const selectedRows = data.filter((item) => selectedIds.includes(item.noteNumber));
    if (selectedRows.length === 0) return;

    const headers = [
      "SR No",
      "Note Number",
      "Type",
      "Note Date",
      "Customer",
      "Party Type",
      "Customer / Vendor",
      "AWB Number",
      "Forwarding Number",
      "Ref Doc Number",
      "Original Amount",
      "Adjustment Total",
      "Reason",
      "E-Invoice Status",
      "Status",
      "Created By",
    ];

    const csvContent = [
      headers.join(","),
      ...selectedRows.map((r, idx) =>
        [
          r.srNo ?? idx + 1,
          `"${r.noteNumber || ""}"`,
          `"${r.noteType || ""}"`,
          `"${r.noteDate || ""}"`,
          `"${r.customerCode || r.partyCode || ""}"`,
          `"${r.partyType || ""}"`,
          `"${r.partyName || ""}"`,
          `"${r.awbNumber || ""}"`,
          `"${r.forwardingNumber || ""}"`,
          `"${r.refDocNumber || ""}"`,
          r.originalAmount || 0,
          r.grandTotal || 0,
          `"${r.reason || ""}"`,
          `"${r.eInvoiceStatus || ""}"`,
          `"${r.status || ""}"`,
          `"${r.createdBy || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `account_notes_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast({
      variant: "success",
      message: `${selectedRows.length} ${selectedRows.length === 1 ? "Note" : "Notes"} exported successfully`,
    });
  };

  const handleEdit = (row: AccountEntry) => {
    router.push(`/accounts/credit-debit-note?edit=${row.noteNumber}`);
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

  const matchItemFields = (item: AccountEntry, term: string): boolean => {
    if (!term) return true;
    const raw = term.toLowerCase().trim();

    // 1. ID / SR No exact match or prefix
    const cleanId = raw.replace(/^[#sr\s:.-]+/, "");
    if (cleanId && item.srNo !== undefined && String(item.srNo) === cleanId) {
      return true;
    }

    // 2. Note Number
    if (item.noteNumber && item.noteNumber.toLowerCase().includes(raw)) return true;

    // 3. AWB Number
    if (item.awbNumber && item.awbNumber.toLowerCase().includes(raw)) return true;
    if (item.refDocType === "AWB" && item.refDocNumber && item.refDocNumber.toLowerCase().includes(raw)) return true;
    if (item.items && item.items.some((it: any) => it.awbNo && String(it.awbNo).toLowerCase().includes(raw))) return true;

    // 4. Forwarding Number
    if (item.forwardingNumber && item.forwardingNumber.toLowerCase().includes(raw)) return true;
    if (item.items && item.items.some((it: any) => it.customerRefNo && String(it.customerRefNo).toLowerCase().includes(raw))) return true;

    // 5. Customer Code
    if (item.customerCode && item.customerCode.toLowerCase().includes(raw)) return true;
    if (item.partyCode && item.partyCode.toLowerCase().includes(raw)) return true;

    // 6. Customer Name / Party
    if (item.partyName && item.partyName.toLowerCase().includes(raw)) return true;
    if (item.partyGstin && item.partyGstin.toLowerCase().includes(raw)) return true;

    // 7. Ref Doc No
    if (item.refDocNumber && item.refDocNumber.toLowerCase().includes(raw)) return true;

    // 8. Reason, Branch, Created By, Grand Total
    if (item.reason && item.reason.toLowerCase().includes(raw)) return true;
    if (item.branch && item.branch.toLowerCase().includes(raw)) return true;
    if (item.createdBy && item.createdBy.toLowerCase().includes(raw)) return true;
    if (item.grandTotal !== undefined && String(item.grandTotal).includes(raw)) return true;

    // 9. E-Invoice Status
    if (item.eInvoiceStatus && item.eInvoiceStatus.toLowerCase().includes(raw)) return true;

    // 10. Note Type
    if (item.noteType && item.noteType.toLowerCase().includes(raw)) return true;

    return false;
  };

  // Search and Tag filter
  const filteredData = data.filter((item) => {
    const q = searchQuery.trim().toLowerCase();

    let matchesQuery = true;
    if (q) {
      const searchTerms = q.split(/[,]+/).map((s) => s.trim()).filter(Boolean);
      const termsToUse = searchTerms.length > 0 ? searchTerms : [q];
      matchesQuery = termsToUse.some((term) => matchItemFields(item, term));
    }

    const matchesTags = activeTags.every((tag) => {
      const raw = tag.toLowerCase().trim();

      // Note Type
      if (raw === "credit note") return item.noteType.toLowerCase() === "credit note";
      if (raw === "debit note") return item.noteType.toLowerCase() === "debit note";

      // E-Invoice Status (SYNCED, NOT_SYNCED, CANCELED)
      if (raw === "synced") return (item.eInvoiceStatus || "").toUpperCase() === "SYNCED";
      if (raw === "not_synced" || raw === "not synced") return (item.eInvoiceStatus || "").toUpperCase() === "NOT_SYNCED";
      if (raw === "canceled" || raw === "cancelled") return (item.eInvoiceStatus || "").toUpperCase() === "CANCELED";

      // Date Presets
      if (raw === "today" || raw === "yesterday" || raw === "last 7 days") {
        const itemDate = parseDateString(item.noteDate);
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
      }

      // Custom Date Range (MMM dd, yyyy - MMM dd, yyyy)
      const dateRangeRegex = /^[a-z]{3} \d{1,2}, \d{4} - [a-z]{3} \d{1,2}, \d{4}$/i;
      if (dateRangeRegex.test(raw)) {
        const parts = raw.split(" - ");
        if (parts.length === 2) {
          const start = new Date(parts[0]);
          start.setHours(0, 0, 0, 0);
          const end = new Date(parts[1]);
          end.setHours(23, 59, 59, 999);
          const itemDate = parseDateString(item.noteDate);
          if (!itemDate) return false;
          return itemDate >= start && itemDate <= end;
        }
      }

      return matchItemFields(item, raw);
    });

    return matchesQuery && matchesTags;
  });

  // Sorting
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = (a as Record<string, any>)[sortKey] ?? "";
    const bVal = (b as Record<string, any>)[sortKey] ?? "";
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    return sortDirection === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedData = sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeTags]);

  // Headings mapped exactly like AwbEntries
  const tableHeadings = AccountHeading.map((h) => {
    if (h.key === "srNo") {
      return {
        ...h,
        render: (_row: AccountEntry, idx?: number) => (
          <span className="font-medium text-axc-dark-gray">
            {idx !== undefined ? idx + 1 : _row.srNo}
          </span>
        ),
      };
    }
    if (h.key === "customer") {
      return {
        ...h,
        render: (row: AccountEntry) => (
          <span className="font-mono text-xs font-semibold text-axc-navy bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            {row.customerCode || row.partyCode || "-"}
          </span>
        ),
      };
    }
    if (h.key === "awbNumber") {
      return {
        ...h,
        render: (row: AccountEntry) => (
          <span className="font-mono text-xs text-gray-800 font-medium">
            {row.awbNumber || (row.refDocType === "AWB" ? row.refDocNumber : "-")}
          </span>
        ),
      };
    }
    if (h.key === "eInvoiceStatus") {
      return {
        ...h,
        render: (row: AccountEntry) => {
          const status = (row.eInvoiceStatus || "NOT_SYNCED").toUpperCase();
          const badgeClass =
            status === "SYNCED"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : status === "CANCELED"
              ? "bg-rose-50 text-rose-700 border-rose-200"
              : "bg-amber-50 text-amber-700 border-amber-200";

          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border tracking-wide uppercase ${badgeClass}`}
            >
              {status}
            </span>
          );
        },
      };
    }
    if (h.key === "selectNote") {
      const allSelected =
        paginatedData.length > 0 &&
        paginatedData.every((row) => selectedIds.includes(row.noteNumber));

      return {
        ...h,
        label: (
          <div className="flex flex-row-reverse items-center justify-center gap-1.5 ">
            <span className="text-xs font-bold capitalize leading-nonewhitespace-nowrap">Select Note</span>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => {
                if (allSelected) {
                  setSelectedIds((prev) =>
                    prev.filter((id) => !paginatedData.some((row) => row.noteNumber === id))
                  );
                } else {
                  setSelectedIds((prev) =>
                    Array.from(new Set([...prev, ...paginatedData.map((row) => row.noteNumber)]))
                  );
                }
              }}
              className="h-3.5 w-3.5 accent-axc-navy cursor-pointer"
            />
          </div>
        ),
        render: (row: AccountEntry) => (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={selectedIds.includes(row.noteNumber)}
              onChange={() => {
                setSelectedIds((prev) =>
                  prev.includes(row.noteNumber)
                    ? prev.filter((id) => id !== row.noteNumber)
                    : [...prev, row.noteNumber]
                );
              }}
              className="h-3.5 w-3.5 accent-axc-navy cursor-pointer"
            />
          </div>
        ),
      };
    }

    return h;
  });

  // Current E-Invoice filter tag (synchronized with activeTags)
  const currentEInvoiceTag = useMemo(() => {
    const found = activeTags.find((t) =>
      ["SYNCED", "NOT_SYNCED", "CANCELED"].includes(t.toUpperCase())
    );
    return found ? found.toUpperCase() : "";
  }, [activeTags]);

  const handleEInvoiceDropdownChange = (val: string) => {
    const otherTags = activeTags.filter(
      (t) => !["SYNCED", "NOT_SYNCED", "CANCELED"].includes(t.toUpperCase())
    );
    if (val) {
      setActiveTags([...otherTags, val]);
    } else {
      setActiveTags(otherTags);
    }
  };

  // Search suggestions: ID, Note No, AWB, Forwarding No, Customer Code, Customer Name, E-Invoice
  const searchSuggestions = useMemo(() => {
    const list: string[] = [];
    data.forEach((item) => {
      // 1. ID / SR No
      if (item.srNo) list.push(String(item.srNo));

      // 2. Note Number
      if (item.noteNumber) list.push(item.noteNumber);

      // 3. AWB Number
      if (item.awbNumber) list.push(item.awbNumber);
      if (item.refDocType === "AWB" && item.refDocNumber) list.push(item.refDocNumber);

      // 4. Forwarding Number
      if (item.forwardingNumber) list.push(item.forwardingNumber);

      // 5. Customer Code
      if (item.customerCode) list.push(item.customerCode);
      if (item.partyCode) list.push(item.partyCode);

      // 6. Customer / Party Name
      if (item.partyName) list.push(item.partyName);

      // 7. Ref Doc No, Reason, Branch, Created By
      if (item.refDocNumber) list.push(item.refDocNumber);
      if (item.reason) list.push(item.reason);
      if (item.branch) list.push(item.branch);
      if (item.createdBy) list.push(item.createdBy);
    });

    const commonEInvoice = ["SYNCED", "NOT_SYNCED", "CANCELED"];
    return Array.from(new Set([...list, ...commonEInvoice])).filter(Boolean);
  }, [data]);

  return (
    <div className="relative bg-white p-4 rounded-lg w-full flex-1 flex flex-col min-h-0 shadow-sm border border-axc-border overflow-x-hidden overflow-y-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-axc-gray/40 [&::-webkit-scrollbar-thumb]:rounded-lg">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          <FilterSearch
            groups={accountFilterGroups}
            selectedOptions={activeTags}
            onOptionsChange={handleTagsChange}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            placeholder="Search by ID, Note No, AWB No, Customer Code..."
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

        <Button label="New Credit & Debit" href="/accounts/credit-debit-note" variant="primary" icon={PlusCircleIcon} />
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <CommonTable
          headings={tableHeadings}
          data={paginatedData}
          currentPage={page}
          onPageChange={setPage}
          itemsPerPage={itemsPerPage}
          showScroll={true}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          renderActions={(row: AccountEntry) => (
            <div className="flex items-center gap-2">
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

      {/* Delete Confirmation Dialogs */}
      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        itemName={deleteTarget?.noteNumber}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />

      <DeleteConfirmationDialog
        isOpen={bulkDeleteOpen}
        itemName={`${selectedIds.length} ${selectedIds.length === 1 ? "Note" : "Notes"}`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}
