import React from "react";
import DropdownFilter from "../dropdownfilter/Dropdownfilter";
import {
  timeFilterOptions,
  years,
  months,
  days,
} from "../constant";

interface RevenueFilterProps {
  timeFilter: "today" | "week" | "month" | "year" | "date" | "day";
  setTimeFilter: (
    value: "today" | "week" | "month" | "year" | "date" | "day"
  ) => void;
  selectedYear: number;
  setSelectedYear: (value: number) => void;
  selectedMonth: number;
  setSelectedMonth: (value: number) => void;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
  selectedDay: string;
  setSelectedDay: (value: string) => void;
}
export default function RevenueFilter({
  timeFilter,
  setTimeFilter,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedDate,
  setSelectedDate,
  selectedDay,
  setSelectedDay,
}: RevenueFilterProps): React.JSX.Element {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <DropdownFilter
        value={timeFilter}
        options={timeFilterOptions} onChange={(value) =>setTimeFilter( value as| "today" | "week"| "month" | "year" | "date"| "day" )
        }
      />
      {timeFilter === "year" && (
        <DropdownFilter
          value={selectedYear}
          options={years}
          onChange={(value) => setSelectedYear(Number(value))}
        />
      )}
      {timeFilter === "month" && (
        <>
          <DropdownFilter
            value={selectedMonth}
            options={months}
            onChange={(value) => setSelectedMonth(Number(value))}
          />
          <DropdownFilter
            value={selectedYear}
            options={years}
            onChange={(value) => setSelectedYear(Number(value))}
          />
        </>
      )}

      {timeFilter === "date" && (
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="h-10 rounded-lg border border-[var(--dsh-border)] bg-[var(--dsh-white)] px-3 text-[13px] text-[var(--dsh-text)] outline-none focus:border-[var(--dsh-primary)]"
        />
      )}

      {timeFilter === "day" && (
        <DropdownFilter
          value={selectedDay}
          options={days}
          onChange={setSelectedDay}
        />
      )}
    </div>
  );
}