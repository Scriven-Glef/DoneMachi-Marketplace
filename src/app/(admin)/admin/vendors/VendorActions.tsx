'use client'

import { Button } from "@/components/ui/button"
import { updateVendorStatus } from "../actions"
import { useTransition } from "react"
import { CheckCircle, XCircle } from "lucide-react"

export function VendorActions({ vendorId }: { vendorId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (status: 'approved' | 'rejected') => {
    startTransition(async () => {
      await updateVendorStatus(vendorId, status);
    });
  }

  return (
    <div className="flex gap-2 justify-end">
      <Button 
        size="sm" 
        variant="default"
        className="bg-emerald-600 hover:bg-emerald-700 h-8"
        onClick={() => handleUpdate('approved')}
        disabled={isPending}
      >
        <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Approve
      </Button>
      <Button 
        size="sm" 
        variant="destructive"
        className="h-8"
        onClick={() => handleUpdate('rejected')}
        disabled={isPending}
      >
        <XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject
      </Button>
    </div>
  )
}
