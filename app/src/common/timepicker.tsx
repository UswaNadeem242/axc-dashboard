"use client";

import React, { useState, useRef, useEffect } from "react";
import { Clock, X } from "lucide-react";

interface TimePickerProps {
  value?: string; // Format: "09:41 AM"
  onChange?: (time: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  align?: "left" | "right";
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1, 2, ..., 12
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")); // "00", "01", ..., "59"
const PERIODS = ["AM", "PM"];

const ITEM_HEIGHT = 38; // px

function parseTimeString(timeStr?: string): {
  hour: number;
  minute: string;
  period: "AM" | "PM";
} {
  if (!timeStr) {
    return { hour: 9, minute: "41", period: "AM" };
  }

  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes("PM");
  const isAM = clean.includes("AM");

  const numbersOnly = clean.replace(/[^\d:]/g, "");
  const parts = numbersOnly.split(":");

  let rawHour = parseInt(parts[0] || "9", 10);
  let rawMin = parseInt(parts[1] || "0", 10);

  if (isNaN(rawHour)) rawHour = 9;
  if (isNaN(rawMin)) rawMin = 0;

  let period: "AM" | "PM" = isPM ? "PM" : isAM ? "AM" : rawHour >= 12 ? "PM" : "AM";

  if (!isPM && !isAM && rawHour > 12) {
    rawHour = rawHour - 12;
  } else if (!isPM && !isAM && rawHour === 0) {
    rawHour = 12;
  } else if (rawHour > 12) {
    rawHour = rawHour % 12 || 12;
  }

  return {
    hour: rawHour,
    minute: String(rawMin).padStart(2, "0"),
    period,
  };
}

export default function CustomTimePicker({
  value,
  onChange,
  placeholder = "Select time",
  className = "",
  disabled = false,
  align = "left",
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsed = parseTimeString(value);
  const [selectedHour, setSelectedHour] = useState<number>(parsed.hour);
  const [selectedMinute, setSelectedMinute] = useState<string>(parsed.minute);
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">(parsed.period);

  const hourListRef = useRef<HTMLDivElement>(null);
  const minListRef = useRef<HTMLDivElement>(null);
  const periodListRef = useRef<HTMLDivElement>(null);

  // Sync state when value changes externally
  useEffect(() => {
    if (value) {
      const p = parseTimeString(value);
      setSelectedHour(p.hour);
      setSelectedMinute(p.minute);
      setSelectedPeriod(p.period);
    }
  }, [value]);

  // Click outside listener
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

  // Center scroll positions on open
  useEffect(() => {
    if (isOpen) {
      const scrollColumn = (el: HTMLDivElement | null, index: number) => {
        if (!el) return;
        el.scrollTo({
          top: index * ITEM_HEIGHT,
          behavior: "auto",
        });
      };

      const hourIdx = HOURS.indexOf(selectedHour);
      const minIdx = MINUTES.indexOf(selectedMinute);
      const periodIdx = PERIODS.indexOf(selectedPeriod);

      setTimeout(() => {
        scrollColumn(hourListRef.current, hourIdx >= 0 ? hourIdx : 0);
        scrollColumn(minListRef.current, minIdx >= 0 ? minIdx : 0);
        scrollColumn(periodListRef.current, periodIdx >= 0 ? periodIdx : 0);
      }, 30);
    }
  }, [isOpen]);

  const handleSelectHour = (h: number, idx: number) => {
    setSelectedHour(h);
    hourListRef.current?.scrollTo({ top: idx * ITEM_HEIGHT, behavior: "smooth" });
  };

  const handleSelectMinute = (m: string, idx: number) => {
    setSelectedMinute(m);
    minListRef.current?.scrollTo({ top: idx * ITEM_HEIGHT, behavior: "smooth" });
  };

  const handleSelectPeriod = (p: "AM" | "PM", idx: number) => {
    setSelectedPeriod(p);
    periodListRef.current?.scrollTo({ top: idx * ITEM_HEIGHT, behavior: "smooth" });
  };

  const handleScroll = (
    el: HTMLDivElement | null,
    setter: (val: any) => void,
    items: any[]
  ) => {
    if (!el) return;
    const idx = Math.round(el.scrollTop / ITEM_HEIGHT);
    if (idx >= 0 && idx < items.length) {
      setter(items[idx]);
    }
  };

  const handleOk = () => {
    const formattedHour = String(selectedHour).padStart(2, "0");
    const formatted = `${formattedHour}:${selectedMinute} ${selectedPeriod}`;
    onChange?.(formatted);
    setIsOpen(false);
  };

  const handleCancel = () => {
    const p = parseTimeString(value);
    setSelectedHour(p.hour);
    setSelectedMinute(p.minute);
    setSelectedPeriod(p.period);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Display Box */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between bg-white border border-axc-border rounded-md px-3 py-2.5 outline-none transition cursor-pointer select-none text-regular-small ${
          disabled
            ? "bg-gray-50 text-axc-dark-gray cursor-not-allowed"
            : "hover:border-gray-400"
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
              title="Clear Time"
            >
              <X size={12} />
            </button>
          )}
          <Clock size={14} className="text-gray-400" />
        </div>
      </div>

      {/* Roller Wheel Time Picker Popover */}
      {isOpen && (
        <div
          className={`absolute top-full z-[9999] mt-1 w-[260px] pt-2 animate-in fade-in zoom-in-95 duration-100 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {/* Top caret pointer */}
          <div className="absolute top-[2px] right-6 h-3.5 w-3.5 rotate-45 border-l border-t border-axc-border bg-white z-20" />

          <div className="relative z-10 bg-white rounded-2xl border border-axc-border shadow-2xl p-4 flex flex-col select-none">
            {/* Scrollable Container with Center Selection Bar */}
            <div className="relative h-[228px] w-full flex items-stretch overflow-hidden">
              {/* Continuous Center Highlight Bar (Matching Reference Image) */}
              <div className="absolute top-[95px] left-1 right-1 h-[38px] bg-slate-100/90 rounded-xl pointer-events-none z-0 shadow-inner" />

              {/* Top & Bottom Gradient Shadows for Depth/Fading */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none z-20" />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-20" />

              {/* Hours Column */}
              <div
                ref={hourListRef}
                onScroll={() => handleScroll(hourListRef.current, setSelectedHour, HOURS)}
                className="flex-1 h-full overflow-y-auto scrollbar-none snap-y snap-mandatory z-10 py-[95px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden text-center"
              >
                {HOURS.map((h, idx) => {
                  const active = selectedHour === h;
                  return (
                    <div
                      key={h}
                      onClick={() => handleSelectHour(h, idx)}
                      style={{ height: `${ITEM_HEIGHT}px` }}
                      className={`snap-center flex items-center justify-center cursor-pointer transition-all duration-150 ${
                        active
                          ? "text-gray-900 font-semibold text-[19px]"
                          : "text-slate-400 font-normal text-[15px] hover:text-slate-600"
                      }`}
                    >
                      {h}
                    </div>
                  );
                })}
              </div>

              {/* Minutes Column */}
              <div
                ref={minListRef}
                onScroll={() => handleScroll(minListRef.current, setSelectedMinute, MINUTES)}
                className="flex-1 h-full overflow-y-auto scrollbar-none snap-y snap-mandatory z-10 py-[95px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden text-center"
              >
                {MINUTES.map((m, idx) => {
                  const active = selectedMinute === m;
                  return (
                    <div
                      key={m}
                      onClick={() => handleSelectMinute(m, idx)}
                      style={{ height: `${ITEM_HEIGHT}px` }}
                      className={`snap-center flex items-center justify-center cursor-pointer transition-all duration-150 ${
                        active
                          ? "text-gray-900 font-semibold text-[19px]"
                          : "text-slate-400 font-normal text-[15px] hover:text-slate-600"
                      }`}
                    >
                      {m}
                    </div>
                  );
                })}
              </div>

              {/* AM / PM Column */}
              <div
                ref={periodListRef}
                onScroll={() => handleScroll(periodListRef.current, setSelectedPeriod, PERIODS)}
                className="flex-1 h-full overflow-y-auto scrollbar-none snap-y snap-mandatory z-10 py-[95px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden text-center"
              >
                {PERIODS.map((p, idx) => {
                  const active = selectedPeriod === p;
                  return (
                    <div
                      key={p}
                      onClick={() => handleSelectPeriod(p as "AM" | "PM", idx)}
                      style={{ height: `${ITEM_HEIGHT}px` }}
                      className={`snap-center flex items-center justify-center cursor-pointer transition-all duration-150 ${
                        active
                          ? "text-axc-navy text-regular-medium"
                          : "text-axc-navy text-regular-small"
                      }`}
                    >
                      {p}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Buttons (CANCEL / OK) */}
            <div className="flex items-center justify-end gap-6 pt-3 mt-1 z-30">
              <button
                type="button"
                onClick={handleCancel}
                className="text-[12px] font-bold tracking-wider text-axc-navy transition cursor-pointer uppercase"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleOk}
                className="text-[12px] font-bold tracking-wider text-axc-navy transition cursor-pointer uppercase"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
