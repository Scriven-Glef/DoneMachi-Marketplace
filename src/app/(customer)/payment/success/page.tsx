import { CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function PaymentSuccessPage({ searchParams }: { searchParams: Promise<{ bookingId?: string }> }) {
  const resolvedParams = await searchParams;
  if (!resolvedParams.bookingId) {
    redirect('/')
  }

  const supabase = await createClient()
  const { data: booking } = await supabase
    .from('bookings')
    .select('estimated_logistics_time_mins, order_number')
    .eq('id', resolvedParams.bookingId)
    .single()

  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <div className="mx-auto h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6 animate-pulse">
        <CheckCircle className="h-10 w-10 text-emerald-500" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900">Payment Successful!</h2>
      <p className="text-slate-500 mt-4">Your payment of ₹150 was received and your booking is confirmed. The technician has been dispatched.</p>
      
      {booking?.order_number && (
        <div className="mt-4 inline-block bg-slate-100 border border-slate-200 rounded-full px-4 py-1.5 font-bold text-slate-700 tracking-wide">
          Order: {booking.order_number}
        </div>
      )}

      {booking?.estimated_logistics_time_mins && (
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 inline-flex items-center gap-3 shadow-sm">
          <Clock className="text-amber-500 h-6 w-6" />
          <div className="text-left">
            <p className="text-lg font-bold text-amber-900">Expected Arrival: ~{booking.estimated_logistics_time_mins} mins</p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link href="/bookings">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            View My Bookings
          </Button>
        </Link>
      </div>
    </div>
  )
}
