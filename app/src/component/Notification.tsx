"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Check } from "lucide-react";

interface NotificationItem {
  id: number;
  title: string;
  message?: string;
  time: string;
  date: string;
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "New order received",
    message: "Order #1234 has been placed and is awaiting confirmation.",
    time: "10:30 AM",
    date: "TODAY",
    read: false,
  },
  {
    id: 2,
    title: "Payment received",
    message: "Payment of $450.00 has been successfully processed.",
    time: "9:12 AM",
    date: "TODAY",
    read: false,
  },
  {
    id: 3,
    title: "Shipment out for delivery",
    message: "AWB #987654 is out for delivery and should arrive today.",
    time: "8:05 AM",
    date: "TODAY",
    read: true,
  },
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleMarkAllRead = () => {
    setNotifications((previous) => previous.map((n) => ({ ...n, read: true })));
  };

  const groupedNotifications = notifications.reduce<
    Record<string, NotificationItem[]>
  >((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-axc-gray hover:bg-axc-light-bg transition-colors cursor-pointer"
      >
        <Bell size={20} className="text-axc-dark-gray" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-axc-red text-regular-small text-axc-white leading-none text-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-80 rounded-2xl border border-axc-border bg-axc-white shadow-xl overflow-visible animate-in fade-in zoom-in-95 duration-150">
          <div className="absolute -top-2 right-3 h-4 w-4 rotate-45 border-l border-t border-axc-border bg-axc-white" />

          <div className="relative z-10 overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-axc-border px-4 py-3">
              <h3 className="text-regular-bold text-axc-dark-gray">
                Notifications
              </h3>
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
                className={`flex items-center gap-1 text-regular-medium transition-colors ${
                  unreadCount === 0
                    ? "text-axc-gray cursor-not-allowed"
                    : "text-axc-blue hover:text-axc-navy cursor-pointer"
                }`}
              >
                <Check size={14} />
                Mark all read
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-1 py-10">
                  <span className="text-regular-small text-axc-gray">
                    No new notifications
                  </span>
                </div>
              ) : (
                Object.entries(groupedNotifications).map(([group, items]) => (
                  <div key={group}>
                    <p className="px-4 pt-3 pb-1 text-regular-small uppercase tracking-wide text-axc-gray">
                      {group}
                    </p>
                    <div className="divide-y divide-axc-border">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            setNotifications((previous) =>
                              previous.map((n) =>
                                n.id === item.id ? { ...n, read: true } : n,
                              ),
                            )
                          }
                          className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-axc-light-bg ${
                            !item.read ? "bg-axc-blue/5" : ""
                          }`}
                        >
                          {!item.read && (
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-axc-blue" />
                          )}
                          <div
                            className={`flex-1 min-w-0 ${item.read ? "pl-5" : ""}`}
                          >
                            <p className="text-regular-semibold text-axc-dark-gray truncate">
                              {item.title}
                            </p>
                            {item.message && (
                              <p className="text-regular-small text-axc-gray line-clamp-2">
                                {item.message}
                              </p>
                            )}
                            <p className="mt-1 text-regular-small text-axc-gray">
                              {item.time}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
