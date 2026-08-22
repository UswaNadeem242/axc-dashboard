"use client";
import React from "react";
import { TrackingEvent } from "./formstate";
import CommonTable from "../../src/common/table";

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
    "w-full h-8 px-2 rounded-md border border-axc-border text-xs text-axc-dark-gray focus:outline-none focus:ring-1 focus:ring-axc-navy disabled:bg-gray-50 disabled:text-gray-500";

  const headings = [
    {
      label: "Event Date Time",
      key: "eventDateTime",
      truncate: false,
      render: (ev: TrackingEvent) =>
        ev.editable ? (
          <input
            type="datetime-local"
            className={inputClass}
            value={ev.eventDateTime}
            onChange={(e) =>
              onUpdateEvent(ev.id, { eventDateTime: e.target.value })
            }
          />
        ) : (
          <span className="text-axc-gray whitespace-nowrap">
            {ev.eventDateTime}
          </span>
        ),
    },
    {
      label: "Event Description",
      key: "eventDescription",
      truncate: false,
      render: (ev: TrackingEvent) =>
        ev.editable ? (
          <select
            className={inputClass}
            value={ev.eventDescription}
            onChange={(e) =>
              onUpdateEvent(ev.id, { eventDescription: e.target.value })
            }
          >
            <option value="">SELECT...</option>
            <option value="SHIPMENT HAS BEEN BOOKED">
              SHIPMENT HAS BEEN BOOKED
            </option>
            <option value="OUT FOR DELIVERY">OUT FOR DELIVERY</option>
            <option value="DELIVERED">DELIVERED</option>
          </select>
        ) : (
          <span className="text-axc-gray">{ev.eventDescription}</span>
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
          className="text-axc-red text-[11px] font-bold hover:underline"
        >
          ✕ REMOVE
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
      />

      <button
        type="button"
        onClick={onAddEvent}
        className="self-start flex items-center gap-1.5 px-4 py-2 bg-axc-dark-green hover:opacity-90 text-white rounded-md text-xs font-bold transition"
      >
        + ADD ITEM
      </button>
    </div>
  );
}