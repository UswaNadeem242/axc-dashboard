"use client";
import React from "react";
import { TrackingEvent } from "./formstate";
import CommonTable from "../../src/common/table";
import CustomDatePicker from "../../src/common/datepicker";
import CustomTimePicker from "../../src/common/timepicker";
import Dropdown from "../../src/common/dropdown";
import { Trash, Plus } from "lucide-react";

const EVENT_DESCRIPTION_OPTIONS = [
  { value: "SHIPMENT HAS BEEN BOOKED", label: "SHIPMENT HAS BEEN BOOKED" },
  { value: "OUT FOR DELIVERY", label: "OUT FOR DELIVERY" },
  { value: "DELIVERED", label: "DELIVERED" },
];

export function TrackingEventsPanel({
  awbTrackingNo,
  events,
  onAddEvent,
  onUpdateEvent,
  onRemoveEvent,
}: {
  awbTrackingNo: string;
  events: TrackingEvent[];
  onAddEvent: () => void;
  onUpdateEvent: (id: string, patch: Partial<TrackingEvent>) => void;
  onRemoveEvent: (id: string) => void;
}) {
  const inputClass =
    "w-full h-8 px-2 rounded-md border border-axc-border text-xs text-axc-dark-gray focus:outline-none";

  const parseDateTime = (dt?: string) => {
    if (!dt) return { date: "", time: "" };
    if (dt.includes("T")) {
      const [d, t] = dt.split("T");
      return { date: d || "", time: t ? t.slice(0, 5) : "" };
    }
    const parts = dt.trim().split(" ");
    if (parts.length >= 2) {
      return { date: parts[0] || "", time: parts.slice(1).join(" ") || "" };
    }
    if (dt.includes("-")) {
      return { date: dt, time: "" };
    }
    return { date: "", time: dt };
  };



  const headings = [
    {
      label: "Event Date Time",
      key: "eventDateTime",
      truncate: false,
      render: (ev: TrackingEvent) => {
        const { date, time } = parseDateTime(ev.eventDateTime);

        return ev.editable ? (
          <div className="flex items-center gap-2 min-w-[280px]">
            <div className="w-[145px]">
              <CustomDatePicker
                value={date}
                placeholder="Select date"
                onChange={(newDate) => {
                  const currentT = time || "";
                  const combined = newDate
                    ? currentT
                      ? `${newDate} ${currentT}`
                      : newDate
                    : currentT;
                  onUpdateEvent(ev.id, { eventDateTime: combined });
                }}
                className="!h-8 !py-1 !px-2 !text-xs"
              />
            </div>
            <div className="w-[130px]">
              <CustomTimePicker
                value={time}
                placeholder="Select time"
                onChange={(newTime) => {
                  const currentD = date || "";
                  const combined = currentD
                    ? newTime
                      ? `${currentD} ${newTime}`
                      : currentD
                    : newTime;
                  onUpdateEvent(ev.id, { eventDateTime: combined });
                }}
                className="!h-8 !py-1 !px-2 !text-xs"
              />
            </div>
          </div>
        ) : (
          <span className="text-axc-gray whitespace-nowrap">
            {ev.eventDateTime ? ev.eventDateTime.replace("T", " ") : "-"}
          </span>
        );
      },
    },
    {
      label: "Event Description",
      key: "eventDescription",
      truncate: false,
      render: (ev: TrackingEvent) =>
        ev.editable ? (
          <div className="min-w-[220px]">
            <Dropdown
              options={EVENT_DESCRIPTION_OPTIONS}
              value={ev.eventDescription}
              placeholder="SELECT..."
              onChange={(val) =>
                onUpdateEvent(ev.id, { eventDescription: val })
              }
              className="!h-8 !py-1 !px-2 !text-xs"
            />
          </div>
        ) : (
          <span className="text-axc-gray">{ev.eventDescription || "-"}</span>
        ),
    },
    {
      label: "Event Location",
      key: "eventLocation",
      truncate: false,
      render: (ev: TrackingEvent) => (
        <input
          className={inputClass}
          disabled={!ev.editable}
          value={ev.eventLocation}
          onChange={(e) =>
            onUpdateEvent(ev.id, { eventLocation: e.target.value })
          }
        />
      ),
    },
    {
      label: "Event Type",
      key: "eventType",
      truncate: false,
      render: (ev: TrackingEvent) => (
        <span className="text-axc-gray font-semibold whitespace-nowrap">
          {ev.eventType}
        </span>
      ),
    },
    {
      label: "Event State",
      key: "eventState",
      truncate: false,
      render: (ev: TrackingEvent) => (
        <input
          className={inputClass}
          disabled={!ev.editable}
          value={ev.eventState}
          onChange={(e) =>
            onUpdateEvent(ev.id, { eventState: e.target.value })
          }
        />
      ),
    },
    {
      label: "Event Remark",
      key: "eventRemark",
      truncate: false,
      render: (ev: TrackingEvent) => (
        <input
          className={inputClass}
          disabled={!ev.editable}
          value={ev.eventRemark}
          onChange={(e) =>
            onUpdateEvent(ev.id, { eventRemark: e.target.value })
          }
        />
      ),
    },
    {
      label: "Created Date",
      key: "createdDate",
      truncate: false,
      render: (ev: TrackingEvent) => (
        <span className="text-axc-gray whitespace-nowrap">
          {ev.createdDate || "-"}
        </span>
      ),
    },
    {
      label: "Created By",
      key: "createdBy",
      truncate: false,
      render: (ev: TrackingEvent) => (
        <span className="text-axc-gray whitespace-nowrap">
          {ev.createdBy || "-"}
        </span>
      ),
    },
    {
      label: "Action",
      key: "action",
      render: (ev: TrackingEvent) => (
        <button
          type="button"
          onClick={() => onRemoveEvent(ev.id)}
          className="inline-flex items-center justify-center rounded-md border border-axc-red-dark/30  p-1.5 text-axc-red-dark transition hover:bg-axc-red-dark/10 cursor-pointer"
        >
          <Trash className="w-4 h-4" size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-sm font-bold text-axc-navy">
        AWB Tracking: {awbTrackingNo}
      </h3>

      <CommonTable
        headings={headings}
        data={events}
        rowKey="id"
        itemsPerPage={10}
        emptyMessage="No tracking events added"
        hidePagination={true}
        showScroll={false}
      /><button
        type="button"
        onClick={onAddEvent}
        className="self-start flex items-center gap-1.5 p-1 ring ring-axc-yellow rounded-full   text-axc-yellow  cursor-pointer transition"
        title="Add Item"
      >
        <Plus size={15} strokeWidth={3} className="text-axc-yellow" />
      </button>
    </div>
  );
}