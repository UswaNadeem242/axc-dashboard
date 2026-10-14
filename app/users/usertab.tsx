"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Eye, FileText, PlusCircleIcon, Printer, Trash2, X } from "lucide-react";

import FilterSearch, { FilterGroup } from "../src/common/filtersearch";
import Button from "../src/common/button";
import Dropdown from "../src/common/dropdown";
import ToggleSwitch from "./toggleswitch";
import AddUserModal from "./adduser";
import DeleteConfirmationDialog from "../src/common/deleteConfirmation";
import CommonTable from "../src/common/table";
import { showToast } from "../src/common/toast";

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  store: string;
  lastLogin: string;
  isActive: boolean;
}

const initialUsers: UserRow[] = [
  { id: 1, name: "Ali Ahmed", email: "ali.ahmed@axc.com", role: "Super Admin", store: "Lahore Hub", lastLogin: "18 Aug 2026, 10:30 AM", isActive: true },
  { id: 2, name: "Sara Khan", email: "sara.khan@axc.com", role: "Admin", store: "Karachi Hub", lastLogin: "18 Aug 2026, 09:12 AM", isActive: true },
  { id: 3, name: "Usman Malik", email: "usman.malik@axc.com", role: "Manager", store: "Islamabad Hub", lastLogin: "17 Aug 2026, 04:45 PM", isActive: false },
  { id: 4, name: "Ayesha Noor", email: "ayesha.noor@axc.com", role: "Staff", store: "Multan Hub", lastLogin: "17 Aug 2026, 02:20 PM", isActive: true },
];

const ROLE_COLORS: Record<string, string> = {
  "Super Admin": "bg-axc-blue/10 text-axc-blue",
  Admin: "bg-axc-sky/10 text-axc-navy",
  Manager: "bg-axc-yellow/10 text-axc-yellow",
  Staff: "bg-axc-green/10 text-axc-green",
  Sales: "bg-axc-red/10 text-axc-red",
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`inline-flex rounded-full px-[10px] py-[4px] text-[10px] font-medium ${ROLE_COLORS[role] ?? "bg-axc-gray text-white"}`}>
      {role}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-axc-border pb-2">
      <span className="font-medium text-axc-gray">{label}</span>
      <span className="text-right text-axc-dark-gray">{value}</span>
    </div>
  );
}

