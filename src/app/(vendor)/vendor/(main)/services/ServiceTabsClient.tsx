'use client'

import { useState, useTransition } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { batchUpdateVendorServices } from "../../actions"
import { Droplets, Wind, Zap, CheckCircle2, Save } from "lucide-react"

export function ServiceTabsClient({ 
  vendorId, 
  groupedCatalog, 
  vendorServices 
}: { 
  vendorId: string, 
  groupedCatalog: any, 
  vendorServices: any[] 
}) {
  const categories = Object.keys(groupedCatalog)
  const defaultTab = categories.includes('Plumbing') ? 'Plumbing' : categories[0]

  // Track all selected IDs in a Set for easy lookup and mutation
  const initialSelected = new Set<string>(vendorServices.map(vs => vs.catalog_service_id))
  const [selectedIds, setSelectedIds] = useState<Set<string>>(initialSelected)
  
  const [isPending, startTransition] = useTransition()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleToggleSingle = (id: string, checked: boolean) => {
    setShowSuccess(false)
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const handleSelectGroup = (services: any[], selectAll: boolean) => {
    setShowSuccess(false)
    const newSelected = new Set(selectedIds)
    services.forEach(service => {
      if (selectAll) {
        newSelected.add(service.id)
      } else {
        newSelected.delete(service.id)
      }
    })
    setSelectedIds(newSelected)
  }

  const handleSave = () => {
    setShowSuccess(false)
    startTransition(async () => {
      const result = await batchUpdateVendorServices(vendorId, Array.from(selectedIds))
      if (result.success) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    })
  }

  return (
    <div className="relative">
      {/* Sticky Header with Save Button */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 mb-6 -mx-4 sm:mx-0 sm:rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">My Services</h2>
          <p className="text-sm text-slate-500">Select the services you are qualified to fulfill.</p>
        </div>
        <div className="flex items-center gap-3">
          {showSuccess && (
            <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Saved successfully!
            </span>
          )}
          <Button 
            onClick={handleSave}
            disabled={isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
          >
            <Save className="w-4 h-4 mr-2" />
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto gap-2 bg-slate-100 p-2 rounded-xl">
          {categories.map(category => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm rounded-lg py-3 text-base font-semibold transition-all"
            >
              {category === 'Plumbing' && <Droplets className="w-4 h-4 mr-2" />}
              {category === 'AC Repair & Service' && <Wind className="w-4 h-4 mr-2" />}
              {category === 'Electrical' && <Zap className="w-4 h-4 mr-2" />}
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="mt-6 space-y-6">
            {Object.entries(groupedCatalog[category] as Record<string, any[]>).map(([problemGroup, services]) => {
              // Check if all items in this group are selected
              const allSelected = services.every(s => selectedIds.has(s.id))
              
              return (
                <Card key={problemGroup} className="border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{problemGroup}</h3>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`group-${problemGroup.replace(/\s+/g, '-')}`} className="text-xs font-medium text-slate-500 cursor-pointer">
                        {allSelected ? 'Deselect All' : 'Select All'}
                      </Label>
                      <Checkbox 
                        id={`group-${problemGroup.replace(/\s+/g, '-')}`}
                        checked={allSelected}
                        onCheckedChange={(checked) => handleSelectGroup(services, !!checked)}
                        className="data-[state=checked]:bg-indigo-600"
                      />
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {services.map(service => {
                        const isSelected = selectedIds.has(service.id)
                        return (
                          <div key={service.id} className={`flex items-center justify-between p-4 transition-colors hover:bg-slate-50 ${isSelected ? 'bg-indigo-50/30' : ''}`}>
                            <div className="flex items-center gap-4 flex-1">
                              <Checkbox 
                                id={service.id} 
                                checked={isSelected}
                                onCheckedChange={(checked) => handleToggleSingle(service.id, !!checked)}
                                className="h-5 w-5 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                              />
                              <div>
                                <label htmlFor={service.id} className={`font-semibold cursor-pointer ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                                  {service.service_name}
                                </label>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-slate-500 block">Base Price</span>
                              <span className="font-bold text-slate-900">₹{service.base_price}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
