'use client'

import { useState, useTransition } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { MapPicker } from '@/components/MapPicker'
import { createBooking, checkAndSetPincode, getAvailableVendors } from '../actions'
import { CalendarCheck, MapPin, CheckCircle, Clock, Star, User, Loader2 } from 'lucide-react'

export function CheckoutForm({ initialPincode }: { initialPincode?: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  // Now we get a comma-separated list of catalog service IDs
  const servicesParam = searchParams.get('services') || ''
  const serviceIds = servicesParam.split(',').filter(Boolean)

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<{ eta: number | null } | null>(null)
  
  // Step 1 State
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
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

    if (!initialPincode) {
      setError('Please set your location in the top header first.')
      return
    }

    startTransition(async () => {
      // 1. Validate the pincode against active vendors generally
      const validRes = await checkAndSetPincode(initialPincode)
      if (validRes.error) {
        setError(validRes.error)
        return
      }

      // 2. Fetch specific vendors matching this exact service combination
      const vendors = await getAvailableVendors(initialPincode, serviceIds)

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

    const formData = new FormData(e.currentTarget)
    formData.set('catalogServiceIds', JSON.stringify(serviceIds))
    formData.set('isAsap', isAsap.toString())
    if (location) {
      formData.set('latitude', location.lat.toString())
      formData.set('longitude', location.lng.toString())
    }
    formData.set('vendorProfileId', selectedVendorId)

    startTransition(async () => {
      const res = await createBooking(formData)
      if (res.error) {
        setError(res.error)
      } else {
        setSuccessData({ eta: res.estimatedLogisticsTimeMins || null })
      }
    })
  }

  if (successData) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <div className="mx-auto h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6 animate-pulse">
          <CheckCircle className="h-10 w-10 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Booking Confirmed!</h2>
        <p className="text-slate-500 mt-4">Your service request has been submitted directly to your chosen provider.</p>
        
        {isAsap && successData.eta !== null && (
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 inline-flex items-center gap-3">
            <Clock className="text-amber-500 h-6 w-6" />
            <div className="text-left">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Live Traffic ETA</p>
              <p className="text-lg font-bold text-amber-900">Expected Arrival: ~{successData.eta} mins</p>
            </div>
          </div>
        )}

        <div className="mt-8">
          <Button onClick={() => router.push('/bookings')} className="bg-indigo-600 hover:bg-indigo-700">
            View My Bookings
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Complete Your Booking</h1>
      <p className="text-slate-500 mb-8">
        {step === 1 ? 'Fill in your details to find available providers.' : 'Select a provider to confirm your booking.'}
      </p>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm border border-rose-200">
          {error}
        </div>
      )}

      {/* Wrapping both steps in a single form so we retain the input values on step 2 submit */}
      <form onSubmit={step === 1 ? handleFindProviders : handleConfirmBooking} className="space-y-6">
        
        <div className={step === 1 ? 'block space-y-6' : 'hidden'}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CalendarCheck className="h-5 w-5 text-indigo-600" /> Schedule</CardTitle>
              <CardDescription>Pick a date and time for the service visit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4 p-1 bg-slate-100 rounded-xl w-fit">
                <button
                  type="button"
                  onClick={() => setIsAsap(true)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isAsap ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Book for Now (ASAP)
                </button>
                <button
                  type="button"
                  onClick={() => setIsAsap(false)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
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
              <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-indigo-600" /> Confirm your exact location</CardTitle>
              <CardDescription>Provide your street address and drop a map pin for your technician.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="serviceAddress">Full Address / Flat No.</Label>
                <Input id="serviceAddress" name="serviceAddress" placeholder="e.g., Flat 4B, 12th Cross Street..." required={step === 1} className="bg-slate-50" />
              </div>
              
              <MapPicker initialPincode={initialPincode} onLocationSelect={(lat, lng) => setLocation({ lat, lng })} />
              {location && (
                <p className="text-xs text-slate-500">
                  📍 Location pinned: {location.lat}, {location.lng}
                </p>
              )}
            </CardContent>
          </Card>

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
