'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useTransition } from "react"
import { updateBookingStatus, updateBookingQuote } from "../actions"

export function OverrideModal({ 
  bookingId, 
  currentStatus, 
  currentQuote 
}: { 
  bookingId: string, 
  currentStatus: string, 
  currentQuote: number | null 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState(currentStatus)
  const [quote, setQuote] = useState<string>(currentQuote ? currentQuote.toString() : '')
  const [isPending, startTransition] = useTransition()

  const handleUpdate = () => {
    startTransition(async () => {
      if (status !== currentStatus) {
        await updateBookingStatus(bookingId, status)
      }
      
      const parsedQuote = parseFloat(quote)
      if (!isNaN(parsedQuote) && parsedQuote !== currentQuote) {
        await updateBookingQuote(bookingId, parsedQuote)
      }
      
      setIsOpen(false)
    })
  }

  const hasChanges = status !== currentStatus || quote !== (currentQuote ? currentQuote.toString() : '')

  return (
    <>
      <Button variant="outline" size="sm" className="h-8 text-xs font-medium" onClick={() => setIsOpen(true)}>Override</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Override Booking Details</DialogTitle>
            <DialogDescription>
              Force update the status or quote of this booking. This should only be used in edge cases.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label>Booking Status</Label>
              <Select value={status} onValueChange={(val) => { if (val) setStatus(val) }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="vendor_assigned">Vendor Assigned</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Final Quoted Price (₹)</Label>
              <Input 
                type="number" 
                value={quote} 
                onChange={(e) => setQuote(e.target.value)} 
                placeholder="e.g. 1500" 
              />
              <p className="text-xs text-slate-500">Overriding the quote will automatically mark it as 'provided' by the vendor.</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={isPending || !hasChanges} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {isPending ? 'Updating...' : 'Save changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
