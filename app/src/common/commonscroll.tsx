"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface CommonScrollProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  step?: number;
  height?: string;
  showArrows?: boolean;
  orientation?: "vertical" | "horizontal";
  scrollbarThickness?: number;
  scrollbarWidth?: string | number;
  align?: "start" | "center" | "end";
  maxThumbPercent?: number;
  gap?: number; 
}

export default function CommonScroll({
  children,
  className = "",
  contentClassName = "",
  step = 120,
  height = "154px",
  showArrows = true,
  orientation = "vertical",
  scrollbarThickness = 6,
  scrollbarWidth,
  align = "center",
  maxThumbPercent = 25,
  gap = 12,
}: CommonScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);
  const [thumb, setThumb] = useState({ size: 25, offset: 0 });
  const isHorizontal = orientation === "horizontal";
  const isFillHeight = !isHorizontal && height === "100%";
  const THUMB_INSET = 2; 

  const trackLength = isHorizontal
    ? typeof scrollbarWidth === "number"
      ? `${scrollbarWidth}px`
      : scrollbarWidth ?? "100%"
    : height;

  const capThumbSize = (rawSizePct: number) => Math.max(8, Math.min(rawSizePct, maxThumbPercent));

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;

    if (isHorizontal) {
      setCanScrollBack(el.scrollLeft > 2);
      setCanScrollForward(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);

      const rawSizePct = Math.min(100, (el.clientWidth / el.scrollWidth) * 100);
      const sizePct = capThumbSize(rawSizePct);
      const maxOffsetPct = 100 - sizePct;
      const scrollableAmount = el.scrollWidth - el.clientWidth;
      const offsetPct = scrollableAmount > 0 ? (el.scrollLeft / scrollableAmount) * maxOffsetPct : 0;
      setThumb({ size: sizePct, offset: offsetPct });
    } else {
      setCanScrollBack(el.scrollTop > 2);
      setCanScrollForward(el.scrollTop + el.clientHeight < el.scrollHeight - 2);

      const rawSizePct = Math.min(100, (el.clientHeight / el.scrollHeight) * 100);
      const sizePct = capThumbSize(rawSizePct);
      const maxOffsetPct = 100 - sizePct;
      const scrollableAmount = el.scrollHeight - el.clientHeight;
      const offsetPct = scrollableAmount > 0 ? (el.scrollTop / scrollableAmount) * maxOffsetPct : 0;
      setThumb({ size: sizePct, offset: offsetPct });
    }
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [children, orientation, maxThumbPercent]);

  const scrollBack = () => {
    scrollRef.current?.scrollBy(
      isHorizontal ? { left: -step, behavior: "smooth" } : { top: -step, behavior: "smooth" }
    );
  };

  const scrollForward = () => {
    scrollRef.current?.scrollBy(
      isHorizontal ? { left: step, behavior: "smooth" } : { top: step, behavior: "smooth" }
    );
  };

  const handleTrackDrag = (clientPos: number, track: HTMLDivElement) => {
    const el = scrollRef.current;
    if (!el) return;
    const rect = track.getBoundingClientRect();

    if (isHorizontal) {
      const ratio = Math.min(1, Math.max(0, (clientPos - rect.left) / rect.width));
      el.scrollLeft = ratio * (el.scrollWidth - el.clientWidth);
    } else {
      const ratio = Math.min(1, Math.max(0, (clientPos - rect.top) / rect.height));
      el.scrollTop = ratio * (el.scrollHeight - el.clientHeight);
    }
  };

  const startTrackDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = e.currentTarget;
    const clientPos = isHorizontal ? e.clientX : e.clientY;
    handleTrackDrag(clientPos, track);

    const onMove = (moveEvent: MouseEvent) => {
      handleTrackDrag(isHorizontal ? moveEvent.clientX : moveEvent.clientY, track);
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const arrowButtonClasses =
    "flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-axc-gray transition-colors hover:bg-axc-light-bg hover:text-axc-dark-gray disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent";

  const alignClass = isFillHeight
    ? "items-stretch"
    : align === "start"
    ? "items-start"
    : align === "end"
    ? "items-end"
    : "items-center";
  const justifyClass = align === "start" ? "justify-start" : align === "end" ? "justify-end" : "justify-center";

  return (
    <div className={`flex ${isHorizontal ? "flex-col" : `flex-row ${alignClass}`} ${isFillHeight ? "h-full" : ""} ${className}`}>
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className={
          isHorizontal
            ? `min-w-0 flex-1 overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${contentClassName}`
            : `min-h-0 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isFillHeight ? "flex-1 h-full" : ""} ${contentClassName}`
        }
        style={!isHorizontal && !isFillHeight ? { height } : undefined}
      >
        {children}
      </div>
      <div
        className={`flex shrink-0 items-center ${
          isHorizontal ? `flex-row ${justifyClass}` : `flex-col ${justifyClass}`
        } ${isFillHeight ? "h-full" : ""} gap-1`}
        style={isHorizontal ? { marginTop: gap } : { marginLeft: gap }}
      >
        {showArrows &&
          (isHorizontal ? (
            <button type="button" onClick={scrollBack} disabled={!canScrollBack} aria-label="Scroll left" className={arrowButtonClasses}>
              <ChevronLeft className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={scrollBack} disabled={!canScrollBack} aria-label="Scroll up" className={arrowButtonClasses}>
              <ChevronUp className="h-4 w-4" />
            </button>
          ))}

        <div
          role="scrollbar"
          aria-orientation={orientation}
          className={`relative cursor-pointer rounded-full bg-axc-border ${isFillHeight ? "flex-1" : ""}`}
          style={
            isHorizontal
              ? { width: trackLength, height: scrollbarThickness }
              : isFillHeight
              ? { width: scrollbarThickness }
              : { height: trackLength, width: scrollbarThickness }
          }
          onMouseDown={startTrackDrag}
        >
          
          <div
            className="absolute rounded-full bg-axc-gray/50"
            style={
              isHorizontal
                ? {
                    width: `${thumb.size}%`,
                    left: `${thumb.offset}%`,
                    top: THUMB_INSET,
                    bottom: THUMB_INSET,
                  }
                : {
                    height: `${thumb.size}%`,
                    top: `${thumb.offset}%`,
                    left: THUMB_INSET,
                    right: THUMB_INSET,
                  }
            }
          />
        </div>

        {showArrows &&
          (isHorizontal ? (
            <button type="button" onClick={scrollForward} disabled={!canScrollForward} aria-label="Scroll right" className={arrowButtonClasses}>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={scrollForward} disabled={!canScrollForward} aria-label="Scroll down" className={arrowButtonClasses}>
              <ChevronDown className="h-4 w-4" />
            </button>
          ))}
      </div>
    </div>
  );
}