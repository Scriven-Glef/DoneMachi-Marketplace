'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Info } from 'lucide-react'

export function CategoryClient({ groupedCatalog, categorySlug }: { groupedCatalog: any, categorySlug: string }) {
  const router = useRouter()
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [selectedServices, setSelectedServices] = useState<Record<string, any>>({})

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }))
  }

  const toggleService = (service: any) => {
    setSelectedServices(prev => {
      const next = { ...prev }
      if (next[service.id]) {
        delete next[service.id]
      } else {
        next[service.id] = service
      }
      return next
    })
  }

  const selectedList = Object.values(selectedServices)
  const inspectionFee = 150

  const handleProceed = () => {
    // Pass IDs via query params or a global store. For quick commerce, URL params work for a few IDs.
    const ids = selectedList.map(s => s.id).join(',')
    router.push(`/checkout?services=${ids}`)
  }

  return (
    <>
      <div className="space-y-4 mb-32">
        {/* Default Inspection Service */}
        <Card className="border-indigo-200 bg-indigo-50/50 shadow-sm overflow-visible">
          <div className="p-4 flex items-start gap-4">
            <div className="flex h-7 items-center">
              <Checkbox checked={true} disabled className="h-5 w-5 bg-indigo-600 border-indigo-600 opacity-100" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 h-7">
                <h4 className="font-bold text-lg text-indigo-950 leading-7">Expert Inspection</h4>
                <div className="relative group flex items-center">
                  <Info className="h-4 w-4 text-indigo-500 cursor-pointer" />
                  <div className="absolute -left-4 sm:left-1/2 sm:-translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] shadow-xl">
                    Our verified technician will diagnose the issue and provide a final repair quote. Minor issues that take less than 15 minutes are solved within this inspection fee!
                    <div className="absolute left-6 sm:left-1/2 sm:-translate-x-1/2 top-full border-4 border-transparent border-t-slate-900"></div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-indigo-700 leading-normal">Mandatory diagnostic visit</p>
            </div>
            <div className="text-right flex flex-col justify-start h-full pt-1">
              <span className="text-xs text-indigo-600 font-semibold block uppercase tracking-wider leading-none mb-1">Fee</span>
              <span className="font-extrabold text-indigo-900 text-xl leading-none">₹{inspectionFee}</span>
            </div>
          </div>
        </Card>
        {Object.entries(groupedCatalog).map(([groupName, services]: any) => {
          const isExpanded = expandedGroups[groupName]
          const groupSelectedCount = services.filter((s: any) => selectedServices[s.id]).length

          return (
            <Card key={groupName} className="overflow-hidden border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-indigo-200 group">
              <div 
                className="p-5 flex items-center justify-between cursor-pointer bg-white group-hover:bg-indigo-50/30 transition-colors"
                onClick={() => toggleGroup(groupName)}
              >
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg text-slate-900">{groupName}</h3>
                  {groupSelectedCount > 0 && (
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
                      {groupSelectedCount} selected
                    </span>
                  )}
                </div>
                {isExpanded ? <ChevronUp className="text-indigo-500" /> : <ChevronDown className="text-slate-400 group-hover:text-indigo-400" />}
              </div>
              
              {isExpanded && (
                <CardContent className="p-0 border-t border-slate-100 bg-slate-50/50">
                  <div className="divide-y divide-slate-100">
                    {services.map((service: any) => {
                      const isSelected = !!selectedServices[service.id]
                      return (
                        <div 
                          key={service.id} 
                          className={`p-4 flex items-center gap-4 cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
                          onClick={() => toggleService(service)}
                        >
                          <Checkbox 
                            checked={isSelected} 
                            onCheckedChange={() => toggleService(service)} 
                            className="h-5 w-5 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                          />
                          <div className="flex-1">
                            <h4 className={`font-semibold ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                              {service.service_name}
                            </h4>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-slate-500 block">Est. Repair</span>
                            <span className="font-bold text-slate-900">₹{service.base_price}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-bottom-full duration-300">
        <div className="max-w-3xl mx-auto flex flex-row items-center justify-between gap-2">
          <div className="flex gap-3 sm:gap-6 items-center shrink-0">
            <div className="flex flex-col">
              <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider leading-tight">Pay Now</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-none">₹{inspectionFee}</span>
              </div>
            </div>
            
            {selectedList.length > 0 && (
              <>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="flex flex-col">
                  <p className="text-[10px] sm:text-xs font-semibold text-indigo-500 uppercase tracking-wider leading-tight">Likely Total</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg sm:text-2xl font-bold text-indigo-700 leading-none">
                      ~₹{selectedList.reduce((sum, s) => sum + s.base_price, 0) + inspectionFee}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <Button 
            size="lg" 
            onClick={handleProceed}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 sm:h-14 px-4 sm:px-8 text-sm sm:text-lg shadow-lg shadow-indigo-200 whitespace-nowrap"
          >
            <span className="hidden sm:inline">Proceed to Schedule</span>
            <span className="sm:hidden">Next Step</span>
          </Button>
        </div>
      </div>
    </>
  )
}
