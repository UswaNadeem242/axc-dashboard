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
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
  };

  const handleTrack = (row: AwbEntry) => console.log("Track AWB", row.awbNumber);
  const handleMail = (row: AwbEntry) => console.log("Email AWB", row.awbNumber);
  const handlePdf1 = (row: AwbEntry) => console.log("View PDF 1", row.awbNumber);
  const handlePdf2 = (row: AwbEntry) => console.log("View PDF 2", row.awbNumber);
  const handleInv = (row: AwbEntry) => console.log("View INV", row.awbNumber);
  const handleEdit = (row: AwbEntry) => router.push(`/create-entries?edit=${row.awbNumber}`);
  const handleView = (row: AwbEntry) => router.push(`/awb-entries/view/${row.awbNumber}`);

  const filteredData = data.filter((item) => {
    const query = searchQuery.trim().toLowerCase();

    let matchesQuery = true;
    if (query) {
      if (query.trim().endsWith(",")) {
        // Show full table when a comma is typed so the user can look for the next item
        matchesQuery = true;
      } else {
        const searchTerms = query.split(/[,\s]+/).map((q) => q.trim()).filter(Boolean);
        
        if (searchTerms.length > 0) {
        matchesQuery = searchTerms.some((term) => {
          return (
            (item.awbNumber || "").toLowerCase().includes(term) ||
            (item.customer || "").toLowerCase().includes(term) ||
            (item.forwardingNumber || "").toLowerCase().includes(term) ||
            (item.consignee || "").toLowerCase().includes(term) ||
            (item.shipper || "").toLowerCase().includes(term) ||
            (item.origin || "").toLowerCase().includes(term) ||
            (item.destination || "").toLowerCase().includes(term) ||
            (item.product || "").toLowerCase().includes(term) ||
            (item.service || "").toLowerCase().includes(term) ||
            (item.vendor || "").toLowerCase().includes(term) ||
            (item.masterCode || "").toLowerCase().includes(term) ||
            (item.bookingDate || "").toLowerCase().includes(term) ||
            (item.status || "").toLowerCase().includes(term)
          );
        });
      }
    }
  }

  const matchesTags = activeTags.every((tag) => {
      const raw = tag.toLowerCase().replace("origin hub:", "").trim();
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
          // Parse dd/mm/yyyy from item date string
          const parseItemDate = (str?: string) => {
            if (!str) return null;
            const [d, m, y] = str.split("/");
            if (!d || !m || !y) return null;
            const dt = new Date(Number(y), Number(m) - 1, Number(d));
            dt.setHours(0,0,0,0);
            return dt;
          };
          
          // Parse MMM dd, yyyy from tag
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
      if (HUB_COUNTRY_MAP[raw]) {
        const mapping = HUB_COUNTRY_MAP[raw];
        const originUpper = (item.origin || "").trim().toUpperCase();
        if (originUpper === mapping.country) return true;
        return mapping.aliases.some(
          (alias) =>
            (item.origin || "").toLowerCase().includes(alias) ||
            String((item as any).originHubCode || "").toLowerCase().includes(alias) ||
            (item.service || "").toLowerCase().includes(alias) ||
            (item.vendor || "").toLowerCase().includes(alias)
        );
      }
      if (/[,\s]+/.test(raw)) {
        const tagTerms = raw.split(/[,\s]+/).map((q) => q.trim()).filter(Boolean);
        if (tagTerms.length > 0) {
          return tagTerms.some((term) => {
            return (
              (item.origin || "").toLowerCase().includes(term) ||
              (item.awbNumber || "").toLowerCase().includes(term) ||
              (item.customer || "").toLowerCase().includes(term) ||
              (item.service || "").toLowerCase().includes(term) ||
              (item.vendor || "").toLowerCase().includes(term) ||
              (item.destination || "").toLowerCase().includes(term) ||
              (item.status || "").toLowerCase().includes(term) ||
              String((item as any).company || "").toLowerCase().includes(term) ||
              String((item as any).printByCompany || "").toLowerCase().includes(term) ||
              String((item as any).shipmentType || "").toLowerCase().includes(term) ||
              String((item as any).invoiceNote || "").toLowerCase().includes(term)
            );
          });
        }
      }

      return (
        (item.origin || "").toLowerCase().includes(raw) ||
        (item.awbNumber || "").toLowerCase().includes(raw) ||
        (item.customer || "").toLowerCase().includes(raw) ||
        (item.service || "").toLowerCase().includes(raw) ||
        (item.vendor || "").toLowerCase().includes(raw) ||
        (item.destination || "").toLowerCase().includes(raw) ||
        (item.status || "").toLowerCase().includes(raw) ||
        String((item as any).company || "").toLowerCase().includes(raw) ||
        String((item as any).printByCompany || "").toLowerCase().includes(raw) ||
        String((item as any).shipmentType || "").toLowerCase().includes(raw) ||
        String((item as any).invoiceNote || "").toLowerCase().includes(raw)
      );
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
    const customers = data.map(item => item.customer).filter(Boolean);
    const origins = data.map(item => item.origin).filter(Boolean);
    const services = data.map(item => item.service).filter(Boolean);
    const vendors = data.map(item => item.vendor).filter(Boolean);
    return Array.from(new Set([...customers, ...origins, ...services, ...vendors]));
  }, [data]);

  return (
    <div className="relative bg-white p-4 rounded-lg w-full flex-1 flex flex-col min-h-0  shadow-sm border border-axc-border  overflow-x-hidden overflow-y-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-axc-gray/40 [&::-webkit-scrollbar-thumb]:rounded-lg">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 shrink-0">
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
    </div>
  );
}