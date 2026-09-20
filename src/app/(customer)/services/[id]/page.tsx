import { getServiceById, getVendorsForService } from '../../actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IndianRupee, Star, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function ServiceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ pincode?: string }>
}) {
  const { id } = await params
  const { pincode } = await searchParams

  const service = await getServiceById(id)
  const vendors = pincode ? await getVendorsForService(id, pincode) : []

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-700">Service not found</h2>
        <Link href="/" className="text-indigo-600 hover:underline mt-4 inline-block">Go back home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-8">
        <ArrowLeft size={16} /> Back to services
      </Link>

      <div className="mb-10">
        <Badge className="bg-indigo-100 text-indigo-700 border-transparent mb-3">{service.category}</Badge>
        <h1 className="text-4xl font-bold text-slate-900">{service.name}</h1>
        <p className="text-slate-500 mt-3 text-lg">{service.description || 'Professional service by verified local vendors.'}</p>
        {pincode && (
          <p className="text-sm text-slate-400 mt-2">Showing vendors available in pincode <strong className="text-slate-600">{pincode}</strong></p>
        )}
      </div>

      <h2 className="text-xl font-semibold text-slate-800 mb-6">Available Vendors</h2>

      {vendors.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <p className="text-slate-500 text-lg">No approved vendors available for this service in your area yet.</p>
          <Link href="/" className="text-indigo-600 hover:underline mt-4 inline-block text-sm">Try a different pincode</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {vendors.map((vs: any) => (
            <Card key={vs.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-xl font-bold text-indigo-600">
                    {vs.vendor_profile?.business_name?.charAt(0) || 'V'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">{vs.vendor_profile?.business_name}</h3>
                    <p className="text-sm text-slate-500">{vs.vendor_profile?.users?.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={14} className={s <= 4 ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
                      ))}
                      <span className="text-xs text-slate-400 ml-1">4.0</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-3">
                  <div className="flex items-center text-2xl font-bold text-slate-900">
                    <IndianRupee size={20} />{vs.price}
                  </div>
                  <Link href={`/checkout?vendorServiceId=${vs.id}&pincode=${pincode}`}>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
