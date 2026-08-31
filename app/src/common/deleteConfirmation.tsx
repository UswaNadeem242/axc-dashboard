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
        className={`fixed inset-0 z-[100] transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onCancel}
      />

      <div
        className={`fixed inset-0 z-[110] flex items-center justify-center p-4 transition-all duration-200 ease-out ${
          visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-1"
        }`}
      >
        <div
          className="w-full max-w-[440px] overflow-hidden rounded-2xl bg-white "
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-axc-border px-6 py-5">
            <h2 className="text-[18px] font-bold text-axc-dark-gray">Confirmation</h2>

            <button
              type="button"
              onClick={onCancel}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-axc-gray transition-colors hover:bg-axc-light-bg hover:text-axc-dark-gray"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col items-center px-6 py-9 text-center">
            <h2>Are you sure you want to delete?</h2>
          </div>

          <div className="flex justify-center gap-4 px-6 pb-7">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="h-[42px] min-w-[110px] cursor-pointer rounded-xl bg-axc-dark-gray px-5 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              No
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex h-[42px] min-w-[110px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-axc-yellow px-5 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading && (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {isLoading ? "Deleting..." : "Yes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}