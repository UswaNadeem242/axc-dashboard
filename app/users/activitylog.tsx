"use client";

import { useMemo, useState } from "react";
import { FileText, Printer, Trash2 } from "lucide-react";

import SearchInput from "../src/common/search";
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
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const itemsPerPage = 10;

  const filteredLogs = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return logs;
    return logs.filter(
      (log) =>
        log.userName.toLowerCase().includes(value) ||
        log.action.toLowerCase().includes(value) ||
        log.module.toLowerCase().includes(value) ||
        log.ipAddress.toLowerCase().includes(value)
    );
  }, [logs, search]);

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

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="w-[220px]">
          <SearchInput
            placeholder="Search activity logs..."
            value={search}
            onChange={(value) => {
              setSearch(value);
              setCurrentPage(1);
            }}
          />
        </div>

        {selectedIds.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="flex items-center gap-2 rounded-md border border-axc-border px-3 py-2 text-[12px] font-medium text-axc-dark-gray"
            >
              {selectedIds.length} Selected
            </button>

            <div className="[&_button]:cursor-pointer">
              <Dropdown
                title="Actions"
                items={[
                  { label: "Export", icon: <FileText className="h-4 w-4" />, onClick: () => {} },
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