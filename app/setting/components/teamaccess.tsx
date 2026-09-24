"use client";
import React, { useState } from "react";
import {
  Users,
  UserCheck,
  UserPlus,
  Crown,
  Pencil,
  Eye,
  Trash2,
  Check,
  Minus,
  PlusCircleIcon,
} from "lucide-react";
import { PanelHeader } from "./settingform";
import Button from "../../src/common/button";
import { showToast } from "../../src/common/toast";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  userType: string;
  roleInOrg: "Admin" | "Editor" | "Viewer";
  lastLogin: string;
  status: "Active" | "Invited" | "Suspended";
}

const DUMMY_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Ayesha Khan",
    email: "ayesha.khan@axc.com",
    userType: "Employee",
    roleInOrg: "Admin",
    lastLogin: "24 Sep 2026, 10:12 AM",
    status: "Active",
  },
  {
    id: "2",
    name: "Bilal Ahmed",
    email: "bilal.ahmed@axc.com",
    userType: "Employee",
    roleInOrg: "Editor",
    lastLogin: "23 Sep 2026, 04:45 PM",
    status: "Active",
  },
  {
    id: "3",
    name: "Sara Malik",
    email: "sara.malik@axc.com",
    userType: "Contractor",
    roleInOrg: "Viewer",
    lastLogin: "20 Sep 2026, 09:30 AM",
    status: "Invited",
  },
  {
    id: "4",
    name: "Usman Tariq",
    email: "usman.tariq@axc.com",
    userType: "Employee",
    roleInOrg: "Editor",
    lastLogin: "18 Sep 2026, 02:15 PM",
    status: "Suspended",
  },
];

const STATS = [
  {
    label: "Total Members",
    value: DUMMY_TEAM_MEMBERS.length,
    icon: Users,
    bg: "bg-blue-50",
    color: "text-axc-navy",
  },
  {
    label: "Active Users",
    value: DUMMY_TEAM_MEMBERS.filter((m) => m.status === "Active").length,
    icon: UserCheck,
    bg: "bg-green-50",
    color: "text-green-600",
  },
  {
    label: "Pending Invites",
    value: DUMMY_TEAM_MEMBERS.filter((m) => m.status === "Invited").length,
    icon: UserPlus,
    bg: "bg-orange-50",
    color: "text-orange-500",
  },
];

const ROLES = [
  {
    title: "Admin",
    icon: Crown,
    color: "text-axc-red",
    description: "Full access on all settings and data",
    permissions: ["Full access", "Manage team", "Billing access", "Security settings"],
  },
  {
    title: "Editor",
    icon: Pencil,
    color: "text-axc-navy",
    description: "Can edit and manage content",
    permissions: ["Read & write", "Manage content", "View analytics", "Export data"],
  },
  {
    title: "Viewer",
    icon: Eye,
    color: "text-green-600",
    description: "Read-only access",
    permissions: ["Read-only", "View content", "View analytics", "Download reports"],
  },
];

function Checkbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
}) {
  const active = checked || indeterminate;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      onClick={onChange}
      className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 outline-none transition cursor-pointer ${
        active ? "border-axc-navy bg-axc-navy text-white" : "border-gray-400 bg-white hover:border-axc-navy"
      }`}
    >
      {indeterminate ? (
        <Minus size={11} strokeWidth={3} />
      ) : checked ? (
        <Check size={11} strokeWidth={3} />
      ) : null}
    </button>
  );
}

function StatusBadge({ status }: { status: TeamMember["status"] }) {
  const styles: Record<TeamMember["status"], string> = {
    Active: "bg-axc-green/10 text-axc-green",
    Invited: "bg-axc-yellow/10 text-axc-yellow",
    Suspended: "bg-axc-red/10 text-axc-red",
  };
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function TeamAccess() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allSelected = selectedIds.length === DUMMY_TEAM_MEMBERS.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : DUMMY_TEAM_MEMBERS.map((m) => m.id));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleManageRoles = () => {
    if (selectedIds.length === 0) return;
    showToast({
      variant: "success",
      message: `Managing roles for ${selectedIds.length} member${selectedIds.length > 1 ? "s" : ""}`,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col">
      <PanelHeader title="Team & Access" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 m-6">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-4 flex items-center justify-between gap-4 rounded-md border border-axc-border"
            >
              <div className="flex flex-col gap-1">
                <span className="text-regular-small text-axc-gray">{stat.label}</span>
                <span className="text-xl font-bold text-axc-dark-gray">{stat.value}</span>
              </div>
              <span
                className={`h-10 w-10 rounded-md flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}
              >
                <Icon size={18} />
              </span>
            </div>
          );
        })}
      </div>

      <div className="mx-6 mb-6 p-4 rounded-md border border-axc-border">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="font-bold text-axc-dark-gray">Team Members</h3>
          <Button
            label="Manage Roles"
            icon={PlusCircleIcon}
            variant="primary"
            onClick={handleManageRoles}
            disabled={selectedIds.length === 0}
          />
        </div>

        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="border-b border-axc-border text-left">
                <th className="py-2.5 pr-3 w-8">
                  <Checkbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} />
                </th>
                <th className="py-2.5 px-3 text-regular-medium text-axc-dark-gray">User Name</th>
                <th className="py-2.5 px-3 text-regular-medium text-axc-dark-gray">Email</th>
                <th className="py-2.5 px-3 text-regular-medium text-axc-dark-gray">User Type</th>
                <th className="py-2.5 px-3 text-regular-medium text-axc-dark-gray">Role in Org</th>
                <th className="py-2.5 px-3 text-regular-medium text-axc-dark-gray">Last Login</th>
                <th className="py-2.5 px-3 text-regular-medium text-axc-dark-gray">Status</th>
                <th className="py-2.5 px-3 text-regular-medium text-axc-dark-gray">Action</th>
              </tr>
            </thead>
            <tbody>
              {DUMMY_TEAM_MEMBERS.map((member) => (
                <tr key={member.id} className="border-b border-axc-border last:border-b-0">
                  <td className="py-3 pr-3">
                    <Checkbox
                      checked={selectedIds.includes(member.id)}
                      onChange={() => toggleOne(member.id)}
                    />
                  </td>
                  <td className="py-3 px-3 text-regular-small font-medium text-axc-dark-gray whitespace-nowrap">
                    {member.name}
                  </td>
                  <td className="py-3 px-3 text-regular-small text-axc-gray whitespace-nowrap">
                    {member.email}
                  </td>
                  <td className="py-3 px-3 text-regular-small text-axc-gray whitespace-nowrap">
                    {member.userType}
                  </td>
                  <td className="py-3 px-3 text-regular-small text-axc-gray whitespace-nowrap">
                    {member.roleInOrg}
                  </td>
                  <td className="py-3 px-3 text-regular-small text-axc-gray whitespace-nowrap">
                    {member.lastLogin}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <StatusBadge status={member.status} />
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        title="Edit"
                        className="text-axc-gray hover:text-axc-navy transition cursor-pointer"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        title="Remove"
                        className="text-axc-gray hover:text-axc-red transition cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mx-6 mb-6">
        <h3 className="font-bold text-axc-dark-gray mb-4">Roles & Permissions</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.title}
                className="p-4 rounded-md border border-axc-border flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} className={role.color} />
                  <span className="font-bold text-axc-dark-gray">{role.title}</span>
                </div>
                <p className="text-regular-small text-axc-gray">{role.description}</p>
                <ul className="flex flex-col gap-1 mt-1">
                  {role.permissions.map((perm) => (
                    <li
                      key={perm}
                      className="text-regular-small text-axc-navy flex items-center gap-1.5"
                    >
                      <span className="h-1 w-1 rounded-full bg-axc-navy shrink-0" />
                      {perm}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}