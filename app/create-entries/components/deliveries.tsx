"use client";
import { useEffect, useState } from "react";
import {
  DeliveryFormState,
  TrackingEvent,
  defaultDelivery,
  emptyTrackingEvent,
} from "./formstate";
import { api } from "@/app/src/lib/api";
import { showToast } from "@/app/src/common/toast";

export function useAwbDelivery(awbTrackingNo?: string) {
  const [delivery, setDelivery] = useState<DeliveryFormState>(defaultDelivery());
  const [events, setEvents] = useState<TrackingEvent[]>([
    { ...emptyTrackingEvent(), eventType: "SYSTEM" }
  ]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!awbTrackingNo) return;
    let mounted = true;
    (async () => {
      try {
        const res = await api.getAwbDelivery(awbTrackingNo);
        if (res && mounted) {
          if (res.delivery) {
            setDelivery((prev) => ({ ...prev, ...res.delivery }));
          }
          if (Array.isArray(res.events) && res.events.length > 0) {
            setEvents(res.events);
          }
          return;
        }
      } catch {
        // fallback to localStorage
      }
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(`awb_delivery_${awbTrackingNo}`);
        if (stored && mounted) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.delivery) setDelivery((prev) => ({ ...prev, ...parsed.delivery }));
            if (Array.isArray(parsed.events)) setEvents(parsed.events);
          } catch {}
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [awbTrackingNo]);

  const updateField = <K extends keyof DeliveryFormState>(
    field: K,
    value: DeliveryFormState[K]
  ) => {
    setDelivery((prev) => ({ ...prev, [field]: value }));
  };
  const toggleEdit = (field: "editExpectedDate" | "editConnectionDate") => {
    setDelivery((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const addEvent = () => {
    setEvents((prev) => [...prev, emptyTrackingEvent()]);
  };
  const updateEvent = (id: string, patch: Partial<TrackingEvent>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
    );
  };
  const removeEvent = async (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    if (id && !isNaN(Number(id))) {
      await api.deleteTrackingEvent(id).catch(() => {});
    }
  };
  const handleUpdateForwarding = async () => {
    setUpdating(true);
    try {
      if (awbTrackingNo) {
        await api.updateAwbDelivery(awbTrackingNo, {
          forwardingNumber: delivery.forwardingNumber,
          forwardingNumber2: delivery.forwardingNumber2,
        }).catch(() => {});
        await api.updateAwb(awbTrackingNo, {
          forwardingNumber: delivery.forwardingNumber,
          forwardingNumber2: delivery.forwardingNumber2,
        }).catch(() => {});
      }
      showToast({ variant: "success", message: "Forwarding number updated!" });
    } finally {
      setUpdating(false);
    }
  };
  const handleSaveDelivery = async () => {
    setSaving(true);
    try {
      if (awbTrackingNo) {
        await api.updateAwbDelivery(awbTrackingNo, delivery).catch(() => {});
        for (const ev of events) {
          if (ev.eventDescription?.trim() && isNaN(Number(ev.id))) {
            await api.addTrackingEvent(awbTrackingNo, ev).catch(() => {});
          }
        }
        if (typeof window !== "undefined") {
          localStorage.setItem(`awb_delivery_${awbTrackingNo}`, JSON.stringify({ delivery, events }));
        }
      }
      setSaved(true);
      showToast({ variant: "success", message: "Delivery & tracking events saved!" });
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return {
    delivery,
    setDelivery,
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
  };
}