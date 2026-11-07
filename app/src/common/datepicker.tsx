"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  align?: "left" | "right";
  openDirection?: "up" | "down" | "auto";
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
  const s = dateStr.trim();
  if (s.includes("/")) {
    const parts = s.split("/");
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) return new Date(y, m, d);
      } else {
        const d = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const y = parseInt(parts[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) return new Date(y, m, d);
      }
    }
  }
  if (s.includes("-")) {
    const parts = s.split("-");
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) return new Date(y, m, d);
      } else {
        const d = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const y = parseInt(parts[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) return new Date(y, m, d);
      }
    }
  }
  return null;
}

function formatDate(year: number, month: number, day: number, useSlash = false): string {
  if (useSlash) {
    return `${padZero(day)}/${padZero(month + 1)}/${year}`;
  }
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
  openDirection = "auto",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    arrowLeft: number;
    openUpwards: boolean;
  }>({
    top: 0,
    left: 0,
    arrowLeft: 24,
    openUpwards: false,
  });

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
    setMounted(true);
  }, []);

  useEffect(() => {
    if (value) {
      const parsed = parseDate(value);
      if (parsed) setViewDate(parsed);
    }
  }, [value]);

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    const CALENDAR_WIDTH = 300;
    const CALENDAR_HEIGHT = 336;
    const PADDING = 8;
    const GAP = 6;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let upwards = false;
    if (openDirection === "up") {
      upwards = true;
    } else if (openDirection === "down") {
      upwards = false;
    } else {
      // Auto: prefer downward unless not enough space below AND there's more space above
      if (spaceBelow < CALENDAR_HEIGHT + GAP && spaceAbove > spaceBelow) {
        upwards = true;
      } else {
        upwards = false;
      }
    }

    let top = upwards
      ? rect.top - CALENDAR_HEIGHT - GAP
      : rect.bottom + GAP;

    // Viewport edge clamping
    if (top < PADDING) {
      top = PADDING;
    } else if (top + CALENDAR_HEIGHT > window.innerHeight - PADDING) {
      top = Math.max(PADDING, window.innerHeight - CALENDAR_HEIGHT - PADDING);
    }

    let left = align === "right" ? rect.right - CALENDAR_WIDTH : rect.left;

    // Viewport horizontal edge clamping
    if (left + CALENDAR_WIDTH > window.innerWidth - PADDING) {
      left = window.innerWidth - CALENDAR_WIDTH - PADDING;
    }
    if (left < PADDING) {
      left = PADDING;
    }

    // Calculate pointer arrow position relative to popup
    const targetAnchorX = rect.left + Math.min(28, rect.width / 2);
    const arrowLeft = Math.max(16, Math.min(CALENDAR_WIDTH - 24, targetAnchorX - left));

    setCoords({
      top,
      left,
      arrowLeft,
      openUpwards: upwards,
    });
  }, [openDirection, align]);

  // Recalculate position when opened, resized, or scrolled
  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, updatePosition]);

  // Click outside and ESC handling
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        popupRef.current &&
        !popupRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
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
    const isSlash = Boolean(value && value.includes("/"));
    const formatted = formatDate(year, month, day, isSlash);
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
      {/* Input Display Box */}
      <div
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
          }
        }}
        className={`flex items-center justify-between bg-white border border-axc-border rounded-md px-3 py-2 outline-none transition cursor-pointer select-none text-xs ${
          disabled ? "bg-gray-50 text-axc-dark-gray cursor-not-allowed" : ""
        } ${className}`}
      >
        <span
          className={`block truncate ${
            value ? "text-gray-800 font-medium" : "text-gray-400"
          }`}
        >
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
              className="p-0.5 rounded hover:bg-gray-100 hover:text-gray-600 transition"
              title="Clear Date"
            >
              <X size={13} />
            </button>
          )}
          <CalendarIcon size={14} className="text-gray-400" />
        </div>
      </div>

      {/* Portal-Rendered Calendar to Prevent ANY Overflow Clipping */}
      {isOpen &&
        mounted &&
        createPortal(
          <div
            ref={popupRef}
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 99999,
            }}
            className="w-[300px] select-none animate-in fade-in zoom-in-95 duration-150 drop-shadow-2xl"
          >
            {/* Pointer Notch */}
            <div
              style={{ left: `${coords.arrowLeft}px` }}
              className={`absolute ${
                coords.openUpwards
                  ? "bottom-[-5px] border-r border-b"
                  : "top-[-5px] border-l border-t"
              } h-2.5 w-2.5 rotate-45 border-axc-border bg-white z-20 pointer-events-none`}
            />

            {/* Calendar Card */}
            <div className="relative z-10 bg-white rounded-2xl border border-axc-border shadow-2xl p-4">
              {/* Header Navigation */}
              <div className="flex items-center justify-between mb-3 px-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 transition cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft size={16} />
                </button>

                <h4 className="text-[13.5px] font-bold text-gray-900 tracking-tight">
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </h4>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 transition cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Day of Week Labels */}
              <div className="grid grid-cols-7 text-center mb-1.5">
                {WEEK_DAYS.map((d) => (
                  <span
                    key={d}
                    className="text-[10.5px] font-semibold text-gray-400 py-1 uppercase tracking-wider"
                  >
                    {d}
                  </span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-y-1 text-center">
                {blanks.map((b) => (
                  <div key={`blank-${b}`} className="h-8 w-8" />
                ))}

                {days.map((day) => {
                  const active = isSelected(viewYear, viewMonth, day);
                  const today = isToday(viewYear, viewMonth, day);
                  const isPast = isDayDisabled(viewYear, viewMonth, day);

                  return (
                    <div
                      key={`day-${day}`}
                      className="flex items-center justify-center"
                    >
                      <button
                        type="button"
                        disabled={isPast}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isPast) return;
                          handleSelectDay(viewYear, viewMonth, day);
                        }}
                        className={`h-7.5 w-7.5 text-[12px] font-medium transition flex items-center justify-center rounded-full ${
                          isPast
                            ? "text-gray-300 opacity-40 cursor-not-allowed pointer-events-none"
                            : active
                            ? "bg-axc-navy text-white font-bold shadow-xs cursor-pointer"
                            : today
                            ? "border border-axc-navy text-axc-navy font-semibold hover:bg-blue-50 cursor-pointer"
                            : "text-gray-800 hover:bg-gray-100 cursor-pointer"
                        }`}
                      >
                        {day}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Footer Quick Action Buttons */}
              <div className="mt-3.5 pt-2.5 border-t border-gray-100 flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const today = new Date();
                    handleSelectDay(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate()
                    );
                  }}
                  className="text-xs font-semibold text-axc-navy hover:underline cursor-pointer"
                >
                  Today
                </button>

                {value && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange?.("");
                      setIsOpen(false);
                    }}
                    className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="text-xs font-medium text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
