"use client";

import { useMemo, useState } from "react";
import { FileText, Printer, Trash2 } from "lucide-react";

import SearchInput from "../src/common/search";
import Dropdown from "../src/common/dropdown";
import Pagination from "../src/common/pagination";
import ToggleSwitch from "./toggleswitch";
import DeleteConfirmationDialog from "./deleteConfirmation";

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
  Users: "bg-axc-blue text-white",
  "Roles & Permissions": "bg-axc-yellow text-white",
  Subscription: "bg-axc-green text-white",
  Security: "bg-axc-red text-white",
  Account: "bg-axc-sky text-white",
};

function ModuleBadge({ module }: { module: string }) {
  return (
    <span className={`inline-flex rounded-[3px] px-[10px] py-[4px] text-[10px] font-medium ${MODULE_COLORS[module] ?? "bg-axc-gray text-white"}`}>
      {module}
    </span>
  );
}
function Toast({ msg }: { msg: string }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 rounded-lg bg-axc-green px-4 py-3 text-[13px] font-medium text-white shadow-lg">
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      {msg}
    </div>
  );
}

export default function ActivityLogsTab() {
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const perPage = 10;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

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

  const totalPages = Math.ceil(filteredLogs.length / perPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * perPage, currentPage * perPage);

  const allSelected = paginatedLogs.length > 0 && paginatedLogs.every((log) => selectedIds.includes(log.id));
  const toggleAll = () =>
    setSelectedIds(allSelected ? [] : Array.from(new Set([...selectedIds, ...paginatedLogs.map((log) => log.id)])));
  const toggleSelect = (id: number) =>
    setSelectedIds((previous) => (previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]));

  const toggleStatus = (id: number) => {
    setLogs((previous) => previous.map((log) => (log.id === id ? { ...log, isActive: !log.isActive } : log)));
    showToast("Status updated successfully");
  };

  const handleBulkDeleteConfirm = () => {
    setLogs((previous) => previous.filter((log) => !selectedIds.includes(log.id)));
    showToast(`${selectedIds.length} log(s) deleted successfully`);
    setSelectedIds([]);
    setBulkDeleteOpen(false);
  };

  return (
    <div className="relative">
      {toast && <Toast msg={toast} />}

      <div className="flex flex-wrap items-center gap-3">
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

        <Dropdown
          title="Actions"
          items={[
            { label: "Export", icon: <FileText className="h-4 w-4" />, onClick: () => {} },
            { label: "Print", icon: <Printer className="h-4 w-4" />, onClick: () => window.print() },
            {
              label: "Delete",
              icon: <Trash2 className="h-4 w-4" />,
              onClick: () => {
                if (selectedIds.length === 0) {
                  showToast("Please select at least one log to delete");
                  return;
                }
                setBulkDeleteOpen(true);
              },
            },
          ]}
        />

        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="flex items-center gap-2 rounded-md border border-axc-border px-3 py-2 text-[12px] font-medium text-axc-dark-gray"
          >
            {selectedIds.length} Selected
          </button>
        )}
      </div>

      <div className="mt-4 overflow-x-auto rounded-[8px] border border-axc-border">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="h-[42px] border-b border-axc-border bg-axc-light-bg text-[12px] font-semibold text-axc-dark-gray">
              <th className="w-10 px-3 py-3">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-3.5 w-3.5 accent-axc-blue" />
              </th>
              <th className="px-4 py-3 text-left">User Name</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">Module</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">IP Address</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-[12px] text-axc-gray">
                  No activity logs found
                </td>
              </tr>
            ) : (
              paginatedLogs.map((log) => (
                <tr key={log.id} className="h-[42px] border-b border-axc-border text-[12px] text-axc-dark-gray transition-colors hover:bg-axc-light-bg">
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(log.id)}
                      onChange={() => toggleSelect(log.id)}
                      className="h-3.5 w-3.5 accent-axc-blue"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{log.userName}</td>
                  <td className="px-4 py-3">{log.action}</td>
                  <td className="px-4 py-3">
                    <ModuleBadge module={log.module} />
                  </td>
                  <td className="px-4 py-3">{log.date}</td>
                  <td className="px-4 py-3 font-mono">{log.ipAddress}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <ToggleSwitch checked={log.isActive} onChange={() => toggleStatus(log.id)} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end mt-2">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      <DeleteConfirmationDialog
        isOpen={bulkDeleteOpen}
        itemName={`${selectedIds.length} selected activity log(s)`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
      />
    </div>
  );
}