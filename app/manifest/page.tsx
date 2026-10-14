"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, PlusCircleIcon, FileText, Printer, Trash2 } from "lucide-react";

import CommonTable from "../src/common/table";
import { ManifestHeading, ManifestEntry, initialManifestData, HUB_COUNTRY_MAP } from "../src/constant";
import FilterSearch from "../src/common/filtersearch";
import Button from "../src/common/button";
import { showToast } from "../src/common/toast";
import DeleteConfirmationDialog from "../src/common/deleteConfirmation";
import Dropdown from "../src/common/dropdown";

export default function AllManifestPage() {
  const router = useRouter();
  const [data, setData] = useState<ManifestEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const [deleteTarget, setDeleteTarget] = useState<ManifestEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("manifest_entries");
      if (stored) {
        try {
          const parsed: ManifestEntry[] = JSON.parse(stored);
          if (parsed.length > initialManifestData.length) {
            setData(parsed);
            return;
          }
        } catch (error) {
          console.error("Failed to load manifest data:", error);
        }
      }
      setData(initialManifestData);
      localStorage.setItem("manifest_entries", JSON.stringify(initialManifestData));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && data.length > 0) {
      localStorage.setItem("manifest_entries", JSON.stringify(data));
    }
  }, [data]);

  const handleSearchSubmit = (val: string) => {
    const values = val.split(",").map((v) => v.trim()).filter(Boolean);
    if (values.length > 0) {
      setActiveTags((prev) => {
        const newTags = values.filter((v) => !prev.includes(v));
        return [...prev, ...newTags];
      });
      setSearchQuery("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setActiveTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleEdit = (row: ManifestEntry) => {
    router.push(`/manifest/edit-manifest?id=${row.manifestNo}`);
  };

  const handleBag = (row: ManifestEntry) => {
    router.push(`/manifest/edit-bagging?id=${row.manifestNo}`);
  };

  const handleView = (row: ManifestEntry) => {
    router.push(`/manifest/view/${row.manifestNo}`);
  };

  const handleDelete = (row: ManifestEntry) => {
    setDeleteTarget(row);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setData((prev) => prev.filter((item) => item.manifestNo !== deleteTarget.manifestNo));
    setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.manifestNo));
    showToast({ variant: "success", message: "Manifest deleted." });
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
    setData((previous) => previous.filter((item) => !selectedIds.includes(item.manifestNo)));
    showToast({
      variant: "success",
      message: `${count} ${count === 1 ? "manifest" : "manifests"} deleted successfully`,
    });
    setSelectedIds([]);
    setBulkDeleteOpen(false);
  };

  const handleBulkExport = () => {
    const selectedRows = data.filter((item) => selectedIds.includes(item.manifestNo));
    if (selectedRows.length === 0) return;
    const headers = [
      "SR No",
      "Manifest No",
      "Vendor",
      "Vendor Name",
      "Origin Hub Code",
      "Destination Hub Name",
      "Destination Hub Code",
      "Forwarder Code",
      "Run Number",
      "Master EDI Bag No",
      "Manifest Date",
      "Vehicle No",
      "No Of Bags",
      "Weight",
    ];
    const csvContent = [
      headers.join(","),
      ...selectedRows.map((r, idx) =>
        [
          r.srNo ?? idx + 1,
          `"${r.manifestNo || ""}"`,
          `"${r.vendor || ""}"`,
          `"${r.vendorName || ""}"`,
          `"${r.originHubCode || ""}"`,
          `"${r.destinationHubName || ""}"`,
          `"${r.destinationHubCode || ""}"`,
          `"${r.forwarderCode || ""}"`,
          `"${r.runNumber || ""}"`,
          `"${r.masterEdiBagNo || ""}"`,
          `"${r.manifestDate || ""}"`,
          `"${r.vehicleNo || ""}"`,
          r.noOfBags ?? 0,
          `"${r.weight || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `manifests_export_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast({
      variant: "success",
      message: `${selectedRows.length} ${selectedRows.length === 1 ? "manifest" : "manifests"} exported successfully`,
    });
  };

  const parseManifestRange = (input: string): { min: number; max: number } | null => {
    const clean = input.trim();
    const rangeMatch = clean.match(/^(\d{2,15})\s*(?:-|–|—|\.\.|to)\s*(\d{2,15})$/i);
    if (rangeMatch) {
      const num1 = Number(rangeMatch[1]);
      const num2 = Number(rangeMatch[2]);
      if (!isNaN(num1) && !isNaN(num2)) {
        return { min: Math.min(num1, num2), max: Math.max(num1, num2) };
      }
    }
    return null;
  };

  const normalizeManifestEntry = (item: ManifestEntry): ManifestEntry => {
    const mNum = String(item.manifestNo || "");
    const tail = mNum.slice(-4);
    const parts = (item.manifestDate || "").split(/[-/]/);
    const year = parts.length === 3 ? parts[2] : "2026";

    const derivedMasterNo = item.masterNo || (item.masterEdiBagNo && item.masterEdiBagNo.trim() !== "" ? item.masterEdiBagNo : `MAWB-900-${tail}`);
    const derivedAwbNo = item.awbNo || `3012${tail}`;
    const derivedCompany = item.company || (
      item.runNumber?.includes("SIALKOT") ? "AXC Express" :
      item.runNumber?.includes("MUMBAI") || item.originHubCode === "BOM" ? "ELS Logistics" :
      item.originHubCode === "KHI" || item.originHubCode === "ISB" ? "TCS Express" :
      "AXC Express"
    );
    const derivedStatus = item.status || (
      Number(tail) % 4 === 0 ? "Delivered" :
      Number(tail) % 3 === 0 ? "In Scan" :
      Number(tail) % 2 === 0 ? "Manifested" : "Open"
    );

    return {
      ...item,
      masterNo: derivedMasterNo,
      masterEdiBagNo: item.masterEdiBagNo || derivedMasterNo,
      awbNo: derivedAwbNo,
      company: derivedCompany,
      status: derivedStatus,
      calendarYear: item.calendarYear || year,
    };
  };

  const filteredData = data.map(normalizeManifestEntry).filter((item) => {
    const query = searchQuery.trim().toLowerCase();

    const checkMatch = (searchStr: string) => {
      if (!searchStr) return true;
      const raw = searchStr.trim().toLowerCase();

      // 1. Range Check (e.g. "1350 - 1363" or "30121350 - 30121365")
      const range = parseManifestRange(raw);
      if (range) {
        const mNum = Number(item.manifestNo);
        if (!isNaN(mNum) && mNum >= range.min && mNum <= range.max) return true;
        const awbNum = Number(item.awbNo);
        if (!isNaN(awbNum) && awbNum >= range.min && awbNum <= range.max) return true;
      }

      if (raw === "custom") return true;

      // 2. Calendar Date presets
      if (raw === "today" || raw === "yesterday" || raw === "last 7 days") {
        const checkDate = (dateStr?: string) => {
          if (!dateStr) return false;
          const parts = dateStr.split(/[-/]/);
          if (parts.length !== 3) return false;
          const [d, m, y] = parts;

          const itemDate = new Date(Number(y), Number(m) - 1, Number(d));
          itemDate.setHours(0, 0, 0, 0);

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          const last7Days = new Date(today);
          last7Days.setDate(last7Days.getDate() - 7);

          if (raw === "today") return itemDate.getTime() === today.getTime();
          if (raw === "yesterday") return itemDate.getTime() === yesterday.getTime();
          if (raw === "last 7 days") return itemDate >= last7Days && itemDate <= today;
          return false;
        };
        return checkDate(item.manifestDate);
      }

      // 3. Custom Date Range "MMM dd, yyyy - MMM dd, yyyy"
      const dateRangeRegex = /^[a-z]{3} \d{1,2}, \d{4} - [a-z]{3} \d{1,2}, \d{4}$/i;
      if (dateRangeRegex.test(raw)) {
        const parts = raw.split(" - ");
        if (parts.length === 2) {
          const checkCustomDate = (dateStr?: string) => {
            if (!dateStr) return false;
            const dateParts = dateStr.split(/[-/]/);
            if (dateParts.length !== 3) return false;
            const [d, m, y] = dateParts;
            const itemDate = new Date(Number(y), Number(m) - 1, Number(d));
            itemDate.setHours(0, 0, 0, 0);

            const start = new Date(parts[0]);
            start.setHours(0, 0, 0, 0);
            const end = new Date(parts[1]);
            end.setHours(23, 59, 59, 999);

            return itemDate >= start && itemDate <= end;
          };
          return checkCustomDate(item.manifestDate);
        }
      }

      // 4. Calendar Year (e.g. 2026, 2025, 2024)
      if (/^(?:19|20)\d{2}$/.test(raw)) {
        const dateParts = (item.manifestDate || "").split(/[-/]/);
        const itemYear = dateParts.length === 3 ? dateParts[2] : "";
        if (itemYear.includes(raw) || String(item.calendarYear || "").includes(raw)) return true;
      }

      // 5. Hub Country Map check
      if (HUB_COUNTRY_MAP[raw]) {
        const mapping = HUB_COUNTRY_MAP[raw];
        const originUpper = (item.originHubCode || "").toUpperCase();
        const destUpper = (item.destinationHubName || "").toUpperCase();
        if (originUpper === mapping.country || destUpper === mapping.country) return true;
        if (
          mapping.aliases.some(
            (alias) =>
              originUpper.includes(alias.toUpperCase()) ||
              destUpper.includes(alias.toUpperCase()) ||
              (item.destinationHubCode || "").toLowerCase().includes(alias)
          )
        ) {
          return true;
        }
      }

      // 6. Check all 10 Manifest Search Fields:
      // 1. Master No.
      // 2. Origin Hub Code
      // 3. Destination Hub Code & Name
      // 4. RUN Number
      // 5. Manifest No
      // 6. AWB No.
      // 7. Manifest Date
      // 8. Calendar Year
      // 9. Company / Vendor Name
      // 10. Manifest Status
      const fields = [
        item.masterNo,
        item.masterEdiBagNo,
        item.originHubCode,
        item.destinationHubCode,
        item.destinationHubName,
        item.runNumber,
        item.manifestNo,
        item.awbNo,
        item.manifestDate,
        item.calendarYear,
        item.company,
        item.vendorName,
        item.vendor,
        item.status,
        item.vehicleNo,
        item.forwarderCode,
      ];

      return fields.some((f) => f && String(f).toLowerCase().includes(raw));
    };

    const matchesQuery = (() => {
      if (!query) return true;
      if (query.trim().endsWith(",")) return true;

      const range = parseManifestRange(query);
      if (range) {
        return checkMatch(query);
      }

      const queries = query.split(/[,]+/).map((q) => q.trim()).filter(Boolean);
      const termsToUse = queries.length > 0 ? queries : [query];
      return termsToUse.some((q) => checkMatch(q));
    })();

    const matchesTags = activeTags.length === 0 || activeTags.every((tag) => checkMatch(tag.toLowerCase()));

    return matchesQuery && matchesTags;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeTags]);

  const searchSuggestions = React.useMemo(() => {
    const list: string[] = [];
    const normalized = data.map(normalizeManifestEntry);

    normalized.forEach((item) => {
      // 1. Master No.
      if (item.masterNo) list.push(item.masterNo);
      if (item.masterEdiBagNo) list.push(item.masterEdiBagNo);

      // 2. Origin Hub Code
      if (item.originHubCode) list.push(item.originHubCode);

      // 3. Destination Hub Code & Name
      if (item.destinationHubCode) list.push(item.destinationHubCode);
      if (item.destinationHubName) list.push(item.destinationHubName);

      // 4. RUN Number
      if (item.runNumber) list.push(item.runNumber);

      // 5. Manifest No
      if (item.manifestNo) list.push(item.manifestNo);

      // 6. AWB No.
      if (item.awbNo) list.push(item.awbNo);

      // 7. Manifest Date
      if (item.manifestDate) list.push(item.manifestDate);

      // 8. Calendar Year
      if (item.calendarYear) list.push(String(item.calendarYear));

      // 9. Company
      if (item.company) list.push(item.company);
      if (item.vendorName) list.push(item.vendorName);

      // 10. Manifest Status
      if (item.status) list.push(item.status);
    });

    const commonYears = ["2026", "2025", "2024"];
    const commonCompanies = ["AXC Express", "ELS Logistics", "FedEx Cargo", "TCS Express"];
    const commonStatuses = ["Open", "Manifested", "In Scan", "Delivered", "Locked"];

    return Array.from(new Set([...list, ...commonYears, ...commonCompanies, ...commonStatuses])).filter(Boolean);
  }, [data]);

  const filterGroups = React.useMemo(() => {
    const origins = Array.from(new Set(data.map((d) => d.originHubCode).filter(Boolean)));
    const originOptions = origins.map((o) => ({ label: o, value: o }));

    const destinations = Array.from(new Set(data.map((d) => d.destinationHubName).filter(Boolean)));
    const destinationOptions = destinations.map((d) => ({ label: d, value: d }));

    const statuses = ["Open", "Manifested", "In Scan", "Delivered", "Locked"];
    const statusOptions = statuses.map((s) => ({ label: s, value: s }));

    const companies = ["AXC Express", "ELS Logistics", "FedEx Cargo", "TCS Express"];
    const companyOptions = companies.map((c) => ({ label: c, value: c }));

    return [
      {
        group: "By Date",
        options: [
          { label: "Today", value: "Today" },
          { label: "Yesterday", value: "Yesterday" },
          { label: "Last 7 days", value: "Last 7 days" },
          { label: "Custom", value: "Custom" },
        ],
      },
      {
        group: "Origin Hub",
        options: originOptions,
      },
      {
        group: "Destination Hub",
        options: destinationOptions,
      },
      {
        group: "Manifest Status",
        options: statusOptions,
      },
      {
        group: "Company",
        sameColumnAsPrevious: true,
        options: companyOptions,
      },
    ];
  }, [data]);

  return (
    <div className="relative bg-white shadow-sm border border-axc-border p-4  rounded-lg w-full h-[calc(100vh-160px)] flex flex-col  overflow-x-hidden overflow-y-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-axc-gray/40 [&::-webkit-scrollbar-thumb]:rounded-lg">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 ">
        <div className="flex flex-wrap items-center gap-3">
          <FilterSearch
            groups={filterGroups}
            selectedOptions={activeTags}
            onOptionsChange={setActiveTags}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            placeholder="Search manifests..."
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

        <Button label="New Manifest" href="/manifest/new-manifest" variant="primary" icon={PlusCircleIcon} />
      </div>

      {/* {activeTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-2 shrink-0">
          {activeTags.map((tag, idx) => {
            const colors = [
              "border-slate-200 bg-slate-50 text-slate-700",
              "border-axc-red/30 bg-axc-red/5 text-axc-red",
              "border-axc-yellow/30 bg-axc-yellow/5 text-axc-dark-yellow",
              "border-axc-green/30 bg-axc-green/5 text-axc-dark-green",
              "border-axc-sky/30 bg-axc-sky/5 text-axc-sky",
              "border-axc-blue/30 bg-axc-blue/5 text-axc-blue",
              "border-purple-200 bg-purple-50 text-purple-700",
              "border-pink-200 bg-pink-50 text-pink-700",
            ];
            const colorClass = colors[idx % colors.length];

            return (
              <span
                key={tag}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition ${colorClass}`}
              >
                {tag}
                <X
                  size={14}
                  className="cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={() => removeTag(tag)}
                />
              </span>
            );
          })}
        </div>
      )} */}

      <CommonTable
        headings={ManifestHeading}
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onBag={handleBag}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
        itemsPerPage={itemsPerPage}
        selectable
        rowKey="manifestNo"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      <DeleteConfirmationDialog
        isOpen={!!deleteTarget}
        itemName={deleteTarget?.manifestNo}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isLoading={isDeleting}
      />

      <DeleteConfirmationDialog
        isOpen={bulkDeleteOpen}
        itemName={`${selectedIds.length} ${selectedIds.length === 1 ? "manifest" : "manifests"}`}
        onConfirm={handleBulkDeleteConfirm}
        onCancel={() => setBulkDeleteOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
}