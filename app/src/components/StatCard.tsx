import { MoveUpRight, MoveDownRight, LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export default function StatCard({title,value,change,positive,icon: Icon,iconBg,iconColor,
}: StatCardProps) {
  return (
    <div className="flex h-full min-h-[140px] flex-col justify-between rounded-xl border border-[#E8EDF5] bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.05)] transition-all duration-300 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-1 flex-col">
          <p className="text-xs font-medium text-[#6B7280] sm:text-sm">
            {title}
          </p>

          <h2 className="mt-2 text-xl font-bold leading-none text-[#111827] sm:text-2xl">
            {value}
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-1">
            {positive ? (
              <MoveUpRight size={14} strokeWidth={2.5} className="text-[#22C55E]" />
            ) : (
              <MoveDownRight size={14} strokeWidth={2.5} className="text-[#EF4444]" />
            )}

            <span className={`text-xs font-semibold ${positive ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
              {change}
            </span>

            <span className="text-xs text-[#6B7280]">
              vs last month
            </span>
          </div>
        </div>

        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${iconBg}`}>
          <Icon size={22} className={iconColor} />
        </div>
      </div>
    </div>
  );
}