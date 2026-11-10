"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  PlusCircleIcon,
  FileText,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import CommonTable from "@/app/src/common/table";
import FilterSearch from "@/app/src/common/filtersearch";
import Button from "@/app/src/common/button";
import DeleteConfirmationDialog from "@/app/src/common/deleteConfirmation";
import Dropdown from "@/app/src/common/dropdown";
import { showToast } from "@/app/src/common/toast";
import { api } from "@/app/src/lib/api";
import {
  AwbStateEntry,
  AwbStateHeadings,
  awbStateFilterGroups,
  initialAwbStateData,
} from "./types";

export default function AwbStateMasterPage() {
  const router = useRouter();

  const [data, setData] = useState<AwbStateEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Modals & Action State
  const [viewItem, setViewItem] = useState<AwbStateEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AwbStateEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  // Sorting State
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // API + LocalStorage Persistence
  useEffect(() => {
    let mounted = true;
    api
      .getMasterList<AwbStateEntry>("/awb-states")
      .then((list) => {
        if (!mounted) return;
        if (Array.isArray(list) && list.length > 0) {
          setData(list);
          if (typeof window !== "undefined") {
            localStorage.setItem("master_awb_states", JSON.stringify(list));
          }
          return;
        }
        loadLocalFallback();
      })
      .catch(() => {
        if (mounted) loadLocalFallback();
      });

    function loadLocalFallback() {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("master_awb_states");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setData(parsed);
              return;
            }
          } catch (e) {
            console.error("Error reading stored items:", e);
          }
        }
        setData(initialAwbStateData);
        localStorage.setItem(
          "master_awb_states",
          JSON.stringify(initialAwbStateData)
        );
      }
    }

    return () => {
      mounted = false;
    };
  }, []);

  const saveItems = (newList: AwbStateEntry[]) => {
    setData(newList);
    if (typeof window !== "undefined") {
      localStorage.setItem("master_awb_states", JSON.stringify(newList));
    }
  };

  // Search filter submit
  const handleSearchSubmit = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    if (!activeTags.includes(trimmed)) {
      setActiveTags((prev) => [...prev, trimmed]);
      setSearchQuery("");
      setPage(1);
    }
  };

  const handleTagsChange = (newTags: string[]) => {
    const addedTag = newTags.find((tag) => !activeTags.includes(tag));
    if (addedTag) {
      const group = awbStateFilterGroups.find((g) =>
        g.options.some((o) => o.value === addedTag)
      );
      if (group) {
        const groupValues = group.options.map((o) => o.value);
        const filteredTags = newTags.filter(
          (tag) => tag === addedTag || !groupValues.includes(tag)
        );
        setActiveTags(filteredTags);
        setPage(1);
        return;
      }
    }
    setActiveTags(newTags);
    setPage(1);
  };

  const removeTag = (tagToRemove: string) => {
    setActiveTags((prev) => prev.filter((t) => t !== tagToRemove));
    setPage(1);
  };

  // Search Suggestions
  const searchSuggestions = useMemo(() => {
    const names = data.map((item) => item.stateName).filter(Boolean);
    const locations = data.map((item) => item.eventLocation).filter(Boolean);
    const dateTimes = data.map((item) => item.eventDateTime).filter(Boolean);
    return Array.from(new Set([...names, ...locations, ...dateTimes])) as string[];
  }, [data]);

  // Filtered Data
  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          (item.stateName || "").toLowerCase().includes(q) ||
          (item.eventLocation || "").toLowerCase().includes(q) ||
          (item.eventDateTime || "").toLowerCase().includes(q) ||
          (item.descriptions || []).some((d) => d.toLowerCase().includes(q))
      );
    }

    if (activeTags.length > 0) {
      result = result.filter((item) => {
        return activeTags.every((tag) => {
          if (tag === "ACTIVE" || tag === "INACTIVE") {
            return item.status === tag;
          }
          const q = tag.toLowerCase();
          return (
            (item.stateName || "").toLowerCase().includes(q) ||
            (item.eventLocation || "").toLowerCase().includes(q) ||
            (item.eventDateTime || "").toLowerCase().includes(q) ||
            (item.descriptions || []).some((d) => d.toLowerCase().includes(q))
          );
        });
      });
    }

    if (sortKey) {
      result.sort((a, b) => {
        const aVal = (a as Record<string, any>)[sortKey] ?? "";
        const bVal = (b as Record<string, any>)[sortKey] ?? "";
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sortDirection === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return result;
  }, [data, searchQuery, activeTags, sortKey, sortDirection]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, page]);

  // Bulk Export
  const handleBulkExport = () => {
    const targetData =
      selectedIds.length > 0
        ? data.filter((d) => selectedIds.includes(d.id))
        : data;

    const headers = ["State Name", "Event Date & Time", "Event Location", "Descriptions", "Status"];
    const rows = targetData.map((r) => [
      `"${r.stateName}"`,
      `"${r.eventDateTime}"`,
      `"${r.eventLocation}"`,
      `"${(r.descriptions || []).join(" | ")}"`,
      `"${r.status}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `AWB_States_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      variant: "success",
      message: `Exported ${targetData.length} items successfully.`,
    });
  };

  // Sorting Handler
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Delete Single
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteMasterItem("/awb-states", deleteTarget.id);
    } catch {
      // fallback to local
    }
    const updated = data.filter((d) => String(d.id) !== String(deleteTarget.id));
    saveItems(updated);
    setSelectedIds((prev) => prev.filter((id) => String(id) !== String(deleteTarget.id)));
    setIsDeleting(false);
    setDeleteTarget(null);
    showToast({
      variant: "success",
      message: `AWB State "${deleteTarget.stateName}" has been removed.`,
    });
  };

  // Bulk Delete
  const handleBulkDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await api.bulkDeleteMasterItems("/awb-states", selectedIds);
    } catch {
      // fallback to local
    }
    const updated = data.filter((d) => !selectedIds.map(String).includes(String(d.id)));
    saveItems(updated);
    const count = selectedIds.length;
    setSelectedIds([]);
    setIsDeleting(false);
    setBulkDeleteOpen(false);
    showToast({
      variant: "success",
      message: `${count} items deleted successfully.`,
    });
  };

  // Exact AWB Table Headings mapping
  const tableHeadings = AwbStateHeadings.map((h) => {
    if (h.key === "srNo") {
      return {
        ...h,
        render: (_row: AwbStateEntry, idx?: number) => (
          <span className="font-medium text-axc-dark-gray">
            {idx !== undefined ? (page - 1) * itemsPerPage + idx + 1 : 1}
          </span>
        ),
      };
    }

    if (h.key === "selectState") {
      const allSelected =
        paginatedData.length > 0 &&
        paginatedData.every((row) => selectedIds.includes(row.id));

      return {
        ...h,
        label: (
          <div className="flex flex-row-reverse items-center justify-center gap-1.5">
            <span className="text-xs font-bold capitalize leading-none whitespace-nowrap">
              Select State
            </span>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => {
                if (allSelected) {
                  setSelectedIds((prev) =>
                    prev.filter(
                      (id) => !paginatedData.some((row) => row.id === id)
                    )
                  );
                } else {
                  setSelectedIds((prev) =>
                    Array.from(
                      new Set([...prev, ...paginatedData.map((row) => row.id)])
                    )
                  );
                }
              }}
              className="h-3.5 w-3.5 accent-axc-navy cursor-pointer"
            />
          </div>
        ),
        render: (row: AwbStateEntry) => (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={selectedIds.includes(row.id)}
              onChange={() => {
                setSelectedIds((prev) =>
                  prev.includes(row.id)
                    ? prev.filter((id) => id !== row.id)
                    : [...prev, row.id]
                );
              }}
              className="h-3.5 w-3.5 accent-axc-navy cursor-pointer"
            />
          </div>
        ),
      };
    }

    if (h.key === "stateName") {
      return {
        ...h,
        render: (row: AwbStateEntry) => (
          <span className="font-semibold text-gray-900 text-xs">
            {row.stateName}
          </span>
        ),
      };
    }

    if (h.key === "eventDateTime") {
      return {
        ...h,
        render: (row: AwbStateEntry) => (
          <span className="font-mono text-xs text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
            {row.eventDateTime}
          </span>
        ),
      };
    }

    if (h.key === "eventLocation") {
      return {
        ...h,
        render: (row: AwbStateEntry) => (
          <span className="font-medium text-xs text-axc-navy bg-axc-navy/5 px-2 py-0.5 rounded border border-axc-navy/15">
            {row.eventLocation}
          </span>
        ),
      };
    }

    if (h.key === "descriptions") {
      return {
        ...h,
        render: (row: AwbStateEntry) => {
          const list = row.descriptions || [];
          if (list.length === 0) return <span className="text-gray-400 text-xs">-</span>;
          const first = list[0];
          return (
            <div className="flex items-center gap-1.5 max-w-[280px]">
              <span className="truncate text-xs text-gray-700" title={first}>
                {first}
              </span>
              {list.length > 1 && (
                <span className="shrink-0 text-[10px] bg-gray-100 text-gray-600 font-semibold px-1.5 py-0.2 rounded border border-gray-200">
                  +{list.length - 1}
                </span>
              )}
            </div>
          );
        },
      };
    }

    if (h.key === "status") {
      return {
        ...h,
        render: (row: AwbStateEntry) => {
          const isActive = row.status === "ACTIVE";
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border whitespace-nowrap ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-600 border-red-200"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isActive ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              {row.status}
            </span>
          );
        },
      };
    }

    return h;
  });

  return (
    <div className="relative bg-white p-4 rounded-lg w-full flex-1 flex flex-col min-h-0 shadow-sm border border-axc-border overflow-x-hidden overflow-y-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-axc-gray/40 [&::-webkit-scrollbar-thumb]:rounded-lg">
      {/* ═══════════ TOP CONTROLS BAR (EXACT AWB LAYOUT) ═══════════ */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          <FilterSearch
            groups={awbStateFilterGroups}
            selectedOptions={activeTags}
            onOptionsChange={handleTagsChange}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            placeholder="Search AWB states..."
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
                    {
                      label: "Export",
                      icon: <FileText className="h-4 w-4" />,
                      onClick: handleBulkExport,
                    },
                    {
                      label: "Delete",
                      icon: <Trash2 className="h-4 w-4" />,
                      onClick: () => {
                        if (selectedIds.length === 0) {
                          showToast({
                            variant: "error",
                            message: "Please select at least one item to delete.",
                          });
                          return;
                        }
                        setBulkDeleteOpen(true);
                      },
                    },
                  ]}
                />
              </div>
            </>
          )}
        </div>

        <Button
          label="New AWB State"
          href="/master/awb-state/create"
          variant="primary"
          icon={PlusCircleIcon}
        />
      </div>

      {/* ═══════════ ACTIVE FILTER TAGS (EXACT AWB STYLE) ═══════════ */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pb-3 border-b border-gray-100 mb-3 shrink-0">
          <span className="text-xs text-gray-500 font-medium mr-1">Active Filters:</span>
          {activeTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-axc-navy/10 text-axc-navy font-medium border border-axc-navy/20"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-red-500 transition-colors ml-0.5 cursor-pointer"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => setActiveTags([])}
            className="text-xs text-axc-gray hover:text-axc-navy underline transition cursor-pointer ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ═══════════ COMMON TABLE (EXACT AWB STYLE) ═══════════ */}
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
          renderActions={(row: AwbStateEntry) => (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewItem(row)}
                className="inline-flex items-center justify-center rounded-md border border-axc-navy/30 p-1.5 text-axc-navy transition hover:bg-axc-navy/10 cursor-pointer"
                title="View"
              >
                <Eye size={16} />
              </button>
              <button
                type="button"
                onClick={() =>
                  router.push(`/master/awb-state/create?id=${row.id}`)
                }
                className="inline-flex items-center justify-center rounded-md border border-axc-dark-green/30 p-1.5 text-axc-dark-green transition hover:bg-axc-dark-green/10 cursor-pointer"
                title="Edit"
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

      {/* ═══════════ VIEW DETAILS MODAL ═══════════ */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg border border-gray-200 overflow-hidden">
            <div className="bg-axc-navy/90 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-semibold text-sm">AWB State Details</h3>
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="text-white/80 hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
                  <span className="text-gray-400 font-medium block mb-1">State Name</span>
                  <span className="font-semibold text-gray-900">{viewItem.stateName}</span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
                  <span className="text-gray-400 font-medium block mb-1">Status</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                      viewItem.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {viewItem.status}
                  </span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
                  <span className="text-gray-400 font-medium block mb-1">Event Date & Time</span>
                  <span className="font-medium text-gray-800 font-mono">{viewItem.eventDateTime}</span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
                  <span className="text-gray-400 font-medium block mb-1">Event Location</span>
                  <span className="font-medium text-axc-navy">{viewItem.eventLocation}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-500 font-semibold block mb-2">Event Descriptions:</span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {(viewItem.descriptions || []).map((desc, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 bg-gray-50 p-2 rounded border border-gray-200"
                    >
                      <span className="text-[10px] font-bold text-axc-navy bg-white border border-axc-navy/30 rounded-full h-4 w-4 flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 leading-relaxed text-xs">{desc}</span>
                    </div>
                  ))}
                  {(!viewItem.descriptions || viewItem.descriptions.length === 0) && (
                    <span className="text-gray-400 italic">No descriptions provided.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="px-4 py-1.5 bg-axc-navy text-white text-xs font-medium rounded hover:bg-axc-navy/90 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ DELETE CONFIRMATION (SINGLE) ═══════════ */}
      {deleteTarget && (
        <DeleteConfirmationDialog
          isOpen={true}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          itemName={deleteTarget.stateName}
          isLoading={isDeleting}
        />
      )}

      {/* ═══════════ DELETE CONFIRMATION (BULK) ═══════════ */}
      {bulkDeleteOpen && (
        <DeleteConfirmationDialog
          isOpen={true}
          onCancel={() => setBulkDeleteOpen(false)}
          onConfirm={handleBulkDeleteConfirm}
          itemName={`${selectedIds.length} selected AWB states`}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
