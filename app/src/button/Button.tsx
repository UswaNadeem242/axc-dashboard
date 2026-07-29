import React from "react";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}
export default function Button({
  variant = "primary",
  size,
  children,
  className = "",
  ...props
}: ButtonProps): React.JSX.Element {
  const variantStyles = {
    primary:
      "bg-dsh-primary text-white border border-dsh-primary hover:bg-dsh-primary-light",
    secondary:
      "bg-dsh-card-hover text-dsh-text border border-dsh-border hover:bg-dsh-border-light",
    outline:
      "bg-white text-dsh-text-secondary border border-dsh-border hover:bg-dsh-card-hover",
  };
  const sizeStyles = {
    sm: "h-8 px-3 text-[12px]",
    md: "h-10 px-5 text-[13px]",
    lg: "h-12 px-6 text-[14px]",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 cursor-pointer ${variantStyles[variant]} ${size ? sizeStyles[size] : ""} ${className}`}
    >
      {children}
    </button>
  );
}