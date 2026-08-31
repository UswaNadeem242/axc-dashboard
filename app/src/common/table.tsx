"use client";

import React, { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import CommonPagination from "./pagination";

interface Heading {
  label: string;
  key: string;
  className?: string;
  sortable?: boolean;
  truncate?: boolean;
  render?: (row: any) => React.ReactNode;
}

interface CommonTableProps {
  headings: Heading[];
  data: any[];

  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  itemsPerPage?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  renderActions?: (row: any) => React.ReactNode;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
  selectable?: boolean;
  rowKey?: string;
  selectedIds?: (string | number)[];
  onSelectionChange?: (ids: (string | number)[]) => void;
  emptyMessage?: string;
  loading?: boolean;
  loadingMessage?: string;
  hidePagination?: boolean;
  className?: string;
}

const CommonTable = ({
  headings,
  data,
  onView,
  onEdit,
  onDelete,
  totalPages: propTotalPages,
  currentPage = 1,
  onPageChange,
  itemsPerPage = 10,
  renderActions,
  sortKey,
  sortDirection,
  onSort,
  selectable = false,
  rowKey = "id",
  selectedIds = [],
  onSelectionChange,
  emptyMessage = "No records found",
  loading = false,
  loadingMessage = "Loading...",
  hidePagination = false,
  className = "",
}: CommonTableProps) => {
  const computedTotalPages = propTotalPages ?? Math.max(1, Math.ceil(data.length / itemsPerPage));
  const activePage = Math.min(Math.max(1, currentPage), computedTotalPages);
  const paginatedData = data.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);
  const colSpan = headings.length + (selectable ? 1 : 0);

  // =========================================================
  // TRUNCATE
  // =========================================================
  const truncateText = (text: string, maxLength = 8) => {
    if (!text) return "-";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const allSelected = paginatedData.length > 0 && paginatedData.every((row) => selectedIds.includes(row[rowKey]));

  const toggleAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(selectedIds.filter((id) => !paginatedData.some((row) => row[rowKey] === id)));
    } else {
      onSelectionChange(Array.from(new Set([...selectedIds, ...paginatedData.map((row) => row[rowKey])])));
    }
  };

  const toggleRow = (id: string | number) => {
    if (!onSelectionChange) return;
    onSelectionChange(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id]);
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Arrived":
        return "bg-axc-green/10 text-axc-dark-green";
      case "On Time":
        return "bg-axc-sky/10 text-axc-blue";
      case "Pending":
        return "bg-axc-yellow/10 text-axc-dark-yellow";
      default:
        return "bg-axc-gray/10 text-axc-gray";
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex flex-col overflow-hidden rounded-lg border border-axc-border">
        <div
          className="overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent  [&::-webkit-scrollbar-thumb]:bg-axc-gray/40 [&::-webkit-scrollbar-thumb]:rounded-lg"
        >
          <table className="w-max min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-axc-navy/10 text-black">
                {selectable && (
                  <th className="w-10 bg-axc-navy/10 rounded-l-sm px-4 py-3">
                    <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-3.5 w-3.5 accent-white" />
                  </th>
                )}
                {headings.map((heading, index) => (
                  <th
                    key={heading.key}
                    onClick={() => heading.sortable && onSort?.(heading.key)}
                    className={`bg-axc-navy/10 px-4 py-3  text-regular-semibold capitalize  whitespace-nowrap ${index === 0 && !selectable ? "rounded-l-sm" : ""} ${index === headings.length - 1 ? "rounded-r-sm" : ""} ${heading.sortable ? "cursor-pointer select-none" : ""} `}
                  >
                    <span className="inline-flex items-center gap-1">{heading.label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-axc-border">
              {loading ? (
                <tr>
                  <td colSpan={colSpan} className="px-4 py-12 text-center text-sm text-axc-gray">
                    {loadingMessage}
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={colSpan} className="px-4 py-12 text-center text-sm text-axc-gray">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr key={index} className="bg-white transition">
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(row[rowKey])}
                          onChange={() => toggleRow(row[rowKey])}
                          className="h-3.5 w-3.5 accent-axc-blue"
                        />
                      </td>
                    )}
                    {headings.map((heading) => (
                      <td key={heading.key} className="px-4 py-3">
                        {heading.render ? (
                          heading.render(row)
                        ) : heading.key === "status" ? (
                          <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${getStatusClasses(row.status)}`}>
                            {row.status}
                          </span>
                        ) : heading.key === "action" ? (
                          renderActions ? (
                            renderActions(row)
                          ) : (
                            <div className="flex items-center gap-2">
                              {onView && (
                                <button
                                  type="button"
                                  onClick={() => onView(row)}
                                  className="inline-flex items-center justify-center rounded-md border border-axc-navy/30 p-1.5 text-axc-navy transition hover:bg-axc-navy/10 cursor-pointer"
                                  title="View"
                                >
                                  <Eye size={16} />
                                </button>
                              )}
                              {onEdit && (
                                <button
                                  type="button"
                                  onClick={() => onEdit(row)}
                                  className="inline-flex items-center justify-center rounded-md border border-axc-dark-green/30  p-1.5 text-axc-dark-green transition hover:bg-axc-dark-green/10 cursor-pointer"
                                  title="Edit"
                                >
                                  <Pencil size={16} />
                                </button>
                              )}

                              {onDelete && (
                                <button
                                  type="button"
                                  onClick={() => onDelete(row)}
                                  className="inline-flex items-center justify-center rounded-md border border-axc-red-dark/30  p-1.5 text-axc-red-dark transition hover:bg-axc-red-dark/10 cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          )
                        ) : (
                          (() => {
                            const value = row[heading.key];
                            if (value === null || value === undefined || value === "") return "-";
                            if (typeof value === "string") {
                              if (heading.truncate === false) return <span className="whitespace-nowrap">{value}</span>;
                              return (
                                <div className="group relative inline-block max-w-30">
                                  <span className="block truncate cursor-pointer">{truncateText(value, 8)}</span>
                                  {value.length > 8 && (
                                    <div className="invisible absolute left-1/2 top-full z-50 mt-2 w-max max-w-xs -translate-x-1/2 rounded-lg bg-axc-dark-gray px-3 py-2 text-xs text-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                                      {value}
                                      <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-axc-dark-gray" />
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            return value;
                          })()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!hidePagination && computedTotalPages >= 1 && (
        <div className="mt-2 flex shrink-0 justify-end">
          <CommonPagination currentPage={activePage} totalPages={computedTotalPages} onPageChange={onPageChange ?? (() => {})} />
        </div>
      )}
    </div>
  );
};

export default CommonTable;