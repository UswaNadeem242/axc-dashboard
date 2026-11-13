"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Eye, Pencil, Trash2, Package, ChevronUp, ChevronDown } from "lucide-react";
import CommonPagination from "./pagination";
import CommonScroll from "./commonscroll";
import Dropdown from "./dropdown";

interface Heading {
  label: React.ReactNode;
  key: string;
  className?: string;
  sortable?: boolean;
  truncate?: boolean;
  align?: "left" | "center" | "right";
  render?: (row: any, index?: number) => React.ReactNode;
}

interface CommonTableProps {
  headings: Heading[];
  data: any[];

  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onBag?: (row: any) => void;
  onPrint?: (row: any) => void;

  itemsPerPage?: number;
  onItemsPerPageChange?: (items: number) => void;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
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
  showScroll?: boolean;
  hideScroll?: boolean;
  className?: string;
  cellPadding?: string;
  headerPadding?: string;
}

const PRICE_KEY_PATTERNS = [
  /\bprice\b/i,
  /\bamount\b/i,
  /\bcost\b/i,
  /\btotal\b/i,
  /\bfare\b/i,
  /\bfee\b/i,
  /\bbalance\b/i,
  /\bdebit\b/i,
  /\bcredit\b/i,
  /\btariff\b/i,
  /\brate\b/i,
];

const NON_PRICE_EXCLUSIONS = [
  /count/i,
  /number/i,
  /no\b/i,
  /id\b/i,
  /code/i,
  /status/i,
  /date/i,
  /time/i,
  /name/i,
  /title/i,
  /desc/i,
  /description/i,
  /type/i,
  /item/i,
  /head/i,
  /group/i,
  /category/i,
  /method/i,
  /customer/i,
  /vendor/i,
  /shipper/i,
  /consignee/i,
  /service/i,
  /product/i,
  /country/i,
  /state/i,
  /city/i,
  /hub/i,
  /zone/i,
  /select/i,
  /action/i,
];

const CURRENCY_VALUE_REGEX = /^[\$€£₹¥]\s*-?[\d,]+(\.\d+)?$|^-?[\d,]+(\.\d+)?\s*[\$€£₹¥]$|^(PKR|USD|AED|EUR|GBP|INR|Rs\.?)\s*-?[\d,]+(\.\d+)?$|^-?[\d,]+(\.\d+)?\s*(PKR|USD|AED|EUR|GBP|INR|Rs\.?)$/i;

export const isPriceColumn = (
  key: string,
  label?: React.ReactNode,
  sampleData?: any[]
): boolean => {
  const keyStr = String(key || "");
  const labelStr = typeof label === "string" ? label : "";

  // 1. If explicit non-price terms exist and no explicit amount/price term exists
  const hasExclusion = NON_PRICE_EXCLUSIONS.some((rx) => rx.test(keyStr) || rx.test(labelStr));
  const hasExplicitPriceTerm = /price|amount/i.test(keyStr) || /price|amount/i.test(labelStr);

  if (hasExclusion && !hasExplicitPriceTerm) {
    return false;
  }

  // 2. Check if key or label matches price keywords
  if (PRICE_KEY_PATTERNS.some((rx) => rx.test(keyStr) || rx.test(labelStr))) {
    return true;
  }

  // 3. Inspect sample rows if available
  if (sampleData && sampleData.length > 0) {
    for (let i = 0; i < Math.min(sampleData.length, 5); i++) {
      const val = sampleData[i]?.[keyStr];
      if (typeof val === "string" && CURRENCY_VALUE_REGEX.test(val.trim())) {
        return true;
      }
    }
  }

  return false;
};

export const resolveColumnAlign = (
  headingAlign?: Heading["align"],
  key?: string,
  label?: React.ReactNode,
  sampleData?: any[]
): "left" | "center" | "right" => {
  if (headingAlign) return headingAlign;
  if (key && isPriceColumn(key, label, sampleData)) return "right";
  return "left";
};

function defaultDescendingComparator(a: any, b: any): number {
  if (!a || !b) return 0;
  // 1. Date comparison (createdAt, created_at, createdDate, date, receiptDate, invoiceDate, manifestDate, etc.)
  const rawDateA = a.createdAt || a.created_at || a.createdDate || a.date || a.receiptDate || a.invoiceDate || a.manifestDate || a.transferDate || a.noteDate;
  const rawDateB = b.createdAt || b.created_at || b.createdDate || b.date || b.invoiceDate || b.manifestDate || b.receiptDate || b.transferDate || b.noteDate;
  if (rawDateA && rawDateB) {
    const timeA = new Date(rawDateA).getTime();
    const timeB = new Date(rawDateB).getTime();
    if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) {
      return timeB - timeA;
    }
  }

  // 2. Numeric / ID comparison
  const numA = Number(a.id ?? a.srNo ?? a.sr_no ?? (typeof a.awbNumber === "number" ? a.awbNumber : String(a.awbNumber ?? "").replace(/\D/g, "")) ?? 0);
  const numB = Number(b.id ?? b.srNo ?? b.sr_no ?? (typeof b.awbNumber === "number" ? b.awbNumber : String(b.awbNumber ?? "").replace(/\D/g, "")) ?? 0);
  if (!isNaN(numA) && !isNaN(numB) && numA !== 0 && numB !== 0 && numA !== numB) {
    return numB - numA;
  }

  // 3. Fallback string id or code comparison descending
  const idA = String(a.id ?? a.code ?? a.number ?? "");
  const idB = String(b.id ?? b.code ?? b.number ?? "");
  if (idA && idB && idA !== idB) {
    return idB.localeCompare(idA);
  }

  return 0;
}

