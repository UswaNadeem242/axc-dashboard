import { toast, ToastOptions } from "react-toastify";

type ToastVariant =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "default";

interface ShowToastProps {
  variant?: ToastVariant;
  message: string;
  options?: ToastOptions;
}

export const showToast = ({
  variant = "default",
  message,
  options,
}: ShowToastProps) => {
  if (variant === "default") {
    toast(message, options);
  } else {
    toast[variant](message, options);
  }
};