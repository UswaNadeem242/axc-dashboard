"use client";
import React from "react";
import { useBaggingForm } from "./baggingstate";
import AwbDetailsPanel from "./awbdetails";
import { BaggingFormPanel, BaggingSummarySection, PartialManifestedAwbPanel } from "./bagging";

export default function BaggingPage() {
  const { awbDetails, ...baggingProps } = useBaggingForm();

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-4 p-1">
            {/* Top Grid: Bagging Form (Left 9 cols) & AWB Details + Partial Manifested AWB (Right 3 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              <div className="lg:col-span-8 xl:col-span-9">
                <BaggingFormPanel {...baggingProps} />
              </div>
              <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4">
                <AwbDetailsPanel awbDetails={awbDetails} />
                <PartialManifestedAwbPanel partialAwbRows={baggingProps.partialAwbRows} />
              </div>
            </div>

            {/* Bottom Section: Full Width Summary Tables */}
            <BaggingSummarySection {...baggingProps} />
          </div>
        </div>
      </div>
    </div>
  );
}