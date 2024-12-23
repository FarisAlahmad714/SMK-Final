// src/components/admin/AppointmentModal.js
'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function AppointmentModal({ 
  isOpen, 
  onClose, 
  appointment = null, 
  selectedDate = null,
  onSave 
}) {
  const [vehicles, setVehicles] = useState([])
  const [formData, setFormData] = useState({
    vehicleId: appointment?.vehicleId || '',
    customerName: appointment?.customerName || '',
    email: appointment?.email || '',
    phone: appointment?.phone || '',
    date: appointment?.date || selectedDate?.toISOString().split('T')[0] || '',
    time: appointment?.time || '09:00',
    status: appointment?.status || 'PENDING',
    notes: appointment?.notes || ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/vehicles?status=AVAILABLE')
      if (!res.ok) throw new Error('Failed to fetch vehicles')
      const data = await res.json()
      setVehicles(data)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = appointment
        ? `/api/test-drives/${appointment.id}`
        : '/api/test-drives'
      
      const method = appointment ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to save appointment')

      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving appointment:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleDelete = async () => {
    if (!appointment || !window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }
  
    setLoading(true);
    try {
      const res = await fetch(`/api/test-drives/${appointment.id}`, {
        method: 'DELETE',
      });
  
      if (!res.ok) throw new Error('Failed to delete appointment');
  
      onSave(); // This will refresh the calendar
      onClose();
    } catch (error) {
      console.error('Error deleting appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  // Available time slots (9 AM to 5 PM)
  const timeSlots = []
  for (let hour = 9; hour <= 17; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {appointment ? 'Edit Appointment' : 'New Appointment'}
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle
            </label>
            <select
              required
              className="w-full border rounded-md px-3 py-2"
              value={formData.vehicleId}
              onChange={(e) => setFormData(prev => ({ ...prev, vehicleId: e.target.value }))}
            >
              <option value="">Select a vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.year} {vehicle.make} {vehicle.model} - #{vehicle.stockNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                required
                className="w-full border rounded-md px-3 py-2"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full border rounded-md px-3 py-2"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                required
                className="w-full border rounded-md px-3 py-2"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                required
                className="w-full border rounded-md px-3 py-2"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                className="w-full border rounded-md px-3 py-2"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <select
                required
                className="w-full border rounded-md px-3 py-2"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              rows="3"
              className="w-full border rounded-md px-3 py-2"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            ></textarea>
          </div>

          <div className="flex justify-end gap-4 mt-6">
                {appointment && ( // Only show delete button when editing an existing appointment
                    <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
                    disabled={loading}
                    >
                    {loading ? 'Deleting...' : 'Delete'}
                    </button>
                )}
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save Appointment'}
                </button>
                </div>
        </form>
      </div>
    </div>
  )
}