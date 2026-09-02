"use client";
import React from "react";
import { DeliveryFormState, TrackingEvent } from "./formstate";
import { PanelHeader, EditIconButton, inputClass } from "./form";
import { TrackingEventsPanel } from "./tracking";
import CommonTable from "../../src/common/table";
import CustomDatePicker from "../../src/common/datepicker";
import CustomTimePicker from "../../src/common/timepicker";

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
    <div className="flex flex-col gap-6 w-full">
      {/* Grid Layout: Forwarding Numbers (col-span-3) & Delivery Content (col-span-9) */}
      <div className="flex flex-col xl:grid xl:grid-cols-12 gap-6 items-start w-full">
        {/* Forwarding Numbers (col-span-3) */}
        <div className="flex flex-col w-full xl:col-span-3 xl:sticky xl:top-0 self-start">
          <div className="bg-white rounded-lg border border-axc-border shadow-sm p-4 flex flex-col justify-between gap-3">
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
                placeholder="Forwarding Number 2"
                className={inputClass}
                value={delivery.forwardingNumber2}
                onChange={(e) => updateField("forwardingNumber2", e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={onUpdateForwarding}
              disabled={updating}
              className="w-full h-9 bg-axc-navy hover:bg-axc-navy/80 text-white rounded-md text-xs font-bold transition disabled:opacity-60 cursor-pointer mt-1"
            >
              {updating ? "UPDATING..." : "UPDATE"}
            </button>
          </div>
        </div>

        {/* Right Column: Delivery Summary & Delivery Form (col-span-9) */}
        <div className="flex flex-col gap-6 w-full xl:col-span-9">
          {/* Delivery Summary */}
          <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 flex-1 flex flex-col justify-center">
              <CommonTable
                headings={deliverySummaryHeadings}
                data={deliverySummaryData}
                rowKey="label"
                hidePagination={true}
                itemsPerPage={deliverySummaryData.length}
                showScroll={false}
              />
            </div>
          </div>

          {/* Delivery Form */}
          <div className="w-full">
            <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col h-full">
              <PanelHeader title="Delivery" />
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 flex-1">
                <Field label="Expected Date">
                  <div className="relative">
                    <CustomDatePicker
                      value={delivery.expectedDate}
                      disabled={!delivery.editExpectedDate}
                      onChange={(val) => updateField("expectedDate", val)}
                      placeholder="Expected Date"
                      className="pr-9"
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
                   <CustomTimePicker
                    value={delivery.expectedTime}
                    onChange={(val) => updateField("expectedTime", val)}
                     placeholder="Select expected time"
                      />
                </Field>
                <Field label="Delivery Date">
                  <CustomDatePicker
                    value={delivery.deliveryDate}
                    onChange={(val) => updateField("deliveryDate", val)}
                    placeholder="Delivery Date"
                  />
                </Field>

                <Field label="Delivery Time">
                  <CustomTimePicker
                    value={delivery.deliveryTime}
                    onChange={(val) => updateField("deliveryTime", val)}
                     placeholder="Select delivery time"
                      />
                </Field>
                <Field label="API Crossed EDD Days">
                  <input
                    className={inputClass}
                    disabled
                    value={delivery.apiCrossedEddDays}
                    placeholder="API Crossed EDD Days"
                  />
                </Field>

                <Field label="Connection Date">
                  <div className="relative">
                    <CustomDatePicker
                      value={delivery.connectionDate}
                      disabled={!delivery.editConnectionDate}
                      onChange={(val) => updateField("connectionDate", val)}
                      placeholder="Connection Date"
                      className="pr-9"
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
                  <CustomTimePicker
                  <CustomTimePicker
                    value={delivery.connectionTime}
                    onChange={(val) => updateField("connectionTime", val)}
                    placeholder="Select connection time"
                  />
                    onChange={(val) => updateField("connectionTime", val)}
                     placeholder="Select connection time"
                      />
                </Field>

                <Field label="Appointment Date">
                  <CustomDatePicker
                    value={delivery.appointmentDate}
                    onChange={(val) => updateField("appointmentDate", val)}
                    placeholder="Appointment Date"
                  />
                </Field>

                <Field label="Appointment Time">
                  <CustomTimePicker
                    value={delivery.appointmentTime}
                    onChange={(val) => updateField("appointmentTime", val)}
                    placeholder="Select appointment time"
                  />
                </Field>

                <Field label="POD Uploaded Date">
                  <input
                    className={inputClass}
                    disabled
                    value={delivery.podUploadedDate}
                    placeholder="POD Uploaded Date"
                  />
                </Field>

                <Field label="POD Uploaded Time">
                  <input
                    className={inputClass}
                    disabled
                    value={delivery.podUploadedTime}
                    placeholder="POD Uploaded Time"
                  />
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
                          updateField(
                            "codAmountCollectedChecked",
                            !delivery.codAmountCollectedChecked
                          )
                        }
                        title="Edit COD Amount Collected"
                      />
                    </div>
                  </div>
                </Field>

                <div className="flex items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    id="podHardCopy"
                    className="cursor-pointer h-4 w-4 rounded border-gray-300 text-axc-navy focus:ring-axc-navy"
                    checked={delivery.podHardCopy}
                    onChange={(e) => updateField("podHardCopy", e.target.checked)}
                  />
                  <label
                    htmlFor="podHardCopy"
                    className="text-regular-medium text-axc-dark-gray capitalize cursor-pointer select-none"
                  >
                    POD Hard Copy
                  </label>
                </div>
              </div>

              <div className="flex justify-end items-end w-full flex-wrap gap-x-6 gap-y-1 px-5 py-4 border-t border-axc-border text-sm text-regular-semibold text-axc-dark-gray">
                <p>TOTAL PCS - {delivery.totalPcs}</p>
                <p>TOTAL PICKUP SCAN PARCELS - {delivery.totalPickupScanParcels}</p>
                <p>TOTAL INSCAN PARCELS - {delivery.totalInscanParcels}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Events Panel (Full Width) */}
      <div className="w-full">
        <div className="bg-white rounded-xl border border-axc-border shadow-sm overflow-visible flex flex-col p-4">
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