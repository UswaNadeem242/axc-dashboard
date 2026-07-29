import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search..",
  className = "",
}: SearchInputProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-gray-300 bg-transparent py-1.5 pl-10 pr-4 text-sm transition focus:border-gray-400 focus:outline-none focus:ring-0"
      />
    </div>
  );
}