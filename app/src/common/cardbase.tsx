import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export default function Card({
  children,
  title,
  icon: Icon,
  action,
  className = "",
  titleClassName = "",
}: CardProps) {
  return (
    <div
      className={`
         border 
        border-axc-border 
        bg-white 
        shadow-sm
        ${className}
      `}
    >
      {(title || Icon || action) && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && (
              <Icon className="h-5 w-5 text-axc-navy animate-spin-[spin_4s_linear_infinite]" />
            )}

            {title && (
              <h3
                className={` text-axc-navy
                  ${titleClassName}
                `}
              >
                {title}
              </h3>
            )}
          </div>

          {action && action}
        </div>
      )}

      {children}
    </div>
  );
}