import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  let colorClass = "bg-slate-500 hover:bg-slate-600";
  
  switch (status?.toLowerCase()) {
    case 'approved':
    case 'completed':
      colorClass = "bg-emerald-500 hover:bg-emerald-600 text-white border-transparent";
      break;
    case 'pending':
      colorClass = "bg-amber-500 hover:bg-amber-600 text-white border-transparent";
      break;
    case 'rejected':
    case 'cancelled':
    case 'refunded':
      colorClass = "bg-rose-500 hover:bg-rose-600 text-white border-transparent";
      break;
    case 'vendor_assigned':
    case 'in_transit':
      colorClass = "bg-indigo-500 hover:bg-indigo-600 text-white border-transparent";
      break;
  }

  return (
    <Badge className={`${colorClass} uppercase text-[10px] font-bold px-2 py-0.5 tracking-wider`}>
      {status?.replace('_', ' ') || 'UNKNOWN'}
    </Badge>
  );
}
