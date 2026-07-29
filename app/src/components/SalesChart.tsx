"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
interface SalesChartProps {
  filter: "all" | "b2b" | "b2c";
  timeFilter: "today" | "week" | "month" | "year" | "date" | "day";
  selectedYear?: number;
  selectedMonth?: number;
  selectedDate?: string;
  selectedDay?: string;
}
const getChartData = (
  timeFilter: "today" | "week" | "month" | "year" | "date" | "day",
  selectedYear?: number,
  selectedMonth?: number,
  selectedDate?: string,
  selectedDay?: string
) => {
  if (selectedDate && timeFilter === "date") {
    return [
      {
        month: selectedDate,
        b2b: 65000,
        b2c: 42000,
      },
    ];
  }
  if (timeFilter === "today") {
    return [
      { month: "9 AM", b2b: 4000, b2c: 2500 },
      { month: "11 AM", b2b: 7000, b2c: 4200 },
      { month: "1 PM", b2b: 9000, b2c: 5600 },
      { month: "3 PM", b2b: 11000, b2c: 7100 },
      { month: "5 PM", b2b: 13500, b2c: 8200 },
      { month: "7 PM", b2b: 12000, b2c: 7600 },
    ];
  }
  if (timeFilter === "week") {
    return [
      { month: "Mon", b2b: 42000, b2c: 28000 },
      { month: "Tue", b2b: 45000, b2c: 31000 },
      { month: "Wed", b2b: 49000, b2c: 34000 },
      { month: "Thu", b2b: 52000, b2c: 36000 },
      { month: "Fri", b2b: 61000, b2c: 43000 },
      { month: "Sat", b2b: 56000, b2c: 39000 },
      { month: "Sun", b2b: 50000, b2c: 35000 },
    ];
  }
  if (timeFilter === "year") {
    return Array.from({length:12},(_,index)=>({
     month:new Date(
        selectedYear || 2026,
        index,
        1
      ).toLocaleString("default",{month:"short"}),
      b2b:Math.floor(Math.random()*90000)+30000,
      b2c:Math.floor(Math.random()*70000)+20000
    }));
  }
  if (timeFilter === "month") {
    const days = new Date(
      selectedYear || 2026,
      selectedMonth || 1,
      0
    ).getDate();
    return Array.from({length:days},(_,index)=>({
      month:`${index+1}`,
      b2b:Math.floor(Math.random()*80000)+20000,
      b2c:Math.floor(Math.random()*60000)+15000
    }));

  }

  if (timeFilter === "day") {
    return [
      {
        month:selectedDay || "Monday",
        b2b:55000,
        b2c:35000
      },
      {
        month:selectedDay || "Tuesday",
        b2b:62000,
        b2c:41000
      },
      {
        month:selectedDay || "Wednesday",
        b2b:48000,
        b2c:30000
      }
    ];
  }
  return [];
};

export default function SalesChart({filter,timeFilter,selectedYear,selectedMonth,selectedDate,selectedDay,}: SalesChartProps) {
  const data = getChartData(
    timeFilter,selectedYear,selectedMonth, selectedDate, selectedDay
  );
  const maxValue =
    filter === "b2b"
      ? Math.max(...data.map((d)=>d.b2b))
      : filter === "b2c"
      ? Math.max(...data.map((d)=>d.b2c))
      : Math.max(...data.map((d)=>Math.max(d.b2b,d.b2c)));

  const roundedMax = Math.ceil(maxValue / 10000) * 10000;

  const ticks=[
    0,
    roundedMax*0.25,
    roundedMax*0.5,
    roundedMax*0.75,
    roundedMax
  ];

  return (
    <div className="w-full h-105">
      <ResponsiveContainer width="100%" height="92%">
        <AreaChart data={data} margin={{top:20,right:10,left:5,bottom:0}}>
          <defs>
            <linearGradient id="blueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="redFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.30}/>
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E7EDF5" strokeDasharray="3 3" vertical/>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{fontSize:11,fill:"#6B7280"}}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            domain={[0,roundedMax]}
            ticks={ticks}
            tickFormatter={(value)=>`$${Math.round(value/1000)}K`}
            tick={{fontSize:11,fill:"#6B7280"}}
          />
          {(filter==="all" || filter==="b2b") && (

            <Area
              type="monotone"
              dataKey="b2b"
              stroke="#2563EB"
              strokeWidth={2}
              fill="url(#blueFill)"
              dot={false}
              activeDot={{r:5}}
            />
          )}
          {(filter==="all" || filter==="b2c") && (
            <Area
              type="monotone"
              dataKey="b2c"
              stroke="#DC2626"
              strokeWidth={2}
              fill="url(#redFill)"
              dot={false}
              activeDot={{r:5}}
            />
          )}

        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-center items-center gap-8 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-[15px] text-[#2563EB]">
            B2B Revenue
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600"></div>
          <span className="text-[15px] text-[#DC2626]">
            B2C Revenue
          </span>
        </div>

      </div>
    </div>
  );
}