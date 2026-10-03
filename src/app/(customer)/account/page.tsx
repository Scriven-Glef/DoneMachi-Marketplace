import { getCustomerAddresses } from '../actions'
import { AccountManager } from './AccountManager'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const addresses = await getCustomerAddresses()

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">My Account</h1>
          <p className="text-slate-500 mt-2">Manage your saved addresses and personal details.</p>
        </div>

        <AccountManager initialAddresses={addresses} />
      </div>
    </div>
  )
}
