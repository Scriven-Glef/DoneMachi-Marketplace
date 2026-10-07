import { Suspense } from 'react'
import { CheckoutForm } from './CheckoutForm'
import { getCustomerAddresses } from '../actions'

export const dynamic = 'force-dynamic'

import { getSessionUserId } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ services?: string }> }) {
  const userId = await getSessionUserId();
  const resolvedParams = await searchParams;
  const servicesQuery = resolvedParams.services ? `?services=${resolvedParams.services}` : '';
  
  if (!userId) redirect(`/login?redirectTo=${encodeURIComponent('/checkout' + servicesQuery)}`);

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
