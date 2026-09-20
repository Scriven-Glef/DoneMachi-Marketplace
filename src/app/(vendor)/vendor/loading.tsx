import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function VendorLoading() {
  return (
    <div className="space-y-6 max-w-5xl animate-pulse">
      <div className="flex items-center gap-4">
        <div>
          <div className="h-8 w-48 bg-slate-200 rounded-md mb-2"></div>
          <div className="h-4 w-64 bg-slate-200 rounded-md"></div>
        </div>
        <Loader2 className="h-6 w-6 text-slate-400 animate-spin ml-auto" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card><CardContent className="h-24 bg-slate-100"></CardContent></Card>
        <Card><CardContent className="h-24 bg-slate-100"></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="h-6 w-48 bg-slate-200 rounded-md mb-4"></div>
          <div className="h-24 w-full bg-slate-50 rounded-xl border border-slate-100"></div>
          <div className="h-24 w-full bg-slate-50 rounded-xl border border-slate-100"></div>
          <div className="h-24 w-full bg-slate-50 rounded-xl border border-slate-100"></div>
        </CardContent>
      </Card>
    </div>
  )
}
