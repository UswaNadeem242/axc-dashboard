"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  PlusCircleIcon,
  FileText,
  Eye,
  Pencil,
  Trash2,
  Printer,
  X,
  Building2,
} from "lucide-react";
import CommonTable from "@/app/src/common/table";
import FilterSearch from "@/app/src/common/filtersearch";
import Button from "@/app/src/common/button";
import DeleteConfirmationDialog from "@/app/src/common/deleteConfirmation";
import Dropdown from "@/app/src/common/dropdown";
import CustomDatePicker from "@/app/src/common/datepicker";
import { showToast } from "@/app/src/common/toast";
import { api } from "@/app/src/lib/api";
import { invalidateMasterDataCache } from "@/app/src/lib/useMasterData";
import {
  PanelHeader,
  FieldLabel,
  FieldError,
  inputClass,
  errorInputClass,
} from "@/app/create-entries/components/form";

export interface MasterFieldConfig {
  key: string;
  label: string;
  type?: "text" | "number" | "email" | "date" | "select" | "textarea" | "checkbox" | "status" | "json";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  colSpan?: 1 | 2 | 3;
  uppercase?: boolean;
  mono?: boolean;
  defaultValue?: any;
}

export interface MasterColumnConfig {
  key: string;
  label: string;
  sortable?: boolean;
  badge?: "code" | "status" | "blue" | "mono" | "boolean";
}

export interface MasterModuleConfig<T extends Record<string, any> = Record<string, any>> {
  title: string;
  singularTitle: string;
  panelTitle: string;
  endpoint: string;
  storageKey: string;
  basePath: string;
  primaryKeyField: string;
  secondaryKeyField?: string;
  statusCase?: "UPPER" | "TITLE";
  columns: MasterColumnConfig[];
  fields: MasterFieldConfig[];
  filterGroups: {
    group: string;
    options: { value: string; label: string }[];
  }[];
  initialData: T[];
}

