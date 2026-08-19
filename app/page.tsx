"use client";

import {
  ArrowRight,
  Box,
  ChevronRight,
  Mail,
  MessageCircle,
  MessageSquare,
  Package,
  Settings,
  TrendingUp,
  PieChart as PieIcon,
  Users,
  DollarSign,
  Coins,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import CommonTable from "./src/common/table";
import { headings, flightData, ticket, quickActions, statsCards } from "./src/constant";
import Card from "./src/common/cardbase";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import ChartArea from "./src/component/analytic/areachart";
import { ChartPie } from "./src/component/analytic/donet";




export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      {/* Title section handled by DashboardLayout */}

      {/* ROW 1: CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 gap-4">
        {statsCards?.map((card) => {
          const Icon = card.icon;
          const TrendIcon = card.isIncrease ? ArrowUpRight : ArrowDownRight;
          const trendColor = card.isIncrease ? "text-emerald-600" : "text-red-500";
          return (
            <div
              key={card.id}
              className="rounded-2xl border border-axc-border bg-white p-4 shadow-sm   cursor-pointer transition-all duration-200"
            >
              <div className="flex flex-row justify-between gap-2">

                <div>
                  <p className="mt-1 text-sm font-medium text-axc-gray truncate">{card.label}</p>
                  <p className="mt-1 text-2xl font-extrabold text-axc-navy-dark">{card.count}</p>
                </div>
                <div className="flex items-center ">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBgColor} ${card.iconTextColor}`}>
                    <Icon size={20} />
                  </div>
                </div>
              </div>


              <div className="mt-2 flex items-center gap-1 text-[10px]">
                <TrendIcon size={12} className={trendColor} />
                <span className="text-axc-dark-gray font-medium">{card.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ROW 2: ANALYTICS (WIDE) & QUICK LINKS (SMALL) */}
      <div className="grid grid-cols-12 gap-6">
        {/* Analytics (Left, Wide) */}
        <div className="col-span-12 lg:col-span-9">
          <Card title="AWB & Billing Performance" icon={TrendingUp} className="rounded-2xl p-6">
            <div className="h-[300px] w-full">
              <ChartArea />
            </div>
          </Card>
        </div>

        {/* Quick Links (Right, Small) */}
        <div className="col-span-12 lg:col-span-3">
          <Card title="Quick Actions" icon={Package} className="rounded-2xl p-6">
            <div className="flex flex-col gap-3">
              {quickActions?.slice(0, 4).map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between rounded-xl p-3.5 border transition-all duration-200 text-left group cursor-pointer hover:shadow-sm ${action.bgClass} ${action.borderClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${action.iconBg} ${action.iconColor}`}>
                        <IconComponent size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800 leading-tight">{action.title}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{action.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight size={14} className={`${action.arrowColor} transform group-hover:translate-x-1 transition-transform`} />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* ROW 3: ANALYTICS (SMALL), NOTIFICATIONS, ORDER STATUS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Small Analytics */}
        <Card title="Status Distribution" icon={PieIcon} className="rounded-2xl p-6">
          <ChartPie />
        </Card>

        {/* Notifications */}
        <Card
          title="Notifications Summary"
          icon={MessageCircle}
          titleClassName="text-sm"
          action={
            <Link href="/awb-entries" className="flex items-center gap-1 text-xs font-bold text-axc-navy ">
              {/* Optional Action */}
            </Link>
          }
          className="rounded-2xl p-6"
        >
          <div className="flex flex-col justify-between h-[240px]">
            <div className="flex items-center justify-around gap-2 my-auto">
              {/* Circular Item 1 */}
              <div className="flex flex-col items-center">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-axc-navy text-white shadow-md">
                  <Mail size={22} />
                  <span className="absolute -top-1.5 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-axc-red-dark text-[10px] font-bold text-white border-2 border-white">
                    28
                  </span>
                </div>
                <p className="mt-2 text-xs font-bold text-axc-dark-grey">Email</p>
                <p className="text-[10px] font-medium text-axc-navy">28 Unread</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-white shadow-md">
                  <MessageSquare size={22} />
                  <span className="absolute -top-1.5 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-axc-red-dark text-xs font-bold text-white border-2 border-white">
                    16
                  </span>
                </div>
                <p className="mt-2 text-xs font-bold text-axc-dark-gray">SMS</p>
                <p className="text-xs font-medium text-amber-600">16 Unread</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-axc-dark-green text-white shadow-md">
                  <MessageCircle size={22} />
                  <span className="absolute -top-1.5 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-axc-red-dark text-sm font-bold text-white border-2 border-white">
                    11
                  </span>
                </div>
                <p className="mt-2 text-xs font-bold text-axc-dark-gray">WhatsApp</p>
                <p className="text-xs font-medium text-emerald-600">11 Unread</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
              <a href="#" className="flex w-full items-center justify-between text-xs font-semibold text-axc-red  ">
                <span>View All Notifications</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </Card>

        {/* Order Status */}
        <Card
          title="Order Status"
          icon={Package}
          titleClassName="text-sm"
        className="rounded-2xl p-6"
        >
          <div className="flex flex-col gap-2.5 h-[240px] overflow-y-auto scrollbar-none">
            {ticket?.map((t, index) => {
              const IconComponent = t.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between rounded-xl p-3 border ${t.bgClass} ${t.borderClass}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${t.iconBg}`}>
                      <IconComponent size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-axc-dark-gray">{t.title}</p>
                      <p className={`text-base font-extrabold ${t.textColor}`}>{t.count}</p>
                    </div>
                  </div>
                  <Link href="#" className={`flex items-center gap-0.5 font-medium ${t.linkSize} ${t.textColor}`}>
                    View All <ChevronRight size={12} />
                  </Link>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ROW 4: TABLES */}
      <Card
        title="Order Information"
        titleClassName="px-3 pt-6"
        // icon={Box}
        // action={
        //   <Link href="/awb-entries" className="flex items-center gap-1 text-xs font-bold text-axc-navy ">
        //     View All Order <ChevronRight size={14} />
        //   </Link>
        // }
        className="p-0 rounded-2xl"
      >
        <CommonTable
          headings={headings}
          data={flightData}
          onView={(row) => {
            console.log("View", row);
          }}
          onEdit={(row) => {
            console.log("Edit", row);
          }}
          onDelete={(row) => {
            console.log("Delete", row);
          }}
        />
      </Card>
    </div>
  );
}