interface StatusProps {
  status: "Completed" | "Processing" | "Pending" | "Cancel";
}

export default function Status({ status }: StatusProps) {
  const statusStyles = {
    Completed: "bg-[#10B981] text-white",
    Processing: "bg-[#06B6D4] text-white",
    Pending: "bg-[#F59E0B] text-white",
    Cancel: "bg-[#EF4444] text-white",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}