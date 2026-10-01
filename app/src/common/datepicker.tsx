"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, X } from "lucide-react";

interface DatePickerProps {
  value?: string; 
  onChange?: (date: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  align?: "left" | "right";
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function padZero(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function parseDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      return new Date(y, m, d);
    }
  }
  return null;
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${padZero(month + 1)}-${padZero(day)}`;
}

export default function CustomDatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className = "",
  disabled = false,
  minDate,
  maxDate,
  align = "left",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = parseDate(value);
  const minDateObj = (() => {
    if (!minDate) return null;
    const parsed = parseDate(minDate);
    if (parsed) {
      parsed.setHours(0, 0, 0, 0);
      return parsed;
    }
    return null;
  })();
  const maxDateObj = (() => {
    if (!maxDate) return null;
    const parsed = parseDate(maxDate);
    if (parsed) {
      parsed.setHours(0, 0, 0, 0);
      return parsed;
    }
    return null;
  })();
  const [viewDate, setViewDate] = useState<Date>(() => {
    return selectedDate || new Date();
  });
  useEffect(() => {
    if (value) {
      const parsed = parseDate(value);
      if (parsed) setViewDate(parsed);
    }
  }, [value]);
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const handleSelectDay = (year: number, month: number, day: number) => {
    const formatted = formatDate(year, month, day);
    onChange?.(formatted);
    setIsOpen(false);
  };

  const isSelected = (year: number, month: number, day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day
    );
  };

  const isToday = (year: number, month: number, day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };
  const isDayDisabled = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    if (minDateObj && date < minDateObj) return true;
    if (maxDateObj && date > maxDateObj) return true;
    return false;
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between bg-white border border-axc-border rounded-md px-3 py-2.5 outline-none transition cursor-pointer select-none text-regular-small ${
          disabled
            ? "bg-gray-50 text-axc-dark-gray cursor-not-allowed"
            : ""
        } ${className}`}
      >
        <span className={`block truncate ${value ? "text-gray-800 font-medium" : "text-gray-400"}`}>
          {value || placeholder}
        </span>
        <div className="flex items-center gap-1.5 shrink-0 text-gray-400">
          {value && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange?.("");
              }}
              className="hover:text-gray-600 transition"
              title="Clear Date"
            >
              <X size={12} />
            </button>
          )}
          <CalendarIcon size={14} className="text-gray-400" />
        </div>
      </div>
      {isOpen && (
        <div
          className={`absolute top-full z-[9999] mt-1 w-[290px] pt-2 animate-in fade-in zoom-in-95 duration-100 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="absolute top-[2px] right-6 h-3.5 w-3.5 rotate-45 border-l border-t border-axc-border bg-white z-20" />

          <div className="relative z-10 bg-white rounded-2xl border border-axc-border shadow-xl p-4">
            <div className="flex items-center justify-between mb-3 px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-700 transition cursor-pointer"
              title="Previous Month"
            >
              <ArrowLeft size={16} />
            </button>

            <h4 className="text-[14px] font-bold text-gray-900 tracking-tight">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h4>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-700 transition cursor-pointer"
              title="Next Month"
            >
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center mb-1">
            {WEEK_DAYS.map((d) => (
              <span key={d} className="text-[11px] font-medium text-gray-400 py-1">
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1.5 text-center">
            {blanks.map((b) => (
              <div key={`blank-${b}`} className="h-8 w-8" />
            ))}

            {days.map((day) => {
              const active = isSelected(viewYear, viewMonth, day);
              const today = isToday(viewYear, viewMonth, day);
              const isPast = isDayDisabled(viewYear, viewMonth, day);

              return (
                <div key={`day-${day}`} className="flex items-center justify-center">
                  <button
                    type="button"
                    disabled={isPast}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isPast) return;
                      handleSelectDay(viewYear, viewMonth, day);
                    }}
                    className={`h-8 w-8 text-[12px] font-semibold transition flex items-center justify-center ${
                      isPast
                        ? "text-gray-300 opacity-50 cursor-not-allowed pointer-events-none"
                        : active
                        ? "bg-axc-navy text-white rounded-full shadow-sm cursor-pointer"
                        : today
                        ? "border border-axc-navy text-axc-navy rounded-full hover:bg-red-50 cursor-pointer"
                        : "text-gray-800 hover:bg-gray-100 rounded-full cursor-pointer"
                    }`}
                  >
                    {day}
                  </button>
                </div>
              );
            })}
          </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between px-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const today = new Date();
                  handleSelectDay(today.getFullYear(), today.getMonth(), today.getDate());
                }}
                className="text-regular-medium text-axc-navy hover:underline cursor-pointer"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-semibold text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}