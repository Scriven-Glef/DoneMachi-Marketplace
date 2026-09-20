'use client'

import { Button } from "@/components/ui/button"
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
import { updateBookingStatus } from "../actions"

export function OverrideModal({ bookingId, currentStatus }: { bookingId: string, currentStatus: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState(currentStatus)
  const [isPending, startTransition] = useTransition()

  const handleUpdate = () => {
    startTransition(async () => {
      await updateBookingStatus(bookingId, status)
      setIsOpen(false)
    })
  }

  return (
    <>
      <Button variant="outline" size="sm" className="h-8 text-xs font-medium" onClick={() => setIsOpen(true)}>Override</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Override Booking Status</DialogTitle>
            <DialogDescription>
              Force update the status of this booking. This should only be used in edge cases.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={isPending || status === currentStatus} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {isPending ? 'Updating...' : 'Save changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
