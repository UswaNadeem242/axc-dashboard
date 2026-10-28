"use client";
import React from "react";
import { AwbFormState } from "./formstate";
import { FieldLabel, PanelHeader, inputClass } from "./form";
interface Props {
  form: AwbFormState;
  setForm: React.Dispatch<React.SetStateAction<AwbFormState>>;
}
export default function WeightsAndDimensions({ form, setForm }: Props) {
  const recalculateWeights = (patch: Partial<AwbFormState>) => {
    const updated = { ...form, ...patch };

    const l = parseFloat(updated.parcelL) || 0;
    const b = parseFloat(updated.parcelB) || 0;
    const h = parseFloat(updated.parcelH) || 0;

    let volWt = parseFloat(updated.volumetricWeight) || 0;

    if (l > 0 && b > 0 && h > 0) {
      // Standard IATA courier formula: (L * B * H) / 5000 in cm/kg
      volWt = Number(((l * b * h) / 5000).toFixed(2));
      updated.volumetricWeight = String(volWt);
      updated.parcelVolumetricWt = String(volWt);
    }

    const actWt = parseFloat(updated.actualWeight) || parseFloat(updated.parcelActualWt) || 0;
    const addWt = parseFloat(updated.addWeight) || 0;
    const chargeable = Math.max(actWt, volWt) + addWt;

    if (chargeable > 0) {
      updated.chargeableWeight = String(Number(chargeable.toFixed(2)));
      updated.parcelChargeableWt = String(Number(chargeable.toFixed(2)));
    }

    setForm(updated);
  };

  return (
    <div className="xl:sticky w-full">
      <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden">
        <PanelHeader title="Weights and Dimensions" />
        <div className="p-4 grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <FieldLabel>PCS</FieldLabel>
            <input
              type="number"
              value={form.pcs}
              onChange={(e) => setForm({ ...form, pcs: Number(e.target.value) })}
              className={`${inputClass} bg-gray-50`}
              placeholder="PCS"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Actual Weight (kg)</FieldLabel>
            <input
              type="text"
              value={form.actualWeight}
              onChange={(e) => recalculateWeights({ actualWeight: e.target.value, parcelActualWt: e.target.value })}
              className={inputClass}
              placeholder="Actual Weight"
            />
          </div>
          <div className="flex flex-col gap-1">
            <FieldLabel>Volumetric Weight</FieldLabel>
            <input
              type="text"
              value={form.volumetricWeight}
              onChange={(e) => recalculateWeights({ volumetricWeight: e.target.value })}
              className={inputClass}
              placeholder="Auto-calculated"
            />
          </div>
          <div className="flex flex-col gap-1">
            <FieldLabel>Consigner Weight</FieldLabel>
            <input
              type="text"
              value={form.consignerWeight}
              onChange={(e) => setForm({ ...form, consignerWeight: e.target.value })}
              className={inputClass}
              placeholder="Consigner Weight"
            />
          </div>
          <div className="flex flex-col gap-1">
            <FieldLabel>Add. Weight</FieldLabel>
            <input
              type="text"
              value={form.addWeight}
              onChange={(e) => recalculateWeights({ addWeight: e.target.value })}
              className={inputClass}
              placeholder="Add. Weight"
            />
          </div>
          <div className="flex flex-col gap-1">
            <FieldLabel>Chargeable Weight</FieldLabel>
            <input
              type="text"
              value={form.chargeableWeight}
              readOnly
              className={`${inputClass} bg-gray-50 font-semibold text-axc-navy`}
              placeholder="Auto-calculated"
            />
          </div>
          <div className="col-span-2 border-t border-axc-border pt-3 mt-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <FieldLabel>Parcel No</FieldLabel>
                <input
                  type="text"
                  value={form.parcelType}
                  onChange={(e) => setForm({ ...form, parcelType: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel>Box No.</FieldLabel>
                <input
                  type="text"
                  value={form.boxNo}
                  onChange={(e) => setForm({ ...form, boxNo: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel>Actual Wt.</FieldLabel>
                <input
                  type="text"
                  value={form.parcelActualWt}
                  onChange={(e) => recalculateWeights({ parcelActualWt: e.target.value, actualWeight: e.target.value })}
                  className={inputClass}
                  placeholder="Actual Wt."
                />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel>L (cm)</FieldLabel>
                <input
                  type="text"
                  value={form.parcelL}
                  onChange={(e) => recalculateWeights({ parcelL: e.target.value })}
                  className={inputClass}
                  placeholder="L (cm)"
                />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel>B (cm)</FieldLabel>
                <input
                  type="text"
                  value={form.parcelB}
                  onChange={(e) => recalculateWeights({ parcelB: e.target.value })}
                  className={inputClass}
                  placeholder="B (cm)"
                />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel>H (cm)</FieldLabel>
                <input
                  type="text"
                  value={form.parcelH}
                  onChange={(e) => recalculateWeights({ parcelH: e.target.value })}
                  className={inputClass}
                  placeholder="H (cm)"
                />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel>Volumetric Weight</FieldLabel>
                <input
                  type="text"
                  value={form.volumetricWeight}
                  readOnly
                  className={`${inputClass} bg-gray-50`}
                  placeholder="Auto-calculated"
                />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel>Chargeable Weight</FieldLabel>
                <input
                  type="text"
                  value={form.chargeableWeight}
                  readOnly
                  className={`${inputClass} bg-gray-50 font-semibold text-axc-navy`}
                  placeholder="Auto-calculated"
                />
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <FieldLabel>CTN</FieldLabel>
                <input
                  type="text"
                  value={form.parcelCtn}
                  onChange={(e) => setForm({ ...form, parcelCtn: e.target.value })}
                  className={inputClass}
                  placeholder="CTN"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}