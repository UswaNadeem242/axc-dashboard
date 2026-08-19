"use client";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`
        relative
        inline-flex
        h-[22px]
        w-[42px]
        shrink-0
        cursor-pointer
        items-center
        rounded-full
        border
        transition-all
        duration-200
        ease-in-out
        focus:outline-none
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${
          checked
            ? "bg-axc-green border-axc-green"
            : "bg-gray-300 border-gray-400"
        }
      `}
    >
      <span
        className={`
          pointer-events-none
          absolute
          top-[2px]
          h-[16px]
          w-[16px]
          rounded-full
          bg-white
          shadow-sm
          transition-all
          duration-200
          ${
            checked
              ? "left-[23px]"
              : "left-[2px]"
          }
        `}
      />
    </button>
  );
}