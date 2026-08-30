"use client";
import React from "react";
import { DeliveryFormState, TrackingEvent } from "./formstate";
import { PanelHeader, EditIconButton } from "./form";
import { TrackingEventsPanel } from "./tracking";
import CommonTable from "../../src/common/table";

interface DeliverySummaryRow {
  label: string;
  customer: string;
  vendor: string;
  highlight: boolean;
}

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
    "border border-axc-border rounded-md px-3 py-2.5 outline-none w-full text-regular-small text-axc-gray placeholder:text-axc-gray transition placeholder:text-regular-small ";

  const deliverySummaryData: DeliverySummaryRow[] = [
    {
      label: "Expected Delivery Date",

      customer: delivery.expectedDeliveryDateCustomer || "-",
      vendor: delivery.expectedDeliveryDateVendor || "-",
      highlight: false,
    },
    {
      label: "Actual TAT",

      customer: delivery.actualTatCustomer || "-",
      vendor: delivery.actualTatVendor || "-",
      highlight: true,
    },
    {
      label: "Crossed EDD Days",

      customer: delivery.crossedEddDaysCustomer || "-",
      vendor: delivery.crossedEddDaysVendor || "-",
      highlight: false,
    },
  ];

  const deliverySummaryHeadings = [
    {
      label: "",
      key: "label",
      render: (row: DeliverySummaryRow) => (
        <span className="font-medium text-xs text-axc-dark-gray">{row.label}</span>
      ),
    },
    {
      label: "Customer",
      key: "customer",
      render: (row: DeliverySummaryRow) => (
        <span className={row.highlight ? "text-axc-navy font-semibold" : "text-axc-gray"}>
          {row.customer}
        </span>
      ),
    },
    {
      label: "Vendor",
      key: "vendor",
      render: (row: DeliverySummaryRow) => (
        <span className={row.highlight ? "text-axc-navy font-semibold" : "text-axc-gray"}>
          {row.vendor}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col xl:grid xl:grid-cols-12 gap-6 items-stretch w-full">
      <div className="flex flex-col w-full xl:col-span-3 h-full">
        {/* xl:sticky xl:top-0 xl:self-start */}
        <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col h-full">
          <PanelHeader title="Delivery Summary" />
          <div className="p-4 flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-regular-medium text-axc-dark-gray capitalize">
                  Forwarding Number
                </label>
                <input
                  placeholder="Forwarding Number"
                  className={inputClass}
                  value={delivery.forwardingNumber}
                  onChange={(e) => updateField("forwardingNumber", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-regular-medium text-axc-dark-gray capitalize">
                  Forwarding Number 2
                </label>
                <input
                  placeholder="Forwarding Number"
                  className={inputClass}
                  value={delivery.forwardingNumber2}
                  onChange={(e) => updateField("forwardingNumber2", e.target.value)}
                />
              </div>
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

          <div className="border-t border-axc-border mx-4 mb-4 flex-1 flex flex-col">
            <CommonTable
              headings={deliverySummaryHeadings}
              data={deliverySummaryData}

              rowKey="label"
              hidePagination={true}
              itemsPerPage={deliverySummaryData.length}
            />
          </div>
        </div>
      </div>
      <div className="xl:col-span-9 w-full flex flex-col h-full">
        <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col h-full">
          <PanelHeader title="Delivery" />
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 flex-1">
            <Field label="Expected Date">
              <div className="relative">
                <input
                  type="date"
                  className={`${inputClass} pr-9`}
                  value={delivery.expectedDate}
                  disabled={!delivery.editExpectedDate}
                  onChange={(e) => updateField("expectedDate", e.target.value)}
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2">
                  <EditIconButton
                    active={delivery.editExpectedDate}
                    onToggle={() => toggleEdit("editExpectedDate")}
                    title="Edit Expected Date"
                  />
                </div>
              </div>
            </Field>
            <Field label="Expected Time">
              <input
                placeholder="Expected Time"
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
              <input className={inputClass} disabled value={delivery.apiCrossedEddDays} placeholder="API Crossed EDD Days" />
            </Field>

            <Field label="Connection Date">
              <div className="relative">
                <input
                  placeholder="Connection Date"
                  type="date"
                  className={`${inputClass} pr-9`}
                  value={delivery.connectionDate}
                  disabled={!delivery.editConnectionDate}
                  onChange={(e) => updateField("connectionDate", e.target.value)}
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2">
                  <EditIconButton
                    active={delivery.editConnectionDate}
                    onToggle={() => toggleEdit("editConnectionDate")}
                    title="Edit Connection Date"
                  />
                </div>
              </div>
            </Field>

            <Field label="Connection Time">
              <input
                placeholder="Connection Time"
                type="time"
                className={inputClass}
                value={delivery.connectionTime}
                onChange={(e) => updateField("connectionTime", e.target.value)}
              />
            </Field>

            <Field label="Appointment Date">
              <input
                placeholder="Appointment Date"
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
              <input className={inputClass} disabled value={delivery.podUploadedDate} placeholder="POD Uploaded Date" />
            </Field>

            <Field label="POD Uploaded Time">
              <input className={inputClass} disabled value={delivery.podUploadedTime} placeholder="POD Uploaded Time" />
            </Field>

            <Field label="Delivery Cost">
              <input
                placeholder="Delivery Cost"
                className={inputClass}
                value={delivery.deliveryCost}
                onChange={(e) => updateField("deliveryCost", e.target.value)}
              />
            </Field>

            <Field label="Receiver Name">
              <input
                placeholder="Receiver Name"
                className={inputClass}
                value={delivery.receiverName}
                onChange={(e) => updateField("receiverName", e.target.value)}
              />
            </Field>

            <Field label="Receiver Mobile">
              <input
                placeholder="Receiver Mobile"
                className={inputClass}
                value={delivery.receiverMobile}
                onChange={(e) => updateField("receiverMobile", e.target.value)}
              />
            </Field>

            <Field label="Receiver Email">
              <input
                placeholder="Receiver Email"
                className={inputClass}
                value={delivery.receiverEmail}
                onChange={(e) => updateField("receiverEmail", e.target.value)}
              />
            </Field>

            <Field label="Remarks">
              <input
                placeholder="Remarks"
                className={inputClass}
                value={delivery.remarks}
                onChange={(e) => updateField("remarks", e.target.value)}
              />
            </Field>

            <Field label="AWB Status Code">
              <input
                placeholder="AWB Status Code"
                className={inputClass}
                value={delivery.awbStatusCode}
                onChange={(e) => updateField("awbStatusCode", e.target.value)}
              />
            </Field>

            <Field label="AWB Status Name">
              <input
                placeholder="AWB Status Name"
                className={inputClass}
                value={delivery.awbStatusName}
                onChange={(e) => updateField("awbStatusName", e.target.value)}
              />
            </Field>

            <Field label="Reason For Status">
              <input
                placeholder="Reason For Status"
                className={inputClass}
                value={delivery.reasonForStatus}
                onChange={(e) => updateField("reasonForStatus", e.target.value)}
              />
            </Field>

            <Field label="COD Amount">
              <input
                placeholder="COD Amount"
                className={inputClass}
                value={delivery.codAmount}
                onChange={(e) => updateField("codAmount", e.target.value)}
              />
            </Field>

            <Field label="COD Amount Collected">
              <div className="relative">
                <input
                  placeholder="COD Amount Collected"
                  className={`${inputClass} pr-9`}
                  value={delivery.codAmountCollected}
                  onChange={(e) =>
                    updateField("codAmountCollected", e.target.value)
                  }
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2">
                  <EditIconButton
                    active={delivery.codAmountCollectedChecked}
                    onToggle={() =>
                      updateField("codAmountCollectedChecked", !delivery.codAmountCollectedChecked)
                    }
                    title="Edit COD Amount Collected"
                  />
                </div>
              </div>
            </Field>
            <div className="flex items-center gap-2 mt-1">

              <label htmlFor="podHardCopy" className="text-regular-medium text-axc-dark-gray capitalize cursor-pointer">
                POD Hard Copy
              </label>
              <input
                type="checkbox"
                id="podHardCopy"
                className="cursor-pointer"
                checked={delivery.podHardCopy}
                onChange={(e) => updateField("podHardCopy", e.target.checked)}
              />
            </div>

          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1 px-5 py-4 border-t border-axc-border text-sm  text-regular-semibold text-axc-dark-gray">
            <p>TOTAL PCS - {delivery.totalPcs}</p>
            <p>TOTAL PICKUP SCAN PARCELS - {delivery.totalPickupScanParcels}</p>
            <p>TOTAL INSCAN PARCELS - {delivery.totalInscanParcels}</p>
          </div>
        </div>
      </div>

      <div className="w-full col-span-12">
        <div className="bg-white rounded-xl border border-axc-border shadow-sm overflow-hidden flex flex-col p-4">
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
      <label className="text-regular-medium text-axc-dark-gray capitalize">
        {label}
      </label>
      <div>{children}</div>
    </div>
  );
}