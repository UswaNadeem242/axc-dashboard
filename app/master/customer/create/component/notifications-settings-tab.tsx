"use client";

import React from "react";
import { showToast } from "@/app/src/common/toast";
import {
  CustomerNotificationSettings,
  defaultNotificationSettings,
  AccountActivationSettings,
  AwbShipmentControlsSettings,
  BookingEmailsSettings,
  WeightChangeNotificationsSettings,
  InvoicePaymentAccountNotificationsSettings,
  DeliveryNotificationsSettings,
} from "../../types";

interface NotificationsSettingsTabProps {
  data: CustomerNotificationSettings;
  onChange: (data: CustomerNotificationSettings) => void;
  onSave?: () => void;
  loading?: boolean;
}

// ── Reusable Column Card with AWB Look & Feel ───────────────────────────────
function ColumnCard({
  title,
  onToggleAll,
  allChecked,
  children,
  className = "",
}: {
  title: string;
  onToggleAll: () => void;
  allChecked: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-lg border border-axc-border shadow-xs overflow-hidden flex flex-col h-full min-h-[265px] transition-all duration-150 hover:shadow-sm ${className}`}
    >
      {/* AWB Panel Header with Select All toggle */}
      <div className="bg-[#7B7FAD] bg-axc-navy/60 text-white px-5 py-3 flex items-center justify-between shrink-0">
        <h3 className="text-xs sm:text-[13px] font-bold capitalize tracking-wide text-white">
          {title}
        </h3>
        <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] font-semibold text-white/90 hover:text-white transition">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={onToggleAll}
            className="h-3.5 w-3.5 rounded border-white/40 text-axc-navy focus:ring-0 cursor-pointer accent-axc-navy"
          />
          <span>Select All</span>
        </label>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col gap-3.5 flex-1 bg-white overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

// ── Checkbox Item Component ─────────────────────────────────────────────────
function CheckboxItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer text-xs font-medium text-axc-dark-gray hover:text-axc-navy select-none py-1 transition-colors leading-tight">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-axc-navy focus:ring-axc-navy/30 cursor-pointer mt-0.5 accent-axc-navy shrink-0"
      />
      <span>{label}</span>
    </label>
  );
}

export default function NotificationsSettingsTab({
  data,
  onChange,
  onSave,
  loading = false,
}: NotificationsSettingsTabProps) {
  // ── Account Activation Helpers ─────────────────────────────────────────────
  const updateAccountActivation = <K extends keyof AccountActivationSettings>(
    key: K,
    val: AccountActivationSettings[K]
  ) => {
    onChange({
      ...data,
      accountActivation: {
        ...(data.accountActivation || {
          sendAccountActivationEmail: false,
          sendAccountActivationLinkWhatsappAndEmail: false,
        }),
        [key]: val,
      },
    });
  };

  const isAllAccountActivationChecked = () => {
    return Boolean(
      data.accountActivation?.sendAccountActivationEmail &&
      data.accountActivation?.sendAccountActivationLinkWhatsappAndEmail
    );
  };

  const toggleAllAccountActivation = () => {
    const next = !isAllAccountActivationChecked();
    onChange({
      ...data,
      accountActivation: {
        sendAccountActivationEmail: next,
        sendAccountActivationLinkWhatsappAndEmail: next,
      },
    });
  };

  // ── Weight Change Notifications Helpers ─────────────────────────────────────
  const updateWeightChangeNotifications = <
    K extends keyof WeightChangeNotificationsSettings
  >(
    key: K,
    val: WeightChangeNotificationsSettings[K]
  ) => {
    onChange({
      ...data,
      weightChangeNotifications: {
        ...(data.weightChangeNotifications || {
          sendWeightChangeEmailForEachAwb: false,
          sendDailyWeightChangeSummaryEmail: false,
          sendWeightChangeEmailNotifications: false,
        }),
        [key]: val,
      },
    });
  };

  const isAllWeightChangeNotificationsChecked = () => {
    const w = data.weightChangeNotifications;
    return Boolean(
      w?.sendWeightChangeEmailForEachAwb &&
      w?.sendDailyWeightChangeSummaryEmail &&
      w?.sendWeightChangeEmailNotifications
    );
  };

  const toggleAllWeightChangeNotifications = () => {
    const next = !isAllWeightChangeNotificationsChecked();
    onChange({
      ...data,
      weightChangeNotifications: {
        sendWeightChangeEmailForEachAwb: next,
        sendDailyWeightChangeSummaryEmail: next,
        sendWeightChangeEmailNotifications: next,
      },
    });
  };

  // ── AWB & Shipment Controls Helpers ────────────────────────────────────────
  const updateAwbShipmentControls = <K extends keyof AwbShipmentControlsSettings>(
    key: K,
    val: AwbShipmentControlsSettings[K]
  ) => {
    onChange({
      ...data,
      awbShipmentControls: {
        ...(data.awbShipmentControls || {
          sendNotificationsForShipmentHoldAndVoid: false,
          enableEditingOfAwbNumbers: false,
          calculateBillingBasedOnActualWeight: false,
          sendBookingWhatsappNotificationsToCustomers: false,
          sendLabelReprintWhatsappNotificationsToConsignees: false,
        }),
        [key]: val,
      },
    });
  };

  const isAllAwbShipmentControlsChecked = () => {
    const ctrl = data.awbShipmentControls;
    return Boolean(
      ctrl?.sendNotificationsForShipmentHoldAndVoid &&
      ctrl?.enableEditingOfAwbNumbers &&
      ctrl?.calculateBillingBasedOnActualWeight &&
      ctrl?.sendBookingWhatsappNotificationsToCustomers &&
      ctrl?.sendLabelReprintWhatsappNotificationsToConsignees
    );
  };

  const toggleAllAwbShipmentControls = () => {
    const next = !isAllAwbShipmentControlsChecked();
    onChange({
      ...data,
      awbShipmentControls: {
        sendNotificationsForShipmentHoldAndVoid: next,
        enableEditingOfAwbNumbers: next,
        calculateBillingBasedOnActualWeight: next,
        sendBookingWhatsappNotificationsToCustomers: next,
        sendLabelReprintWhatsappNotificationsToConsignees: next,
      },
    });
  };

  // ── Invoice, Payment & Account Notifications Helpers ─────────────────────────
  const updateInvoicePaymentAccountNotifications = <
    K extends keyof InvoicePaymentAccountNotificationsSettings
  >(
    key: K,
    val: InvoicePaymentAccountNotificationsSettings[K]
  ) => {
    onChange({
      ...data,
      invoicePaymentAccountNotifications: {
        ...(data.invoicePaymentAccountNotifications || {
          sendInvoiceThroughWhatsappToCustomers: false,
          sendReceiptThroughWhatsappToCustomers: false,
          sendCreditLimitNotificationsThroughWhatsappToCustomers: false,
          sendOutstandingBalanceEmails: false,
          sendInvoiceEmails: false,
        }),
        [key]: val,
      },
    });
  };

  const isAllInvoicePaymentAccountNotificationsChecked = () => {
    const inv = data.invoicePaymentAccountNotifications;
    return Boolean(
      inv?.sendInvoiceThroughWhatsappToCustomers &&
      inv?.sendReceiptThroughWhatsappToCustomers &&
      inv?.sendCreditLimitNotificationsThroughWhatsappToCustomers &&
      inv?.sendOutstandingBalanceEmails &&
      inv?.sendInvoiceEmails
    );
  };

  const toggleAllInvoicePaymentAccountNotifications = () => {
    const next = !isAllInvoicePaymentAccountNotificationsChecked();
    onChange({
      ...data,
      invoicePaymentAccountNotifications: {
        sendInvoiceThroughWhatsappToCustomers: next,
        sendReceiptThroughWhatsappToCustomers: next,
        sendCreditLimitNotificationsThroughWhatsappToCustomers: next,
        sendOutstandingBalanceEmails: next,
        sendInvoiceEmails: next,
      },
    });
  };

  // ── Booking Emails Helpers ─────────────────────────────────────────────────
  const updateBookingEmails = <K extends keyof BookingEmailsSettings>(
    key: K,
    val: BookingEmailsSettings[K]
  ) => {
    onChange({
      ...data,
      bookingEmails: {
        ...(data.bookingEmails || {
          sendBookingEmailForEachAwb: false,
          sendDailyBookingSummaryEmail: false,
        }),
        [key]: val,
      },
    });
  };

  const isAllBookingEmailsChecked = () => {
    const b = data.bookingEmails;
    return Boolean(b?.sendBookingEmailForEachAwb && b?.sendDailyBookingSummaryEmail);
  };

  const toggleAllBookingEmails = () => {
    const next = !isAllBookingEmailsChecked();
    onChange({
      ...data,
      bookingEmails: {
        sendBookingEmailForEachAwb: next,
        sendDailyBookingSummaryEmail: next,
      },
    });
  };

  // ── Delivery Notifications Helpers ─────────────────────────────────────────
  const updateDeliveryNotifications = <
    K extends keyof DeliveryNotificationsSettings
  >(
    key: K,
    val: DeliveryNotificationsSettings[K]
  ) => {
    onChange({
      ...data,
      deliveryNotifications: {
        ...(data.deliveryNotifications || {
          sendDeliveryConfirmationEmailsToCustomers: false,
        }),
        [key]: val,
      },
    });
  };

  const isAllDeliveryNotificationsChecked = () => {
    const d = data.deliveryNotifications;
    return Boolean(d?.sendDeliveryConfirmationEmailsToCustomers);
  };

  const toggleAllDeliveryNotifications = () => {
    const next = !isAllDeliveryNotificationsChecked();
    onChange({
      ...data,
      deliveryNotifications: {
        sendDeliveryConfirmationEmailsToCustomers: next,
      },
    });
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      showToast({
        variant: "success",
        message: "Notification & System settings saved successfully!",
      });
    }
  };

  const handleReset = () => {
    onChange({ ...defaultNotificationSettings });
  };

  return (
    <div className="flex flex-col gap-6 w-full mt-4 pb-6">
      {/* ── 3-Column Responsive Grid with Equal Heights ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
        {/* ══════════ 1. ACCOUNT ACTIVATION ══════════ */}
        <ColumnCard
          title="Account Activation"
          allChecked={isAllAccountActivationChecked()}
          onToggleAll={toggleAllAccountActivation}
        >
          <CheckboxItem
            label="Send account activation email."
            checked={data.accountActivation?.sendAccountActivationEmail ?? false}
            onChange={(val) => updateAccountActivation("sendAccountActivationEmail", val)}
          />
          <CheckboxItem
            label="Send account activation link through WhatsApp and email"
            checked={
              data.accountActivation?.sendAccountActivationLinkWhatsappAndEmail ?? false
            }
            onChange={(val) =>
              updateAccountActivation("sendAccountActivationLinkWhatsappAndEmail", val)
            }
          />
        </ColumnCard>

        {/* ══════════ 2. AWB & SHIPMENT CONTROLS ══════════ */}
        <ColumnCard
          title="AWB & Shipment Controls"
          allChecked={isAllAwbShipmentControlsChecked()}
          onToggleAll={toggleAllAwbShipmentControls}
        >
          <CheckboxItem
            label="Send notifications for shipment hold and void status."
            checked={
              data.awbShipmentControls?.sendNotificationsForShipmentHoldAndVoid ?? false
            }
            onChange={(val) =>
              updateAwbShipmentControls("sendNotificationsForShipmentHoldAndVoid", val)
            }
          />
          <CheckboxItem
            label="Enable editing of AWB numbers."
            checked={data.awbShipmentControls?.enableEditingOfAwbNumbers ?? false}
            onChange={(val) =>
              updateAwbShipmentControls("enableEditingOfAwbNumbers", val)
            }
          />
          <CheckboxItem
            label="Calculate billing based on actual weight."
            checked={
              data.awbShipmentControls?.calculateBillingBasedOnActualWeight ?? false
            }
            onChange={(val) =>
              updateAwbShipmentControls("calculateBillingBasedOnActualWeight", val)
            }
          />
          <CheckboxItem
            label="Send booking WhatsApp notifications to customers."
            checked={
              data.awbShipmentControls?.sendBookingWhatsappNotificationsToCustomers ??
              false
            }
            onChange={(val) =>
              updateAwbShipmentControls(
                "sendBookingWhatsappNotificationsToCustomers",
                val
              )
            }
          />
          <CheckboxItem
            label="Send label reprint WhatsApp notifications to consignees."
            checked={
              data.awbShipmentControls
                ?.sendLabelReprintWhatsappNotificationsToConsignees ?? false
            }
            onChange={(val) =>
              updateAwbShipmentControls(
                "sendLabelReprintWhatsappNotificationsToConsignees",
                val
              )
            }
          />
        </ColumnCard>

        {/* ══════════ 3. BOOKING EMAILS ══════════ */}
        <ColumnCard
          title="Booking Emails"
          allChecked={isAllBookingEmailsChecked()}
          onToggleAll={toggleAllBookingEmails}
        >
          <CheckboxItem
            label="Send booking email for each AWB."
            checked={data.bookingEmails?.sendBookingEmailForEachAwb ?? false}
            onChange={(val) => updateBookingEmails("sendBookingEmailForEachAwb", val)}
          />
          <CheckboxItem
            label="Send daily booking summary email."
            checked={data.bookingEmails?.sendDailyBookingSummaryEmail ?? false}
            onChange={(val) => updateBookingEmails("sendDailyBookingSummaryEmail", val)}
          />
        </ColumnCard>

        {/* ══════════ 4. WEIGHT CHANGE NOTIFICATIONS ══════════ */}
        <ColumnCard
          title="Weight Change Notifications"
          allChecked={isAllWeightChangeNotificationsChecked()}
          onToggleAll={toggleAllWeightChangeNotifications}
        >
          <CheckboxItem
            label="Send weight change email for each AWB."
            checked={
              data.weightChangeNotifications?.sendWeightChangeEmailForEachAwb ?? false
            }
            onChange={(val) =>
              updateWeightChangeNotifications("sendWeightChangeEmailForEachAwb", val)
            }
          />
          <CheckboxItem
            label="Send daily weight change summary email."
            checked={
              data.weightChangeNotifications?.sendDailyWeightChangeSummaryEmail ?? false
            }
            onChange={(val) =>
              updateWeightChangeNotifications("sendDailyWeightChangeSummaryEmail", val)
            }
          />
          <CheckboxItem
            label="Send weight change email notifications."
            checked={
              data.weightChangeNotifications?.sendWeightChangeEmailNotifications ?? false
            }
            onChange={(val) =>
              updateWeightChangeNotifications(
                "sendWeightChangeEmailNotifications",
                val
              )
            }
          />
        </ColumnCard>

        {/* ══════════ 5. INVOICE, PAYMENT & ACCOUNT NOTIFICATIONS ══════════ */}
        <ColumnCard
          title="Invoice, Payment & Account Notifications"
          allChecked={isAllInvoicePaymentAccountNotificationsChecked()}
          onToggleAll={toggleAllInvoicePaymentAccountNotifications}
        >
          <CheckboxItem
            label="Send invoice through WhatsApp to customers."
            checked={
              data.invoicePaymentAccountNotifications
                ?.sendInvoiceThroughWhatsappToCustomers ?? false
            }
            onChange={(val) =>
              updateInvoicePaymentAccountNotifications(
                "sendInvoiceThroughWhatsappToCustomers",
                val
              )
            }
          />
          <CheckboxItem
            label="Send receipt through WhatsApp to customers."
            checked={
              data.invoicePaymentAccountNotifications
                ?.sendReceiptThroughWhatsappToCustomers ?? false
            }
            onChange={(val) =>
              updateInvoicePaymentAccountNotifications(
                "sendReceiptThroughWhatsappToCustomers",
                val
              )
            }
          />
          <CheckboxItem
            label="Send credit limit notifications through WhatsApp to customers."
            checked={
              data.invoicePaymentAccountNotifications
                ?.sendCreditLimitNotificationsThroughWhatsappToCustomers ?? false
            }
            onChange={(val) =>
              updateInvoicePaymentAccountNotifications(
                "sendCreditLimitNotificationsThroughWhatsappToCustomers",
                val
              )
            }
          />
          <CheckboxItem
            label="Send outstanding balance emails."
            checked={
              data.invoicePaymentAccountNotifications
                ?.sendOutstandingBalanceEmails ?? false
            }
            onChange={(val) =>
              updateInvoicePaymentAccountNotifications(
                "sendOutstandingBalanceEmails",
                val
              )
            }
          />
          <CheckboxItem
            label="Send invoice emails."
            checked={
              data.invoicePaymentAccountNotifications?.sendInvoiceEmails ?? false
            }
            onChange={(val) =>
              updateInvoicePaymentAccountNotifications("sendInvoiceEmails", val)
            }
          />
        </ColumnCard>

        {/* ══════════ 6. DELIVERY NOTIFICATIONS ══════════ */}
        <ColumnCard
          title="Delivery Notifications"
          allChecked={isAllDeliveryNotificationsChecked()}
          onToggleAll={toggleAllDeliveryNotifications}
        >
          <CheckboxItem
            label="Send delivery confirmation emails to customers."
            checked={
              data.deliveryNotifications
                ?.sendDeliveryConfirmationEmailsToCustomers ?? false
            }
            onChange={(val) =>
              updateDeliveryNotifications(
                "sendDeliveryConfirmationEmailsToCustomers",
                val
              )
            }
          />
        </ColumnCard>
      </div>

      {/* ── Bottom Action Buttons ── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="px-5 py-4 border border-axc-border bg-white text-axc-dark-gray rounded-lg text-regular-small hover:bg-gray-50 transition cursor-pointer"
        >
          Reset Defaults
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Notification Settings"}
        </button>
      </div>
    </div>
  );
}
