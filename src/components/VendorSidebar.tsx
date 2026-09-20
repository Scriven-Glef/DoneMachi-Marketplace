import Link from 'next/link';
import { LayoutDashboard, Wrench, MapPin, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function VendorSidebar() {
  return (
    <div className="w-64 bg-slate-900 text-slate-50 min-h-screen flex flex-col border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">DoneMachi</h1>
        <p className="text-sm text-slate-400 mt-1">Vendor Portal</p>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Link href="/vendor" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link href="/vendor/services" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
          <Wrench size={18} /> My Services
        </Link>
        <Link href="/vendor/areas" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
          <MapPin size={18} /> Service Areas
        </Link>
      </nav>
      <div className="p-4 mt-auto">
        <form action={async () => {
          'use server'
          const { logout } = await import('@/app/(vendor)/vendor/authActions')
          await logout()
        }}>
          <Button type="submit" variant="ghost" className="w-full justify-start gap-3 px-4 py-6 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-base font-normal">
            <LogOut size={18} />
            Log Out
          </Button>
        </form>
      </div>
    </div>
  );
}
