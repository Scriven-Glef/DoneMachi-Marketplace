'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { saveCustomerAddress, updateCustomerAddress } from '../actions'
import { MapPicker } from '@/components/MapPicker'

export function AddressForm({ initialData, onCancel }: { initialData?: any, onCancel?: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    initialData?.latitude && initialData?.longitude 
      ? { lat: initialData.latitude, lng: initialData.longitude }
      : null
  )
  const formRef = useRef<HTMLFormElement>(null)

  // Reset form when initialData changes (e.g. switching between Add and Edit)
  useEffect(() => {
    setError(null)
    setSuccess(false)
    if (initialData?.latitude && initialData?.longitude) {
      setLocation({ lat: initialData.latitude, lng: initialData.longitude })
    } else {
      setLocation(null)
    }
    if (formRef.current) formRef.current.reset()
  }, [initialData])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!location) {
      setError("Please pin your location on the map.")
      return
    }

    const formData = new FormData(e.currentTarget)
    formData.set('latitude', location.lat.toString())
    formData.set('longitude', location.lng.toString())
    if (initialData?.id) {
      formData.set('id', initialData.id)
    }
    
    startTransition(async () => {
      const res = initialData?.id 
        ? await updateCustomerAddress(formData)
        : await saveCustomerAddress(formData)
        
      if (res.error) {
        setError(res.error)
      } else {
        setSuccess(true)
        if (!initialData?.id) {
          if (formRef.current) formRef.current.reset()
          setLocation(null)
        } else if (onCancel) {
          onCancel() // close edit mode
        }
      }
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-lg border border-rose-200">
          {error}
        </div>
      )}
      
      {success && !initialData?.id && (
        <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-200">
          Address saved successfully!
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="name">Contact Name</Label>
        <Input id="name" name="name" defaultValue={initialData?.name || ''} placeholder="John Doe" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" name="phone" defaultValue={initialData?.phone || ''} placeholder="9876543210" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="addressLine1">Address Line 1 / Flat No.</Label>
        <Input id="addressLine1" name="addressLine1" defaultValue={initialData?.address_line1 || ''} placeholder="Flat 4B, Blue Towers" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="addressLine2">Address Line 2 / Landmark (Optional)</Label>
        <Input id="addressLine2" name="addressLine2" defaultValue={initialData?.address_line2 || ''} placeholder="Near Central Park" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="pincode">Pincode</Label>
        <Input id="pincode" name="pincode" defaultValue={initialData?.pincode || ''} placeholder="600017" required className="w-full sm:max-w-xs" />
      </div>

      <div className="grid gap-2 pt-2">
        <Label>Pin your Exact Location</Label>
        <MapPicker 
          onLocationSelect={(lat, lng) => setLocation({ lat, lng })} 
          initialPincode={initialData?.pincode}
        />
        <p className="text-xs text-slate-500">This helps technicians navigate directly to your door.</p>
      </div>

      <div className="flex gap-2 mt-2">
        {initialData?.id && onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="w-full">
            Cancel
          </Button>
        )}
        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isPending}>
          {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (initialData?.id ? 'Update Address' : 'Save Address')}
        </Button>
      </div>
    </form>
  )
}
