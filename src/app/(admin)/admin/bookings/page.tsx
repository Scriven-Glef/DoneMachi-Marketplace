export const dynamic = 'force-dynamic';

import { getAllBookings } from "../actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { OverrideModal } from "./OverrideModal";

export default async function BookingsPage() {
  const bookings = await getAllBookings();

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Command Center</h2>
        <p className="text-slate-500 mt-2">
          Overview of all marketplace transactions and active bookings.
        </p>
      </div>

      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Scheduled Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking: any) => (
                <TableRow key={booking.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium">
                    {booking.services && booking.services.length > 0
                      ? booking.services.map((s: any) => s.service_name).join(', ')
                      : 'Unknown Service'}
                  </TableCell>
                  <TableCell>
                    {booking.customer?.name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {booking.vendor?.name || 'Unassigned'}
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {new Date(booking.scheduled_time).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <OverrideModal bookingId={booking.id} currentStatus={booking.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
