"use client";
import React, { useState } from "react";
import Table from "../table/Table";
import Button from "../button/Button";
import DropdownFilter from "../dropdownfilter/Dropdownfilter";
import {
  orderColumns,
  productColumns,
  analyticsColumns,
  typeOptions,
  statusOptions,
} from "../constant";
interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
}
interface Order {
  id: string;
  customer: string;
  type: "B2B" | "B2C";
  amount: string;
  date: string;
  status: "Completed" | "Processing" | "Pending" | "Cancel";
}
interface Product {
  product: string;
  category: string;
  type: "B2B" | "B2C";
  units: string;
  revenue: string;
  growth: string;
}
interface Analytics {
  metric: string;
  total: string;
  b2b: string;
  b2c: string;
  growth: string;
  status: "Increasing" | "Stable" | "Improving" | "Low";
}
interface RecentOrdersProps {
  tabs: Tab[];
  orders: Order[];
  products: Product[];
  analytics: Analytics[];
}

export default function RecentOrders({ tabs, orders,products, analytics,}: RecentOrdersProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState("recent");
  const [typeFilter, setTypeFilter] =
    useState<"All" | "B2B" | "B2C">("All");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [dateFilter, setDateFilter] =
    useState("");
  const filteredOrders = orders
    .filter(
      (order) =>
        typeFilter === "All" ||
        order.type === typeFilter
    )
    .filter(
      (order) =>
        statusFilter === "All" ||
        order.status === statusFilter
    )
    .filter(
      (order) =>
        dateFilter === "" ||
        order.date === dateFilter
    );
  const filteredProducts = products.filter(
    (item) =>
      typeFilter === "All" ||
      item.type === typeFilter
  );
  return (
    <div className="bg-white rounded-xl border border-[#EAEFF5] shadow-sm p-5 w-full h-[430px]">
      <div className="flex items-center gap-2 mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              size="sm"
              variant={
                activeTab === tab.id
                  ? "primary"
                  : "outline"
              }
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2"
            >
              <Icon size={15} />
              {tab.label}
            </Button>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mb-4">
        <DropdownFilter
          value={typeFilter}
          options={typeOptions}
          onChange={(value) =>
            setTypeFilter(
              value as "All" | "B2B" | "B2C"
            )
          }
          className="h-9 text-[12px]"
        />
        <DropdownFilter
          value={statusFilter}
          options={statusOptions}
          onChange={setStatusFilter}
          className="h-9 text-[12px]"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) =>
            setDateFilter(e.target.value)
          }
          className="h-9 px-3 rounded-lg border border-[#E5E7EB] text-[12px]"
        />
      </div>
            {activeTab === "recent" && (
        <div>
          <h3 className="text-[16px] font-semibold text-[#111827] mb-3 h-[24px]">
            Recent Orders
          </h3>

          <Table<Order>
            variant="orders"
            columns={orderColumns}
            data={filteredOrders}
          />
        </div>
      )}

      {activeTab === "top" && (
        <div>
          <h3 className="text-[16px] font-semibold text-[#111827] mb-3 h-[24px]">
            Top Products
          </h3>

          <Table<Product>
            variant="products"
            columns={productColumns}
            data={filteredProducts}
          />
        </div>
      )}
      {activeTab === "analytics" && (
        <div>
          <h3 className="text-[16px] font-semibold text-[#111827] mb-3 h-[24px]">
            Order Analytics
          </h3>
          <Table<Analytics>
            variant="analytics"
            columns={analyticsColumns}
            data={analytics}
          />
        </div>
      )}
    </div>
  );
}