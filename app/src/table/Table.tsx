import React from "react";
import Status from "../components/Status";
import Button from "../button/Button";
import { Eye, Pencil, Trash2 } from "lucide-react";
interface Column<T> {
  key: keyof T | string;
  label: string;
  align?: "left" | "center" | "right";
}
interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  variant: "orders" | "products" | "analytics";
}
export default function Table<T>({ columns, data, variant }: TableProps<T>): React.JSX.Element {
  const renderCell = (item: any, key: string) => {
    switch (variant) {
      case "orders":
        switch (key) {
          case "type":
            return <span className={`px-2 py-1 rounded-md text-[10px] font-semibold text-white ${item.type === "B2B" ? "bg-[#F59E0B]" : "bg-[#DC2626]"}`}>{item.type}</span>;
          case "status":
            return <Status status={item.status} />;
          case "action":
            return (
              <div className="flex justify-center gap-2">
                <Button variant="outline" className="h-7 w-7 p-0 border-[#F59E0B] text-[#F59E0B] hover:bg-[#FFF7ED]"><Eye size={14} /></Button>
                <Button variant="outline" className="h-7 w-7 p-0 border-[#06B6D4] text-[#06B6D4] hover:bg-[#ECFEFF]"><Pencil size={14} /></Button>
                <Button variant="outline" className="h-7 w-7 p-0 border-[#EF4444] text-[#EF4444] hover:bg-[#FEF2F2]"><Trash2 size={14} /></Button>
              </div>
            );

          default:
            return item[key];
        }
      case "products":
        switch (key) {
          case "type":
            return <span className={`px-2 py-1 rounded-md text-[10px] font-semibold text-white ${item.type === "B2B" ? "bg-[#F59E0B]" : "bg-[#DC2626]"}`}>{item.type}</span>;
          case "growth":
            return <span className="text-[#16A34A] font-semibold">{item.growth}</span>;
          default:
            return item[key];
        }
      case "analytics":
        switch (key) {
          case "growth":
            return <span className="px-2 py-1 rounded-full bg-[#DCFCE7] text-[#16A34A] text-[11px] font-semibold">{item.growth}</span>;
          case "status":
            return <span className="px-2 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[11px] font-semibold">{item.status}</span>;
          default:
            return item[key];
        }
      default:
        return item[key];
    }
  };
  return (
    <div className="overflow-x-auto overflow-y-auto h-[270px] rounded-lg">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
            {columns.map((column) => (
              <th key={String(column.key)} className={`px-4 py-3 text-[11px] font-semibold text-[#94A3B8] ${column.align === "center" ? "text-center" : column.align === "right" ? "text-right" : "text-left"}`}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-[#F1F5F9]">
          {data.length ? (
            data.map((item, index) => (
              <tr key={index} className="hover:bg-[#F8FAFC] transition">
                {columns.map((column) => (
                  <td key={String(column.key)} className={`px-4 py-3 text-[13px] ${column.align === "center" ? "text-center" : column.align === "right" ? "text-right" : "text-left"}`}>
                    {renderCell(item, String(column.key))}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-sm text-gray-500">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}