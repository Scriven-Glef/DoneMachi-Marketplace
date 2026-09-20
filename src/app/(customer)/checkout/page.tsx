import { Suspense } from 'react'
import { CheckoutForm } from './CheckoutForm'
import { cookies } from 'next/headers'

export default async function CheckoutPage() {
  const cookieStore = await cookies()
  const pincode = cookieStore.get('customer_pincode')?.value || ''

  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/2 mx-auto" />
          <div className="h-4 bg-slate-200 rounded w-1/3 mx-auto" />
          <div className="h-64 bg-slate-200 rounded mt-8" />
        </div>
      </div>
    }>
      <CheckoutForm initialPincode={pincode} />
    </Suspense>
  )
}
