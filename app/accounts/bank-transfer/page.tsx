"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  PlusCircleIcon,
  FileText,
  Eye,
  Pencil,
  Trash2,
  Printer,
  ArrowRightLeft,
} from "lucide-react";
import CommonTable from "@/app/src/common/table";
import FilterSearch from "@/app/src/common/filtersearch";
import Button from "@/app/src/common/button";
import DeleteConfirmationDialog from "@/app/src/common/deleteConfirmation";
import Dropdown from "@/app/src/common/dropdown";
import { showToast } from "@/app/src/common/toast";
import {
  BankTransferEntry,
  BankTransferHeading,
  bankTransferFilterGroups,
  initialBankTransferData,
} from "./components/types";
 
export default function BankTransferPage() {
  const router = useRouter();
  const [data, setData] = useState<BankTransferEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Modals & Action State
  const [viewTransfer, setViewTransfer] = useState<BankTransferEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BankTransferEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  // Sorting & Pagination
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // LocalStorage Persistence
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("account_bank_transfer_entries");
      if (stored) {
        try {
          const parsed: BankTransferEntry[] = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const normalizeAccount = (val?: string) => {
              if (!val) return "BANK (BANK)";
              const lower = val.toLowerCase();
              if (lower.includes("cash")) return "CASH (CASH)";
              return "BANK (BANK)";
            };

            const enriched = parsed.map((item) => ({
              ...item,
              fromAccount: normalizeAccount(item.fromAccount),
              toAccount: normalizeAccount(item.toAccount),
            }));
            setData(enriched);
            localStorage.setItem("account_bank_transfer_entries", JSON.stringify(enriched));
            return;
          }
        } catch (e) {
          console.error("Failed to parse bank transfer entries from localStorage", e);
        }
      }
      setData(initialBankTransferData);
      localStorage.setItem("account_bank_transfer_entries", JSON.stringify(initialBankTransferData));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && data.length > 0) {
      localStorage.setItem("account_bank_transfer_entries", JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeTags]);

  // Search & Filter Handlers
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
      const group = bankTransferFilterGroups.find((g) =>
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

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Delete Handlers
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setData((prev) => prev.filter((item) => item.transferNumber !== deleteTarget.transferNumber));
    setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.transferNumber));
    showToast({ variant: "success", message: `Transfer ${deleteTarget.transferNumber} deleted.` });
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const handleBulkDeleteConfirm = () => {
    const count = selectedIds.length;
    setData((prev) => prev.filter((item) => !selectedIds.includes(item.transferNumber)));
    showToast({
      variant: "success",
      message: `${count} ${count === 1 ? "Transfer" : "Transfers"} deleted successfully`,
    });
    setSelectedIds([]);
    setBulkDeleteOpen(false);
  };

  // Bulk Export CSV
  const handleBulkExport = () => {
    const selectedRows = data.filter((item) => selectedIds.includes(item.transferNumber));
    if (selectedRows.length === 0) return;

    const headers = [
      "SR No",
      "Transfer Number",
      "Date",
      "Company",
      "From Account",
      "Send To Account",
      "Amount",
      "Status",
      "Particulars",
      "Reference Number",
      "Created By",
    ];

    const csvContent = [
      headers.join(","),
      ...selectedRows.map((r, idx) =>
        [
          r.srNo ?? idx + 1,
          `"${r.transferNumber || ""}"`,
          `"${r.transferDate || ""}"`,
          `"${r.company || ""}"`,
          `"${r.fromAccount || ""}"`,
          `"${r.toAccount || ""}"`,
          r.amount || 0,
          `"${r.status || ""}"`,
          `"${(r.particulars || "").replace(/"/g, '""')}"`,
          `"${r.referenceNumber || ""}"`,
          `"${r.createdBy || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bank_transfers_export_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast({
      variant: "success",
      message: `${selectedRows.length} ${selectedRows.length === 1 ? "Transfer" : "Transfers"} exported successfully`,
    });
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

  const matchTransferFields = (item: BankTransferEntry, term: string): boolean => {
    if (!term) return true;
    const raw = term.toLowerCase().trim();

    if (item.srNo !== undefined && String(item.srNo) === raw) return true;
    if (item.transferNumber && item.transferNumber.toLowerCase().includes(raw)) return true;
    if (item.company && item.company.toLowerCase().includes(raw)) return true;
    if (item.fromAccount && item.fromAccount.toLowerCase().includes(raw)) return true;
    if (item.toAccount && item.toAccount.toLowerCase().includes(raw)) return true;
    if (item.particulars && item.particulars.toLowerCase().includes(raw)) return true;
    if (item.referenceNumber && item.referenceNumber.toLowerCase().includes(raw)) return true;
    if (item.status && item.status.toLowerCase().includes(raw)) return true;
    if (item.createdBy && item.createdBy.toLowerCase().includes(raw)) return true;
    if (item.amount !== undefined && String(item.amount).includes(raw)) return true;

    const cleanNum = raw.replace(/[^0-9.]/g, "");
    if (cleanNum && cleanNum.length >= 2 && item.amount !== undefined && String(item.amount).includes(cleanNum)) {
      return true;
    }

    return false;
  };

  // Filtered & Tagged Data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const q = searchQuery.trim().toLowerCase();

      let matchesQuery = true;
      if (q) {
        const searchTerms = q.split(/[,]+/).map((s) => s.trim()).filter(Boolean);
        const termsToUse = searchTerms.length > 0 ? searchTerms : [q];
        matchesQuery = termsToUse.some((term) => matchTransferFields(item, term));
      }

      const matchesTags = activeTags.every((tag) => {
        const raw = tag.toLowerCase().trim();

        // 1. Status (supported via search suggestions or direct search)
        if (raw === "completed" || raw === "pending" || raw === "failed") {
          return (item.status || "").toLowerCase() === raw;
        }

        // 2. Link Account (To / Destination Account)
        if (raw.startsWith("link:") || raw.startsWith("link account:")) {
          const target = raw.replace(/^link( account)?:\s*/, "");
          if (target.includes("bank")) return (item.toAccount || "").toLowerCase().includes("bank");
          if (target.includes("cash")) return (item.toAccount || "").toLowerCase().includes("cash");
          return (item.toAccount || "").toLowerCase().includes(target);
        }

        // 3. Account Number (From / Source Account)
        if (raw === "bank (bank)" || raw === "bank-bank") {
          return (item.fromAccount || "").toLowerCase().includes("bank");
        }
        if (raw === "cash (cash)" || raw === "cash-cash") {
          return (item.fromAccount || "").toLowerCase().includes("cash");
        }

        // 4. Date presets (Date Range: Today, Yesterday, Last 7 days, This Month)
        if (raw === "today" || raw === "yesterday" || raw === "last 7 days" || raw === "this_month" || raw === "this month") {
          const itemDate = parseDateString(item.transferDate);
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
          if (raw === "this_month" || raw === "this month") {
            return (
              itemDate.getMonth() === today.getMonth() &&
              itemDate.getFullYear() === today.getFullYear()
            );
          }
        }

        // 5. Calendar Year (e.g. 2026, 2025, 2024, 2023)
        if (/^\d{4}$/.test(raw)) {
          const itemDate = parseDateString(item.transferDate);
          if (itemDate && itemDate.getFullYear() === Number(raw)) return true;
          if ((item.transferDate || "").includes(raw)) return true;
          return false;
        }

        // 6. Custom Date Range
        const dateRangeRegex = /^[a-z]{3} \d{1,2}, \d{4} - [a-z]{3} \d{1,2}, \d{4}$/i;
        if (dateRangeRegex.test(raw)) {
          const parts = raw.split(" - ");
          if (parts.length === 2) {
            const start = new Date(parts[0]);
            start.setHours(0, 0, 0, 0);
            const end = new Date(parts[1]);
            end.setHours(23, 59, 59, 999);
            const itemDate = parseDateString(item.transferDate);
            if (!itemDate) return false;
            return itemDate >= start && itemDate <= end;
          }
        }

        // 7. Particulars Match
        if (item.particulars && item.particulars.toLowerCase().includes(raw)) {
          return true;
        }

        return matchTransferFields(item, raw);
      });

      return matchesQuery && matchesTags;
    });
  }, [data, searchQuery, activeTags]);

  // Sorted Data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
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
  }, [filteredData, sortKey, sortDirection]);

  // Pagination
  const paginatedData = useMemo(() => {
    return sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  }, [sortedData, page]);

  // Autocomplete Suggestions (Including removed filters like Status, Company, CreatedBy, etc.)
  const searchSuggestions = useMemo(() => {
    const list: string[] = [];
    data.forEach((item) => {
      if (item.transferNumber) list.push(item.transferNumber);
      if (item.company) list.push(item.company);
      if (item.fromAccount) list.push(item.fromAccount);
      if (item.toAccount) list.push(item.toAccount);
      if (item.particulars) list.push(item.particulars);
      if (item.referenceNumber) list.push(item.referenceNumber);
      if (item.status) list.push(item.status);
      if (item.createdBy) list.push(item.createdBy);
      if (item.amount) list.push(String(item.amount));
    });

    const commonStatus = ["Completed", "Pending", "Failed", "COMPLETED", "PENDING", "FAILED"];
    const commonCompanies = [
      "American Xpress Courier AXC Inc",
      "AXC Courier logistics - AXC Courier Logistics",
    ];
    const commonAccounts = ["BANK (BANK)", "CASH (CASH)"];
    const commonYears = ["2026", "2025", "2024", "2023"];
    const commonParticulars = [
      "Liquidity Transfer",
      "Customs Duty Clearance",
      "Cash Deposit",
      "Reserve Allocation",
      "Ground Handling",
    ];

    return Array.from(
      new Set([
        ...list,
        ...commonStatus,
        ...commonCompanies,
        ...commonAccounts,
        ...commonYears,
        ...commonParticulars,
      ])
    ).filter(Boolean);
  }, [data]);

  // Table Columns Mapping
  const tableHeadings = BankTransferHeading.map((h) => {
    if (h.key === "srNo") {
      return {
        ...h,
        render: (_row: BankTransferEntry, idx?: number) => (
          <span className="font-medium text-axc-dark-gray">
            {idx !== undefined ? idx + 1 : _row.srNo}
          </span>
        ),
      };
    }
    if (h.key === "status") {
      return {
        ...h,
        render: (row: BankTransferEntry) => {
          const status = row.status;
          const badgeClass =
            status === "COMPLETED"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : status === "FAILED"
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
    if (h.key === "amount") {
      return {
        ...h,
        render: (row: BankTransferEntry) => (
          <span className="font-mono text-xs font-bold text-axc-navy">
            PKR {Number(row.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        ),
      };
    }
    if (h.key === "fromAccount") {
      return {
        ...h,
        render: (row: BankTransferEntry) => (
          <span className="font-medium text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            {row.fromAccount}
          </span>
        ),
      };
    }
    if (h.key === "toAccount") {
      return {
        ...h,
        render: (row: BankTransferEntry) => (
          <span className="font-medium text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {row.toAccount}
          </span>
        ),
      };
    }
    if (h.key === "selectTransfer") {
      const allSelected =
        paginatedData.length > 0 &&
        paginatedData.every((row) => selectedIds.includes(row.transferNumber));

      return {
        ...h,
        label: (
          <div className="flex flex-row-reverse items-center justify-center gap-1.5">
            <span className="text-xs font-bold capitalize leading-none whitespace-nowrap">Select</span>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => {
                if (allSelected) {
                  setSelectedIds((prev) =>
                    prev.filter((id) => !paginatedData.some((row) => row.transferNumber === id))
                  );
                } else {
                  setSelectedIds((prev) =>
                    Array.from(new Set([...prev, ...paginatedData.map((row) => row.transferNumber)]))
                  );
                }
              }}
              className="h-3.5 w-3.5 accent-axc-navy cursor-pointer"
            />
          </div>
        ),
        render: (row: BankTransferEntry) => (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={selectedIds.includes(row.transferNumber)}
              onChange={() => {
                setSelectedIds((prev) =>
                  prev.includes(row.transferNumber)
                    ? prev.filter((id) => id !== row.transferNumber)
                    : [...prev, row.transferNumber]
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

  return (
    <div className="relative bg-white p-4 rounded-lg w-full flex-1 flex flex-col min-h-0 shadow-sm border border-axc-border overflow-x-hidden overflow-y-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-axc-gray/40 [&::-webkit-scrollbar-thumb]:rounded-lg">
      {/* Top Action Bar */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          <FilterSearch
            groups={bankTransferFilterGroups}
            selectedOptions={activeTags}
            onOptionsChange={handleTagsChange}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            placeholder="Search by Transfer No, Company, Account, Amount, Particulars..."
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
          label="New Bank Transfer"
          href="/accounts/bank-transfer/create"
          variant="primary"
          icon={PlusCircleIcon}
        />
      </div>

      {/* Main Table */}
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
          renderActions={(row: BankTransferEntry) => (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewTransfer(row)}
                className="inline-flex items-center justify-center rounded-md border border-axc-navy/30 p-1.5 text-axc-navy transition hover:bg-axc-navy/10 cursor-pointer"
                title="View Voucher"
              >
                <Eye size={16} />
              </button>
              <button
                type="button"
                onClick={() => router.push(`/accounts/bank-transfer/create?edit=${row.transferNumber}`)}
                className="inline-flex items-center justify-center rounded-md border border-amber-300 p-1.5 text-amber-600 transition hover:bg-amber-50 cursor-pointer"
                title="Edit Transfer"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(row)}
                className="inline-flex items-center justify-center rounded-md border border-red-200 p-1.5 text-red-500 transition hover:bg-red-50 cursor-pointer"
                title="Delete Transfer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        />
      </div>

      {/* Voucher View Modal */}
      {/* <BankTransferViewModal
        transfer={viewTransfer}
        onClose={() => setViewTransfer(null)}
      /> */}

      {/* Single Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        itemName={deleteTarget?.transferNumber ? `transfer "${deleteTarget.transferNumber}"` : "transfer"}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />

      {/* Bulk Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={bulkDeleteOpen}
        itemName={`${selectedIds.length} selected bank ${selectedIds.length === 1 ? "transfer" : "transfers"}`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
      />
    </div>
  );
}