function ViewUserModal({ user, onClose }: { user: UserRow | null; onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (user) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [user]);

  if (!user) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  return (
    <div
      className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={handleClose}
    >
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-5xl flex-col overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-axc-border bg-white px-6 py-4">
          <h2 className="text-regular-medium font-semibold text-axc-dark-gray">User Details</h2>
          <button type="button" onClick={handleClose} className="rounded-md p-1 transition-colors hover:bg-axc-light-bg">
            <X className="h-5 w-5 text-axc-gray" />
          </button>
        </div>
        <div className="flex-1 space-y-3 px-6 py-6 text-[12px]">
          <DetailRow label="Name" value={user.name} />
          <DetailRow label="Email" value={user.email} />
          <DetailRow label="Role" value={<RoleBadge role={user.role} />} />
          <DetailRow label="Store" value={user.store} />
          <DetailRow label="Last Login" value={user.lastLogin} />
          <DetailRow label="Status" value={user.isActive ? "Active" : "Inactive"} />
        </div>
        <div className="flex shrink-0 justify-end gap-3 border-t border-axc-border px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="h-[38px] min-w-[100px] rounded-md border border-axc-border bg-white px-4 text-[12px] font-semibold text-axc-dark-gray hover:bg-axc-light-bg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserTab() {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<UserRow | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserRow | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const itemsPerPage = 10;

  const dynamicGroups: FilterGroup[] = useMemo(() => {
    const roles = Array.from(new Set(users.map((u) => u.role).filter(Boolean)));
    const stores = Array.from(new Set(users.map((u) => u.store).filter((s) => s && s !== "-")));

    return [
      {
        group: "Role",
        options: (roles.length > 0 ? roles : ["Super Admin", "Admin", "Manager", "Staff", "Sales"]).map((r) => ({
          label: r,
          value: r,
        })),
      },
      {
        group: "Status",
        options: [
          { label: "Active", value: "Active" },
          { label: "Inactive", value: "Inactive" },
        ],
      },
      {
        group: "Store / Hub",
        options: (stores.length > 0 ? stores : ["Lahore Hub", "Karachi Hub", "Islamabad Hub", "Multan Hub"]).map((s) => ({
          label: s,
          value: s,
        })),
      },
    ];
  }, [users]);

  const searchSuggestions = useMemo(() => {
    const names = users.map((u) => u.name).filter(Boolean);
    const emails = users.map((u) => u.email).filter(Boolean);
    const roles = users.map((u) => u.role).filter(Boolean);
    const stores = users.map((u) => u.store).filter((s) => s && s !== "-");
    return Array.from(new Set([...names, ...roles, ...stores, ...emails]));
  }, [users]);

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

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return users.filter((user) => {
      let matchesQuery = true;
      if (query) {
        if (query.endsWith(",")) {
          matchesQuery = true;
        } else {
          const searchTerms = query.split(/[,\s]+/).map((t) => t.trim()).filter(Boolean);
          if (searchTerms.length > 0) {
            matchesQuery = searchTerms.some((term) => {
              const statusStr = user.isActive ? "active" : "inactive";
              return (
                user.name.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term) ||
                user.role.toLowerCase().includes(term) ||
                user.store.toLowerCase().includes(term) ||
                statusStr.includes(term)
              );
            });
          }
        }
      }

      const matchesTags = activeTags.every((tag) => {
        const raw = tag.toLowerCase().trim();
        if (raw === "active") return user.isActive === true;
        if (raw === "inactive") return user.isActive === false;

        return (
          user.name.toLowerCase().includes(raw) ||
          user.email.toLowerCase().includes(raw) ||
          user.role.toLowerCase().includes(raw) ||
          user.store.toLowerCase().includes(raw)
        );
      });

      return matchesQuery && matchesTags;
    });
  }, [users, searchQuery, activeTags]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTags]);

  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredUsers, currentPage]);

  const toggleStatus = (id: number) => {
    setUsers((previous) => previous.map((user) => (user.id === id ? { ...user, isActive: !user.isActive } : user)));
    showToast({ variant: "success", message: "Status updated successfully" });
  };

  const handleConfirmDelete = () => {
    if (!deleteUser) return;
    setUsers((previous) => previous.filter((user) => user.id !== deleteUser.id));
    showToast({ variant: "success", message: "User deleted successfully" });
    setDeleteUser(null);
  };

  const handleBulkDeleteConfirm = () => {
    const count = selectedIds.length;
    setUsers((previous) => previous.filter((user) => !selectedIds.includes(user.id)));
    showToast({
      variant: "success",
      message: `${count} ${count === 1 ? "user" : "users"} deleted successfully`,
    });
    setSelectedIds([]);
    setBulkDeleteOpen(false);
  };

  const handleAddUser = (formData: {
    name: string;
    email: string;
    role: string;
    assignedHub: string;
    status: boolean;
  }) => {
    setUsers((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        store: formData.assignedHub || "-",
        lastLogin: "-",
        isActive: formData.status,
      },
    ]);
    showToast({ variant: "success", message: "User created successfully" });
    setIsAddUserOpen(false);
  };

  const allSelected = paginatedUsers.length > 0 && paginatedUsers.every((row) => selectedIds.includes(row.id));

  const toggleAllSelection = () => {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !paginatedUsers.some((row) => row.id === id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...paginatedUsers.map((row) => row.id)])));
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
      key: "selectUser",
      className: "w-10 !px-2",
      render: (row: UserRow) => (
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
    { label: "User Name", key: "name" },
    { label: "Email Address", key: "email", truncate: false },
    { label: "Role", key: "role", render: (row: UserRow) => <RoleBadge role={row.role} /> },
    { label: "Store", key: "store", truncate: false },
    { label: "Last Login", key: "lastLogin", truncate: false },
    {
      label: "Status",
      key: "status",
      render: (row: UserRow) => (
        <div className="flex justify-center">
          <ToggleSwitch checked={row.isActive} onChange={() => toggleStatus(row.id)} />
        </div>
      ),
    },
    { label: "Action", key: "action" },
  ];

  const renderActions = (row: UserRow) => (
    <div className="flex justify-center gap-2">
      <button
        type="button"
        onClick={() => setViewingUser(row)}
        className="flex h-7 w-7 items-center justify-center rounded border border-axc-yellow text-axc-yellow cursor-pointer hover:bg-axc-light-bg"
        title="View"
      >
        <Eye className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => setDeleteUser(row)}
        className="flex h-7 w-7 items-center justify-center rounded border border-axc-red text-axc-red cursor-pointer hover:bg-red-50"
        title="Delete"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );

  const handleBulkExport = () => {
    const selectedRows = users.filter((u) => selectedIds.includes(u.id));
    if (selectedRows.length === 0) return;
    const headers = ["ID", "User Name", "Email Address", "Role", "Store", "Last Login", "Status"];
    const csvContent = [
      headers.join(","),
      ...selectedRows.map((u) =>
        [
          u.id,
          `"${u.name}"`,
          `"${u.email}"`,
          `"${u.role}"`,
          `"${u.store}"`,
          `"${u.lastLogin}"`,
          `"${u.isActive ? "Active" : "Inactive"}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `users_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast({
      variant: "success",
      message: `${selectedRows.length} ${selectedRows.length === 1 ? "user" : "users"} exported successfully`,
    });
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          <FilterSearch
            groups={dynamicGroups}
            selectedOptions={activeTags}
            onOptionsChange={handleTagsChange}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            placeholder="Search users..."
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
                    { label: "Export", icon: <FileText className="h-4 w-4 " />, onClick: handleBulkExport },
                    { label: "Print", icon: <Printer className="h-4 w-4 " />, onClick: () => window.print() },
                    {
                      label: "Delete",
                      icon: <Trash2 className="h-4 w-4 " />,
                      onClick: () => setBulkDeleteOpen(true),
                    },
                  ]}
                />
              </div>
            </>
          )}
        </div>

        <Button
          label="Add User"
          onClick={() => setIsAddUserOpen(true)}
          variant="primary"
          icon={PlusCircleIcon}
        />
      </div>

      <CommonTable
        headings={headings}
        data={filteredUsers}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        showScroll={false}
        renderActions={renderActions}
        rowKey="id"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        emptyMessage="No users found"
      />

      <AddUserModal isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} onSave={handleAddUser} />

      <ViewUserModal user={viewingUser} onClose={() => setViewingUser(null)} />

      <DeleteConfirmationDialog
        isOpen={Boolean(deleteUser)}
        itemName={deleteUser?.name}
        onCancel={() => setDeleteUser(null)}
        onConfirm={handleConfirmDelete}
      />

      <DeleteConfirmationDialog
        isOpen={bulkDeleteOpen}
        itemName={`${selectedIds.length} ${selectedIds.length === 1 ? "user" : "users"}`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
      />
    </>
  );
}