export function StandardMasterListPage<T extends Record<string, any>>({
  config,
}: {
  config: MasterModuleConfig<T>;
}) {
  const router = useRouter();
  const [data, setData] = useState<T[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const [viewItem, setViewItem] = useState<T | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const list = await api.getMasterList<T>(config.endpoint, { per_page: 200 });
        if (mounted && Array.isArray(list) && list.length > 0) {
          setData(list);
          if (typeof window !== "undefined") {
            localStorage.setItem(config.storageKey, JSON.stringify(list));
          }
          return;
        }
      } catch (e) {
        console.warn(`Using local fallback for ${config.endpoint}:`, e);
      }
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(config.storageKey);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              if (mounted) setData(parsed);
              return;
            }
          } catch (e) {
            console.error(`Error reading stored ${config.storageKey}:`, e);
          }
        }
        if (mounted) {
          setData(config.initialData);
          localStorage.setItem(config.storageKey, JSON.stringify(config.initialData));
        }
      }
    };
    loadData();
    return () => {
      mounted = false;
    };
  }, [config.endpoint, config.storageKey, config.initialData]);

  const saveItems = (newList: T[]) => {
    setData(newList);
    if (typeof window !== "undefined") {
      localStorage.setItem(config.storageKey, JSON.stringify(newList));
    }
  };

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
      const group = config.filterGroups.find((g) =>
        g.options.some((o) => o.value === addedTag)
      );
      if (group) {
        const otherOptions = group.options
          .map((o) => o.value)
          .filter((v) => v !== addedTag);
        const filteredTags = newTags.filter((tag) => !otherOptions.includes(tag));
        setActiveTags(filteredTags);
        setPage(1);
        return;
      }
    }
    setActiveTags(newTags);
    setPage(1);
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery = Object.values(item).some((val) =>
          String(val ?? "")
            .toLowerCase()
            .includes(q)
        );
        if (!matchesQuery) return false;
      }

      if (activeTags.length > 0) {
        return activeTags.every((tag) => {
          const tLower = tag.toLowerCase();
          return Object.values(item).some(
            (val) =>
              String(val ?? "") === tag ||
              String(val ?? "")
                .toLowerCase()
                .includes(tLower)
          );
        });
      }

      return true;
    });
  }, [data, searchQuery, activeTags]);

  const sortedData = useMemo(() => {
    if (!sortKey) {
      return [...filteredData].sort((a, b) => {
        const rawDateA = a.createdAt || a.created_at || a.createdDate;
        const rawDateB = b.createdAt || b.created_at || b.createdDate;
        const dateA = rawDateA ? new Date(rawDateA).getTime() : 0;
        const dateB = rawDateB ? new Date(rawDateB).getTime() : 0;
        if (dateA && dateB && dateA !== dateB) return dateB - dateA;

        const idA = Number(a.id) || 0;
        const idB = Number(b.id) || 0;
        if (idA && idB && idA !== idB) return idB - idA;

        return String(b.id || "").localeCompare(String(a.id || ""));
      });
    }
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey] ?? "";
      const valB = b[sortKey] ?? "";
      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return sortDirection === "asc"
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  }, [filteredData, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, page, itemsPerPage]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const searchSuggestions = useMemo(() => {
    const values: string[] = [];
    data.forEach((item) => {
      const p = item[config.primaryKeyField];
      const s = config.secondaryKeyField ? item[config.secondaryKeyField] : undefined;
      if (p) values.push(String(p));
      if (s) values.push(String(s));
    });
    return Array.from(new Set(values));
  }, [data, config.primaryKeyField, config.secondaryKeyField]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteMasterItem(config.endpoint, deleteTarget.id);
    } catch (e) {
      console.warn("API delete fallback to local:", e);
    }
    const updated = data.filter((c) => c.id !== deleteTarget.id);
    saveItems(updated);
    setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
    setIsDeleting(false);
    const label = deleteTarget[config.primaryKeyField] || deleteTarget.id;
    setDeleteTarget(null);
    showToast({
      variant: "success",
      message: `${config.singularTitle} "${label}" deleted successfully.`,
    });
  };

  const handleBulkDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await api.bulkDeleteMasterItems(config.endpoint, selectedIds);
    } catch (e) {
      console.warn("API bulk delete fallback to local:", e);
    }
    const updated = data.filter((c) => !selectedIds.includes(c.id));
    saveItems(updated);
    const count = selectedIds.length;
    setSelectedIds([]);
    setIsDeleting(false);
    setBulkDeleteOpen(false);
    showToast({
      variant: "success",
      message: `${count} ${config.title.toLowerCase()} records deleted successfully.`,
    });
  };

  const handleBulkExport = () => {
    const exportItems =
      selectedIds.length > 0
        ? data.filter((c) => selectedIds.includes(c.id))
        : data;

    if (exportItems.length === 0) {
      showToast({ variant: "error", message: `No ${config.title.toLowerCase()} available to export.` });
      return;
    }

    const exportCols = config.columns.filter((c) => c.key !== "srNo" && c.key !== "action");
    const headers = exportCols.map((c) => c.label);
    const csvRows = exportItems.map((item) =>
      exportCols.map((c) => `"${String(item[c.key] ?? "").replace(/"/g, '""')}"`)
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...csvRows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${config.title.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      variant: "success",
      message: `Exported ${exportItems.length} ${config.title.toLowerCase()} records to CSV.`,
    });
  };

  const rawColumns = config.columns.some((c) => c.key === "action")
    ? config.columns
    : [...config.columns, { key: "action", label: "Action" }];

  const tableHeadings = rawColumns.map((h) => {
    if (h.key === "action") {
      return {
        ...h,
        render: (row: T) => (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setViewItem(row)}
              title="View"
              className="inline-flex items-center justify-center rounded-md border border-axc-navy/30 p-1.5 text-axc-navy transition hover:bg-axc-navy/10 cursor-pointer"
            >
              <Eye size={15} />
            </button>
            <button
              type="button"
              onClick={() =>
                router.push(`${config.basePath}/create?edit=${row.id}`)
              }
              title="Edit"
              className="inline-flex items-center justify-center rounded-md border border-axc-dark-green/30 p-1.5 text-axc-dark-green transition hover:bg-axc-dark-green/10 cursor-pointer"
            >
              <Pencil size={15} />
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget(row)}
              title="Delete"
              className="inline-flex items-center justify-center rounded-md border border-axc-red-dark/30 p-1.5 text-axc-red-dark transition hover:bg-axc-red-dark/10 cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ),
      };
    }
    if (h.key === "srNo") {
      return {
        ...h,
        render: (_: any, idx?: number) => (
          <span className="text-gray-500 font-medium">
            {idx !== undefined ? idx + 1 : (page - 1) * itemsPerPage + 1}
          </span>
        ),
      };
    }
    if (h.badge === "code") {
      return {
        ...h,
        render: (row: T) => (
          <span className="font-semibold text-axc-navy bg-axc-navy/5 px-2.5 py-1 rounded text-xs">
            {row[h.key] || "-"}
          </span>
        ),
      };
    }
    if (h.badge === "blue") {
      return {
        ...h,
        render: (row: T) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
            {row[h.key] || "-"}
          </span>
        ),
      };
    }
    if (h.badge === "mono") {
      return {
        ...h,
        render: (row: T) => (
          <span className="font-mono text-xs text-gray-700">{row[h.key] ?? "-"}</span>
        ),
      };
    }
    if (h.badge === "boolean") {
      return {
        ...h,
        render: (row: T) => (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
              row[h.key]
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-gray-100 text-gray-600 border border-gray-200"
            }`}
          >
            {row[h.key] ? "Yes" : "No"}
          </span>
        ),
      };
    }
    if (h.badge === "status" || h.key === "status") {
      return {
        ...h,
        render: (row: T) => {
          const isActive = String(row[h.key] || "").toUpperCase() === "ACTIVE";
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
              {row[h.key] || "Active"}
            </span>
          );
        },
      };
    }
    if (h.key === config.primaryKeyField) {
      return {
        ...h,
        render: (row: T) => (
          <span className="font-semibold text-gray-900">{row[h.key] || "-"}</span>
        ),
      };
    }
    return {
      ...h,
      render: (row: T) => {
        const val = row[h.key];
        if (val === null || val === undefined || val === "") return <span className="text-gray-400">-</span>;
        if (typeof val === "object") return <span className="font-mono text-xs text-gray-600">{JSON.stringify(val)}</span>;
        return <span className="text-gray-700">{String(val)}</span>;
      },
    };
  });

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Top Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 shrink-0">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            <FilterSearch
              groups={config.filterGroups}
              selectedOptions={activeTags}
              onOptionsChange={handleTagsChange}
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchSubmit={handleSearchSubmit}
              placeholder={`Search ${config.title}...`}
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
                        label: "Export CSV",
                        icon: <FileText className="h-4 w-4" />,
                        onClick: handleBulkExport,
                      },
                      {
                        label: "Print List",
                        icon: <Printer className="h-4 w-4" />,
                        onClick: () => window.print(),
                      },
                      {
                        label: "Delete",
                        icon: <Trash2 className="h-4 w-4 text-red-500" />,
                        onClick: () => setBulkDeleteOpen(true),
                      },
                    ]}
                  />
                </div>
              </>
            )}
          </div>

          <Button
            label={`New ${config.singularTitle}`}
            href={`${config.basePath}/create`}
            variant="primary"
            icon={PlusCircleIcon}
          />
        </div>

        {/* Active Filter Tags */}
        {activeTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-3 shrink-0">
            {activeTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-axc-navy/20 bg-axc-navy/5 text-axc-navy"
              >
                {tag}
                <button
                  type="button"
                  onClick={() =>
                    setActiveTags((prev) => prev.filter((t) => t !== tag))
                  }
                  className="hover:text-red-500 transition cursor-pointer"
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

        {/* Common Table */}
        <div className="flex-1 min-h-0 flex flex-col">
          <CommonTable
            headings={tableHeadings}
            data={paginatedData}
            currentPage={page}
            totalPages={totalPages}
            totalCount={sortedData.length}
            onPageChange={setPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(newSize) => {
              setItemsPerPage(newSize);
              setPage(1);
            }}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            selectable={true}
            rowKey="id"
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            showScroll={true}
            emptyMessage={`No ${config.title.toLowerCase()} records found`}
            renderActions={(row: T) => (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewItem(row)}
                  title="View"
                  className="inline-flex items-center justify-center rounded-md border border-axc-navy/30 p-1.5 text-axc-navy transition hover:bg-axc-navy/10 cursor-pointer"
                >
                  <Eye size={15} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    router.push(`${config.basePath}/create?edit=${row.id}`)
                  }
                  title="Edit"
                  className="inline-flex items-center justify-center rounded-md border border-axc-dark-green/30 p-1.5 text-axc-dark-green transition hover:bg-axc-dark-green/10 cursor-pointer"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(row)}
                  title="Delete"
                  className="inline-flex items-center justify-center rounded-md border border-axc-red-dark/30 p-1.5 text-axc-red-dark transition hover:bg-axc-red-dark/10 cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}
          />
        </div>
      </div>

      {/* View Details Modal */}
      {viewItem && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setViewItem(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl border border-axc-border max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-axc-border mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-axc-navy/10 text-axc-navy rounded-lg">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-axc-dark-gray">
                    {String(viewItem[config.primaryKeyField] || config.singularTitle)}
                  </h3>
                  {config.secondaryKeyField && viewItem[config.secondaryKeyField] && (
                    <span className="text-xs font-semibold text-axc-navy">
                      {String(viewItem[config.secondaryKeyField])}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {config.fields.map((field) => {
                const rawVal = viewItem[field.key];
                const displayVal =
                  typeof rawVal === "boolean"
                    ? rawVal
                      ? "Yes"
                      : "No"
                    : typeof rawVal === "object" && rawVal !== null
                    ? JSON.stringify(rawVal)
                    : rawVal || "-";
                return (
                  <div
                    key={field.key}
                    className={`flex flex-col gap-1 p-2.5 rounded-lg bg-gray-50 ${
                      field.colSpan === 3 || field.colSpan === 2 ? "sm:col-span-2" : ""
                    }`}
                  >
                    <span className="text-gray-400 font-medium">{field.label}</span>
                    <span className="font-semibold text-gray-800 break-words">
                      {String(displayVal)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2.5 mt-5 pt-3 border-t border-axc-border">
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="px-4 py-2 rounded-lg border border-axc-border text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = viewItem.id;
                  setViewItem(null);
                  router.push(`${config.basePath}/create?edit=${id}`);
                }}
                className="px-4 py-2 rounded-lg bg-axc-navy text-xs font-semibold text-white hover:bg-axc-navy/90 transition cursor-pointer"
              >
                Edit {config.singularTitle}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        itemName={
          deleteTarget
            ? String(deleteTarget[config.primaryKeyField] || deleteTarget.id)
            : ""
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />

      {/* Bulk Delete Dialog */}
      <DeleteConfirmationDialog
        isOpen={bulkDeleteOpen}
        itemName={`${selectedIds.length} ${
          selectedIds.length === 1
            ? config.singularTitle.toLowerCase()
            : config.title.toLowerCase()
        }`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}

function StandardCreateFormContent<T extends Record<string, any>>({
  config,
}: {
  config: MasterModuleConfig<T>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEdit = Boolean(editId);

  const initialFormState = useMemo(() => {
    const state: Record<string, any> = {};
    config.fields.forEach((f) => {
      if (f.defaultValue !== undefined) {
        state[f.key] = f.defaultValue;
      } else if (f.type === "checkbox") {
        state[f.key] = false;
      } else if (f.type === "status") {
        state[f.key] = config.statusCase === "UPPER" ? "ACTIVE" : "Active";
      } else {
        state[f.key] = "";
      }
    });
    return state;
  }, [config.fields, config.statusCase]);

  const [form, setForm] = useState<Record<string, any>>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!editId || typeof window === "undefined") return;
    const applyFound = (found: Record<string, any>) => {
      const nextState: Record<string, any> = { ...initialFormState };
      config.fields.forEach((f) => {
        const val = found[f.key];
        if (val !== undefined && val !== null) {
          if (f.type === "json" && typeof val === "object") {
            nextState[f.key] = JSON.stringify(val);
          } else if (f.type === "checkbox") {
            nextState[f.key] = Boolean(val);
          } else {
            nextState[f.key] = String(val);
          }
        }
      });
      setForm(nextState);
    };

    const loadItem = async () => {
      try {
        const item = await api.getMasterItem<T>(config.endpoint, editId);
        if (item && (item.id || item[config.primaryKeyField])) {
          applyFound(item);
          return;
        }
      } catch (e) {
        console.warn(`API get ${config.endpoint} fallback to localStorage:`, e);
      }
      try {
        const stored = localStorage.getItem(config.storageKey);
        const list: T[] = stored ? JSON.parse(stored) : config.initialData;
        const found = list.find(
          (c) =>
            String(c.id) === String(editId) ||
            String(c[config.primaryKeyField]) === String(editId)
        );
        if (found) applyFound(found);
      } catch (e) {
        console.error(`Error loading ${config.singularTitle} for edit:`, e);
      }
    };
    loadItem();
  }, [editId, config, initialFormState]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    config.fields.forEach((f) => {
      if (f.required) {
        const val = form[f.key];
        if (val === undefined || val === null || String(val).trim() === "") {
          e[f.key] = `${f.label} is required.`;
        }
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      showToast({
        variant: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    setLoading(true);
    try {
      const payload: Record<string, any> = {};
      config.fields.forEach((f) => {
        const raw = form[f.key];
        if (f.type === "number") {
          payload[f.key] = raw === "" || raw === null || raw === undefined ? 0 : Number(raw);
        } else if (f.type === "checkbox") {
          payload[f.key] = Boolean(raw);
        } else if (f.type === "json") {
          if (typeof raw === "string" && raw.trim()) {
            try {
              payload[f.key] = JSON.parse(raw);
            } catch {
              payload[f.key] = raw.split(",").map((s) => s.trim()).filter(Boolean);
            }
          } else {
            payload[f.key] = [];
          }
        } else {
          payload[f.key] = typeof raw === "string" ? raw.trim() : raw;
        }
      });

      const stored = localStorage.getItem(config.storageKey);
      const currentList: T[] = stored ? JSON.parse(stored) : [...config.initialData];

      if (isEdit && editId) {
        let savedItem: T | null = null;
        try {
          savedItem = await api.updateMasterItem<T>(config.endpoint, editId, payload);
        } catch (e) {
          console.warn(`API update ${config.endpoint} fallback to local:`, e);
        }
        const updatedList = currentList.map((item) => {
          if (
            String(item.id) === String(editId) ||
            String(item[config.primaryKeyField]) === String(editId)
          ) {
            return (savedItem || {
              ...item,
              ...payload,
            }) as T;
          }
          return item;
        });
        localStorage.setItem(config.storageKey, JSON.stringify(updatedList));
        showToast({
          variant: "success",
          message: `${config.singularTitle} "${payload[config.primaryKeyField] || ""}" updated successfully!`,
        });
      } else {
        let createdItem: T | null = null;
        try {
          createdItem = await api.createMasterItem<T>(config.endpoint, payload);
        } catch (e) {
          console.warn(`API create ${config.endpoint} fallback to local:`, e);
        }
        const newItem = (createdItem || {
          id: `${config.singularTitle.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
          srNo: currentList.length + 1,
          ...payload,
          createdAt: new Date().toISOString().split("T")[0],
        }) as T;
        const updatedList = [newItem, ...currentList];
        localStorage.setItem(config.storageKey, JSON.stringify(updatedList));
        showToast({
          variant: "success",
          message: `${config.singularTitle} "${payload[config.primaryKeyField] || ""}" created successfully!`,
        });
      }

      invalidateMasterDataCache();

      setTimeout(() => {
        router.push(config.basePath);
      }, 400);
    } catch (err) {
      console.error(`Failed to save ${config.singularTitle}:`, err);
      showToast({
        variant: "error",
        message: `Failed to save ${config.singularTitle.toLowerCase()}. Please try again.`,
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full pb-6">
            <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col">
              <PanelHeader
                title={
                  isEdit ? `${config.panelTitle} (Edit)` : config.panelTitle
                }
              />

              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
                {config.fields.map((field) => {
                  const colSpanClass =
                    field.colSpan === 3
                      ? "sm:col-span-2 lg:col-span-3"
                      : field.colSpan === 2
                      ? "sm:col-span-2"
                      : "";

                  if (field.type === "select") {
                    return (
                      <div key={field.key} className={`flex flex-col gap-1 ${colSpanClass}`}>
                        <FieldLabel required={field.required}>{field.label}</FieldLabel>
                        <Dropdown
                          value={String(form[field.key] ?? "")}
                          onChange={(val) => {
                            setForm((prev) => ({ ...prev, [field.key]: val }));
                            if (errors[field.key]) {
                              setErrors((prev) => ({ ...prev, [field.key]: "" }));
                            }
                          }}
                          className={
                            errors[field.key]
                              ? "!border-red-400 !bg-red-50/40"
                              : "border-axc-border"
                          }
                          placeholder={field.placeholder || `Select ${field.label}...`}
                          options={field.options || []}
                        />
                        <FieldError message={errors[field.key]} />
                      </div>
                    );
                  }

                  if (field.type === "date") {
                    return (
                      <div key={field.key} className={`flex flex-col gap-1 ${colSpanClass}`}>
                        <FieldLabel required={field.required}>{field.label}</FieldLabel>
                        <CustomDatePicker
                          value={String(form[field.key] ?? "")}
                          onChange={(val) => {
                            setForm((prev) => ({ ...prev, [field.key]: val }));
                            if (errors[field.key]) {
                              setErrors((prev) => ({ ...prev, [field.key]: "" }));
                            }
                          }}
                          placeholder={field.placeholder || "yyyy-mm-dd"}
                        />
                        <FieldError message={errors[field.key]} />
                      </div>
                    );
                  }

                  if (field.type === "textarea" || field.type === "json") {
                    return (
                      <div key={field.key} className={`flex flex-col gap-1 ${colSpanClass}`}>
                        <FieldLabel required={field.required}>{field.label}</FieldLabel>
                        <textarea
                          rows={3}
                          value={String(form[field.key] ?? "")}
                          placeholder={field.placeholder || `Enter ${field.label}...`}
                          onChange={(e) => {
                            setForm((prev) => ({ ...prev, [field.key]: e.target.value }));
                            if (errors[field.key]) {
                              setErrors((prev) => ({ ...prev, [field.key]: "" }));
                            }
                          }}
                          className={`${
                            errors[field.key] ? errorInputClass : inputClass
                          } text-regular-small resize-y min-h-[76px]`}
                        />
                        <FieldError message={errors[field.key]} />
                      </div>
                    );
                  }

                  if (field.type === "checkbox") {
                    return (
                      <div key={field.key} className={`flex flex-col gap-1 justify-end pb-2 ${colSpanClass}`}>
                        <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={Boolean(form[field.key])}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                [field.key]: e.target.checked,
                              }))
                            }
                            className="h-4 w-4 rounded border-gray-300 accent-axc-navy cursor-pointer"
                          />
                          <span className="text-regular-small font-medium text-axc-dark-gray">
                            {field.label}
                          </span>
                        </label>
                      </div>
                    );
                  }

                  if (field.type === "status") {
                    const activeVal = config.statusCase === "UPPER" ? "ACTIVE" : "Active";
                    const inactiveVal = config.statusCase === "UPPER" ? "INACTIVE" : "Inactive";
                    return (
                      <div key={field.key} className={`flex flex-col gap-1 ${colSpanClass}`}>
                        <FieldLabel required={field.required}>{field.label}</FieldLabel>
                        <div className="flex items-center gap-6 pt-2">
                          <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-axc-dark-gray">
                            <input
                              type="radio"
                              name={field.key}
                              checked={
                                String(form[field.key] || activeVal).toUpperCase() === "ACTIVE"
                              }
                              onChange={() =>
                                setForm((prev) => ({ ...prev, [field.key]: activeVal }))
                              }
                              className="h-4 w-4 accent-axc-navy cursor-pointer"
                            />
                            {activeVal}
                          </label>
                          <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-axc-dark-gray">
                            <input
                              type="radio"
                              name={field.key}
                              checked={
                                String(form[field.key] || "").toUpperCase() === "INACTIVE"
                              }
                              onChange={() =>
                                setForm((prev) => ({ ...prev, [field.key]: inactiveVal }))
                              }
                              className="h-4 w-4 accent-axc-navy cursor-pointer"
                            />
                            {inactiveVal}
                          </label>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={field.key} className={`flex flex-col gap-1 ${colSpanClass}`}>
                      <FieldLabel required={field.required}>{field.label}</FieldLabel>
                      <input
                        type={field.type || "text"}
                        step={field.type === "number" ? "any" : undefined}
                        value={String(form[field.key] ?? "")}
                        placeholder={field.placeholder || `Enter ${field.label}`}
                        onChange={(e) => {
                          const v = field.uppercase
                            ? e.target.value.toUpperCase()
                            : e.target.value;
                          setForm((prev) => ({ ...prev, [field.key]: v }));
                          if (errors[field.key]) {
                            setErrors((prev) => ({ ...prev, [field.key]: "" }));
                          }
                        }}
                        className={`${
                          errors[field.key] ? errorInputClass : inputClass
                        } text-regular-small ${field.uppercase ? "uppercase" : ""} ${
                          field.mono ? "font-mono" : ""
                        }`}
                      />
                      <FieldError message={errors[field.key]} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href={config.basePath}
                className="px-5 py-4 border border-axc-border bg-white text-axc-dark-gray rounded-lg text-regular-small hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm disabled:opacity-50"
              >
                {loading
                  ? isEdit
                    ? "Updating..."
                    : "Saving..."
                  : isEdit
                  ? `Update ${config.singularTitle}`
                  : `Create ${config.singularTitle}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function StandardMasterCreatePage<T extends Record<string, any>>({
  config,
}: {
  config: MasterModuleConfig<T>;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-500">
          Loading {config.singularTitle} Form...
        </div>
      }
    >
      <StandardCreateFormContent config={config} />
    </Suspense>
  );
}

