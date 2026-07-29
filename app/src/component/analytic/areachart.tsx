
"use client"
import React from 'react'
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
    PieChart as PieIcon
} from "lucide-react";
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

const analyticsData = [
  { name: "Mon", entries: 40, billing: 24 },
  { name: "Tue", entries: 55, billing: 35 },
  { name: "Wed", entries: 48, billing: 30 },
  { name: "Thu", entries: 70, billing: 45 },
  { name: "Fri", entries: 85, billing: 55 },
  { name: "Sat", entries: 50, billing: 40 },
  { name: "Sun", entries: 60, billing: 38 },
];
export default function ChartArea() {
    return (
        <div className="w-full h-full">  <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorEntries" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#232A76" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#232A76" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorBilling" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E31E24" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#E31E24" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area
                    type="monotone"
                    dataKey="entries"
                    name="AWB Entries"
                    stroke="#232A76"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorEntries)"
                />
                <Area
                    type="monotone"
                    dataKey="billing"
                    name="Billing Invoices"
                    stroke="#E31E24"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorBilling)"
                />
            </AreaChart>
        </ResponsiveContainer></div>
    )
}

 