"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

import { useBaggingForm } from "../new-manifest/bagging/baggingstate";
import AwbDetailsPanel from "../new-manifest/bagging/awbdetails";
import {
  BaggingFormPanel,
  BaggingSummarySection,
  PartialManifestedAwbPanel,
} from "../new-manifest/bagging/bagging";
import Button from "@/app/src/common/button";

type ToastState = { message: string; type: "success" | "info" };

function EditBaggingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const manifestId = searchParams.get("id") || searchParams.get("manifestNo") || "";

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const { awbDetails, ...baggingProps } = useBaggingForm();
  const { form, updateField, validateRunNumber } = baggingProps;

  useEffect(() => {
    if (manifestId && !form.runNumber) {
      updateField("runNumber", manifestId);
    }
  }, [manifestId]);

  const showToast = (message: string, type: "success" | "info" = "info") => {
    setToast({ message, type });
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 2600);
  };

  const handleSaveChanges = () => {
    if (!validateRunNumber()) {
      showToast("Please fill all the required fields");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      showToast("Bagging updated successfully!", "success");
      setTimeout(() => {
        router.push("/manifest");
      }, 800);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 rounded-lg px-4 py-3 text-xs font-bold shadow-lg text-white animate-in fade-in slide-in-from-top-2 duration-200 ${
            toast.type === "success" ? "bg-axc-dark-green" : "bg-axc-navy"
          }`}
        >
          {toast.message}
        </div>
      )}
      <div className="flex items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-lg border border-axc-border shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/manifest")}
            className="p-1.5 rounded-md hover:bg-gray-100 text-axc-dark-gray transition cursor-pointer"
            title="Back to All Manifests"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-regular-bold text-axc-dark-gray">
              Edit Bagging {manifestId ? `#${manifestId}` : ""}
            </h1>
            <p className="text-[12px] text-axc-gray">
              Update bag entries, weight bagging, and AWB summary
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            label="Cancel"
            onClick={() => router.push("/manifest")}
            variant="outline"
          />
          <Button
            label={loading ? "Saving..." : "Save Changes"}
            onClick={handleSaveChanges}
            variant="primary"
            icon={Save}
            disabled={loading}
          />
        </div>
      </div>

      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-4 p-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              <div className="lg:col-span-8 xl:col-span-9">
                <BaggingFormPanel {...baggingProps} />
              </div>
              <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4">
                <AwbDetailsPanel awbDetails={awbDetails} />
              </div>
            </div>
            <BaggingSummarySection {...baggingProps} />
            <PartialManifestedAwbPanel partialAwbRows={baggingProps.partialAwbRows} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditBaggingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full w-full bg-white p-6 rounded-lg">
          <p className="text-sm text-axc-gray animate-pulse">Loading Bagging details...</p>
        </div>
      }
    >
      <EditBaggingContent />
    </Suspense>
  );
}