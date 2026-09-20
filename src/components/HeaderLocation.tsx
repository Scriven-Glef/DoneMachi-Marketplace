'use client'

import { useState, useTransition } from 'react'
import { MapPin, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { checkAndSetPincode } from '@/app/(customer)/actions'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPicker } from './MapPicker'

export function HeaderLocation({ initialPincode }: { initialPincode: string | null }) {
  const [isOpen, setIsOpen] = useState(false)
  const [pincode, setPincode] = useState(initialPincode || '')
  const [displayPincode, setDisplayPincode] = useState(initialPincode)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [mapLocation, setMapLocation] = useState<{lat: number, lng: number} | null>(null)
  const [isGeocoding, setIsGeocoding] = useState(false)

  const validateAndSetPincode = (code: string) => {
    setError(null)
    const cleanCode = code.trim()
    if (!cleanCode || cleanCode.length < 5) {
      setError('Please enter a valid pincode.')
      return
    }

    startTransition(async () => {
      const res = await checkAndSetPincode(cleanCode)
      if (res.error) {
        setError(res.error)
      } else {
        setDisplayPincode(cleanCode)
        setIsOpen(false)
      }
    })
  }

  const handleUpdate = () => {
    validateAndSetPincode(pincode)
  }

  const handleMapConfirm = () => {
    if (!mapLocation) return;
    
    setIsGeocoding(true)
    setError(null)
    
    // Reverse geocode
    const geocoder = new (window as any).google.maps.Geocoder();
    geocoder.geocode({ location: mapLocation }, (results: any, status: string) => {
      setIsGeocoding(false)
      if (status === 'OK' && results && results[0]) {
        // Find postal code
        const postalCodeComponent = results[0].address_components.find((c: any) => c.types.includes('postal_code'));
        if (postalCodeComponent) {
          const foundPincode = postalCodeComponent.long_name;
          setPincode(foundPincode)
          validateAndSetPincode(foundPincode)
        } else {
          setError("Could not extract a pincode from this location. Please try entering it manually.")
        }
      } else {
        setError("Failed to geocode location. Please try manually.")
      }
    });
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100">
        <MapPin size={16} className="text-indigo-500" />
        {displayPincode ? displayPincode : 'Set Location'}
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0 overflow-hidden" align="end">
        <div className="bg-slate-50 p-4 border-b border-slate-100">
          <h4 className="font-semibold text-slate-900 mb-1">Service Location</h4>
          <p className="text-xs text-slate-500">Check if we operate in your area.</p>
        </div>
        
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="w-full grid grid-cols-2 rounded-none bg-transparent border-b h-12">
            <TabsTrigger value="manual" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none">Enter Pincode</TabsTrigger>
            <TabsTrigger value="map" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none">Pin on Map</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="p-4 space-y-4 m-0">
            <div className="flex gap-2">
              <Input 
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. 600017"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUpdate()
                }}
              />
              <Button onClick={handleUpdate} disabled={isPending} size="icon" className="bg-indigo-600 hover:bg-indigo-700 shrink-0">
                <Search size={16} />
              </Button>
            </div>
            {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
          </TabsContent>
          
          <TabsContent value="map" className="p-4 m-0 space-y-4">
            <MapPicker onLocationSelect={(lat, lng) => setMapLocation({lat, lng})} />
            
            <Button 
              onClick={handleMapConfirm} 
              disabled={isPending || isGeocoding || !mapLocation} 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {isGeocoding ? 'Detecting...' : isPending ? 'Validating...' : 'Use This Location'}
            </Button>
            
            {error && <p className="text-xs text-rose-500 font-medium text-center">{error}</p>}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
