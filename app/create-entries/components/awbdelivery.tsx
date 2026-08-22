"use client";
import React from "react";
import { useAwbDelivery } from "./deliveries";
import { DeliveryPanel } from "./delivery";

export function AwbDeliveryTab({ awbTrackingNo }: { awbTrackingNo: string }) {
  const {
    delivery,
    updateField,
    toggleEdit,
    events,
    addEvent,
    updateEvent,
    removeEvent,
    saving,
    saved,
    updating,
    handleUpdateForwarding,
    handleSaveDelivery,
  } = useAwbDelivery();

  return (
    <div className="flex flex-col gap-6 w-full pb-2">
      <DeliveryPanel
        delivery={delivery}
        updateField={updateField}
        toggleEdit={toggleEdit}
        onUpdateForwarding={handleUpdateForwarding}
        updating={updating}
        awbTrackingNo={awbTrackingNo}
        events={events}
        onAddEvent={addEvent}
        onUpdateEvent={updateEvent}
        onRemoveEvent={removeEvent}
      />

      <div className="flex justify-end gap-3 bg-white p-4 rounded-2xl border border-axc-border shadow-sm">
        <button
          type="button"
          onClick={handleSaveDelivery}
          disabled={saving}
          className="px-5 py-2 bg-axc-navy hover:bg-axc-navy/80 text-white rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-60"
        >
          {saving ? "SAVING..." : saved ? "SAVED" : "SAVE DELIVERY"}
        </button>
      </div>
    </div>
  );
}