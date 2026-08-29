import Link from "next/link";
import clsx from "clsx";
import { LucideIcon } from "lucide-react";

interface ButtonProps {
    label: string;
    href?: string;
    onClick?: () => void;

    variant?: "primary" | "secondary" | "outline" | "danger";

    size?: "sm" | "md" | "lg";

    icon?: LucideIcon;
    iconPosition?: "left" | "right";

    className?: string;

    disabled?: boolean;
}

const variantClasses = {
    primary:
        "bg-axc-navy text-white",

    secondary:
        "bg-axc-red text-white hover:bg-axc-red/80",

    outline:
        "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",

    danger:
        "bg-red-600 text-white hover:bg-red-700",
};

const sizeClasses = {
    sm: "px-4 py-3 text-xs",
    md: "px-4 py-3 text-regular-small",
    lg: "px-5 py-3 text-base",
};

export default function Button({
    label,
    href,
    onClick,
    variant = "primary",
    size = "md",
    icon: Icon,
    iconPosition = "left",
    className = "",
    disabled = false,
}: ButtonProps) {
    const classes = clsx(
        "inline-flex items-center justify-center gap-2  rounded-lg font-semibold transition duration-200",
        variantClasses[variant],
        sizeClasses[size],
        disabled && "cursor-not-allowed opacity-50",
        className
    );

    const content = (
        <>
            {Icon && iconPosition === "left" && <Icon size={16} />}
            <span>{label}</span>
            {Icon && iconPosition === "right" && <Icon size={16} />}
        </>
    );

    if (href) {
        return (
            <Link href={href} className={classes}>
                {content}
            </Link>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={classes}
        >
            {content}
        </button>
    );
}