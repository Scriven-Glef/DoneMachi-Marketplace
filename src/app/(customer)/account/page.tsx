import { getCustomerAddresses } from '../actions'
import { AccountManager } from './AccountManager'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ fromCheckout?: string, services?: string }> }) {
  const addresses = await getCustomerAddresses()
  const resolvedParams = await searchParams;
  const isFromCheckout = resolvedParams.fromCheckout === 'true'

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">My Account</h1>
            <p className="text-slate-500 mt-2">Manage your saved addresses and personal details.</p>
          </div>
          {isFromCheckout && addresses.length > 0 && (
            <Link href={`/checkout${resolvedParams.services ? `?services=${resolvedParams.services}` : ''}`}>
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 font-bold text-md px-8 py-6 animate-bounce shadow-lg ring-4 ring-indigo-600/20">
                Proceed to Book a Service →
              </Button>
            </Link>
          )}
        </div>

        <AccountManager initialAddresses={addresses} />
      </div>
    </div>
  )
}
