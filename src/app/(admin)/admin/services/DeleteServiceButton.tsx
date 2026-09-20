'use client'

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useTransition } from "react"
import { deleteMasterService } from "../actions"

export function DeleteServiceButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
      disabled={isPending}
      onClick={() => startTransition(async () => { await deleteMasterService(id) })}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
