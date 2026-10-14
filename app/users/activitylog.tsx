"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, Printer, Trash2 } from "lucide-react";

import FilterSearch, { FilterGroup } from "../src/common/filtersearch";
import Dropdown from "../src/common/dropdown";
import ToggleSwitch from "./toggleswitch";
import DeleteConfirmationDialog from "../src/common/deleteConfirmation";
import CommonTable from "../src/common/table";
import { showToast } from "../src/common/toast";

interface ActivityLog {
  id: number;
  userName: string;
  action: string;
  module: string;
  date: string;
  ipAddress: string;
  isActive: boolean;
}

const initialLogs: ActivityLog[] = [
  { id: 1, userName: "Ali Ahmed", action: "User Created", module: "Users", date: "18 Aug 2026, 10:30 AM", ipAddress: "192.168.1.10", isActive: true },
  { id: 2, userName: "Sara Khan", action: "Profile Updated", module: "Users", date: "18 Aug 2026, 11:15 AM", ipAddress: "192.168.1.11", isActive: true },
  { id: 3, userName: "Usman Malik", action: "Permission Changed", module: "Roles & Permissions", date: "17 Aug 2026, 03:20 PM", ipAddress: "192.168.1.12", isActive: false },
  { id: 4, userName: "Ayesha Noor", action: "Subscription Updated", module: "Subscription", date: "17 Aug 2026, 01:45 PM", ipAddress: "192.168.1.13", isActive: true },
  { id: 5, userName: "Ali Ahmed", action: "Login", module: "Security", date: "16 Aug 2026, 09:10 AM", ipAddress: "192.168.1.10", isActive: true },
];

const MODULE_COLORS: Record<string, string> = {
  Users: "bg-axc-blue/10 text-axc-blue",
  "Roles & Permissions": "bg-axc-yellow/10 text-axc-yellow",
  Subscription: "bg-axc-green/10 text-axc-green",
  Security: "bg-axc-red/10 text-axc-red",
  Account: "bg-axc-sky/10 text-axc-navy",
};

function ModuleBadge({ module }: { module: string }) {
  return (
    <span className={`inline-flex rounded-full px-[10px] py-[4px] text-[10px] font-medium ${MODULE_COLORS[module] ?? "bg-axc-gray text-white"}`}>
      {module}
    </span>
  );
}

