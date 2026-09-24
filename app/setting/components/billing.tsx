"use client";
import React from "react";
import {
  Crown,
  CreditCard,
  Receipt,
  Download,
  Trash2,
  PlusCircleIcon,
  ArrowUpCircle,
} from "lucide-react";
import { PanelHeader } from "./settingform";
import { BillingPlan, PaymentMethod, BillingHistoryItem, InvoiceStatus } from "./settingstate";
import Button from "../../src/common/button";

interface BillingSettingsProps {
  plan: BillingPlan;
  paymentMethods: PaymentMethod[];
  billingHistory: BillingHistoryItem[];
  handleAddCard: () => void;
  handleRemoveCard: (id: string) => void;
  handleSetDefault: (id: string) => void;
  handleUpgradePlan: () => void;
  handleDownloadInvoice: (id: string) => void;
}

const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const styles: Record<InvoiceStatus, string> = {
    Paid: "bg-axc-green/10 text-axc-green",
    Pending: "bg-axc-yellow/10 text-axc-yellow",
    Failed: "bg-axc-red/10 text-axc-red",
  };
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function BillingSettings({
  plan,
  paymentMethods,
  billingHistory,
  handleAddCard,
  handleRemoveCard,
  handleSetDefault,
  handleUpgradePlan,
  handleDownloadInvoice,
}: BillingSettingsProps) {
  const totalPaid = billingHistory
    .filter((item) => item.status === "Paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col">
      <PanelHeader title="Billing & Subscription" />
      <div className="m-6 p-4 flex flex-col gap-4 rounded-md border border-axc-yellow bg-axc-yellow text-white">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-md bg-white text-axc-yellow flex items-center justify-center shrink-0">
              <Crown size={24} />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold">{plan.name} Plan</span>
                <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full capitalize">
                  {plan.status}
                </span>
              </div>
              <span className="text-regular-small">Your current subscription</span>
            </div>
          </div>

          <Button
            label="Upgrade Plan"
            icon={ArrowUpCircle}
            variant="primary"
            onClick={handleUpgradePlan}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 border-t border-white/30 pt-4">
          <div className="flex flex-col gap-1">
            <span className="text-regular-small">You will pay</span>
            <span className="text-xl font-bold">{formatCurrency(plan.price)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-regular-small">Next Billing Date</span>
            <span className="text-xl font-bold">{plan.nextBillingDate}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-regular-small">Active Users</span>
            <span className="text-xl font-bold">
              {plan.activeUsers} <span className="text-regular-small font-normal">/ {plan.maxUsers}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mx-6 mb-6 p-4 rounded-md border border-axc-border">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-md flex items-center justify-center shrink-0 bg-blue-50 text-axc-navy">
              <CreditCard size={18} />
            </span>
            <div className="flex flex-col">
              <h3 className="font-bold text-axc-dark-gray">Payment Method</h3>
              <span className="text-regular-small text-axc-gray">Manage your payment information</span>
            </div>
          </div>
          <Button
            label="Add Card"
            icon={PlusCircleIcon}
            variant="primary"
            onClick={handleAddCard}
          />
        </div>

        {paymentMethods.length > 0 ? (
          <div className="flex flex-col gap-3">
            {paymentMethods.map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between gap-4 p-3 rounded-md border border-axc-border"
              >
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-md flex items-center justify-center shrink-0 bg-gray-100 text-axc-gray">
                    <CreditCard size={18} />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-axc-dark-gray">
                        {card.brand} •••• {card.last4}
                      </span>
                      {card.isDefault && (
                        <span className="text-[10px] font-semibold text-axc-navy bg-axc-navy/10 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <span className="text-regular-small text-axc-gray">
                      {card.cardHolder} | Expires {card.expiry}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {!card.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(card.id)}
                      className="text-regular-small text-axc-navy hover:text-axc-navy/80 transition cursor-pointer"
                    >
                      Set as default
                    </button>
                  )}
                  <button
                    type="button"
                    title="Remove"
                    onClick={() => handleRemoveCard(card.id)}
                    className="inline-flex cursor-pointer items-center justify-center rounded-md border border-axc-red/30 p-1.5 text-axc-red transition hover:bg-axc-red/10"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-axc-gray">
            <CreditCard size={32} />
            <span className="text-regular-small">No payment methods saved yet.</span>
          </div>
        )}
      </div>
      <div className="mx-6 mb-6 p-4 rounded-md border border-axc-border">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-10 w-10 rounded-md flex items-center justify-center shrink-0 bg-blue-50 text-axc-navy">
            <Receipt size={18} />
          </span>
          <div className="flex flex-col">
            <h3 className="font-bold text-axc-dark-gray">Billing History</h3>
            <span className="text-regular-small text-axc-gray">
              Download your previous plan invoices and receipts
            </span>
          </div>
        </div>

        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="border border-axc-border rounded-md overflow-hidden">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="bg-axc-navy/10 text-regular-medium text-axc-dark-gray text-left whitespace-nowrap">
                  <th className="py-2.5 px-3 border-r border-axc-border">Date</th>
                  <th className="py-2.5 px-3 border-r border-axc-border">Invoice</th>
                  <th className="py-2.5 px-3 border-r border-axc-border">Amount</th>
                  <th className="py-2.5 px-3 border-r border-axc-border">Status</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12">
                      <div className="flex flex-col items-center justify-center gap-2 text-axc-gray">
                        <Receipt size={32} />
                        <span className="text-regular-small">No billing history found</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {billingHistory.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-axc-border last:border-b-0 hover:bg-gray-50/50"
                      >
                        <td className="py-3 px-3 text-regular-small text-axc-gray whitespace-nowrap">
                          {item.date}
                        </td>
                        <td className="py-3 px-3 text-regular-small font-medium text-axc-dark-gray whitespace-nowrap">
                          {item.invoice}
                        </td>
                        <td className="py-3 px-3 text-regular-small text-axc-gray whitespace-nowrap">
                          {formatCurrency(item.amount)}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <InvoiceStatusBadge status={item.status} />
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            title="Download invoice"
                            onClick={() => handleDownloadInvoice(item.id)}
                            className="inline-flex cursor-pointer items-center justify-center rounded-md border border-axc-navy/30 p-1.5 text-axc-navy transition hover:bg-axc-navy/10"
                          >
                            <Download size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t border-axc-border">
                      <td colSpan={2} className="py-2.5 px-3 text-right font-bold text-black">
                        TOTAL PAID
                      </td>
                      <td colSpan={3} className="py-2 px-3">
                        <input
                          type="text"
                          readOnly
                          value={formatCurrency(totalPaid)}
                          className="w-28 border outline-none border-axc-border bg-gray-100 rounded px-1.5 py-2 text-center font-bold text-gray-600"
                        />
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}