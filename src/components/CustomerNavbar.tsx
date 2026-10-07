import Link from 'next/link';
import { Home, CalendarCheck, UserCircle, LogOut } from 'lucide-react';
import { getSessionUserId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { logout } from '@/app/(customer)/authActions';

export async function CustomerNavbar() {
  const userId = await getSessionUserId();
  let displayName = 'My Account';

  if (userId) {
    const supabase = await createClient();
    const { data } = await supabase.from('users').select('name').eq('id', userId).single();
    if (data?.name) {
      displayName = data.name.split(' ')[0];
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-amber-400 flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-amber-500 bg-clip-text text-transparent">
            DoneMachi
          </span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            <Home size={16} /> Home
          </Link>
          
          {userId ? (
            <>
              <Link href="/bookings" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                <CalendarCheck size={16} /> My Bookings
              </Link>
              <div className="flex items-center gap-3">
                <Link href="/account" className="flex items-center gap-1.5 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors">
                  <UserCircle size={18} /> {displayName}
                </Link>
                <form action={logout}>
                  <button type="submit" className="text-slate-500 hover:text-red-600 transition-colors" title="Log Out">
                    <LogOut size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
                Log In
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">Sign Up</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
