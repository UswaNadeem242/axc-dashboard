"use client";
import { useState } from "react";
import {
  DeliveryFormState,
  TrackingEvent,
  defaultDelivery,
  emptyTrackingEvent,
} from "./formstate";

export function useAwbDelivery() {
  const [delivery, setDelivery] = useState<DeliveryFormState>(defaultDelivery());
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [updating, setUpdating] = useState(false);

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
  const removeEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };
  const handleUpdateForwarding = async () => {
    setUpdating(true);
    try {
    } finally {
      setUpdating(false);
    }
  };
  const handleSaveDelivery = async () => {
    setSaving(true);
    try {
      setSaved(true);
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