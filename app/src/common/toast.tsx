import { toast, ToastOptions } from "react-toastify";

export type ToastVariant = "success" | "error" | "warning" | "info" | "default";

export interface ShowToastProps {
  variant?: ToastVariant;
  message: string;
  options?: ToastOptions;
}

export function showToast(
  propsOrMessage: ShowToastProps | string,
  variantOrOptions?: ToastVariant | ToastOptions,
  options?: ToastOptions
) {
  if (typeof propsOrMessage === "string") {
    let v: ToastVariant = "default";
    let opts: ToastOptions | undefined = options;

    if (typeof variantOrOptions === "string") {
      v = variantOrOptions;
    } else if (variantOrOptions && typeof variantOrOptions === "object") {
      opts = variantOrOptions;
    }

    if (v === "default") {
      toast(propsOrMessage, opts);
    } else {
      toast[v](propsOrMessage, opts);
    }
  } else {
    const { variant = "default", message, options: objOpts } = propsOrMessage;
    const finalOpts = objOpts || (typeof variantOrOptions === "object" ? (variantOrOptions as ToastOptions) : undefined);
    if (variant === "default") {
      toast(message, finalOpts);
    } else {
      toast[variant](message, finalOpts);
    }
  }
}