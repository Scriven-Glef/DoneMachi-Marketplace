import Link from 'next/link';
import { Users, Briefcase, Calendar } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="w-64 bg-slate-950 text-slate-50 min-h-screen flex flex-col border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">DoneMachi</h1>
        <p className="text-sm text-slate-400 mt-1">Admin Dashboard</p>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Link href="/admin/vendors" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
          <Users size={18} /> Vendor Queue
        </Link>
        <Link href="/admin/services" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
          <Briefcase size={18} /> Services Catalog
        </Link>
        <Link href="/admin/bookings" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
          <Calendar size={18} /> Command Center
        </Link>
      </nav>
    </div>
  );
}
