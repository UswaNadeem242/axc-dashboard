"use client";

import React, { useState } from "react";
import { showToast } from "./toast";
import {
  Eye,
  Pencil,
  Trash2,
  Copy,
} from "lucide-react";
import CommonPagination from "./pagination";

interface CommonTableProps {
  headings: {
    label: string;
    key: string;
  }[];
  data: any[];
  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  itemsPerPage?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
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
}: CommonTableProps) => {
  const computedTotalPages = propTotalPages ?? Math.max(1, Math.ceil(data.length / itemsPerPage));
  const activePage = Math.min(Math.max(1, currentPage), computedTotalPages);
  const paginatedData = data.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  const copyRow = async (row: any) => {
    await navigator.clipboard.writeText(JSON.stringify(row, null, 2));

    showToast({
      variant: "success",
      message: "Row copied.",
    });
  };

  const truncateText = (text: string, maxLength = 8) => {
    if (!text) return "-";

    return text.length > maxLength
      ? `${text.slice(0, maxLength)}...`
      : text;
  };



  return (
    <div>
      <div className="overflow-x-auto scrollbar-none ">
        {/* <table className="w-full min-w-[700px] border-collapse text-left text-xs"> */}
        <table className="w-max min-w-full border-collapse text-left text-sm  ">
          <thead>
            <tr className="bg-axc-navy text-white">
              {headings.map((heading, index) => (
                <th
                  key={heading.key}
                  className={`px-4 py-3 font-medium capitalize ${index === 0 ? "rounded-l-sm" : ""
                    } ${index === headings.length - 1 ? "rounded-r-sm" : ""}`}
                >
                  {heading.label}
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
                  <td key={heading.key} className="px-4 py-3">
                    {heading.key === "status" ? (
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold ${row.status === "Arrived"
                          ? "bg-emerald-50 text-emerald-600"
                          : row.status === "On Time"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-amber-50 text-amber-600"
                          }`}
                      >
                        {row.status}
                      </span>
                    ) : heading.key === "action" ? (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onView?.(row)}
                          className="text-axc-navy"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => onEdit?.(row)}
                          className="text-axc-dark-green"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => onDelete?.(row)}
                          className="text-axc-red-dark"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>

                        <button
                          onClick={() => copyRow(row)}
                          className="text-axc-dark-gray"
                          title="Copy"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    ) : (
                      (() => {
                        const value = row[heading.key];

                        if (value === null || value === undefined) {
                          return "-";
                        }

                        if (typeof value === "string") {
                          return (
                            <div className="group relative inline-block max-w-[120px]">
                              <span className="block truncate cursor-pointer">
                                {truncateText(value, 8)}
                              </span>

                              {value.length > 8 && (
                                <div
                                  className="invisible absolute left-1/2 top-full z-50 mt-2 w-max max-w-xs -translate-x-1/2 rounded-lg bg-axc-gray px-3 py-2 text-xs text-white shadow-xl opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100"
                                >
                                  {value}
                                  <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-axc-gray"></div>
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
      {/* pagination */}

      {computedTotalPages >= 1 && (
        <CommonPagination
          currentPage={activePage}
          totalPages={computedTotalPages}
          onPageChange={onPageChange ?? (() => { })}
        />
      )}
    </div>


  );
};

export default CommonTable;