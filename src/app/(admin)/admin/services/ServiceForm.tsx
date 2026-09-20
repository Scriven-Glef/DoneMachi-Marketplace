'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTransition, useRef } from "react"
import { createMasterService } from "../actions"
import { PlusCircle } from "lucide-react"

export function ServiceForm() {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await createMasterService(formData)
      formRef.current?.reset()
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex gap-4 items-end bg-white p-6 rounded-xl border shadow-sm mt-6">
      <div className="grid gap-2 flex-1">
        <Label htmlFor="category" className="text-slate-600">Category</Label>
        <Input id="category" name="category" placeholder="e.g. Plumbing" required className="bg-slate-50" />
      </div>
      <div className="grid gap-2 flex-[1.5]">
        <Label htmlFor="name" className="text-slate-600">Service Name</Label>
        <Input id="name" name="name" placeholder="e.g. Leak Repair" required className="bg-slate-50" />
      </div>
      <div className="grid gap-2 flex-[2]">
        <Label htmlFor="description" className="text-slate-600">Description</Label>
        <Input id="description" name="description" placeholder="Brief description..." className="bg-slate-50" />
      </div>
      <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 h-10 px-6">
        <PlusCircle className="mr-2 h-4 w-4" /> Add Service
      </Button>
    </form>
  )
}
