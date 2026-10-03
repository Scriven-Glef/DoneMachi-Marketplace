'use client'

import { useState, useTransition } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { createBooking, getAvailableVendors } from '../actions'
import { CalendarCheck, MapPin, CheckCircle, Clock, Star, User, Loader2, Plus } from 'lucide-react'
import Link from 'next/link'

export function CheckoutForm({ initialAddresses }: { initialAddresses: any[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  // Now we get a comma-separated list of catalog service IDs
  const servicesParam = searchParams.get('services') || ''
  const serviceIds = servicesParam.split(',').filter(Boolean)

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  // Step 1 State
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    initialAddresses.length > 0 ? initialAddresses[0].id : null
  )
  const [isAsap, setIsAsap] = useState(true)
  const [step, setStep] = useState<1 | 2>(1)
  
  // Step 2 State
  const [availableVendors, setAvailableVendors] = useState<any[]>([])
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null)

  const handleFindProviders = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    if (serviceIds.length === 0) {
      setError('No services selected. Please go back and select services.')
      return
    }

    if (!selectedAddressId) {
      setError('Please select or add a saved address before finding providers.')
      return
    }

    const activeAddress = initialAddresses.find(a => a.id === selectedAddressId)
    if (!activeAddress) return

    startTransition(async () => {
      // 2. Fetch specific vendors matching this exact service combination using the address pincode
      const vendors = await getAvailableVendors(activeAddress.pincode, serviceIds)

      setAvailableVendors(vendors)
      setStep(2)
    })
  }

  const handleConfirmBooking = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!selectedVendorId) {
      setError('Please select a provider to continue.')
      return
    }

    const activeAddress = initialAddresses.find(a => a.id === selectedAddressId)

    const formData = new FormData(e.currentTarget)
    formData.set('catalogServiceIds', JSON.stringify(serviceIds))
    formData.set('isAsap', isAsap.toString())
    if (activeAddress) {
      formData.set('serviceAddress', `${activeAddress.address_line1}, ${activeAddress.address_line2 || ''}, ${activeAddress.pincode}`)
      formData.set('customerPhone', activeAddress.phone)
      formData.set('customerName', activeAddress.name)
      formData.set('pincode', activeAddress.pincode)
      if (activeAddress.latitude && activeAddress.longitude) {
        formData.set('customerLatitude', activeAddress.latitude.toString())
        formData.set('customerLongitude', activeAddress.longitude.toString())
      }
    }
    formData.set('vendorProfileId', selectedVendorId)

    startTransition(async () => {
      const res = await createBooking(formData)
      if (res.error) {
        setError(res.error)
      } else if (res.bookingId) {
        router.push(`/payment?bookingId=${res.bookingId}`)
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Complete Your Booking</h1>
      <p className="text-slate-500 mb-8">
        {step === 1 ? 'Fill in your details to find available providers.' : 'Select a provider to confirm your booking.'}
      </p>

      {/* Wrapping both steps in a single form so we retain the input values on step 2 submit */}
      <form onSubmit={step === 1 ? handleFindProviders : handleConfirmBooking} className="space-y-6">
        
        <div className={step === 1 ? 'block space-y-6' : 'hidden'}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CalendarCheck className="h-5 w-5 text-indigo-600" /> Schedule</CardTitle>
              <CardDescription>Pick a date and time for the service visit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-1 bg-slate-100 rounded-xl w-full sm:w-fit">
                <button
                  type="button"
                  onClick={() => setIsAsap(true)}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isAsap ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Book for Now (ASAP)
                </button>
                <button
                  type="button"
                  onClick={() => setIsAsap(false)}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    !isAsap ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Schedule for Later
                </button>
              </div>

              {!isAsap && (
                <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label htmlFor="scheduledTime">Select Date & Time</Label>
                  <Input id="scheduledTime" name="scheduledTime" type="datetime-local" className="bg-slate-50 w-full sm:max-w-xs" required={!isAsap} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2"><MapPin className="h-5 w-5 text-indigo-600" /> Select Location</span>
                <Link href="/account" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-3 py-1 rounded-full">
                  <Plus size={16} /> Add New
                </Link>
              </CardTitle>
              <CardDescription>Choose one of your saved addresses for this service.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {initialAddresses.length === 0 ? (
                <div className="p-6 bg-rose-50 text-rose-700 rounded-xl text-center border border-rose-200">
                  <p className="font-semibold mb-2">No Saved Addresses</p>
                  <p className="text-sm mb-4">You must add an address before booking.</p>
                  <Link href="/account" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700">
                    Add Address Now
                  </Link>
                </div>
              ) : (
                <div className="grid gap-3">
                  {initialAddresses.map((addr) => (
                    <div 
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAddressId === addr.id 
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' 
                          : 'border-slate-200 hover:border-indigo-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-slate-900">{addr.name} <span className="text-slate-500 font-normal text-sm ml-2">({addr.phone})</span></p>
                          <p className="text-sm text-slate-600 mt-1">{addr.address_line1}</p>
                          {addr.address_line2 && <p className="text-sm text-slate-600">{addr.address_line2}</p>}
                          <p className="text-sm font-medium text-slate-800 mt-1">Pincode: {addr.pincode}</p>
                        </div>
                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                          selectedAddressId === addr.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                        }`}>
                          {selectedAddressId === addr.id && <div className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {error && step === 1 && (
            <div className="p-4 bg-rose-50 text-rose-700 rounded-xl text-sm border border-rose-200 font-medium">
              {error}
            </div>
          )}
          
          <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-base font-semibold" disabled={isPending}>
            {isPending ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Searching...</>
            ) : 'Find Providers'}
          </Button>
        </div>

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Select a Provider</h3>
              <Button type="button" variant="outline" onClick={() => setStep(1)} size="sm">
                Edit Details
              </Button>
            </div>
            
            {availableVendors.length === 0 ? (
              <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-center space-y-3">
                <div className="text-4xl">📍</div>
                <h4 className="text-lg font-bold text-rose-900">No Providers Found</h4>
                <p className="text-rose-700 text-sm">
                  Our service is not currently offered in your location, or no providers match your exact service requirements. Please try a different pincode.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {availableVendors.map(vendor => (
                <div 
                  key={vendor.id} 
                  className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    selectedVendorId === vendor.id 
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-md' 
                      : 'border-slate-200 hover:border-indigo-300 bg-white hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedVendorId(vendor.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <User className="h-6 w-6 text-slate-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{vendor.businessName}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Star className={`h-4 w-4 ${vendor.rating === 'New' ? 'text-slate-400' : 'text-amber-500 fill-amber-500'}`} />
                        <span className="text-sm font-semibold text-slate-700">{vendor.rating}</span>
                        {vendor.reviewCount > 0 && (
                          <span className="text-xs text-slate-500">({vendor.reviewCount} reviews)</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                    selectedVendorId === vendor.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                  }`}>
                    {selectedVendorId === vendor.id && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
                  </div>
                </div>
              ))}
            </div>
            )}

            {error && step === 2 && (
              <div className="p-4 bg-rose-50 text-rose-700 rounded-xl text-sm border border-rose-200 font-medium">
                {error}
              </div>
            )}

            {availableVendors.length > 0 && (
              <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-base font-semibold" disabled={isPending || !selectedVendorId}>
                {isPending ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Placing Booking...</>
                ) : 'Confirm Booking'}
              </Button>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
