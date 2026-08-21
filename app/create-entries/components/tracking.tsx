"use client";
import React from "react";
import { TrackingEvent } from "./formstate";

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

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-sm font-bold text-axc-navy">
        AWB Tracking: {awbTrackingNo}
      </h3>

      <div className="overflow-x-auto rounded-md border border-axc-border">
        <table className="w-full text-xs min-w-[1100px]">
          <thead>
            <tr className="bg-axc-light-bg text-axc-dark-gray">
              <th className="text-left font-bold px-2 py-2 whitespace-nowrap">
                Event Date Time
              </th>
              <th className="text-left font-bold px-2 py-2 whitespace-nowrap">
                Event Description
              </th>
              <th className="text-left font-bold px-2 py-2 whitespace-nowrap">
                Event Location
              </th>
              <th className="text-left font-bold px-2 py-2 whitespace-nowrap">
                Event Type
              </th>
              <th className="text-left font-bold px-2 py-2 whitespace-nowrap">
                Event State
              </th>
              <th className="text-left font-bold px-2 py-2 whitespace-nowrap">
                Event Remark
              </th>
              <th className="text-left font-bold px-2 py-2 whitespace-nowrap">
                Created Date
              </th>
              <th className="text-left font-bold px-2 py-2 whitespace-nowrap">
                Created By
              </th>
              <th className="text-left font-bold px-2 py-2 whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id} className="border-t border-axc-border">
                <td className="px-2 py-2">
                  {ev.editable ? (
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
                  )}
                </td>
                <td className="px-2 py-2 min-w-[180px]">
                  {ev.editable ? (
                    <select
                      className={inputClass}
                      value={ev.eventDescription}
                      onChange={(e) =>
                        onUpdateEvent(ev.id, {
                          eventDescription: e.target.value,
                        })
                      }
                    >
                      <option value="">SELECT...</option>
                      <option value="SHIPMENT HAS BEEN BOOKED">
                        SHIPMENT HAS BEEN BOOKED
                      </option>
                      <option value="OUT FOR DELIVERY">
                        OUT FOR DELIVERY
                      </option>
                      <option value="DELIVERED">DELIVERED</option>
                    </select>
                  ) : (
                    <span className="text-axc-gray">{ev.eventDescription}</span>
                  )}
                </td>
                <td className="px-2 py-2 min-w-[140px]">
                  <input
                    className={inputClass}
                    disabled={!ev.editable}
                    value={ev.eventLocation}
                    onChange={(e) =>
                      onUpdateEvent(ev.id, { eventLocation: e.target.value })
                    }
                  />
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-axc-gray font-semibold">
                  {ev.eventType}
                </td>
                <td className="px-2 py-2 min-w-[120px]">
                  <input
                    className={inputClass}
                    disabled={!ev.editable}
                    value={ev.eventState}
                    onChange={(e) =>
                      onUpdateEvent(ev.id, { eventState: e.target.value })
                    }
                  />
                </td>
                <td className="px-2 py-2 min-w-[140px]">
                  <input
                    className={inputClass}
                    disabled={!ev.editable}
                    value={ev.eventRemark}
                    onChange={(e) =>
                      onUpdateEvent(ev.id, { eventRemark: e.target.value })
                    }
                  />
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-axc-gray">
                  {ev.createdDate || "-"}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-axc-gray">
                  {ev.createdBy || "-"}
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onRemoveEvent(ev.id)}
                    className="text-axc-red text-[11px] font-bold hover:underline"
                  >
                    ✕ REMOVE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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