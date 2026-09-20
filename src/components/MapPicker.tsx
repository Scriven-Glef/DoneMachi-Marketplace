'use client'

import { useState, useCallback, useEffect } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import { MapPin } from 'lucide-react'

// Default to Chennai, India
const DEFAULT_CENTER = {
  lat: 13.0827,
  lng: 80.2707
}

const mapContainerStyle = {
  width: '100%',
  height: '256px',
  borderRadius: '0.75rem' // rounded-xl
}

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false
}

export function MapPicker({ onLocationSelect, initialPincode }: { onLocationSelect: (lat: number, lng: number) => void, initialPincode?: string }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  })

  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null)
  const [center, setCenter] = useState(DEFAULT_CENTER)

  useEffect(() => {
    if (isLoaded && initialPincode && window.google) {
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ address: `${initialPincode}, India` }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const loc = results[0].geometry.location
          setCenter({ lat: loc.lat(), lng: loc.lng() })
        }
      })
    }
  }, [isLoaded, initialPincode])

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      setPin({ lat, lng })
      onLocationSelect(lat, lng)
    }
  }, [onLocationSelect])

  if (loadError) {
    return (
      <div className="w-full h-64 bg-rose-50 flex items-center justify-center rounded-xl border border-rose-200">
        <p className="text-rose-600 font-medium text-sm">Failed to load Google Maps. Please check your API key.</p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-64 bg-slate-100 animate-pulse flex items-center justify-center rounded-xl">
        <MapPin className="text-slate-300 w-8 h-8 animate-bounce" />
      </div>
    )
  }

  return (
    <div className="relative space-y-2 border-2 border-slate-200 rounded-xl overflow-hidden hover:border-indigo-400 transition-colors shadow-sm">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={center}
        options={mapOptions}
        onClick={handleMapClick}
      >
        {pin && (
          <Marker 
            position={pin} 
            animation={google.maps.Animation.DROP}
          />
        )}
      </GoogleMap>
      
      {!pin && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium pointer-events-none shadow-lg">
          Click on the map to pin your location
        </div>
      )}
    </div>
  )
}
