import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { respondToQuote } from '@/app/(customer)/actions'

export default async function FinalPaymentPage({ searchParams }: { searchParams: Promise<{ bookingId?: string }> }) {
  const resolvedParams = await searchParams;
  if (!resolvedParams.bookingId) {
    redirect('/')
  }

  const supabase = await createClient()
  
  const { data: booking } = await supabase
    .from('bookings')
    .select('final_quoted_price, order_number')
    .eq('id', resolvedParams.bookingId)
    .single()

  if (!booking) {
    redirect('/')
  }

  const finalPrice = booking.final_quoted_price || 0
  const remainingToPay = finalPrice

  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <div className="mx-auto h-20 w-20 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
        <CreditCard className="h-10 w-10 text-indigo-500" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Final Payment</h2>
      <p className="text-slate-500 mb-8">
        Pay the repair cost to approve the quote and instruct the technician to proceed.
      </p>

      {booking.order_number && (
        <div className="mb-4 text-sm font-semibold text-slate-500 uppercase tracking-widest">
          Order: {booking.order_number}
        </div>
      )}

      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 mb-8 text-left space-y-4">
        <div className="flex justify-between items-center text-sm pb-4 border-b border-slate-200">
          <span className="text-slate-500">Total Repair Cost</span>
          <span className="font-medium text-slate-700">₹{finalPrice}</span>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <span className="font-bold text-slate-900 text-lg">Balance Due</span>
          <span className="font-extrabold text-indigo-700 text-3xl">₹{remainingToPay}</span>
        </div>
      </div>
      
      {/* Dummy Payment Form */}
      <form action={async (formData: FormData) => {
        'use server'
        const bId = formData.get('bookingId') as string
        // Simulate payment success and approve the quote
        await respondToQuote(bId, 'approved')
        redirect(`/payment/final/success?bookingId=${bId}`)
      }}>
        <input type="hidden" name="bookingId" value={resolvedParams.bookingId} />
        <Button type="submit" size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold h-14 text-lg shadow-md shadow-indigo-200">
          Pay ₹{remainingToPay} Now (Dummy)
        </Button>
      </form>
    </div>
  )
}
