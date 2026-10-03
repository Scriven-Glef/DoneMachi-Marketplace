import { Suspense } from 'react'
import { CheckoutForm } from './CheckoutForm'
import { getCustomerAddresses } from '../actions'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
  const addresses = await getCustomerAddresses()

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
      <CheckoutForm initialAddresses={addresses} />
    </Suspense>
  )
}
