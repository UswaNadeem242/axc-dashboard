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
  X,
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
  const [viewTarget, setViewTarget] = useState<AccountEntry | null>(null);

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

  // LocalStorage Persistence
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("account_entries");
      if (stored) {
        try {
          const parsed: AccountEntry[] = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setData(parsed);
            return;
          }
        } catch (e) {
          console.error("Failed to parse account_entries from localStorage", e);
        }
      }
      setData(initialAccountData);
      localStorage.setItem("account_entries", JSON.stringify(initialAccountData));
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
      "Party Type",
      "Customer / Vendor",
      "Ref Doc Number",
      "Original Amount",
      "Adjustment Total",
      "Reason",
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
          `"${r.partyType || ""}"`,
          `"${r.partyName || ""}"`,
          `"${r.refDocNumber || ""}"`,
          r.originalAmount || 0,
          r.grandTotal || 0,
          `"${r.reason || ""}"`,
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

  const handleView = (row: AccountEntry) => {
    setViewTarget(row);
  };

  // Search filter
  const filteredData = data.filter((item) => {
    const q = searchQuery.trim().toLowerCase();

    let matchesQuery = true;
    if (q) {
      const fields = [
        item.noteNumber,
        item.noteType,
        item.partyName,
        item.partyCode,
        item.partyGstin,
        item.refDocNumber,
        item.reason,
        item.status,
        item.createdBy,
        item.branch,
        String(item.grandTotal),
      ];
      matchesQuery = fields.some((f) => f !== undefined && f !== null && String(f).toLowerCase().includes(q));
    }

    const matchesTags = activeTags.every((tag) => {
      const raw = tag.toLowerCase().trim();

      if (raw === "credit note") return item.noteType.toLowerCase() === "credit note";
      if (raw === "debit note") return item.noteType.toLowerCase() === "debit note";
      if (raw === "customer") return item.partyType.toLowerCase() === "customer";
      if (raw === "vendor") return item.partyType.toLowerCase() === "vendor";

      if (["approved", "pending", "draft", "adjusted"].includes(raw)) {
        return item.status.toLowerCase() === raw;
      }

      if (raw === "today" || raw === "yesterday" || raw === "last 7 days") {
        const [d, m, y] = item.noteDate.split("/");
        if (!d || !m || !y) return false;
        const noteDate = new Date(Number(y), Number(m) - 1, Number(d));
        noteDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);

        if (raw === "today") return noteDate.getTime() === today.getTime();
        if (raw === "yesterday") return noteDate.getTime() === yesterday.getTime();
        if (raw === "last 7 days") return noteDate >= last7Days && noteDate <= today;
      }

      return (
        item.noteNumber.toLowerCase().includes(raw) ||
        item.partyName.toLowerCase().includes(raw) ||
        item.refDocNumber.toLowerCase().includes(raw) ||
        item.reason.toLowerCase().includes(raw)
      );
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

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    const list: string[] = [];
    data.forEach((item) => {
      if (item.noteNumber) list.push(item.noteNumber);
      if (item.partyName) list.push(item.partyName);
      if (item.partyCode) list.push(item.partyCode);
      if (item.refDocNumber) list.push(item.refDocNumber);
      if (item.reason) list.push(item.reason);
      if (item.branch) list.push(item.branch);
      if (item.createdBy) list.push(item.createdBy);
    });
    return Array.from(new Set(list)).filter(Boolean);
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
            placeholder="Search entries..."
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

      {/* View Modal */}
      {viewTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity animate-in fade-in"
          onClick={() => setViewTarget(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/70">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-base font-bold text-axc-dark-gray flex items-center gap-2">
                    {viewTarget.noteNumber}
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-axc-navy/10 text-axc-navy">
                      {viewTarget.noteType}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Date: {viewTarget.noteDate} &bull; Created by {viewTarget.createdBy}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewTarget(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100 text-xs">
                <div>
                  <p className="text-gray-400 font-semibold uppercase text-[10px]">
                    {viewTarget.partyType} Information
                  </p>
                  <p className="font-bold text-sm text-axc-dark-gray mt-0.5">
                    {viewTarget.partyName}
                  </p>
                  <p className="text-gray-500 font-mono text-[11px]">{viewTarget.partyCode}</p>
                  {viewTarget.partyGstin && (
                    <p className="text-gray-500">GST/Tax: {viewTarget.partyGstin}</p>
                  )}
                  {viewTarget.partyEmail && (
                    <p className="text-gray-500">{viewTarget.partyEmail}</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-400 font-semibold uppercase text-[10px]">
                    Reference Document
                  </p>
                  <p className="font-bold text-sm text-axc-dark-gray mt-0.5">
                    {viewTarget.refDocType}: {viewTarget.refDocNumber}
                  </p>
                  {viewTarget.refDocDate && (
                    <p className="text-gray-500">Doc Date: {viewTarget.refDocDate}</p>
                  )}
                  <p className="text-gray-500">
                    Original Amount: PKR {Number(viewTarget.originalAmount).toLocaleString()}
                  </p>
                  <p className="text-gray-500">Branch: {viewTarget.branch || "General"}</p>
                </div>
              </div>

              {viewTarget.items && viewTarget.items.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Line Adjustment Items
                  </h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                        <tr>
                          <th className="p-2.5">Description</th>
                          <th className="p-2.5 text-right">Original</th>
                          <th className="p-2.5 text-right">Adjustment</th>
                          <th className="p-2.5 text-right">Tax (18%)</th>
                          <th className="p-2.5 text-right font-bold">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {viewTarget.items.map((it) => (
                          <tr key={it.id}>
                            <td className="p-2.5 font-medium text-axc-dark-gray">
                              {it.description}
                            </td>
                            <td className="p-2.5 text-right text-gray-500 font-mono">
                              PKR {Number(it.originalAmount).toLocaleString()}
                            </td>
                            <td className="p-2.5 text-right font-mono text-axc-dark-gray">
                              PKR {Number(it.adjustmentAmount).toLocaleString()}
                            </td>
                            <td className="p-2.5 text-right font-mono text-gray-500">
                              PKR {Number(it.taxAmount).toLocaleString()}
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold text-axc-navy">
                              PKR {Number(it.total).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-100 pt-3 text-xs space-y-2">
                <div>
                  <span className="font-semibold text-gray-600">Reason: </span>
                  <span className="text-axc-dark-gray font-medium">{viewTarget.reason}</span>
                </div>
                {viewTarget.remarks && (
                  <div>
                    <span className="font-semibold text-gray-600">Remarks: </span>
                    <span className="text-gray-500">{viewTarget.remarks}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <div className="w-64 rounded-lg bg-gray-50 p-3 border border-gray-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Taxable Amount:</span>
                    <span className="font-mono">
                      PKR {Number(viewTarget.taxableAmount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax / GST:</span>
                    <span className="font-mono">
                      PKR {Number(viewTarget.taxAmount).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-sm text-axc-navy">
                    <span>Adjustment Total:</span>
                    <span className="font-mono">
                      PKR {Number(viewTarget.grandTotal).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-3 bg-gray-50">
              <button
                type="button"
                onClick={() => setViewTarget(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = viewTarget;
                  setViewTarget(null);
                  handleEdit(target);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-axc-navy text-white hover:bg-axc-navy/90 cursor-pointer flex items-center gap-1.5"
              >
                <Pencil size={13} />
                Edit Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