export default function ActivityLogsTab() {
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const itemsPerPage = 10;

  const dynamicGroups: FilterGroup[] = useMemo(() => {
    const modules = Array.from(new Set(logs.map((l) => l.module).filter(Boolean)));

    return [
      {
        group: "Module",
        options: (modules.length > 0 ? modules : ["Users", "Roles & Permissions", "Subscription", "Security", "Account"]).map((m) => ({
          label: m,
          value: m,
        })),
      },
      {
        group: "Status",
        options: [
          { label: "Active", value: "Active" },
          { label: "Inactive", value: "Inactive" },
        ],
      },
    ];
  }, [logs]);

  const searchSuggestions = useMemo(() => {
    const users = logs.map((l) => l.userName).filter(Boolean);
    const actions = logs.map((l) => l.action).filter(Boolean);
    const modules = logs.map((l) => l.module).filter(Boolean);
    return Array.from(new Set([...users, ...actions, ...modules]));
  }, [logs]);

  const handleSearchSubmit = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;

    if (!activeTags.includes(trimmed)) {
      setActiveTags((prev) => [...prev, trimmed]);
      setSearchQuery("");
      setCurrentPage(1);
    }
  };

  const handleTagsChange = (newTags: string[]) => {
    const addedTag = newTags.find((tag) => !activeTags.includes(tag));

    if (addedTag) {
      const group = dynamicGroups.find((g) => g.options.some((o) => o.value === addedTag));
      if (group) {
        const groupValues = group.options.map((o) => o.value);
        const filteredTags = newTags.filter((tag) => tag === addedTag || !groupValues.includes(tag));
        setActiveTags(filteredTags);
        setCurrentPage(1);
        return;
      }
    }

    setActiveTags(newTags);
    setCurrentPage(1);
  };

  const filteredLogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return logs.filter((log) => {
      let matchesQuery = true;
      if (query) {
        if (query.endsWith(",")) {
          matchesQuery = true;
        } else {
          const searchTerms = query.split(/[,\s]+/).map((t) => t.trim()).filter(Boolean);
          if (searchTerms.length > 0) {
            matchesQuery = searchTerms.some((term) => {
              const statusStr = log.isActive ? "active" : "inactive";
              return (
                log.userName.toLowerCase().includes(term) ||
                log.action.toLowerCase().includes(term) ||
                log.module.toLowerCase().includes(term) ||
                log.ipAddress.toLowerCase().includes(term) ||
                statusStr.includes(term)
              );
            });
          }
        }
      }

      const matchesTags = activeTags.every((tag) => {
        const raw = tag.toLowerCase().trim();
        if (raw === "active") return log.isActive === true;
        if (raw === "inactive") return log.isActive === false;

        return (
          log.userName.toLowerCase().includes(raw) ||
          log.action.toLowerCase().includes(raw) ||
          log.module.toLowerCase().includes(raw) ||
          log.ipAddress.toLowerCase().includes(raw)
        );
      });

      return matchesQuery && matchesTags;
    });
  }, [logs, searchQuery, activeTags]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTags]);

  const paginatedLogs = useMemo(() => {
    return filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredLogs, currentPage]);

  const toggleStatus = (id: number) => {
    setLogs((previous) => previous.map((log) => (log.id === id ? { ...log, isActive: !log.isActive } : log)));
    showToast({ variant: "success", message: "Status updated successfully" });
  };

  const handleBulkDeleteConfirm = () => {
    const count = selectedIds.length;
    setLogs((previous) => previous.filter((log) => !selectedIds.includes(log.id)));
    showToast({
      variant: "success",
      message: `${count} ${count === 1 ? "log" : "logs"} deleted successfully`,
    });
    setSelectedIds([]);
    setBulkDeleteOpen(false);
  };

  const allSelected = paginatedLogs.length > 0 && paginatedLogs.every((row) => selectedIds.includes(row.id));

  const toggleAllSelection = () => {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !paginatedLogs.some((row) => row.id === id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...paginatedLogs.map((row) => row.id)])));
    }
  };

  const toggleRowSelection = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const headings = [
    {
      label: (
        <input
          type="checkbox"
          checked={allSelected}
          onChange={toggleAllSelection}
          className="h-3.5 w-3.5 accent-axc-navy cursor-pointer"
        />
      ),
      key: "selectLog",
      className: "w-10 !px-2",
      render: (row: ActivityLog) => (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={selectedIds.includes(row.id)}
            onChange={() => toggleRowSelection(row.id)}
            className="h-3.5 w-3.5 accent-axc-navy cursor-pointer"
          />
        </div>
      ),
    },
    { label: "User Name", key: "userName" },
    { label: "Action", key: "action", truncate: false, render: (row: ActivityLog) => row.action },
    { label: "Module", key: "module", render: (row: ActivityLog) => <ModuleBadge module={row.module} /> },
    { label: "Date", key: "date", truncate: false },
    { label: "IP Address", key: "ipAddress", render: (row: ActivityLog) => <span className="font-mono">{row.ipAddress}</span> },
    {
      label: "Status",
      key: "status",
      render: (row: ActivityLog) => (
        <div className="flex justify-center">
          <ToggleSwitch checked={row.isActive} onChange={() => toggleStatus(row.id)} />
        </div>
      ),
    },
  ];

  const handleBulkExport = () => {
    const selectedRows = logs.filter((l) => selectedIds.includes(l.id));
    if (selectedRows.length === 0) return;
    const headers = ["ID", "User Name", "Action", "Module", "Date", "IP Address", "Status"];
    const csvContent = [
      headers.join(","),
      ...selectedRows.map((l) =>
        [
          l.id,
          `"${l.userName}"`,
          `"${l.action}"`,
          `"${l.module}"`,
          `"${l.date}"`,
          `"${l.ipAddress}"`,
          `"${l.isActive ? "Active" : "Inactive"}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `activity_logs_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast({
      variant: "success",
      message: `${selectedRows.length} ${selectedRows.length === 1 ? "log" : "logs"} exported successfully`,
    });
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-4 shrink-0">
        <FilterSearch
          groups={dynamicGroups}
          selectedOptions={activeTags}
          onOptionsChange={handleTagsChange}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          placeholder="Search activity logs..."
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

      <CommonTable
        headings={headings}
        data={filteredLogs}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        showScroll={false}
        rowKey="id"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      <DeleteConfirmationDialog
        isOpen={bulkDeleteOpen}
        itemName={`${selectedIds.length} ${selectedIds.length === 1 ? "activity log" : "activity logs"}`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
      />
    </>
  );
}