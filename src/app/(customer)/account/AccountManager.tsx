'use client'

import { useState } from 'react'
import { MapPin, User, Phone, Pencil, Trash2 } from 'lucide-react'
import { AddressForm } from './AddressForm'
import { deleteCustomerAddress } from '../actions'

export function AccountManager({ initialAddresses }: { initialAddresses: any[] }) {
  const [editingAddress, setEditingAddress] = useState<any | null>(null)
  
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      await deleteCustomerAddress(id)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Saved Addresses List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Saved Addresses ({initialAddresses.length})</h2>
          {editingAddress && (
            <button 
              onClick={() => setEditingAddress(null)}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              + Add New
            </button>
          )}
        </div>
        
        {initialAddresses.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-slate-500 shadow-sm">
            You haven't saved any addresses yet. Add one to checkout faster!
          </div>
        ) : (
          <div className="space-y-4">
            {initialAddresses.map(addr => (
              <div key={addr.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm group">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="font-semibold text-slate-900">{addr.name}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600">{addr.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                      <div className="text-sm text-slate-600">
                        <p>{addr.address_line1}</p>
                        {addr.address_line2 && <p>{addr.address_line2}</p>}
                        <p className="font-medium text-slate-800 mt-1">Pincode: {addr.pincode}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditingAddress(addr)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(addr.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Section */}
      <div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h2>
          <AddressForm 
            initialData={editingAddress} 
            onCancel={editingAddress ? () => setEditingAddress(null) : undefined}
          />
        </div>
      </div>
    </div>
  )
}