const CommonTable = ({
  headings,
  data,
  onView,
  onEdit,
  onDelete,
  onBag,
  totalPages: propTotalPages,
  totalCount,
  currentPage = 1,
  onPageChange,
  itemsPerPage = 10,
  onItemsPerPageChange,
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
  showScroll = true,
  hideScroll = false,
  className = "",
  cellPadding = "px-4 py-2",
  headerPadding = "px-4 py-3",
}: CommonTableProps) => {
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(itemsPerPage);
  const [internalSortKey, setInternalSortKey] = useState<string>("");
  const [internalSortDirection, setInternalSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    setInternalItemsPerPage(itemsPerPage);
  }, [itemsPerPage]);

  const effectiveSortKey = sortKey !== undefined ? sortKey : internalSortKey;
  const effectiveSortDirection = sortDirection !== undefined ? sortDirection : internalSortDirection;

  const handleHeaderSort = (key: string) => {
    if (onSort) {
      onSort(key);
      return;
    }
    if (internalSortKey === key) {
      setInternalSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setInternalSortKey(key);
      setInternalSortDirection("desc");
    }
  };

  const processedData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    if (effectiveSortKey) {
      return [...data].sort((a, b) => {
        const valA = a?.[effectiveSortKey] ?? "";
        const valB = b?.[effectiveSortKey] ?? "";
        if (typeof valA === "number" && typeof valB === "number") {
          return effectiveSortDirection === "asc" ? valA - valB : valB - valA;
        }
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        return effectiveSortDirection === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
      });
    }
    return [...data].sort(defaultDescendingComparator);
  }, [data, effectiveSortKey, effectiveSortDirection]);

  const computedTotalPages =
    propTotalPages ??
    (totalCount !== undefined
      ? Math.max(1, Math.ceil(totalCount / internalItemsPerPage))
      : Math.max(1, Math.ceil(processedData.length / internalItemsPerPage)));
  const activePage = Math.min(Math.max(1, currentPage), computedTotalPages);
  const paginatedData =
    (propTotalPages !== undefined || totalCount !== undefined) && data.length <= internalItemsPerPage
      ? data
      : processedData.slice((activePage - 1) * internalItemsPerPage, activePage * internalItemsPerPage);
  const colSpan = headings.length + (selectable ? 1 : 0);
  const isScrollEnabled = showScroll && !hideScroll;

  const truncateText = (text: string, maxLength = 8) => {
    if (!text) return "-";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const getTextAlign = (align: Heading["align"] = "left") => {
    if (align === "right") return "text-right";
    if (align === "center") return "text-center";
    return "text-center";
  };

  const getJustify = (align: Heading["align"] = "left") => {
    if (align === "right") return "justify-end text-right";
    if (align === "center") return "justify-center text-center";
    return "justify-center text-left";
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

  const tableElement = (
    <table className="w-full min-w-max border-collapse text-left text-sm">
      <thead className="text-left">
        <tr className="bg-axc-navy/10 text-black text-center">
          {selectable && (
            <th className={`w-10 bg-axc-navy/10 text-center rounded-tl-sm ${headerPadding}`}>
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-3.5 w-3.5 accent-axc-blue cursor-pointer"
                />
              </div>
            </th>
          )}
          {headings.map((heading, index) => {
            const align = resolveColumnAlign(heading.align, heading.key, heading.label, paginatedData);
            const isSorted = effectiveSortKey === heading.key;
            return (
              <th
                key={heading.key}
                onClick={() => heading.sortable && handleHeaderSort(heading.key)}
                className={`bg-axc-navy/10 ${headerPadding} text-xs font-bold text-axc-dark-gray align-top
                   whitespace-nowrap ${index === 0 && !selectable ? "rounded-tl-sm" : ""
                  } ${index === headings.length - 1 ? "rounded-tr-sm" : ""} ${heading.sortable ? "cursor-pointer select-none hover:bg-axc-navy/20 transition-colors" : ""
                  } ${getTextAlign(align)} ${heading.className ?? ""}`}
              >
                <div className={`flex items-center whitespace-nowrap gap-1 pl-2 ${getJustify(align)}`}>
                  {heading.label}
                  {heading.sortable && (
                    <span className="inline-flex items-center ml-0.5 opacity-70">
                      {isSorted ? (
                        effectiveSortDirection === "asc" ? (
                          <ChevronUp size={12} className="text-axc-blue" />
                        ) : (
                          <ChevronDown size={12} className="text-axc-blue" />
                        )
                      ) : null}
                    </span>
                  )}
                </div>
              </th>
            );
          })}
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
                <td className={`${cellPadding} text-center`}>
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row[rowKey])}
                      onChange={() => toggleRow(row[rowKey])}
                      className="h-3.5 w-3.5 accent-axc-blue cursor-pointer"
                    />
                  </div>
                </td>
              )}
              {headings.map((heading) => {
                const align = resolveColumnAlign(heading.align, heading.key, heading.label, paginatedData);
                const isPrice = align === "right";
                return (
                  <td key={heading.key} className={`${cellPadding} ${getTextAlign(align)}`}>
                    {heading.render ? (
                      heading.render(row, (activePage - 1) * itemsPerPage + index)
                    ) : heading.key === "status" ? (
                      <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold ${getStatusClasses(row.status)}`}>
                        {row.status}
                      </span>
                    ) : heading.key === "action" ? (
                      renderActions ? (
                        renderActions(row)
                      ) : (
                        <div className={`flex items-center gap-2 ${align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start"}`}>
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
                              className="inline-flex items-center justify-center rounded-md border border-axc-dark-green/30 p-1.5 text-axc-dark-green transition hover:bg-axc-dark-green/10 cursor-pointer"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                          )}

                          {onBag && (
                            <button
                              type="button"
                              onClick={() => onBag(row)}
                              className="inline-flex items-center justify-center rounded-md border border-axc-yellow/30 p-1.5 text-axc-dark-yellow transition hover:bg-axc-yellow/10 cursor-pointer"
                              title="Bagging"
                            >
                              <Package size={16} />
                            </button>
                          )}

                          {onDelete && (
                            <button
                              type="button"
                              onClick={() => onDelete(row)}
                              className="inline-flex items-center justify-center rounded-md border border-axc-red-dark/30 p-1.5 text-axc-red-dark transition hover:bg-axc-red-dark/10 cursor-pointer"
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
                        if (typeof value === "number") {
                          return <span className={`block whitespace-nowrap ${getTextAlign(align)}`}>{value}</span>;
                        }
                        if (typeof value === "string") {
                          if (heading.truncate === false || isPrice) {
                            return <span className={`block whitespace-nowrap ${getTextAlign(align)}`}>{value}</span>;
                          }
                          return (
                            <div className={`group relative inline-block max-w-30 w-full ${getTextAlign(align)}`}>
                              <span className="block truncate cursor-pointer">{truncateText(value, 8)}</span>
                              {value.length > 8 && (
                                <div className="invisible absolute left-1/2 bottom-full z-[99] mb-2 w-max max-w-xs -translate-x-1/2 rounded-lg bg-axc-navy/60 px-3 py-2 text-xs text-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                                  {value}
                                  <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-axc-navy/60" />
                                </div>
                              )}
                            </div>
                          );
                        }
                        return value;
                      })()
                    )}
                  </td>
                );
              })}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  return (
    <div className={`flex flex-col ${className}`}>
      {isScrollEnabled ? (
        <CommonScroll
          orientation="horizontal"
          align="start"
          className="rounded-lg border border-axc-border"
          contentClassName=""
          scrollbarThickness={6}
          maxThumbPercent={15}
          showArrows={true}
          gap={8}
        >
          {tableElement}
        </CommonScroll>
      ) : (
        <div className="rounded-lg border border-axc-border overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tableElement}
        </div>
      )}

      {!hidePagination && computedTotalPages >= 1 && (
        <div className="mt-2 flex shrink-0 justify-between items-center px-1">
          <div className="flex items-center gap-2">
            {/* <span className="text-[11px] text-axc-gray font-medium">Rows:</span> */}
            <div className="w-25">
              <Dropdown
                options={[10, 20, 50, 100, 200].map(n => ({ value: n.toString(), label: n.toString() }))}
                value={internalItemsPerPage.toString()}
                onChange={(val) => {
                  const numVal = Number(val);
                  setInternalItemsPerPage(numVal);
                  if (onItemsPerPageChange) onItemsPerPageChange(numVal);
                  if (onPageChange) onPageChange(1);
                }}
                className="h-9! py-2! px-3! text-sm font-medium"
              />
            </div>
          </div>
          <CommonPagination currentPage={activePage} totalPages={computedTotalPages} onPageChange={onPageChange ?? (() => { })} />
        </div>
      )}
    </div>
  );
};

export default CommonTable;