import { CheckCircle, Heart } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function FinalPaymentSuccessPage({ searchParams }: { searchParams: Promise<{ bookingId?: string }> }) {
  const resolvedParams = await searchParams;
  if (!resolvedParams.bookingId) {
    redirect('/')
  }

  const supabase = await createClient()
  const { data: booking } = await supabase
    .from('bookings')
    .select('order_number')
    .eq('id', resolvedParams.bookingId)
    .single()

  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <div className="mx-auto h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6 animate-pulse">
        <CheckCircle className="h-10 w-10 text-emerald-500" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900">Payment Successful!</h2>
      <p className="text-slate-500 mt-4">Your final repair payment was successfully processed. The technician has been notified to proceed with the repair.</p>
      
      {booking?.order_number && (
        <div className="mt-4 inline-block bg-slate-100 border border-slate-200 rounded-full px-4 py-1.5 font-bold text-slate-700 tracking-wide">
          Order: {booking.order_number}
        </div>
      )}

      <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm">
        <Heart className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
        <h3 className="font-bold text-indigo-900 text-lg mb-1">Thank you for choosing DoneMachi!</h3>
        <p className="text-sm text-indigo-700">We appreciate your trust in our technicians. If you need anything else, we're always here for you.</p>
      </div>

      <div className="mt-8">
        <Link href="/bookings">
          <Button className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
            Back to My Bookings
          </Button>
        </Link>
      </div>
    </div>
  )
}
