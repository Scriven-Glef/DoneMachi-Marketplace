'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTransition, useRef } from "react"
import { createCatalogService } from "../actions"
import { PlusCircle } from "lucide-react"

export function ServiceForm() {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await createCatalogService(formData)
      formRef.current?.reset()
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end bg-white p-6 rounded-xl border shadow-sm mt-6">
      <div className="grid gap-2 flex-1 min-w-[200px]">
        <Label htmlFor="category" className="text-slate-600">Category</Label>
        <Input id="category" name="category" placeholder="e.g. Plumbing" required className="bg-slate-50" />
      </div>
      <div className="grid gap-2 flex-1 min-w-[200px]">
        <Label htmlFor="problem_group" className="text-slate-600">Problem Group</Label>
        <Input id="problem_group" name="problem_group" placeholder="e.g. Toilet Issues" required className="bg-slate-50" />
      </div>
      <div className="grid gap-2 flex-[1.5] min-w-[250px]">
        <Label htmlFor="service_name" className="text-slate-600">Service Name</Label>
        <Input id="service_name" name="service_name" placeholder="e.g. Fix Clogged Toilet" required className="bg-slate-50" />
      </div>
      <div className="grid gap-2 w-32 shrink-0">
        <Label htmlFor="base_price" className="text-slate-600">Base Price (₹)</Label>
        <Input id="base_price" name="base_price" type="number" placeholder="0" required className="bg-slate-50" />
      </div>
      <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 h-10 px-6 shrink-0">
        <PlusCircle className="mr-2 h-4 w-4" /> Add Service
      </Button>
    </form>
  )
}
