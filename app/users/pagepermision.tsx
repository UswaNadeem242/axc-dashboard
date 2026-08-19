"use client";

import { useEffect, useState } from "react";
import { Shield, X } from "lucide-react";

import ToggleSwitch from "./toggleswitch";

export interface PagePermission {
  id: string;
  title: string;
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

interface PagesPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleName?: string;
  initialPermissions: PagePermission[];
  onSave: (permissions: PagePermission[]) => void;
}

const columns: { key: keyof Omit<PagePermission, "id" | "title">; label: string }[] = [
  { key: "view", label: "View" },
  { key: "add", label: "Add" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
];

export default function PagesPermissionsModal({ isOpen, onClose, roleName, initialPermissions, onSave }: PagesPermissionsModalProps) {
  const [permissions, setPermissions] = useState<PagePermission[]>([]);

  useEffect(() => {
    setPermissions(initialPermissions);
  }, [initialPermissions]);

  if (!isOpen) return null;

  const handleToggle = (id: string, field: keyof Omit<PagePermission, "id" | "title">) => {
    setPermissions((previous) => previous.map((permission) => (permission.id === id ? { ...permission, [field]: !permission[field] } : permission)));
  };

  const handleHeaderToggle = (field: keyof Omit<PagePermission, "id" | "title">) => {
    const allChecked = permissions.length > 0 && permissions.every((permission) => permission[field]);
    setPermissions((previous) => previous.map((permission) => ({ ...permission, [field]: !allChecked })));
  };

  const isAllChecked = (field: keyof Omit<PagePermission, "id" | "title">) => {
    return permissions.length > 0 && permissions.every((permission) => permission[field]);
  };

  const toggleAll = (grant: boolean) => {
    setPermissions((previous) => previous.map((permission) => ({ ...permission, view: grant, add: grant, edit: grant, delete: grant })));
  };

  const handleSave = () => {
    onSave(permissions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="flex h-full w-full flex-col bg-white shadow-2xl md:w-[65%] lg:w-[60%] max-w-[1000px]"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between bg-axc-blue px-5 py-3.5">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-white" />
            <h2 className="text-[15px] font-semibold text-white">
              Pages Permissions{roleName ? ` — ${roleName}` : ""}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="text-white hover:text-white/70">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick grant row */}
        <div className="flex shrink-0 items-center justify-between border-b border-axc-border bg-axc-light-bg px-4 py-2.5">
          <span className="text-[11px] font-semibold text-axc-gray">Quick Grant Options:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleAll(true)}
              className="rounded bg-green-100 px-2.5 py-1 text-[11px] font-bold text-green-700 transition-colors hover:bg-green-200"
            >
              ✓ Grant All Rights
            </button>
            <button
              type="button"
              onClick={() => toggleAll(false)}
              className="rounded bg-axc-border px-2.5 py-1 text-[11px] font-bold text-axc-dark-gray transition-colors hover:bg-gray-300"
            >
              ✕ Revoke All
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 flex-1 overflow-auto rounded-md border border-axc-border mx-4">
          <table className="w-full min-w-[700px]">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-axc-border bg-axc-light-bg">
                <th className="w-[45%] px-4 py-3 text-left text-[12px] font-semibold text-axc-dark-gray">Title</th>
                {columns.map((column) => (
                  <th key={column.key} className="border-l border-axc-border px-3 py-3 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <ToggleSwitch checked={isAllChecked(column.key)} onChange={() => handleHeaderToggle(column.key)} />
                      <span className="text-[11px] font-semibold text-axc-dark-gray">{column.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {permissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[12px] text-axc-gray">
                    No permissions available.
                  </td>
                </tr>
              ) : (
                permissions.map((permission) => (
                  <tr key={permission.id} className="border-b border-axc-border bg-white hover:bg-axc-light-bg">
                    <td className="px-4 py-3 text-[12px] font-medium text-axc-dark-gray">{permission.title}</td>
                    {columns.map((column) => (
                      <td key={column.key} className="border-l border-axc-border px-3 py-3">
                        <div className="flex justify-center">
                          <ToggleSwitch checked={permission[column.key]} onChange={() => handleToggle(permission.id, column.key)} />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex shrink-0 justify-end gap-3 px-4 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-[38px] min-w-[100px] rounded-md border border-axc-border bg-white px-4 text-[12px] font-semibold text-axc-dark-gray hover:bg-axc-light-bg"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="h-[38px] min-w-[120px] rounded-md bg-axc-blue px-4 text-[12px] font-semibold text-white hover:bg-axc-blue-dark"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}