"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  PlusCircle,
  PlusCircleIcon,
  FileText,
  Pencil,
  Trash2,
  Printer,
  X,
  Receipt,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import CommonTable from "@/app/src/common/table";
import FilterSearch from "@/app/src/common/filtersearch";
import Button from "@/app/src/common/button";
import DeleteConfirmationDialog from "@/app/src/common/deleteConfirmation";
import Dropdown from "@/app/src/common/dropdown";
import { showToast } from "@/app/src/common/toast";
import { useRouter } from "next/navigation";
import {
  ReceiptEntry,
  ReceiptFormData,
  ReceiptHeading,
  receiptFilterGroups,
  initialReceiptData,
} from "./components/types";

export default function ReceiptPage() {
  const router = useRouter();
  const [data, setData] = useState<ReceiptEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Modals & Actions state
  const [deleteTarget, setDeleteTarget] = useState<ReceiptEntry | null>(null);
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
      const stored = localStorage.getItem("account_receipt_entries");
      if (stored) {
        try {
          const parsed: ReceiptEntry[] = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const enriched = parsed.map((item) => {
              const defaultItem = initialReceiptData.find((d) => d.id === item.id);
              if (defaultItem) {
                return {
                  ...defaultItem,
                  ...item,
                  particulars: item.particulars || defaultItem.particulars || item.remarks,
                  gatewayType: item.gatewayType || defaultItem.gatewayType,
                  hub: item.hub || defaultItem.hub,
                  accountType: item.accountType || defaultItem.accountType,
                  calendarYear: item.calendarYear || defaultItem.calendarYear,
                  customerYear: item.customerYear || defaultItem.customerYear || item.calendarYear || defaultItem.calendarYear,
                };
              }
              return item;
            });
            setData(enriched);
            localStorage.setItem("account_receipt_entries", JSON.stringify(enriched));
            return;
          }
        } catch (e) {
          console.error("Failed to parse receipt entries from localStorage", e);
        }
      }
      setData(initialReceiptData);
      localStorage.setItem("account_receipt_entries", JSON.stringify(initialReceiptData));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && data.length > 0) {
      localStorage.setItem("account_receipt_entries", JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeTags]);

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
      const group = receiptFilterGroups.find((g) =>
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
    setData((prev) => prev.filter((item) => item.receiptNumber !== deleteTarget.receiptNumber));
    setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.receiptNumber));
    showToast({ variant: "success", message: `Receipt ${deleteTarget.receiptNumber} deleted.` });
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const handleBulkDeleteConfirm = () => {
    const count = selectedIds.length;
    setData((prev) => prev.filter((item) => !selectedIds.includes(item.receiptNumber)));
    showToast({
      variant: "success",
      message: `${count} ${count === 1 ? "Receipt" : "Receipts"} deleted successfully`,
    });
    setSelectedIds([]);
    setBulkDeleteOpen(false);
  };



  // Bulk Export CSV
  const handleBulkExport = () => {
    const selectedRows = data.filter((item) => selectedIds.includes(item.receiptNumber));
    if (selectedRows.length === 0) return;

    const headers = [
      "SR No",
      "Receipt Number",
      "Receipt Date",
      "Customer Code",
      "Customer Name",
      "Payment Mode",
      "Reference Number",
      "Deposited Bank",
      "Against Document",
      "Received Amount",
      "Deduction",
      "Net Amount",
      "Status",
      "Created By",
      "Created Date",
    ];

    const csvContent = [
      headers.join(","),
      ...selectedRows.map((r, idx) =>
        [
          r.srNo ?? idx + 1,
          `"${r.receiptNumber || ""}"`,
          `"${r.receiptDate || ""}"`,
          `"${r.customerCode || ""}"`,
          `"${r.customerName || ""}"`,
          `"${r.paymentMode || ""}"`,
          `"${r.referenceNumber || ""}"`,
          `"${r.bankName || ""}"`,
          `"${r.againstDocNumber || ""}"`,
          r.receivedAmount || 0,
          r.deductionAmount || 0,
          r.netAmount || 0,
          `"${r.status || ""}"`,
          `"${r.createdBy || ""}"`,
          `"${r.createdDate || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipts_export_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast({
      variant: "success",
      message: `${selectedRows.length} ${selectedRows.length === 1 ? "Receipt" : "Receipts"} exported successfully`,
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

  const matchReceiptFields = (item: ReceiptEntry, term: string): boolean => {
    if (!term) return true;
    const raw = term.toLowerCase().trim();

    // 1. ID / SR No exact match
    const cleanId = raw.replace(/^[#sr\s:.-]+/, "");
    if (cleanId && item.srNo !== undefined && String(item.srNo) === cleanId) {
      return true;
    }

    // 2. Receipt Number
    if (item.receiptNumber && item.receiptNumber.toLowerCase().includes(raw)) return true;

    // 3. Particulars / Remarks
    if (item.particulars && item.particulars.toLowerCase().includes(raw)) return true;
    if (item.remarks && item.remarks.toLowerCase().includes(raw)) return true;

    // 4. Customer Code
    if (item.customerCode && item.customerCode.toLowerCase().includes(raw)) return true;

    // 5. Customer Name
    if (item.customerName && item.customerName.toLowerCase().includes(raw)) return true;

    // 6. Amounts (receivedAmount, netAmount) - string and numeric-cleaned matching
    if (item.receivedAmount !== undefined && String(item.receivedAmount).includes(raw)) return true;
    if (item.netAmount !== undefined && String(item.netAmount).includes(raw)) return true;
    const cleanNum = raw.replace(/[^0-9.]/g, "");
    if (cleanNum && cleanNum.length >= 2) {
      if (item.receivedAmount !== undefined && String(item.receivedAmount).includes(cleanNum)) return true;
      if (item.netAmount !== undefined && String(item.netAmount).includes(cleanNum)) return true;
    }

    // 7. Reference Number
    if (item.referenceNumber && item.referenceNumber.toLowerCase().includes(raw)) return true;

    // 8. Bank Name / Account Number
    if (item.bankName && item.bankName.toLowerCase().includes(raw)) return true;
    if (item.accountNumber && item.accountNumber.toLowerCase().includes(raw)) return true;
    if (item.accountType && item.accountType.toLowerCase().includes(raw)) return true;

    // 9. Gateway Type
    if (item.gatewayType && item.gatewayType.toLowerCase().includes(raw)) return true;

    // 10. Hub
    if (item.hub && item.hub.toLowerCase().includes(raw)) return true;

    // 10b. Calendar / Customer Year
    if (item.calendarYear && item.calendarYear.toLowerCase().includes(raw)) return true;
    if (item.customerYear && item.customerYear.toLowerCase().includes(raw)) return true;

    // 11. Payment Mode / Type
    if (item.paymentMode && item.paymentMode.toLowerCase().includes(raw)) return true;

    // 12. Against Document No
    if (item.againstDocNumber && item.againstDocNumber.toLowerCase().includes(raw)) return true;

    // 13. Status
    if (item.status && item.status.toLowerCase().includes(raw)) return true;

    // 14. Created By
    if (item.createdBy && item.createdBy.toLowerCase().includes(raw)) return true;

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
        matchesQuery = termsToUse.some((term) => matchReceiptFields(item, term));
      }

      const matchesTags = activeTags.every((tag) => {
        const raw = tag.toLowerCase().trim();

        // 1. Payment Type
        const paymentModes = [
          "cash",
          "cheque",
          "online",
          "credit",
          "foc",
          "cod",
          "to_pay",
          "card",
          "prepaid",
          "apple pay",
          "bank_transfer",
        ];
        if (paymentModes.includes(raw) || paymentModes.includes(raw.replace(/\s+/g, "_"))) {
          const itemMode = (item.paymentMode || "").toLowerCase().replace(/_/g, " ");
          const tagMode = raw.replace(/_/g, " ");
          return itemMode === tagMode;
        }

        // 2. Account Type (SAVING A/C, CURRENT A/C, OD A/C, CC A/C, CASH A/C)
        const accountTypeOptions = [
          "saving a/c",
          "current a/c",
          "od a/c",
          "cc a/c",
          "cash a/c",
          "saving",
          "current",
          "od",
          "cc",
          "cash",
          "bank",
        ];
        if (accountTypeOptions.includes(raw) || accountTypeOptions.some((o) => raw.startsWith(o))) {
          const itemAcc = (item.accountType || "").toLowerCase();
          if (itemAcc) {
            return (
              itemAcc === raw ||
              itemAcc.replace(/[\s/._-]/g, "") === raw.replace(/[\s/._-]/g, "") ||
              itemAcc.includes(raw) ||
              raw.includes(itemAcc)
            );
          }
          if (raw.includes("cash")) {
            return (item.paymentMode || "").toLowerCase() === "cash" || (item.bankName || "").toLowerCase().includes("cash");
          }
          return (item.paymentMode || "").toLowerCase() !== "cash";
        }

        // 3. Gateway Type
        const gatewayTypes = ["online gateway", "bank wire", "pos terminal", "counter cash", "cheque clearing"];
        if (gatewayTypes.some((g) => raw.includes(g) || g.includes(raw))) {
          const itemGateway = (item.gatewayType || "").toLowerCase();
          if (itemGateway) return itemGateway.includes(raw) || raw.includes(itemGateway);
          const pMode = (item.paymentMode || "").toLowerCase();
          if (raw.includes("online")) return pMode === "online" || pMode === "apple pay";
          if (raw.includes("wire")) return pMode === "bank_transfer" || (item.referenceNumber || "").toLowerCase().includes("utr");
          if (raw.includes("pos")) return pMode === "card";
          if (raw.includes("cash")) return pMode === "cash";
          if (raw.includes("cheque")) return pMode === "cheque";
          return false;
        }

        // 4. Hub
        const hubList = ["mumbai", "delhi", "karachi", "lahore", "sialkot", "islamabad"];
        if (hubList.includes(raw)) {
          const itemHub = (item.hub || "").toLowerCase();
          if (itemHub) return itemHub === raw;
          const code = (item.customerCode || "").toLowerCase();
          if (raw === "sialkot") return code.includes("skt");
          if (raw === "lahore") return code.includes("lhe");
          if (raw === "karachi") return code.includes("khi");
          if (raw === "islamabad") return code.includes("isb");
          if (raw === "delhi") return code.includes("del");
          if (raw === "mumbai") return code.includes("bom") || code.includes("mum");
          return false;
        }

        // 5. Calendar Year / Customer Year (e.g. 2026, 2025, 2024, 2023, Customer Year, Custom Year)
        if (raw === "customer year" || raw === "custom year") {
          return Boolean(item.customerYear || item.calendarYear || item.receiptDate);
        }
        if (/^\d{4}$/.test(raw)) {
          const itemDate = parseDateString(item.receiptDate);
          if (itemDate) return itemDate.getFullYear() === Number(raw);
          return (
            (item.receiptDate || "").includes(raw) ||
            item.calendarYear === raw ||
            item.customerYear === raw
          );
        }

        // 6. Payment Date Presets
        if (raw === "today" || raw === "yesterday" || raw === "last 7 days" || raw === "this_month" || raw === "this month") {
          const itemDate = parseDateString(item.receiptDate);
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

        // 7. Custom Date Range
        const dateRangeRegex = /^[a-z]{3} \d{1,2}, \d{4} - [a-z]{3} \d{1,2}, \d{4}$/i;
        if (dateRangeRegex.test(raw)) {
          const parts = raw.split(" - ");
          if (parts.length === 2) {
            const start = new Date(parts[0]);
            start.setHours(0, 0, 0, 0);
            const end = new Date(parts[1]);
            end.setHours(23, 59, 59, 999);
            const itemDate = parseDateString(item.receiptDate);
            if (!itemDate) return false;
            return itemDate >= start && itemDate <= end;
          }
        }

        return matchReceiptFields(item, raw);
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

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    const list: string[] = [];
    data.forEach((item) => {
      if (item.srNo) list.push(String(item.srNo));
      if (item.receiptNumber) list.push(item.receiptNumber);
      if (item.customerCode) list.push(item.customerCode);
      if (item.customerName) list.push(item.customerName);
      if (item.particulars) list.push(item.particulars);
      if (item.remarks) list.push(item.remarks);
      if (item.receivedAmount) list.push(String(item.receivedAmount));
      if (item.netAmount) list.push(String(item.netAmount));
      if (item.referenceNumber) list.push(item.referenceNumber);
      if (item.bankName) list.push(item.bankName);
      if (item.hub) list.push(item.hub);
      if (item.accountType) list.push(item.accountType);
      if (item.gatewayType) list.push(item.gatewayType);
      if (item.calendarYear) list.push(item.calendarYear);
      if (item.customerYear) list.push(item.customerYear);
    });

    return Array.from(new Set(list)).filter(Boolean);
  }, [data]);

  // Table Headings Mapping
  const tableHeadings = ReceiptHeading.map((h) => {
    if (h.key === "srNo") {
      return {
        ...h,
        render: (_row: ReceiptEntry, idx?: number) => (
          <span className="font-medium text-axc-dark-gray">
            {idx !== undefined ? idx + 1 : _row.srNo}
          </span>
        ),
      };
    }
    if (h.key === "customerCode") {
      return {
        ...h,
        render: (row: ReceiptEntry) => (
          <span className="font-mono text-xs font-semibold text-axc-navy bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            {row.customerCode}
          </span>
        ),
      };
    }
    if (h.key === "paymentMode") {
      return {
        ...h,
        render: (row: ReceiptEntry) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200 font-mono">
            {(row.paymentMode || "").replace(/_/g, " ")}
          </span>
        ),
      };
    }
    if (h.key === "status") {
      return {
        ...h,
        render: (row: ReceiptEntry) => {
          const status = row.status;
          const badgeClass =
            status === "CLEARED"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : status === "BOUNCED"
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
    if (h.key === "receivedAmount" || h.key === "netAmount") {
      return {
        ...h,
        render: (row: ReceiptEntry) => (
          <span className="font-mono text-xs">
            PKR {Number(row[h.key as "receivedAmount" | "netAmount"]).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        ),
      };
    }
    if (h.key === "selectReceipt") {
      const allSelected =
        paginatedData.length > 0 &&
        paginatedData.every((row) => selectedIds.includes(row.receiptNumber));

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
                    prev.filter((id) => !paginatedData.some((row) => row.receiptNumber === id))
                  );
                } else {
                  setSelectedIds((prev) =>
                    Array.from(new Set([...prev, ...paginatedData.map((row) => row.receiptNumber)]))
                  );
                }
              }}
              className="h-3.5 w-3.5 accent-axc-navy cursor-pointer"
            />
          </div>
        ),
        render: (row: ReceiptEntry) => (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={selectedIds.includes(row.receiptNumber)}
              onChange={() => {
                setSelectedIds((prev) =>
                  prev.includes(row.receiptNumber)
                    ? prev.filter((id) => id !== row.receiptNumber)
                    : [...prev, row.receiptNumber]
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
            groups={receiptFilterGroups}
            selectedOptions={activeTags}
            onOptionsChange={handleTagsChange}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            placeholder="Search by Receipt Number, Customer Code, Particulars, Amount..."
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
          label="New Receipt"
          href="/accounts/receipt/create"
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
          renderActions={(row: ReceiptEntry) => (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/accounts/receipt/create?edit=${encodeURIComponent(row.receiptNumber)}`
                  )
                }
                className="inline-flex items-center justify-center rounded-md border border-axc-dark-green/30 p-1.5 text-axc-dark-green transition hover:bg-axc-dark-green/10 cursor-pointer"
                title="Edit Receipt"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(row)}
                className="inline-flex items-center justify-center rounded-md border border-axc-red-dark/30 p-1.5 text-axc-red-dark transition hover:bg-axc-red-dark/10 cursor-pointer"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        itemName={deleteTarget?.receiptNumber}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={bulkDeleteOpen}
        itemName={`${selectedIds.length} ${selectedIds.length === 1 ? "Receipt" : "Receipts"}`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}
