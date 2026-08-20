"use client";

import React from "react";
import { showToast } from "./toast";
import {
  Eye,
  Pencil,
  Trash2,
  Copy,
  ArrowUpDown,
  PackageCheck,
  FileText,
} from "lucide-react";
import CommonPagination from "./pagination";

interface Heading {
  label: string;
  key: string;
  className?: string;
  sortable?: boolean;
  truncate?: boolean;
}

interface CommonTableProps {
  headings: Heading[];
  data: any[];

  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onBagging?: (row: any) => void;
  onPdf?: (row: any) => void;

  itemsPerPage?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;

  renderActions?: (row: any) => React.ReactNode;

  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
}

const CommonTable = ({
  headings,
  data,
  onView,
  onEdit,
  onDelete,
  onBagging,
  onPdf,
  totalPages: propTotalPages,
  currentPage = 1,
  onPageChange,
  itemsPerPage = 10,
  renderActions,
  sortKey,
  sortDirection,
  onSort,
}: CommonTableProps) => {
  const computedTotalPages =
    propTotalPages ??
    Math.max(1, Math.ceil(data.length / itemsPerPage));

  const activePage = Math.min(
    Math.max(1, currentPage),
    computedTotalPages
  );

  const paginatedData = data.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );
  const copyRow = async (row: any) => {
    await navigator.clipboard.writeText(
      JSON.stringify(row, null, 2)
    );

    showToast({
      variant: "success",
      message: "Row copied.",
    });
  };
  const truncateText = (
    text: string,
    maxLength = 8
  ) => {
    if (!text) return "-";

    return text.length > maxLength
      ? `${text.slice(0, maxLength)}...`
      : text;
  };

  return (
    <div>
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-max min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-axc-navy text-white">

              {headings.map((heading, index) => (
                <th
                  key={heading.key}
                  onClick={() =>
                    heading.sortable &&
                    onSort?.(heading.key)
                  }
                  className={`px-4 py-3 font-medium capitalize whitespace-nowrap ${
                    index === 0
                      ? "rounded-l-sm"
                      : ""
                  } ${
                    index === headings.length - 1
                      ? "rounded-r-sm"
                      : ""
                  } ${
                    heading.sortable
                      ? "cursor-pointer select-none"
                      : ""
                  }`}
                >
                  <span className="inline-flex items-center gap-1">

                    {heading.label}

                    {heading.sortable && (
                      <ArrowUpDown
                        size={12}
                        className={
                          sortKey === heading.key
                            ? "text-white"
                            : "text-white/50"
                        }
                      />
                    )}

                  </span>
                </th>
              ))}

            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">

            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className="transition hover:bg-gray-50"
              >

                {headings.map((heading) => (

                  <td
                    key={heading.key}
                    className="px-4 py-3"
                  >
                    {heading.key === "status" ? (

                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                          row.status === "Arrived"
                            ? "bg-emerald-50 text-emerald-600"
                            : row.status === "On Time"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {row.status}
                      </span>

                    ) : heading.key === "action" ? (

                      renderActions ? (

                        renderActions(row)

                      ) : (

                        <div className="flex items-center gap-3">

                          {onView && (
                            <button
                              type="button"
                              onClick={() =>
                                onView(row)
                              }
                              className="text-axc-navy hover:opacity-70 transition"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                          )}

                          {onEdit && (
                            <button
                              type="button"
                              onClick={() =>
                                onEdit(row)
                              }
                              className="text-axc-dark-green hover:opacity-70 transition"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                          )}
                          {onBagging && (
                            <button
                              type="button"
                              onClick={() =>
                                onBagging(row)
                              }
                              className="text-axc-navy hover:opacity-70 transition"
                              title="Bagging"
                            >
                              <PackageCheck size={17} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              type="button"
                              onClick={() =>
                                onDelete(row)
                              }
                              className="text-axc-red-dark hover:opacity-70 transition"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              copyRow(row)
                            }
                            className="text-axc-dark-gray hover:opacity-70 transition"
                            title="Copy"
                          >
                            <Copy size={16} />
                          </button>
                          {onPdf && (
                            <button
                              type="button"
                              onClick={() =>
                                onPdf(row)
                              }
                              className="text-blue-600 hover:opacity-70 transition"
                              title="View PDF"
                            >
                              <FileText size={16} />
                            </button>
                          )}

                        </div>
                      )

                    ) : (

                      (() => {
                        const value =
                          row[heading.key];

                        if (
                          value === null ||
                          value === undefined ||
                          value === ""
                        ) {
                          return "-";
                        }

                        if (
                          typeof value === "string"
                        ) {

                          if (
                            heading.truncate === false
                          ) {
                            return (
                              <span className="whitespace-nowrap">
                                {value}
                              </span>
                            );
                          }

                          return (
                            <div className="group relative inline-block max-w-[120px]">

                              <span className="block truncate cursor-pointer">
                                {truncateText(
                                  value,
                                  8
                                )}
                              </span>

                              {value.length > 8 && (
                                <div className="invisible absolute left-1/2 top-full z-50 mt-2 w-max max-w-xs -translate-x-1/2 rounded-lg bg-axc-gray px-3 py-2 text-xs text-white shadow-xl opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">

                                  {value}

                                  <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-axc-gray" />

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
            ))}

          </tbody>

        </table>
      </div>
      {computedTotalPages >= 1 && (
        <CommonPagination
          currentPage={activePage}
          totalPages={computedTotalPages}
          onPageChange={
            onPageChange ?? (() => {})
          }
        />
      )}

    </div>
  );
};

export default CommonTable;