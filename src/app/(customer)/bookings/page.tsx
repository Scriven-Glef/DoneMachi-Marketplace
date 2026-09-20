import { Suspense } from 'react'
import { getCustomerBookings } from '../actions'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarCheck, MapPin, Clock } from 'lucide-react'

const STATUSES = ['pending', 'vendor_assigned', 'in_transit', 'completed']
const STATUS_LABELS: Record<string, string> = {
  pending: 'Booked',
  vendor_assigned: 'Vendor Assigned',
  in_transit: 'In Transit',
  completed: 'Completed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

function BookingTimeline({ currentStatus }: { currentStatus: string }) {
  const isCancelled = currentStatus === 'cancelled' || currentStatus === 'refunded'
  const currentIndex = STATUSES.indexOf(currentStatus)

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 mt-3">
        <div className="h-3 w-3 rounded-full bg-rose-500" />
        <span className="text-sm font-medium text-rose-600">{STATUS_LABELS[currentStatus]}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 mt-4">
      {STATUSES.map((status, index) => {
        const isActive = index <= currentIndex
        const isCurrent = index === currentIndex
        return (
          <div key={status} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <div
                className={`h-3.5 w-3.5 rounded-full border-2 transition-all duration-300 ${
                  isCurrent
                    ? 'bg-indigo-600 border-indigo-600 ring-4 ring-indigo-100'
                    : isActive
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'bg-white border-slate-300'
                }`}
              />
              <span className={`text-[10px] mt-1 font-medium whitespace-nowrap ${
                isActive ? 'text-slate-700' : 'text-slate-400'
              }`}>
                {STATUS_LABELS[status]}
              </span>
            </div>
            {index < STATUSES.length - 1 && (
              <div className={`h-0.5 w-8 sm:w-12 mb-4 transition-colors duration-300 ${
                index < currentIndex ? 'bg-emerald-500' : 'bg-slate-200'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-5">
      {[1, 2].map(i => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6 h-36 bg-slate-50"></CardContent>
        </Card>
      ))}
    </div>
  )
}

async function BookingsList() {
  const bookings = await getCustomerBookings()

  if (bookings.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-xl">
        <CalendarCheck className="mx-auto h-14 w-14 text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-500">No bookings yet</h3>
        <p className="text-slate-400 mt-1">Once you book a service, it will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {bookings.map((booking: any) => (
        <Card key={booking.id} className="hover:shadow-md transition-shadow overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">
                  {booking.services && booking.services.length > 0 
                    ? booking.services.map((s: any) => s.service_name).join(', ')
                    : 'Service Request'}
                </h3>
                <p className="text-sm text-slate-500">
                  {booking.services && booking.services.length > 0 ? booking.services[0].category : 'Various'}
                </p>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-2">
                  <MapPin size={14} /> {booking.service_address}
                </div>
                <p className="text-sm text-slate-400">
                  Vendor: <span className="font-medium text-slate-600">{booking.vendor?.name || 'Pending Assignment'}</span>
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm text-slate-500">
                  {new Date(booking.scheduled_time).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date(booking.scheduled_time).toLocaleTimeString('en-IN', {
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
                {booking.services && booking.services.length > 0 && (
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    ₹{booking.services.reduce((sum: number, s: any) => sum + s.base_price, 0)}
                  </p>
                )}
              </div>
            </div>
            
            {booking.estimated_logistics_time_mins && (
              <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 inline-flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold text-amber-700">
                  ETA: ~{booking.estimated_logistics_time_mins} mins
                </span>
              </div>
            )}
            
            <BookingTimeline currentStatus={booking.status} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function CustomerBookingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">My Bookings</h1>
      <p className="text-slate-500 mb-8">Track your active and past service requests.</p>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <BookingsList />
      </Suspense>
    </div>
  )
}
