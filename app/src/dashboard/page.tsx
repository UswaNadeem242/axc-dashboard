"use client";
import { useState } from "react";
import StatCard from "../components/StatCard";
import SalesChart from "../components/SalesChart";
import RecentOrders from "../components/RecentOrders";
import LowStockAlerts from "../components/LowStockAlerts";
import RevenueFilter from "../components/RevenueFilter";
import Button from "../button/Button";
import {
  statsCards as stats,
  tabs,
  orders,
  products,
  analytics,
} from "../constant";
export default function Dashboard(): React.JSX.Element {
  const [chartFilter, setChartFilter] = useState<
    "all" | "b2b" | "b2c"
  >("all");

  const [timeFilter, setTimeFilter] = useState<
    "today" | "week" | "month" | "year" | "date" | "day"
  >("month");

  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDay, setSelectedDay] = useState("Monday");
  return (
    <>
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-linear-to-r from-[#4D8EF7] to-[#2F6BDB] px-6 py-5 text-white">
          <h2 className="text-[18px] font-semibold">
            Welcome User!
          </h2>

          <p className="mt-4 text-[12px] leading-5 text-blue-100">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Cras ultrices dapibus imperdiet.
          </p>
        </div>

        {stats.slice(0, 3).map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.label}
            value={stat.count}
            change={stat.trend}
            positive={stat.isIncrease}
            icon={stat.icon}
            iconBg={stat.iconBgColor}
            iconColor={stat.iconTextColor}
          />
        ))}
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.slice(3).map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.label}
            value={stat.count}
            change={stat.trend}
            positive={stat.isIncrease}
            icon={stat.icon}
            iconBg={stat.iconBgColor}
            iconColor={stat.iconTextColor}
          />
        ))}
      </div>

      <div className="mb-5 rounded-xl border border-[#EAEFF5] bg-white">
        <div className="flex flex-col gap-4 px-6 pt-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-[17px] font-semibold text-[#111827]">
              Revenue Analytics
            </h2>

            <p className="mt-1 text-[12px] text-[#6B7280]">
              Revenue trends across B2B and B2C channels
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={chartFilter === "all"  ? "primary"  : "outline" }
              size="sm"
              className="w-10"
              onClick={() => setChartFilter("all")}
            >
              All
            </Button>
            <Button
              variant={chartFilter === "b2b" ? "primary" : "outline"}
              size="sm"
              className="w-12"
              onClick={() => setChartFilter("b2b")}
            >
              B2B
            </Button>
            <Button
              variant={ chartFilter === "b2c" ? "primary" : "outline"}
              size="sm"
              className="w-12"
              onClick={() => setChartFilter("b2c")}
            >
              B2C
            </Button>
          </div>
        </div>

        <div className="px-6 pt-4">
          <RevenueFilter
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
        </div>
        <div className="px-3 pb-4 pt-2">
          <SalesChart
            filter={chartFilter}
            timeFilter={timeFilter}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedDate={selectedDate}
            selectedDay={selectedDay}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
        <div className="xl:col-span-3">
          <RecentOrders
            tabs={tabs}
            orders={orders}
            products={products}
            analytics={analytics}
          />
        </div>
        <div>
          <LowStockAlerts />
        </div>
      </div>
    </>
  );
}