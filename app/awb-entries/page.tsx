"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  PlusCircleIcon,
  MapPin,
  Mail,
  FileText,
  FileSpreadsheet,
  Eye,
  Pencil,
  Trash2,
  Printer,
} from "lucide-react";
import CommonTable from "../src/common/table";
import {
  AwbEntryheading,
  AwbEntry,
  initialData,
  awbFilterGroups,
  HUB_COUNTRY_MAP,
} from "../src/constant";
import FilterSearch from "../src/common/filtersearch";
import Button from "../src/common/button";
import DeleteConfirmationDialog from "../src/common/deleteConfirmation";
import Dropdown from "../src/common/dropdown";
import { showToast } from "../src/common/toast";

export default function AwbEntriesPage() {
  const router = useRouter();

  const [data, setData] = useState<AwbEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const [deleteTarget, setDeleteTarget] = useState<AwbEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      const group = awbFilterGroups.find(g => g.options.some(o => o.value === addedTag));
      if (group) {
        const groupValues = group.options.map(o => o.value);
        const filteredTags = newTags.filter(tag => tag === addedTag || !groupValues.includes(tag));
        setActiveTags(filteredTags);
        return;
      }
    }
    
    setActiveTags(newTags);
  };

  const removeTag = (tagToRemove: string) => {
    setActiveTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("awb_entries");
      if (stored) {
        try {
          const parsed: AwbEntry[] = JSON.parse(stored);
          const hasPakistan = parsed.some(
            (item) => (item.origin || "").trim().toUpperCase() === "PAKISTAN"
          );
          if (parsed.length >= initialData.length && hasPakistan) {
            setData(parsed);
            return;
          }
          // Merge user-created entries with the fresh initialData
          const userCreated = parsed.filter(
            (p) => !initialData.some((init) => init.awbNumber === p.awbNumber)
          );
          const merged = [...userCreated, ...initialData];
          setData(merged);
          localStorage.setItem("awb_entries", JSON.stringify(merged));
          return;
        } catch (e) {
          console.error(e);
        }
      }
      setData(initialData);
      localStorage.setItem("awb_entries", JSON.stringify(initialData));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && data.length > 0) {
      localStorage.setItem("awb_entries", JSON.stringify(data));
    }
  }, [data]);

  const handleDelete = (row: AwbEntry) => {
    setDeleteTarget(row);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setData((prev) => prev.filter((item) => item.awbNumber !== deleteTarget.awbNumber));
    setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.awbNumber));
    showToast({ variant: "success", message: "AWB entry deleted." });
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
  };

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const handleBulkDeleteConfirm = () => {
    const count = selectedIds.length;
    setData((previous) => previous.filter((item) => !selectedIds.includes(item.awbNumber)));
    showToast({
      variant: "success",
      message: `${count} ${count === 1 ? "AWB entry" : "AWB entries"} deleted successfully`,
    });
    setSelectedIds([]);
    setBulkDeleteOpen(false);
  };

  const handleBulkExport = () => {
    const selectedRows = data.filter((item) => selectedIds.includes(item.awbNumber));
    if (selectedRows.length === 0) return;
    const headers = [
      "SR No",
      "AWB Number",
      "Booking Date",
      "Forwarding Number",
      "Customer",
      "Master Code",
      "Product",
      "PCS",
      "Service",
      "Vendor",
      "Origin",
      "Destination",
      "Consignee",
      "Shipper",
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...selectedRows.map((r, idx) =>
        [
          r.srNo ?? idx + 1,
          `"${r.awbNumber || ""}"`,
          `"${r.bookingDate || ""}"`,
          `"${r.forwardingNumber || ""}"`,
          `"${r.customer || ""}"`,
          `"${r.masterCode || ""}"`,
          `"${r.product || ""}"`,
          r.pcs ?? 0,
          `"${r.service || ""}"`,
          `"${r.vendor || ""}"`,
          `"${r.origin || ""}"`,
          `"${r.destination || ""}"`,
          `"${r.consignee || ""}"`,
          `"${r.shipper || ""}"`,
          `"${r.status || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `awb_entries_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast({
      variant: "success",
      message: `${selectedRows.length} ${selectedRows.length === 1 ? "AWB" : "AWBs"} exported successfully`,
    });
  };

  const handleTrack = (row: AwbEntry) => console.log("Track AWB", row.awbNumber);
  const handleMail = (row: AwbEntry) => console.log("Email AWB", row.awbNumber);
  const handlePdf1 = (row: AwbEntry) => console.log("View PDF 1", row.awbNumber);
  const handlePdf2 = (row: AwbEntry) => console.log("View PDF 2", row.awbNumber);
  const handleInv = (row: AwbEntry) => console.log("View INV", row.awbNumber);
  const handleEdit = (row: AwbEntry) => router.push(`/create-entries?edit=${row.awbNumber}`);
  const handleView = (row: AwbEntry) => router.push(`/awb-entries/view/${row.awbNumber}`);

  const parseAwbRange = (input: string): { min: number; max: number } | null => {
    const clean = input.trim();
    const rangeMatch = clean.match(/^(\d{4,15})\s*(?:-|–|—|\.\.|to)\s*(\d{4,15})$/i);
    if (rangeMatch) {
      const num1 = Number(rangeMatch[1]);
      const num2 = Number(rangeMatch[2]);
      if (!isNaN(num1) && !isNaN(num2)) {
        return { min: Math.min(num1, num2), max: Math.max(num1, num2) };
      }
    }
    return null;
  };

  const normalizeAwbEntry = (item: AwbEntry): AwbEntry => {
    const awbTail = String(item.awbNumber || "").slice(-4);
    const destUpper = (item.destination || "").toUpperCase();
    const originUpper = (item.origin || "").toUpperCase();
    const bookingYear = (item.bookingDate || "").split("/")[2] || (item.bookingDate || "").split("-")[0] || "2026";

    const derivedDestHub = item.destinationHub || (
      destUpper.includes("AMERICA") || destUpper.includes("USA") ? "JFK" :
      destUpper.includes("KINGDOM") || destUpper.includes("UK") ? "LHR" :
      destUpper.includes("GERMANY") ? "FRANKFURT" :
      destUpper.includes("EMIRATES") || destUpper.includes("UAE") ? "DUBAI" :
      destUpper.includes("CANADA") ? "CANADA" :
      destUpper.includes("SINGAPORE") ? "SINGAPORE" :
      destUpper.includes("FRANCE") ? "PARIS" :
      destUpper.includes("JAPAN") ? "TOKYO" :
      destUpper.includes("AUSTRALIA") ? "SYDNEY" :
      item.destination || "JFK"
    );

    const derivedShipperCity = item.shipperCity || (
      originUpper.includes("PAKISTAN") ? (item.service?.includes("LAHORE") ? "Lahore" : item.service?.includes("SIALKOT") ? "Sialkot" : item.service?.includes("PESHAWAR") ? "Peshawar" : "Karachi") :
      originUpper.includes("INDIA") ? (item.service?.includes("DELHI") ? "Delhi" : "Mumbai") :
      originUpper.includes("EMIRATES") ? "Dubai" :
      originUpper.includes("CANADA") ? "Toronto" :
      originUpper.includes("BANGLADESH") ? "Dhaka" :
      originUpper.includes("NEPAL") ? "Kathmandu" :
      item.origin || "Karachi"
    );

    const derivedConsigneeCity = item.consigneeCity || (
      destUpper.includes("AMERICA") ? "New York" :
      destUpper.includes("KINGDOM") ? "London" :
      destUpper.includes("GERMANY") ? "Berlin" :
      destUpper.includes("FRANCE") ? "Paris" :
      destUpper.includes("JAPAN") ? "Tokyo" :
      destUpper.includes("SINGAPORE") ? "Singapore" :
      destUpper.includes("EMIRATES") ? "Dubai" :
      item.destination || "New York"
    );

    const derivedConsigneeState = item.consigneeState || (
      destUpper.includes("AMERICA") ? "NY" :
      destUpper.includes("KINGDOM") ? "Greater London" :
      destUpper.includes("GERMANY") ? "Berlin" :
      destUpper.includes("FRANCE") ? "IDF" :
      destUpper.includes("CANADA") ? "Ontario" :
      "State"
    );

    const derivedServiceCode = item.serviceCode || (
      item.service ? item.service.split(" ")[0].toUpperCase() : "EXP"
    );

    const derivedCustomerCode = item.customerCode || (
      item.masterCode && item.masterCode !== "NONGST" ? item.masterCode : `CUST-${awbTail}`
    );

    const derivedCompany = item.company || (
      item.customer?.includes("ELS") ? "ELS Logistics" :
      item.service?.includes("FEDEX") ? "FedEx Cargo" :
      item.service?.includes("TCS") ? "TCS Express" :
      item.service?.includes("DHL") ? "DHL Express" :
      "AXC Express"
    );

    return {
      ...item,
      customerCode: derivedCustomerCode,
      destinationHub: derivedDestHub,
      bookingTime: item.bookingTime || "10:30 AM",
      serviceCode: derivedServiceCode,
      shipperCity: derivedShipperCity,
      consigneeCity: derivedConsigneeCity,
      consigneeState: derivedConsigneeState,
      company: derivedCompany,
      runNumber: item.runNumber || `RUN-${awbTail}`,
      calendarYear: item.calendarYear || bookingYear,
    };
  };

  const matchAwbItem = (item: AwbEntry, term: string): boolean => {
    const cleanTerm = term.trim().toLowerCase();
    if (!cleanTerm) return true;

    // 1. AWB Range
    const range = parseAwbRange(cleanTerm);
    if (range) {
      const awbNum = Number(item.awbNumber);
      if (!isNaN(awbNum)) {
        return awbNum >= range.min && awbNum <= range.max;
      }
    }

    // 2. Calendar Year (e.g. 2026, 2025)
    if (/^(?:19|20)\d{2}$/.test(cleanTerm)) {
      const bookingYear = (item.bookingDate || "").split("/")[2] || (item.bookingDate || "").split("-")[0] || "";
      if (bookingYear.includes(cleanTerm)) return true;
      if (String(item.calendarYear || "").includes(cleanTerm)) return true;
    }

    // 3. Hub Country Map check
    if (HUB_COUNTRY_MAP[cleanTerm]) {
      const mapping = HUB_COUNTRY_MAP[cleanTerm];
      const originUpper = (item.origin || "").trim().toUpperCase();
      const destUpper = (item.destination || "").trim().toUpperCase();
      if (originUpper === mapping.country || destUpper === mapping.country) return true;
      if (
        mapping.aliases.some((alias) =>
          (item.origin || "").toLowerCase().includes(alias) ||
          (item.destination || "").toLowerCase().includes(alias) ||
          String(item.destinationHub || "").toLowerCase().includes(alias) ||
          String((item as any).originHubCode || "").toLowerCase().includes(alias) ||
          (item.service || "").toLowerCase().includes(alias) ||
          (item.vendor || "").toLowerCase().includes(alias)
        )
      ) {
        return true;
      }
    }

    // 4. Fields covering all 15 filters
    const fields: (string | number | undefined | null)[] = [
      item.awbNumber,
      item.forwardingNumber,
      item.customer,
      item.customerCode,
      item.masterCode,
      item.destination,
      item.destinationHub,
      item.bookingDate,
      item.bookingTime,
      item.service,
      item.serviceCode,
      item.vendor,
      item.shipper,
      (item as any).shipperPersonName,
      item.shipperCity,
      item.consignee,
      (item as any).consigneePersonName,
      item.consigneeCity,
      item.consigneeState,
      item.origin,
      (item as any).originCity,
      item.status,
      (item as any).awbState,
      item.company,
      (item as any).printByCompany,
      item.runNumber,
      (item as any).runNo,
      item.calendarYear,
      item.product,
    ];

    return fields.some((f) => f !== undefined && f !== null && String(f).toLowerCase().includes(cleanTerm));
  };

  const filteredData = data.map(normalizeAwbEntry).filter((item) => {
    const query = searchQuery.trim().toLowerCase();

    let matchesQuery = true;
    if (query) {
      if (query.endsWith(",")) {
        // Show full table when a comma is typed so the user can look for the next item
        matchesQuery = true;
      } else {
        const range = parseAwbRange(query);
        if (range) {
          const num = Number(item.awbNumber);
          matchesQuery = !isNaN(num) && num >= range.min && num <= range.max;
        } else {
          const searchTerms = query.split(/[,]+/).map((q) => q.trim()).filter(Boolean);
          const termsToUse = searchTerms.length > 0 ? searchTerms : [query];
          matchesQuery = termsToUse.some((term) => matchAwbItem(item, term));
        }
      }
    }

    const matchesTags = activeTags.every((tag) => {
      const range = parseAwbRange(tag);
      if (range) {
        const num = Number(item.awbNumber);
        return !isNaN(num) && num >= range.min && num <= range.max;
      }

      const raw = tag.toLowerCase().replace("origin hub:", "").replace("dest hub:", "").replace("dest:", "").trim();

      if (raw === "origin hub code" || raw === "origin_hub_code") {
        return Boolean(item.origin || (item as any).originHubCode);
      }
      if (raw === "awb state" || raw === "awb_state") {
        return Boolean(item.status);
      }
      if (raw === "print by company" || raw === "print_by_company") {
        return true;
      }
      if (raw === "company") {
        return true;
      }
      if (raw === "shipment type") {
        return true;
      }
      if (raw === "service type") {
        return true;
      }
      if (raw === "awb status") {
        return true;
      }
      if (raw === "today" || raw === "yesterday" || raw === "last 7 days") {
        const checkDate = (dateStr?: string) => {
          if (!dateStr) return false;
          const [d, m, y] = dateStr.split("/");
          if (!d || !m || !y) return false;

          const itemDate = new Date(Number(y), Number(m) - 1, Number(d));
          itemDate.setHours(0,0,0,0);

          const today = new Date();
          today.setHours(0,0,0,0);

          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          const last7Days = new Date(today);
          last7Days.setDate(last7Days.getDate() - 7);

          if (raw === "today") return itemDate.getTime() === today.getTime();
          if (raw === "yesterday") return itemDate.getTime() === yesterday.getTime();
          if (raw === "last 7 days") return itemDate >= last7Days && itemDate <= today;
          return false;
        };

        return checkDate(item.bookingDate) ||
               checkDate((item as any).manifestDate) ||
               checkDate((item as any).invoiceDate);
      }
      if (raw === "custom") {
        return true;
      }
      const dateRangeRegex = /^[a-z]{3} \d{1,2}, \d{4} - [a-z]{3} \d{1,2}, \d{4}$/i;
      if (dateRangeRegex.test(raw)) {
        const parts = raw.split(" - ");
        if (parts.length === 2) {
          const parseItemDate = (str?: string) => {
            if (!str) return null;
            const [d, m, y] = str.split("/");
            if (!d || !m || !y) return null;
            const dt = new Date(Number(y), Number(m) - 1, Number(d));
            dt.setHours(0,0,0,0);
            return dt;
          };

          const parseTagDate = (str: string) => {
            const dt = new Date(str);
            if (isNaN(dt.getTime())) return null;
            dt.setHours(0,0,0,0);
            return dt;
          };

          const startDate = parseTagDate(parts[0]);
          const endDate = parseTagDate(parts[1]);

          if (startDate && endDate) {
            const checkRange = (dateStr?: string) => {
              const itemDate = parseItemDate(dateStr);
              if (!itemDate) return false;
              return itemDate >= startDate && itemDate <= endDate;
            };

            return checkRange(item.bookingDate) ||
                   checkRange((item as any).manifestDate) ||
                   checkRange((item as any).invoiceDate);
          }
        }
        return false;
      }

      if (/^(?:19|20)\d{2}$/.test(raw)) {
        const itemYear = (item.bookingDate || "").split("/")[2] || (item.bookingDate || "").split("-")[0] || "";
        if (itemYear.includes(raw) || String(item.calendarYear || "").includes(raw)) return true;
      }

      if (HUB_COUNTRY_MAP[raw]) {
        const mapping = HUB_COUNTRY_MAP[raw];
        const originUpper = (item.origin || "").trim().toUpperCase();
        const destUpper = (item.destination || "").trim().toUpperCase();
        if (originUpper === mapping.country || destUpper === mapping.country) return true;
        return mapping.aliases.some(
          (alias) =>
            (item.origin || "").toLowerCase().includes(alias) ||
            (item.destination || "").toLowerCase().includes(alias) ||
            String(item.destinationHub || "").toLowerCase().includes(alias) ||
            String((item as any).originHubCode || "").toLowerCase().includes(alias) ||
            (item.service || "").toLowerCase().includes(alias) ||
            (item.vendor || "").toLowerCase().includes(alias)
        );
      }

      return matchAwbItem(item, raw);
    });

    return matchesQuery && matchesTags;
  });

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

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const paginatedData = sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const tableHeadings = AwbEntryheading.map((h) => {
    if (h.key === "srNo") {
      return {
        ...h,
        render: (_row: AwbEntry, idx?: number) => (
          <span className="font-medium text-axc-dark-gray">{idx !== undefined ? idx + 1 : _row.srNo}</span>
        ),
      };
    }
    if (h.key === "selectAwb") {
      const allSelected =
        paginatedData.length > 0 &&
        paginatedData.every((row) => selectedIds.includes(row.awbNumber));

      return {
        ...h,
        label: (
          <div className="flex flex-row-reverse  items-center justify-center gap-1.5 ">
            <span className="text-xs font-bold capitalize  leading-nonewhitespace-nowrap">Select Awb</span>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => {
                if (allSelected) {
                  setSelectedIds((prev) =>
                    prev.filter((id) => !paginatedData.some((row) => row.awbNumber === id))
                  );
                } else {
                  setSelectedIds((prev) =>
                    Array.from(new Set([...prev, ...paginatedData.map((row) => row.awbNumber)]))
                  );
                }
              }}
              className="h-3.5 w-3.5 accent-axc-navy cursor-pointer"
            />
          </div>
        ),
        render: (row: AwbEntry) => (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={selectedIds.includes(row.awbNumber)}
              onChange={() => {
                setSelectedIds((prev) =>
                  prev.includes(row.awbNumber)
                    ? prev.filter((id) => id !== row.awbNumber)
                    : [...prev, row.awbNumber]
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

  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeTags]);
  const dynamicGroups = awbFilterGroups;

  const searchSuggestions = useMemo(() => {
    const list: string[] = [];
    const normalized = data.map(normalizeAwbEntry);

    normalized.forEach((item) => {
      // 1. AWB Numbers
      if (item.awbNumber) list.push(item.awbNumber);
      if (item.forwardingNumber) list.push(item.forwardingNumber);

      // 2. Customer ID / Code
      if (item.customer) list.push(item.customer);
      if (item.customerCode) list.push(item.customerCode);
      if (item.masterCode && item.masterCode !== "NONGST") list.push(item.masterCode);

      // 3. Destination Hub
      if (item.destinationHub) list.push(item.destinationHub);
      if (item.destination) list.push(item.destination);

      // 4. Booking Date
      if (item.bookingDate) list.push(item.bookingDate);

      // 5. Booking Time
      if (item.bookingTime) list.push(item.bookingTime);

      // 6. Service Code / Service
      if (item.serviceCode) list.push(item.serviceCode);
      if (item.service) list.push(item.service);

      // 7. Shipper Name
      if (item.shipper) list.push(item.shipper);

      // 8. Shipper City
      if (item.shipperCity) list.push(item.shipperCity);

      // 9. Consignee Name
      if (item.consignee) list.push(item.consignee);

      // 10. City / State
      if (item.consigneeCity) list.push(item.consigneeCity);
      if (item.consigneeState) list.push(item.consigneeState);

      // 11. AWB State & 12. Status
      if (item.status) list.push(item.status);

      // 13. Company
      if (item.company) list.push(item.company);

      // 14. RUN Number
      if (item.runNumber) list.push(item.runNumber);

      // 15. Calendar Year
      if (item.calendarYear) list.push(String(item.calendarYear));

      // Origin and Vendor
      if (item.origin) list.push(item.origin);
      if (item.vendor) list.push(item.vendor);
    });

    const commonYears = ["2026", "2025", "2024"];
    const commonCompanies = ["AXC Express", "ELS Logistics", "FedEx Cargo", "TCS Express", "DHL Express"];
    const commonDestHubs = ["JFK", "LHR", "DXB", "FRA", "YYZ", "SIN", "DEL", "BOM", "KHI", "LHE", "ISB"];

    return Array.from(new Set([...list, ...commonYears, ...commonCompanies, ...commonDestHubs])).filter(Boolean);
  }, [data]);

  return (
    <div className="relative bg-white p-4 rounded-lg w-full flex-1 flex flex-col min-h-0  shadow-sm border border-axc-border  overflow-x-hidden overflow-y-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-axc-gray/40 [&::-webkit-scrollbar-thumb]:rounded-lg">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          <FilterSearch
            groups={dynamicGroups}
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
        <Button label="New AWB" href="/create-entries" variant="primary" icon={PlusCircleIcon} />
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <CommonTable
          headings={tableHeadings}
          data={paginatedData}
          currentPage={page}
          onPageChange={setPage}
          itemsPerPage={itemsPerPage}
          showScroll={true}
          renderActions={(row: AwbEntry) => (
            <div className="flex items-center gap-2">
              {/* <button
                type="button"
                onClick={() => handleTrack(row)}
                className="inline-flex items-center justify-center rounded-md border border-axc-navy/30 p-1.5 text-axc-navy transition hover:bg-axc-navy/10 cursor-pointer"
                title="Track"
              >
                <MapPin size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleMail(row)}
                className="inline-flex items-center justify-center rounded-md border border-axc-navy/30 p-1.5 text-axc-navy transition hover:bg-axc-navy/10 cursor-pointer"
                title="Email"
              >
                <Mail size={16} />
              </button>
              <button
                type="button"
                onClick={() => handlePdf1(row)}
                className="inline-flex items-center justify-center rounded-md border border-axc-navy/30 p-1.5 text-axc-navy transition hover:bg-axc-navy/10 cursor-pointer"
                title="PDF 1"
              >
                <FileText size={16} />
              </button> */}
              {/* <button
                type="button"
                onClick={() => handlePdf2(row)}
                className="inline-flex items-center justify-center rounded-md border border-axc-navy/30 p-1.5 text-axc-navy transition hover:bg-axc-navy/10 cursor-pointer"
                title="PDF 2"
              >
                <FileText size={16} />
              </button> */}
              {/* <button
                type="button"
                onClick={() => handleInv(row)}
                className="inline-flex items-center justify-center rounded-md border border-axc-navy/30 p-1.5 text-axc-navy transition hover:bg-axc-navy/10 cursor-pointer"
                title="Invoice"
              >
                <FileSpreadsheet size={16} />
              </button> */}
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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        itemName={deleteTarget?.awbNumber}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />

      <DeleteConfirmationDialog
        isOpen={bulkDeleteOpen}
        itemName={`${selectedIds.length} ${selectedIds.length === 1 ? "AWB" : "AWBs"}`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}