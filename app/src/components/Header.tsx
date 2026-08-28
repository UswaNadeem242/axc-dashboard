import Image from "next/image";
import { Bell, Settings, ChevronDown } from "lucide-react";
export default function Header() {
  return (
    <header className="h-18 border-b border-[#1E5AB0] bg-[#2164C0] shadow-sm">
      <div className="flex h-full items-center justify-between px-8">
        <div>
          <h1 className=" leading-none text-white">
            AWB Entries
          </h1>
          <p className="mt-1 text-regular-small text-[#DCE8FF]">Home &gt; AWB Entries</p>
        </div>
        <div className="flex items-center gap-5">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5A8FE8] transition-all duration-200 hover:bg-[#6A9AF0]">
            <Settings size={18} className="text-white" />
          </button>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#5A8FE8] transition-all duration-200 hover:bg-[#6A9AF0]">
            <Bell size={18} className="text-white" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border border-white bg-[#F59E0B]" />
          </button>
          <button className="flex items-center gap-3">
            <Image
              src="/image/men.png"
              alt="John Smith"
              width={40}
              height={40}
              priority
              className="h-10 w-10 rounded-full border-2 border-white object-cover"
            />
            <div className="text-left leading-tight">
              <p className="text-[14px] font-semibold text-white">
                John Smith
              </p>
            </div>
            <ChevronDown size={18} className="text-white" />
          </button>
        </div>
      </div>
    </header>
  );
}