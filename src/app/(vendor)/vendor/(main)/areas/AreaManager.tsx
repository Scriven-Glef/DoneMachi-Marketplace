'use client'

import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { addPincode, removePincode } from "../../actions"
import { X, MapPin } from "lucide-react"

export function AreaManager({ vendorId, initialAreas }: { vendorId: string, initialAreas: any[] }) {
  const [pincode, setPincode] = useState("")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  const handleAdd = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit Indian pincode.")
      return
    }
    setError("")
    startTransition(async () => {
      await addPincode(vendorId, pincode)
      setPincode("")
    })
  }

  const handleRemove = (id: string) => {
    startTransition(async () => {
      await removePincode(id)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input 
          value={pincode} 
          onChange={(e) => setPincode(e.target.value)} 
          placeholder="Enter 6-digit Pincode (e.g. 600001)" 
          maxLength={6}
          className="max-w-xs"
        />
        <Button onClick={handleAdd} disabled={isPending || !pincode} className="bg-indigo-600 hover:bg-indigo-700">
          <MapPin className="w-4 h-4 mr-2" /> Add Area
        </Button>
      </div>
      {error && <p className="text-sm text-rose-500">{error}</p>}

      <div className="flex flex-wrap gap-3 mt-4">
        {initialAreas.length === 0 ? (
          <p className="text-sm text-slate-500">No service areas added yet.</p>
        ) : (
          initialAreas.map((area) => (
            <div key={area.id} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium border border-indigo-100 shadow-sm">
              {area.pincode}
              <button 
                onClick={() => handleRemove(area.id)}
                disabled={isPending}
                className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
