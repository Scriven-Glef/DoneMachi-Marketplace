import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function AdminLoading() {
  return (
    <div className="space-y-6 max-w-7xl animate-pulse">
      <div className="flex items-center gap-4">
        <div>
          <div className="h-8 w-64 bg-slate-200 rounded-md mb-2"></div>
          <div className="h-4 w-96 bg-slate-200 rounded-md"></div>
        </div>
        <Loader2 className="h-6 w-6 text-slate-400 animate-spin ml-auto" />
      </div>

      <div className="border rounded-xl bg-white shadow-sm overflow-hidden p-6">
        <div className="space-y-4">
          <div className="h-10 w-full bg-slate-100 rounded-md"></div>
          <div className="h-16 w-full bg-slate-50 rounded-md"></div>
          <div className="h-16 w-full bg-slate-50 rounded-md"></div>
          <div className="h-16 w-full bg-slate-50 rounded-md"></div>
        </div>
      </div>
    </div>
  )
}
