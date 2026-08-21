"use client";
import React from "react";
import { DeliveryFormState, TrackingEvent } from "./formstate";
import { PanelHeader } from "./form";
import { TrackingEventsPanel } from "./tracking";

export function DeliveryPanel({
  delivery,
  updateField,
  toggleEdit,
  onUpdateForwarding,
  updating,
  awbTrackingNo,
  events,
  onAddEvent,
  onUpdateEvent,
  onRemoveEvent,
}: {
  delivery: DeliveryFormState;
  updateField: <K extends keyof DeliveryFormState>(
    field: K,
    value: DeliveryFormState[K]
  ) => void;
  toggleEdit: (field: "editExpectedDate" | "editConnectionDate") => void;
  onUpdateForwarding: () => void;
  updating: boolean;
  awbTrackingNo: string;
  events: TrackingEvent[];
  onAddEvent: () => void;
  onUpdateEvent: (id: string, patch: Partial<TrackingEvent>) => void;
  onRemoveEvent: (id: string) => void;
}) {
  const inputClass =
    "w-full h-9 px-2.5 rounded-md border border-axc-border text-xs text-axc-dark-gray focus:outline-none focus:ring-1 focus:ring-axc-navy disabled:bg-gray-50 disabled:text-gray-400";
  return (
    <div className="flex flex-col xl:flex-row gap-6 items-start w-full">
      <div className="flex flex-col gap-6 w-full xl:w-[360px] xl:shrink-0 xl:sticky xl:top-6 xl:self-start">
        <div className="bg-white rounded-xl border border-axc-border shadow-sm overflow-hidden flex flex-col">
          <PanelHeader title="Delivery Summary" />
          <div className="p-4 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-axc-gray uppercase">
                Forwarding Number
              </label>
              <input
                className={inputClass}
                value={delivery.forwardingNumber}
                onChange={(e) => updateField("forwardingNumber", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-axc-gray uppercase">
                Forwarding Number 2
              </label>
              <input
                className={inputClass}
                value={delivery.forwardingNumber2}
                onChange={(e) => updateField("forwardingNumber2", e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={onUpdateForwarding}
              disabled={updating}
              className="w-full h-9 bg-axc-navy hover:bg-axc-navy/80 text-white rounded-md text-xs font-bold transition disabled:opacity-60"
            >
              {updating ? "UPDATING..." : "UPDATE"}
            </button>
          </div>

          <div className="border-t border-axc-border mx-4 mb-4 rounded-md overflow-hidden border overflow-x-auto">
            <table className="w-full text-[11px] min-w-[280px]">
              <thead>
                <tr className="bg-axc-navy text-white">
                  <th className="text-left font-bold px-2 py-2"></th>
                  <th className="text-left font-bold px-2 py-2">Customer</th>
                  <th className="text-left font-bold px-2 py-2">Vendor</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-axc-border">
                  <td className="px-2 py-2 font-bold text-axc-dark-gray">
                    Expected Delivery Date
                  </td>
                  <td className="px-2 py-2 text-axc-gray">
                    {delivery.expectedDeliveryDateCustomer || "-"}
                  </td>
                  <td className="px-2 py-2 text-axc-gray">
                    {delivery.expectedDeliveryDateVendor || "-"}
                  </td>
                </tr>
                <tr className="border-t border-axc-border">
                  <td className="px-2 py-2 font-bold text-axc-dark-gray">
                    Actual TAT
                  </td>
                  <td className="px-2 py-2 text-axc-navy font-semibold">
                    {delivery.actualTatCustomer}
                  </td>
                  <td className="px-2 py-2 text-axc-navy font-semibold">
                    {delivery.actualTatVendor}
                  </td>
                </tr>
                <tr className="border-t border-axc-border">
                  <td className="px-2 py-2 font-bold text-axc-dark-gray">
                    Crossed EDD Days
                  </td>
                  <td className="px-2 py-2 text-axc-gray">
                    {delivery.crossedEddDaysCustomer || "-"}
                  </td>
                  <td className="px-2 py-2 text-axc-gray">
                    {delivery.crossedEddDaysVendor || "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-axc-border shadow-sm overflow-hidden flex flex-col">
          <PanelHeader title="Delivery" />
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
            <Field label="Expected Date">
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  className={inputClass}
                  value={delivery.expectedDate}
                  disabled={!delivery.editExpectedDate}
                  onChange={(e) => updateField("expectedDate", e.target.value)}
                />
                <label className="flex items-center gap-1 text-[10px] font-bold text-axc-gray whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={delivery.editExpectedDate}
                    onChange={() => toggleEdit("editExpectedDate")}
                  />
                  EDIT
                </label>
              </div>
            </Field>
            <Field label="Expected Time">
              <input
                type="time"
                className={inputClass}
                value={delivery.expectedTime}
                onChange={(e) => updateField("expectedTime", e.target.value)}
              />
            </Field>
            <Field label="Delivery Date">
              <input
                type="date"
                className={inputClass}
                value={delivery.deliveryDate}
                onChange={(e) => updateField("deliveryDate", e.target.value)}
              />
            </Field>

            <Field label="Delivery Time">
              <input
                type="time"
                className={inputClass}
                value={delivery.deliveryTime}
                onChange={(e) => updateField("deliveryTime", e.target.value)}
              />
            </Field>
            <Field label="API Crossed EDD Days">
              <input className={inputClass} disabled value={delivery.apiCrossedEddDays} />
            </Field>

            <Field label="Connection Date">
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  className={inputClass}
                  value={delivery.connectionDate}
                  disabled={!delivery.editConnectionDate}
                  onChange={(e) => updateField("connectionDate", e.target.value)}
                />
                <label className="flex items-center gap-1 text-[10px] font-bold text-axc-gray whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={delivery.editConnectionDate}
                    onChange={() => toggleEdit("editConnectionDate")}
                  />
                  EDIT
                </label>
              </div>
            </Field>

            <Field label="Connection Time">
              <input
                type="time"
                className={inputClass}
                value={delivery.connectionTime}
                onChange={(e) => updateField("connectionTime", e.target.value)}
              />
            </Field>

            <Field label="Appointment Date">
              <input
                type="date"
                className={inputClass}
                value={delivery.appointmentDate}
                onChange={(e) => updateField("appointmentDate", e.target.value)}
              />
            </Field>

            <Field label="Appointment Time">
              <input
                type="time"
                className={inputClass}
                value={delivery.appointmentTime}
                onChange={(e) => updateField("appointmentTime", e.target.value)}
              />
            </Field>

            <Field label="POD Uploaded Date">
              <input className={inputClass} disabled value={delivery.podUploadedDate} />
            </Field>

            <Field label="POD Uploaded Time">
              <input className={inputClass} disabled value={delivery.podUploadedTime} />
            </Field>

            <Field label="Delivery Cost">
              <input
                className={inputClass}
                value={delivery.deliveryCost}
                onChange={(e) => updateField("deliveryCost", e.target.value)}
              />
            </Field>

            <Field label="Receiver Name">
              <input
                className={inputClass}
                value={delivery.receiverName}
                onChange={(e) => updateField("receiverName", e.target.value)}
              />
            </Field>

            <Field label="Receiver Mobile">
              <input
                className={inputClass}
                value={delivery.receiverMobile}
                onChange={(e) => updateField("receiverMobile", e.target.value)}
              />
            </Field>

            <Field label="Receiver Email">
              <input
                className={inputClass}
                value={delivery.receiverEmail}
                onChange={(e) => updateField("receiverEmail", e.target.value)}
              />
            </Field>

            <Field label="Remarks">
              <input
                className={inputClass}
                value={delivery.remarks}
                onChange={(e) => updateField("remarks", e.target.value)}
              />
            </Field>

            <Field label="AWB Status Code">
              <input
                className={inputClass}
                value={delivery.awbStatusCode}
                onChange={(e) => updateField("awbStatusCode", e.target.value)}
              />
            </Field>

            <Field label="AWB Status Name">
              <input
                className={inputClass}
                value={delivery.awbStatusName}
                onChange={(e) => updateField("awbStatusName", e.target.value)}
              />
            </Field>

            <Field label="Reason For Status">
              <input
                className={inputClass}
                value={delivery.reasonForStatus}
                onChange={(e) => updateField("reasonForStatus", e.target.value)}
              />
            </Field>

            <Field label="COD Amount">
              <input
                className={inputClass}
                value={delivery.codAmount}
                onChange={(e) => updateField("codAmount", e.target.value)}
              />
            </Field>

            <Field label="COD Amount Collected">
              <div className="flex items-center gap-2">
                <input
                  className={inputClass}
                  value={delivery.codAmountCollected}
                  onChange={(e) =>
                    updateField("codAmountCollected", e.target.value)
                  }
                />
                <input
                  type="checkbox"
                  checked={delivery.codAmountCollectedChecked}
                  onChange={(e) =>
                    updateField("codAmountCollectedChecked", e.target.checked)
                  }
                />
              </div>
            </Field>

            <Field label="POD Hard Copy">
              <input
                type="checkbox"
                checked={delivery.podHardCopy}
                onChange={(e) => updateField("podHardCopy", e.target.checked)}
              />
            </Field>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1 px-5 py-4 border-t border-axc-border text-xs font-bold text-axc-dark-gray">
            <p>TOTAL PCS - {delivery.totalPcs}</p>
            <p>TOTAL PICKUP SCAN PARCELS - {delivery.totalPickupScanParcels}</p>
            <p>TOTAL INSCAN PARCELS - {delivery.totalInscanParcels}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-axc-border shadow-sm overflow-hidden flex flex-col p-5">
          <TrackingEventsPanel
            awbTrackingNo={awbTrackingNo}
            events={events}
            onAddEvent={onAddEvent}
            onUpdateEvent={onUpdateEvent}
            onRemoveEvent={onRemoveEvent}
          />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-bold text-axc-gray uppercase">
        {label}
      </label>
      <div>{children}</div>
    </div>
  );
}