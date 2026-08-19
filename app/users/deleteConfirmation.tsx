"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function DeleteConfirmationDialog({
  isOpen,
  itemName = "user",
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmationDialogProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      requestAnimationFrame(() => setVisible(false));
    }
  }, [isOpen]);

  if (!isOpen && !visible) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] bg-black/40 transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={onCancel}
      />

      <div
        className={`fixed inset-0 z-[110] flex items-center justify-center p-4 transition-all duration-200 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="w-full max-w-[440px] rounded-lg border border-axc-border bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-axc-border px-5 py-4">
            <h2 className="text-[16px] font-semibold text-axc-dark-gray">Confirmation</h2>

            <button type="button" onClick={onCancel} className="flex h-7 w-7 items-center justify-center rounded hover:bg-axc-light-bg">
              <X className="h-4 w-4 text-axc-gray" />
            </button>
          </div>

          <div className="px-5 py-7 text-center">
            <p className="text-[14px] text-axc-dark-gray">
              Are you sure you want to delete {itemName ? <span className="font-semibold">{itemName}</span> : "this user"}?
            </p>

            <p className="mt-2 text-[11px] text-axc-gray">This action cannot be undone.</p>
          </div>

          <div className="flex justify-center gap-3 border-t border-axc-border px-5 py-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="h-[38px] min-w-[90px] rounded-md border border-axc-border bg-white px-5 text-[12px] font-medium text-axc-dark-gray hover:bg-axc-light-bg disabled:cursor-not-allowed disabled:opacity-50"
            >
              No
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="h-[38px] min-w-[90px] rounded-md bg-axc-red px-5 text-[12px] font-medium text-white hover:bg-axc-red-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Deleting..." : "Yes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}